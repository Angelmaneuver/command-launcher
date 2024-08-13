import { State } from '@/guide/base/type';

function assembly(base: string, inputSet: Record<string, string>): string {
  let command = base;
  const keys = Object.keys(inputSet);

  keys.forEach((key) => {
    command = command.replaceAll(key, inputSet[key] ?? '');
  });

  return command;
}

function setCommand(
  state: State,
  base: string,
  inputSet: Record<string, string>,
  autoRun: boolean,
  singleton: boolean
): void {
  state.terminalCommand = assembly(base, inputSet);
  state.autoRun = autoRun;
  state.singleton = singleton;
}

export default setCommand;
