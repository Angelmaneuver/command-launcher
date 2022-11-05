export type Nullable<T> = T | null | undefined;

type BaseCommandType = {
	name:        string,
	type:        number,
	label:       string,
	description: string,
	orderNo?:    string,
};

export type Command         = BaseCommandType & {
	command:     string,
};

export type TerminalCommand = Command & {
	autoRun?:    boolean,
	singleton?:  boolean,
	questions?:  Record<string, Question>,
};

export const QUESTION_TYPE  = {
	text:      1,
	selection: 2,
} as const;

type QuestionType           = typeof QUESTION_TYPE[keyof typeof QUESTION_TYPE];

export type SelectionItem   = {
	parameter:   string,
	orderNo?:    string,
};

export type Question        = {
	type:        QuestionType,
	description: string,
	selection:   Record<string, SelectionItem>,
	default?:    string,
	orderNo?:    string,
};

export type Folder          = BaseCommandType;
