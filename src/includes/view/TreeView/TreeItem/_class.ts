import * as vscode from 'vscode';

import { matcher } from './_constant';
import {
  Location,
  Hierarchy,
  Data,
  DATA_TYPE,
  Command,
  TerminalCommand,
} from './_type';

class TreeItem extends vscode.TreeItem {
  constructor(
    public readonly data: {
      name: string;
      value: Data;
      location: Location;
      hierarchy: Hierarchy;
      hasChildren: boolean;
    }
  ) {
    super(
      data.name,
      data.hasChildren
        ? vscode.TreeItemCollapsibleState.Collapsed
        : vscode.TreeItemCollapsibleState.None
    );

    this.iconPath = TreeItem.getIconPath(data.value.label);
    this.description = data.value.description;
    this.tooltip = new vscode.MarkdownString(`
#### ${data.name}
----
${data.value.description}
`);

    if (data.value.type === DATA_TYPE.command) {
      const command = this.data.value as Command;

      this.command = {
        title: '',
        command: command.command,
      };
    } else if (data.value.type === DATA_TYPE.terminalCommand) {
      const command = this.data.value as TerminalCommand;

      command.name = data.name;

      this.command = {
        title: '',
        command: 'command-launcher.execute-terminal-command',
        arguments: [{ command }],
      };
    }
  }

  private static getIconPath(label?: string) {
    if (typeof label !== 'string') {
      return label;
    }

    const id = label.match(matcher);

    if (id === null || id.groups === undefined) {
      return label;
    } else {
      return new vscode.ThemeIcon(id.groups.value);
    }
  }
}

export default TreeItem;
