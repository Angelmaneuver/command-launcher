import BaseQuickPickGuide from './BaseQuickPickGuide';
import { State } from './type';

import * as Constant from '@/constant';
import VSCodePreset from '@/utils/VSCodePreset';

class BaseYesOrNoGuide extends BaseQuickPickGuide {
  constructor(state: State, description: { yes: string; no: string }) {
    super(state);

    this.state.items = [
      VSCodePreset.create(
        VSCodePreset.icons.check,
        Constant.message.word.Yes,
        description.yes
      ),
      VSCodePreset.create(
        VSCodePreset.icons.x,
        Constant.message.word.No,
        description.no
      ),
    ];
  }

  public init(): void {
    super.init();

    this.activeItem = this.initialValue ? this.items[0] : this.items[1];
  }

  protected async inputStepAfter(): Promise<void> {
    this.guideGroupResultSet[this.itemId] =
      this.items[0].label === this.guideGroupResultSet[this.itemId]
        ? true
        : false;

    return super.inputStepAfter();
  }
}

export default BaseYesOrNoGuide;
