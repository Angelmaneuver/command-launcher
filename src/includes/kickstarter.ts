import {
	window,
	commands,
	ExtensionContext
}                           from 'vscode';
import { MultiStepInput }   from './utils/multiStepInput';
import { State }            from './guide/base/base';
import { GuideFactory }     from './guide/factory/base';
import {
	History,
	ExtensionSetting
}                           from './settings/extension';
import * as Constant        from './constant';

export async function start(
	className: string,
	state:     Partial<State>,
	args:      Array<unknown>
): Promise<void> {
	try {
		const menu = GuideFactory.create(className, ...args);
		await MultiStepInput.run((input: MultiStepInput) => menu.start(input));

		if (present(state.command)) {
			commands.executeCommand(state.command as string);
		} else if (present(state.terminalCommand)) {
			updateHistory(state);

			executeTerminalCommand(
				state.name            as string,
				state.terminalCommand as string,
				state.autoRun         as boolean,
				state.singleton       as boolean,
				state,
			);
		}
	} catch (e) {
		errorHandling(e);
	}

	if (present(state.message)) {
		window.showInformationMessage(state.message as string);
	}

	if (state.reload) {
		commands.executeCommand('workbench.action.reloadWindow');
	}
}

function present(value?: string): boolean {
	return (value && value.length > 0) ? true : false;
}

function updateHistory(state: Partial<State>): void {
	const setting = new ExtensionSetting();
	const history = {
		type:    Constant.DATA_TYPE.terminalCommand,
		name:    state.name                             as string,
		command: state.terminalCommand                  as string,
		autoRun: state.autoRun ? state.autoRun : false,
	} as History;

	if (setting.itemId.singleton in state) {
		history[setting.itemId.singleton] = state.singleton;
	}

	setting.updateHistory(history);
}


function executeTerminalCommand(
	name:      string,
	command:   string,
	autoRun:   boolean,
	singleton: boolean,
	state:     Partial<State>,
): void {
	if (singleton) {
		executeTerminalCommandWithSingleton(name, command, autoRun, state);
	} else {
		const terminal = window.activeTerminal ? window.activeTerminal : window.createTerminal();

		terminal.show();
		terminal.sendText(command, autoRun);
	}
}

function executeTerminalCommandWithSingleton(
	name:    string,
	command: string,
	autoRun: boolean,
	state:   Partial<State>,
): void {
	const already = window.terminals.find(terminal => name === terminal.name);

	if (already) {
		state.message = `'${name.replace(Constant.LABEL_STRING_MATCH, '')}' already executed.`;
	} else {
		const terminal = window.createTerminal(name);

		terminal.sendText(command, autoRun);
	}
}

function errorHandling(e: unknown) {
	if (e instanceof Error) {
		window.showWarningMessage(e.message);
		console.debug(e);
	}
}

export function getBaseState(additionalTitle: string): Partial<State> {
	return {
		title:            `Command Launcher${additionalTitle}`,
		workingDirectory: [],
		resultSet:        {},
	} as Partial<State>;
}

export async function edit(context: ExtensionContext): Promise<void> {
	const state = getBaseState(' - Edit mode ');
	const args  = [state, Constant.DATA_TYPE.folder, true, context];

	start('EditMenuGuide', state, args);
}

export async function launcher(context: ExtensionContext): Promise<void> {
	const state = getBaseState(' ');
	const args  = [state, true, context];

	start('MenuGuide', state, args);
}

export async function history(context: ExtensionContext): Promise<void> {
	const state = getBaseState(' - History ');
	const args  = [state, true, context];

	start('HistoryGuide', state, args);
}
