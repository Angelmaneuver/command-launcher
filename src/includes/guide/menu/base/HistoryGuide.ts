import { QuickPickItem } from 'vscode';

import AbstractMenuGuide from '../abc/AbstractMenuGuide';

import * as Constant from '@/constant';
import MultiStepInput, { InputStep } from '@/guide/abc/multiStepInput';
import { History } from '@/settings/extension';
import VSCodePreset from '@/utils/VSCodePreset';

const items = {
  lancher: Constant.quickpick.edit.abc.launcher,
  exit: Constant.quickpick.common.exit,
} as const;

class HistoryGuide extends AbstractMenuGuide {
  public init(): void {
    super.init();

    this.items = this.settings.history
      .map((item) => {
        return {
          label: VSCodePreset.icons.terminal.label,
          description: item.command,
        } as QuickPickItem;
      })
      .concat([items.lancher, items.exit]);
  }

  public async show(input: MultiStepInput): Promise<void | InputStep> {
    if (!this.settings.enableHistory) {
      this.state.message =
        Constant.message.showInformationMessage.history.disabled;
    } else if (
      this.settings.enableHistory &&
      0 === this.settings.history.length
    ) {
      this.state.message =
        Constant.message.showInformationMessage.history.nothing;
    } else {
      await super.show(input);
    }
  }

  protected getExecute(
    label: string | undefined
  ): (() => Promise<void>) | undefined {
    switch (label) {
      case items.lancher.label:
        this.state.command = 'command-launcher.launcher';
      // fallsthrough
      case items.exit.label:
        return undefined;
    }

    if (
      this.activeItem &&
      items.exit.label !== label &&
      this.activeItem.description
    ) {
      this.History(this.activeItem.description);
    }

    return undefined;
  }

  private History(command: string): undefined {
    const item: History | undefined = this.settings.history.find(
      (item) => command === item.command
    );

    if (item === undefined) {
      return;
    }

    this.state.name = item.name;
    this.state.terminalCommand = item.command;
    this.state.autoRun = item.autoRun ?? true;
    this.state.singleton = item.singleton ?? false;
  }
}

export default HistoryGuide;
