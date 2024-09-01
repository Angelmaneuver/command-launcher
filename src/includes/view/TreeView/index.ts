import * as vscode from 'vscode';

import TreeDataProvider from './TreeDataProvider';
import TreeItem from './TreeItem';

type Refresh = () => void;

function initialize(): [vscode.TreeView<TreeItem>, Refresh] {
  const treeDataProvider = new TreeDataProvider();

  return [
    vscode.window.createTreeView('command-launcher.view', {
      treeDataProvider: treeDataProvider,
    }),
    () => treeDataProvider.refresh(),
  ];
}

export { initialize };
