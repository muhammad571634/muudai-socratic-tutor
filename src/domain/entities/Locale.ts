/**
 * Locale
 * Ilova qo'llab-quvvatlaydigan tillar — yagona haqiqat manbai.
 *
 * Bu fayl domain qatlamida turadi va hech qanday kutubxonaga (i18next,
 * expo-localization, expo-speech) bog'liq emas. Shuning uchun uni prompt
 * quruvchi, data-source va core servislari bemalol import qila oladi.
 */

export const SUPPORTED_LOCALES = ['en', 'uz', 'ru'] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * i18next konfiguratsiyasidagi `fallbackLng` bilan bir xil bo'lishi shart
 * (`src/core/i18n/index.ts`).
 */
export const DEFAULT_LOCALE: AppLocale = 'en';

export function isAppLocale(value: string | null | undefined): value is AppLocale {
  return !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/**
 * BCP-47 teglarini ('en-US', 'uz-Latn-UZ', 'ru_RU') qo'llab-quvvatlanadigan
 * til kodiga keltiradi. Noma'lum til uchun DEFAULT_LOCALE qaytadi.
 */
export function normalizeLocale(raw: string | null | undefined): AppLocale {
  if (!raw) return DEFAULT_LOCALE;
  const base = raw.toLowerCase().replace('_', '-').split('-')[0];
  return isAppLocale(base) ? base : DEFAULT_LOCALE;
}

/**
 * Native TTS dvigatellari (iOS AVSpeechSynthesizer / Android TextToSpeech)
 * kutadigan BCP-47 teglari.
 */
export const LOCALE_SPEECH_TAGS: Record<AppLocale, string> = {
  en: 'en-US',
  uz: 'uz-UZ',
  ru: 'ru-RU',
};

/**
 * LLM system prompt ichida ishlatiladigan til nomlari. Model uchun kod emas,
 * to'liq ingliz tilidagi nom aniqroq signal beradi.
 */
export const LOCALE_PROMPT_NAMES: Record<AppLocale, string> = {
  en: 'English',
  uz: 'Uzbek (Latin script)',
  ru: 'Russian',
};

export function toSpeechLanguageTag(locale: AppLocale): string {
  return LOCALE_SPEECH_TAGS[locale];
}

export function toPromptLanguageName(locale: AppLocale): string {
  return LOCALE_PROMPT_NAMES[locale];
}
