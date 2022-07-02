import { State }              from './base/base';
import { BaseQuickPickGuide } from './base/pick';
import { VSCodePreset }       from '../utils/base/vscodePreset';

const items = {
	yes: VSCodePreset.create(VSCodePreset.icons.check, 'Yes', 'Run automaticaly.'),
	no:  VSCodePreset.create(VSCodePreset.icons.x,     'No',  'Does not run automaticaly.'),
};

export class AutoRunSettingGuide extends BaseQuickPickGuide {
	constructor(state: State) {
		super(state);

		this.itemId            = this.settings.itemId.autoRun;
		this.state.placeholder = 'Do you want to this command to run automaticaly?';		
		this.state.items       = [items.yes, items.no];
		this.state.activeItem  = this.state.initialValue ? items.yes : items.no;
	}

	protected async inputStepAfter(): Promise<void> {
		this.guideGroupResultSet[this.itemId] = items.yes.label === this.guideGroupResultSet[this.itemId] ? true : false;

		return super.inputStepAfter();
	}
}
