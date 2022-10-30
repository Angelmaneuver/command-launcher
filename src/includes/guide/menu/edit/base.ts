import { QuickPickItem }         from 'vscode';
import {
	InputStep,
	MultiStepInput,
}                                from '../../../utils/multiStepInput';
import { Guide }                 from '../../base/abc';
import { State }                 from '../../base/base';
import { AbstractEditMenuGuide } from './abc';
import { BaseValidator }         from '../../validator/base';
import { Optional }              from '../../../utils/base/optional';
import { VSCodePreset }          from '../../../utils/base/vscodePreset';
import * as Constant             from '../../../constant';

const items = {
	add:         VSCodePreset.create(VSCodePreset.icons.add,                 'Add',         'Add a command.'),
	terminal:    VSCodePreset.create(VSCodePreset.icons.terminal,            'Terminal',    'Add a terminal command.'),
	create:      VSCodePreset.create(VSCodePreset.icons.fileDirectoryCreate, 'Create',      'Create a folder.'),
	setting:     VSCodePreset.create(VSCodePreset.icons.settingsGear,        'Setting',     'Set the parameters for this extension.'),
	name:        VSCodePreset.create(VSCodePreset.icons.fileText,            'Name',        'Set the item name.'),
	label:       VSCodePreset.create(VSCodePreset.icons.tag,                 'Label',       'Set the item label.'),
	description: VSCodePreset.create(VSCodePreset.icons.note,                'Description', 'Set the command description.'),
	command:     VSCodePreset.create(VSCodePreset.icons.terminalPowershell,  'Command',     'Set the execute command.'),
	order:       VSCodePreset.create(VSCodePreset.icons.listOrdered,         'Order',       'Set the sort order.'),
	question:    VSCodePreset.create(VSCodePreset.icons.question,            'Question',    'Set the question.'),
	autoRun:     VSCodePreset.create(VSCodePreset.icons.run,                 'Auto Run',    'Set the run automaticaly or not.'),
	delimiter:   { label: '-'.repeat(35) + ' Registered commands ' + '-'.repeat(35) } as QuickPickItem,
};

export class EditMenuGuide extends AbstractEditMenuGuide {
	protected deleteConfirmText = 'Do you want to delete this item?';

	public async show(input: MultiStepInput):Promise<void | InputStep> {
		this.setMenuItems();

		do {
			await super.show(input);
		} while (items.delimiter === this.inputPick);
	}

	protected getExecute(label: string | undefined): (() => Promise<void>) | undefined {
		this.initialValue    = undefined;

		this.state.hierarchy = this.hierarchy;

		switch (label) {
			case items.setting.label:
				return async () => {
					this.setNextSteps([{
						key:   'SelectSettingGuide',
						state: this.createBaseState(` - Setting`, 'setting'),
					}]);
				};
			case items.add.label:
			case items.terminal.label:
			case items.create.label:
				return this.setGuidance(label);
			case items.name.label:
			case items.label.label:
			case items.description.label:
			case items.command.label:
			case items.order.label:
			case items.question.label:
			case items.autoRun.label:
				return this.setSettingGuide(label);
			default:
				return super.getExecute(label);
		}
	}

	private setMenuItems(): void {
		this.items         = [];
		const settingItems = [items.name, items.label, items.description];
		const terminal     = Constant.DATA_TYPE.terminalCommand === this.type ? [items.question, items.autoRun] : [];
		const save         = [];
		const returnOrBack = [];

		if (Object.keys(this.guideGroupResultSet).length > 0) {
			save.push(AbstractEditMenuGuide.items.save);
			returnOrBack.push(AbstractEditMenuGuide.items.return);
		} else {
			returnOrBack.push(AbstractEditMenuGuide.items.back);
		}

		if (Constant.DATA_TYPE.folder === this.type) {
			this.setFolderCommands([...settingItems, items.order, AbstractEditMenuGuide.items.delete, ...save], returnOrBack);
		} else {
			this.items = [...settingItems, items.command, items.order, ...terminal, AbstractEditMenuGuide.items.delete, ...save, ...returnOrBack];
		}
	}

	private setFolderCommands(settingItems: Array<QuickPickItem>, returnOrBack: Array<QuickPickItem>): void {
		const commandItems = this.commandItems;
		const operateItems = this.root ? [items.setting, AbstractEditMenuGuide.items.uninstall] : settingItems;
		const returnItem   = this.root ? [AbstractEditMenuGuide.items.exit]                     : returnOrBack;

		this.items         = [items.add, items.terminal, items.create].concat(
			...operateItems,
			AbstractEditMenuGuide.items.launcher,
			...returnItem,
			commandItems.length > 0 ? [items.delimiter, ...commandItems] : [],
		);
	}

	protected command(): (() => Promise<void>) | undefined {
		const name = this.getLabelStringByItem;
		const type = (this.getCommand(name))[this.settings.itemId.type];

		this.initialValue          = this.activeItem?.label;
		this.state.hierarchy       = this.hierarchy.concat(name);
		this.state.resultSet[name] = undefined;

		return async () => {
			this.setNextSteps([{
				key:   'EditMenuGuide',
				state: this.createBaseState(`/${name}`, name),
				args:  [type]
			}]);
		};
	}

	protected async delete(): Promise<void> {
		this.settings.delete(this.hierarchy);

		await this.settings.commit();

		this.updateEnd(this.processType.deleted);
	}

	protected async save(): Promise<void> {
		const hierarchy                          = [...this.hierarchy];
		const pre                                = Optional.ofNullable(hierarchy.pop()).orElseThrow(ReferenceError('Edit target not found...'));
		const name                               = Optional.ofNullable(this.guideGroupResultSet[this.settings.itemId.name]).orElseNonNullable(pre) as string;
		const original                           = this.settings.cloneDeep(this.hierarchy);
		const overwrite: Record<string, unknown> = {};

		Object.keys(this.guideGroupResultSet).forEach(
			(key) => {
				let regist    = true;
				let value     = this.guideGroupResultSet[key];
				const remover = () => { delete original[key]; regist = false; };

				switch (key) {
					case this.settings.itemId.name:
						regist = false;
						break;
					case this.settings.itemId.lable:
						value = (
							Optional.ofNullable((this.guideGroupResultSet[key] as string).match(Constant.LABEL_STRING_ONLY_MATCH))
									.orElseThrow(ReferenceError('Label value not found...'))
						)[0];
						break;
					case this.settings.itemId.orderNo:
						if (0 === (this.guideGroupResultSet[key] as string).length) {
							remover();
						}
						break;
					case this.settings.itemId.autoRun:
						if (this.guideGroupResultSet[key]) {
							remover();
						}
						break;
				}

				if (regist) {
					overwrite[key] = value;
				}
			}
		);

		Object.assign(original, overwrite);

		this.settings.delete(this.hierarchy);

		this.settings.lookup(hierarchy, this.settings.lookupMode.read)[name] = original;

		this.settings.sort(hierarchy);

		await this.settings.commit();

		this.updateEnd(this.processType.updated);
	}

	private setGuidance(label: string): () => Promise<void> {
		let [title, guideGroupId, totalStep, type] = ['', '', 0, 0];
		this.state.resultSet[guideGroupId]         = undefined;

		switch(label) {
			case items.add.label:
				[title, guideGroupId, totalStep, type] = ['Command',  'add',         4, Constant.DATA_TYPE.command];
				break;
			case items.terminal.label:
				[title, guideGroupId, totalStep, type] = ['Terminal', 'addTerminal', 4, Constant.DATA_TYPE.terminalCommand];
				break;
			default:
				[title, guideGroupId, totalStep, type] = ['Folder',   'create',      3, Constant.DATA_TYPE.folder];
				break;
		}

		const temporary: Record<string, unknown> = {};
		temporary[this.settings.itemId.type]     = type;
		this.state.resultSet[guideGroupId]       = temporary;

		return async () => {
			this.setNextSteps([{
				key:   'SelectLabelGuide4Guidance',
				state: this.createBaseState(` - Add ${title}`, guideGroupId, totalStep),
				args:  [Constant.SELECTION_ITEM.base, type]
			}]);
		};
	}

	private setSettingGuide(label: string): () => Promise<void> {
		let [key, itemId, additionalTitle, guideGroupId] = ['BaseInputGuide', '', '', this.guideGroupId];
		let optionState: Partial<State>                  = {};
		let args: Array<unknown>                         = [];
		let guide: Guide;

		switch (label) {
			case items.name.label:
				key                         = 'NameInputGuide';
				optionState['initialValue'] = this.guideGroupId;
				args                        = [this.type];
				break;
			case items.label.label:
				key                         = 'SelectLabelGuide4Guidance';
				args                        = [Constant.SELECTION_ITEM.base, this.type];
				break;
			case items.description.label:
				itemId                      = this.settings.itemId.description;
				optionState['prompt']       = `Please enter the description of ${Constant.DATA_TYPE.folder === this.type ? 'folder' : 'command' }.`;
				optionState['initialValue'] = this.currentCommandInfo[this.settings.itemId.description];
				break;
			case items.command.label:
				itemId                      = this.settings.itemId.command;
				optionState['prompt']       = 'Please enter the command you want to run.';
				optionState['validate']     = BaseValidator.validateRequired;
				optionState['initialValue'] = this.currentCommandInfo[this.settings.itemId.command];
				break;
			case items.order.label:
				itemId                      = this.settings.itemId.orderNo;
				optionState['prompt']       = 'Please enter the number you want to sort order.';
				optionState['initialValue'] = this.currentCommandInfo[this.settings.itemId.orderNo];
				break;
			case items.autoRun.label:
				key                         = 'AutoRunSettingGuide';
				optionState['initialValue'] = this.currentCommandInfo[this.settings.itemId.autoRun];
				break;
			case items.question.label:
				key                         = 'QuestionEditMenuGuide';
				guideGroupId                = this.settings.itemId.questions;
				itemId                      = this.settings.itemId.questions;
				args                        = [this.type, true];
				break;
			}

		guide = {
			key:   key,
			state: Object.assign(
				this.createBaseState(additionalTitle, guideGroupId, 0, itemId),
				optionState
			),
		};

		if (args.length > 0) {
			guide['args'] = args;
		}

		return async () => {
			this.setNextSteps([guide]);
		};
	}
}
