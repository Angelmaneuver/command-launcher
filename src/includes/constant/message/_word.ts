import { l10n } from 'vscode';

const word = {
  Root: l10n.t('Root'),
  folder: l10n.t('folder'),
  Folder: l10n.t('Folder'),
  command: l10n.t('command'),
  Command: l10n.t('Command'),
  Terminalcommand: l10n.t('Terminal command'),
  Type: l10n.t('Type'),
  Yes: l10n.t('Yes'),
  No: l10n.t('No'),
  parts: {
    autoRun: {
      yes: l10n.t('Run automaticaly.'),
      no: l10n.t('Does not run automaticaly.'),
    },
    singleton: {
      yes: l10n.t('Run as single process.'),
      no: l10n.t('Does not run as single process.'),
    },
  },
} as const;

export { word };
