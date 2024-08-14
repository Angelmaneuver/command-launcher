import { ExtensionContext } from 'vscode';

import setCommand from '../setCommand';

import { ITEM } from './_constant';

import * as Constant from '@/constant';
import BaseQuickPickGuide from '@/guide/base/BaseQuickPickGuide';
import { State } from '@/guide/base/type';
import { TerminalCommand, Question } from '@/settings/extension';
import VSCodePreset from '@/utils/VSCodePreset';

class SelectQuestionGuide extends BaseQuickPickGuide {
  private commandSet: TerminalCommand;
  private question: Question;
  private isContinue: boolean = false;

  constructor(
    state: State,
    commandSet: TerminalCommand,
    question: Question,
    context?: ExtensionContext
  ) {
    super(state, context);

    this.commandSet = commandSet;
    this.question = question;
    this.state.placeholder = question.description;
    this.state.items = this.createItems(
      question.selection,
      VSCodePreset.icons.note,
      this.settings.itemId.parameter
    ).concat(ITEM);

    const defaultItem = question.default ?? '';

    if (defaultItem.length > 0) {
      this.state.activeItem = this.state.items.find(
        (item) =>
          `${VSCodePreset.icons.note.label} ${defaultItem}` === item.label
      );
    }
  }

  public init(): void {
    this.initialFields.push('guides');

    super.init();
  }

  public async after(): Promise<void> {
    this.isContinue = false;

    if (this.activeItem === ITEM) {
      this.isContinue = true;

      this.guideGroupResultSet[this.itemId] = undefined;

      this.setNextSteps([
        {
          key: 'QuestionInputGuide',
          state: { itemId: this.itemId },
          args: [this.commandSet, this.question, true],
        },
      ]);
    } else {
      this.guideGroupResultSet[this.itemId] =
        this.question.selection[this.getLabelStringByItem].parameter;
    }

    return super.after();
  }

  protected async lastInputStepExecute(): Promise<void> {
    if (this.isContinue) {
      return;
    } else if (this.commandSet.confirm ?? false) {
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

export default SelectQuestionGuide;
