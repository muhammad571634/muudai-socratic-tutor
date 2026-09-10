import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppLocale, isAppLocale } from '../../domain/entities/Locale';
import {
  DailyGoalMinutes,
  DEFAULT_DAILY_GOAL,
  normalizeDailyGoal,
} from '../../domain/entities/DailyGoal';
import { setAppLocale } from '../../core/i18n';

/**
 * Ilova darajasidagi sozlamalar — bitta masalaga ham tegishli bo'lmagan,
 * o'rnatishdan o'rnatishgacha saqlanadigan holat.
 */
export interface AppState {
  /**
   * Onboarding ko'rsatilganmi. Ilova qayta o'rnatilganda AsyncStorage
   * tozalanadi, ya'ni yangi o'rnatishda salomlashuv yana bir marta chiqadi —
   * aynan shunday bo'lishi kerak.
   */
  hasSeenOnboarding: boolean;

  /**
   * Bola qo'lda tanlagan til. `null` — hali tanlamagan, qurilma tili ishlatiladi.
   * Saqlanmasa, ilova har ochilganda telefon tiliga qaytardi.
   */
  locale: AppLocale | null;

  /** AsyncStorage o'qib bo'lindimi. Bungacha ekran tanlash mumkin emas. */
  isHydrated: boolean;

  /** Bola kiritgan ism. Bo'sh satr — ism berilmagan (soxta ism qo'yilmaydi). */
  studentName: string;

  /** Talaba yoshi (profil yaratishda kiritiladi). */
  studentAge: string;

  /** Talaba elektron pochtasi (profil yaratishda kiritiladi). */
  studentEmail: string;

  /**
   * Kunlik o'qish maqsadi (daqiqa). Onboardingda so'raladi.
   * Bosh sahifadagi maqsad halqasi va eslatmalar shundan kelib chiqadi.
   */
  dailyGoalMinutes: DailyGoalMinutes;

  /**
   * "Bizni qayerdan eshitdingiz" javobi. Marketing kanallarini o'lchash uchun —
   * `PRODUCT_STRATEGY.md` §4 bo'yicha o'z analitikamizni quramiz, uchinchi
   * tomon SDK'lari ishlatilmaydi. Backend ulanganda yuboriladi.
   */
  referralSource: string | null;

  completeOnboarding: () => void;
  setDailyGoal: (minutes: number) => void;
  setReferralSource: (source: string) => void;
  chooseLocale: (locale: string) => void;
  setHydrated: (hydrated: boolean) => void;
  /** Onboardingni qaytadan ko'rish (sinov uchun). */
  resetOnboarding: () => void;
  setStudentName: (name: string) => void;
  setStudentAge: (age: string) => void;
  setStudentEmail: (email: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasSeenOnboarding: false,
      locale: null,
      isHydrated: false,
      // Soxta zaxira ism qo'yilmaydi — ism berilmasa bo'sh qoladi.
      studentName: '',
      studentAge: '',
      studentEmail: '',
      dailyGoalMinutes: DEFAULT_DAILY_GOAL,
      referralSource: null,

      completeOnboarding: () => {
        set({ hasSeenOnboarding: true });
      },

      chooseLocale: (locale: string) => {
        // Ekran hali tarjima qilinmagan tillarni ham ko'rsatishi mumkin
        // (T2.5 da qo'shiladi). Qo'llab-quvvatlanmagan til tanlansa — tilni
        // o'zgartirmaymiz, aks holda bola bo'sh/inglizcha interfeys oladi.
        if (!isAppLocale(locale)) {
          console.warn(`[useAppStore] "${locale}" tili hali qo'llab-quvvatlanmaydi`);
          return;
        }
        set({ locale });
        void setAppLocale(locale);
      },

      setDailyGoal: (minutes: number) => {
        set({ dailyGoalMinutes: normalizeDailyGoal(minutes) });
      },

      setReferralSource: (source: string) => {
        const trimmed = source.trim();
        set({ referralSource: trimmed.length > 0 ? trimmed : null });
      },

      setHydrated: (hydrated: boolean) => {
        set({ isHydrated: hydrated });
      },

      resetOnboarding: () => {
        set({
          hasSeenOnboarding: false,
          studentName: 'Alex',
          studentAge: '',
          studentEmail: '',
        });
      },

      setStudentName: (name: string) => {
        const trimmed = name.trim();
        // Bo'sh qoldirilsa — ism yo'q. Ilgari bu yerda `'Alex'` qo'yilardi va
        // bola o'zini boshqa birov deb chaqirilayotganini ko'rardi.
        set({ studentName: trimmed });
      },

      setStudentAge: (age: string) => {
        set({ studentAge: age.trim() });
      },

      setStudentEmail: (email: string) => {
        set({ studentEmail: email.trim() });
      },
    }),
    {
      name: 'muudai_app_storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        hasSeenOnboarding: state.hasSeenOnboarding,
        locale: state.locale,
        studentName: state.studentName,
        studentAge: state.studentAge,
        studentEmail: state.studentEmail,
        dailyGoalMinutes: state.dailyGoalMinutes,
        referralSource: state.referralSource,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // i18n qurilma tili bilan ishga tushgan. Saqlangan tanlov bo'lsa —
        // uni tiklaymiz. Bu asinxron, shuning uchun `isHydrated` gacha
        // ekran ko'rsatilmaydi (aks holda til bir zumga sakrab ketardi).
        if (state.locale && isAppLocale(state.locale)) {
          void setAppLocale(state.locale);
        }
        // Saqlangan maqsad ekran variantlari o'zgargan bo'lsa ham to'g'ri qoladi.
        state.dailyGoalMinutes = normalizeDailyGoal(state.dailyGoalMinutes);
        state.setHydrated(true);
      },
    }
  )
);
