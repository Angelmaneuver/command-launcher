/* eslint @typescript-eslint/naming-convention: "off" */
import * as assert          from 'assert';
import * as sinon           from 'sinon';
import * as testTarget      from '../../../includes/guide/menu/base';
import {
	ExtensionContext,
	QuickPickItem }         from 'vscode';
import { MultiStepInput }   from '../../../includes/utils/multiStepInput';
import { State }            from '../../../includes/guide/base/base';
import { ExtensionSetting } from '../../../includes/settings/extension';
import { VSCodePreset }     from '../../../includes/utils/base/vscodePreset';
import { direct }           from '../../../includes/guide/question';

suite('Scenario - Command Execute', async () => {
	const data = {
		"Python": {
			"description": "Python 関連のコマンドセットです。",
			"label": "$(tools)",
			"pip1": {
				"command": "pip $command $option",
				"description": "pip コマンドを実行します。",
				"label": "$(terminal)",
				"questions": {
					"$command": {
						"default": "install",
						"description": "Command.",
						"type": 2,
						"selection": {
							"install": {
								"parameter": "install"
							},
							"show": {
								"parameter": "show"
							}
						}
					},
					"$option": {
						"default": "pip",
						"description": "Command options.",
						"type": 1
					},
				},
				"type": 3
			},
			"pip2": {
				"command": "pip $command $option",
				"description": "pip コマンドを実行します。",
				"label": "$(terminal)",
				"questions": {
					"$option": {
						"default": "pip",
						"description": "Command options.",
						"type": 1
					},
					"$command": {
						"default": "install",
						"description": "Command.",
						"type": 2,
						"selection": {
							"install": {
								"parameter": "install"
							},
							"show": {
								"parameter": "show"
							}
						}
					}
				},
				"type": 3
			},
			"type": 2
		},
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
		"WordPress開発環境を起動する。": {
			"command": "wp-env start",
			"type": 3,
			"label": "$(run)",
			"description": "wp-env start を実行します。"
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

	const stateCreater = () => ({ title: "Test Suite", resultSet: {} } as State);
	const context      = {} as ExtensionContext;
	const items        = {
		back: VSCodePreset.create(VSCodePreset.icons.reply,   'Return', 'Back to previous.'),
		exit: VSCodePreset.create(VSCodePreset.icons.signOut, 'Exit',   'Exit this extenion.'),
		"新しいノートを作成する。":       { label: "$(notebook) 新しいノートを作成する。", description: "VSNotesで新しいノートを作成します。" } as QuickPickItem,
		"VSNotes":                    { label: "$(notebook-template) VSNotes",     description: "VSNotes関連のコマンドセットです。" } as QuickPickItem,
		"WordPress開発環境を起動する。": { label: "$(run) WordPress開発環境を起動する。", description: "wp-env start を実行します。" } as QuickPickItem,
		"作成":                        { label: "$(edit) 作成",                     description: "VSNotesのノート作成関連のコマンドセットです。" } as QuickPickItem,
		"設定":                        { label: "$(settings) 設定",                 description: "VSCodeの設定を行うコマンドセットです。" } as QuickPickItem, 
		"設定 (JSON) を開く。":         { label: "$(json) 設定 (JSON) を開く。",       description: "設定 (JSON) を開きます。" } as QuickPickItem,
	};

	test('Menu -> Common Command', async () => {
		const setup          = new ExtensionSetting();
		setup.commonCommands = data;
		await setup.commit(setup.location.user);

		let   state          = stateCreater();
		const pickStub       = sinon.stub(MultiStepInput.prototype, "showQuickPick");

		pickStub.resolves(items['新しいノートを作成する。']);

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.MenuGuide(state, context).start(input));

		assert.strictEqual(data['新しいノートを作成する。']['command'], state.command);

		pickStub.reset();

		state                = stateCreater();

		pickStub.resolves(items['WordPress開発環境を起動する。']);

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.MenuGuide(state, context).start(input));

		assert.strictEqual(data['WordPress開発環境を起動する。'].command, state.terminalCommand);

		pickStub.restore();

		await setup.uninstall();
	}).timeout(30 * 1000);

	test('Menu -> Command', async () => {
		const setup    = new ExtensionSetting();
		setup.commands = data;
		await setup.commit(setup.location.profile);

		let   state    = stateCreater();
		const pickStub = sinon.stub(MultiStepInput.prototype, "showQuickPick");

		pickStub.resolves(items['新しいノートを作成する。']);

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.MenuGuide(state, context).start(input));

		assert.strictEqual(data['新しいノートを作成する。']['command'], state.command);

		pickStub.reset();

		state          = stateCreater();

		pickStub.resolves(items['WordPress開発環境を起動する。']);

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.MenuGuide(state, context).start(input));

		assert.strictEqual(data['WordPress開発環境を起動する。'].command, state.terminalCommand);

		pickStub.restore();

		await setup.uninstall();
	}).timeout(30 * 1000);

	test('Menu -> Exit', async () => {
		const state    = stateCreater();
		const pickStub = sinon.stub(MultiStepInput.prototype, "showQuickPick");

		pickStub.resolves(items.exit);

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.MenuGuide(state, context).start(input));

		assert.strictEqual(undefined, state.command);

		pickStub.restore();
	}).timeout(30 * 1000);

	test('Menu -> Common Folder -> Command', async () => {
		const setup          = new ExtensionSetting();
		setup.commonCommands = data;
		await setup.commit(setup.location.user);

		const state          = stateCreater();
		const pickStub       = sinon.stub(MultiStepInput.prototype, "showQuickPick");

		pickStub.onCall(0).resolves(items.VSNotes);
		pickStub.onCall(1).resolves(items.作成);
		pickStub.onCall(2).resolves(items.back);
		pickStub.onCall(3).resolves(items.back);
		pickStub.onCall(4).resolves(items.設定);
		pickStub.onCall(5).resolves(items['設定 (JSON) を開く。']);

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.MenuGuide(state, context).start(input));

		assert.strictEqual(data.設定['設定 (JSON) を開く。'].command, state.command);

		pickStub.restore();

		await setup.uninstall();
	}).timeout(30 * 1000);

	test('Menu -> Folder -> Command', async () => {
		const setup    = new ExtensionSetting();
		setup.commands = data;
		await setup.commit(setup.location.profile);

		const state    = stateCreater();
		const pickStub = sinon.stub(MultiStepInput.prototype, "showQuickPick");

		pickStub.onCall(0).resolves(items.VSNotes);
		pickStub.onCall(1).resolves(items.作成);
		pickStub.onCall(2).resolves(items.back);
		pickStub.onCall(3).resolves(items.back);
		pickStub.onCall(4).resolves(items.設定);
		pickStub.onCall(5).resolves(items['設定 (JSON) を開く。']);

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.MenuGuide(state, context).start(input));

		assert.strictEqual(data.設定['設定 (JSON) を開く。'].command, state.command);

		pickStub.restore();

		await setup.uninstall();
	}).timeout(30 * 1000);

	test('Menu -> Common Folder -> TerminalCommand', async () => {
		const setup          = new ExtensionSetting();
		setup.commonCommands = data;
		await setup.commit(setup.location.user);

		let   state          = stateCreater();
		const pickStub       = sinon.stub(MultiStepInput.prototype, "showQuickPick");
		const inputStub      = sinon.stub(MultiStepInput.prototype, "showInputBox");

		pickStub.onCall(0).resolves({ label: `${data.Python.label} Python`, description: data.Python.description });
		pickStub.onCall(1).resolves({ label: `${data.Python.pip1.label} pip1`, description: data.Python.pip1.description });
		pickStub.onCall(2).resolves({ label: `${VSCodePreset.icons.note.label} install`, description: `${data.Python.pip1.questions.$command.selection.install.parameter}`});
		inputStub.onCall(0).resolves('');

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.MenuGuide(state, context).start(input));

		assert.strictEqual('pip install pip', state.terminalCommand);

		pickStub.reset();
		inputStub.reset();

		state = stateCreater();

		pickStub.onCall(0).resolves({ label: `${data.Python.label} Python`, description: data.Python.description });
		pickStub.onCall(1).resolves({ label: `${data.Python.pip1.label} pip1`, description: data.Python.pip1.description });
		pickStub.onCall(2).resolves({ label: `${VSCodePreset.icons.note.label} show`, description: `${data.Python.pip1.questions.$command.selection.show.parameter}`});
		inputStub.onCall(0).resolves('module');

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.MenuGuide(state, context).start(input));

		assert.strictEqual('pip show module', state.terminalCommand);

		pickStub.reset();
		inputStub.reset();

		state = stateCreater();

		pickStub.onCall(0).resolves({ label: `${data.Python.label} Python`, description: data.Python.description });
		pickStub.onCall(1).resolves({ label: `${data.Python.pip2.label} pip2`, description: data.Python.pip2.description });
		inputStub.onCall(0).resolves('');
		pickStub.onCall(2).resolves({ label: `${VSCodePreset.icons.note.label} install`, description: `${data.Python.pip2.questions.$command.selection.install.parameter}`});

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.MenuGuide(state, context).start(input));

		assert.strictEqual('pip install pip', state.terminalCommand);

		pickStub.reset();
		inputStub.reset();

		state = stateCreater();

		pickStub.onCall(0).resolves({ label: `${data.Python.label} Python`, description: data.Python.description });
		pickStub.onCall(1).resolves({ label: `${data.Python.pip2.label} pip2`, description: data.Python.pip2.description });
		inputStub.onCall(0).resolves('module');
		pickStub.onCall(2).resolves(direct);
		inputStub.onCall(1).resolves('command');

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.MenuGuide(state, context).start(input));

		assert.strictEqual('pip command module', state.terminalCommand);

		inputStub.restore();
		pickStub.restore();

		await setup.uninstall();
	}).timeout(30 * 1000);

	test('Menu -> Folder -> TerminalCommand', async () => {
		const setup    = new ExtensionSetting();
		setup.commands = data;
		await setup.commit(setup.location.profile);

		let   state     = stateCreater();
		const pickStub  = sinon.stub(MultiStepInput.prototype, "showQuickPick");
		const inputStub = sinon.stub(MultiStepInput.prototype, "showInputBox");

		pickStub.onCall(0).resolves({ label: `${data.Python.label} Python`, description: data.Python.description });
		pickStub.onCall(1).resolves({ label: `${data.Python.pip1.label} pip1`, description: data.Python.pip1.description });
		pickStub.onCall(2).resolves({ label: `${VSCodePreset.icons.note.label} install`, description: `${data.Python.pip1.questions.$command.selection.install.parameter}`});
		inputStub.onCall(0).resolves('');

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.MenuGuide(state, context).start(input));

		assert.strictEqual('pip install pip', state.terminalCommand);

		pickStub.reset();
		inputStub.reset();

		state = stateCreater();

		pickStub.onCall(0).resolves({ label: `${data.Python.label} Python`, description: data.Python.description });
		pickStub.onCall(1).resolves({ label: `${data.Python.pip1.label} pip1`, description: data.Python.pip1.description });
		pickStub.onCall(2).resolves({ label: `${VSCodePreset.icons.note.label} show`, description: `${data.Python.pip1.questions.$command.selection.show.parameter}`});
		inputStub.onCall(0).resolves('module');

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.MenuGuide(state, context).start(input));

		assert.strictEqual('pip show module', state.terminalCommand);

		pickStub.reset();
		inputStub.reset();

		state = stateCreater();

		pickStub.onCall(0).resolves({ label: `${data.Python.label} Python`, description: data.Python.description });
		pickStub.onCall(1).resolves({ label: `${data.Python.pip2.label} pip2`, description: data.Python.pip2.description });
		inputStub.onCall(0).resolves('');
		pickStub.onCall(2).resolves({ label: `${VSCodePreset.icons.note.label} install`, description: `${data.Python.pip2.questions.$command.selection.install.parameter}`});

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.MenuGuide(state, context).start(input));

		assert.strictEqual('pip install pip', state.terminalCommand);

		pickStub.reset();
		inputStub.reset();

		state = stateCreater();

		pickStub.onCall(0).resolves({ label: `${data.Python.label} Python`, description: data.Python.description });
		pickStub.onCall(1).resolves({ label: `${data.Python.pip2.label} pip2`, description: data.Python.pip2.description });
		inputStub.onCall(0).resolves('module');
		pickStub.onCall(2).resolves(direct);
		inputStub.onCall(1).resolves('command');

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.MenuGuide(state, context).start(input));

		assert.strictEqual('pip command module', state.terminalCommand);

		inputStub.restore();
		pickStub.restore();

		await setup.uninstall();
	}).timeout(30 * 1000);

	test('History -> TerminalCommand', async () => {
		const setup    = new ExtensionSetting();
		let   state    = stateCreater();
		const pickStub = sinon.stub(MultiStepInput.prototype, "showQuickPick");

		pickStub.onCall(0).resolves(items.exit);

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.HistoryGuide(state, context).start(input));

		assert.strictEqual('The history function is disabled.', state.message);

		pickStub.reset();

		await setup.updateEnableHistory(true);

		pickStub.onCall(0).resolves(items.exit);

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.HistoryGuide(state, context).start(input));

		assert.strictEqual('No history.', state.message);

		pickStub.reset();

		await setup.updateHistory({ type: 1, name: 'test1', command: 'command1', autoRun: false });
		await setup.updateHistory({ type: 2, name: 'test2', command: 'command2', autoRun: true });

		pickStub.onCall(0).resolves({ label: `$(terminal)`, description: `command1` });

		await MultiStepInput.run((input: MultiStepInput) => new testTarget.HistoryGuide(state, context).start(input));

		assert.strictEqual('test1',    state.name);
		assert.strictEqual('command1', state.terminalCommand);
		assert.strictEqual(false,      state.autoRun);

		pickStub.restore();

		await setup.uninstall();
	}).timeout(30 * 1000);
});
