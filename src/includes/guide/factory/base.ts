import { AbstractGuide  }            from '../base/abc';
import { BaseInputGuide }            from '../base/input';
import { BaseConfirmGuide }          from '../confirm';
import { MenuGuide }                 from '../menu/base';
import { MenuGuideWithEdit }         from '../menu/edit';
import { SelectLabelGuide4Guidance } from '../label';
import { NameInputGuide }            from '../name';
import { AutoRunSettingGuide }       from '../autoRun';
import {
	CommandLastInputGuide,
	FolderLastInputGuide,
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
			MenuGuide:                 MenuGuide,
			MenuGuideWithEdit:         MenuGuideWithEdit,
			BaseInputGuide:            BaseInputGuide,
			BaseConfirmGuide:          BaseConfirmGuide,
			SelectLabelGuide4Guidance: SelectLabelGuide4Guidance,
			NameInputGuide:            NameInputGuide,
			AutoRunSettingGuide:       AutoRunSettingGuide,
			CommandLastInputGuide:     CommandLastInputGuide,
			FolderLastInputGuide:      FolderLastInputGuide,
		};
		/* eslint-enable @typescript-eslint/naming-convention */
	}
}
