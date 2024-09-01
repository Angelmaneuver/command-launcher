import { QuickPickItem, ExtensionContext } from 'vscode';

import { AbstractState, Guide } from '@/guide/abc/type';
import ExtensionSetting, { Location } from '@/settings/extension';

interface State extends AbstractState {
  context: ExtensionContext;
  settings: ExtensionSetting;
  location: Location;
  hierarchy: Array<string>;
  guides?: Array<Guide>;
  message?: string | undefined;
  reload?: boolean;
  view?: {
    refresh: () => void;
  };
  name?: string;
  command?: string;
  terminalCommand?: string;
  autoRun?: boolean;
  singleton?: boolean;
  prompt?: string;
  placeholder?: string;
  items?: Array<QuickPickItem>;
  activeItem?: QuickPickItem;
}

export type { State };
