import { LOCATION, LOOKUP_MODE, DATA_TYPE, QUESTION_TYPE } from './_constant';

type EntryPoint = {
  from: Location;
  name: string;
  type: DataType;
  label: string;
  description: string;
  orderNo?: string;
};

type EntryPointRequiredOrderNo = Omit<EntryPoint, 'orderNo'> & SortItem;

type BaseCommandType = {
  name: string;
  type: DataType;
  label: string;
  description: string;
  orderNo?: string;
};

type Folder = BaseCommandType;

type Command = BaseCommandType & {
  command: string;
};

type TerminalCommand = Command & {
  confirm?: boolean;
  autoRun?: boolean;
  singleton?: boolean;
  questions?: Record<string, Question>;
};

type SelectionItem = {
  parameter: string;
  orderNo?: string;
};

type Question = {
  type: QuestionType;
  description: string;
  selection: Record<string, SelectionItem>;
  default?: string;
  orderNo?: string;
};

type Commands<T = unknown> = Record<string, T>;

type History = {
  type: number;
  name: string;
  command: string;
  autoRun: boolean;
  singleton?: boolean;
};

type Location = (typeof LOCATION)[keyof typeof LOCATION];

type LookupMode = (typeof LOOKUP_MODE)[keyof typeof LOOKUP_MODE];

type DataType = (typeof DATA_TYPE)[keyof typeof DATA_TYPE];

type QuestionType = (typeof QUESTION_TYPE)[keyof typeof QUESTION_TYPE];

type SortItem = { orderNo: string };

type SortRecord = Record<string, SortItem>;

export type {
  EntryPoint,
  EntryPointRequiredOrderNo,
  BaseCommandType,
  Folder,
  Command,
  TerminalCommand,
  SelectionItem,
  Question,
  Commands,
  History,
  Location,
  LookupMode,
  DataType,
  QuestionType,
  SortItem,
  SortRecord,
};
