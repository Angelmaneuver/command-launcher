import BaseYesOrNoGuide from '../base/BaseYesOrNoGuide';
import { State } from '../base/type';

import * as Constant from '@/constant';

class ConfirmSettingGuide extends BaseYesOrNoGuide {
  constructor(state: State) {
    super(state, {
      yes: Constant.message.word.parts.confirm.yes,
      no: Constant.message.word.parts.confirm.no,
    });

    this.itemId = this.settings.itemId.confirm;
    this.state.placeholder = Constant.message.placeholder.parts.confirm;
  }
}

export default ConfirmSettingGuide;
