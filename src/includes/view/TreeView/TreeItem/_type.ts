import {
  DataType,
  Folder,
  Command,
  TerminalCommand,
  Location,
  DATA_TYPE,
} from '@/settings/extension';

type Hierarchy = Array<string>;

type Data = Folder | Command | TerminalCommand;

export { DATA_TYPE };

export type {
  DataType,
  Folder,
  Command,
  TerminalCommand,
  Location,
  Hierarchy,
  Data,
};
