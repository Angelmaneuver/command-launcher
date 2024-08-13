import * as assert from 'assert';

import testTarget from '@/utils/VSCodePreset';

suite('VSCode Preset Utility Test Suite', () => {
  test('getAllIcons', () => {
    const result = testTarget.getAllIcons;

    Object.keys(testTarget.icons).forEach((key) => {
      const item = Reflect.get(testTarget.icons, key);
      const label = `${item.label} ${item.name}`;
      let exist = false;

      for (const icon of result) {
        exist = label === icon.label;

        if (exist) {
          break;
        }
      }

      assert.strictEqual(exist, true);
    });
  });

  test('create', () => {
    const label = 'label string';
    const description = 'description string';
    let result = testTarget.create(
      testTarget.icons.account,
      label,
      description
    );

    assert.strictEqual(result.label, `$(account) ${label}`);

    assert.strictEqual(result.description, description);

    result = testTarget.create(testTarget.icons.account);

    assert.strictEqual(result.label, testTarget.icons.account.label);

    assert.strictEqual(result.description, undefined);
  });
});
