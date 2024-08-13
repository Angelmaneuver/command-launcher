import { l10n } from 'vscode';

import VSCodePreset from '@/utils/VSCodePreset';

const parts = {
  location: {
    global: VSCodePreset.create(
      VSCodePreset.icons.globe,
      l10n.t('Common'),
      l10n.t('Use in all profiles.')
    ),
    user: VSCodePreset.create(
      VSCodePreset.icons.home,
      l10n.t('User'),
      l10n.t('Only use in current profile.')
    ),
  },
  label: {
    other: VSCodePreset.create(
      VSCodePreset.icons.inbox,
      l10n.t('Other icons'),
      l10n.t('Select from other icons.')
    ),
    edit: VSCodePreset.create(
      VSCodePreset.icons.edit,
      VSCodePreset.icons.edit.name
    ),
    diff: VSCodePreset.create(
      VSCodePreset.icons.diff,
      VSCodePreset.icons.diff.name
    ),
    file: VSCodePreset.create(
      VSCodePreset.icons.file,
      VSCodePreset.icons.file.name
    ),
    folder: VSCodePreset.create(VSCodePreset.icons.folder, l10n.t('Folder')),
    repo: VSCodePreset.create(
      VSCodePreset.icons.repo,
      VSCodePreset.icons.repo.name
    ),
    tag: VSCodePreset.create(
      VSCodePreset.icons.tag,
      VSCodePreset.icons.tag.name
    ),
    console: VSCodePreset.create(
      VSCodePreset.icons.console,
      VSCodePreset.icons.console.name
    ),
    run: VSCodePreset.create(
      VSCodePreset.icons.run,
      VSCodePreset.icons.run.name
    ),
    save: VSCodePreset.create(
      VSCodePreset.icons.save,
      VSCodePreset.icons.save.name
    ),
    settings: VSCodePreset.create(
      VSCodePreset.icons.settings,
      VSCodePreset.icons.settings.name
    ),
    settingsGear: VSCodePreset.create(
      VSCodePreset.icons.settingsGear,
      VSCodePreset.icons.settingsGear.name
    ),
  },
  question: {
    direct: VSCodePreset.create(
      VSCodePreset.icons.edit,
      l10n.t('Input'),
      l10n.t('Directly enter a value')
    ),
  },
  last: {
    question: {
      selection: {
        yes: VSCodePreset.create(
          VSCodePreset.icons.check,
          l10n.t('Yes'),
          l10n.t('Continue to register.')
        ),
        no: VSCodePreset.create(
          VSCodePreset.icons.x,
          l10n.t('No'),
          l10n.t('Stop registering a selection items and register a question.')
        ),
      },
    },
  },
  history: {
    enable: {
      yes: VSCodePreset.create(
        VSCodePreset.icons.check,
        l10n.t('Yes'),
        l10n.t('Enable the history function.')
      ),
      no: VSCodePreset.create(
        VSCodePreset.icons.x,
        l10n.t('No'),
        l10n.t('Disable the history function.')
      ),
    },
  },
};

export { parts };
