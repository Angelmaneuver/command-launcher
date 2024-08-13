import { QuickPickItem } from 'vscode';

import AbstractBaseGuide from './AbstractBaseGuide';
import { State } from './type';

import * as Constant from '@/constant';
import MultiStepInput, { InputStep } from '@/guide/abc/multiStepInput';
import Optional from '@/utils/optional';
import VSCodePreset from '@/utils/VSCodePreset';

abstract class AbstractQuickPickGuide extends AbstractBaseGuide {
  protected placeholder = '';
  protected items = Array<QuickPickItem>();
  protected activeItem: QuickPickItem | undefined = undefined;

  public init(): void {
    this.initialFields.push('placeholder', 'items', 'activeItem');
    this.items = [];

    super.init();
  }

  public async show(input: MultiStepInput): Promise<void | InputStep> {
    this.nextStep = this.totalSteps === 0 ? undefined : this.nextStep;
    this.activeItem = await input.showQuickPick({
      title: this.title,
      step: this.step,
      totalSteps: this.totalSteps,
      placeholder: this.placeholder,
      items: this.items,
      activeItem: this.inputPick,
      validate: this.validate,
      shouldResume: this.shouldResume,
    });

    if (this.itemId.length > 0) {
      this.guideGroupResultSet[this.itemId] = this.activeItem.label;
    }
  }

  protected get state(): State {
    return this._state as State;
  }

  protected set state(state: State) {
    this._state = state;
  }

  protected get inputPick(): QuickPickItem | undefined {
    let label = this.inputValue;

    if (typeof label === 'string') {
      label = label.replace(Constant.matcher.label_string, '');

      return this.items.find((item) => {
        return item.label.replace(Constant.matcher.label_string, '') === label;
      });
    } else {
      return this.activeItem;
    }
  }

  protected getItemByLabel(
    items: Array<QuickPickItem>,
    label: string
  ): QuickPickItem | undefined {
    return items.find((item) => {
      return item.label === label;
    });
  }

  protected get getLabelStringByItem(): string {
    return Optional.ofNullable(this.activeItem?.label)
      .orElseNonNullable('')
      .replace(Constant.matcher.label_string, '');
  }

  protected get getInputValueLabelString(): string {
    return typeof this.inputValue === 'string'
      ? this.inputValue.replace(Constant.matcher.label_string, '')
      : '';
  }

  protected getItemByLabelString(
    items: Array<QuickPickItem>,
    label: string
  ): QuickPickItem | undefined {
    return items.find((item) => {
      return item.label.replace(Constant.matcher.label_string, '') === label;
    });
  }

  protected createItems(
    record: Record<string, Record<string, unknown>>,
    icon: QuickPickItem,
    descriptionPropertyName: string
  ): Array<QuickPickItem> {
    return Object.keys(record).map((key) => {
      const description =
        descriptionPropertyName in record[key]
          ? record[key][descriptionPropertyName]
          : '';

      return VSCodePreset.create(
        icon,
        key,
        typeof description === 'string' ? description : ''
      );
    });
  }

  protected createBaseState(
    additionalTitle: string,
    guideGroupId: string,
    totalStep?: number,
    itemId?: string
  ): Partial<State> {
    const state = {
      title: `${this.state.mainTitle} ${additionalTitle}`.trim(),
      guideGroupId: guideGroupId,
      step: 0,
      totalSteps: totalStep,
    } as Partial<State>;

    if (totalStep) {
      state.totalSteps = totalStep;
    }

    if (itemId) {
      state.itemId = itemId;
    }

    return state;
  }

  protected setInputValueLabelString4GuideGroupResultSet(): void {
    this.guideGroupResultSet[this.itemId] = this.getInputValueLabelString;
  }
}

export default AbstractQuickPickGuide;
