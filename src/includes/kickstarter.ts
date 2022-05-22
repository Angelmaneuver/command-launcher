import {
	window,
	commands,
	ExtensionContext
}                           from 'vscode';
import { MultiStepInput }   from './utils/multiStepInput';
import { State }            from './guide/base/base';
import { GuideFactory }     from './guide/factory/base';
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

function errorHandling(e: unknown) {
	if (e instanceof Error) {
		window.showWarningMessage(e.message);
		console.debug(e);
	}
}

export function getBaseState(additionalTitle: string): Partial<State> {
	return {
		title:            `Command Lanucher${additionalTitle}`,
		workingDirectory: [],
		resultSet:        {},
	} as Partial<State>;
}

export async function edit(context: ExtensionContext): Promise<void> {
	const state = getBaseState(' - Edit mode ');
	const args  = [state, Constant.DATA_TYPE.folder, true, context];

	start('MenuGuideWithEdit', state, args);
}

export async function launcher(context: ExtensionContext): Promise<void> {
	const state = getBaseState(' ');
	const args  = [state, true, context];

	start('MenuGuide', state, args);
}
