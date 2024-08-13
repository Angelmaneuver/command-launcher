import * as assert from 'assert';

import * as testTarget from '@/history';
import ExtensionSetting from '@/settings/extension';

suite('History Test Suite', async () => {
  test('Clear History', async () => {
    const setup = new ExtensionSetting();
    const history = {
      type: 3,
      name: '$(file) Node Terminal Command',
      command: 'terminal command',
      autoRun: true,
      singleton: false,
    };

    await setup.updateEnableHistory(true);
    await setup.updateHistory(history);

    assert.deepStrictEqual([history], new ExtensionSetting().history);

    await testTarget.clear();

    assert.deepStrictEqual([], new ExtensionSetting().history);
  }).timeout(30 * 1000);
});
