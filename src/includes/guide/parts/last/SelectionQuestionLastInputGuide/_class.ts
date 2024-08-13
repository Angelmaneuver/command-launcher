import NameInputGuide4SQLInputGuide from '../../name/NameInputGuide4SQLInputGuide';
import BaseLastInputGuide from '../BaseLastInputGuide';

import { ITEMS } from './_constant';

import * as Constant from '@/constant';
import MultiStepInput, { InputStep } from '@/guide/abc/multiStepInput';
import { State } from '@/guide/base/type';
import Optional from '@/utils/optional';

class SelectionQuestionLastInputGuide extends BaseLastInputGuide {
  private nameInputGuide: NameInputGuide4SQLInputGuide;

  constructor(state: State, keys: Array<string>) {
    super(state);

    this.itemId = this.settings.itemId.selection;
    this.nameInputGuide = new NameInputGuide4SQLInputGuide(
      this.state,
      this.settings.dataType.terminalCommand,
      keys
    );
  }

  public async show(input: MultiStepInput): Promise<void | InputStep> {
    const store: Record<string, unknown> = Optional.ofNullable(
      this.guideGroupResultSet[this.itemId]
    ).orElseNonNullable({});

    do {
      const commandSet: Record<string, string> = {};
      const name = await this.inputName(input);
      const parameter = await this.inputParameter(input);

      commandSet[this.settings.itemId.parameter] = parameter;
      store[name] = commandSet;
    } while (await this.continue(input));

    this.guideGroupResultSet[this.itemId] = store;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected setResultSet(value: unknown): void {}

  private async inputName(input: MultiStepInput): Promise<string> {
    const defaultValidator = this.validate;

    this.prompt = Constant.message.placeholder.edit.question.selection.name;
    this.validate = this.nameInputGuide.validateName;

    await super.show(input);

    this.validate = defaultValidator;

    const value = this._inputValue as string;

    NameInputGuide4SQLInputGuide.keys.push(value);

    return value;
  }

  private async inputParameter(input: MultiStepInput): Promise<string> {
    this.prompt =
      Constant.message.placeholder.edit.question.selection.parameter;

    await super.show(input);

    return this._inputValue as string;
  }

  private async continue(input: MultiStepInput): Promise<boolean> {
    return (
      ITEMS[0] ===
      (await input.showQuickPick({
        title: this.title,
        step: this.step,
        totalSteps: this.totalSteps,
        placeholder:
          Constant.message.placeholder.edit.question.selection.continue,
        items: [...ITEMS],
        activeItem: ITEMS[0],
        shouldResume: this.shouldResume,
      }))
    );
  }

  protected async lastInputStepExecute(): Promise<void> {
    this.registName = this.guideGroupResultSet[
      this.settings.itemId.name
    ] as string;

    this.registData[this.settings.itemId.type] =
      this.settings.questionType.selection;

    this.registData[this.settings.itemId.description] =
      this.guideGroupResultSet[this.settings.itemId.description];

    this.registData[this.settings.itemId.selection] =
      this.guideGroupResultSet[this.settings.itemId.selection];

    const registeredAt = this.settings.lookup(
      this.hierarchy,
      this.location,
      this.settings.lookupMode.write
    );

    registeredAt[this.registName] = this.registData;

    await this.settings.commit(this.location);

    this.state.back = true;
    this.prev();
  }
}

export default SelectionQuestionLastInputGuide;
