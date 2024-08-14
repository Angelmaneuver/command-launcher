import { common } from './_common';
import { confirm } from './_confirm';
import { edit } from './_edit';
import { parts } from './_parts';

const quickpick = {
  common,
  edit,
  confirm,
  parts,
} as const;

export { quickpick };
