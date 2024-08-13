import BaseNameInputGuide from './BaseNameInputGuide';

import { State } from '@/guide/base/type';
import { DataType } from '@/settings/extension';

class NameInputGuide4SQLInputGuide extends BaseNameInputGuide {
  public static keys: Array<string> = [];

  constructor(state: State, type: DataType, keys: Array<string>) {
    super(state, type);

    NameInputGuide4SQLInputGuide.keys = keys;
    this.validate = this.validateName;
  }

  public async validateName(value: string): Promise<string | undefined> {
    return NameInputGuide4SQLInputGuide.validator(
      value,
      NameInputGuide4SQLInputGuide.keys
    );
  }
}

export default NameInputGuide4SQLInputGuide;
