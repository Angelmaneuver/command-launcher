import * as Constant from '@/constant';
import AbstractQuickPickSelectGuide from '@/guide/base/AbstractQuickPickSelectGuide';
import { State } from '@/guide/base/type';

const items = {
  global: Constant.quickpick.parts.location.global,
  user: Constant.quickpick.parts.location.user,
};

class SelectLocationGuide extends AbstractQuickPickSelectGuide {
  private args: Array<unknown>;

  constructor(state: State, ...args: Array<unknown>) {
    super(state);

    this.args = args;

    this.state.placeholder = Constant.message.placeholder.parts.location;
    this.state.items = [items.global, items.user];
  }

  protected getExecute(
    label: string | undefined
  ): (() => Promise<void>) | undefined {
    const location =
      label === items.global.label
        ? this.settings.location.user
        : this.settings.location.profile;

    return async () => {
      this.setNextSteps([
        {
          key: 'SelectLabelGuide4Guidance',
          state: Object.assign(this.state, { location: location }),
          args: this.args,
        },
      ]);
    };
  }
}

export default SelectLocationGuide;
