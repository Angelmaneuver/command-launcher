import { ExtensionContext, QuickPickItem } from 'vscode';
import { InputStep, MultiStepInput }       from '../utils/multiStepInput';
import { Guide }                           from './base/abc';
import { State }                           from './base/base';
import { AbstractQuickPickSelectGuide }    from './base/pick';
import { BaseValidator }                   from './validator/base';
import { SELECTION_ITEM }                  from './label';
import { Optional }                        from '../utils/base/optional';
import { VSCodePreset }                    from '../utils/base/vscodePreset';
import * as Constant                       from '../constant';

const items = {
	add:         VSCodePreset.create(VSCodePreset.icons.add,                 'Add',             'Add a command.'),
	create:      VSCodePreset.create(VSCodePreset.icons.fileDirectoryCreate, 'Create',          'Create a folder.'),
	delete:      VSCodePreset.create(VSCodePreset.icons.trashcan,            'Delete',          'delte this item.'),
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

const match = /^\$\(.+\)/;

type Command = {
	type:        number,
	label:       string,
	description: string,
	command:     string,
};

type Folder = {
	type:        number,
	label:       string,
	description: string,
};

export abstract class AbstractMenuGuide extends AbstractQuickPickSelectGuide {
	protected root: boolean;

	constructor(state: State, root?: boolean, context?: ExtensionContext) {
		super(state, context);

		this.root = root ? true : false;
	}

	public init(): void {
		super.init();

		this.placeholder = 'Select the item you want to do.';
	}

	protected get commandItems(): QuickPickItem[] {
		return Object.keys(this.currentCommands).map(
			(key) => {
				const item = this.currentCommands[key] as Record<string, unknown>;

				return ({
					label:       `${item.label} ${key}`,
					description: `${item.description}`,
				});
			}
		);
	}

	protected getCommand(name: string): Command | Folder {
		const error   = ReferenceError('Command item not found...');
		const command = Optional.ofNullable(this.currentCommands[name]).orElseThrow(error) as Record<string, unknown>;

		if (Constant.DATA_TYPE.command === Optional.ofNullable(command['type']).orElseThrow(error)) {
			return command as Command;
		} else {
			return command as Folder;
		}
	}
}

export class MenuGuide extends AbstractMenuGuide {
	public init(): void {
		super.init();

		this.items = this.items.concat(
			this.commandItems,
			this.root ? [items.exit] : [items.back]
		);
	}

	protected getExecute(label: string | undefined): (() => Promise<void>) | undefined {
		switch (label) {
			case items.back.label:
				this.prev();
			case items.exit.label:
				return undefined;
			default:
				return this.command();
		}
	}

	private command(): (() => Promise<void>) | undefined {
		const command = this.getCommand(this.getLabelStringByItem);

		if (Constant.DATA_TYPE.command === command['type']) {
			this.state.command = (command as Command)['command'];
			return undefined;
		} else {
			const name           = this.getLabelStringByItem;

			this.state.title     = `${this.title}/${name}`;
			this.state.hierarchy = this.hierarchy.concat(name);
			return async () => {
				this.setNextSteps([{ key: 'MenuGuide', state: this.state }]);
			};
		}
	}
}

export class MenuGuideWithEdit extends AbstractMenuGuide {
	private type: Constant.DataType;

	constructor(state: State, type: Constant.DataType, root?: boolean, context?: ExtensionContext) {
		super(state, root, context);

		this.root = root ? true : false;
		this.type = type;
	}

	public async show(input: MultiStepInput):Promise<void | InputStep> {
		this.items         = [];
		const settingItems = (
			[
				items.name,
				items.label,
				items.description,
			].concat(
				Constant.DATA_TYPE.command === this.type
					? [items.command]
					: []
			).concat(
				[items.delete]
			).concat(
				Object.keys(this.guideGroupResultSet).length > 0
					? [items.save]
					: []
			)
		);
		const commandItems = this.commandItems;

		if (Constant.DATA_TYPE.folder === this.type) {
			this.items = this.items.concat(
				[items.add, items.create],
				this.root               ? [items.uninstall] : settingItems,
				[items.launcher],
				this.root               ? [items.exit]      : (Object.keys(this.guideGroupResultSet).length > 0 ? [items.return] : [items.back]),
				commandItems.length > 0 ? [items.delimiter] : [],
				commandItems
			);
		} else {
			this.items = this.items.concat(
				settingItems.concat(
					Object.keys(this.guideGroupResultSet).length > 0 ? [items.return] : [items.back],
				)
			);
		}

		do {
			await super.show(input);
		} while (items.delimiter === this.inputPick);
	}

	protected back(): void {
		if (!this.guideGroupResultSet['deleted'] && !this.guideGroupResultSet['updated']) {
			this.state.back = false;
		} else {
			super.back();
		}
	}

	protected getExecute(label: string | undefined): (() => Promise<void>) | undefined {
		let guideGroupId: string;

		this.state.hierarchy = this.hierarchy;

		switch (label) {
			case items.add.label:
				guideGroupId = 'add';
				this.state.resultSet[guideGroupId] = undefined;
				return async () => {
					this.setNextSteps([{
						key:   'SelectLabelGuide4Guidance',
						state: this.createBaseState(" - Add command", guideGroupId, 4),
						args:  [SELECTION_ITEM.base, Constant.DATA_TYPE.command]
					}]);
				};
			case items.create.label:
				guideGroupId = 'create';
				this.state.resultSet[guideGroupId] = undefined;
				return async () => {
					this.setNextSteps([{
						key:   'SelectLabelGuide4Guidance',
						state: this.createBaseState(" - Add Folder", guideGroupId, 3),
						args:  [SELECTION_ITEM.base, Constant.DATA_TYPE.folder]
					}]);
				};
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

	private command(): (() => Promise<void>) | undefined {
		const name = this.getLabelStringByItem;
		const type = (this.getCommand(name))['type'];

		this.state.hierarchy = this.hierarchy.concat(name);
		this.state.resultSet[name]  = undefined;

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

						if (this.guideGroupResultSet[this.settings.itemId.lable]) {
							overwrite[this.settings.itemId.lable] = (
								Optional
									.ofNullable((this.guideGroupResultSet[this.settings.itemId.lable] as string).match(match))
									.orElseThrow(ReferenceError('Label value not found...'))
							)[0];
						}

						if (this.guideGroupResultSet[this.settings.itemId.description]) {
							overwrite[this.settings.itemId.description] = this.guideGroupResultSet[this.settings.itemId.description];
						}

						if (this.guideGroupResultSet[this.settings.itemId.command]) {
							overwrite[this.settings.itemId.command] = this.guideGroupResultSet[this.settings.itemId.command];
						}

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
						this.settings.uninstall();
					} )
				]
			}]);
		};
	}

	private setSettingGuide(label: string): () => Promise<void> {
		let key                         = 'BaseInputGuide';
		let itemId                      = '';
		let additionalTitle             = '';
		let optionState: Partial<State> = {};
		let args: Array<unknown>        = [];
		let guide: Guide;

		switch (label) {
			case items.name.label:
				key                         = 'NameInputGuide';
				optionState['initialValue'] = this.guideGroupId;
				args                        = [this.type];
				break;
			case items.label.label:
				key                         = 'SelectLabelGuide4Guidance';
				args                        = [SELECTION_ITEM.base, this.type];
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
