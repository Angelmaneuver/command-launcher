import { ExtensionContext, QuickPickItem } from 'vscode';
import { InputStep, MultiStepInput }       from '../../utils/multiStepInput';
import { Guide }                           from '../base/abc';
import { State }                           from '../base/base';
import { AbstractMenuGuide }               from './abc';
import { BaseValidator }                   from '../validator/base';
import { Optional }                        from '../../utils/base/optional';
import { VSCodePreset }                    from '../../utils/base/vscodePreset';
import * as Constant                       from '../../constant';

const items = {
	add:         VSCodePreset.create(VSCodePreset.icons.add,                 'Add',             'Add a command.'),
	create:      VSCodePreset.create(VSCodePreset.icons.fileDirectoryCreate, 'Create',          'Create a folder.'),
	delete:      VSCodePreset.create(VSCodePreset.icons.trashcan,            'Delete',          'delete this item.'),
	uninstall:   VSCodePreset.create(VSCodePreset.icons.trashcan,            'Uninstall',       'Remove all parameters for this extension.'),
	launcher:    VSCodePreset.create(VSCodePreset.icons.reply,               'Return Launcher', 'Activate Launcher mode.'),
	back:        VSCodePreset.create(VSCodePreset.icons.reply,               'Return',          'Back to previous.'),
	exit:        VSCodePreset.create(VSCodePreset.icons.signOut,             'Exit',            'Exit this extenion.'),
	name:        VSCodePreset.create(VSCodePreset.icons.fileText,            'Name',            'Set the item name.'),
	label:       VSCodePreset.create(VSCodePreset.icons.tag,                 'Label',           'Set the item label.'),
	description: VSCodePreset.create(VSCodePreset.icons.note,                'Description',     'Set the command description.'),
	command:     VSCodePreset.create(VSCodePreset.icons.terminalPowershell,  'Command',         'Set the execute command.'),
	save:        VSCodePreset.create(VSCodePreset.icons.save,                'Save',            'Save changes.'),
	return:      VSCodePreset.create(VSCodePreset.icons.reply,               'Return',          'Return without saving any changes.'),
	delimiter:   { label: '-'.repeat(35) + ' Registered commands ' + '-'.repeat(35) } as QuickPickItem,
};

export class MenuGuideWithEdit extends AbstractMenuGuide {
	private type: Constant.DataType;

	constructor(state: State, type: Constant.DataType, root?: boolean, context?: ExtensionContext) {
		super(state, root, context);

		this.root = root ? true : false;
		this.type = type;
	}

	public async show(input: MultiStepInput):Promise<void | InputStep> {
		this.setMenuItems();

		do {
			await super.show(input);
		} while (items.delimiter === this.inputPick);
	}

	protected back(): void {
		if (this.guideGroupResultSet['deleted'] || this.guideGroupResultSet['updated']) {
			delete this.guideGroupResultSet['deleted'];
			delete this.guideGroupResultSet['updated'];

			super.back();
		} else {
			this.state.back = false;
		}
	}

	protected getExecute(label: string | undefined): (() => Promise<void>) | undefined {
		this.state.hierarchy = this.hierarchy;

		switch (label) {
			case items.add.label:
			case items.create.label:
				return this.setGuidance(label);
			case items.name.label:
			case items.label.label:
			case items.description.label:
			case items.command.label:
				return this.setSettingGuide(label);
			case items.delete.label:
				return this.delete();
			case items.save.label:
				return this.save();
			case items.uninstall.label:
				return this.uninstall();
			case items.back.label:
			case items.return.label:
				this.prev();
			case items.launcher.label:
				this.state.command = 'command-launcher.launcher';
			case items.exit.label:
				return undefined;
			default:
				return this.command();
		}
	}

	private setMenuItems(): void {
		this.items         = [];
		const settingItems = [items.name, items.label, items.description];
		const save         = [];
		const returnOrBack = [];

		if (Object.keys(this.guideGroupResultSet).length > 0) {
			save.push(items.save);
			returnOrBack.push(items.return);
		} else {
			returnOrBack.push(items.back);
		}

		if (Constant.DATA_TYPE.folder === this.type) {
			this.setFolderCommands([...settingItems, items.delete, ...save], returnOrBack);
		} else {
			this.items = [...settingItems, items.command, items.delete, ...save, ...returnOrBack];
		}
	}

	private setFolderCommands(settingItems: Array<QuickPickItem>, returnOrBack: Array<QuickPickItem>): void {
		const commandItems = this.commandItems;

		this.items         = [items.add, items.create].concat(
			this.root               ? [items.uninstall]                  : settingItems
		).concat(
			[items.launcher]
		).concat(
			this.root               ? [items.exit]                       : returnOrBack,
		).concat(
			commandItems.length > 0 ? [items.delimiter, ...commandItems] : [],
		);
	}

	private command(): (() => Promise<void>) | undefined {
		const name = this.getLabelStringByItem;
		const type = (this.getCommand(name))[this.settings.itemId.type];

		this.state.hierarchy       = this.hierarchy.concat(name);
		this.state.resultSet[name] = undefined;

		return async () => {
			this.setNextSteps([{
				key:   'MenuGuideWithEdit',
				state: this.createBaseState(`/${name}`, name),
				args:  [type]
			}]);
		};
	}

	private delete(): () => Promise<void> {
		return async () => {
			this.state.placeholder = 'Do you want to delete this item?';
			this.setNextSteps([{
				key:   'BaseConfirmGuide',
				state: { title: this.title },
				args:  [
					{ yes: 'Delete.', no: 'Back to previous.' },
					( async () => {
						this.settings.delete(this.hierarchy);
						await this.settings.commit();
				
						this.state.back = true;
						this.guideGroupResultSet['deleted'] = true;
						this.prev();
					})
				]
			}]);
		};
	}

	private save(): () => Promise<void> {
		return async () => {
			this.state.placeholder = 'Do you want to reflect the changes?';
			this.setNextSteps([{
				key:   'BaseConfirmGuide',
				state: { title: this.title },
				args:  [
					{ yes: 'Save.', no: 'Back to previous.' },
					( async () => {
						const hierarchy                          = [...this.hierarchy];
						const pre                                = Optional.ofNullable(hierarchy.pop()).orElseThrow(ReferenceError('Edit target not found...'));
						const name                               = Optional.ofNullable(this.guideGroupResultSet[this.settings.itemId.name]).orElseNonNullable(pre) as string;
						const original                           = this.settings.cloneDeep(this.hierarchy);
						const overwrite: Record<string, unknown> = {};

						Object.keys(this.guideGroupResultSet).forEach(
							(key) => {
								let value = this.guideGroupResultSet[key];

								if (this.settings.itemId.lable === key) {
									value = (
										Optional.ofNullable((this.guideGroupResultSet[key] as string).match(Constant.LABEL_STRING_ONLY_MATCH))
												.orElseThrow(ReferenceError('Label value not found...'))
									)[0];
								}

								if (!(this.settings.itemId.name === key)) {
									overwrite[key] = value;
								}
							}
						);

						Object.assign(original, overwrite);

						this.settings.delete(this.hierarchy);

						this.settings.lookup(hierarchy, this.settings.lookupMode.read)[name] = original;

						this.settings.sort(hierarchy);

						await this.settings.commit();

						this.guideGroupResultSet['updated'] = true;
						this.state.back = true;
						this.prev();
					})
				]
			}]);
		};
	}

	private uninstall(): () => Promise<void> {
		return async () => {
			this.state.placeholder = 'Do you want to uninstall the all settings related to this extension?';
			this.setNextSteps([{
				key:   'BaseConfirmGuide',
				state: { title: this.title },
				args:  [
					{ yes: 'Uninstall.', no: 'Back to previous.' },
					( async () => {
						await this.settings.uninstall();
					} )
				]
			}]);
		};
	}

	private setGuidance(label: string): () => Promise<void> {
		let [title, guideGroupId, totalStep, type] = ['', '', 0, 0];
		this.state.resultSet[guideGroupId]         = undefined;

		if (items.add.label === label) {
			title        = 'Command';
			guideGroupId = 'add';
			totalStep    = 4;
			type         = Constant.DATA_TYPE.command;
		} else {
			title        = 'Folder';
			guideGroupId = 'create';
			totalStep    = 3;
			type         = Constant.DATA_TYPE.folder;
		}

		return async () => {
			this.setNextSteps([{
				key:   'SelectLabelGuide4Guidance',
				state: this.createBaseState(` - Add ${title}`, guideGroupId, totalStep),
				args:  [Constant.SELECTION_ITEM.base, type]
			}]);
		};
	}

	private setSettingGuide(label: string): () => Promise<void> {
		let [key, itemId, additionalTitle] = ['BaseInputGuide', '', ''];
		let optionState: Partial<State>    = {};
		let args: Array<unknown>           = [];
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
				optionState['prompt']       = `Please enter the description of ${Constant.DATA_TYPE.command === this.type ? 'command' : 'folder'}.`;
				optionState['initialValue'] = this.currentCommandInfo[this.settings.itemId.description];
				break;
			case items.command.label:
				itemId                      = this.settings.itemId.command;
				optionState['prompt']       = 'Please enter the command you want to run.';
				optionState['validate']     = BaseValidator.validateRequired;
				optionState['initialValue'] = this.currentCommandInfo[this.settings.itemId.command];
				break;
		}

		guide = {
			key:   key,
			state: Object.assign(
				this.createBaseState(additionalTitle, this.guideGroupId, 0, itemId),
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
