import * as vscode from 'vscode';

import * as History from '@/history';
import * as Kickstarter from '@/kickstarter';
import * as TreeView from '@/view/TreeView';

export function activate(context: vscode.ExtensionContext) {
  const [, refresh] = TreeView.initialize();

  context.subscriptions.push(
    vscode.commands.registerCommand('command-launcher.launcher', () => {
      Kickstarter.launcher(context);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('command-launcher.edit', () => {
      Kickstarter.edit(context, refresh);
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

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'command-launcher.execute-terminal-command',
      (args) => {
        Kickstarter.terminalCommand(context, args.command);
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('command-launcher.refresh', () => refresh())
  );
}

export function deactivate() {}
