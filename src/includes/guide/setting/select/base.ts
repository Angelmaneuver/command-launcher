import {
	InputStep,
	MultiStepInput
}                                       from '../../../utils/multiStepInput';
import { AbstractQuickPickSelectGuide } from '../../base/pick';
import { VSCodePreset }                 from '../../../utils/base/vscodePreset';

const items = {
	enableHistory:     VSCodePreset.create(VSCodePreset.icons.check,       'History',     'Keep a history of terminal commands executed.'),
	keepHistoryNumber: VSCodePreset.create(VSCodePreset.icons.listOrdered, 'Keep Number', 'Maximum number of terminal command history.'),
	back:              VSCodePreset.create(VSCodePreset.icons.reply,       'Return',      'Back to previous.'),
};

export class SelectSettingGuide extends AbstractQuickPickSelectGuide {
	public async show(input: MultiStepInput): Promise<void | InputStep> {
		this.items = [
			items.enableHistory,
		].concat(
			this.settings.enableHistory ? items.keepHistoryNumber : []			
		).concat(
			items.back
		);

		await super.show(input);
	}

	protected getExecute(label: string | undefined): (() => Promise<void>) | undefined {
		switch (label) {
			case items.enableHistory.label:
				return async () => { this.setNextSteps([{ key: 'EnableHistoryGuide' }]); };
			case items.keepHistoryNumber.label:
				return async () => { this.setNextSteps([{ key: 'KeepHistoryNumberGuide' }]); };
			default:
				return async () => { this.prev(); };
		}
	}
}
