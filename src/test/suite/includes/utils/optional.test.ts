import * as assert from 'assert';

import testTarget from '@/utils/optional';

suite('Optional Utility Test Suite', () => {
  const error = new Error();

  test('Empty', () => {
    const instance = testTarget.empty();

    assert.strictEqual(instance instanceof testTarget, true);
    assert.strictEqual(instance.isPresent(), false);
    assert.strictEqual(instance.orElseNonNullable('valid'), 'valid');
    assert.strictEqual(instance.orElseNullable(undefined), undefined);

    try {
      instance.orElseThrow(error);
    } catch (e) {
      assert(e instanceof Error);
    }
  });

  test('Nullable - undefined', () => {
    const instance = testTarget.ofNullable(undefined);

    assert.strictEqual(instance instanceof testTarget, true);
    assert.strictEqual(instance.isPresent(), false);

    try {
      instance.orElseThrow(error);
    } catch (e) {
      assert(e instanceof Error);
    }
  });

  test('ofNullable - null', () => {
    const instance = testTarget.ofNullable(null);

    assert.strictEqual(instance instanceof testTarget, true);
    assert.strictEqual(instance.isPresent(), false);

    try {
      instance.orElseThrow(error);
    } catch (e) {
      assert(e instanceof Error);
    }
  });

  test('ofNullable - String', () => {
    let instance = testTarget.ofNullable('');

    assert.strictEqual(instance instanceof testTarget, true);
    assert.strictEqual(instance.isPresent(), true);
    assert.strictEqual(instance.orElseNonNullable('valid'), '');
    assert.strictEqual(instance.orElseNullable(undefined), '');
    assert.strictEqual(instance.orElseThrow(error), '');

    instance = testTarget.ofNullable('string');

    assert.strictEqual(instance instanceof testTarget, true);
    assert.strictEqual(instance.isPresent(), true);
    assert.strictEqual(instance.orElseNonNullable('valid'), 'string');
    assert.strictEqual(instance.orElseNullable(undefined), 'string');
    assert.strictEqual(instance.orElseThrow(error), 'string');
  });

  test('ofNullable - Number', () => {
    let instance = testTarget.ofNullable(0);

    assert.strictEqual(instance instanceof testTarget, true);
    assert.strictEqual(instance.isPresent(), true);
    assert.strictEqual(instance.orElseNonNullable(1), 0);
    assert.strictEqual(instance.orElseNullable(undefined), 0);
    assert.strictEqual(instance.orElseThrow(error), 0);

    instance = testTarget.ofNullable(1);

    assert.strictEqual(instance instanceof testTarget, true);
    assert.strictEqual(instance.isPresent(), true);
    assert.strictEqual(instance.orElseNonNullable(0), 1);
    assert.strictEqual(instance.orElseNullable(undefined), 1);
    assert.strictEqual(instance.orElseThrow(error), 1);
  });

  test('ofNullable - Array', () => {
    const testArray1 = [0];
    const testArray2 = [0, 1];
    const instance1 = testTarget.ofNullable([]);

    assert.strictEqual(instance1 instanceof testTarget, true);
    assert.strictEqual(instance1.isPresent(), true);

    const instance2 = testTarget.ofNullable(testArray1);

    assert.strictEqual(instance2 instanceof testTarget, true);
    assert.strictEqual(instance2.isPresent(), true);
    assert.strictEqual(instance2.orElseNonNullable(testArray2), testArray1);
    assert.strictEqual(instance2.orElseNullable(undefined), testArray1);
    assert.strictEqual(instance2.orElseThrow(error), testArray1);
  });
});
