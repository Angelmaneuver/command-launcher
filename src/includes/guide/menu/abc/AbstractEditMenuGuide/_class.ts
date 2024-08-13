import { ExtensionContext } from 'vscode';

import AbstractMenuGuide from '../AbstractMenuGuide';

import { PROCESS_TYPE } from './_constant';
import { ProcessType } from './_type';

import * as Constant from '@/constant';
import { State } from '@/guide/base/type';
import { DataType } from '@/settings/extension';

abstract class AbstractEditMenuGuide extends AbstractMenuGuide {
  protected static items = {
    delete: Constant.quickpick.edit.abc.delete,
    uninstall: Constant.quickpick.edit.abc.uninstall,
    launcher: Constant.quickpick.edit.abc.launcher,
    back: Constant.quickpick.common.return,
    exit: Constant.quickpick.common.exit,
    save: Constant.quickpick.edit.abc.save,
    return: Constant.quickpick.edit.abc.return,
  } as const;

  protected abstract deleteConfirmText: string;

  protected saveConfrimText: string =
    Constant.message.placeholder.menu.edit.save;

  protected type: DataType;

  constructor(state: State, type: DataType, context?: ExtensionContext) {
    super(state, context);

    this.type = type;
  }

  protected get processType() {
    return PROCESS_TYPE;
  }

  protected back(): void {
    if (
      this.guideGroupResultSet[this.processType.deleted] ||
      this.guideGroupResultSet[this.processType.updated]
    ) {
      delete this.guideGroupResultSet[this.processType.deleted];
      delete this.guideGroupResultSet[this.processType.updated];

      super.back();
    } else {
      this.state.back = false;
    }
  }

  protected getExecute(
    label: string | undefined
  ): (() => Promise<void>) | undefined {
    this.state.hierarchy = [...this.hierarchy];

    switch (label) {
      case AbstractEditMenuGuide.items.delete.label:
        return this.deleteConfirm();
      case AbstractEditMenuGuide.items.save.label:
        return this.saveConfirm();
      case AbstractEditMenuGuide.items.uninstall.label:
        return this.uninstallConfirm();
      case AbstractEditMenuGuide.items.back.label:
      case AbstractEditMenuGuide.items.return.label:
        this.prev();
        break;
      case AbstractEditMenuGuide.items.launcher.label:
        this.state.command = 'command-launcher.launcher';
      // fallsthrough
      case AbstractEditMenuGuide.items.exit.label:
        return undefined;
      default:
        return this.item();
    }
  }

  protected abstract item(): (() => Promise<void>) | undefined;

  private deleteConfirm(): () => Promise<void> {
    return async () => {
      this.state.placeholder = this.deleteConfirmText;
      this.setNextSteps([
        {
          key: 'BaseConfirmGuide',
          state: { title: this.title },
          args: [
            {
              yes: Constant.quickpick.edit.abc.confirm.description.remove,
              no: Constant.quickpick.edit.abc.confirm.description.back,
            },
            async () => {
              return this.delete();
            },
          ],
        },
      ]);
    };
  }

  protected abstract delete(): Promise<void>;

  private saveConfirm(): () => Promise<void> {
    return this.confirm(
      this.saveConfrimText,
      { yes: Constant.quickpick.edit.abc.confirm.description.save },
      async () => {
        return this.save();
      }
    );
  }

  protected abstract save(): Promise<void>;

  private uninstallConfirm(): () => Promise<void> {
    return this.confirm(
      Constant.message.placeholder.menu.edit.uninstall,
      { yes: Constant.quickpick.edit.abc.confirm.description.uninstall },
      async () => {
        return this.settings.uninstall();
      }
    );
  }

  private confirm(
    placeholder: string,
    description: { yes: string },
    callback: (...args: Array<unknown>) => Promise<void>
  ): () => Promise<void> {
    return async () => {
      this.state.placeholder = placeholder;
      this.setNextSteps([
        {
          key: 'BaseConfirmGuide',
          state: { title: this.title },
          args: [
            {
              yes: description.yes,
              no: Constant.quickpick.edit.abc.confirm.description.back,
            },
            callback,
          ],
        },
      ]);
    };
  }

  protected updateEnd(processType: ProcessType): void {
    this.guideGroupResultSet[processType] = true;
    this.state.back = true;
    this.prev();
  }
}

export default AbstractEditMenuGuide;
