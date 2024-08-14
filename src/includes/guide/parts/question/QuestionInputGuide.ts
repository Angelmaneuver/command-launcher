import { ExtensionContext } from 'vscode';

import setCommand from './setCommand';

import * as Constant from '@/constant';
import BaseInputGuide from '@/guide/base/BaseInputGuid';
import { State } from '@/guide/base/type';
import { TerminalCommand, Question } from '@/settings/extension';

class QuestionInputGuide extends BaseInputGuide {
  private commandSet: TerminalCommand;
  private question: Question;
  private recall: boolean;

  constructor(
    state: State,
    commandSet: TerminalCommand,
    question: Question,
    recall?: boolean,
    context?: ExtensionContext
  ) {
    super(state, context);

    this.commandSet = commandSet;
    this.question = question;
    this.recall = recall ?? false;
    this.state.prompt = question.description;

    if (question.default && question.default.length > 0) {
      this.state.prompt = Constant.message.placeholder.parts.question.input(
        this.state.prompt,
        question.default
      );
    }
  }

  public init(): void {
    const step = this.state.step ? this.state.step : 0;

    this.initialFields.push('guides');

    super.init();

    if (this.recall) {
      this.step = step;
      this.state.step = step;
    }
  }

  protected setResultSet(value: unknown): void {
    if (
      typeof value === 'string' &&
      value.length === 0 &&
      this.question.default &&
      this.question.default.length > 0
    ) {
      this.guideGroupResultSet[this.itemId] = this.question.default;
    } else {
      super.setResultSet(value);
    }
  }

  protected async lastInputStepExecute(): Promise<void> {
    if (this.commandSet.confirm ?? false) {
      await this.confirm(
        Constant.message.placeholder.menu.confirm,
        { yes: Constant.quickpick.confirm.description.yes.run },
        async () => {
          setCommand(
            this.state,
            this.commandSet.command,
            this.guideGroupResultSet as Record<string, string>,
            this.commandSet.autoRun ?? true,
            this.commandSet.singleton ?? false
          );
        }
      )();
    } else {
      setCommand(
        this.state,
        this.commandSet.command,
        this.guideGroupResultSet as Record<string, string>,
        this.commandSet.autoRun ?? true,
        this.commandSet.singleton ?? false
      );
    }
  }
}

export default QuestionInputGuide;
