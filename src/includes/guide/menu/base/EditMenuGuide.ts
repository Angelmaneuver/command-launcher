import AbstractEditMenuGuide from '../abc/AbstractEditMenuGuide';

import { Parameter } from './_type';

import * as Constant from '@/constant';
import MultiStepInput, { InputStep } from '@/guide/abc/multiStepInput';
import { State } from '@/guide/base/type';
import { SELECTION_ITEM } from '@/guide/parts/label/constant';
import { BaseValidator } from '@/guide/validator';
import { Command, DataType, TerminalCommand } from '@/settings/extension';
import Optional from '@/utils/optional';

const items = {
  command: Constant.quickpick.edit.base.command,
  terminal: Constant.quickpick.edit.base.terminal,
  folder: Constant.quickpick.edit.base.folder,
  setting: Constant.quickpick.edit.base.setting,
  name: Constant.quickpick.edit.base.name,
  label: Constant.quickpick.edit.base.label,
  description: Constant.quickpick.edit.base.description,
  executeCommand: Constant.quickpick.edit.base.executeCommand,
  order: Constant.quickpick.edit.base.order,
  question: Constant.quickpick.edit.base.question,
  confirm: Constant.quickpick.edit.base.confirm,
  autoRun: Constant.quickpick.edit.base.autoRun,
  singleton: Constant.quickpick.edit.base.singleton,
  separator: Constant.quickpick.edit.base.separator.registerd,
} as const;

class EditMenuGuide extends AbstractEditMenuGuide {
  protected deleteConfirmText = Constant.message.placeholder.menu.edit.remove;

  public async show(input: MultiStepInput): Promise<void | InputStep> {
    this.setMenuItems();

    return super.show(input);
  }

  protected getExecute(
    label: string | undefined
  ): (() => Promise<void>) | undefined {
    this.initialValue = undefined;
    this.state.hierarchy = [...this.hierarchy];

    switch (label) {
      case items.setting.label:
        return async () => {
          this.setNextSteps([
            {
              key: 'SelectSettingGuide',
              state: this.createBaseState(
                Constant.message.headline.edit.setting,
                'setting'
              ),
            },
          ]);
        };
      case items.command.label:
        return this.setGuidance(
          Constant.message.headline.edit.add.command,
          'command',
          4,
          this.settings.dataType.command
        );
      case items.terminal.label:
        return this.setGuidance(
          Constant.message.headline.edit.add.terminal,
          'terminal',
          4,
          this.settings.dataType.terminalCommand
        );
      case items.folder.label:
        return this.setGuidance(
          Constant.message.headline.edit.add.folder,
          'folder',
          3,
          this.settings.dataType.folder
        );
      case items.name.label:
      case items.label.label:
      case items.description.label:
      case items.executeCommand.label:
      case items.order.label:
      case items.question.label:
      case items.confirm.label:
      case items.autoRun.label:
      case items.singleton.label:
        return this.setSettingGuide(label);
      default:
        return super.getExecute(label);
    }
  }

  private setMenuItems(): void {
    if (this.isRoot) {
      this.setRootItems();
    } else {
      if (this.type === this.settings.dataType.folder) {
        this.setFolderItems();
      } else if (this.type === this.settings.dataType.command) {
        this.setCommandItems();
      } else {
        this.setTerminalCommandItems();
      }

      if (Object.keys(this.guideGroupResultSet).length > 0) {
        this.items = this.items.concat([
          AbstractEditMenuGuide.items.save,
          AbstractEditMenuGuide.items.return,
        ]);
      } else {
        this.items = this.items.concat([AbstractEditMenuGuide.items.back]);
      }

      if (this.type === this.settings.dataType.folder) {
        this.items = this.items.concat(
          this.commandItems.length > 0
            ? [items.separator, ...this.commandItems]
            : []
        );
      }
    }
  }

  private setRootItems(): void {
    this.items = [
      Constant.quickpick.common.separator.folder.root,
      items.command,
      items.terminal,
      items.folder,
      items.setting,
      AbstractEditMenuGuide.items.uninstall,
      AbstractEditMenuGuide.items.launcher,
      AbstractEditMenuGuide.items.exit,
    ].concat(
      this.commandItems.length > 0
        ? [items.separator, ...this.commandItems]
        : []
    );
  }

  private setFolderItems(): void {
    this.items = [
      Constant.quickpick.common.separator.folder.generator(),
      items.command,
      items.terminal,
      items.folder,
      items.name,
      items.label,
      items.description,
      items.order,
      AbstractEditMenuGuide.items.delete,
    ];
  }

  private setCommandBaseItems(): void {
    const separator =
      this.type === this.settings.dataType.command
        ? Constant.quickpick.common.separator.command.generator()
        : Constant.quickpick.common.separator.terminalCommand.generator();

    this.items = [separator, items.name, items.label, items.description];
  }

  private setCommandItems(): void {
    this.setCommandBaseItems();

    this.items = this.items.concat([
      items.executeCommand,
      items.order,
      AbstractEditMenuGuide.items.delete,
    ]);
  }

  private setTerminalCommandItems(): void {
    this.setCommandBaseItems();

    this.items = this.items.concat([
      items.executeCommand,
      items.order,
      items.question,
      items.confirm,
      items.autoRun,
      items.singleton,
      AbstractEditMenuGuide.items.delete,
    ]);
  }

  protected item(): (() => Promise<void>) | undefined {
    const [data, key, location] = this.getCommand(this.getLabelStringByItem);
    const type = data[this.settings.itemId.type];

    this.initialValue = key;
    this.state.location = location;
    this.state.hierarchy = this.hierarchy.concat(key);
    this.state.resultSet[key] = undefined;

    return async () => {
      this.setNextSteps([
        {
          key: 'EditMenuGuide',
          state: this.createBaseState(this.getInputValueLabelString, key),
          args: [type],
        },
      ]);
    };
  }

  protected async delete(): Promise<void> {
    this.settings.delete(this.hierarchy, this.location);

    await this.settings.commit(this.location);

    this.updateEnd(this.processType.deleted);
  }

  protected async save(): Promise<void> {
    const hierarchy = [...this.hierarchy];

    const pre = Optional.ofNullable(hierarchy.pop()).orElseThrow(
      ReferenceError('Edit target not found...')
    );

    const name = Optional.ofNullable(
      this.guideGroupResultSet[this.settings.itemId.name]
    ).orElseNonNullable(pre) as string;

    const original = this.settings.cloneDeep(this.hierarchy, this.location);

    const overwrite: Record<string, unknown> = {};

    Object.keys(this.guideGroupResultSet).forEach((key) => {
      let regist = true;
      let value = this.guideGroupResultSet[key];
      const remover = () => {
        delete original[key];
        regist = false;
      };

      switch (key) {
        case this.settings.itemId.name:
          regist = false;
          break;
        case this.settings.itemId.lable:
          value = Optional.ofNullable(
            (this.guideGroupResultSet[key] as string).match(
              Constant.matcher.label_string_only
            )
          ).orElseThrow(ReferenceError('Label value not found...'))[0];
          break;
        case this.settings.itemId.orderNo:
          if (0 === (this.guideGroupResultSet[key] as string).length) {
            remover();
          }
          break;
        case this.settings.itemId.autoRun:
          if (this.guideGroupResultSet[key]) {
            remover();
          }
          break;
        case this.settings.itemId.confirm:
        case this.settings.itemId.singleton:
          if (!this.guideGroupResultSet[key]) {
            remover();
          }
          break;
      }

      if (regist) {
        overwrite[key] = value;
      }
    });

    Object.assign(original, overwrite);

    this.settings.delete(this.hierarchy, this.location);

    this.settings.lookup(
      hierarchy,
      this.location,
      this.settings.lookupMode.read
    )[name] = original;

    this.settings.sort(hierarchy, this.location);

    await this.settings.commit(this.location);

    this.updateEnd(this.processType.updated);
  }

  private setGuidance(
    title: string,
    guideGroupId: string,
    totalStep: number,
    type: DataType
  ): () => Promise<void> {
    this.state.resultSet[guideGroupId] = { type: type };

    const key: string = this.isRoot
      ? 'SelectLocationGuide'
      : 'SelectLabelGuide4Guidance';

    const state: Partial<State> = this.createBaseState(
      title,
      guideGroupId,
      this.isRoot ? totalStep + 1 : totalStep
    );

    const args: Array<unknown> = [
      SELECTION_ITEM.base,
      type,
      Object.keys(this.currentCommandsWithAllowEmpty),
    ];

    return async () => {
      this.setNextSteps([
        {
          key: key,
          state: state,
          args: args,
        },
      ]);
    };
  }

  private setSettingGuide(label: string): () => Promise<void> {
    let key: string = '';
    let state: Partial<State> = {};
    let args: Array<unknown> = [];

    const additionalTitle: string = '';
    let guideGroupId: string = this.guideGroupId;
    let itemId: string | undefined = undefined;

    switch (label) {
      case items.name.label:
        [key, state, args] = this.getNameParameter();
        break;
      case items.label.label:
        [key, state, args] = this.getLabelParameter();
        break;
      case items.description.label:
        itemId = this.settings.itemId.description;
        [key, state, args] = this.getDescriptionParameter();
        break;
      case items.executeCommand.label:
        itemId = this.settings.itemId.command;
        [key, state, args] = this.getCommandParameter();
        break;
      case items.order.label:
        itemId = this.settings.itemId.orderNo;
        [key, state, args] = this.getOrderParameter();
        break;
      case items.confirm.label:
        [key, state, args] = this.getConfirmParameter();
        break;
      case items.autoRun.label:
        [key, state, args] = this.getAutoRunParameter();
        break;
      case items.singleton.label:
        [key, state, args] = this.getSingletonParameter();
        break;
      case items.question.label:
        guideGroupId = this.settings.itemId.questions;
        itemId = this.settings.itemId.questions;
        [key, state, args] = this.getQuestionParameter();
        break;
    }

    const guide = {
      key: key,
      state: Object.assign(
        this.createBaseState(additionalTitle, guideGroupId, 0, itemId),
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
        initialValue: this.guideGroupId,
      },
      [this.type, Object.keys(this.parentCommands)],
    ];
  }

  private getLabelParameter(): Parameter {
    return ['SelectLabelGuide4Guidance', {}, [SELECTION_ITEM.base, this.type]];
  }

  private getDescriptionParameter(): Parameter {
    return [
      'BaseInputGuide',
      {
        prompt: Constant.message.placeholder.edit.description(
          this.type === this.settings.dataType.folder
            ? Constant.message.word.folder
            : Constant.message.word.command
        ),
        initialValue: this.getCurrentCommandInfo().description,
      },
      [SELECTION_ITEM.base, this.type],
    ];
  }

  private getCommandParameter(): Parameter {
    const type = this.getCurrentCommandInfo().type;
    let command = '';

    if (type === this.settings.dataType.command) {
      command = this.getCurrentCommandInfo<Command>().command;
    } else if (type === this.settings.dataType.terminalCommand) {
      command = this.getCurrentCommandInfo<TerminalCommand>().command;
    }

    return [
      'BaseInputGuide',
      {
        prompt: Constant.message.placeholder.edit.command,
        validate: BaseValidator.validateRequired,
        initialValue: command,
      },
      [],
    ];
  }

  private getOrderParameter(): Parameter {
    return [
      'BaseInputGuide',
      {
        prompt: Constant.message.placeholder.edit.order,
        initialValue: this.getCurrentCommandInfo().orderNo ?? '',
      },
      [],
    ];
  }

  private getConfirmParameter(): Parameter {
    let isConfirm =
      this.getCurrentCommandInfo<TerminalCommand>().confirm ?? false;

    if (this.settings.itemId.confirm in this.guideGroupResultSet) {
      const value = this.guideGroupResultSet[this.settings.itemId.confirm];

      isConfirm = typeof value === 'boolean' ? value : isConfirm;
    }

    return [
      'ConfirmSettingGuide',
      {
        initialValue: isConfirm,
      },
      [],
    ];
  }

  private getAutoRunParameter(): Parameter {
    const type = this.getCurrentCommandInfo().type;
    let isAutoRun = true;

    if (type === this.settings.dataType.command) {
      isAutoRun =
        this.getCurrentCommandInfo<TerminalCommand>().autoRun ?? isAutoRun;
    }

    if (this.settings.itemId.autoRun in this.guideGroupResultSet) {
      const value = this.guideGroupResultSet[this.settings.itemId.autoRun];

      isAutoRun = typeof value === 'boolean' ? value : isAutoRun;
    }

    return [
      'AutoRunSettingGuide',
      {
        initialValue: isAutoRun,
      },
      [],
    ];
  }

  private getSingletonParameter(): Parameter {
    const type = this.getCurrentCommandInfo().type;
    let isSingleton = false;

    if (type === this.settings.dataType.command) {
      isSingleton =
        this.getCurrentCommandInfo<TerminalCommand>().singleton ?? isSingleton;
    }

    if (this.settings.itemId.autoRun in this.guideGroupResultSet) {
      const value = this.guideGroupResultSet[this.settings.itemId.singleton];

      isSingleton = typeof value === 'boolean' ? value : isSingleton;
    }

    return [
      'SingletonSettingGuide',
      {
        initialValue: isSingleton,
      },
      [],
    ];
  }

  private getQuestionParameter(): Parameter {
    return ['QuestionEditMenuGuide', { title: this.title }, [this.type, true]];
  }
}

export default EditMenuGuide;
