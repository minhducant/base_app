import { Platform, NativeModules } from 'react-native';

export const DataLanguage: { label: string; value: string }[] = [
  { label: 'Tiếng Việt', value: 'vi' },
  { label: 'English', value: 'en' },
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
