import AbstractGuide from '@/guide/abc/AbstractGuide';
import BaseConfirmGuide from '@/guide/base/BaseConfirmGuide';
import BaseInputGuide from '@/guide/base/BaseInputGuid';
import BaseQuickPickGuide from '@/guide/base/BaseQuickPickGuide';
import EditMenuGuide from '@/guide/menu/base/EditMenuGuide';
import HistoryGuide from '@/guide/menu/base/HistoryGuide';
import MenuGuide from '@/guide/menu/base/MenuGuide';
import QuestionEditMenuGuide from '@/guide/menu/base/QuestionEditMenuGuide';
import SelectionItemEditMenuGuide from '@/guide/menu/base/SelectionItemEditMenuGuide';
import SelectSettingGuide from '@/guide/menu/base/SelectSettingGuide';
import AutoRunSettingGuide from '@/guide/parts/AutoRunSettingGuide';
import ConfirmSettingGuide from '@/guide/parts/ConfirmSettingGuide';
import EnableHistoryGuide from '@/guide/parts/EnableHistory';
import KeepHistoryNumberGuide from '@/guide/parts/KeepHistoryNumber';
import SelectLabelGuide4Guidance from '@/guide/parts/label/SelectLabelGuide4Guidance';
import CommandLastInputGuide from '@/guide/parts/last/CommandLastInputGuide';
import FolderLastInputGuide from '@/guide/parts/last/FolderLastInputGuide';
import SelectionQuestionLastInputGuide from '@/guide/parts/last/SelectionQuestionLastInputGuide';
import TextQuestionLastInputGuide from '@/guide/parts/last/TextQuestionLastInputGuide';
import NameInputGuide from '@/guide/parts/name/NameInputGuide';
import NameInputGuide4SQLInputGuide from '@/guide/parts/name/NameInputGuide4SQLInputGuide';
import QuestionInputGuide from '@/guide/parts/question/QuestionInputGuide';
import SelectQuestionGuide from '@/guide/parts/question/SelectQuestionGuide';
import SelectLocationGuide from '@/guide/parts/SelectLocationGuide';
import SingletonSettingGuide from '@/guide/parts/SingletonSettingGuide';

interface Constructable<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: Array<any>): T;
}

abstract class GuideFactory {
  private static guides: Record<string, Constructable<AbstractGuide>> = {
    MenuGuide: MenuGuide,
    HistoryGuide: HistoryGuide,
    EditMenuGuide: EditMenuGuide,
    BaseInputGuide: BaseInputGuide,
    BaseQuickPickGuide: BaseQuickPickGuide,
    BaseConfirmGuide: BaseConfirmGuide,
    QuestionInputGuide: QuestionInputGuide,
    SelectQuestionGuide: SelectQuestionGuide,
    QuestionEditMenuGuide: QuestionEditMenuGuide,
    SelectLabelGuide4Guidance: SelectLabelGuide4Guidance,
    SelectionItemEditMenuGuide: SelectionItemEditMenuGuide,
    SelectLocationGuide: SelectLocationGuide,
    NameInputGuide: NameInputGuide,
    NameInputGuide4SQLInputGuide: NameInputGuide4SQLInputGuide,
    ConfirmSettingGuide: ConfirmSettingGuide,
    AutoRunSettingGuide: AutoRunSettingGuide,
    SingletonSettingGuide: SingletonSettingGuide,
    CommandLastInputGuide: CommandLastInputGuide,
    FolderLastInputGuide: FolderLastInputGuide,
    TextQuestionLastInputGuide: TextQuestionLastInputGuide,
    SelectionQuestionLastInputGuide: SelectionQuestionLastInputGuide,
    SelectSettingGuide: SelectSettingGuide,
    EnableHistoryGuide: EnableHistoryGuide,
    KeepHistoryNumberGuide: KeepHistoryNumberGuide,
  } as const;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static create(className: string, ...args: Array<any>): AbstractGuide {
    const guideName = Object.keys(this.guides).find(
      (guide) => guide === className
    );

    if (guideName) {
      return new this.guides[guideName](...args);
    } else {
      throw new ReferenceError(
        'Requested ' + className + ' class not found...'
      );
    }
  }
}

export default GuideFactory;
