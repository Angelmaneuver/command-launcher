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
		const selectionItem                = this.selectionItem;
		let [key, itemId, additionalTitle] = ['BaseInputGuide', '', ''];
		let optionState: Partial<State>    = {};
		let args: Array<unknown>           = [];
		let guide: Guide;

		switch (label) {
			case items.name.label:
				key                         = 'NameInputGuide';
				optionState['prompt']       = `Please enter the name of item.`;
				optionState['initialValue'] = this.guideGroupId;
				args                        = [this.type];
				break;
			case items.parameter.label:
				itemId                      = this.settings.itemId.parameter;
				optionState['prompt']       = 'Please enter the parameter value of item.';
				optionState['initialValue'] = selectionItem.parameter;
				break;
			case items.order.label:
				itemId                      = this.settings.itemId.orderNo;
				optionState['prompt']       = 'Please enter the number you want to sort order.';
				optionState['initialValue'] = Optional.ofNullable(selectionItem.orderNo).orElseNonNullable('');
				break;
		}

		guide = {
			key:   key,
			state: Object.assign(
				this.createBaseState(additionalTitle, this.guideGroupId, 0, itemId),
				optionState
			),
		};

		if (args.length > 0) {
			guide['args'] = args;
		}

		return async () => {
			this.setNextSteps([guide]);
		};
	}

	private get selectionItem(): SelectionItem {
		return this.settings.lookup(this.hierarchy, this.settings.lookupMode.read) as SelectionItem;
	}


}
