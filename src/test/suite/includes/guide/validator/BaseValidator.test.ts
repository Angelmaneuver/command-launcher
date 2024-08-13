import * as assert from 'assert';

import * as Constant from '@/constant';
import { BaseValidator as testTarget } from '@/guide/validator/_BaseValidator';

suite('Guide Validator Test Suite', async () => {
  test('validateRequired', async () => {
    assert.strictEqual(await testTarget.validateRequired('0'), undefined);

    assert.strictEqual(await testTarget.validateRequired('-'), undefined);

    assert.strictEqual(await testTarget.validateRequired('a'), undefined);

    assert.strictEqual(await testTarget.validateRequired('A'), undefined);

    assert.strictEqual(await testTarget.validateRequired('あ'), undefined);

    assert.strictEqual(await testTarget.validateRequired('亞'), undefined);

    assert.strictEqual(
      await testTarget.validateRequired(''),
      Constant.message.validate.required
    );
  });
});
