import AbstractMenuGuide from '../abc/AbstractMenuGuide';

import * as Constant from '@/constant';
import { AbstractState, Guide } from '@/guide/abc/type';
import { Command, TerminalCommand, Question } from '@/settings/extension';
import Optional from '@/utils/optional';

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

  private terminalCommand(
    command: TerminalCommand
  ): (() => Promise<void>) | undefined {
    const name = this.activeItem?.label;
    const questions = command.questions ?? {};

    if (Object.keys(questions).length > 0) {
      return this.Questions(name!, command, questions);
    } else {
      this.state.name = name;
      this.state.terminalCommand = command.command;
      this.state.autoRun = command.autoRun ?? true;
      this.state.singleton = command.singleton ?? false;

      return undefined;
    }
  }

  private Questions(
    name: string,
    command: TerminalCommand,
    questions: Record<string, Question>
  ): () => Promise<void> {
    const keys = Object.keys(questions);

    const first = Optional.ofNullable(keys.shift()).orElseThrow(
      ReferenceError('Question not found...')
    );

    const state = this.createBaseState(
      '',
      this.settings.itemId.questions,
      Object.keys(questions).length,
      first
    );

    const guides = [] as Array<Guide>;

    keys.forEach((key) => {
      guides.push(this.getGuide(key, command, questions));
    });

    return async () => {
      this.setNextSteps([
        this.getGuide(
          first,
          command,
          questions,
          Object.assign(state, { guides: guides, name: name })
        ),
      ]);
    };
  }

  private getGuide(
    name: string,
    command: TerminalCommand,
    questions: Record<string, Question>,
    state?: Partial<AbstractState>
  ): Guide {
    const guide = {} as Guide;
    const question = questions[name];

    guide.key =
      question.type === this.settings.questionType.text
        ? 'QuestionInputGuide'
        : 'SelectQuestionGuide';
    guide.state = state ? state : { itemId: name };
    guide.args = [command, question];

    return guide;
  }
}

export default MenuGuide;
