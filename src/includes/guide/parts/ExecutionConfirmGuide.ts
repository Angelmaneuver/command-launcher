import BaseConfirmGuide from '../base/BaseConfirmGuide';
import { State } from '../base/type';

import * as Constant from '@/constant';
import { TerminalCommand } from '@/settings/extension';

class ExecutionConfirmGuide extends BaseConfirmGuide {
  constructor(state: State, command: TerminalCommand) {
    super(
      state,
      {
        yes: Constant.quickpick.confirm.description.yes.run,
        no: Constant.quickpick.confirm.description.no.exit,
      },
      async () => {
        state.name = command.name;
        state.terminalCommand = command.command;
        state.autoRun = command.autoRun ?? true;
        state.singleton = command.singleton ?? false;
      },
      []
    );

    state.placeholder = Constant.message.placeholder.menu.confirm;
  }

  public getExecute(label: string | undefined): () => Promise<void> {
    switch (label) {
      case this.items[0].label:
        return async () => {
          await this.callback(...this.args);
        };
      default:
        return async () => {
          return;
        };
    }
  }
}

export default ExecutionConfirmGuide;
