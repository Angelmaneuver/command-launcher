import { InputStep, MultiStepInput }       from '../utils/multiStepInput';
import { State }          from './base/base';
import { BaseInputGuide } from './base/input';
import * as Constant      from '../constant';

export class NameInputGuide extends BaseInputGuide {
	public static keys: Array<string> = [];

	protected type: Constant.DataType;

	constructor(state: State, type:Constant.DataType) {
		super(state);

		this.type     = type;
		this.itemId   = this.settings.itemId.name;
		this.prompt   = `Please enter the name of ${Constant.DATA_TYPE.folder === this.type ? 'folder' : 'command' }.`;
		this.validate = this.validateName;
	}

	public async show(input: MultiStepInput):Promise<void | InputStep> {
		NameInputGuide.keys = this.totalSteps > 0 ? Object.keys(this.currentCommands) : Object.keys(this.parentCommands);

		await super.show(input);
	}

	public async validateName(value: string): Promise<string | undefined> {
		if (!(value) || value.length === 0) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			return new Promise<string>((resolve, reject) => {
				resolve("Required field.");
			});
		} else if (NameInputGuide.keys.includes(value)) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			return new Promise<string>((resolve, reject) => {
				resolve("The name you entered is already in use.");
			});
		} else {
			return undefined;
		}
	}
}
