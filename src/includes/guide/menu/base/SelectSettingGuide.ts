import * as Constant from '@/constant';
import MultiStepInput, { InputStep } from '@/guide/abc/multiStepInput';
import AbstractQuickPickSelectGuide from '@/guide/base/AbstractQuickPickSelectGuide';

const items = {
  enableHistory: Constant.quickpick.edit.setting.enableHistory,
  keepHistoryNumber: Constant.quickpick.edit.setting.keepHistoryNumber,
};

class SelectSettingGuide extends AbstractQuickPickSelectGuide {
  public async show(input: MultiStepInput): Promise<void | InputStep> {
    this.items = [items.enableHistory]
      .concat(this.settings.enableHistory ? items.keepHistoryNumber : [])
      .concat(Constant.quickpick.common.return);

    await super.show(input);
  }

  protected getExecute(
    label: string | undefined
  ): (() => Promise<void>) | undefined {
    switch (label) {
      case items.enableHistory.label:
        return async () => {
          this.setNextSteps([{ key: 'EnableHistoryGuide' }]);
        };
      case items.keepHistoryNumber.label:
        return async () => {
          this.setNextSteps([{ key: 'KeepHistoryNumberGuide' }]);
        };
      default:
        return async () => {
          this.prev();
        };
    }
  }
}

export default SelectSettingGuide;
