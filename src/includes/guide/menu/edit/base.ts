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
	command:         VSCodePreset.create(VSCodePreset.icons.extensions,          'Add Command',          'Add a vscode command.'),
	terminal:        VSCodePreset.create(VSCodePreset.icons.terminal,            'Add Terminal Command', 'Add a terminal command.'),
	folder:          VSCodePreset.create(VSCodePreset.icons.fileDirectoryCreate, 'Create Folder',        'Create folder'),
	setting:         VSCodePreset.create(VSCodePreset.icons.settingsGear,        'Setting',              'Set the parameters for this extension.'),
	name:            VSCodePreset.create(VSCodePreset.icons.fileText,            'Name',                 'Set the item name.'),
	label:           VSCodePreset.create(VSCodePreset.icons.tag,                 'Label',                'Set the item label.'),
	description:     VSCodePreset.create(VSCodePreset.icons.note,                'Description',          'Set the command description.'),
	executeCommand:  VSCodePreset.create(VSCodePreset.icons.terminalPowershell,  'Execute Command',      'Set the execute command.'),
	order:           VSCodePreset.create(VSCodePreset.icons.listOrdered,         'Order',                'Set the sort order.'),
	question:        VSCodePreset.create(VSCodePreset.icons.question,            'Question',             'Set the question.'),
	autoRun:         VSCodePreset.create(VSCodePreset.icons.run,                 'Auto Run',             'Set the run automaticaly or not.'),
	singleton:       VSCodePreset.create(VSCodePreset.icons.emptyWindow,         'Singleton',            'Set the terminal command be run as single or not.'),
	delimiter:       { label: '-'.repeat(35) + ' Registered commands ' + '-'.repeat(35) } as QuickPickItem,
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
		this.state.hierarchy = [...this.hierarchy];

		switch (label) {
			case items.setting.label:
				return async () => {
					this.setNextSteps([{
						key:   'SelectSettingGuide',
						state: this.createBaseState(` - Setting`, 'setting'),
					}]);
				};
			case items.command.label:
				return this.setGuidance('Command',  'command',  4, Constant.DATA_TYPE.command,         label);
			case items.terminal.label:
				return this.setGuidance('Terminal', 'terminal', 4, Constant.DATA_TYPE.terminalCommand, label);
			case items.folder.label:
				return this.setGuidance('Folder',   'folder',   3, Constant.DATA_TYPE.folder,          label);
			case items.name.label:
			case items.label.label:
			case items.description.label:
			case items.executeCommand.label:
			case items.order.label:
			case items.question.label:
			case items.autoRun.label:
			case items.singleton.label:
				return this.setSettingGuide(label);
			default:
				return super.getExecute(label);
		}
	}

	private setMenuItems(): void {
		if (this.isRoot) {
			this.setRootItems();
		} else {
			if (Constant.DATA_TYPE.folder === this.type) {
				this.setFolderItems();
			} else if (Constant.DATA_TYPE.command === this.type) {
				this.setCommandItems();
			} else {
				this.setTerminalCommandItems();
			}

			if (Object.keys(this.guideGroupResultSet).length > 0) {
				this.items = this.items.concat([
					AbstractEditMenuGuide.items.save,
					AbstractEditMenuGuide.items.return,
				]);
			} else {
				this.items = this.items.concat([
					AbstractEditMenuGuide.items.back,
				]);
			}	

			if (Constant.DATA_TYPE.folder === this.type) {
				this.items = this.items.concat(
					AbstractEditMenuGuide.items.launcher,
				).concat(
					this.commandItems.length > 0 ? [items.delimiter, ...this.commandItems] : []
				);
			}
		}
	}

	private setRootItems(): void {
		this.items = [
			items.command,
			items.terminal,
			items.folder,
			items.setting,
			AbstractEditMenuGuide.items.uninstall,
			AbstractEditMenuGuide.items.launcher,
			AbstractEditMenuGuide.items.exit,
		].concat(this.commandItems.length > 0 ? [items.delimiter, ...this.commandItems] : []);
	}

	private setFolderItems(): void {
		this.items = [
			items.command,
			items.terminal,
			items.folder,
			items.name,
			items.label,
			items.description,
			items.order,
			AbstractEditMenuGuide.items.delete,
		];
	}

	private setCommandBaseItems(): void {
		this.items = [
			items.name,
			items.label,
			items.description,
		];
	}

	private setCommandItems(): void {
		this.setCommandBaseItems();

		this.items = this.items.concat([
			items.executeCommand,
			items.order,
			AbstractEditMenuGuide.items.delete,
		]);
	}

	private setTerminalCommandItems(): void {
		this.setCommandBaseItems();

		this.items = this.items.concat([
			items.executeCommand,
			items.order,
			items.question,
			items.autoRun,
			items.singleton,
			AbstractEditMenuGuide.items.delete,
		]);
	}

	protected item(): (() => Promise<void>) | undefined {
		const [data, key, location] = this.getCommand(this.getLabelStringByItem);
		const type                  = data[this.settings.itemId.type];

		this.initialValue           = key;
		this.state.location         = location;
		this.state.hierarchy        = this.hierarchy.concat(key);
		this.state.resultSet[key]   = undefined;

		return async () => {
			this.setNextSteps([{
				key:   'EditMenuGuide',
				state: this.createBaseState(`/${key}`, key),
				args:  [type]
			}]);
		};
	}

	protected async delete(): Promise<void> {
		this.settings.delete(this.hierarchy, this.location);

		await this.settings.commit(this.location);

		this.updateEnd(this.processType.deleted);
	}

	protected async save(): Promise<void> {
		const hierarchy                          = [...this.hierarchy];
		const pre                                = Optional.ofNullable(hierarchy.pop()).orElseThrow(ReferenceError('Edit target not found...'));
		const name                               = Optional.ofNullable(this.guideGroupResultSet[this.settings.itemId.name]).orElseNonNullable(pre) as string;
		const original                           = this.settings.cloneDeep(this.hierarchy, this.location);
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
					case this.settings.itemId.singleton:
						if (!this.guideGroupResultSet[key]) {
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

		this.settings.delete(this.hierarchy, this.location);

		this.settings.lookup(hierarchy, this.location, this.settings.lookupMode.read)[name] = original;

		this.settings.sort(hierarchy, this.location);

		await this.settings.commit(this.location);

		this.updateEnd(this.processType.updated);
	}

	private setGuidance(
		title:        string,
		guideGroupId: string,
		totalStep:    number,
		type:         Constant.DataType,
		label:        string
	): () => Promise<void> {
		this.state.resultSet[guideGroupId] = { type: type };

		const key:   string                = this.isRoot ? 'SelectLocationGuide' : 'SelectLabelGuide4Guidance';
		const state: Partial<State>        = this.createBaseState(` - Add ${title}`, guideGroupId, this.isRoot ? totalStep + 1 : totalStep);
		const args:  Array<unknown>        = [Constant.SELECTION_ITEM.base, type, Object.keys(this.currentCommandsWithAllowEmpty)];

		return async () => {
			this.setNextSteps([{
				key:   key,
				state: state,
				args:  args,
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
				args                        = [this.type, Object.keys(this.parentCommands)];
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
			case items.executeCommand.label:
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
				optionState['initialValue'] = (
					this.guideGroupResultSet[this.settings.itemId.autoRun]
						? this.guideGroupResultSet[this.settings.itemId.autoRun]
						: this.currentCommandInfo[this.settings.itemId.autoRun]
				);
				break;
			case items.singleton.label:
				key                         = 'SingletonSettingGuide';
				optionState['initialValue'] = (
					this.guideGroupResultSet[this.settings.itemId.singleton]
						? this.guideGroupResultSet[this.settings.itemId.singleton]
						: this.currentCommandInfo[this.settings.itemId.singleton]
				);
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
