import { PROCESS_TYPE } from './_constant';

type ProcessType = (typeof PROCESS_TYPE)[keyof typeof PROCESS_TYPE];

export type { ProcessType };
