import BaseLastInputGuide from './BaseLastInputGuide';

import * as Constant from '@/constant';
import { State } from '@/guide/base/type';

class TextQuestionLastInputGuide extends BaseLastInputGuide {
  constructor(state: State) {
    super(state);

    this.itemId = this.settings.itemId.description;
    this.prompt = Constant.message.placeholder.edit.question.description;
  }

  protected async lastInputStepExecute(): Promise<void> {
    this.registName = this.guideGroupResultSet[
      this.settings.itemId.name
    ] as string;

    this.registData[this.settings.itemId.type] =
      this.settings.questionType.text;

    this.registData[this.settings.itemId.description] =
      this.guideGroupResultSet[this.settings.itemId.description];

    const registeredAt = this.settings.lookup(
      this.hierarchy,
      this.location,
      this.settings.lookupMode.write
    );

    registeredAt[this.registName] = this.registData;

    await this.settings.commit(this.location);

    this.state.back = true;
    this.prev();
  }
}

export default TextQuestionLastInputGuide;
