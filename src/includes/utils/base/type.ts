export type Nullable<T> = T | null | undefined;

export type Command     = {
	type:        number,
	label:       string,
	description: string,
	command:     string,
};

export type Folder      = {
	type:        number,
	label:       string,
	description: string,
};
