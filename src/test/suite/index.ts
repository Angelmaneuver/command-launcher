/* eslint @typescript-eslint/naming-convention: "off" */
import * as path  from 'path';
import * as Mocha from 'mocha';
import * as glob  from 'glob';

const NYC        = require('nyc');
const baseConfig = require('@istanbuljs/nyc-config-typescript');

function getNycInstance(): typeof NYC {
	const nyc = new NYC({
		...baseConfig,
		cwd: path.join(__dirname, '..', '..', '..' ),
		reporter: ['text-summary', 'lcov', 'html'],
		all: true,
		silent: false,
		instrument: true,
		hookRequire: true,
		hookRunInContext: true,
		hookRunInThisContext: true,
		sourceMap: true,
		include: ['src/**/*.ts', 'out/**/*.js'],
		exclude: ['**/test/*'],
	});

	nyc.reset();
	nyc.wrap();

	return nyc;
}

export async function run(): Promise<void> {
	const testsRoot = path.resolve(__dirname, '..');

	// Sets the test coverage
	const nyc = '1' === process.env['COVERAGE'] ? getNycInstance() : undefined;

	// Create the mocha test
	const mocha = new Mocha({
		ui:    'tdd',
		color: true
	});

	// Backup of settings.json and clear
	const { ExtensionSetting } = require('../../includes/settings/extension');
	const backup               = new ExtensionSetting();

	await new ExtensionSetting().uninstall();

	return new Promise((c, e) => {
		glob('**/**.test.js', { cwd: testsRoot }, (err, files) => {
			if (err) {
				return e(err);
			}

			// Add files to the test suite
			files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

			try {
				// Run the mocha test
				mocha.run(async failures => {
					await backup.commit(backup.location.user);
					await backup.commit(backup.location.profile);

					if (failures > 0) {
						e(new Error(`${failures} tests failed.`));
					} else {
						if (nyc) {
							nyc.writeCoverageFile();
							await nyc.report();
						}

						c();
					}
				});
			} catch (err) {
				console.error(err);
				e(err);
			}
		});
	});
}
