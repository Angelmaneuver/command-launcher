import { common } from './_common';
import { edit } from './_edit';
import { parts } from './_parts';

const quickpick = {
  common,
  edit,
  parts,
} as const;

export { quickpick };
