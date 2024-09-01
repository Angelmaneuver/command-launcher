import AbstractMenuGuide from '../../abc/AbstractMenuGuide';

import getQuestions from './getQuestions';

import * as Constant from '@/constant';
import { Command, TerminalCommand } from '@/settings/extension';

const items = {
  return: Constant.quickpick.common.return,
  exit: Constant.quickpick.common.exit,
} as const;

class MenuGuide extends AbstractMenuGuide {
  public init(): void {
    super.init();

    this.items = this.items.concat(
      this.commandItems,
      this.isRoot ? [items.exit] : [items.return]
    );
  }

  protected getExecute(
    label: string | undefined
  ): (() => Promise<void>) | undefined {
    switch (label) {
      case items.return.label:
        this.prev();
        break;
      case items.exit.label:
        return undefined;
      default:
        return this.item();
    }
  }

  private item(): (() => Promise<void>) | undefined {
    const [command, key, location] = this.getCommand(this.getLabelStringByItem);

    if (command.type === this.settings.dataType.command) {
      return this.Command(command as Command);
    } else if (command.type === this.settings.dataType.terminalCommand) {
      return this.terminalCommand(command as TerminalCommand);
    } else {
      this.state.title = `${this.state.mainTitle} ${this.getLabelStringByItem}`;
      this.state.location = location;
      this.state.hierarchy = this.hierarchy.concat(key);

      return async () => {
        this.setNextSteps([{ key: 'MenuGuide' }]);
      };
    }
  }

  private Command(command: Command): undefined {
    this.state.command = command.command;

    return undefined;
  }

  protected terminalCommand(
    command: TerminalCommand
  ): (() => Promise<void>) | undefined {
    const name = this.activeItem?.label;
    const questions = command.questions ?? {};

    if (Object.keys(questions).length > 0) {
      const state = this.createBaseState(
        name!.replace(Constant.matcher.label_string_only, ''),
        this.settings.itemId.questions,
        Object.keys(questions).length
      );

      const guides = getQuestions(name!, command, questions, state);

      return async () => {
        this.setNextSteps(guides);
      };
    }

    if (command.confirm ?? false) {
      return this.confirm(
        Constant.message.placeholder.menu.confirm,
        { yes: Constant.quickpick.confirm.description.yes.run },
        async () => {
          this.state.name = name;
          this.state.terminalCommand = command.command;
          this.state.autoRun = command.autoRun ?? true;
          this.state.singleton = command.singleton ?? false;
        }
      );
    } else {
      this.state.name = name;
      this.state.terminalCommand = command.command;
      this.state.autoRun = command.autoRun ?? true;
      this.state.singleton = command.singleton ?? false;

      return undefined;
    }
  }
}

export default MenuGuide;
