import BaseYesOrNoGuide from '../base/BaseYesOrNoGuide';
import { State } from '../base/type';

import * as Constant from '@/constant';

class AutoRunSettingGuide extends BaseYesOrNoGuide {
  constructor(state: State) {
    super(state, {
      yes: Constant.message.word.parts.autoRun.yes,
      no: Constant.message.word.parts.autoRun.no,
    });

    this.itemId = this.settings.itemId.autoRun;
    this.state.placeholder = Constant.message.placeholder.parts.autoRun;
  }
}

export default AutoRunSettingGuide;
