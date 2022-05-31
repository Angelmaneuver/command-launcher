import * as sinon            from 'sinon';
import * as vscode           from 'vscode';
import * as testTarget       from '../../../includes/kickstarter';
import { MultiStepInput }    from '../../../includes/utils/multiStepInput';
import { State }             from '../../../includes/guide/base/base';
import { GuideFactory }      from '../../../includes/guide/factory/base';
import { MenuGuide }         from '../../../includes/guide/menu/base';
import { MenuGuideWithEdit } from '../../../includes/guide/menu/edit';

suite('Kick Starter Test Suite', async () => {
	test('Launcher and Edit', async () => {
		const multiStepInputStub = sinon.stub(MultiStepInput,              'run');
		const guideFactoryStub   = sinon.stub(GuideFactory,                'create');
		const menuGuideStub1     = sinon.stub(MenuGuide.prototype,         'start');
		const menuGuideStub2     = sinon.stub(MenuGuideWithEdit.prototype, 'start');
		const windowMock         = sinon.mock(vscode.window);
		const commandStub        = sinon.stub(vscode.commands,             'executeCommand');
		const context            = {} as vscode.ExtensionContext;

		multiStepInputStub.onFirstCall().throws(new Error('Stub Error'));
		windowMock.expects('showWarningMessage').withArgs('Stub Error').once();
		await testTarget.launcher(context);

		guideFactoryStub.onSecondCall().callsFake(
			(className: string, state: State, context: vscode.ExtensionContext) => {
				state.message = 'Stub Info';
				return new MenuGuide(state, true, context);
			}
		);
		windowMock.expects('showInformationMessage').withArgs('Stub Info').once();
		await testTarget.launcher(context);

		guideFactoryStub.onThirdCall().callsFake(
			(className: string, state: State, context: vscode.ExtensionContext) => {
				state.reload = true;
				return new MenuGuide(state, true, context);
			}
		);
		await testTarget.launcher(context);

		guideFactoryStub.onCall(3).callsFake(
			(className: string, state: State, context: vscode.ExtensionContext) => {
				state.command = 'Command';
				return new MenuGuide(state, true, context);
			}
		);
		await testTarget.launcher(context);

		windowMock.verify();
		windowMock.restore();

		commandStub.restore();

		guideFactoryStub.restore();
		multiStepInputStub.restore();

		await testTarget.launcher(context);
		await testTarget.edit(context);

		menuGuideStub1.restore();
		menuGuideStub2.restore();
	});
});
