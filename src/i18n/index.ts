import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { USER_LANG, getDeviceLang, DataLanguage } from '@utils/deviceLang';

import en from './en.json';
import vi from './vi.json';
import jp from './jp.json';

const languageDetector: any = {
  init: Function.prototype,
  type: 'languageDetector',
  async: true,
  detect: async (callback: (arg0: any) => void) => {
    const userLang = await AsyncStorage.getItem(USER_LANG);
    const deviceLang = getDeviceLang();
    const language =
      userLang ||
      DataLanguage.find((item: { value: any }) => item.value === deviceLang)
        ?.value ||
      'vi';
    callback(language);
  },
  cacheUserLanguage: () => {},
};

const resources = {
  en: { translation: en },
  vi: { translation: vi },
  jp: { translation: jp },
};

const fallbackLanguage = { languageTag: 'vi' };

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'vi',
    fallbackLng: fallbackLanguage.languageTag,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

export function t(path: string) {
  return i18n.t(path);
}

export function changeLanguage(alias: string) {
  i18n.changeLanguage(alias);
}
