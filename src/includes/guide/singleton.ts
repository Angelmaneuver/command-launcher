import { BaseYesOrNoGuide } from './yesOrNo/base';
import { State }              from './base/base';

export class SingletonSettingGuide extends BaseYesOrNoGuide {
	constructor(state: State) {
		super(state, { yes: 'Run as single process.', no: 'Does not run as single process.' });

		this.itemId            = this.settings.itemId.singleton;
		this.state.placeholder = 'Do you want to this command to run as single process?';		
	}
}
