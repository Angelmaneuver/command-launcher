import { BaseQuickPickGuide } from '../base/pick';
import { VSCodePreset }       from '../../utils/base/vscodePreset';

const items = {
	yes: VSCodePreset.create(VSCodePreset.icons.check, 'Yes', 'Enable the history function.'),
	no:  VSCodePreset.create(VSCodePreset.icons.x,     'No',  'Disable the history function.'),
};

export class EnableHistoryGuide extends BaseQuickPickGuide {
	public init(): void {
		super.init();

		this.placeholder = 'Do you want to enable the history function?';
		this.items       = [items.yes, items.no];
		this.activeItem  = this.settings.enableHistory ? items.yes : items.no;
	}

	protected async inputStepAfter(): Promise<void> {
		this.settings.updateEnableHistory(items.yes.label === this.activeItem?.label ? true : false);

		return super.inputStepAfter();
	}
}
