import * as Constant from '@/constant';
import BaseInputGuide from '@/guide/base/BaseInputGuid';
import { State } from '@/guide/base/type';
import { DataType } from '@/settings/extension';

class BaseNameInputGuide extends BaseInputGuide {
  protected type: DataType;

  constructor(state: State, type: DataType) {
    super(state);

    this.type = type;
    this.itemId = this.settings.itemId.name;
    this.prompt = Constant.message.placeholder.parts.name(
      this.type === this.settings.dataType.folder
        ? Constant.message.word.folder
        : Constant.message.word.command
    );
  }

  protected static async validator(
    value: string,
    keys: Array<string>
  ): Promise<string | undefined> {
    if (!value || value.length === 0) {
      return new Promise<string>((resolve) => {
        resolve(Constant.message.validate.required);
      });
    } else if (keys.includes(value)) {
      return new Promise<string>((resolve) => {
        resolve(Constant.message.validate.parts.name);
      });
    } else {
      return undefined;
    }
  }
}

export default BaseNameInputGuide;
