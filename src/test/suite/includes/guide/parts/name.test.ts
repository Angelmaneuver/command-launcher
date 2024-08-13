import * as assert from 'assert';

import * as Constant from '@/constant';
import { State } from '@/guide/base/type';
import testTarget from '@/guide/parts/name/NameInputGuide';
import { DATA_TYPE } from '@/settings/extension';

suite('Name Guide Validator Test Suite', async () => {
  test('validateName', async () => {
    testTarget.keys = ['A', 'B', 'C'];
    const instance = new testTarget({} as State, DATA_TYPE.command, [
      'A',
      'B',
      'C',
    ]);

    assert.strictEqual(await instance.validateName('0'), undefined);
    assert.strictEqual(await instance.validateName('-'), undefined);
    assert.strictEqual(await instance.validateName('a'), undefined);
    assert.strictEqual(await instance.validateName('D'), undefined);
    assert.strictEqual(await instance.validateName('あ'), undefined);
    assert.strictEqual(await instance.validateName('亞'), undefined);

    assert.strictEqual(
      await instance.validateName(''),
      Constant.message.validate.required
    );

    assert.strictEqual(
      await instance.validateName('A'),
      Constant.message.validate.parts.name
    );

    assert.strictEqual(
      await instance.validateName('B'),
      Constant.message.validate.parts.name
    );

    assert.strictEqual(
      await instance.validateName('C'),
      Constant.message.validate.parts.name
    );
  });
});
