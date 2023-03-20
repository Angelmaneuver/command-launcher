import { State }          from './base/base';
import { BaseInputGuide } from './base/input';
import * as Constant      from '../constant';

async function validator(value: string, keys: Array<string>): Promise<string | undefined> {
	if (!(value) || value.length === 0) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		return new Promise<string>((resolve, reject) => {
			resolve("Required field.");
		});
	} else if (keys.includes(value)) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		return new Promise<string>((resolve, reject) => {
			resolve("The name you entered is already in use.");
		});
	} else {
		return undefined;
	}
}

class BaseNameInputGuide extends BaseInputGuide {
	protected type: Constant.DataType;

	constructor(state: State, type:Constant.DataType) {
		super(state);

		this.type     = type;
		this.itemId   = this.settings.itemId.name;
		this.prompt   = `Please enter the name of ${Constant.DATA_TYPE.folder === this.type ? 'folder' : 'command' }.`;
	}
}

export class NameInputGuide extends BaseNameInputGuide {
	public static keys: Array<string> = [];

	constructor(state: State, type:Constant.DataType, keys: Array<string>) {
		super(state, type);

		NameInputGuide.keys = keys;
		this.validate       = this.validateName;
	}

	public async validateName(value: string): Promise<string | undefined> {
		return validator(value, NameInputGuide.keys);
	}
}

export class NameInputGuide4SQLInputGuide extends BaseNameInputGuide {
	public static keys: Array<string> = [];

	constructor(state: State, type:Constant.DataType, keys: Array<string>) {
		super(state, type);

		NameInputGuide4SQLInputGuide.keys = keys;
		this.validate                     = this.validateName;
	}

	public async validateName(value: string): Promise<string | undefined> {
		return validator(value, NameInputGuide4SQLInputGuide.keys);
	}
}
