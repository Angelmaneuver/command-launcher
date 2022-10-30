import { BaseInputGuide } from '../base/input';

export class KeepHistoryNumberGuide extends BaseInputGuide {
	public init(): void {
		super.init();

		this.prompt       = `Enter the maximum number of terminal commands you want to keep in the history.`;
		this.initialValue = this.settings.keepHistoryNumber.toString();
		this.validate     = this.validator;
	}

	protected async inputStepAfter(): Promise<void> {
		this.settings.updateKeepHistoryNumber(Number(this._inputValue));

		return super.inputStepAfter();
	}

	public async validator(value: string): Promise<string | undefined> {
		const string2Number = Number(value);

		if (!isNaN(string2Number) && (0 <= string2Number && 65555 >= string2Number)) {
			return undefined;
		} else {
			return new Promise<string>((resolve, reject) => {
				resolve(`Enter a number between 0 and 65555.`);
			});
		}
	}
}
