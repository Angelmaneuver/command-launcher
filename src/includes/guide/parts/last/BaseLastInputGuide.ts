import * as Constant from '@/constant';
import BaseInputGuide from '@/guide/base/BaseInputGuid';
import Optional from '@/utils/optional';

class BaseLastInputGuide extends BaseInputGuide {
  protected registName: string = '';
  protected registData: Record<string, unknown> = {};

  protected async lastInputStepExecute(): Promise<void> {
    this.registName = this.guideGroupResultSet[
      this.settings.itemId.name
    ] as string;

    this.registData[this.settings.itemId.type] =
      this.guideGroupResultSet[this.settings.itemId.type];

    this.registData[this.settings.itemId.lable] = Optional.ofNullable(
      (this.guideGroupResultSet[this.settings.itemId.lable] as string).match(
        Constant.matcher.label_string_only
      )
    ).orElseThrow(ReferenceError('Label value not found...'))[0];

    this.registData[this.settings.itemId.description] =
      this.guideGroupResultSet[this.settings.itemId.description];

    const registeredAt = this.settings.lookup(
      this.hierarchy,
      this.location,
      this.settings.lookupMode.write
    );

    registeredAt[this.registName] = this.registData;

    this.settings.sort(this.hierarchy, this.location);
    await this.settings.commit(this.location);

    if (this.state.view) {
      this.state.view.refresh();
    }

    this.state.back = true;
    this.prev();
  }
}

export default BaseLastInputGuide;
