import * as path from 'path';

import * as glob from 'glob';
import * as Mocha from 'mocha';

/* eslint-disable @typescript-eslint/no-var-requires */
const baseConfig = require('@istanbuljs/nyc-config-typescript');
const NYC = require('nyc');
/* eslint-enable @typescript-eslint/no-var-requires */

function getNycInstance(): typeof NYC {
  const nyc = new NYC({
    ...baseConfig,
    cwd: path.join(__dirname, '..', '..', '..'),
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
    ui: 'tdd',
    color: true,
  });

  // Backup of settings.json and clear
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ExtensionSetting = require('@/settings/extension');

  const backup = new ExtensionSetting.default();

  await new ExtensionSetting.default().uninstall();

  return new Promise((c, e) => {
    glob('**/**.test.js', { cwd: testsRoot }, async (err, files) => {
      if (err) {
        await backup.commit(backup.location.user);
        await backup.commit(backup.location.profile);

        return e(err);
      }

      // Add files to the test suite
      files.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)));

      // Run the mocha test
      mocha.run(async (failures) => {
        if (failures > 0) {
          await backup.commit(backup.location.user);
          await backup.commit(backup.location.profile);

          e(new Error(`${failures} tests failed.`));
        } else {
          if (nyc) {
            nyc.writeCoverageFile();
            await nyc.report();
          }

          await backup.commit(backup.location.user);
          await backup.commit(backup.location.profile);

          c();
        }
      });
    });
  });
}
