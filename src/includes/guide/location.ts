import { State }                        from './base/base';
import { AbstractQuickPickSelectGuide } from './base/pick';
import { VSCodePreset }                 from './../utils/base/vscodePreset';
import { LOCATION }                     from './../utils/base/type';

const items = {
	globe: VSCodePreset.create(VSCodePreset.icons.globe, 'Common', 'Use in all profiles.'),
	user:  VSCodePreset.create(VSCodePreset.icons.home,  'User',   'Only use in current profile.'),
};

export class SelectLocationGuide extends AbstractQuickPickSelectGuide {
	private args: Array<unknown>;

	constructor(state: State, ...args: Array<unknown>) {
		super(state);

		this.args              = args;

		this.state.placeholder = 'Select the scope of use.';
		this.state.items       = [items.globe, items.user];
	}

	protected getExecute(label: string | undefined): (() => Promise<void>) | undefined {
		const location = items.globe.label === label ? LOCATION.user : LOCATION.profile;

		return async () => {
			this.setNextSteps([{
				key:   'SelectLabelGuide4Guidance',
				state: Object.assign(this.state, { location: location }),
				args:  this.args,
			}]);
		};
	}
}
