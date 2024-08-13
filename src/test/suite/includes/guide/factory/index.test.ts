import * as assert from 'assert';

import BaseInputGuide from '@/guide/base/BaseInputGuid';
import { State } from '@/guide/base/type';
import testTarget from '@/guide/factory';

suite('Guide Factory Test Suite', async () => {
  test('create', async () => {
    const instance = testTarget.create('BaseInputGuide', {} as Partial<State>);
    assert(instance instanceof BaseInputGuide);
  });

  test('create - Non Exist Class', () => {
    const className = 'Not Exist Class';

    try {
      testTarget.create(className);
    } catch (e) {
      assert(e instanceof ReferenceError);
    }
  });
});
