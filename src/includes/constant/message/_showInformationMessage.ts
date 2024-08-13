import { l10n } from 'vscode';

const showInformationMessage = {
  history: {
    disabled: l10n.t('The history function is disabled.'),
    nothing: l10n.t('No history.'),
  },
  error: {
    singleton: (name: string) => l10n.t("'{0}' already executed.", name),
  },
} as const;

export { showInformationMessage };
