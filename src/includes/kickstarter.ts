import { window, commands, ExtensionContext, Terminal } from 'vscode';

import * as Constant from '@/constant';
import MultiStepInput from '@/guide/abc/multiStepInput';
import { State } from '@/guide/base/type';
import GuideFactory from '@/guide/factory';
import ExtensionSetting, { DATA_TYPE } from '@/settings/extension';

async function start(
  className: string,
  state: Partial<State>,
  args: Array<unknown>
): Promise<void> {
  try {
    const menu = GuideFactory.create(className, ...args);
    await MultiStepInput.run((input: MultiStepInput) => menu.start(input));

    if (present(state.command)) {
      commands.executeCommand(state.command!);
    } else if (present(state.terminalCommand)) {
      executeTerminalCommand(state);
    }
  } catch (e) {
    errorHandling(e);
  }

  if (present(state.message)) {
    window.showInformationMessage(state.message!);
  }

  if (state.reload) {
    commands.executeCommand('workbench.action.reloadWindow');
  }
}

function present(value?: string): boolean {
  return value && value.length > 0 ? true : false;
}

function executeTerminalCommand(state: Partial<State>): void {
  const setting = new ExtensionSetting();

  setting.updateHistory({
    type: setting.dataType.terminalCommand,
    name: state.name!,
    command: state.terminalCommand!,
    autoRun: state.autoRun!,
    singleton: state.singleton!,
  });

  const terminal = getTerminal(state.name!, state.singleton!);

  terminal.show();
  terminal.sendText(state.terminalCommand!, state.autoRun!);
}

const SINGLETON_KEYWORD = ' - Singleton';

function getTerminal(_name: string, singleton: boolean): Terminal {
  const name = singleton ? `${_name} ${SINGLETON_KEYWORD}` : _name;

  if (singleton) {
    isStarted(name, _name);

    return window.createTerminal(name);
  }

  let terminal: Terminal | undefined = window.activeTerminal;

  if (terminal?.name.includes(SINGLETON_KEYWORD)) {
    terminal = undefined;
  }

  if (!terminal) {
    terminal = window.terminals.find(
      (terminal) => !terminal.name.includes(SINGLETON_KEYWORD)
    );
  }

  return terminal ? terminal : window.createTerminal();
}

function isStarted(name: string, displayName: string) {
  if (isExist(name)) {
    throw new Error(
      Constant.message.showInformationMessage.error.singleton(
        displayName.replace(Constant.matcher.label_string, '')
      )
    );
  }
}

function isExist(name: string): boolean {
  const terminal = window.terminals.find((terminal) => terminal.name === name);

  return terminal ? true : false;
}

function errorHandling(e: unknown) {
  if (e instanceof Error) {
    window.showWarningMessage(e.message);
    console.debug(e);
  }
}

function getBaseState(additionalTitle: string = ''): Partial<State> {
  const title = `${Constant.message.headline.app}${additionalTitle}`;

  return {
    mainTitle: title,
    title: title,
    workingDirectory: [],
    resultSet: {},
  } as Partial<State>;
}

async function launcher(context: ExtensionContext): Promise<void> {
  const state = getBaseState();
  const args = [state, true, context];

  start('MenuGuide', state, args);
}

async function edit(context: ExtensionContext): Promise<void> {
  const state = getBaseState(Constant.message.headline.mode.edit);
  const args = [state, DATA_TYPE.folder, true, context];

  start('EditMenuGuide', state, args);
}

async function history(context: ExtensionContext): Promise<void> {
  const state = getBaseState(Constant.message.headline.mode.history);
  const args = [state, true, context];

  start('HistoryGuide', state, args);
}

export { launcher, edit, history };
