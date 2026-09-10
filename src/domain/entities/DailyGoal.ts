/**
 * DailyGoal — bolaning kunlik o'qish maqsadi (daqiqalarda).
 *
 * Onboardingda so'raladi va keyin bosh sahifadagi maqsad halqasi hamda
 * kunlik eslatmalarni boshqaradi. Duolingo ham aynan shu javobdan
 * foydalanadi — savol berib, javobni tashlab yuborish ma'nosiz.
 *
 * Domain qatlamida turadi: hech qanday kutubxonaga bog'liq emas.
 */

/** Onboardingda taklif qilinadigan variantlar (daqiqa). */
export const DAILY_GOAL_OPTIONS = [5, 10, 15, 30, 60] as const;

export type DailyGoalMinutes = (typeof DAILY_GOAL_OPTIONS)[number];

/** Tanlanmagan bo'lsa ishlatiladigan qiymat. */
export const DEFAULT_DAILY_GOAL: DailyGoalMinutes = 10;

export function isDailyGoalMinutes(value: number): value is DailyGoalMinutes {
  return (DAILY_GOAL_OPTIONS as readonly number[]).includes(value);
}

/**
 * Tashqaridan kelgan qiymatni ro'yxatdagi eng yaqin variantga keltiradi.
 * Ekran o'z variantlarini o'zgartirsa ham saqlangan qiymat buzilmaydi.
 */
export function normalizeDailyGoal(value: number | null | undefined): DailyGoalMinutes {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return DEFAULT_DAILY_GOAL;
  }
  if (isDailyGoalMinutes(value)) return value;

  return DAILY_GOAL_OPTIONS.reduce<DailyGoalMinutes>((closest, option) =>
    Math.abs(option - value) < Math.abs(closest - value) ? option : closest,
    DEFAULT_DAILY_GOAL
  );
}
