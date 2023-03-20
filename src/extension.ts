import * as vscode      from 'vscode';
import * as Kickstarter from './includes/kickstarter';
import * as History     from './includes/history';

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

	context.subscriptions.push(
		vscode.commands.registerCommand('command-launcher.clear-history', () => {
			History.clear();
		})
	);
}

export function deactivate() {}
