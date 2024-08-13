import { l10n, QuickPickItem, QuickPickItemKind } from 'vscode';

import { word } from '../message/_word';

import VSCodePreset from '@/utils/VSCodePreset';

const generator = (label: string) => {
  return {
    label: label,
    kind: QuickPickItemKind.Separator,
  } as QuickPickItem;
};

const typeLabel = (type: string, option: string) =>
  generator(`${word.Type} : ${type} ${option}`.trim());

const common = {
  return: VSCodePreset.create(
    VSCodePreset.icons.reply,
    l10n.t('Return'),
    l10n.t('Back to previous.')
  ),
  exit: VSCodePreset.create(
    VSCodePreset.icons.signOut,
    l10n.t('Exit'),
    l10n.t('Exit this extenion.')
  ),
  separator: {
    generator,
    command: {
      generator: (option: string = '') => typeLabel(word.Command, option),
    },
    terminalCommand: {
      generator: (option: string = '') =>
        typeLabel(word.Terminalcommand, option),
    },
    folder: {
      generator: (option: string = '') => typeLabel(word.Folder, option),
      root: generator(`${word.Type} : ${word.Root} ${word.folder}`),
    },
  },
};

export { common };
