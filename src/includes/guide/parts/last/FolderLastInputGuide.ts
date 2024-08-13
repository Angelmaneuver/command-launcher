import BaseLastInputGuide from './BaseLastInputGuide';

import * as Constant from '@/constant';
import { State } from '@/guide/base/type';

class FolderLastInputGuide extends BaseLastInputGuide {
  constructor(state: State) {
    super(state);

    this.itemId = this.settings.itemId.description;
    this.prompt = Constant.message.placeholder.edit.description(
      Constant.message.word.folder
    );
  }
}

export default FolderLastInputGuide;
