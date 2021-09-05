import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { NativeModules, Platform } from 'react-native';

import enLocales from './src/assets/locales/en';
import viLocales from './src/assets/locales/vi';
import zhLocales from './src/assets/locales/zh';
import thLocales from './src/assets/locales/th';
// not like to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: cb => cb('vi'),
  init: () => {},
  cacheUserLanguage: () => {},
};

const resources = {
  en: enLocales,
  vi: viLocales,
  zh: zhLocales,
  th: thLocales,
};

export const loadDeviceLanguage = () => {
  const locale =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale
      : NativeModules.I18nManager.localeIdentifier;
  console.log('Device language: ', locale);
  let foundLang;
  if (locale && `${locale}`.includes('vi')) {
    foundLang = 'vi';
  } else {
    foundLang = 'en';
  }
  i18n.changeLanguage(foundLang);
  return foundLang;
};

i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  //   .use(Backend)

  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(languageDetector)

  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    fallbackLng: 'en',
    debug: true,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
