import * as assert from 'assert';

import * as _ from 'lodash';
import * as sinon from 'sinon';
import { ExtensionContext, QuickPickItem } from 'vscode';

import * as Constant from '@/constant';
import MultiStepInput from '@/guide/abc/multiStepInput';
import { State } from '@/guide/base/type';
import EditMenuGuide from '@/guide/menu/base/EditMenuGuide';
import ExtensionSetting, { DATA_TYPE } from '@/settings/extension';
import VSCodePreset from '@/utils/VSCodePreset';

suite('Scenario - Command Regist', async () => {
  const data = {
    Python: {
      type: 2,
      label: '$(tools)',
      description: 'Python 関連のコマンドセットです。',
      'ライブラリをアップデートする。': {
        command: 'pipenv update',
        type: 3,
        label: '$(sync)',
        description: 'ライブラリをアップデートします。',
      },
    },
    VSNotes: {
      description: 'VSNotes関連のコマンドセットです。',
      label: '$(notebook-template)',
      type: 2,
      'セットアップする。': {
        type: 1,
        command: 'vsnotes.setupNotes',
        label: '$(settings-gear)',
        description: 'VSNotesのセットアップを起動します。',
      },
      'ノートのタグ一覧を表示する。': {
        type: 1,
        command: 'vsnotes.listTags',
        label: '$(tag)',
        description: 'VSNotesでノートのタグ一覧を表示します。',
      },
      'ノートの一覧を表示する。': {
        type: 1,
        command: 'vsnotes.listNotes',
        label: '$(list-tree)',
        description: 'VSNotesでノートの一覧を表示します。',
      },
      作成: {
        description: 'VSNotesのノート作成関連のコマンドセットです。',
        label: '$(edit)',
        type: 2,
        'ワークスペースに新しいノートを作成する。': {
          type: 1,
          command: 'vsnotes.newNoteInWorkspace',
          label: '$(notebook)',
          description: 'VSNotesでワークスペースに新しいノートを作成します。',
        },
        '新しいノートを作成する。': {
          type: 1,
          command: 'vsnotes.newNote',
          label: '$(notebook)',
          description: 'VSNotesで新しいノートを作成します。',
        },
      },
    },
    履歴: {
      description: 'VSCodeの履歴に関するコマンドセットです。',
      label: '$(history)',
      type: 2,
      'コマンド履歴を消去する。': {
        type: 1,
        command: 'workbench.action.clearCommandHistory',
        label: '$(trashcan)',
        description: 'VSCodeのコマンド履歴を消去します。',
      },
      '最近使用した項目の履歴を消去する。': {
        type: 1,
        command: 'workbench.action.clearRecentFiles',
        label: '$(trashcan)',
        description: 'VSCodeの最近使用した項目の履歴を消去します。',
      },
    },
    '新しいノートを作成する。': {
      type: 1,
      command: 'vsnotes.newNote',
      label: '$(notebook)',
      description: 'VSNotesで新しいノートを作成します。',
    },
    設定: {
      description: 'VSCodeの設定を行うコマンドセットです。',
      label: '$(settings)',
      type: 2,
      テーマ: {
        type: 1,
        command: 'workbench.action.selectTheme',
        label: '$(color-mode)',
        description: '配色テーマを設定します。',
      },
      ランチャー: {
        type: 1,
        command: 'command-launcher.edit',
        label: '$(edit)',
        description: 'Command Launcherを編集モードで起動します。',
      },
      壁紙: {
        type: 1,
        command: 'wallpaper-setting.guidance',
        label: '$(file-media)',
        description: 'Wallpaper Settingを起動します。',
      },
      表示言語: {
        type: 1,
        command: 'workbench.action.configureLocale',
        label: '$(whole-word)',
        description: '表示言語を設定します。',
      },
      '設定 (JSON) を開く。': {
        type: 1,
        command: 'workbench.action.openSettingsJson',
        label: '$(json)',
        description: '設定 (JSON) を開きます。',
      },
    },
  };

  const result1 = {
    '新しいノートを作成する。': {
      type: 1,
      command: 'vsnotes.newNote',
      label: '$(notebook)',
      description: 'VSNotesで新しいノートを作成します。',
    },
  };

  const result2 = {
    VSNotes: {
      description: 'VSNotes関連のコマンドセットです。',
      label: '$(notebook-template)',
      type: 2,
      作成: {
        description: 'VSNotesのノート作成関連のコマンドセットです。',
        label: '$(edit)',
        type: 2,
        'ワークスペースに新しいノートを作成する。': {
          type: 3,
          command: 'vsnotes.newNoteInWorkspace',
          label: '$(notebook)',
          description: 'VSNotesでワークスペースに新しいノートを作成します。',
        },
      },
    },
    '新しいノートを作成する。': {
      type: 1,
      command: 'vsnotes.newNote',
      label: '$(notebook)',
      description: 'VSNotesで新しいノートを作成します。',
    },
  };

  const result3 = {
    '新しいノートを作成する。': {
      type: 1,
      command: 'vsnotes.newNote',
      label: '$(notebook)',
      description: 'VSNotesで新しいノートを作成します。',
      orderNo: '0',
    },
    VSNotes: {
      description: 'VSNotes関連のコマンドセットです。',
      label: '$(notebook-template)',
      type: 2,
      作成: {
        description: 'VSNotesのノート作成関連のコマンドセットです。',
        label: '$(edit)',
        type: 2,
        'ワークスペースに新しいノートを作成する。': {
          type: 3,
          command: 'vsnotes.newNoteInWorkspace',
          label: '$(notebook)',
          description: 'VSNotesでワークスペースに新しいノートを作成します。',
        },
      },
    },
  };

  const result4 = {
    Python: {
      type: 2,
      label: '$(tools)',
      description: 'Python 関連のコマンドセットです。',
      'ライブラリをアップデートする。': {
        command: 'pipenv update',
        type: 3,
        label: '$(sync)',
        description: 'ライブラリをアップデートします。',
      },
    },
    VSNotes: {
      description: 'VSNotes関連のコマンドセットです。',
      label: '$(notebook-template)',
      type: 2,
      作成: {
        description: 'VSNotesのノート作成関連のコマンドセットです。',
        label: '$(edit)',
        type: 2,
        'ワークスペースに新しいノートを作成する。': {
          type: 3,
          command: 'vsnotes.newNoteInWorkspace',
          label: '$(notebook)',
          description: 'VSNotesでワークスペースに新しいノートを作成します。',
        },
      },
    },
    '新しいノートを作成する。': {
      type: 1,
      command: 'vsnotes.newNote',
      label: '$(notebook)',
      description: 'VSNotesで新しいノートを作成します。',
    },
  };

  const result5 = {
    Python: {
      type: 2,
      label: '$(tools)',
      description: 'Python 関連のコマンドセットです。',
      'ライブラリをアップデートする。': {
        command: 'pipenv update',
        type: 3,
        label: '$(sync)',
        description: 'ライブラリをアップデートします。',
        autoRun: false,
        singleton: true,
      },
    },
    VSNotes: {
      description: 'VSNotes関連のコマンドセットです。',
      label: '$(notebook-template)',
      type: 2,
      作成: {
        description: 'VSNotesのノート作成関連のコマンドセットです。',
        label: '$(edit)',
        type: 2,
        'ワークスペースに新しいノートを作成する。': {
          type: 3,
          command: 'vsnotes.newNoteInWorkspace',
          label: '$(notebook)',
          description: 'VSNotesでワークスペースに新しいノートを作成します。',
        },
      },
    },
    '新しいノートを作成する。': {
      type: 1,
      command: 'vsnotes.newNote',
      label: '$(notebook)',
      description: 'VSNotesで新しいノートを作成します。',
    },
  };

  const result6 = {
    Python: {
      description: 'Python 関連のコマンドセットです。',
      label: '$(tools)',
      pip: {
        command: 'pip $command $option',
        description: 'pip コマンドを実行します。',
        label: '$(terminal)',
        questions: {
          $option: {
            default: '',
            description: 'Command options.',
            orderNo: '0',
            type: 1,
          },
          $command: {
            default: 'install',
            description: 'Command.',
            type: 2,
            selection: {
              show: {
                orderNo: '0',
                parameter: 'show',
              },
              install: {
                parameter: 'install',
              },
            },
          },
        },
        type: 3,
      },
      type: 2,
      'ライブラリをアップデートする。': {
        command: 'pipenv update',
        type: 3,
        label: '$(sync)',
        description: 'ライブラリをアップデートします。',
      },
    },
    VSNotes: {
      description: 'VSNotes関連のコマンドセットです。',
      label: '$(notebook-template)',
      type: 2,
      'セットアップする。': {
        type: 1,
        command: 'vsnotes.setupNotes',
        label: '$(settings-gear)',
        description: 'VSNotesのセットアップを起動します。',
      },
      'ノートのタグ一覧を表示する。': {
        type: 1,
        command: 'vsnotes.listTags',
        label: '$(tag)',
        description: 'VSNotesでノートのタグ一覧を表示します。',
      },
      'ノートの一覧を表示する。': {
        type: 1,
        command: 'vsnotes.listNotes',
        label: '$(list-tree)',
        description: 'VSNotesでノートの一覧を表示します。',
      },
      作成: {
        description: 'VSNotesのノート作成関連のコマンドセットです。',
        label: '$(edit)',
        type: 2,
        'ワークスペースに新しいノートを作成する。': {
          type: 1,
          command: 'vsnotes.newNoteInWorkspace',
          label: '$(notebook)',
          description: 'VSNotesでワークスペースに新しいノートを作成します。',
        },
        '新しいノートを作成する。': {
          type: 1,
          command: 'vsnotes.newNote',
          label: '$(notebook)',
          description: 'VSNotesで新しいノートを作成します。',
        },
      },
    },
    履歴: {
      description: 'VSCodeの履歴に関するコマンドセットです。',
      label: '$(history)',
      type: 2,
      'コマンド履歴を消去する。': {
        type: 1,
        command: 'workbench.action.clearCommandHistory',
        label: '$(trashcan)',
        description: 'VSCodeのコマンド履歴を消去します。',
      },
      '最近使用した項目の履歴を消去する。': {
        type: 1,
        command: 'workbench.action.clearRecentFiles',
        label: '$(trashcan)',
        description: 'VSCodeの最近使用した項目の履歴を消去します。',
      },
    },
    '新しいノートを作成する。': {
      type: 1,
      command: 'vsnotes.newNote',
      label: '$(notebook)',
      description: 'VSNotesで新しいノートを作成します。',
    },
    設定: {
      description: 'VSCodeの設定を行うコマンドセットです。',
      label: '$(settings)',
      type: 2,
      テーマ: {
        type: 1,
        command: 'workbench.action.selectTheme',
        label: '$(color-mode)',
        description: '配色テーマを設定します。',
      },
      ランチャー: {
        type: 1,
        command: 'command-launcher.edit',
        label: '$(edit)',
        description: 'Command Launcherを編集モードで起動します。',
      },
      壁紙: {
        type: 1,
        command: 'wallpaper-setting.guidance',
        label: '$(file-media)',
        description: 'Wallpaper Settingを起動します。',
      },
      表示言語: {
        type: 1,
        command: 'workbench.action.configureLocale',
        label: '$(whole-word)',
        description: '表示言語を設定します。',
      },
      '設定 (JSON) を開く。': {
        type: 1,
        command: 'workbench.action.openSettingsJson',
        label: '$(json)',
        description: '設定 (JSON) を開きます。',
      },
    },
  };

  const stateCreater = () =>
    ({
      title: 'Test Suite',
      mainTitle: 'Test Suite',
      location: 'root',
      resultSet: {},
    } as State);
  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  const context = {} as ExtensionContext;
  const items = {
    add: Constant.quickpick.edit.base.command,
    terminal: Constant.quickpick.edit.base.terminal,
    create: Constant.quickpick.edit.base.folder,
    delete: Constant.quickpick.edit.abc.delete,
    setting: Constant.quickpick.edit.base.setting,
    uninstall: Constant.quickpick.edit.abc.uninstall,
    launcher: Constant.quickpick.edit.abc.launcher,
    back: Constant.quickpick.common.return,
    exit: Constant.quickpick.common.exit,
    globe: Constant.quickpick.parts.location.global,
    user: Constant.quickpick.parts.location.user,
    name: Constant.quickpick.edit.base.name,
    label: Constant.quickpick.edit.base.label,
    description: Constant.quickpick.edit.base.description,
    command: Constant.quickpick.edit.base.executeCommand,
    order: Constant.quickpick.edit.base.order,
    autoRun: Constant.quickpick.edit.base.autoRun,
    singleton: Constant.quickpick.edit.base.singleton,
    save: Constant.quickpick.edit.abc.save,
    other: Constant.quickpick.parts.label.other,
    question: Constant.quickpick.edit.base.question,
    input: Constant.quickpick.edit.question.input,
    selection: Constant.quickpick.edit.question.selection,
    enableHistory: Constant.quickpick.edit.setting.enableHistory,
    keepHistoryNumber: Constant.quickpick.edit.setting.keepHistoryNumber,
    f: VSCodePreset.create(
      VSCodePreset.icons.file,
      VSCodePreset.icons.file.name
    ),
    d: VSCodePreset.create(
      VSCodePreset.icons.folder,
      VSCodePreset.icons.folder.name
    ),
    n: VSCodePreset.create(
      VSCodePreset.icons.notebook,
      VSCodePreset.icons.notebook.name
    ),
    nt: VSCodePreset.create(
      VSCodePreset.icons.notebookTemplate,
      VSCodePreset.icons.notebookTemplate.name
    ),
    t: VSCodePreset.create(
      VSCodePreset.icons.tools,
      VSCodePreset.icons.tools.name
    ),
    s: VSCodePreset.create(
      VSCodePreset.icons.sync,
      VSCodePreset.icons.sync.name
    ),
    terminalIcon: VSCodePreset.create(
      VSCodePreset.icons.terminal,
      VSCodePreset.icons.terminal.name
    ),
    q_name: Constant.quickpick.edit.question.name,
    q_description: Constant.quickpick.edit.question.description,
    q_default: Constant.quickpick.edit.question.default,
    q_order: Constant.quickpick.edit.question.order,
    s_name: Constant.quickpick.edit.question.item.name,
    s_parameter: Constant.quickpick.edit.question.item.parameter,
    s_order: Constant.quickpick.edit.question.order,
    '新しいノートを作成する。': {
      label: '$(notebook) 新しいノートを作成する。',
      description: 'VSNotesで新しいノートを作成します。',
    } as QuickPickItem,
    VSNotes: {
      label: '$(notebook-template) VSNotes',
      description: 'VSNotes関連のコマンドセットです。',
    } as QuickPickItem,
    作成: {
      label: '$(edit) 作成',
      description: 'VSNotesのノート作成関連のコマンドセットです。',
    } as QuickPickItem,
    設定: {
      label: '$(settings) 設定',
      description: 'VSCodeの設定を行うコマンドセットです。',
    } as QuickPickItem,
    '設定 (JSON) を開く。': {
      label: '$(json) 設定 (JSON) を開く。',
      description: '設定 (JSON) を開きます。',
    } as QuickPickItem,
    Python: {
      label: '$(tools) Python',
      description: 'Python 関連のコマンドセットです。',
    } as QuickPickItem,
    'ライブラリをアップデートする。': {
      label: '$(sync) ライブラリをアップデートする。',
      description: 'ライブラリをアップデートします。',
    } as QuickPickItem,
  };

  test('EditMenu -> Common Command Regist', async () => {
    const state = stateCreater();
    const pickStub = sinon.stub(MultiStepInput.prototype, 'showQuickPick');
    const inputStub = sinon.stub(MultiStepInput.prototype, 'showInputBox');

    pickStub.onCall(0).resolves(items.add);
    pickStub.onCall(1).resolves(items.globe);
    pickStub.onCall(2).resolves(items.other);
    pickStub.onCall(3).resolves(items.n);
    inputStub.onCall(0).resolves('新しいノートを作成する。');
    inputStub.onCall(1).resolves(data['新しいノートを作成する。'].description);
    inputStub.onCall(2).resolves(data['新しいノートを作成する。'].command);
    pickStub.onCall(4).resolves(items.exit);

    await MultiStepInput.run((input: MultiStepInput) =>
      new EditMenuGuide(state, DATA_TYPE.folder, context).start(input)
    );

    const settings = new ExtensionSetting();

    assert.deepStrictEqual(result1, settings.commonCommands);

    await settings.uninstall();

    inputStub.restore();
    pickStub.restore();
  }).timeout(30 * 1000);

  test('EditMenu -> Command Regist', async () => {
    const state = stateCreater();
    const pickStub = sinon.stub(MultiStepInput.prototype, 'showQuickPick');
    const inputStub = sinon.stub(MultiStepInput.prototype, 'showInputBox');

    pickStub.onCall(0).resolves(items.add);
    pickStub.onCall(1).resolves(items.user);
    pickStub.onCall(2).resolves(items.other);
    pickStub.onCall(3).resolves(items.n);
    inputStub.onCall(0).resolves('新しいノートを作成する。');
    inputStub.onCall(1).resolves(data['新しいノートを作成する。'].description);
    inputStub.onCall(2).resolves(data['新しいノートを作成する。'].command);
    pickStub.onCall(4).resolves(items.exit);

    await MultiStepInput.run((input: MultiStepInput) =>
      new EditMenuGuide(state, DATA_TYPE.folder, context).start(input)
    );

    const settings = new ExtensionSetting();

    assert.deepStrictEqual(result1, settings.profileCommands);

    await settings.uninstall();

    inputStub.restore();
    pickStub.restore();
  }).timeout(30 * 1000);

  test('EditMenu -> Exit', async () => {
    const state = stateCreater();
    const pickStub = sinon.stub(MultiStepInput.prototype, 'showQuickPick');

    pickStub.resolves(items.exit);

    await MultiStepInput.run((input: MultiStepInput) =>
      new EditMenuGuide(state, DATA_TYPE.folder, context).start(input)
    );

    assert.strictEqual(undefined, state.command);

    pickStub.restore();
  }).timeout(30 * 1000);

  test('EditMenu -> Edit Common Commands', async () => {
    const state = stateCreater();
    const pickStub = sinon.stub(MultiStepInput.prototype, 'showQuickPick');
    const inputStub = sinon.stub(MultiStepInput.prototype, 'showInputBox');

    pickStub.onCall(0).resolves(items.create);
    pickStub.onCall(1).resolves(items.globe);
    pickStub.onCall(2).resolves(items.f);
    inputStub.onCall(0).resolves('file name');
    inputStub.onCall(1).resolves('file description');

    pickStub.onCall(3).resolves(items.add);
    pickStub.onCall(4).resolves(items.globe);
    pickStub.onCall(5).resolves(items.other);
    pickStub.onCall(6).resolves(items.n);
    inputStub.onCall(2).resolves('新しいノートを作成する。');
    inputStub.onCall(3).resolves(data['新しいノートを作成する。'].description);
    inputStub.onCall(4).resolves(data['新しいノートを作成する。'].command);

    pickStub.onCall(7).resolves(items.create);
    pickStub.onCall(8).resolves(items.globe);
    pickStub.onCall(9).resolves(items.d);
    inputStub.onCall(5).resolves('folder name');
    inputStub.onCall(6).resolves('folder description');

    pickStub.onCall(10).resolves({
      label: `${VSCodePreset.icons.file.label} file name`,
      description: '',
    });
    pickStub.onCall(11).resolves(items.name);
    inputStub.onCall(7).resolves('VSNotes');
    pickStub.onCall(12).resolves(items.label);
    pickStub.onCall(13).resolves(items.other);
    pickStub.onCall(14).resolves(items.nt);
    pickStub.onCall(15).resolves(items.description);
    inputStub.onCall(8).resolves(data.VSNotes.description);
    pickStub.onCall(16).resolves(items.save);
    pickStub.onCall(17).resolves({ label: '$(x) No', description: '' });
    pickStub.onCall(18).resolves(items.save);
    pickStub.onCall(19).resolves({ label: '$(check) Yes', description: '' });

    pickStub
      .onCall(20)
      .resolves({ label: `${data.VSNotes.label} VSNotes`, description: '' });
    pickStub.onCall(21).resolves(items.create);
    pickStub
      .onCall(22)
      .resolves({ label: `${data.VSNotes.作成.label} Edit`, description: '' });
    inputStub.onCall(9).resolves('作成');
    inputStub.onCall(10).resolves(data.VSNotes.作成.description);

    pickStub
      .onCall(23)
      .resolves({ label: `${data.VSNotes.作成.label} 作成`, description: '' });
    pickStub.onCall(24).resolves(items.terminal);
    pickStub.onCall(25).resolves(items.other);
    pickStub.onCall(26).resolves(items.n);
    inputStub.onCall(11).resolves('ワークスペースに新しいノートを作成する。');
    inputStub.onCall(12).resolves('Descripton Text');
    inputStub.onCall(13).resolves('Command Text');

    pickStub.onCall(27).resolves(items.back);
    pickStub.onCall(28).resolves(items.back);

    pickStub.onCall(29).resolves({
      label: `${VSCodePreset.icons.folder.label} folder name`,
      description: '',
    });
    pickStub.onCall(30).resolves(items.delete);
    pickStub.onCall(31).resolves({ label: '$(check) Yes', description: '' });

    pickStub
      .onCall(32)
      .resolves({ label: `${data.VSNotes.label} VSNotes`, description: '' });
    pickStub
      .onCall(33)
      .resolves({ label: `${data.VSNotes.作成.label} 作成`, description: '' });
    pickStub.onCall(34).resolves({
      label: `${data.VSNotes.作成['ワークスペースに新しいノートを作成する。'].label} ワークスペースに新しいノートを作成する。`,
      description: '',
    });
    pickStub.onCall(35).resolves(items.description);
    inputStub
      .onCall(14)
      .resolves(
        data.VSNotes.作成['ワークスペースに新しいノートを作成する。']
          .description
      );
    pickStub.onCall(36).resolves(items.command);
    inputStub
      .onCall(15)
      .resolves(
        data.VSNotes.作成['ワークスペースに新しいノートを作成する。'].command
      );
    pickStub.onCall(37).resolves(items.save);
    pickStub.onCall(38).resolves({ label: '$(check) Yes', description: '' });

    pickStub.onCall(39).resolves(items.back);
    pickStub.onCall(40).resolves(items.back);
    pickStub.onCall(41).resolves(items.exit);

    await MultiStepInput.run((input: MultiStepInput) =>
      new EditMenuGuide(state, DATA_TYPE.folder, context).start(input)
    );

    let settings = new ExtensionSetting();

    assert.deepStrictEqual(result2, settings.commonCommands);

    inputStub.reset();
    pickStub.reset();

    pickStub.onCall(0).resolves(items['新しいノートを作成する。']);
    pickStub.onCall(1).resolves(items.order);
    inputStub.onCall(0).resolves('0');
    pickStub.onCall(2).resolves(items.save);
    pickStub.onCall(3).resolves({ label: '$(check) Yes', description: '' });
    pickStub.onCall(4).resolves(items.back);
    pickStub.onCall(5).resolves(items.exit);

    await MultiStepInput.run((input: MultiStepInput) =>
      new EditMenuGuide(state, DATA_TYPE.folder, context).start(input)
    );

    settings = new ExtensionSetting();

    assert.deepStrictEqual(result3, settings.commonCommands);

    inputStub.reset();
    pickStub.reset();

    pickStub.onCall(0).resolves(items['新しいノートを作成する。']);
    pickStub.onCall(1).resolves(items.order);
    inputStub.onCall(0).resolves('');
    pickStub.onCall(2).resolves(items.save);
    pickStub.onCall(3).resolves({ label: '$(check) Yes', description: '' });
    pickStub.onCall(4).resolves(items.back);
    pickStub.onCall(5).resolves(items.exit);

    await MultiStepInput.run((input: MultiStepInput) =>
      new EditMenuGuide(state, DATA_TYPE.folder, context).start(input)
    );

    settings = new ExtensionSetting();

    assert.deepStrictEqual(result2, settings.commonCommands);

    inputStub.reset();
    pickStub.reset();

    pickStub.onCall(0).resolves(items.create);
    pickStub.onCall(1).resolves(items.globe);
    pickStub.onCall(2).resolves(items.other);
    pickStub.onCall(3).resolves(items.t);
    inputStub.onCall(0).resolves('Python');
    inputStub.onCall(1).resolves(data.Python.description);

    pickStub.onCall(4).resolves(items.Python);
    pickStub.onCall(5).resolves(items.terminal);
    pickStub.onCall(6).resolves(items.other);
    pickStub.onCall(7).resolves(items.s);
    inputStub.onCall(2).resolves('ライブラリをアップデートする。');
    inputStub
      .onCall(3)
      .resolves(data.Python['ライブラリをアップデートする。'].description);
    inputStub
      .onCall(4)
      .resolves(data.Python['ライブラリをアップデートする。'].command);

    pickStub.onCall(8).resolves(items.back);
    pickStub.onCall(9).resolves(items.exit);

    await MultiStepInput.run((input: MultiStepInput) =>
      new EditMenuGuide(state, DATA_TYPE.folder, context).start(input)
    );

    inputStub.reset();
    pickStub.reset();

    pickStub.onCall(0).resolves(items.Python);
    pickStub.onCall(1).resolves(items['ライブラリをアップデートする。']);
    pickStub.onCall(2).resolves(items.autoRun);
    pickStub.onCall(3).resolves({ label: '$(x) No', description: '' });
    pickStub.onCall(4).resolves(items.singleton);
    pickStub.onCall(5).resolves({ label: '$(check) Yes', description: '' });
    pickStub.onCall(6).resolves(items.save);
    pickStub.onCall(7).resolves({ label: '$(check) Yes', description: '' });
    pickStub.onCall(8).resolves(items.back);
    pickStub.onCall(9).resolves(items.back);
    pickStub.onCall(10).resolves(items.exit);

    await MultiStepInput.run((input: MultiStepInput) =>
      new EditMenuGuide(state, DATA_TYPE.folder, context).start(input)
    );

    settings = new ExtensionSetting();

    assert.deepStrictEqual(result5, settings.commonCommands);

    inputStub.reset();
    pickStub.reset();

    pickStub.onCall(0).resolves(items.Python);
    pickStub.onCall(1).resolves(items['ライブラリをアップデートする。']);
    pickStub.onCall(2).resolves(items.autoRun);
    pickStub.onCall(3).resolves({ label: '$(check) Yes', description: '' });
    pickStub.onCall(4).resolves(items.singleton);
    pickStub.onCall(5).resolves({ label: '$(x) No', description: '' });
    pickStub.onCall(6).resolves(items.save);
    pickStub.onCall(7).resolves({ label: '$(check) Yes', description: '' });
    pickStub.onCall(8).resolves(items.back);
    pickStub.onCall(9).resolves(items.back);
    pickStub.onCall(10).resolves(items.exit);

    await MultiStepInput.run((input: MultiStepInput) =>
      new EditMenuGuide(state, DATA_TYPE.folder, context).start(input)
    );

    settings = new ExtensionSetting();

    assert.deepStrictEqual(result4, settings.commonCommands);

    await settings.uninstall();

    inputStub.restore();
    pickStub.restore();
  }).timeout(30 * 1000);

  test('EditMenu -> Edit Profile Commands', async () => {
    const state = stateCreater();
    const pickStub = sinon.stub(MultiStepInput.prototype, 'showQuickPick');
    const inputStub = sinon.stub(MultiStepInput.prototype, 'showInputBox');

    pickStub.onCall(0).resolves(items.create);
    pickStub.onCall(1).resolves(items.user);
    pickStub.onCall(2).resolves(items.f);
    inputStub.onCall(0).resolves('file name');
    inputStub.onCall(1).resolves('file description');

    pickStub.onCall(3).resolves(items.add);
    pickStub.onCall(4).resolves(items.user);
    pickStub.onCall(5).resolves(items.other);
    pickStub.onCall(6).resolves(items.n);
    inputStub.onCall(2).resolves('新しいノートを作成する。');
    inputStub.onCall(3).resolves(data['新しいノートを作成する。'].description);
    inputStub.onCall(4).resolves(data['新しいノートを作成する。'].command);

    pickStub.onCall(7).resolves(items.create);
    pickStub.onCall(8).resolves(items.user);
    pickStub.onCall(9).resolves(items.d);
    inputStub.onCall(5).resolves('folder name');
    inputStub.onCall(6).resolves('folder description');

    pickStub.onCall(10).resolves({
      label: `${VSCodePreset.icons.file.label} file name`,
      description: '',
    });
    pickStub.onCall(11).resolves(items.name);
    inputStub.onCall(7).resolves('VSNotes');
    pickStub.onCall(12).resolves(items.label);
    pickStub.onCall(13).resolves(items.other);
    pickStub.onCall(14).resolves(items.nt);
    pickStub.onCall(15).resolves(items.description);
    inputStub.onCall(8).resolves(data.VSNotes.description);
    pickStub.onCall(16).resolves(items.save);
    pickStub.onCall(17).resolves({ label: '$(x) No', description: '' });
    pickStub.onCall(18).resolves(items.save);
    pickStub.onCall(19).resolves({ label: '$(check) Yes', description: '' });

    pickStub
      .onCall(20)
      .resolves({ label: `${data.VSNotes.label} VSNotes`, description: '' });
    pickStub.onCall(21).resolves(items.create);
    pickStub
      .onCall(22)
      .resolves({ label: `${data.VSNotes.作成.label} Edit`, description: '' });
    inputStub.onCall(9).resolves('作成');
    inputStub.onCall(10).resolves(data.VSNotes.作成.description);

    pickStub
      .onCall(23)
      .resolves({ label: `${data.VSNotes.作成.label} 作成`, description: '' });
    pickStub.onCall(24).resolves(items.terminal);
    pickStub.onCall(25).resolves(items.other);
    pickStub.onCall(26).resolves(items.n);
    inputStub.onCall(11).resolves('ワークスペースに新しいノートを作成する。');
    inputStub.onCall(12).resolves('Descripton Text');
    inputStub.onCall(13).resolves('Command Text');

    pickStub.onCall(27).resolves(items.back);
    pickStub.onCall(28).resolves(items.back);

    pickStub.onCall(29).resolves({
      label: `${VSCodePreset.icons.folder.label} folder name`,
      description: '',
    });
    pickStub.onCall(30).resolves(items.delete);
    pickStub.onCall(31).resolves({ label: '$(check) Yes', description: '' });

    pickStub
      .onCall(32)
      .resolves({ label: `${data.VSNotes.label} VSNotes`, description: '' });
    pickStub
      .onCall(33)
      .resolves({ label: `${data.VSNotes.作成.label} 作成`, description: '' });
    pickStub.onCall(34).resolves({
      label: `${data.VSNotes.作成['ワークスペースに新しいノートを作成する。'].label} ワークスペースに新しいノートを作成する。`,
      description: '',
    });
    pickStub.onCall(35).resolves(items.description);
    inputStub
      .onCall(14)
      .resolves(
        data.VSNotes.作成['ワークスペースに新しいノートを作成する。']
          .description
      );
    pickStub.onCall(36).resolves(items.command);
    inputStub
      .onCall(15)
      .resolves(
        data.VSNotes.作成['ワークスペースに新しいノートを作成する。'].command
      );
    pickStub.onCall(37).resolves(items.save);
    pickStub.onCall(38).resolves({ label: '$(check) Yes', description: '' });

    pickStub.onCall(39).resolves(items.back);
    pickStub.onCall(40).resolves(items.back);
    pickStub.onCall(41).resolves(items.exit);

    await MultiStepInput.run((input: MultiStepInput) =>
      new EditMenuGuide(state, DATA_TYPE.folder, context).start(input)
    );

    let settings = new ExtensionSetting();

    assert.deepStrictEqual(result2, settings.profileCommands);

    inputStub.reset();
    pickStub.reset();

    pickStub.onCall(0).resolves(items['新しいノートを作成する。']);
    pickStub.onCall(1).resolves(items.order);
    inputStub.onCall(0).resolves('0');
    pickStub.onCall(2).resolves(items.save);
    pickStub.onCall(3).resolves({ label: '$(check) Yes', description: '' });
    pickStub.onCall(4).resolves(items.back);
    pickStub.onCall(5).resolves(items.exit);

    await MultiStepInput.run((input: MultiStepInput) =>
      new EditMenuGuide(state, DATA_TYPE.folder, context).start(input)
    );

    settings = new ExtensionSetting();

    assert.deepStrictEqual(result3, settings.profileCommands);

    inputStub.reset();
    pickStub.reset();

    pickStub.onCall(0).resolves(items['新しいノートを作成する。']);
    pickStub.onCall(1).resolves(items.order);
    inputStub.onCall(0).resolves('');
    pickStub.onCall(2).resolves(items.save);
    pickStub.onCall(3).resolves({ label: '$(check) Yes', description: '' });
    pickStub.onCall(4).resolves(items.back);
    pickStub.onCall(5).resolves(items.exit);

    await MultiStepInput.run((input: MultiStepInput) =>
      new EditMenuGuide(state, DATA_TYPE.folder, context).start(input)
    );

    settings = new ExtensionSetting();

    assert.deepStrictEqual(result2, settings.profileCommands);

    inputStub.reset();
    pickStub.reset();

    pickStub.onCall(0).resolves(items.create);
    pickStub.onCall(1).resolves(items.user);
    pickStub.onCall(2).resolves(items.other);
    pickStub.onCall(3).resolves(items.t);
    inputStub.onCall(0).resolves('Python');
    inputStub.onCall(1).resolves(data.Python.description);

    pickStub.onCall(4).resolves(items.Python);
    pickStub.onCall(5).resolves(items.terminal);
    pickStub.onCall(6).resolves(items.other);
    pickStub.onCall(7).resolves(items.s);
    inputStub.onCall(2).resolves('ライブラリをアップデートする。');
    inputStub
      .onCall(3)
      .resolves(data.Python['ライブラリをアップデートする。'].description);
    inputStub
      .onCall(4)
      .resolves(data.Python['ライブラリをアップデートする。'].command);

    pickStub.onCall(8).resolves(items.back);
    pickStub.onCall(9).resolves(items.exit);

    await MultiStepInput.run((input: MultiStepInput) =>
      new EditMenuGuide(state, DATA_TYPE.folder, context).start(input)
    );

    inputStub.reset();
    pickStub.reset();

    pickStub.onCall(0).resolves(items.Python);
    pickStub.onCall(1).resolves(items['ライブラリをアップデートする。']);
    pickStub.onCall(2).resolves(items.autoRun);
    pickStub.onCall(3).resolves({ label: '$(x) No', description: '' });
    pickStub.onCall(4).resolves(items.singleton);
    pickStub.onCall(5).resolves({ label: '$(check) Yes', description: '' });
    pickStub.onCall(6).resolves(items.save);
    pickStub.onCall(7).resolves({ label: '$(check) Yes', description: '' });
    pickStub.onCall(8).resolves(items.back);
    pickStub.onCall(9).resolves(items.back);
    pickStub.onCall(10).resolves(items.exit);

    await MultiStepInput.run((input: MultiStepInput) =>
      new EditMenuGuide(state, DATA_TYPE.folder, context).start(input)
    );

    settings = new ExtensionSetting();

    assert.deepStrictEqual(result5, settings.profileCommands);

    inputStub.reset();
    pickStub.reset();

    pickStub.onCall(0).resolves(items.Python);
    pickStub.onCall(1).resolves(items['ライブラリをアップデートする。']);
    pickStub.onCall(2).resolves(items.autoRun);
    pickStub.onCall(3).resolves({ label: '$(check) Yes', description: '' });
    pickStub.onCall(4).resolves(items.singleton);
    pickStub.onCall(5).resolves({ label: '$(x) No', description: '' });
    pickStub.onCall(6).resolves(items.save);
    pickStub.onCall(7).resolves({ label: '$(check) Yes', description: '' });
    pickStub.onCall(8).resolves(items.back);
    pickStub.onCall(9).resolves(items.back);
    pickStub.onCall(10).resolves(items.exit);

    await MultiStepInput.run((input: MultiStepInput) =>
      new EditMenuGuide(state, DATA_TYPE.folder, context).start(input)
    );

    settings = new ExtensionSetting();

    assert.deepStrictEqual(result4, settings.profileCommands);

    await settings.uninstall();

    inputStub.restore();
    pickStub.restore();
  }).timeout(30 * 1000);

  test('EditMenu -> Edit Common Commands -> Edit Questions', async () => {
    const state = stateCreater();
    const pickStub = sinon.stub(MultiStepInput.prototype, 'showQuickPick');
    const inputStub = sinon.stub(MultiStepInput.prototype, 'showInputBox');
    const settings = new ExtensionSetting();

    settings.commonCommands = data;
    await settings.commit(settings.location.user);

    pickStub.onCall(0).resolves(items.Python);
    pickStub.onCall(1).resolves(items.terminal);
    pickStub.onCall(2).resolves(items.other);
    pickStub.onCall(3).resolves(items.terminalIcon);
    inputStub.onCall(0).resolves('pip');
    inputStub.onCall(1).resolves(result6.Python.pip.description);
    inputStub.onCall(2).resolves(result6.Python.pip.command);

    pickStub.onCall(4).resolves({
      label: `${result6.Python.pip.label} pip`,
      description: result6.Python.pip.description,
    });
    pickStub.onCall(5).resolves(items.question);
    pickStub.onCall(6).resolves(items.input);
    inputStub.onCall(3).resolves('$option');
    inputStub
      .onCall(4)
      .resolves(result6.Python.pip.questions.$option.description);
    pickStub.onCall(7).resolves({
      label: `${VSCodePreset.icons.symbolVariable.label} $option`,
      description: result6.Python.pip.questions.$option.description,
    });
    pickStub.onCall(8).resolves(items.q_default);
    inputStub.onCall(5).resolves('');
    pickStub.onCall(9).resolves(items.save);
    pickStub.onCall(10).resolves({ label: '$(check) Yes', description: '' });

    pickStub.onCall(11).resolves(items.selection);
    inputStub.onCall(6).resolves('dummy question');
    inputStub.onCall(7).resolves('dummy description.');
    inputStub
      .onCall(8)
      .resolves(
        result6.Python.pip.questions.$command.selection.install.parameter
      );
    inputStub
      .onCall(9)
      .resolves(
        result6.Python.pip.questions.$command.selection.install.parameter
      );
    pickStub
      .onCall(12)
      .resolves(Constant.quickpick.parts.last.question.selection.yes);
    inputStub.onCall(10).resolves('dummy');
    inputStub.onCall(11).resolves('dummy parameter');
    pickStub
      .onCall(13)
      .resolves(Constant.quickpick.parts.last.question.selection.yes);
    inputStub.onCall(12).resolves('a dummy');
    inputStub.onCall(13).resolves('a dummy parameter');
    pickStub
      .onCall(14)
      .resolves(Constant.quickpick.parts.last.question.selection.no);
    pickStub.onCall(15).resolves({
      label: `${VSCodePreset.icons.symbolVariable.label} dummy question`,
      description: 'dummy description.',
    });
    pickStub
      .onCall(16)
      .resolves(
        VSCodePreset.create(
          VSCodePreset.icons.symbolVariable,
          'dummy',
          'dummy parameter'
        )
      );
    pickStub.onCall(17).resolves(items.s_name);
    inputStub
      .onCall(14)
      .resolves(result6.Python.pip.questions.$command.selection.show.parameter);
    pickStub.onCall(18).resolves(items.s_parameter);
    inputStub
      .onCall(15)
      .resolves(result6.Python.pip.questions.$command.selection.show.parameter);
    pickStub.onCall(19).resolves(items.s_order);
    inputStub.onCall(16).resolves('0');
    pickStub.onCall(20).resolves(items.save);
    pickStub.onCall(21).resolves({ label: '$(check) Yes', description: '' });
    pickStub
      .onCall(22)
      .resolves(
        VSCodePreset.create(
          VSCodePreset.icons.note,
          'a dummy',
          'a dummy parameter'
        )
      );
    pickStub.onCall(23).resolves(items.delete);
    pickStub.onCall(24).resolves({ label: '$(check) Yes', description: '' });
    pickStub.onCall(25).resolves(items.q_name);
    inputStub.onCall(17).resolves('$command');
    pickStub.onCall(26).resolves(items.q_description);
    inputStub
      .onCall(18)
      .resolves(result6.Python.pip.questions.$command.description);
    pickStub.onCall(27).resolves(items.q_default);
    pickStub.onCall(28).resolves({
      label: `${VSCodePreset.icons.note.label} install`,
      description:
        result6.Python.pip.questions.$command.selection.install.parameter,
    });
    pickStub.onCall(29).resolves(items.save);
    pickStub.onCall(30).resolves({ label: '$(check) Yes', description: '' });
    pickStub.onCall(31).resolves({
      label: `${VSCodePreset.icons.symbolVariable.label} $command`,
      description: result6.Python.pip.questions.$command.description,
    });
    pickStub.onCall(32).resolves(items.q_default);
    pickStub.onCall(33).resolves({
      label: `${VSCodePreset.icons.note.label} show`,
      description:
        result6.Python.pip.questions.$command.selection.show.parameter,
    });
    pickStub.onCall(34).resolves(items.back);
    pickStub.onCall(35).resolves({
      label: `${VSCodePreset.icons.symbolVariable.label} $option`,
      description: result6.Python.pip.questions.$option.description,
    });
    pickStub.onCall(36).resolves(items.q_order);
    inputStub.onCall(19).resolves('0');
    pickStub.onCall(37).resolves(items.save);
    pickStub.onCall(38).resolves({ label: '$(check) Yes', description: '' });

    pickStub.onCall(39).resolves(items.back);
    pickStub.onCall(40).resolves(items.back);

    pickStub.onCall(41).resolves({
      label: `${result6.Python['ライブラリをアップデートする。'].label} ライブラリをアップデートする。`,
      description: result6.Python['ライブラリをアップデートする。'].description,
    });
    pickStub.onCall(42).resolves(items.question);
    pickStub.onCall(43).resolves(items.input);
    inputStub.onCall(20).resolves('test question');
    inputStub.onCall(21).resolves('test description');
    pickStub.onCall(44).resolves({
      label: `${VSCodePreset.icons.symbolVariable.label} test question`,
      description: 'test description',
    });
    pickStub.onCall(45).resolves(items.delete);
    pickStub.onCall(46).resolves({ label: '$(check) Yes', description: '' });

    pickStub.onCall(47).resolves(items.back);

    pickStub.onCall(48).resolves(items.back);
    pickStub.onCall(49).resolves(items.exit);

    await MultiStepInput.run((input: MultiStepInput) =>
      new EditMenuGuide(state, DATA_TYPE.folder, context).start(input)
    );

    assert.strictEqual(
      `${VSCodePreset.icons.note.label} install`,
      pickStub.getCall(33).args[0].activeItem?.label
    );
    assert.deepStrictEqual(result6, new ExtensionSetting().commonCommands);

    await settings.uninstall();

    inputStub.restore();
    pickStub.restore();
  }).timeout(30 * 1000);

  test('EditMenu -> Edit Profile Commands -> Edit Questions', async () => {
    const state = stateCreater();
    const pickStub = sinon.stub(MultiStepInput.prototype, 'showQuickPick');
    const inputStub = sinon.stub(MultiStepInput.prototype, 'showInputBox');
    const settings = new ExtensionSetting();

    settings.profileCommands = data;
    await settings.commit(settings.location.profile);

    pickStub.onCall(0).resolves(items.Python);
    pickStub.onCall(1).resolves(items.terminal);
    pickStub.onCall(2).resolves(items.other);
    pickStub.onCall(3).resolves(items.terminalIcon);
    inputStub.onCall(0).resolves('pip');
    inputStub.onCall(1).resolves(result6.Python.pip.description);
    inputStub.onCall(2).resolves(result6.Python.pip.command);

    pickStub.onCall(4).resolves({
      label: `${result6.Python.pip.label} pip`,
      description: result6.Python.pip.description,
    });
    pickStub.onCall(5).resolves(items.question);
    pickStub.onCall(6).resolves(items.input);
    inputStub.onCall(3).resolves('$option');
    inputStub
      .onCall(4)
      .resolves(result6.Python.pip.questions.$option.description);
    pickStub.onCall(7).resolves({
      label: `${VSCodePreset.icons.symbolVariable.label} $option`,
      description: result6.Python.pip.questions.$option.description,
    });
    pickStub.onCall(8).resolves(items.q_default);
    inputStub.onCall(5).resolves('');
    pickStub.onCall(9).resolves(items.save);
    pickStub.onCall(10).resolves({ label: '$(check) Yes', description: '' });

    pickStub.onCall(11).resolves(items.selection);
    inputStub.onCall(6).resolves('dummy question');
    inputStub.onCall(7).resolves('dummy description.');
    inputStub
      .onCall(8)
      .resolves(
        result6.Python.pip.questions.$command.selection.install.parameter
      );
    inputStub
      .onCall(9)
      .resolves(
        result6.Python.pip.questions.$command.selection.install.parameter
      );
    pickStub
      .onCall(12)
      .resolves(Constant.quickpick.parts.last.question.selection.yes);
    inputStub.onCall(10).resolves('dummy');
    inputStub.onCall(11).resolves('dummy parameter');
    pickStub
      .onCall(13)
      .resolves(Constant.quickpick.parts.last.question.selection.yes);
    inputStub.onCall(12).resolves('a dummy');
    inputStub.onCall(13).resolves('a dummy parameter');
    pickStub
      .onCall(14)
      .resolves(Constant.quickpick.parts.last.question.selection.no);
    pickStub.onCall(15).resolves({
      label: `${VSCodePreset.icons.symbolVariable.label} dummy question`,
      description: 'dummy description.',
    });
    pickStub
      .onCall(16)
      .resolves(
        VSCodePreset.create(
          VSCodePreset.icons.symbolVariable,
          'dummy',
          'dummy parameter'
        )
      );
    pickStub.onCall(17).resolves(items.s_name);
    inputStub
      .onCall(14)
      .resolves(result6.Python.pip.questions.$command.selection.show.parameter);
    pickStub.onCall(18).resolves(items.s_parameter);
    inputStub
      .onCall(15)
      .resolves(result6.Python.pip.questions.$command.selection.show.parameter);
    pickStub.onCall(19).resolves(items.s_order);
    inputStub.onCall(16).resolves('0');
    pickStub.onCall(20).resolves(items.save);
    pickStub.onCall(21).resolves({ label: '$(check) Yes', description: '' });
    pickStub
      .onCall(22)
      .resolves(
        VSCodePreset.create(
          VSCodePreset.icons.note,
          'a dummy',
          'a dummy parameter'
        )
      );
    pickStub.onCall(23).resolves(items.delete);
    pickStub.onCall(24).resolves({ label: '$(check) Yes', description: '' });
    pickStub.onCall(25).resolves(items.q_name);
    inputStub.onCall(17).resolves('$command');
    pickStub.onCall(26).resolves(items.q_description);
    inputStub
      .onCall(18)
      .resolves(result6.Python.pip.questions.$command.description);
    pickStub.onCall(27).resolves(items.q_default);
    pickStub.onCall(28).resolves({
      label: `${VSCodePreset.icons.note.label} install`,
      description:
        result6.Python.pip.questions.$command.selection.install.parameter,
    });
    pickStub.onCall(29).resolves(items.save);
    pickStub.onCall(30).resolves({ label: '$(check) Yes', description: '' });
    pickStub.onCall(31).resolves({
      label: `${VSCodePreset.icons.symbolVariable.label} $command`,
      description: result6.Python.pip.questions.$command.description,
    });
    pickStub.onCall(32).resolves(items.q_default);
    pickStub.onCall(33).resolves({
      label: `${VSCodePreset.icons.note.label} show`,
      description:
        result6.Python.pip.questions.$command.selection.show.parameter,
    });
    pickStub.onCall(34).resolves(items.back);
    pickStub.onCall(35).resolves({
      label: `${VSCodePreset.icons.symbolVariable.label} $option`,
      description: result6.Python.pip.questions.$option.description,
    });
    pickStub.onCall(36).resolves(items.q_order);
    inputStub.onCall(19).resolves('0');
    pickStub.onCall(37).resolves(items.save);
    pickStub.onCall(38).resolves({ label: '$(check) Yes', description: '' });

    pickStub.onCall(39).resolves(items.back);
    pickStub.onCall(40).resolves(items.back);

    pickStub.onCall(41).resolves({
      label: `${result6.Python['ライブラリをアップデートする。'].label} ライブラリをアップデートする。`,
      description: result6.Python['ライブラリをアップデートする。'].description,
    });
    pickStub.onCall(42).resolves(items.question);
    pickStub.onCall(43).resolves(items.input);
    inputStub.onCall(20).resolves('test question');
    inputStub.onCall(21).resolves('test description');
    pickStub.onCall(44).resolves({
      label: `${VSCodePreset.icons.symbolVariable.label} test question`,
      description: 'test description',
    });
    pickStub.onCall(45).resolves(items.delete);
    pickStub.onCall(46).resolves({ label: '$(check) Yes', description: '' });

    pickStub.onCall(47).resolves(items.back);

    pickStub.onCall(48).resolves(items.back);
    pickStub.onCall(49).resolves(items.exit);

    await MultiStepInput.run((input: MultiStepInput) =>
      new EditMenuGuide(state, DATA_TYPE.folder, context).start(input)
    );

    assert.strictEqual(
      `${VSCodePreset.icons.note.label} install`,
      pickStub.getCall(33).args[0].activeItem?.label
    );
    assert.deepStrictEqual(result6, new ExtensionSetting().profileCommands);

    await settings.uninstall();

    inputStub.restore();
    pickStub.restore();
  }).timeout(30 * 1000);

  test('EditMenu -> Launcher', async () => {
    const state = stateCreater();
    const pickStub = sinon.stub(MultiStepInput.prototype, 'showQuickPick');

    pickStub.resolves(items.launcher);

    await MultiStepInput.run((input: MultiStepInput) =>
      new EditMenuGuide(state, DATA_TYPE.folder, context).start(input)
    );

    assert.strictEqual('command-launcher.launcher', state.command);

    pickStub.restore();
  }).timeout(30 * 1000);

  test('EditMenu -> Setting', async () => {
    const state = stateCreater();
    const pickStub = sinon.stub(MultiStepInput.prototype, 'showQuickPick');
    const inputStub = sinon.stub(MultiStepInput.prototype, 'showInputBox');

    pickStub.onCall(0).resolves(items.setting);
    pickStub.onCall(1).resolves(items.enableHistory);
    pickStub.onCall(2).resolves({ label: '$(check) Yes', description: '' });
    pickStub.onCall(3).resolves(items.keepHistoryNumber);
    inputStub.onCall(0).resolves('100');
    pickStub.onCall(4).resolves(items.back);
    pickStub.onCall(5).resolves(items.exit);

    await MultiStepInput.run((input: MultiStepInput) =>
      new EditMenuGuide(state, DATA_TYPE.folder, context).start(input)
    );

    await sleep(1000);

    let setting = new ExtensionSetting();

    assert.strictEqual(true, setting.enableHistory);
    assert.strictEqual(100, setting.keepHistoryNumber);

    inputStub.reset();
    pickStub.reset();

    pickStub.onCall(0).resolves(items.setting);
    pickStub.onCall(1).resolves(items.enableHistory);
    pickStub.onCall(2).resolves({ label: '$(x) No', description: '' });
    pickStub.onCall(3).resolves(items.keepHistoryNumber);
    inputStub.onCall(0).resolves('10');
    pickStub.onCall(4).resolves(items.back);
    pickStub.onCall(5).resolves(items.exit);

    await MultiStepInput.run((input: MultiStepInput) =>
      new EditMenuGuide(state, DATA_TYPE.folder, context).start(input)
    );

    await sleep(1000);

    setting = new ExtensionSetting();

    assert.strictEqual(false, setting.enableHistory);
    assert.strictEqual(10, setting.keepHistoryNumber);

    inputStub.restore();
    pickStub.restore();
  }).timeout(30 * 1000);

  test('EditMenu -> Uninstall', async () => {
    const setup = new ExtensionSetting();
    setup.commonCommands = _.cloneDeep(data);
    setup.profileCommands = _.cloneDeep(data);
    setup.updateEnableHistory(true);
    setup.updateKeepHistoryNumber(100);
    setup.updateHistory({
      type: 3,
      name: 'test',
      command: 'command',
      autoRun: true,
    });

    await setup.commit(setup.location.user);
    await setup.commit(setup.location.profile);

    const state = stateCreater();
    const pickStub = sinon.stub(MultiStepInput.prototype, 'showQuickPick');

    pickStub.onCall(0).resolves(items.uninstall);
    pickStub.onCall(1).resolves({ label: '$(x) No', description: '' });
    pickStub.onCall(2).resolves(items.uninstall);
    pickStub.onCall(3).resolves({ label: '$(check) Yes', description: '' });

    await MultiStepInput.run((input: MultiStepInput) =>
      new EditMenuGuide(state, DATA_TYPE.folder, context).start(input)
    );

    const setttings = new ExtensionSetting();

    assert.deepStrictEqual({}, setttings.commonCommands);
    assert.deepStrictEqual({}, setttings.profileCommands);
    assert.strictEqual(false, setttings.enableHistory);
    assert.strictEqual(10, setttings.keepHistoryNumber);
    assert.deepStrictEqual([], setttings.history);

    pickStub.restore();
  }).timeout(30 * 1000);
});
