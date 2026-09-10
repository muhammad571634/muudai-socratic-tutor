import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AgeGroup, MistakeItem } from '../../domain/entities/MistakeReview';
import { useGamificationStore } from './useGamificationStore';

/** Xatolar daftarining uch holati. */
export type MistakeVaultState = 'no_mistakes_yet' | 'all_cleared' | 'has_active';

/** `addMistake` ga beriladigan ma'lumot: id, vaqt va holat store ichida qo'yiladi. */
export type NewMistakeInput = Omit<MistakeItem, 'id' | 'createdAt' | 'solved'>;

export interface MistakeState {
  ageGroup: AgeGroup;
  mistakes: MistakeItem[];
  activePracticingMistake: MistakeItem | null;
  isHydrated: boolean;

  setAgeGroup: (ageGroup: AgeGroup) => void;
  setActivePracticingMistake: (mistake: MistakeItem | null) => void;
  solveMistake: (id: string) => void;
  addMistake: (newMistake: NewMistakeInput) => void;
  getActiveMistakes: () => MistakeItem[];
  getActiveCount: () => number;
  /**
   * Daftar holati. "Hali xato qilmagan" va "hammasini tuzatib bo'lgan" —
   * bular ikki xil holat va bolaga ikki xil xabar ko'rsatilishi kerak.
   */
  getVaultState: () => MistakeVaultState;
  /** Barcha xatolarni o'chiradi (sozlamalar / test uchun). */
  clearMistakes: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useMistakeStore = create<MistakeState>()(
  persist(
    (set, get) => ({
      ageGroup: 'middle', // Standart 11-13 yosh
      // Boshlang'ich ro'yxat BO'SH. Daftar faqat bolaning o'z xatolari bilan
      // to'ladi — tayyor "namuna" xatolar qo'yilmaydi (MistakeReview.ts izohi).
      mistakes: [],
      activePracticingMistake: null,
      isHydrated: false,

      setAgeGroup: (ageGroup: AgeGroup) => {
        set({ ageGroup });
      },

      setActivePracticingMistake: (mistake: MistakeItem | null) => {
        set({ activePracticingMistake: mistake });
      },

      solveMistake: (id: string) => {
        const currentMistakes = get().mistakes;
        const target = currentMistakes.find((m) => m.id === id);
        if (!target || target.solved) return;

        // XP faqat shu yerda beriladi. Ilgari `App.tsx` ham qo'shimcha
        // `addXp()` chaqirardi va bola bitta xato uchun ikki barobar XP olardi.
        useGamificationStore.getState().addXp(target.xpReward);

        set({
          mistakes: currentMistakes.map((m) => (m.id === id ? { ...m, solved: true } : m)),
          activePracticingMistake: null,
        });
      },

      addMistake: (newMistake) => {
        const { mistakes } = get();

        // Bitta qadamda bir necha marta adashish — bitta yozuv. Duolingo ham
        // xato qilingan elementni navbatga bir marta qo'yadi.
        if (newMistake.sourceKey) {
          const alreadyQueued = mistakes.some(
            (m) => m.sourceKey === newMistake.sourceKey && !m.solved
          );
          if (alreadyQueued) return;
        }

        const item: MistakeItem = {
          ...newMistake,
          id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          createdAt: new Date().toISOString(),
          solved: false,
        };
        set({ mistakes: [item, ...mistakes] });
      },

      getActiveMistakes: () => {
        const { mistakes, ageGroup } = get();
        return mistakes.filter((m) => m.ageGroup === ageGroup && !m.solved);
      },

      getActiveCount: () => {
        const { mistakes, ageGroup } = get();
        return mistakes.filter((m) => m.ageGroup === ageGroup && !m.solved).length;
      },

      getVaultState: () => {
        const { mistakes, ageGroup } = get();
        const inGroup = mistakes.filter((m) => m.ageGroup === ageGroup);
        if (inGroup.some((m) => !m.solved)) return 'has_active';
        return inGroup.length === 0 ? 'no_mistakes_yet' : 'all_cleared';
      },

      clearMistakes: () => {
        set({ mistakes: [], activePracticingMistake: null });
      },

      setHydrated: (hydrated: boolean) => {
        set({ isHydrated: hydrated });
      },
    }),
    {
      name: 'muudai_mistakes_storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        ageGroup: state.ageGroup,
        mistakes: state.mistakes,
      }),
      onRehydrateStorage: () => (state) => {
        // Bo'sh ro'yxat — bu normal holat, "hali xato qilmagansan" degani.
        // Ilgari bu yerda ro'yxat bo'sh bo'lsa 12 ta soxta xato qayta
        // yuklanardi, ya'ni bola ularni yechib bo'lsa ham qaytib kelaverardi.
        state?.setHydrated(true);
      },
    }
  )
);
