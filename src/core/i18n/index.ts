import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import uz from './locales/uz.json';
import ru from './locales/ru.json';

const resources = {
  en: { translation: en },
  uz: { translation: uz },
  ru: { translation: ru },
};

// Normalize device locale (e.g., 'en-US' -> 'en', 'uz-UZ' -> 'uz')
const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';
const supportedLanguages = ['en', 'uz', 'ru'];
const defaultLocale = supportedLanguages.includes(deviceLanguage) ? deviceLanguage : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLocale,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
