export const DATA_TYPE = {
	command: 1,
	folder:  2,
} as const;

export type DataType = typeof DATA_TYPE[keyof typeof DATA_TYPE];
