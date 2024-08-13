import AbstractQuickPickGuide from './AbstractQuickPickGuide';

class BaseQuickPickGuide extends AbstractQuickPickGuide {
  public async after(): Promise<void> {
    await this.inputStepAfter();
  }
}

export default BaseQuickPickGuide;
