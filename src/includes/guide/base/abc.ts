import * as _           from 'lodash';
import {
	InputStep,
	MultiStepInput,
	InputFlowAction
}                       from '../../utils/multiStepInput';
import { GuideFactory } from '../factory/base';
import { Optional }     from '../../utils/base/optional';

export interface AbstractState{
	guideGroupId?: string,
	itemId?:       string,
	title:         string,
	step?:         number,
	totalSteps?:   number,
	initialValue?: unknown,
	validate?:     (value: string) => Promise<string | undefined>,
	shouldResume?: () => Promise<boolean>,
	resultSet:     Record<string, unknown>,
	back?:         boolean,
}

export interface Guide{ key: string, state?: Partial<AbstractState>, args?: Array<unknown>}

const initialFields = [
	'guideGroupId', 'itemId', 'title', 'step', 'totalSteps', 'initialValue', 'inputResult', 'validate', 'shouldResume'
];

export abstract class AbstractGuide {
	protected _initialize                                                   = false;
	protected _state;
	protected initialFields: Array<string>                                  = initialFields;
	protected init2DeepCopy: Array<string>                                  = [];
	protected guideGroupId                                                  = '';
	protected itemId                                                        = '';
	protected title                                                         = '';
	protected step                                                          = 0;
	protected totalSteps                                                    = 0;
	protected initialValue:  unknown                                        = undefined;
	protected _inputValue:   unknown                                        = undefined;
	protected validate:      (value: string) => Promise<string | undefined> = async (value: string) => { return undefined; };                     // eslint-disable-line @typescript-eslint/no-unused-vars
	protected shouldResume:  () => Promise<boolean>                         = async () => new Promise<boolean>((resolve, reject) => { return; }); // eslint-disable-line @typescript-eslint/no-unused-vars
	protected nextStep:      AbstractGuide | undefined                      = undefined;

	constructor(state: AbstractState) {
		this._state = state;
	}

	public init(): void {
		this.initialFields.forEach(
			(key) => {
				const value  = Optional.ofNullable(Reflect.get(this.state, key)).orElseNonNullable(Reflect.get(this, key));
				let   regist = undefined;

				if (this.init2DeepCopy.includes(key)) {
					regist = _.cloneDeep(value);
				} else {
					regist = value;
				}

				Reflect.set(this, key, regist);
			}
		);

		if (this.totalSteps > 0) {
			this.step      += 1;
			this.state.step = this.step;
		}

		this.stateClear();

		this._initialize = true;
	}

	protected stateClear(): void {
		this.state.itemId       = undefined;
		this.state.initialValue = undefined;
		this.state.validate     = undefined;
		this.state.shouldResume = undefined;
	}

	protected get state(): AbstractState {
		return this._state;
	}

	protected set inputValue(value: unknown) {
		this._inputValue = value;
	}

	protected get inputValue(): unknown {
		return Optional.ofNullable(this.guideGroupResultSet[this.itemId]).orElseNullable(this.initialValue);
	}

	protected get inputValueAsString(): string {
		return typeof(this.inputValue) === 'string' ? this.inputValue : '';
	}

	protected get guideGroupResultSet(): Record<string, unknown> {
		if (!this.state.resultSet[this.guideGroupId]) {
			this.state.resultSet[this.guideGroupId] = {};
		}

		return this.state.resultSet[this.guideGroupId] as Record<string, unknown>;
	}

	public setNextStep(guide: AbstractGuide): AbstractGuide {
		this.nextStep = guide;

		return guide;
	}

	public setNextSteps(guides: Array<Guide>): void {
		let guideInstances: undefined | AbstractGuide = undefined;
		let preInstance:    undefined | AbstractGuide = undefined;

		guides.forEach(
			(guide) => {
				if (guide.state) {
					Object.assign(this.state, guide.state);					
				}

				const args          = guide.args ? guide.args : [];
				const guideInstance = GuideFactory.create(guide.key, this.state, ...args);

				guideInstance.init();

				if (guideInstances === undefined && preInstance === undefined) {
					guideInstances = guideInstance;
					preInstance    = guideInstance;
				} else {
					preInstance    = preInstance?.setNextStep(guideInstance);
				}
			}
		);

		if (guideInstances) {
			this.setNextStep(guideInstances);
		}
	}

	public async start(input: MultiStepInput): Promise<void | InputStep> {
		if (!this._initialize) {
			this.init();
		}

		this.back();

		await this.show(input);
		await this.after();

		if (this.nextStep instanceof AbstractGuide) {
			return () => (this.nextStep as AbstractGuide).start(input);
		}

		await this.final();
	}

	protected back(): void {
		if (this.state.back) {
			this.prev();
		}
	}

	abstract show(input: MultiStepInput): Promise<void | InputStep>;

	protected async after(): Promise<void> { return; }

	protected async final(): Promise<void> { return; }

	protected prev(): void {
		throw InputFlowAction.back;
	}
}
