import AbstractSelectLabelGuide from '../AbstractSelectLabelGuide';
import { SelectionItem } from '../type';

import * as Constant from '@/constant';
import { Guide } from '@/guide/abc/type';
import { State } from '@/guide/base/type';
import { DataType } from '@/settings/extension';

class SelectLabelGuide4Guidance extends AbstractSelectLabelGuide {
  constructor(
    state: State,
    selection: SelectionItem,
    type: DataType,
    keys: Array<string>
  ) {
    super(state, selection, 'SelectLabelGuide4Guidance', type, keys);
  }

  protected getExecute(
    label: string | undefined
  ): (() => Promise<void>) | undefined {
    let steps: Array<Guide> = [];
    const again = this.reCall(label);

    if (again) {
      steps.push(again);
    }

    if (this.totalSteps > 0) {
      steps = steps.concat(this.getGuidanceSteps());
    }

    if (steps.length > 0) {
      return async () => {
        this.setNextSteps(steps);
      };
    } else {
      this.state.back = true;
      this.prev();
    }
  }

  private getGuidanceSteps(): Array<Guide> {
    const steps: Array<Guide> = [
      {
        key: 'NameInputGuide',
        state: { step: this.step } as Partial<State>,
        args: [this.type, this.keys],
      },
    ];

    if (this.type === this.settings.dataType.folder) {
      steps.push({ key: 'FolderLastInputGuide', state: {} });
    } else {
      steps.push(
        {
          key: 'BaseInputGuide',
          state: {
            itemId: this.settings.itemId.description,
            prompt: Constant.message.placeholder.edit.description(
              Constant.message.word.command
            ),
          } as Partial<State>,
        },
        { key: 'CommandLastInputGuide', state: {} }
      );
    }

    return steps;
  }
}

export default SelectLabelGuide4Guidance;
