import AbstractQuestionEditMenuGuide from '../abc/AbstractQuestionEditMenuGuide';

import { Parameter } from './_type';

import * as Constant from '@/constant';
import MultiStepInput, { InputStep } from '@/guide/abc/multiStepInput';
import { Guide } from '@/guide/abc/type';
import { State } from '@/guide/base/type';
import { SelectionItem } from '@/settings/extension';

const items = {
  name: Constant.quickpick.edit.question.item.name,
  parameter: Constant.quickpick.edit.question.item.parameter,
  order: Constant.quickpick.edit.question.order,
};

class SelectionItemEditMenuGuide extends AbstractQuestionEditMenuGuide {
  protected deleteConfirmText = Constant.message.placeholder.menu.edit.remove;

  public async show(input: MultiStepInput): Promise<void | InputStep> {
    this.settingMenuItems();

    await super.show(input);
  }

  protected getExecute(
    label: string | undefined
  ): (() => Promise<void>) | undefined {
    this.initialValue = undefined;
    this.state.hierarchy = this.hierarchy;

    switch (label) {
      case items.name.label:
      case items.parameter.label:
      case items.order.label:
        return this.setSettingGuide(label);
      default:
        return super.getExecute(label);
    }
  }

  protected item(): (() => Promise<void>) | undefined {
    return;
  }

  private settingMenuItems(): void {
    this.items = [
      items.name,
      items.parameter,
      items.order,
      SelectionItemEditMenuGuide.items.delete,
    ];

    if (Object.keys(this.guideGroupResultSet).length > 0) {
      this.items.push(
        SelectionItemEditMenuGuide.items.save,
        SelectionItemEditMenuGuide.items.return
      );
    } else {
      this.items.push(SelectionItemEditMenuGuide.items.back);
    }
  }

  private setSettingGuide(label: string): () => Promise<void> {
    let key: string = '';
    let state: Partial<State> = {};
    let args: Array<unknown> = [];
    let itemId: string | undefined = undefined;

    switch (label) {
      case items.name.label:
        [key, state, args] = this.getNameParameter();
        break;
      case items.parameter.label:
        itemId = this.settings.itemId.parameter;
        [key, state, args] = this.getParameterParameter();
        break;
      case items.order.label:
        itemId = this.settings.itemId.orderNo;
        [key, state, args] = this.getOrderParameter();
        break;
    }

    const guide: Guide = {
      key: key,
      state: Object.assign(
        this.createBaseState('', this.guideGroupId, 0, itemId),
        state
      ),
      args: args,
    };

    return async () => {
      this.setNextSteps([guide]);
    };
  }

  private getNameParameter(): Parameter {
    return [
      'NameInputGuide',
      {
        prompt: Constant.message.placeholder.edit.question.item.name,
        initialValue: this.guideGroupId,
      },
      [this.type, Object.keys(this.questionsFromSetting)],
    ];
  }

  private getParameterParameter(): Parameter {
    return [
      'BaseInputGuide',
      {
        prompt: Constant.message.placeholder.edit.question.item.parameter,
        initialValue: this.selectionItem.parameter,
      },
      [],
    ];
  }

  private getOrderParameter(): Parameter {
    return [
      'BaseInputGuide',
      {
        prompt: Constant.message.placeholder.edit.order,
        initialValue: this.selectionItem.orderNo ?? '',
      },
      [],
    ];
  }

  private get selectionItem(): SelectionItem {
    return super.currentHierarchy as SelectionItem;
  }
}

export default SelectionItemEditMenuGuide;
