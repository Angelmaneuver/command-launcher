import BaseNameInputGuide from './BaseNameInputGuide';

import { State } from '@/guide/base/type';
import { DataType } from '@/settings/extension';

class NameInputGuide extends BaseNameInputGuide {
  public static keys: Array<string> = [];

  constructor(state: State, type: DataType, keys: Array<string>) {
    super(state, type);

    NameInputGuide.keys = [...this.settings.itemIdValues, ...keys];
    this.validate = this.validateName;
  }

  public async validateName(value: string): Promise<string | undefined> {
    return NameInputGuide.validator(value, NameInputGuide.keys);
  }
}

export default NameInputGuide;
