import AbstractQuickPickGuide from './AbstractQuickPickGuide';

abstract class AbstractQuickPickSelectGuide extends AbstractQuickPickGuide {
  public async after(): Promise<void> {
    const callback = this.getExecute(this.activeItem?.label);

    if (callback) {
      await callback();
    }
  }

  protected abstract getExecute(
    label: string | undefined
  ): (() => Promise<void>) | undefined;
}

export default AbstractQuickPickSelectGuide;
