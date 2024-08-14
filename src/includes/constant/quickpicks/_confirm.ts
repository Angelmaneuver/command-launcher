import { l10n } from 'vscode';

const confirm = {
  description: {
    yes: {
      run: l10n.t('Run command.'),
      save: l10n.t('Save.'),
      remove: l10n.t('Delete.'),
      uninstall: l10n.t('Uninstall.'),
    },
    no: l10n.t('Back to previous.'),
  },
};

export { confirm };
