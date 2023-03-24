import i18next from 'i18next';
import { locale } from 'expo-localization';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import fil from './locales/fil.json';
import ar from './locales/ara.json';
import hi from './locales/hin.json';
import kn from './locales/kan.json';
import ta from './locales/tam.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const resources = { en, fil, ar, hi, kn, ta };
import { iso6393To1 } from 'iso-639-3';

export const SUPPORTED_LANGUAGES = {
  en: 'English',
  fil: 'Filipino',
  ar: 'عربى',
  hi: 'हिंदी',
  kn: 'ಕನ್ನಡ',
  ta: 'தமிழ்',
};

i18next
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: getLanguageCode(locale),
    fallbackLng: getLanguageCode,
    supportedLngs: Object.keys(SUPPORTED_LANGUAGES),
  })
  .then(async () => {
    const language = await AsyncStorage.getItem('language');
    if (language !== i18next.language) {
      i18next.changeLanguage(language);
    }
  });

export default i18next;

function getLanguageCode(code: string) {
  const [language] = code.split('-');
  return language;
}

export function getLanguageDetails(locales, currentLanguage) {
  getThreeLetterLanguageCode('en');
  const supportedLanguages = Object.keys(SUPPORTED_LANGUAGES);
  if (locales.length > 1) {
    for (const language in supportedLanguages) {
      if (currentLanguage == supportedLanguages[language]) {
        const languageDetails = locales.filter(
          (obj) => obj.language === getThreeLetterLanguageCode(currentLanguage)
        );
        return languageDetails[0]?.value;
      }
    }
  }
  return locales[0]?.value;
}

function getThreeLetterLanguageCode(twoLetterLanguageCode) {
  // @ts-ignore
  let key = Object.keys(iso6393To1).find(
    (key) => iso6393To1[key] === twoLetterLanguageCode
  );
  console.log('3letter key ->', key);
  return key;
}
