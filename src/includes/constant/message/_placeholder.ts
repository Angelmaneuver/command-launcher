import { l10n } from 'vscode';

const placeholder = {
  menu: {
    select: l10n.t('Select the item you want to do.'),
    confirm: l10n.t('Do you want to run the command.'),
    edit: {
      save: l10n.t('Do you want to reflect the changes?'),
      remove: l10n.t('Do you want to delete this item?'),
      uninstall: l10n.t(
        'Do you want to uninstall the all settings related to this extension?'
      ),
      question: {
        remove: l10n.t('Do you want to delete this question?'),
      },
    },
  },
  edit: {
    command: l10n.t('Please enter the command you want to run.'),
    description: (type: string) =>
      l10n.t('Please enter the description of {0}.', type),
    order: l10n.t('Please enter the number you want to sort order.'),
    question: {
      name: l10n.t('Please enter the name of variable.'),
      description: l10n.t('Please enter the description of question.'),
      default: {
        input: l10n.t('Please enter the default value of variable.'),
        selection: l10n.t('Please select the default item of variable.'),
      },
      order: l10n.t('Please enter the number you want to sort order.'),
      selection: {
        name: l10n.t('Please enter the name of selection item.'),
        parameter: l10n.t(
          'Please enter the command parameter of selection item.'
        ),
        continue: l10n.t(
          'Would you like to continue registering selection item?'
        ),
      },
      item: {
        name: l10n.t('Please enter the name of item.'),
        parameter: l10n.t('Please enter the parameter value of item.'),
      },
    },
  },
  parts: {
    location: l10n.t('Select the scope of use.'),
    label: l10n.t('Select the label you wish to use.'),
    name: (type: string) => l10n.t('Please enter the name of {0}.', type),
    confirm: l10n.t('Do you want to confirm before run this command?'),
    autoRun: l10n.t('Do you want to this command to run automaticaly?'),
    singleton: l10n.t('Do you want to this command to run as single process?'),
    question: {
      input: (sentence: string, value: string) =>
        l10n.t('{0} Default:{1}', sentence, value),
    },
    history: {
      enable: l10n.t('Do you want to enable the history function?'),
      keep: l10n.t(
        'Enter the maximum number of terminal commands you want to keep in the history.'
      ),
    },
  },
} as const;

export { placeholder };
