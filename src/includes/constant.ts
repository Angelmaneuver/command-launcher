export const DATA_TYPE               = {
	command:         1,
	terminalCommand: 3,
	folder:          2,
} as const;

export type DataType                 = typeof DATA_TYPE[keyof typeof DATA_TYPE];

export const SELECTION_ITEM          = {
	base: 1,
	all:  2,
} as const;

export type SelectionItem            = typeof SELECTION_ITEM[keyof typeof SELECTION_ITEM];

export const LABEL_STRING_MATCH      = /^\$\(.+?\) /;
export const LABEL_STRING_ONLY_MATCH = /^\$\(.+?\)/;
