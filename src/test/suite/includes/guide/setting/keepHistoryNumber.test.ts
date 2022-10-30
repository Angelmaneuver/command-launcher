import * as assert     from 'assert';
import { State }       from '../../../../../includes/guide/base/base';
import * as testTarget from '../../../../../includes/guide/setting/keepHistoryNumber';

suite('Keep History Number Guide Validator Test Suite', async () => {
	test('Keep History Number valdator', async () => {
		const instance = new testTarget.KeepHistoryNumberGuide({} as State);

		assert.strictEqual(await instance.validator(''),       undefined);
		assert.strictEqual(await instance.validator('0'),      undefined);
		assert.strictEqual(await instance.validator('65555'),  undefined);

		assert.strictEqual(await instance.validator('-1'),     'Enter a number between 0 and 65555.');
		assert.strictEqual(await instance.validator('65556'),  'Enter a number between 0 and 65555.');
		assert.strictEqual(await instance.validator('A'),      'Enter a number between 0 and 65555.');
	});
});
