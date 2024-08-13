import * as assert from 'assert';

import * as vscode from 'vscode';

import * as testTarget from '../../extension';

suite('Extension Test Suite', () => {
  const extensionId = 'angelmaneuver.command-launcher';
  const extensionCommands = [
    'command-launcher.launcher',
    'command-launcher.edit',
    'command-launcher.history',
    'command-launcher.clear-history',
  ];

  test('Present', () => {
    assert.ok(vscode.extensions.getExtension(extensionId));
  });

  test('Activate', async () => {
    await vscode.extensions
      .getExtension(extensionId)
      ?.activate()
      .then(() => {
        assert.ok(true);
      });
  });

  test('Register Commands', async () => {
    return vscode.commands.getCommands(true).then((commands) => {
      for (const extensionCommand of extensionCommands) {
        if (!commands.includes(extensionCommand)) {
          assert.fail();
        }
      }
    });
  });

  test('DeActivate', async () => {
    testTarget.deactivate();
    assert.ok(true);
  });
});
