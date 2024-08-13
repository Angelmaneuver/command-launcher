import * as Constant from '@/constant';
import BaseQuickPickGuide from '@/guide/base/BaseQuickPickGuide';

const items = {
  yes: Constant.quickpick.parts.history.enable.yes,
  no: Constant.quickpick.parts.history.enable.no,
} as const;

class EnableHistoryGuide extends BaseQuickPickGuide {
  public init(): void {
    super.init();

    this.placeholder = Constant.message.placeholder.parts.history.enable;

    this.items = [items.yes, items.no];

    this.activeItem = this.settings.enableHistory ? items.yes : items.no;
  }

  protected async inputStepAfter(): Promise<void> {
    this.settings.updateEnableHistory(
      items.yes.label === this.activeItem?.label ? true : false
    );

    return super.inputStepAfter();
  }
}

export default EnableHistoryGuide;
