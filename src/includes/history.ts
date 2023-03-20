import { ExtensionSetting, CONFIG_ITEMS } from './settings/extension';

export async function clear(): Promise<void> {
	return new ExtensionSetting().remove(CONFIG_ITEMS.history);
}
