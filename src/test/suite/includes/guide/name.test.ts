import * as assert     from 'assert';
import * as testTarget from '../../../../includes/guide/name';
import { State }       from '../../../../includes/guide/base/base';
import * as Constant   from '../../../../includes/constant';

suite('Name Guide Validator Test Suite', async () => {
	test('validateName', async () => {
		testTarget.NameInputGuide.keys = ['A', 'B', 'C'];
		const instance                 = new testTarget.NameInputGuide({} as State, Constant.DATA_TYPE.command, ['A', 'B', 'C']);

		assert.strictEqual(await instance.validateName('0'),  undefined);
		assert.strictEqual(await instance.validateName('-'),  undefined);
		assert.strictEqual(await instance.validateName('a'),  undefined);
		assert.strictEqual(await instance.validateName('D'),  undefined);
		assert.strictEqual(await instance.validateName('あ'), undefined);
		assert.strictEqual(await instance.validateName('亞'), undefined);

		assert.strictEqual(await instance.validateName(''),   "Required field.");
		assert.strictEqual(await instance.validateName('A'),  "The name you entered is already in use.");
		assert.strictEqual(await instance.validateName('B'),  "The name you entered is already in use.");
		assert.strictEqual(await instance.validateName('C'),  "The name you entered is already in use.");
	});
});
