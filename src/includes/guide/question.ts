import { ExtensionContext }   from 'vscode';
import { State }              from './base/base';
import { BaseInputGuide }     from './base/input';
import { BaseQuickPickGuide } from './base/pick';
import {
	TerminalCommand,
	Question,
}                             from '../utils/base/type';
import { Optional }           from '../utils/base/optional';
import { VSCodePreset }       from '../utils/base/vscodePreset';

function assembly(base: string, inputSet: Record<string, string>): string {
	let command = base;
	let keys    = Object.keys(inputSet);

	keys.forEach(
		(key) => {
			command = command.replace(
				key,
				Optional.ofNullable(inputSet[key]).orElseNonNullable('') as string
			);
		}
	);

	return command;
}

export class QuestionInputGuide extends BaseInputGuide {
	private commandSet: TerminalCommand;
	private question:   Question;
	private recall:     boolean;

	constructor(
		state:      State,
		commandSet: TerminalCommand,
		question:   Question,
		recall?:    boolean,
		context?:   ExtensionContext
	) {
		super(state, context);

		this.commandSet   = commandSet;
		this.question     = question;
		this.recall       = Optional.ofNullable(recall).orElseNonNullable(false);
		this.state.prompt = question.description;

		if (question.default && 0 < question.default.length) {
			this.state.prompt = `${this.state.prompt} Default:${question.default}`;
		}
	}

	public init(): void {
		const step = this.state.step ? this.state.step : 0;

		this.initialFields.push('guides');

		super.init();

		if (this.recall) {
			this.step       = step;
			this.state.step = step;
		}
	}

	protected setResultSet(value: unknown): void {
		if (typeof(value) === 'string' && 0 === value.length && this.question.default && 0 < this.question.default.length) {
			this.guideGroupResultSet[this.itemId] = this.question.default;
		} else {
			super.setResultSet(value);
		}
	}

	protected async lastInputStepExecute(): Promise<void> {
		this.state.terminalCommand = assembly(this.commandSet.command, this.guideGroupResultSet as Record<string, string>);
		this.state.autoRun         = Optional.ofNullable(this.commandSet.autoRun).orElseNonNullable(true);
	}
}

export const direct = VSCodePreset.create(VSCodePreset.icons.edit, 'Input', 'Directly enter a value');

export class SelectQuestionGuide extends BaseQuickPickGuide {
	private commandSet: TerminalCommand;
	private question:   Question;
	private default:    string;

	constructor(
		state:      State,
		commandSet: TerminalCommand,
		question:   Question,
		context?:   ExtensionContext
	) {
		super(state, context);

		this.commandSet        = commandSet;
		this.question          = question;
		this.default           = Optional.ofNullable(question.default).orElseNonNullable('');
		this.state.placeholder = question.description;
		this.state.items       = [];

		Object.keys(question.selection).forEach(
			(key) => {
				this.pushMenuItems(key, question.selection[key].parameter);
			}
		);

		this.state.items.push(direct);
	}

	public init(): void {
		this.initialFields.push('guides');

		super.init();
	}

	private pushMenuItems(label: string, description: string): void {
		const item = VSCodePreset.create(VSCodePreset.icons.note, label, description);

		this.state.items?.push(item);

		if (this.default === label) {
			this.state.initialValue = item;
		}
	}

	public async after(): Promise<void> {
		if (direct === this.activeItem) {
			this.guideGroupResultSet[this.itemId] = undefined;

			this.setNextSteps([{
				key:   'QuestionInputGuide',
				state: { itemId: this.itemId },
				args:  [this.commandSet, this.question, true],
			}]);
		} else {
			this.guideGroupResultSet[this.itemId] = this.question.selection[this.getLabelStringByItem].parameter;
		}

		return super.after();
	}

	protected async lastInputStepExecute(): Promise<void> {
		this.state.terminalCommand = assembly(this.commandSet.command, this.guideGroupResultSet as Record<string, string>);
		this.state.autoRun         = Optional.ofNullable(this.commandSet.autoRun).orElseNonNullable(true);
	}
}
