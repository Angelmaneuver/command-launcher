import { ExtensionContext }  from 'vscode';
import { State }             from '../../base/base';
import { AbstractMenuGuide } from '../abc';
import { VSCodePreset }      from '../../../utils/base/vscodePreset';
import * as Constant         from '../../../constant';

export const PROCESS_TYPE = {
	updated: 'updated',
	deleted: 'deleted',
} as const;

type ProcessType          = typeof PROCESS_TYPE[keyof typeof PROCESS_TYPE];

export abstract class AbstractEditMenuGuide extends AbstractMenuGuide {
	protected static items = {
		delete:    VSCodePreset.create(VSCodePreset.icons.trashcan, 'Delete',          'delete this item.'),
		uninstall: VSCodePreset.create(VSCodePreset.icons.trashcan, 'Uninstall',       'Remove all parameters for this extension.'),
		launcher:  VSCodePreset.create(VSCodePreset.icons.reply,    'Return Launcher', 'Activate Launcher mode.'),
		back:      VSCodePreset.create(VSCodePreset.icons.reply,    'Return',          'Back to previous.'),
		exit:      VSCodePreset.create(VSCodePreset.icons.signOut,  'Exit',            'Exit this extenion.'),
		save:      VSCodePreset.create(VSCodePreset.icons.save,     'Save',            'Save changes.'),
		return:    VSCodePreset.create(VSCodePreset.icons.reply,    'Return',          'Return without saving any changes.'),
	};

	protected abstract deleteConfirmText: string;

	protected saveConfrimText: string = 'Do you want to reflect the changes?';

	protected type: Constant.DataType;

	constructor(state: State, type: Constant.DataType, root?: boolean, context?: ExtensionContext) {
		super(state, root, context);

		this.root = root ? true : false;
		this.type = type;
	}

	protected get processType() {
		return PROCESS_TYPE;
	}

	protected back(): void {
		if (this.guideGroupResultSet[this.processType.deleted] || this.guideGroupResultSet[this.processType.updated]) {
			delete this.guideGroupResultSet[this.processType.deleted];
			delete this.guideGroupResultSet[this.processType.updated];

			super.back();
		} else {
			this.state.back = false;
		}
	}

	protected getExecute(label: string | undefined): (() => Promise<void>) | undefined {
		this.state.hierarchy = this.hierarchy;

		switch (label) {
			case AbstractEditMenuGuide.items.delete.label:
				return this.deleteConfirm();
			case AbstractEditMenuGuide.items.save.label:
				return this.saveConfirm();
			case AbstractEditMenuGuide.items.uninstall.label:
				return this.uninstallConfirm();
			case AbstractEditMenuGuide.items.back.label:
			case AbstractEditMenuGuide.items.return.label:
				this.prev();
			case AbstractEditMenuGuide.items.launcher.label:
				this.state.command = 'command-launcher.launcher';
			case AbstractEditMenuGuide.items.exit.label:
				return undefined;
			default:
				return this.command();
		}
	}

	protected abstract command(): (() => Promise<void>) | undefined;

	private deleteConfirm(): () => Promise<void> {
		return async () => {
			this.state.placeholder = this.deleteConfirmText;
			this.setNextSteps([{
				key:   'BaseConfirmGuide',
				state: { title: this.title },
				args:  [
					{ yes: 'Delete.', no: 'Back to previous.' },
					( async () => { return this.delete(); } )
				]
			}]);
		};
	}

	protected abstract delete(): Promise<void>;

	private saveConfirm(): () => Promise<void> {
		return async () => {
			this.state.placeholder = this.saveConfrimText;
			this.setNextSteps([{
				key:   'BaseConfirmGuide',
				state: { title: this.title },
				args:  [
					{ yes: 'Save.', no: 'Back to previous.' },
					( async () => { return this.save(); } )
				]
			}]);
		};
	}

	protected abstract save(): Promise<void>;

	private uninstallConfirm(): () => Promise<void> {
		return async () => {
			this.state.placeholder = 'Do you want to uninstall the all settings related to this extension?';
			this.setNextSteps([{
				key:   'BaseConfirmGuide',
				state: { title: this.title },
				args:  [
					{ yes: 'Uninstall.', no: 'Back to previous.' },
					( async () => { return this.settings.uninstall(); } )
				]
			}]);
		};
	}

	protected updateEnd(processType: ProcessType): void {
		this.guideGroupResultSet[processType] = true;
		this.state.back                       = true;
		this.prev();
	}
}
