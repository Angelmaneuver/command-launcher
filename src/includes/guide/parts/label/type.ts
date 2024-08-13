import { SELECTION_ITEM } from './constant';

type SelectionItem = (typeof SELECTION_ITEM)[keyof typeof SELECTION_ITEM];

export type { SelectionItem };
