import * as vscode      from 'vscode';
import * as Kickstarter from './includes/kickstarter';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('command-launcher.launcher', () => {
			Kickstarter.launcher(context);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('command-launcher.edit', () => {
			Kickstarter.edit(context);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('command-launcher.history', () => {
			Kickstarter.history(context);
		})
	);
}

export function deactivate() {}
