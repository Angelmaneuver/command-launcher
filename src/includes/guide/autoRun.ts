import { BaseYesOrNoGuide } from './yesOrNo/base';
import { State }              from './base/base';

export class AutoRunSettingGuide extends BaseYesOrNoGuide {
	constructor(state: State) {
		super(state, { yes: 'Run automaticaly.', no: 'Does not run automaticaly.' });

		this.itemId            = this.settings.itemId.autoRun;
		this.state.placeholder = 'Do you want to this command to run automaticaly?';		
	}
}
