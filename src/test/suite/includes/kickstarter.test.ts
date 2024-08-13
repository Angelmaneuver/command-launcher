import * as sinon from 'sinon';
import * as vscode from 'vscode';

import MultiStepInput from '@/guide/abc/multiStepInput';
import { State } from '@/guide/base/type';
import GuideFactory from '@/guide/factory';
import EditMenuGuide from '@/guide/menu/base/EditMenuGuide';
import HistoryGuide from '@/guide/menu/base/HistoryGuide';
import MenuGuide from '@/guide/menu/base/MenuGuide';
import * as testTarget from '@/kickstarter';

suite('Kick Starter Test Suite', async () => {
  test('Launcher, Edit, History', async () => {
    const multiStepInputStub = sinon.stub(MultiStepInput, 'run');
    const guideFactoryStub = sinon.stub(GuideFactory, 'create');
    const menuGuideStub1 = sinon.stub(MenuGuide.prototype, 'start');
    const menuGuideStub2 = sinon.stub(EditMenuGuide.prototype, 'start');
    const historyGuideStub = sinon.stub(HistoryGuide.prototype, 'start');
    const windowMock = sinon.mock(vscode.window);
    const commandStub = sinon.stub(vscode.commands, 'executeCommand');
    const context = {} as vscode.ExtensionContext;

    multiStepInputStub.onFirstCall().throws(new Error('Stub Error'));
    windowMock.expects('showWarningMessage').withArgs('Stub Error').once();
    await testTarget.launcher(context);

    guideFactoryStub
      .onSecondCall()
      .callsFake(
        (className: string, state: State, context: vscode.ExtensionContext) => {
          state.message = 'Stub Info';
          return new MenuGuide(state, context);
        }
      );

    windowMock.expects('showInformationMessage').withArgs('Stub Info').once();

    await testTarget.launcher(context);

    guideFactoryStub
      .onThirdCall()
      .callsFake(
        (className: string, state: State, context: vscode.ExtensionContext) => {
          state.reload = true;
          return new MenuGuide(state, context);
        }
      );

    await testTarget.launcher(context);

    guideFactoryStub
      .onCall(3)
      .callsFake(
        (className: string, state: State, context: vscode.ExtensionContext) => {
          state.command = 'Command';
          return new MenuGuide(state, context);
        }
      );

    await testTarget.launcher(context);

    guideFactoryStub
      .onCall(4)
      .callsFake(
        (className: string, state: State, context: vscode.ExtensionContext) => {
          return new HistoryGuide(state, context);
        }
      );

    await testTarget.history(context);

    windowMock.verify();
    windowMock.restore();

    commandStub.restore();

    guideFactoryStub.restore();
    multiStepInputStub.restore();

    await testTarget.launcher(context);
    await testTarget.edit(context);

    menuGuideStub1.restore();
    menuGuideStub2.restore();
    historyGuideStub.restore();
  });
});
