import { Platform, NativeModules } from 'react-native';

import EnglandFlag from '@assets/icons/EnglandFlag';
import VietnamFlag from '@assets/icons/VietnamFlag';

export const DataLanguage: { label: string; value: string; icon: any }[] = [
  { label: 'Tiếng Việt', value: 'vi', icon: VietnamFlag },
  { label: 'English', value: 'en', icon: EnglandFlag },
];

export const getDeviceLang = () => {
  const appLanguage =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0]
      : NativeModules.I18nManager.localeIdentifier;
  return appLanguage.search(/-|_/g) !== -1
    ? appLanguage.slice(0, 2)
    : appLanguage;
};

export const USER_LANG = 'user_lang';
