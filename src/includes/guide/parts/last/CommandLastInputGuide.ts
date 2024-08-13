import { BaseValidator } from '../../validator';

import BaseLastInputGuide from './BaseLastInputGuide';

import * as Constant from '@/constant';
import { State } from '@/guide/base/type';

class CommandLastInputGuide extends BaseLastInputGuide {
  constructor(state: State) {
    super(state);

    this.itemId = this.settings.itemId.command;
    this.prompt = Constant.message.placeholder.edit.command;
    this.validate = BaseValidator.validateRequired;
  }

  protected async lastInputStepExecute(): Promise<void> {
    this.registData[this.settings.itemId.command] =
      this.guideGroupResultSet[this.settings.itemId.command];

    await super.lastInputStepExecute();
  }
}

export default CommandLastInputGuide;
