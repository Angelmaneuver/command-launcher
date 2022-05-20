import { InputStep, MultiStepInput } from '../../utils/multiStepInput';
import { AbstractBaseGuide }         from './base';

export class BaseInputGuide extends AbstractBaseGuide {
	protected prompt  = '';

	public init(): void {
		this.initialFields.push('prompt');

		super.init();
	}

	public async show(input: MultiStepInput):Promise<void | InputStep> {
		this._inputValue = await input.showInputBox(
			{
				title:        this.title,
				step:         this.step,
				totalSteps:   this.totalSteps,
				value:        this.inputValueAsString,
				prompt:       this.prompt,
				validate:     this.validate,
				shouldResume: this.shouldResume,
			}
		);

		this.setResultSet(this._inputValue);
	}

	protected setResultSet(value: unknown): void {
		if (typeof(value) === 'string' && this.itemId.length > 0) {
			this.guideGroupResultSet[this.itemId] = value;
		}
	}

	protected async after(): Promise<void> {
		return this.inputStepAfter();
	}
}
