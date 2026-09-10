import { SubjectType } from './Gamification';

export type AgeGroup = 'junior' | 'middle' | 'teen';

export interface AgeGroupConfig {
  id: AgeGroup;
  /** i18n kalitlari — matn UI qatlamida `t(...)` bilan olinadi. */
  labelKey: string;
  ageRangeKey: string;
  gradeTextKey: string;
}

export const AGE_GROUP_CONFIGS: Record<AgeGroup, AgeGroupConfig> = {
  junior: {
    id: 'junior',
    labelKey: 'ageGroups.junior.label',
    ageRangeKey: 'ageGroups.junior.ageRange',
    gradeTextKey: 'ageGroups.junior.gradeText',
  },
  middle: {
    id: 'middle',
    labelKey: 'ageGroups.middle.label',
    ageRangeKey: 'ageGroups.middle.ageRange',
    gradeTextKey: 'ageGroups.middle.gradeText',
  },
  teen: {
    id: 'teen',
    labelKey: 'ageGroups.teen.label',
    ageRangeKey: 'ageGroups.teen.ageRange',
    gradeTextKey: 'ageGroups.teen.gradeText',
  },
};

/**
 * Xato qayerdan paydo bo'lgani. Ilgari bu `createdAt` maydonining qiymati
 * orqali ('Mystery Chest' degan sehrli satr) aniqlanardi — vaqt maydoni
 * bir vaqtning o'zida tur belgisi bo'lib xizmat qilardi.
 */
export type MistakeSource = 'scan' | 'mystery_chest';

export interface MistakeItem {
  id: string;
  ageGroup: AgeGroup;
  subject: SubjectType;
  topicTitle: string;
  questionSnippet: string;
  hintSummary: string;
  xpReward: number;
  solved: boolean;
  /** ISO-8601 vaqt belgisi. Ko'rsatish uchun `formatRelativeTime()` ishlatiladi. */
  createdAt: string;
  source: MistakeSource;
  /**
   * Takrorlanishni oldini olish kaliti. Bola bitta qadamda uch marta
   * adashsa — daftarga uchta emas, bitta yozuv tushadi (Duolingo ham
   * bitta elementni bir marta navbatga qo'yadi).
   */
  sourceKey?: string;
}

/**
 * DIQQAT — bu yerda tayyor xatolar ro'yxati TURMAYDI.
 *
 * Ilgari shu joyda `CURRICULUM_MISTAKES` bor edi: 12 ta o'ylab topilgan xato.
 * Ilova birinchi ochilganda bola "Xatolar daftari"ni ochsa, o'zi hech qachon
 * qilmagan 12 ta xatoni ko'rardi va ularni "tuzatib" XP hamda energiya olardi.
 *
 * Bu demo darsdan ham yomonroq edi: soxta dars shunchaki masala ko'rsatadi,
 * soxta xatolar esa bolaning **shaxsiy tarixi** sifatida taqdim etiladi.
 * `AGENTS.md` 2-taqiq va `docs/PEDAGOGY.md` §2.5.
 *
 * Daftar endi faqat bola haqiqatan noto'g'ri javob berganda to'ladi
 * (`useMistakeStore.addMistake`). Bo'sh daftar — bu buzilgan ekran emas,
 * bu "hali xato qilmagansan" degani.
 */

/** Bir daqiqa, soat, kun — millisekundlarda. */
const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

export interface RelativeTimeLabel {
  key: string;
  params?: Record<string, number>;
}

/**
 * ISO vaqt belgisini ko'rsatish uchun i18n kalitiga aylantiradi.
 * Matnni qaytarmaydi — domain qatlami tilni bilmaydi.
 */
export function formatRelativeTime(
  isoDate: string,
  now: Date = new Date()
): RelativeTimeLabel {
  const then = new Date(isoDate).getTime();
  if (Number.isNaN(then)) return { key: 'mistakes.time.justNow' };

  const diff = Math.max(0, now.getTime() - then);
  if (diff < MINUTE_MS) return { key: 'mistakes.time.justNow' };
  if (diff < HOUR_MS) return { key: 'mistakes.time.minutesAgo', params: { count: Math.floor(diff / MINUTE_MS) } };
  if (diff < DAY_MS) return { key: 'mistakes.time.hoursAgo', params: { count: Math.floor(diff / HOUR_MS) } };
  if (diff < 2 * DAY_MS) return { key: 'mistakes.time.yesterday' };
  return { key: 'mistakes.time.daysAgo', params: { count: Math.floor(diff / DAY_MS) } };
}
