import { QuickPickItem } from 'vscode';

import a2e from './label/a2e';
import f2j from './label/f2j';
import k2o from './label/k2o';
import p2t from './label/p2t';
import u2z from './label/u2z';

class VSCodePreset {
  // @see https://code.visualstudio.com/api/references/icons-in-labels
  public static icons = {
    ...a2e,
    ...f2j,
    ...k2o,
    ...p2t,
    ...u2z,
  } as const;

  public static get getAllIcons(): Array<QuickPickItem> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return Object.entries(VSCodePreset.icons).map(([_, value]) => ({
      label: `${value.label} ${value.name}`,
      description: '',
    }));
  }

  public static create(
    baseIcon: QuickPickItem,
    additionalLabel?: string,
    description?: string
  ): QuickPickItem {
    return {
      label: baseIcon.label + (additionalLabel ? ' ' + additionalLabel : ''),
      description:
        'string' === typeof description ? description : baseIcon.description,
    };
  }
}

export { VSCodePreset };
