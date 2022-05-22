import * as assert     from 'assert';
import * as testTarget from '../../../../../includes/guide/validator/base';

suite('Guide Validator Test Suite', async () => {
	test('validateRequired', async () => {
		assert.strictEqual(await testTarget.BaseValidator.validateRequired('0'),  undefined);
		assert.strictEqual(await testTarget.BaseValidator.validateRequired('-'),  undefined);
		assert.strictEqual(await testTarget.BaseValidator.validateRequired('a'),  undefined);
		assert.strictEqual(await testTarget.BaseValidator.validateRequired('A'),  undefined);
		assert.strictEqual(await testTarget.BaseValidator.validateRequired('あ'), undefined);
		assert.strictEqual(await testTarget.BaseValidator.validateRequired('亞'), undefined);

		assert.strictEqual(await testTarget.BaseValidator.validateRequired(''),   "Required field.");
	});
});
