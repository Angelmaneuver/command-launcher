import { QuickPickItem }                 from 'vscode';
import {
	InputStep,
	MultiStepInput,
}                                        from '../../../../utils/multiStepInput';
import { Guide }                         from '../../../base/abc';
import { State }                         from '../../../base/base';
import { AbstractQuestionEditMenuGuide } from './abc';
import { Question, QUESTION_TYPE }       from '../../../../utils/base/type';
import { Optional }                      from '../../../../utils/base/optional';
import { VSCodePreset }                  from '../../../../utils/base/vscodePreset';
import * as Constant                     from '../../../../constant';

const items = {
	input:       VSCodePreset.create(VSCodePreset.icons.keyboard,       'Question with input',          'Add a question with text input.'),
	selection:   VSCodePreset.create(VSCodePreset.icons.selection,      'Question with selection list', 'Add a question with selection list.'),
	name:        VSCodePreset.create(VSCodePreset.icons.symbolVariable, 'Variable Name',                'Set the variable name.'),
	description: VSCodePreset.create(VSCodePreset.icons.question,       'Description',                  'Set the question text.'),
	default:     VSCodePreset.create(VSCodePreset.icons.symbolValue,    'Default',                      'Set the default value.'),
	order:       VSCodePreset.create(VSCodePreset.icons.listOrdered,    'Order',                        'Set the sort order.'),
	delimiter1:  { label: '-'.repeat(35) + ' Registered questions ' + '-'.repeat(35) } as QuickPickItem,
	delimiter2:  { label: '-'.repeat(35) + ' Registered selection item' + '-'.repeat(35) } as QuickPickItem,
};

export class QuestionEditMenuGuide extends AbstractQuestionEditMenuGuide {
	protected deleteConfirmText = 'Do you want to delete this question?';

	public async show(input: MultiStepInput):Promise<void | InputStep> {
		this.items = this.isRoot ? this.selectMenuItems : this.settingMenuItems;

		do {
			await super.show(input);
		} while (items.delimiter1 === this.inputPick || items.delimiter2 === this.inputPick);
	}

	protected getExecute(label: string | undefined): (() => Promise<void>) | undefined {
		this.initialValue    = undefined;
		this.state.hierarchy = this.hierarchy;

		switch (label) {
			case items.input.label:
			case items.selection.label:
				return this.setGuidance(label);
			case items.name.label:
			case items.description.label:
			case items.default.label:
			case items.order.label:
				return this.setSettingGuide(label);
			default:
				return super.getExecute(label);
		}
	}

	protected item(): (() => Promise<void>) | undefined {
		const name = this.getLabelStringByItem;

		this.initialValue          = this.activeItem?.label;
		this.state.hierarchy       = this.hierarchy.concat(this.isRoot ? [this.settings.itemId.questions, name] : [this.settings.itemId.selection, name]);
		this.state.resultSet[name] = undefined;

		return async () => {
			this.setNextSteps([{
				key:   this.isRoot ? 'QuestionEditMenuGuide' : 'SelectionItemEditMenuGuide',
				state: this.createBaseState(`/${name}`, name),
				args:  [this.type]
			}]);
		};
	}

	protected async save(): Promise<void> {
		if (this.settings.itemId.default in this.guideGroupResultSet) {
			this.guideGroupResultSet[this.settings.itemId.default] = (this.guideGroupResultSet[this.settings.itemId.default] as string).replace(Constant.LABEL_STRING_MATCH, '');
		}

		return super.save();
	}

	private get selectMenuItems(): Array<QuickPickItem> {
		let registerd = this.createItems(this.questions, VSCodePreset.icons.symbolVariable, this.settings.itemId.description);

		registerd = registerd.length > 0 ? [items.delimiter1].concat(registerd) : registerd;

		return [items.input, items.selection, QuestionEditMenuGuide.items.back, ...registerd];
	}

	private get settingMenuItems(): Array<QuickPickItem> {
		const question     = this.question;
		const settings     = [items.name, items.description, items.default, items.order];
		const save         = [];
		const returnOrBack = [];
		let   registerd    = [] as Array<QuickPickItem>;

		if (Object.keys(this.guideGroupResultSet).length > 0) {
			save.push(QuestionEditMenuGuide.items.save);
			returnOrBack.push(QuestionEditMenuGuide.items.return);
		} else {
			returnOrBack.push(QuestionEditMenuGuide.items.back);
		}

		if (QUESTION_TYPE.selection === question.type) {
			registerd = [items.delimiter2].concat(this.createItems(question.selection, VSCodePreset.icons.note, this.settings.itemId.parameter));
		}

		return [...settings, QuestionEditMenuGuide.items.delete, ...save, ...returnOrBack, ...registerd];
	}

	private setGuidance(label: string): () => Promise<void> {
		let   [title, guideGroupId, totalStep, type] = ['Question', 'addQuestion', items.input.label === label ? 2 : 3, this.type];
		let   optionState: Partial<State>            = {};
		const guides                                 = [{
			key:   'NameInputGuide',
			state: Object.assign(this.createBaseState(` - Add ${title}`, guideGroupId, totalStep), { prompt: `Please enter the name of variable.` }),
			args:  [type],
		}] as Array<Guide>;

		switch (label) {
			case items.input.label:
				guides.push({ key: 'TextQuestionLastInputGuide' });
				break;
			case items.selection.label:
				optionState.itemId = this.settings.itemId.description;
				optionState.prompt = 'Please enter the description of question.';

				guides.push(
					{ key: 'BaseInputGuide',                 state: optionState },
					{ key: 'SelectionQuestionLastInputGuide' },
				);
				break;
		}

		this.state.hierarchy                       = [...this.hierarchy].concat(this.settings.itemId.questions);
		this.state.resultSet[guideGroupId]         = {};

		return async () => {
			this.setNextSteps(guides);
		};
	}

	private setSettingGuide(label: string): () => Promise<void> {
		let [key, itemId]               = ['BaseInputGuide', ''];
		let optionState: Partial<State> = {};
		let args:        Array<unknown> = [];

		switch (label) {
			case items.name.label:
				[key, optionState.prompt, optionState.initialValue, args] = this.getNameSetting();
				break;
			case items.description.label:
				[itemId, optionState.prompt, optionState.initialValue]    = this.getDescriptionSetting();
				break;
			case items.default.label:
				[itemId, { key, optionState }]                            = this.getDefaultSetting();
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
			`Please enter the name of variable.`,
			this.guideGroupId,
			[this.type],
		];
	}

	private getDescriptionSetting(): [string, string, string] {
		return [
			this.settings.itemId.description,
			'Please enter the description of question.',
			this.question.description,
		];
	}

	private getDefaultSetting(): [string, { key: string, optionState: Partial<State> }] {
		return [
			this.settings.itemId.default,
			QUESTION_TYPE.text === this.question.type ? this.defaultSettingByInput : this.defaultSettingBySelection
		];
	}

	private getOrderSetting(): [string, string, string] {
		return [
			this.settings.itemId.orderNo,
			'Please enter the number you want to sort order.',
			Optional.ofNullable(this.question.orderNo).orElseNonNullable(''),
		];
	}

	private get defaultSettingByInput() {
		const optionState: Partial<State> = {};

		optionState['prompt']             = 'Please enter the default value of variable.';
		optionState['initialValue']       = Optional.ofNullable(this.question.default).orElseNonNullable('');

		return {
			key:         'BaseInputGuide',
			optionState: optionState,
		};
	}

	private get defaultSettingBySelection() {
		const question                           = this.question;
		const defaultItem                        = Optional.ofNullable(question.default).orElseNonNullable('');
		const items:       Array<QuickPickItem>  = this.createItems(question.selection, VSCodePreset.icons.note, this.settings.itemId.parameter);
		const optionState: Partial<State>        = {
			items:       items,
			placeholder: 'Please select the default item of variable.',
		};

		if (defaultItem.length > 0) {
			optionState.activeItem = items.filter(item => `${VSCodePreset.icons.note.label} ${defaultItem}` === item.label)[0];
		}

		return {
			key:         'BaseQuickPickGuide',
			optionState: optionState,
		};
	}

	private get questions(): Record<string, Question> {
		return this.settings.lookup(
			this.hierarchy.concat(this.settings.itemId.questions),
			this.location,
			this.settings.lookupMode.read,
			true,
		) as Record<string, Question>;
	}

	protected get question(): Question {
		return super.currentHierarchy as Question;
	}
}
