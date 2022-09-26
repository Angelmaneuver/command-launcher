import { QuickPickItem }                 from 'vscode';
import {
	InputStep,
	MultiStepInput,
}                                        from '../../../../utils/multiStepInput';
import { Guide }                         from '../../../base/abc';
import { State }                         from '../../../base/base';
import { AbstractQuestionEditMenuGuide } from './abc';
import { SelectionItem }                 from '../../../../utils/base/type';
import { Optional }                      from '../../../../utils/base/optional';
import { VSCodePreset }                  from '../../../../utils/base/vscodePreset';

const items = {
	name:      VSCodePreset.create(VSCodePreset.icons.symbolVariable,  'Item Name', 'Set the item name.'),
	parameter: VSCodePreset.create(VSCodePreset.icons.symbolParameter, 'Parameter', 'Set the parameter.'),
	order:     VSCodePreset.create(VSCodePreset.icons.listOrdered,     'Order',     'Set the sort order.'),
};

export class SelectionItemEditMenuGuide extends AbstractQuestionEditMenuGuide {
	protected deleteConfirmText = 'Do you want to delete this item?';

	public async show(input: MultiStepInput):Promise<void | InputStep> {
		this.items = this.settingMenuItems;

		await super.show(input);
	}

	protected getExecute(label: string | undefined): (() => Promise<void>) | undefined {
		this.initialValue    = undefined;
		this.state.hierarchy = this.hierarchy;

		switch (label) {
			case items.name.label:
			case items.parameter.label:
			case items.order.label:
				return this.setSettingGuide(label);
			default:
				return super.getExecute(label);
		}
	}

	protected command(): (() => Promise<void>) | undefined {
		return;
	}

	private get settingMenuItems(): Array<QuickPickItem> {
		const settings     = [items.name, items.parameter, items.order];
		const save         = [];
		const returnOrBack = [];

		if (Object.keys(this.guideGroupResultSet).length > 0) {
			save.push(SelectionItemEditMenuGuide.items.save);
			returnOrBack.push(SelectionItemEditMenuGuide.items.return);
		} else {
			returnOrBack.push(SelectionItemEditMenuGuide.items.back);
		}

		return [...settings, SelectionItemEditMenuGuide.items.delete, ...save, ...returnOrBack];
	}

	private setSettingGuide(label: string): () => Promise<void> {
		let [key, itemId]               = ['BaseInputGuide', ''];
		let optionState: Partial<State> = {};
		let args:        Array<unknown> = [];

		switch (label) {
			case items.name.label:
				[key, optionState.prompt, optionState.initialValue, args] = this.getNameSetting();
				break;
			case items.parameter.label:
				[itemId, optionState.prompt, optionState.initialValue]    = this.getParameterSetting();
				break;
			case items.order.label:
				[itemId, optionState.prompt, optionState.initialValue]    = this.getOrderSetting();
				break;
		}

		const guide: Guide = {
			key:   key,
			state: Object.assign(this.createBaseState('', this.guideGroupId, 0, itemId), optionState),
			args:  args,
		};

		return async () => {
			this.setNextSteps([guide]);
		};
	}

	private getNameSetting(): [string, string, string, Array<number>] {
		return [
			'NameInputGuide',
			`Please enter the name of item.`,
			this.guideGroupId,
			[this.type]
		];
	}

	private getParameterSetting(): [string, string, string] {
		return [
			this.settings.itemId.parameter,
			'Please enter the parameter value of item.',
			this.selectionItem.parameter
		];
	}

	private getOrderSetting(): [string, string, string] {
		return [
			this.settings.itemId.orderNo,
			'Please enter the number you want to sort order.',
			Optional.ofNullable(this.selectionItem.orderNo).orElseNonNullable('')
		];
	}

	private get selectionItem(): SelectionItem {
		return this.settings.lookup(this.hierarchy, this.settings.lookupMode.read) as SelectionItem;
	}


}
