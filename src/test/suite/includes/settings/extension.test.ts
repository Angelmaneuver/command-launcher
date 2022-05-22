/* eslint @typescript-eslint/naming-convention: "off" */
import * as assert     from 'assert';
import * as _          from 'lodash';
import * as testTarget from '../../../../includes/settings/extension';

suite('Extension Setting Test Suite', async () => {
	const testData = {
		'nest5': {},
		'nest1 (test)': {
			'nest4': {
				'data': 'DDD'
			},
			'nest2 (test)': {
				'data': 'BBBB'
			},
			'data': 'AAAA',
		},
	};

	const sorted1 = {
		'nest1 (test)': {
			'nest4': {
				'data': 'DDD'
			},
			'nest2 (test)': {
				'data': 'BBBB'
			},
			'data': 'AAAA',
		},
		'nest5': {},
	};

	const sorted2 = {
		'nest5': {},
		'nest1 (test)': {
			'data': 'AAAA',
			'nest2 (test)': {
				'data': 'BBBB'
			},
			'nest4': {
				'data': 'DDD'
			},
		},
	};

	test('Default Value', async () => {
		const instance = new testTarget.ExtensionSetting();

		assert.deepStrictEqual({}, instance.commands);
	});

	test('lookup', async () => {
		const setup    = new testTarget.ExtensionSetting();
		setup.commands = testData;

		await setup.commit();

		let   instance = new testTarget.ExtensionSetting();

		let   data     = instance.lookup([], instance.lookupMode.read);
		assert.deepStrictEqual(testData, data);

		data           = instance.lookup(['nest1 (test)'], instance.lookupMode.read);
		assert.deepStrictEqual(testData['nest1 (test)'], data);

		try {
			instance.lookup(['nest1 (test)', 'nest3'], instance.lookupMode.read);
		} catch (e) {
			if (e instanceof Error) {
				assert.strictEqual('/nest1 (test)/nest3 is not found...', e.message);				
			}
		}

		data           = instance.lookup(['nest1 (test)', 'nest3'], instance.lookupMode.write);
		assert.deepStrictEqual({}, data);

		data['data']  = 'CCC';
		await instance.commit();

		data           = _.cloneDeep(testData) as Record<string, unknown>;
		(data['nest1 (test)'] as Record<string, unknown>)['nest3'] = { 'data': 'CCC' };
		instance       = new testTarget.ExtensionSetting();
		assert.deepStrictEqual(data, instance.commands);

		await setup.uninstall();
	}).timeout(30 * 1000);

	test('Clone Deep', async () => {
		const setup    = new testTarget.ExtensionSetting();
		setup.commands = testData;

		await setup.commit();

		let   instance = new testTarget.ExtensionSetting();

		assert.notStrictEqual(instance.commands, instance.cloneDeep([]));
		assert.deepStrictEqual(instance.commands, instance.cloneDeep([]));

		await setup.uninstall();
	}).timeout(30 * 1000);

	test('Delete', async () => {
		const setup    = new testTarget.ExtensionSetting();
		setup.commands = testData;

		await setup.commit();

		let   instance = new testTarget.ExtensionSetting();

		instance.delete(['nest1 (test)']);
		await instance.commit();
		instance       = new testTarget.ExtensionSetting();
		assert.deepStrictEqual({ 'nest5': {}}, instance.commands);

		await setup.commit();

		instance       = new testTarget.ExtensionSetting();
		instance.delete(['nest1 (test)', 'nest4']);
		await instance.commit();
		instance       = new testTarget.ExtensionSetting();
		const data     = _.cloneDeep(testData);
		delete (data['nest1 (test)'] as Record<string, unknown>)['nest4'];
		assert.deepStrictEqual(data, instance.commands);

		await setup.uninstall();
	}).timeout(30 * 1000);

	test('Sort', async () => {
		const setup    = new testTarget.ExtensionSetting();
		setup.commands = testData;

		await setup.commit();

		let   instance = new testTarget.ExtensionSetting();
		instance.sort([]);
		assert.deepStrictEqual(sorted1, instance.lookup([], instance.lookupMode.read));

		await setup.commit();

		instance       = new testTarget.ExtensionSetting();
		instance.sort(['nest1 (test)']);
		assert.deepStrictEqual(sorted2, instance.lookup([], instance.lookupMode.read));

		await setup.uninstall();
	}).timeout(30 * 1000);
});
