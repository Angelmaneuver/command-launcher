import { State }            from './base/base';
import { BaseInputGuide }   from './base/input';
import { BaseValidator }    from './validator/base';
import * as Constant        from '../constant';
import { Optional }         from '../utils/base/optional';

const match = /^\$\(.+\)/;

export class BaseLastInputGuide extends BaseInputGuide {
	protected registName: string                  = '';
	protected registData: Record<string, unknown> = {};

	protected async lastInputStepExecute(): Promise<void> {
		this.registName                                   = this.guideGroupResultSet[this.settings.itemId.name] as string;

		this.registData[this.settings.itemId.lable]       = (
			Optional
				.ofNullable((this.guideGroupResultSet[this.settings.itemId.lable] as string).match(match))
				.orElseThrow(ReferenceError('Label value not found...'))
		)[0];
		this.registData[this.settings.itemId.description] = this.guideGroupResultSet[this.settings.itemId.description];

		const registeredAt = this.settings.lookup(this.hierarchy, this.settings.lookupMode.write);

		registeredAt[this.registName] = this.registData;

		this.settings.sort(this.hierarchy);
		this.settings.commit();

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
		this.registData[this.settings.itemId.type]    = Constant.DATA_TYPE.command;
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

	protected async lastInputStepExecute(): Promise<void> {
		this.registData[this.settings.itemId.type] = Constant.DATA_TYPE.folder;

		await super.lastInputStepExecute();
	}
}
