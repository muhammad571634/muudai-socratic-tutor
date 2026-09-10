import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import { ScanError } from '../../domain/entities/SocraticDialogue';
import {
  AppLocale,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  normalizeLocale,
  toSpeechLanguageTag,
} from '../../domain/entities/Locale';

import en from './locales/en.json';
import uz from './locales/uz.json';
import ru from './locales/ru.json';

const resources = {
  en: { translation: en },
  uz: { translation: uz },
  ru: { translation: ru },
};

// Qurilma tilini normallashtiramiz ('en-US' -> 'en', 'uz-Latn-UZ' -> 'uz').
// Qo'llab-quvvatlanmagan til DEFAULT_LOCALE ga tushadi.
const deviceLocale: AppLocale = normalizeLocale(Localization.getLocales()[0]?.languageCode);

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: deviceLocale,
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: [...SUPPORTED_LOCALES],
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

/**
 * Joriy faol til. React'dan tashqarida (servislar, hooklar, data qatlami)
 * tilni bilish kerak bo'lganda shu funksiya ishlatiladi — komponent ichida
 * odatdagidek `useTranslation()` qulayroq.
 */
export function getActiveLocale(): AppLocale {
  return normalizeLocale(i18n.language);
}

/**
 * Joriy til uchun TTS dvigateliga beriladigan BCP-47 tegi ('uz-UZ' kabi).
 */
export function getSpeechLanguageTag(): string {
  return toSpeechLanguageTag(getActiveLocale());
}

/**
 * `ScanError` ichidagi i18n kalitini joriy tildagi matnga aylantiradi.
 * Domain va data qatlamlari xatoni kalit bilan tashlaydi — matnga aylantirish
 * shu yerda, UI chegarasida bo'ladi.
 *
 * Noma'lum turdagi xato kelsa ham bola texnik xabar ko'rmaydi.
 */
export function resolveScanErrorMessage(error: unknown): string {
  if (error instanceof ScanError || (error as ScanError)?.name === 'ScanError') {
    const scanError = error as ScanError;
    return i18n.t(scanError.messageKey, scanError.messageParams ?? {});
  }
  return i18n.t('errors.unexpected');
}

/**
 * Tilni qo'lda almashtirish (sozlamalar ekrani uchun).
 */
export async function setAppLocale(locale: AppLocale): Promise<void> {
  await i18n.changeLanguage(locale);
}

export default i18n;
