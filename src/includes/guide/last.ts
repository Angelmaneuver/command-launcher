import {
	InputStep,
	MultiStepInput
}                                       from '../utils/multiStepInput';
import { State }                        from './base/base';
import { BaseInputGuide }               from './base/input';
import { BaseValidator }                from './validator/base';
import { NameInputGuide4SQLInputGuide } from './name';
import { DATA_TYPE }                    from '../constant';
import { QUESTION_TYPE }                from '../utils/base/type';
import * as Constant                    from '../constant';
import { Optional }                     from '../utils/base/optional';
import { VSCodePreset }                 from '../utils/base/vscodePreset';

export class BaseLastInputGuide extends BaseInputGuide {
	protected registName: string                  = '';
	protected registData: Record<string, unknown> = {};

	protected async lastInputStepExecute(): Promise<void> {
		this.registName                                   = this.guideGroupResultSet[this.settings.itemId.name] as string;

		this.registData[this.settings.itemId.type]        = this.guideGroupResultSet[this.settings.itemId.type];
		this.registData[this.settings.itemId.lable]       = (
			Optional
				.ofNullable((this.guideGroupResultSet[this.settings.itemId.lable] as string).match(Constant.LABEL_STRING_ONLY_MATCH))
				.orElseThrow(ReferenceError('Label value not found...'))
		)[0];
		this.registData[this.settings.itemId.description] = this.guideGroupResultSet[this.settings.itemId.description];

		const registeredAt = this.settings.lookup(this.hierarchy, this.location, this.settings.lookupMode.write);

		registeredAt[this.registName] = this.registData;

		this.settings.sort(this.hierarchy, this.location);
		await this.settings.commit(this.location);

		this.state.back = true;
		this.prev();
	}
}

export class CommandLastInputGuide extends BaseLastInputGuide {
	constructor(state: State) {
		super(state);

		this.itemId   = this.settings.itemId.command;
		this.prompt   = 'Please enter the command you want to run.';
		this.validate = BaseValidator.validateRequired;
	}

	protected async lastInputStepExecute(): Promise<void> {
		this.registData[this.settings.itemId.command] = this.guideGroupResultSet[this.settings.itemId.command];

		await super.lastInputStepExecute();
	}
}

export class FolderLastInputGuide extends BaseLastInputGuide {
	constructor(state: State) {
		super(state);

		this.itemId   = this.settings.itemId.description;
		this.prompt   = 'Please enter the description of folder.';
	}
}

export class TextQuestionLastInputGuide extends BaseLastInputGuide {
	constructor(state: State) {
		super(state);

		this.itemId = this.settings.itemId.description;
		this.prompt = 'Please enter the description of question.';
	}

	protected async lastInputStepExecute(): Promise<void> {
		this.registName                                   = this.guideGroupResultSet[this.settings.itemId.name] as string;
		this.registData[this.settings.itemId.type]        = QUESTION_TYPE.text;
		this.registData[this.settings.itemId.description] = this.guideGroupResultSet[this.settings.itemId.description];

		const registeredAt = this.settings.lookup(this.hierarchy, this.location, this.settings.lookupMode.write);

		registeredAt[this.registName] = this.registData;

		await this.settings.commit(this.location);

		this.state.back = true;
		this.prev();
	}
}

export const items = [
	VSCodePreset.create(VSCodePreset.icons.check, 'Yes', 'Continue to register.'),
	VSCodePreset.create(VSCodePreset.icons.x,     'No',  'Stop registering a selection items and register a question.'),
];

export class SelectionQuestionLastInputGuide extends BaseLastInputGuide {
	private nameInputGuide: NameInputGuide4SQLInputGuide;

	constructor(state: State, keys: Array<string>) {
		super(state);

		this.itemId         = this.settings.itemId.selection;
		this.nameInputGuide = new NameInputGuide4SQLInputGuide(this.state, DATA_TYPE.terminalCommand, keys);
	}

	public async show(input: MultiStepInput):Promise<void | InputStep> {
		const store: Record<string, unknown> = Optional.ofNullable(this.guideGroupResultSet[this.itemId]).orElseNonNullable({});

		do {
			const commandSet: Record<string, string>   = {};
			const name                                 = await this.inputName(input);
			const parameter                            = await this.inputParameter(input);
	
			commandSet[this.settings.itemId.parameter] = parameter;
			store[name]                                = commandSet;
		} while (await this.continue(input));

		this.guideGroupResultSet[this.itemId] = store;
	}

	protected setResultSet(value: unknown): void {}

	private async inputName(input: MultiStepInput): Promise<string> {
		const defaultValidator = this.validate;

		this.prompt   = 'Please enter the name of selection item.';
		this.validate = this.nameInputGuide.validateName;

		await super.show(input);

		this.validate = defaultValidator;

		const value   = this._inputValue as string;

		NameInputGuide4SQLInputGuide.keys.push(value);

		return value;
	}

	private async inputParameter(input: MultiStepInput): Promise<string> {
		this.prompt   = 'Please enter the command parameter of selection item.';

		await super.show(input);

		return this._inputValue as string;
	}

	private async continue(input: MultiStepInput):Promise<boolean> {
		return items[0] === await input.showQuickPick(
			{
				title:        this.title,
				step:         this.step,
				totalSteps:   this.totalSteps,
				placeholder:  'Would you like to continue registering selection item?',
				items:        items,
				activeItem:   items[0],
				shouldResume: this.shouldResume,
			}
		);
	}

	protected async lastInputStepExecute(): Promise<void> {
		this.registName                                   = this.guideGroupResultSet[this.settings.itemId.name] as string;
		this.registData[this.settings.itemId.type]        = QUESTION_TYPE.selection;
		this.registData[this.settings.itemId.description] = this.guideGroupResultSet[this.settings.itemId.description];
		this.registData[this.settings.itemId.selection]   = this.guideGroupResultSet[this.settings.itemId.selection];

		const registeredAt = this.settings.lookup(this.hierarchy, this.location, this.settings.lookupMode.write);

		registeredAt[this.registName] = this.registData;

		await this.settings.commit(this.location);

		this.state.back = true;
		this.prev();
	}
}
