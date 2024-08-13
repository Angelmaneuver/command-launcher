import ExtensionSetting from '@/settings/extension';

export async function clear(): Promise<void> {
  return new ExtensionSetting().clearHistory();
}
