import * as assert from 'assert';

import * as Constant from '@/constant';
import { State } from '@/guide/base/type';
import testTarget from '@/guide/parts/KeepHistoryNumber';

suite('Keep History Number Guide Validator Test Suite', async () => {
  test('Keep History Number valdator', async () => {
    const instance = new testTarget({} as State);

    assert.strictEqual(await instance.validator(''), undefined);
    assert.strictEqual(await instance.validator('0'), undefined);
    assert.strictEqual(await instance.validator('65555'), undefined);

    assert.strictEqual(
      await instance.validator('-1'),
      Constant.message.validate.history.keep
    );

    assert.strictEqual(
      await instance.validator('65556'),
      Constant.message.validate.history.keep
    );

    assert.strictEqual(
      await instance.validator('A'),
      Constant.message.validate.history.keep
    );
  });
});
