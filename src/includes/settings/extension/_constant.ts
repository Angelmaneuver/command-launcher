const ITEM_ID = {
  name: 'name',
  type: 'type',
  lable: 'label',
  description: 'description',
  command: 'command',
  orderNo: 'orderNo',
  confirm: 'confirm',
  autoRun: 'autoRun',
  singleton: 'singleton',
  questions: 'questions',
  selection: 'selection',
  parameter: 'parameter',
  default: 'default',
  from: 'from',
} as const;

const ITEM_ID_VALUE_LIST = Object.values(ITEM_ID) as ReadonlyArray<string>;

const COMMAND_CONFIGS = {
  commonCommands: 'commonCommands',
  commands: 'commands',
} as const;

const CONFIG_ITEMS = {
  ...COMMAND_CONFIGS,

  enableHistory: 'enableHistory',
  keepHistoryNumber: 'keepHistoryNumber',
  history: 'history',
} as const;

const LOCATION = {
  root: 'root',
  user: 'user',
  profile: 'Profile',
} as const;

const LOOKUP_MODE = {
  read: 'r',
  write: 'w',
} as const;

const DATA_TYPE = {
  command: 1,
  terminalCommand: 3,
  folder: 2,
} as const;

const QUESTION_TYPE = {
  text: 1,
  selection: 2,
} as const;

export {
  ITEM_ID,
  ITEM_ID_VALUE_LIST,
  COMMAND_CONFIGS,
  CONFIG_ITEMS,
  LOCATION,
  LOOKUP_MODE,
  DATA_TYPE,
  QUESTION_TYPE,
};
