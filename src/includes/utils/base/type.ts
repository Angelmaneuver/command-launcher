export type Nullable<T> = T | null | undefined;

type BaseCommandType = {
	name:        string,
	type:        number,
	label:       string,
	description: string,
	orderNo:     string,
};

export type Command         = BaseCommandType & {
	command:     string,
};

export type TerminalCommand = Command & {
	autoRun:     boolean,
};

export type Folder          = BaseCommandType;
