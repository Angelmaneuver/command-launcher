import AbstractQuickPickSelectGuide from './AbstractQuickPickSelectGuide';
import { State } from './type';

import * as Constant from '@/constant';
import VSCodePreset from '@/utils/VSCodePreset';

class BaseConfirmGuide extends AbstractQuickPickSelectGuide {
  private callback: (...args: Array<unknown>) => Promise<void>;
  private args: Array<unknown>;

  constructor(
    state: State,
    description: { yes: string; no: string },
    callback: (...args: Array<unknown>) => Promise<void>,
    ...args: Array<unknown>
  ) {
    super(state);

    this.callback = callback;
    this.args = args;

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

    this.state.activeItem = this.state.items[1];
  }

  public getExecute(label: string | undefined): () => Promise<void> {
    switch (label) {
      case this.items[0].label:
        return async () => {
          await this.callback(...this.args);
        };
      default:
        return async () => {
          this.prev();
        };
    }
  }
}

export default BaseConfirmGuide;
