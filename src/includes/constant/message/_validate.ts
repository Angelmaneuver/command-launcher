import { l10n } from 'vscode';

const validate = {
  required: l10n.t('Required field.'),
  parts: {
    name: l10n.t('The name you entered is already in use.'),
  },
  history: {
    keep: l10n.t('Enter a number between 0 and 65555.'),
  },
} as const;

export { validate };
