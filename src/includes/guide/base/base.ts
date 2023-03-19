import {
	QuickPickItem,
	ExtensionContext
}                           from 'vscode';
import { 
	AbstractState,
	AbstractGuide,
	Guide
}                           from './abc';
import { ExtensionSetting } from '../../settings/extension';
import {
	LOCATION,
	Location
}                           from '../../utils/base/type';

export interface State extends AbstractState {
	context:          ExtensionContext,
	settings:         ExtensionSetting,
	location:         Location,
	hierarchy:        Array<string>,
	guides?:          Array<Guide>,
	message?:         string                  | undefined,
	reload?:          boolean,
	name?:            string,
	command?:         string,
	terminalCommand?: string,
	autoRun?:         boolean,
	singleton?:       boolean,
	prompt?:          string,
	placeholder?:     string,
	items?:           Array<QuickPickItem>,
	activeItem?:      QuickPickItem,
}

export abstract class AbstractBaseGuide extends AbstractGuide {
	protected location:  Location      = LOCATION.root;
	protected hierarchy: Array<string> = [];
	protected guides:    Array<Guide>  = [];

	constructor(
		state:    State,
		context?: ExtensionContext
	) {
		super(state);

		if (context) {
			this.state.context = context;
		}
	}

	public init(): void {
		this.initialFields = this.initialFields.concat(['hierarchy', 'location']);
		this.init2DeepCopy.push('hierarchy');

		super.init();
	}

	protected stateClear(): void {
		super.stateClear();

		this.state.prompt      = undefined;
		this.state.placeholder = undefined;
		this.state.items       = undefined;
		this.state.activeItem  = undefined;
	}

	protected get state(): State {
		return this._state as State;
	}

	protected get context(): ExtensionContext {
		if (this.state.context) {
			return this.state.context;
		} else {
			throw ReferenceError('Extension Context not set...');
		}
	}

	protected get settings(): ExtensionSetting {
		if (!this.state.settings) {
			this.state.settings = new ExtensionSetting();
		}

		return this.state.settings;
	}

	protected async inputStepAfter(): Promise<void> {
		if (this.totalSteps === 0) {
			this.prev();
		} else if (0 < this.guides.length) {
			const guide       = this.guides.shift() as Guide;
			this.state.guides = this.guides;

			this.setNextSteps([guide]);
		} else if (this.step === this.totalSteps) {
			return this.lastInputStepExecute();
		}
	}

	protected async lastInputStepExecute(): Promise<void> {}
}
