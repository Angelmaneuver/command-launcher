import { QuickPickItem }     from 'vscode';
import {
	InputStep,
	MultiStepInput
}                            from '../../utils/multiStepInput';
import {
	AbstractState,
	Guide,
}                            from '../base/abc';
import { AbstractMenuGuide } from './abc';
import { VSCodePreset }      from '../../utils/base/vscodePreset';
import {
	Command,
	TerminalCommand,
	Question,
	QUESTION_TYPE,
}                            from '../../utils/base/type';
import { Optional }          from '../../utils/base/optional';
import * as Constant         from '../../constant';

const items = {
	back: VSCodePreset.create(VSCodePreset.icons.reply,   'Return', 'Back to previous.'),
	exit: VSCodePreset.create(VSCodePreset.icons.signOut, 'Exit',   'Exit this extenion.'),
};

export class MenuGuide extends AbstractMenuGuide {
	public init(): void {
		super.init();

		this.items = this.items.concat(
			this.commandItems,
			this.root ? [items.exit] : [items.back]
		);
	}

	protected getExecute(label: string | undefined): (() => Promise<void>) | undefined {
		switch (label) {
			case items.back.label:
				this.prev();
			case items.exit.label:
				return undefined;
			default:
				return this.command();
		}
	}

	private command(): (() => Promise<void>) | undefined {
		const data = this.getCommand(this.getLabelStringByItem);

		if (Constant.DATA_TYPE.command === data[this.settings.itemId.type]) {
			const command      = data as Command;

			this.state.command = command[this.settings.itemId.command];

			return undefined;
		} else if (Constant.DATA_TYPE.terminalCommand === data[this.settings.itemId.type]) {
			return this.terminalCommand(data as TerminalCommand);
		} else {
			const name           = this.getLabelStringByItem;

			this.state.title     = `${this.title}/${name}`;
			this.state.hierarchy = this.hierarchy.concat(name);

			return async () => {
				this.setNextSteps([{ key: 'MenuGuide', state: this.state }]);
			};
		}
	}

	private terminalCommand(command: TerminalCommand): (() => Promise<void>) | undefined {
		const name      = this.activeItem?.label;
		const questions = Optional.ofNullable(command.questions).orElseNonNullable({});
		const keys      = Object.keys(questions);

		if (0 < keys.length) {
			const first  = Optional.ofNullable(keys.shift()).orElseThrow(ReferenceError('Question not found...'));
			const state  = this.createBaseState('', this.settings.itemId.questions, Object.keys(questions).length, first);
			const guides = [] as Array<Guide>;

			keys.forEach(
				(key) => {
					guides.push(this.getGuide(key, command, questions));
				}
			);

			return async () => {
				this.setNextSteps([this.getGuide(
					first,
					command,
					questions,
					Object.assign(state, { guides: guides, name: name })
				)]);
			};
		} else {
			this.state.name            = name;
			this.state.terminalCommand = command[this.settings.itemId.command];
			this.state.autoRun         = Optional.ofNullable(command[this.settings.itemId.autoRun]).orElseNonNullable(true);
			this.state.singleton       = Optional.ofNullable(command[this.settings.itemId.singleton]).orElseNonNullable(false);

			return undefined;
		}
	}

	private getGuide(
		name:      string,
		command:   TerminalCommand,
		questions: Record<string, Question>,
		state?:    Partial<AbstractState>,
	): Guide {
		const guide    = {} as Guide;
		const question = questions[name];

		guide.key      = QUESTION_TYPE.text === question.type ? 'QuestionInputGuide' : 'SelectQuestionGuide';
		guide.state    = state ? state : { itemId: name };
		guide.args     = [command, question];

		return guide;
	}
}

export class HistoryGuide extends AbstractMenuGuide {
	public init(): void {
		super.init();

		this.items = this.settings.history.map((item) => {
			return { label: VSCodePreset.icons.terminal.label, description: item.command } as QuickPickItem;
		}).concat(
			[items.exit]
		);
	}

	public async show(input: MultiStepInput):Promise<void | InputStep> {
		if (!this.settings.enableHistory) {
			this.state.message = 'The history function is disabled.';
		} else if (this.settings.enableHistory && 0 === this.settings.history.length) {
			this.state.message = 'No history.';
		} else {
			await super.show(input);
		}
	}

	protected getExecute(label: string | undefined): (() => Promise<void>) | undefined {
		if (this.activeItem && items.exit.label !== label) {
			const item = this.settings.history.find((item) => this.activeItem?.description === item.command);

			this.state.name            = item?.name;
			this.state.terminalCommand = item?.command;
			this.state.autoRun         = item?.autoRun;
			this.state.singleton       = Optional.ofNullable(item?.singleton).orElseNonNullable(false);
		}

		return undefined;
	}
}
