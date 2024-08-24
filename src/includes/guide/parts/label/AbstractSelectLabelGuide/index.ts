import { SELECTION_ITEM } from '../constant';
import { SelectionItem } from '../type';

import * as Constant from '@/constant';
import { Guide } from '@/guide/abc/type';
import AbstractQuickPickSelectGuide from '@/guide/base/AbstractQuickPickSelectGuide';
import { State } from '@/guide/base/type';
import { DataType } from '@/settings/extension';
import VSCodePreset from '@/utils/VSCodePreset';

const BASE_ITEMS = [
  Constant.quickpick.parts.label.other,
  Constant.quickpick.parts.label.edit,
  Constant.quickpick.parts.label.diff,
  Constant.quickpick.parts.label.file,
  Constant.quickpick.parts.label.folder,
  Constant.quickpick.parts.label.repo,
  Constant.quickpick.parts.label.tag,
  Constant.quickpick.parts.label.console,
  Constant.quickpick.parts.label.run,
  Constant.quickpick.parts.label.save,
  Constant.quickpick.parts.label.settings,
  Constant.quickpick.parts.label.settingsGear,
];

abstract class AbstractSelectLabelGuide extends AbstractQuickPickSelectGuide {
  private selection: SelectionItem;
  private className: string;
  protected type: DataType;
  protected keys: Array<string>;

  constructor(
    state: State,
    selection: SelectionItem,
    className: string = '',
    type?: DataType,
    keys: Array<string> = []
  ) {
    super(state);

    this.itemId = this.settings.itemId.lable;
    this.placeholder = Constant.message.placeholder.parts.label;
    this.selection = selection;
    this.className = className;
    this.type = type ? type : this.settings.dataType.command;
    this.keys = keys;
  }

  public init(): void {
    const step = this.state.step ? this.state.step : 0;

    this.state.items =
      this.selection === SELECTION_ITEM.base
        ? BASE_ITEMS
        : VSCodePreset.getAllIcons;

    super.init();

    if (this.selection === SELECTION_ITEM.all) {
      this.step = step;
      this.state.step = step;
    }
  }

  protected reCall(label: string | undefined): Guide | undefined {
    return BASE_ITEMS[0].label === label
      ? {
          key: this.className,
          state: { step: this.step },
          args: [SELECTION_ITEM.all, this.type, this.keys],
        }
      : undefined;
  }
}

export default AbstractSelectLabelGuide;
