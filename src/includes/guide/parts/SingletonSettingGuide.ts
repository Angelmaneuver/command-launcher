import * as Constant from '@/constant';
import BaseYesOrNoGuide from '@/guide/base/BaseYesOrNoGuide';
import { State } from '@/guide/base/type';

class SingletonSettingGuide extends BaseYesOrNoGuide {
  constructor(state: State) {
    super(state, {
      yes: Constant.message.word.parts.singleton.yes,
      no: Constant.message.word.parts.singleton.no,
    });

    this.itemId = this.settings.itemId.singleton;
    this.state.placeholder = Constant.message.placeholder.parts.singleton;
  }
}

export default SingletonSettingGuide;
