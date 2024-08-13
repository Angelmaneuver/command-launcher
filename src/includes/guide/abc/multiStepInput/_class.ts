import {
  window,
  Disposable,
  QuickInput,
  QuickInputButton,
  QuickInputButtons,
  QuickPickItem,
  QuickPick,
  InputBox,
} from 'vscode';

import { InputFlowAction } from './_InputFlowAction';
import { InputBoxParameters, QuickPickParameters } from './_interface';

type InputStep = (input: MultiStepInput) => Thenable<InputStep | void>;

class MultiStepInput {
  static async run(start: InputStep): Promise<void> {
    return new MultiStepInput().stepThrough(start);
  }

  private current?: QuickInput;
  private steps: InputStep[] = [];

  private async stepThrough(start: InputStep) {
    let step: InputStep | void = start;

    while (step) {
      step = await this.stepIn(step);
    }

    this.dispose();
  }

  private async stepIn(step: InputStep) {
    this.steps.push(step);

    if (this.current) {
      this.inputActivation(this.current, false);
    }

    try {
      return await step(this);
    } catch (error) {
      if (error instanceof Error) {
        return this.errorHandle(error);
      }
    }
  }

  async showQuickPick<
    T extends QuickPickItem,
    P extends QuickPickParameters<T>
  >({
    items,
    activeItem,
    placeholder,
    buttons,
    shouldResume,
    ...props
  }: P): Promise<T | (P extends { buttons: (infer I)[] } ? I : never)> {
    const disposable: Disposable[] = [];

    try {
      return await new Promise<
        T | (P extends { buttons: (infer I)[] } ? I : never)
      >((resolve, reject) => {
        const input = window.createQuickPick<T>();

        this.initialize(input, props);

        input.placeholder = placeholder;
        input.items = items;

        if (activeItem) {
          input.activeItems = [activeItem];
        }

        input.buttons = this.createButtons(buttons);

        disposable.push(
          input.onDidTriggerButton((item) => {
            if (item === QuickInputButtons.Back) {
              reject(InputFlowAction.back);
            } else {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              resolve(<any>item);
            }
          }),
          input.onDidChangeSelection((items) => resolve(items[0])),
          input.onDidHide(() => {
            (async () => {
              reject(
                shouldResume && (await shouldResume())
                  ? InputFlowAction.resume
                  : InputFlowAction.cancel
              );
            })().catch(reject);
          })
        );

        this.dispose();
        this.current = input;
        this.current.show();
      });
    } finally {
      disposable.forEach((d) => d.dispose());
    }
  }

  async showInputBox<P extends InputBoxParameters>({
    value,
    prompt,
    validate,
    buttons,
    shouldResume,
    ...props
  }: P): Promise<string | (P extends { buttons: (infer I)[] } ? I : never)> {
    const disposable: Disposable[] = [];

    try {
      return await new Promise<
        string | (P extends { buttons: (infer I)[] } ? I : never)
      >((resolve, reject) => {
        const input = window.createInputBox();

        this.initialize(input, props);

        input.value = value || '';
        input.prompt = prompt;
        input.buttons = this.createButtons(buttons);

        let validating = validate('');

        disposable.push(
          input.onDidTriggerButton((item) => {
            if (item === QuickInputButtons.Back) {
              reject(InputFlowAction.back);
            } else {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              resolve(<any>item);
            }
          }),
          input.onDidAccept(async () => {
            const value = input.value;
            this.inputActivation(input, false);

            if (!(await validate(value))) {
              resolve(value);
            }

            this.inputActivation(input, true);
          }),
          input.onDidChangeValue(async (text) => {
            const current = validate(text);
            validating = current;
            const validationMessage = await current;

            if (current === validating) {
              input.validationMessage = validationMessage;
            }
          }),
          input.onDidHide(() => {
            (async () => {
              reject(
                shouldResume && (await shouldResume())
                  ? InputFlowAction.resume
                  : InputFlowAction.cancel
              );
            })().catch(reject);
          })
        );

        this.dispose();
        this.current = input;
        this.current.show();
      });
    } finally {
      disposable.forEach((d) => d.dispose());
    }
  }

  private inputActivation(input: QuickInput, valid: boolean): void {
    input.enabled = valid;
    input.busy = !valid;
  }

  private errorHandle(error: Error) {
    if (error === InputFlowAction.back) {
      this.steps.pop();
      return this.steps.pop();
    } else if (error === InputFlowAction.resume) {
      return this.steps.pop();
    } else if (error === InputFlowAction.cancel) {
      return undefined;
    } else {
      throw error;
    }
  }

  private dispose(): void {
    if (this.current) {
      this.current.dispose();
    }
  }

  private initialize<T extends QuickPickItem>(
    input: QuickPick<T> | InputBox,
    props: {
      title: string;
      step: number;
      totalSteps: number;
    }
  ): void {
    input.title = props.title;
    input.step = props.step;
    input.totalSteps = props.totalSteps;
  }

  private createButtons(buttons: QuickInputButton[] | undefined) {
    return [
      ...(this.steps.length > 1 ? [QuickInputButtons.Back] : []),
      ...(buttons || []),
    ];
  }
}

export { MultiStepInput };

export type { InputStep };
