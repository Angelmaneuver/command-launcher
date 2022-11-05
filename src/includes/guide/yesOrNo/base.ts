import { State }              from '../base/base';
import { BaseQuickPickGuide } from '../base/pick';
import { VSCodePreset }       from '../../utils/base/vscodePreset';

export class BaseYesOrNoGuide extends BaseQuickPickGuide {
	constructor(state: State, description: { yes: string, no: string }) {
		super(state);

		this.state.items = [
			VSCodePreset.create(VSCodePreset.icons.check, 'Yes', description.yes),
			VSCodePreset.create(VSCodePreset.icons.x,     'No',  description.no),
		];
	}

	public init(): void {
		super.init();

		this.activeItem = this.initialValue ? this.items[0] : this.items[1];
	}

	protected async inputStepAfter(): Promise<void> {
		this.guideGroupResultSet[this.itemId] = this.items[0].label === this.guideGroupResultSet[this.itemId] ? true : false;

		return super.inputStepAfter();
	}
}
