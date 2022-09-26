import { AbstractGuide  }             from '../base/abc';
import { BaseInputGuide }             from '../base/input';
import { BaseQuickPickGuide }         from '../base/pick';
import { BaseConfirmGuide }           from '../confirm';
import {
	QuestionInputGuide,
	SelectQuestionGuide,
 }                                    from '../question';
import { MenuGuide }                  from '../menu/base';
import { EditMenuGuide }              from '../menu/edit/base';
import { QuestionEditMenuGuide }      from '../menu/edit/question/base';
import { SelectionItemEditMenuGuide } from '../menu/edit/question/selection';
import { SelectLabelGuide4Guidance }  from '../label';
import { NameInputGuide }             from '../name';
import { AutoRunSettingGuide }        from '../autoRun';
import {
	CommandLastInputGuide,
	FolderLastInputGuide,
	TextQuestionLastInputGuide,
	SelectionQuestionLastInputGuide,
}                                    from '../last';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Constructable<T> extends Function { new (...args: Array<any>): T; }

export abstract class GuideFactory {
	private static guides: Record<string, Constructable<AbstractGuide>> = {};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public static create(className: string, ...args: Array<any>): AbstractGuide {
		if (0 === Object.keys(this.guides).length) {
			this.init();
		}

		const guideName = Object.keys(this.guides).find(guide => guide === className);

		if (guideName) {
			return new this.guides[guideName](...args);
		} else {
			throw new ReferenceError('Requested ' + className + ' class not found...');
		}
	}

	private static init(): void {
		/* eslint-disable @typescript-eslint/naming-convention */
		this.guides = {
			MenuGuide:                       MenuGuide,
			EditMenuGuide:                   EditMenuGuide,
			BaseInputGuide:                  BaseInputGuide,
			BaseQuickPickGuide:              BaseQuickPickGuide,
			BaseConfirmGuide:                BaseConfirmGuide,
			QuestionInputGuide:              QuestionInputGuide,
			SelectQuestionGuide:             SelectQuestionGuide,
			QuestionEditMenuGuide:           QuestionEditMenuGuide,
			SelectLabelGuide4Guidance:       SelectLabelGuide4Guidance,
			SelectionItemEditMenuGuide:      SelectionItemEditMenuGuide,
			NameInputGuide:                  NameInputGuide,
			AutoRunSettingGuide:             AutoRunSettingGuide,
			CommandLastInputGuide:           CommandLastInputGuide,
			FolderLastInputGuide:            FolderLastInputGuide,
			TextQuestionLastInputGuide:      TextQuestionLastInputGuide,
			SelectionQuestionLastInputGuide: SelectionQuestionLastInputGuide,
		};
		/* eslint-enable @typescript-eslint/naming-convention */
	}
}
