/* eslint @typescript-eslint/naming-convention: "off" */
import * as assert          from 'assert';
import * as sinon           from 'sinon';
import * as _               from 'lodash';
import * as testTarget      from '../../../includes/guide/menu/edit';
import {
	ExtensionContext,
	QuickPickItem }         from 'vscode';
import { MultiStepInput }   from '../../../includes/utils/multiStepInput';
import { State }            from '../../../includes/guide/base/base';
import { ExtensionSetting } from '../../../includes/settings/extension';
import { VSCodePreset }     from '../../../includes/utils/base/vscodePreset';
import * as Constant        from '../../../includes/constant';

suite('Scenario - Command Regist', async () => {
	const data = {
		"VSNotes": {
			"description": "VSNotes関連のコマンドセットです。",
			"label": "$(notebook-template)",
			"type": 2,
			"セットアップする。": {
				"type": 1,
				"command": "vsnotes.setupNotes",
				"label": "$(settings-gear)",
				"description": "VSNotesのセットアップを起動します。"
			},
			"ノートのタグ一覧を表示する。": {
				"type": 1,
				"command": "vsnotes.listTags",
				"label": "$(tag)",
				"description": "VSNotesでノートのタグ一覧を表示します。"
			},
			"ノートの一覧を表示する。": {
				"type": 1,
				"command": "vsnotes.listNotes",
				"label": "$(list-tree)",
				"description": "VSNotesでノートの一覧を表示します。"
			},
			"作成": {
				"description": "VSNotesのノート作成関連のコマンドセットです。",
				"label": "$(edit)",
				"type": 2,
				"ワークスペースに新しいノートを作成する。": {
					"type": 1,
					"command": "vsnotes.newNoteInWorkspace",
					"label": "$(notebook)",
					"description": "VSNotesでワークスペースに新しいノートを作成します。"
				},
				"新しいノートを作成する。": {
					"type": 1,
					"command": "vsnotes.newNote",
					"label": "$(notebook)",
					"description": "VSNotesで新しいノートを作成します。"
				}
			}
		},
		"履歴": {
			"description": "VSCodeの履歴に関するコマンドセットです。",
			"label": "$(history)",
			"type": 2,
			"コマンド履歴を消去する。": {
				"type": 1,
				"command": "workbench.action.clearCommandHistory",
				"label": "$(trashcan)",
				"description": "VSCodeのコマンド履歴を消去します。"
			},
			"最近使用した項目の履歴を消去する。": {
				"type": 1,
				"command": "workbench.action.clearRecentFiles",
				"label": "$(trashcan)",
				"description": "VSCodeの最近使用した項目の履歴を消去します。"
			}
		},
		"新しいノートを作成する。": {
			"type": 1,
			"command": "vsnotes.newNote",
			"label": "$(notebook)",
			"description": "VSNotesで新しいノートを作成します。"
		},
		"設定": {
			"description": "VSCodeの設定を行うコマンドセットです。",
			"label": "$(settings)",
			"type": 2,
			"テーマ": {
				"type": 1,
				"command": "workbench.action.selectTheme",
				"label": "$(color-mode)",
				"description": "配色テーマを設定します。"
			},
			"ランチャー": {
				"type": 1,
				"command": "command-launcher.edit",
				"label": "$(edit)",
				"description": "Command Launcherを編集モードで起動します。"
			},
			"壁紙": {
				"type": 1,
				"command": "wallpaper-setting.guidance",
				"label": "$(file-media)",
				"description": "Wallpaper Settingを起動します。"
			},
			"表示言語": {
				"type": 1,
				"command": "workbench.action.configureLocale",
				"label": "$(whole-word)",
				"description": "表示言語を設定します。"
			},
			"設定 (JSON) を開く。": {
				"type": 1,
				"command": "workbench.action.openSettingsJson",
				"label": "$(json)",
				"description": "設定 (JSON) を開きます。"
			}
		}
	};

	const result1 = {
		"新しいノートを作成する。": {
			"type": 1,
			"command": "vsnotes.newNote",
			"label": "$(notebook)",
			"description": "VSNotesで新しいノートを作成します。"
		},
	};

	const result2 = {
		"VSNotes": {
			"description": "VSNotes関連のコマンドセットです。",
			"label": "$(notebook-template)",
			"type": 2,
			"作成": {
				"description": "VSNotesのノート作成関連のコマンドセットです。",
				"label": "$(edit)",
				"type": 2,
				"ワークスペースに新しいノートを作成する。": {
					"type": 1,
					"command": "vsnotes.newNoteInWorkspace",
					"label": "$(notebook)",
					"description": "VSNotesでワークスペースに新しいノートを作成します。"
				},
			}
		},
		"新しいノートを作成する。": {
			"type": 1,
			"command": "vsnotes.newNote",
			"label": "$(notebook)",
			"description": "VSNotesで新しいノートを作成します。"
		},
	};

	const result3 = {
		"新しいノートを作成する。": {
			"type": 1,
			"command": "vsnotes.newNote",
			"label": "$(notebook)",
			"description": "VSNotesで新しいノートを作成します。",
			"orderNo": "0"
		},
		"VSNotes": {
			"description": "VSNotes関連のコマンドセットです。",
			"label": "$(notebook-template)",
			"type": 2,
			"作成": {
				"description": "VSNotesのノート作成関連のコマンドセットです。",
				"label": "$(edit)",
				"type": 2,
				"ワークスペースに新しいノートを作成する。": {
					"type": 1,
					"command": "vsnotes.newNoteInWorkspace",
					"label": "$(notebook)",
					"description": "VSNotesでワークスペースに新しいノートを作成します。"
				},
			}
		},
	};

	const stateCreater = () => ({ title: "Test Suite", resultSet: {} } as State);
	const context      = {} as ExtensionContext;
	const items        = {
		add:         VSCodePreset.create(VSCodePreset.icons.add,                 'Add',                                    'Add a command.'),
		create:      VSCodePreset.create(VSCodePreset.icons.fileDirectoryCreate, 'Create',                                 'Create a folder.'),
		delete:      VSCodePreset.create(VSCodePreset.icons.trashcan,            'Delete',                                 'delete this item.'),
		uninstall:   VSCodePreset.create(VSCodePreset.icons.trashcan,            'Uninstall',                              'Remove all parameters for this extension.'),
		launcher:    VSCodePreset.create(VSCodePreset.icons.reply,               'Return Launcher',                        'Activate Launcher mode.'),
		back:        VSCodePreset.create(VSCodePreset.icons.reply,               'Return',                                 'Back to previous.'),
		exit:        VSCodePreset.create(VSCodePreset.icons.signOut,             'Exit',                                   'Exit this extenion.'),
		name:        VSCodePreset.create(VSCodePreset.icons.fileText,            'Name',                                   'Set the item name.'),
		label:       VSCodePreset.create(VSCodePreset.icons.tag,                 'Label',                                  'Set the item label.'),
		description: VSCodePreset.create(VSCodePreset.icons.note,                'Description',                            'Set the command description.'),
		command:     VSCodePreset.create(VSCodePreset.icons.terminalPowershell,  'Command',                                'Set the execute command.'),
		order:       VSCodePreset.create(VSCodePreset.icons.listOrdered,         'Order',                                  'Set the sort order.'),
		save:        VSCodePreset.create(VSCodePreset.icons.save,                'Save',                                   'Save changes.'),
		return:      VSCodePreset.create(VSCodePreset.icons.reply,               'Return',                                 'Return without saving any changes.'),
		other:       VSCodePreset.create(VSCodePreset.icons.inbox,               'Other icons',                            'Select from other icons.'),
		f:           VSCodePreset.create(VSCodePreset.icons.file,                VSCodePreset.icons.file.name,             ''),
		d:           VSCodePreset.create(VSCodePreset.icons.folder,              VSCodePreset.icons.folder.name,           ''),
		n:           VSCodePreset.create(VSCodePreset.icons.notebook,            VSCodePreset.icons.notebook.name,         ''),
		nt:          VSCodePreset.create(VSCodePreset.icons.notebookTemplate,    VSCodePreset.icons.notebookTemplate.name, ''),
		"新しいノートを作成する。": { label: "$(notebook) 新しいノートを作成する。", description: "VSNotesで新しいノートを作成します。" } as QuickPickItem,
		"VSNotes":              { label: "$(notebook-template) VSNotes",     description: "VSNotes関連のコマンドセットです。" } as QuickPickItem,
		"作成":                  { label: "$(edit) 作成",                     description: "VSNotesのノート作成関連のコマンドセットです。" } as QuickPickItem,
		"設定":                  { label: "$(settings) 設定",                 description: "VSCodeの設定を行うコマンドセットです。" } as QuickPickItem, 
		"設定 (JSON) を開く。":   { label: "$(json) 設定 (JSON) を開く。",       description: "設定 (JSON) を開きます。" } as QuickPickItem,
	};

	test('EditMenu -> Command Regist', async () => {
		const state     = stateCreater();
		const pickStub  = sinon.stub(MultiStepInput.prototype, "showQuickPick");
		const inputStub = sinon.stub(MultiStepInput.prototype, "showInputBox");

		pickStub.onCall(0).resolves(items.add);
		pickStub.onCall(1).resolves(items.other);
		pickStub.onCall(2).resolves(items.n);
		inputStub.onCall(0).resolves('新しいノートを作成する。');
		inputStub.onCall(1).resolves(data['新しいノートを作成する。'].description);
		inputStub.onCall(2).resolves(data['新しいノートを作成する。'].command);
		pickStub.onCall(3).resolves(items.exit);

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.MenuGuideWithEdit(state, Constant.DATA_TYPE.folder, true, context).start(input));

		const settings = new ExtensionSetting();

		assert.deepStrictEqual(result1, settings.commands);

		await settings.uninstall();

		inputStub.restore();
		pickStub.restore();
	}).timeout(30 * 1000);

	test('EditMenu -> Exit', async () => {
		const state    = stateCreater();
		const pickStub = sinon.stub(MultiStepInput.prototype, "showQuickPick");

		pickStub.resolves(items.exit);

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.MenuGuideWithEdit(state, Constant.DATA_TYPE.folder, true, context).start(input));

		assert.strictEqual(undefined, state.command);

		pickStub.restore();
	}).timeout(30 * 1000);

	test('EditMenu -> Edit Commands', async () => {
		const state     = stateCreater();
		const pickStub  = sinon.stub(MultiStepInput.prototype, "showQuickPick");
		const inputStub = sinon.stub(MultiStepInput.prototype, "showInputBox");

		pickStub.onCall(0).resolves(items.create);
		pickStub.onCall(1).resolves(items.f);
		inputStub.onCall(0).resolves('file name');
		inputStub.onCall(1).resolves('file description');

		pickStub.onCall(2).resolves(items.add);
		pickStub.onCall(3).resolves(items.other);
		pickStub.onCall(4).resolves(items.n);
		inputStub.onCall(2).resolves('新しいノートを作成する。');
		inputStub.onCall(3).resolves(data['新しいノートを作成する。'].description);
		inputStub.onCall(4).resolves(data['新しいノートを作成する。'].command);

		pickStub.onCall(5).resolves(items.create);
		pickStub.onCall(6).resolves(items.d);
		inputStub.onCall(5).resolves('folder name');
		inputStub.onCall(6).resolves('folder description');

		pickStub.onCall(7).resolves({ label: `${VSCodePreset.icons.file.label} file name`, description: '' });
		pickStub.onCall(8).resolves(items.name);
		inputStub.onCall(7).resolves('VSNotes');
		pickStub.onCall(9).resolves(items.label);
		pickStub.onCall(10).resolves(items.other);
		pickStub.onCall(11).resolves(items.nt);
		pickStub.onCall(12).resolves(items.description);
		inputStub.onCall(8).resolves(data.VSNotes.description);
		pickStub.onCall(13).resolves(items.save);
		pickStub.onCall(14).resolves({ label: '$(x) No', description: '' });
		pickStub.onCall(15).resolves(items.save);
		pickStub.onCall(16).resolves({ label: '$(check) Yes', description: '' });

		pickStub.onCall(17).resolves({ label: `${data.VSNotes.label} VSNotes`, description: '' });
		pickStub.onCall(18).resolves(items.create);
		pickStub.onCall(19).resolves({ label: `${data.VSNotes.作成.label} Edit`, description: '' });
		inputStub.onCall(9).resolves('作成');
		inputStub.onCall(10).resolves(data.VSNotes.作成.description);

		pickStub.onCall(20).resolves({ label: `${data.VSNotes.作成.label} 作成`, description: '' });
		pickStub.onCall(21).resolves(items.add);
		pickStub.onCall(22).resolves(items.other);
		pickStub.onCall(23).resolves(items.n);
		inputStub.onCall(11).resolves('ワークスペースに新しいノートを作成する。');
		inputStub.onCall(12).resolves('Descripton Text');
		inputStub.onCall(13).resolves('Command Text');

		pickStub.onCall(24).resolves(items.back);
		pickStub.onCall(25).resolves(items.back);

		pickStub.onCall(26).resolves({ label: `${VSCodePreset.icons.folder.label} folder name`, description: '' });
		pickStub.onCall(27).resolves(items.delete);
		pickStub.onCall(28).resolves({ label: '$(check) Yes', description: '' });

		pickStub.onCall(29).resolves({ label: `${data.VSNotes.label} VSNotes`, description: '' });
		pickStub.onCall(30).resolves({ label: `${data.VSNotes.作成.label} 作成`, description: '' });
		pickStub.onCall(31).resolves({ label: `${data.VSNotes.作成['ワークスペースに新しいノートを作成する。'].label} ワークスペースに新しいノートを作成する。`, description: '' });
		pickStub.onCall(32).resolves(items.description);
		inputStub.onCall(14).resolves(data.VSNotes.作成['ワークスペースに新しいノートを作成する。'].description);
		pickStub.onCall(33).resolves(items.command);
		inputStub.onCall(15).resolves(data.VSNotes.作成['ワークスペースに新しいノートを作成する。'].command);
		pickStub.onCall(34).resolves(items.save);
		pickStub.onCall(35).resolves({ label: '$(check) Yes', description: '' });

		pickStub.onCall(36).resolves(items.back);
		pickStub.onCall(37).resolves(items.back);
		pickStub.onCall(38).resolves(items.exit);

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.MenuGuideWithEdit(state, Constant.DATA_TYPE.folder, true, context).start(input));

		let settings = new ExtensionSetting();

		assert.deepStrictEqual(result2, settings.commands);

		inputStub.reset();
		pickStub.reset();

		pickStub.onCall(0).resolves(items['新しいノートを作成する。']);
		pickStub.onCall(1).resolves(items.order);
		inputStub.onCall(0).resolves('0');
		pickStub.onCall(2).resolves(items.save);
		pickStub.onCall(3).resolves({ label: '$(check) Yes', description: '' });
		pickStub.onCall(4).resolves(items.back);
		pickStub.onCall(5).resolves(items.exit);

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.MenuGuideWithEdit(state, Constant.DATA_TYPE.folder, true, context).start(input));

		settings = new ExtensionSetting();

		assert.deepStrictEqual(result3, settings.commands);

		inputStub.reset();
		pickStub.reset();

		pickStub.onCall(0).resolves(items['新しいノートを作成する。']);
		pickStub.onCall(1).resolves(items.order);
		inputStub.onCall(0).resolves('');
		pickStub.onCall(2).resolves(items.save);
		pickStub.onCall(3).resolves({ label: '$(check) Yes', description: '' });
		pickStub.onCall(4).resolves(items.back);
		pickStub.onCall(5).resolves(items.exit);

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.MenuGuideWithEdit(state, Constant.DATA_TYPE.folder, true, context).start(input));

		settings = new ExtensionSetting();

		assert.deepStrictEqual(result2, settings.commands);

		await settings.uninstall();

		inputStub.restore();
		pickStub.restore();
	}).timeout(30 * 1000);

	test('EditMenu -> Launcher', async () => {
		const state    = stateCreater();
		const pickStub = sinon.stub(MultiStepInput.prototype, "showQuickPick");

		pickStub.resolves(items.launcher);

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.MenuGuideWithEdit(state, Constant.DATA_TYPE.folder, true, context).start(input));

		assert.strictEqual('command-launcher.launcher', state.command);

		pickStub.restore();
	}).timeout(30 * 1000);

	test('EditMenu -> Uninstall', async () => {
		const setup    = new ExtensionSetting();
		setup.commands = _.cloneDeep(data);

		await setup.commit();

		const state    = stateCreater();
		const pickStub = sinon.stub(MultiStepInput.prototype, "showQuickPick");

		pickStub.onCall(0).resolves(items.uninstall);
		pickStub.onCall(1).resolves({ label: '$(x) No', description: '' });
		pickStub.onCall(2).resolves(items.uninstall);
		pickStub.onCall(3).resolves({ label: '$(check) Yes', description: '' });

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.MenuGuideWithEdit(state, Constant.DATA_TYPE.folder, true, context).start(input));

		const setttings = new ExtensionSetting();

		assert.deepStrictEqual({}, setttings.commands);

		pickStub.restore();
	}).timeout(30 * 1000);
});
