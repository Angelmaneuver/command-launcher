import { l10n } from 'vscode';

import { common } from './_common';

import VSCodePreset from '@/utils/VSCodePreset';

const edit = {
  abc: {
    delete: VSCodePreset.create(
      VSCodePreset.icons.trashcan,
      l10n.t('Delete'),
      l10n.t('delete this item.')
    ),
    uninstall: VSCodePreset.create(
      VSCodePreset.icons.trashcan,
      l10n.t('Uninstall'),
      l10n.t('Remove all parameters for this extension.')
    ),
    launcher: VSCodePreset.create(
      VSCodePreset.icons.reply,
      l10n.t('Return Launcher'),
      l10n.t('Activate Launcher mode.')
    ),
    save: VSCodePreset.create(
      VSCodePreset.icons.save,
      l10n.t('Save'),
      l10n.t('Save changes.')
    ),
    return: VSCodePreset.create(
      VSCodePreset.icons.reply,
      l10n.t('Return'),
      l10n.t('Return without saving any changes.')
    ),
    confirm: {
      description: {
        save: l10n.t('Save.'),
        remove: l10n.t('Delete.'),
        uninstall: l10n.t('Uninstall.'),
        back: l10n.t('Back to previous.'),
      },
    },
  },
  base: {
    command: VSCodePreset.create(
      VSCodePreset.icons.extensions,
      l10n.t('Command'),
      l10n.t('Add a vscode command.')
    ),
    terminal: VSCodePreset.create(
      VSCodePreset.icons.terminal,
      l10n.t('Terminal Command'),
      l10n.t('Add a terminal command.')
    ),
    folder: VSCodePreset.create(
      VSCodePreset.icons.fileDirectoryCreate,
      l10n.t('Folder'),
      l10n.t('Create folder')
    ),
    setting: VSCodePreset.create(
      VSCodePreset.icons.settingsGear,
      l10n.t('Setting'),
      l10n.t('Set the parameters for this extension.')
    ),
    name: VSCodePreset.create(
      VSCodePreset.icons.fileText,
      l10n.t('Name'),
      l10n.t('Set the item name.')
    ),
    label: VSCodePreset.create(
      VSCodePreset.icons.tag,
      l10n.t('Label'),
      l10n.t('Set the item label.')
    ),
    description: VSCodePreset.create(
      VSCodePreset.icons.note,
      l10n.t('Description'),
      l10n.t('Set the command description.')
    ),
    executeCommand: VSCodePreset.create(
      VSCodePreset.icons.terminalPowershell,
      l10n.t('Execute Command'),
      l10n.t('Set the execute command.')
    ),
    order: VSCodePreset.create(
      VSCodePreset.icons.listOrdered,
      l10n.t('Order'),
      l10n.t('Set the sort order.')
    ),
    question: VSCodePreset.create(
      VSCodePreset.icons.question,
      l10n.t('Question'),
      l10n.t('Set the question.')
    ),
    autoRun: VSCodePreset.create(
      VSCodePreset.icons.run,
      l10n.t('Auto Run'),
      l10n.t('Set the run automaticaly or not.')
    ),
    singleton: VSCodePreset.create(
      VSCodePreset.icons.emptyWindow,
      l10n.t('Singleton'),
      l10n.t('Set the terminal command be run as single or not.')
    ),
    separator: {
      registerd: common.separator.generator(l10n.t('Registered commands')),
    },
  },
  setting: {
    enableHistory: VSCodePreset.create(
      VSCodePreset.icons.check,
      l10n.t('History'),
      l10n.t('Keep a history of terminal commands executed.')
    ),
    keepHistoryNumber: VSCodePreset.create(
      VSCodePreset.icons.listOrdered,
      l10n.t('Keep Number'),
      l10n.t('Maximum number of terminal command history.')
    ),
  },
  question: {
    input: VSCodePreset.create(
      VSCodePreset.icons.keyboard,
      l10n.t('Question with input'),
      l10n.t('Add a question with text input.')
    ),
    selection: VSCodePreset.create(
      VSCodePreset.icons.selection,
      l10n.t('Question with selection list'),
      l10n.t('Add a question with selection list.')
    ),
    name: VSCodePreset.create(
      VSCodePreset.icons.symbolVariable,
      l10n.t('Variable Name'),
      l10n.t('Set the variable name.')
    ),
    description: VSCodePreset.create(
      VSCodePreset.icons.question,
      l10n.t('Description'),
      l10n.t('Set the question text.')
    ),
    default: VSCodePreset.create(
      VSCodePreset.icons.symbolValue,
      l10n.t('Default'),
      l10n.t('Set the default value.')
    ),
    order: VSCodePreset.create(
      VSCodePreset.icons.listOrdered,
      l10n.t('Order'),
      l10n.t('Set the sort order.')
    ),
    item: {
      name: VSCodePreset.create(
        VSCodePreset.icons.symbolVariable,
        l10n.t('Item Name'),
        l10n.t('Set the item name.')
      ),
      parameter: VSCodePreset.create(
        VSCodePreset.icons.symbolParameter,
        l10n.t('Parameter'),
        l10n.t('Set the parameter.')
      ),
    },
    separator: {
      registerd: {
        questions: common.separator.generator(l10n.t('Registered questions')),
        items: common.separator.generator(l10n.t('Registered selection item')),
      },
    },
  },
};

export { edit };
