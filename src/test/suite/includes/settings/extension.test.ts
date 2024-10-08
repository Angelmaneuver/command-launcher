import * as assert from 'assert';

import * as _ from 'lodash';

import ExtensionSetting from '@/settings/extension';

suite('Extension Setting Test Suite', async () => {
  const testData1 = {
    nest5: {},
    'nest1 (test)': {
      nest4: {
        data: 'DDD',
      },
      'nest2 (test)': {
        data: 'BBBB',
      },
      data: 'AAAA',
    },
  };

  const testData2 = {
    nest5: {
      orderNo: '0',
    },
    'nest1 (test)': {
      nest4: {
        orderNo: '2',
        data: 'DDD',
      },
      'nest2 (test)': {
        orderNo: '10',
        data: 'BBBB',
      },
      data: {
        orderNo: '5',
      },
    },
  };

  const sorted1 = {
    'nest1 (test)': {
      nest4: {
        data: 'DDD',
      },
      'nest2 (test)': {
        data: 'BBBB',
      },
      data: 'AAAA',
    },
    nest5: {},
  };

  const sorted2 = {
    nest5: {},
    'nest1 (test)': {
      data: 'AAAA',
      'nest2 (test)': {
        data: 'BBBB',
      },
      nest4: {
        data: 'DDD',
      },
    },
  };

  const sorted3 = {
    nest5: {
      orderNo: '0',
    },
    'nest1 (test)': {
      nest4: {
        orderNo: '2',
        data: 'DDD',
      },
      data: {
        orderNo: '5',
      },
      'nest2 (test)': {
        orderNo: '10',
        data: 'BBBB',
      },
    },
  };

  test('Default Value', async () => {
    await new ExtensionSetting().uninstall();

    const instance = new ExtensionSetting();

    assert.deepStrictEqual({}, instance.commonCommands);
    assert.deepStrictEqual({}, instance.profileCommands);
  });

  test('lookup - Common Commands', async () => {
    const setup = new ExtensionSetting();
    setup.commonCommands = testData1;

    await setup.commit(setup.location.user);

    let instance = new ExtensionSetting();

    let data = instance.lookup(
      [],
      setup.location.user,
      instance.lookupMode.read
    );

    assert.deepStrictEqual(testData1, data);

    data = instance.lookup(
      ['nest1 (test)'],
      setup.location.user,
      instance.lookupMode.read
    );

    assert.deepStrictEqual(testData1['nest1 (test)'], data);

    try {
      instance.lookup(
        ['nest1 (test)', 'nest3'],
        setup.location.user,
        instance.lookupMode.read
      );
    } catch (e) {
      if (e instanceof Error) {
        assert.strictEqual('/nest1 (test)/nest3 is not found...', e.message);
      }
    }

    data = instance.lookup(
      ['nest1 (test)', 'nest3'],
      setup.location.user,
      instance.lookupMode.write
    );

    assert.deepStrictEqual({}, data);

    data['data'] = 'CCC';
    await instance.commit(setup.location.user);

    data = _.cloneDeep(testData1) as Record<string, unknown>;

    (data['nest1 (test)'] as Record<string, unknown>)['nest3'] = {
      data: 'CCC',
    };

    instance = new ExtensionSetting();

    assert.deepStrictEqual(data, instance.commonCommands);

    await setup.uninstall();
  }).timeout(30 * 1000);

  test('lookup - Profile Commands', async () => {
    const setup = new ExtensionSetting();
    setup.profileCommands = testData1;

    await setup.commit(setup.location.profile);

    let instance = new ExtensionSetting();

    let data = instance.lookup(
      [],
      setup.location.profile,
      instance.lookupMode.read
    );

    assert.deepStrictEqual(testData1, data);

    data = instance.lookup(
      ['nest1 (test)'],
      setup.location.profile,
      instance.lookupMode.read
    );

    assert.deepStrictEqual(testData1['nest1 (test)'], data);

    try {
      instance.lookup(
        ['nest1 (test)', 'nest3'],
        setup.location.profile,
        instance.lookupMode.read
      );
    } catch (e) {
      if (e instanceof Error) {
        assert.strictEqual('/nest1 (test)/nest3 is not found...', e.message);
      }
    }

    data = instance.lookup(
      ['nest1 (test)', 'nest3'],
      setup.location.profile,
      instance.lookupMode.write
    );

    assert.deepStrictEqual({}, data);

    data['data'] = 'CCC';

    await instance.commit(setup.location.profile);

    data = _.cloneDeep(testData1) as Record<string, unknown>;

    (data['nest1 (test)'] as Record<string, unknown>)['nest3'] = {
      data: 'CCC',
    };

    instance = new ExtensionSetting();

    assert.deepStrictEqual(data, instance.profileCommands);

    await setup.uninstall();
  }).timeout(30 * 1000);

  test('Clone Deep - Common Commands', async () => {
    const setup = new ExtensionSetting();
    setup.commonCommands = testData1;

    await setup.commit(setup.location.user);

    const instance = new ExtensionSetting();

    assert.notStrictEqual(
      instance.commonCommands,
      instance.cloneDeep([], setup.location.user)
    );

    assert.deepStrictEqual(
      instance.commonCommands,
      instance.cloneDeep([], setup.location.user)
    );

    await setup.uninstall();
  }).timeout(30 * 1000);

  test('Clone Deep - Profile Commands', async () => {
    const setup = new ExtensionSetting();
    setup.profileCommands = testData1;

    await setup.commit(setup.location.profile);

    const instance = new ExtensionSetting();

    assert.notStrictEqual(
      instance.profileCommands,
      instance.cloneDeep([], setup.location.profile)
    );
    assert.deepStrictEqual(
      instance.profileCommands,
      instance.cloneDeep([], setup.location.profile)
    );

    await setup.uninstall();
  }).timeout(30 * 1000);

  test('Delete - Common Commands', async () => {
    const setup = new ExtensionSetting();
    setup.commonCommands = testData1;

    await setup.commit(setup.location.user);

    let instance = new ExtensionSetting();

    instance.delete(['nest1 (test)'], setup.location.user);

    await instance.commit(setup.location.user);

    instance = new ExtensionSetting();

    assert.deepStrictEqual({ nest5: {} }, instance.commonCommands);

    await setup.commit(setup.location.user);

    instance = new ExtensionSetting();

    instance.delete(['nest1 (test)', 'nest4'], setup.location.user);

    await instance.commit(setup.location.user);

    instance = new ExtensionSetting();

    const data = _.cloneDeep(testData1);

    delete (data['nest1 (test)'] as Record<string, unknown>)['nest4'];

    assert.deepStrictEqual(data, instance.commonCommands);

    await setup.uninstall();
  }).timeout(30 * 1000);

  test('Delete - Profile Commands', async () => {
    const setup = new ExtensionSetting();
    setup.profileCommands = testData1;

    await setup.commit(setup.location.profile);

    let instance = new ExtensionSetting();

    instance.delete(['nest1 (test)'], setup.location.profile);

    await instance.commit(setup.location.profile);

    instance = new ExtensionSetting();

    assert.deepStrictEqual({ nest5: {} }, instance.profileCommands);

    await setup.commit(setup.location.profile);

    instance = new ExtensionSetting();

    instance.delete(['nest1 (test)', 'nest4'], setup.location.profile);

    await instance.commit(setup.location.profile);

    instance = new ExtensionSetting();

    const data = _.cloneDeep(testData1);

    delete (data['nest1 (test)'] as Record<string, unknown>)['nest4'];

    assert.deepStrictEqual(data, instance.profileCommands);

    await setup.uninstall();
  }).timeout(30 * 1000);

  test('Sort 1 - Common Commands', async () => {
    const setup = new ExtensionSetting();
    setup.commonCommands = testData1;

    await setup.commit(setup.location.user);

    let instance = new ExtensionSetting();

    instance.sort([], setup.location.user);

    assert.deepStrictEqual(
      sorted1,
      instance.lookup([], setup.location.user, instance.lookupMode.read)
    );

    await setup.commit(setup.location.user);

    instance = new ExtensionSetting();

    instance.sort(['nest1 (test)'], setup.location.user);

    assert.deepStrictEqual(
      sorted2,
      instance.lookup([], setup.location.user, instance.lookupMode.read)
    );

    await setup.uninstall();
  }).timeout(30 * 1000);

  test('Sort 1 - Profile Commands', async () => {
    const setup = new ExtensionSetting();
    setup.profileCommands = testData1;

    await setup.commit(setup.location.profile);

    let instance = new ExtensionSetting();

    instance.sort([], setup.location.profile);

    assert.deepStrictEqual(
      sorted1,
      instance.lookup([], setup.location.profile, instance.lookupMode.read)
    );

    await setup.commit(setup.location.profile);

    instance = new ExtensionSetting();

    instance.sort(['nest1 (test)'], setup.location.profile);

    assert.deepStrictEqual(
      sorted2,
      instance.lookup([], setup.location.profile, instance.lookupMode.read)
    );

    await setup.uninstall();
  }).timeout(30 * 1000);

  test('Sort 2 - Common Commands', async () => {
    const setup = new ExtensionSetting();
    setup.commonCommands = testData2;

    await setup.commit(setup.location.user);

    let instance = new ExtensionSetting();

    instance.sort([], setup.location.user);

    assert.deepStrictEqual(
      testData2,
      instance.lookup([], setup.location.user, instance.lookupMode.read)
    );

    await setup.commit(setup.location.user);

    instance = new ExtensionSetting();

    instance.sort(['nest1 (test)'], setup.location.user);

    assert.deepStrictEqual(
      sorted3,
      instance.lookup([], setup.location.user, instance.lookupMode.read)
    );

    await setup.uninstall();
  }).timeout(30 * 1000);

  test('Sort 2 - Profile Commands', async () => {
    const setup = new ExtensionSetting();
    setup.profileCommands = testData2;

    await setup.commit(setup.location.profile);

    let instance = new ExtensionSetting();

    instance.sort([], setup.location.profile);

    assert.deepStrictEqual(
      testData2,
      instance.lookup([], setup.location.profile, instance.lookupMode.read)
    );

    await setup.commit(setup.location.profile);

    instance = new ExtensionSetting();

    instance.sort(['nest1 (test)'], setup.location.profile);

    assert.deepStrictEqual(
      sorted3,
      instance.lookup([], setup.location.profile, instance.lookupMode.read)
    );

    await setup.uninstall();
  }).timeout(30 * 1000);

  test('Enable History', async () => {
    const setup = new ExtensionSetting();
    const instance = new ExtensionSetting();

    assert.strictEqual(false, instance.enableHistory);

    await instance.updateEnableHistory(true);

    assert.strictEqual(true, instance.enableHistory);

    await instance.updateEnableHistory(false);

    assert.strictEqual(false, instance.enableHistory);

    await setup.uninstall();
  }).timeout(30 * 1000);

  test('Keep History Number', async () => {
    const setup = new ExtensionSetting();
    const instance = new ExtensionSetting();

    assert.strictEqual(10, instance.keepHistoryNumber);

    await instance.updateKeepHistoryNumber(100);

    assert.strictEqual(100, instance.keepHistoryNumber);

    await instance.updateKeepHistoryNumber(10);

    assert.strictEqual(10, instance.keepHistoryNumber);

    await setup.uninstall();
  }).timeout(30 * 1000);

  test('History', async () => {
    const command00 = {
      type: 0,
      name: 'test0',
      command: 'command0',
      autoRun: false,
    };
    const command01 = {
      type: 1,
      name: 'test1',
      command: 'command1',
      autoRun: true,
    };
    const command02 = {
      type: 2,
      name: 'test2',
      command: 'command2',
      autoRun: false,
    };
    const command03 = {
      type: 3,
      name: 'test3',
      command: 'command3',
      autoRun: true,
    };
    const command04 = {
      type: 4,
      name: 'test4',
      command: 'command4',
      autoRun: false,
    };
    const command05 = {
      type: 5,
      name: 'test5',
      command: 'command5',
      autoRun: true,
    };
    const command06 = {
      type: 6,
      name: 'test6',
      command: 'command6',
      autoRun: false,
    };
    const command07 = {
      type: 7,
      name: 'test7',
      command: 'command7',
      autoRun: true,
    };
    const command08 = {
      type: 8,
      name: 'test8',
      command: 'command8',
      autoRun: false,
    };
    const command09 = {
      type: 9,
      name: 'test9',
      command: 'command9',
      autoRun: true,
    };
    const command10 = {
      type: 10,
      name: 'test10',
      command: 'command10',
      autoRun: false,
    };
    const command11 = {
      type: 11,
      name: 'test11',
      command: 'command5',
      autoRun: true,
    };

    const setup = new ExtensionSetting();
    const instance = new ExtensionSetting();

    assert.deepStrictEqual([], instance.history);

    await instance.updateHistory(command00);

    assert.deepStrictEqual([], instance.history);

    await instance.updateEnableHistory(true);

    await instance.updateHistory(command00);

    assert.deepStrictEqual([command00], instance.history);

    await instance.updateHistory(command01);
    await instance.updateHistory(command02);
    await instance.updateHistory(command03);
    await instance.updateHistory(command04);
    await instance.updateHistory(command05);
    await instance.updateHistory(command06);
    await instance.updateHistory(command07);
    await instance.updateHistory(command08);
    await instance.updateHistory(command09);

    assert.deepStrictEqual(
      [
        command09,
        command08,
        command07,
        command06,
        command05,
        command04,
        command03,
        command02,
        command01,
        command00,
      ],
      instance.history
    );

    await instance.updateHistory(command10);
    await instance.updateHistory(command11);

    assert.deepStrictEqual(
      [
        command11,
        command10,
        command09,
        command08,
        command07,
        command06,
        command04,
        command03,
        command02,
        command01,
      ],
      instance.history
    );

    await setup.uninstall();
  }).timeout(30 * 1000);
});
