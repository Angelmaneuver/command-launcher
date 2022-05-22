import * as assert     from 'assert';
import * as testTarget from '../../../../../includes/utils/base/vscodePreset';

suite('VSCode Preset Utility Test Suite', () => {
	test('getAllIcons', () => {
		const result = testTarget.VSCodePreset.getAllIcons;

		Object.keys(testTarget.VSCodePreset.icons).forEach(
			(key) => {
				const item  = testTarget.VSCodePreset.icons[key];
				const label = `${item.label} ${item.name}`;
				let   exist = false;

				for (const icon of result) {
					exist = label === icon.label;

					if (exist) {
						break;
					}
				}

				assert.strictEqual(exist, true);
			}
		);
	});

	test('create', () => {
		const label       = 'label string';
		const description = 'description string';
		let   result      = testTarget.VSCodePreset.create(testTarget.VSCodePreset.icons.account, label, description);

		assert.strictEqual(result.label,       `$(account) ${label}`);
		assert.strictEqual(result.description, description);

		result            = testTarget.VSCodePreset.create(testTarget.VSCodePreset.icons.account);

		assert.strictEqual(result.label,       testTarget.VSCodePreset.icons.account.label);
		assert.strictEqual(result.description, testTarget.VSCodePreset.icons.account.description);
	});
});
