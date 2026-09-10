import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppLocale, isAppLocale } from '../../domain/entities/Locale';
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

  /** Talaba ismi (profil yaratishda kiritiladi, standart: 'Alex'). */
  studentName: string;

  /** Talaba yoshi (profil yaratishda kiritiladi). */
  studentAge: string;

  /** Talaba elektron pochtasi (profil yaratishda kiritiladi). */
  studentEmail: string;

  completeOnboarding: () => void;
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
      studentName: 'Alex',
      studentAge: '',
      studentEmail: '',

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
        set({ studentName: trimmed.length > 0 ? trimmed : 'Alex' });
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
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // i18n qurilma tili bilan ishga tushgan. Saqlangan tanlov bo'lsa —
        // uni tiklaymiz. Bu asinxron, shuning uchun `isHydrated` gacha
        // ekran ko'rsatilmaydi (aks holda til bir zumga sakrab ketardi).
        if (state.locale && isAppLocale(state.locale)) {
          void setAppLocale(state.locale);
        }
        state.setHydrated(true);
      },
    }
  )
);
