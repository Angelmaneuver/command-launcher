import { l10n } from 'vscode';

const headline = {
  app: l10n.t('Command Launcher'),
  mode: {
    edit: l10n.t(' - Edit mode'),
    history: l10n.t(' - History'),
  },
  edit: {
    setting: l10n.t(' - Setting'),
    add: {
      command: l10n.t(' - Add Command'),
      terminal: l10n.t(' - Add Terminal Command'),
      folder: l10n.t(' - Add Folder'),
      question: l10n.t(' - Add Question'),
    },
  },
} as const;

export { headline };
