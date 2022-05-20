import { Guide }                        from './base/abc';
import { State }                        from './base/base';
import { AbstractQuickPickSelectGuide } from './base/pick';
import * as Constant                    from '../constant';
import { VSCodePreset }                 from '../utils/base/vscodePreset';

const BASE_ITEMS = [
	VSCodePreset.create(VSCodePreset.icons.inbox,        'Other icons',   'Select from other icons.'),
	VSCodePreset.create(VSCodePreset.icons.edit,         'Edit',          ''),
	VSCodePreset.create(VSCodePreset.icons.diff,         'Diff',          ''),
	VSCodePreset.create(VSCodePreset.icons.file,         'File',          ''),
	VSCodePreset.create(VSCodePreset.icons.folder,       'Folder',        ''),
	VSCodePreset.create(VSCodePreset.icons.repo,         'Repo',          ''),
	VSCodePreset.create(VSCodePreset.icons.tag,          'Tag',           ''),
	VSCodePreset.create(VSCodePreset.icons.console,      'Console',       ''),
	VSCodePreset.create(VSCodePreset.icons.run,          'Run',           ''),
	VSCodePreset.create(VSCodePreset.icons.save,         'Save',          ''),
	VSCodePreset.create(VSCodePreset.icons.settings,     'Settings',      ''),
	VSCodePreset.create(VSCodePreset.icons.settingsGear, 'Settings Gear', ''),
];

export const SELECTION_ITEM = {
	base: 1,
	all:  2,
} as const;

export type SelectionItem = typeof SELECTION_ITEM[keyof typeof SELECTION_ITEM];

export abstract class AbstractSelectLabelGuide extends AbstractQuickPickSelectGuide {
	private   selection: SelectionItem;
	private   className: string         = '';
	protected type:      Constant.DataType;

	constructor(state: State, selection: SelectionItem, className: string, type?: Constant.DataType) {
		super(state);

		this.itemId      = this.settings.itemId.lable;
		this.placeholder = 'Select the label you wish to use.';
		this.selection   = selection;
		this.className   = className;
		this.type        = type ? type : Constant.DATA_TYPE.command;
	}

	public init(): void {
		const step       = this.state.step ? this.state.step : 0;
		this.state.items = (
			SELECTION_ITEM.base === this.selection
				? BASE_ITEMS
				: VSCodePreset.getAllIcons
		);

		super.init();

		if (SELECTION_ITEM.all === this.selection) {
			this.step       = step;
			this.state.step = step;
		}
	}

	protected reCall(label: string | undefined): Guide | undefined {
		return (
			BASE_ITEMS[0].label === label
				? { key: this.className, state: { step: this.step, }, args: [SELECTION_ITEM.all, this.type] }
				: undefined
		);
	}
}

export class BaseSelectLabelGuide extends AbstractSelectLabelGuide {
	constructor(state: State, selection: SelectionItem) {
		super(state, selection, 'BaseSelectLabelGuide');
	}

	protected getExecute(label: string | undefined): (() => Promise<void>) | undefined {
		const next = this.reCall(label);

		if (undefined === next) {
			this.state.back = true;
			this.prev();
		} else {
			return async () => {
				this.setNextSteps([next]);
			};
		}
	}
}

export class SelectLabelGuide4Guidance extends AbstractSelectLabelGuide {
	constructor(state: State, selection: SelectionItem, type: Constant.DataType) {
		super(state, selection, 'SelectLabelGuide4Guidance', type);
	}

	protected getExecute(label: string | undefined): (() => Promise<void>) | undefined {
		const steps: Array<Guide> = [];
		const again               = this.reCall(label);

		if (again) {
			steps.push(again);
		}

		if (this.totalSteps > 0) {
			steps.push(
				{
					key:   'NameInputGuide',
					state: {
						step:     this.step,
					} as Partial<State>,
					args: [Constant.DATA_TYPE.command]
				},
			);

			if (Constant.DATA_TYPE.command === this.type) {
				steps.push(
					{
						key:   'BaseInputGuide',
						state: {
							itemId: this.settings.itemId.description,
							prompt: `Please enter the description of command.`
						} as Partial<State>
					},
						{
						key:   'CommandLastInputGuide',
						state: {}
					},
				);
			} else {
				steps.push(
					{
						key:   'FolderLastInputGuide',
						state: {}
					},
				);
			}
		}

		if (steps.length > 0) {
			return async () => {
				this.setNextSteps(steps);
			};	
		} else {
			this.state.back = true;
			this.prev();
		}
	}
}
