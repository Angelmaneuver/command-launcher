import * as vscode from 'vscode';

import TreeItem, { Data } from '../TreeItem';

import ExtensionSetting, { Location } from '@/settings/extension';

class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
  private settings: ExtensionSetting;

  private _onDidChangeTreeData: vscode.EventEmitter<
    TreeItem | undefined | null | void
  > = new vscode.EventEmitter<TreeItem | undefined | null | void>();

  public readonly onDidChangeTreeData: vscode.Event<
    TreeItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  constructor() {
    this.settings = new ExtensionSetting();
  }

  public refresh(): void {
    this.settings = new ExtensionSetting();

    this._onDidChangeTreeData.fire();
  }

  public getTreeItem(element: TreeItem) {
    return element;
  }

  public getChildren(element?: TreeItem) {
    if (element) {
      return Promise.resolve(this.getChildrens(element));
    } else {
      return Promise.resolve(this.initialize());
    }
  }

  private initialize(): Array<TreeItem> {
    return Object.entries(this.settings.getEntryPoint()).map(
      ([name, record]) =>
        new TreeItem({
          name: name,
          value: record,
          location: record.from,
          hierarchy: [name],
          hasChildren: this.hasChildren(record.from, [name]),
        })
    );
  }

  private getChildrens(element: TreeItem): Array<TreeItem> {
    return Object.entries(
      this.settings.lookup(
        element.data.hierarchy,
        element.data.location,
        this.settings.lookupMode.read
      )
    )
      .filter(([key]) => !this.settings.itemIdValues.includes(key))
      .map(([name, record]) => {
        const hierarchy = [...element.data.hierarchy, name];

        return new TreeItem({
          name: name,
          value: record as Data,
          location: element.data.location,
          hierarchy: hierarchy,
          hasChildren: this.hasChildren(element.data.location, hierarchy),
        });
      });
  }

  private hasChildren(location: Location, hierarchy: Array<string>): boolean {
    return (
      Object.keys(
        this.settings.lookup(hierarchy, location, this.settings.lookupMode.read)
      ).filter((key) => !this.settings.itemIdValues.includes(key)).length > 0
    );
  }
}

export default TreeDataProvider;
