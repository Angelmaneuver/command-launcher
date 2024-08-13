import AbstractQuestionEditMenuGuide from '../abc/AbstractQuestionEditMenuGuide';

import { Parameter } from './_type';

import * as Constant from '@/constant';
import MultiStepInput, { InputStep } from '@/guide/abc/multiStepInput';
import { Guide } from '@/guide/abc/type';
import { State } from '@/guide/base/type';
import VSCodePreset from '@/utils/VSCodePreset';

const items = {
  input: Constant.quickpick.edit.question.input,
  selection: Constant.quickpick.edit.question.selection,
  name: Constant.quickpick.edit.question.name,
  description: Constant.quickpick.edit.question.description,
  default: Constant.quickpick.edit.question.default,
  order: Constant.quickpick.edit.question.order,
  separator1: Constant.quickpick.edit.question.separator.registerd.questions,
  separator2: Constant.quickpick.edit.question.separator.registerd.items,
};

class QuestionEditMenuGuide extends AbstractQuestionEditMenuGuide {
  protected deleteConfirmText =
    Constant.message.placeholder.menu.edit.question.remove;

  public async show(input: MultiStepInput): Promise<void | InputStep> {
    if (this.isRoot) {
      this.selectMenuItems();
    } else {
      this.settingMenuItems();
    }

    return super.show(input);
  }

  protected getExecute(
    label: string | undefined
  ): (() => Promise<void>) | undefined {
    this.initialValue = undefined;
    this.state.hierarchy = this.hierarchy;

    switch (label) {
      case items.input.label:
      case items.selection.label:
        return this.setGuidance(label);
      case items.name.label:
      case items.description.label:
      case items.default.label:
      case items.order.label:
        return this.setSettingGuide(label);
      default:
        return super.getExecute(label);
    }
  }

  protected item(): (() => Promise<void>) | undefined {
    const name = this.getLabelStringByItem;

    this.initialValue = this.activeItem?.label;

    this.state.hierarchy = this.hierarchy.concat(
      this.isRoot
        ? [this.settings.itemId.questions, name]
        : [this.settings.itemId.selection, name]
    );

    this.state.resultSet[name] = undefined;

    return async () => {
      this.setNextSteps([
        {
          key: this.isRoot
            ? 'QuestionEditMenuGuide'
            : 'SelectionItemEditMenuGuide',
          state: this.createBaseState(name, name),
          args: [this.type],
        },
      ]);
    };
  }

  protected async save(): Promise<void> {
    if (this.settings.itemId.default in this.guideGroupResultSet) {
      this.guideGroupResultSet[this.settings.itemId.default] = (
        this.guideGroupResultSet[this.settings.itemId.default] as string
      ).replace(Constant.matcher.label_string, '');
    }

    return super.save();
  }

  private selectMenuItems(): void {
    const registerd = this.createItems(
      this.questions,
      VSCodePreset.icons.symbolVariable,
      this.settings.itemId.description
    );

    this.items = [
      items.input,
      items.selection,
      QuestionEditMenuGuide.items.back,
    ].concat(registerd.length > 0 ? [items.separator1, ...registerd] : []);
  }

  private settingMenuItems(): void {
    const question = this.question;

    this.items = [
      items.name,
      items.description,
      items.default,
      items.order,
      QuestionEditMenuGuide.items.delete,
    ].concat(
      Object.keys(this.guideGroupResultSet).length > 0
        ? [QuestionEditMenuGuide.items.save, QuestionEditMenuGuide.items.return]
        : [QuestionEditMenuGuide.items.back]
    );

    if (question.type === this.settings.questionType.selection) {
      this.items.push(
        items.separator2,
        ...this.createItems(
          question.selection,
          VSCodePreset.icons.note,
          this.settings.itemId.parameter
        )
      );
    }
  }

  private setGuidance(label: string): () => Promise<void> {
    const guideGroupId = 'addQuestion';

    this.state.hierarchy = [...this.hierarchy].concat(
      this.settings.itemId.questions
    );

    this.state.resultSet[guideGroupId] = {};

    const guides: Array<Guide> = [
      {
        key: 'NameInputGuide',
        state: Object.assign(
          this.createBaseState(
            Constant.message.headline.edit.add.question,
            guideGroupId,
            label === items.input.label ? 2 : 3
          ),
          { prompt: Constant.message.placeholder.edit.question.name }
        ),
        args: [this.type, Object.keys(this.questions)],
      },
    ];

    switch (label) {
      case items.input.label:
        guides.push({ key: 'TextQuestionLastInputGuide' });
        break;
      case items.selection.label:
        guides.push(
          {
            key: 'BaseInputGuide',
            state: {
              itemId: this.settings.itemId.description,
              prompt: Constant.message.placeholder.edit.question.description,
            } as Partial<State>,
          },
          {
            key: 'SelectionQuestionLastInputGuide',
            args: [[]],
          }
        );
        break;
    }

    return async () => {
      this.setNextSteps(guides);
    };
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
      case items.description.label:
        itemId = this.settings.itemId.description;
        [key, state, args] = this.getDescriptionParameter();
        break;
      case items.default.label:
        itemId = this.settings.itemId.default;
        [key, state, args] = this.getDefaultParameter();
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
        prompt: Constant.message.placeholder.edit.question.name,
        initialValue: this.guideGroupId,
      },
      [(this.type, Object.keys(this.questionsFromSetting))],
    ];
  }

  private getDescriptionParameter(): Parameter {
    return [
      'BaseInputGuide',
      {
        prompt: Constant.message.placeholder.edit.question.description,
        initialValue: this.question.description,
      },
      [],
    ];
  }

  private getDefaultParameter(): Parameter {
    if (this.question.type === this.settings.questionType.text) {
      return [
        'BaseInputGuide',
        {
          prompt: Constant.message.placeholder.edit.question.default.input,
          initialValue: this.question.default ?? '',
        },
        [],
      ];
    } else {
      const question = this.question;

      const items = this.createItems(
        question.selection,
        VSCodePreset.icons.note,
        this.settings.itemId.parameter
      );

      const item = question.default ?? '';

      const activeItem =
        item.length > 0
          ? items.find(
              (value) =>
                `${VSCodePreset.icons.note.label} ${item}` === value.label
            )
          : undefined;

      return [
        'BaseQuickPickGuide',
        {
          items: items,
          activeItem: activeItem,
          placeholder:
            Constant.message.placeholder.edit.question.default.selection,
        },
        [],
      ];
    }
  }

  private getOrderParameter(): Parameter {
    return [
      'BaseInputGuide',
      {
        prompt: Constant.message.placeholder.edit.question.order,
        initialValue: this.question.orderNo ?? '',
      },
      [],
    ];
  }
}

export default QuestionEditMenuGuide;
