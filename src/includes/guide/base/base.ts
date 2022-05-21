import {
	QuickPickItem,
	ExtensionContext
}                           from 'vscode';
import { 
	AbstractState,
	AbstractGuide
}                           from './abc';
import { ExtensionSetting } from '../../settings/extension';
import * as Constant        from '../../constant';

export interface State extends AbstractState {
	context:          ExtensionContext,
	settings:         ExtensionSetting,
	hierarchy:        Array<string>,
	message?:         string                  | undefined,
	reload?:          boolean,
	command?:         string,
	prompt?:          string,
	placeholder?:     string,
	items?:           Array<QuickPickItem>,
	activeItem?:      QuickPickItem,
}

export abstract class AbstractBaseGuide extends AbstractGuide {
	protected hierarchy: Array<string> = [];

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
		this.initialFields.push('hierarchy');
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

	protected get parentCommands(): Record<string, unknown> {
		const temporary = [...this.hierarchy];

		temporary.pop();

		return this.getCommands(temporary);
	}

	protected get currentCommands(): Record<string, unknown> {
		return this.getCommands(this.hierarchy);
	}

	protected get currentCommandInfo(): Record<string, unknown> {
		const commands                        = this.settings.lookup(this.hierarchy, this.settings.lookupMode.read);
		const result: Record<string ,unknown> = {};

		result[this.settings.itemId.name]        = commands[this.settings.itemId.name];
		result[this.settings.itemId.lable]       = commands[this.settings.itemId.lable];
		result[this.settings.itemId.type]        = commands[this.settings.itemId.type];
		result[this.settings.itemId.description] = commands[this.settings.itemId.description];

		if (Constant.DATA_TYPE.command === result[this.settings.itemId.type]) {
			result[this.settings.itemId.command] = commands[this.settings.itemId.command];
		}

		return result;
	}

	protected async inputStepAfter(): Promise<void> {
		if (this.totalSteps === 0) {
			this.prev();
		} else if (this.step === this.totalSteps) {
			return this.lastInputStepExecute();
		}
	}

	protected async lastInputStepExecute(): Promise<void> {}

	private getCommands(hierarchy: Array<string>): Record<string, unknown> {
		const temporary                         = this.settings.lookup(hierarchy, this.settings.lookupMode.read);
		const itemIds:  Array<string>           = Object.values(this.settings.itemId);
		const commands: Record<string, unknown> = {};

		Object.keys(temporary).forEach(
			(key) => {
				if (!itemIds.includes(key)) {
					commands[key] = temporary[key];
				}
			}
		);

		return commands;
	}
}
