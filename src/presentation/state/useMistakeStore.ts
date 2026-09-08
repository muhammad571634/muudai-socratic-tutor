import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AgeGroup, CURRICULUM_MISTAKES, MistakeItem } from '../../domain/entities/MistakeReview';
import { useGamificationStore } from './useGamificationStore';

export interface MistakeState {
  ageGroup: AgeGroup;
  mistakes: MistakeItem[];
  activePracticingMistake: MistakeItem | null;
  isHydrated: boolean;

  setAgeGroup: (ageGroup: AgeGroup) => void;
  setActivePracticingMistake: (mistake: MistakeItem | null) => void;
  solveMistake: (id: string) => void;
  addMistake: (newMistake: Omit<MistakeItem, 'id' | 'createdAt' | 'solved'>) => void;
  getActiveMistakes: () => MistakeItem[];
  getActiveCount: () => number;
  resetMistakes: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useMistakeStore = create<MistakeState>()(
  persist(
    (set, get) => ({
      ageGroup: 'middle', // Standart 11-13 yosh
      mistakes: CURRICULUM_MISTAKES,
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

        if (target && !target.solved) {
          // O'quvchiga XP mukofotini qo'shish
          useGamificationStore.getState().addXp(target.xpReward);

          // Xatoni yechilgan deb belgilash
          set({
            mistakes: currentMistakes.map((m) =>
              m.id === id ? { ...m, solved: true } : m
            ),
            activePracticingMistake: null,
          });
        }
      },

      addMistake: (newMistake) => {
        const item: MistakeItem = {
          ...newMistake,
          id: `m_${Date.now()}`,
          createdAt: 'Just now',
          solved: false,
        };
        set((state) => ({ mistakes: [item, ...state.mistakes] }));
      },

      getActiveMistakes: () => {
        const { mistakes, ageGroup } = get();
        return mistakes.filter((m) => m.ageGroup === ageGroup && !m.solved);
      },

      getActiveCount: () => {
        const { mistakes, ageGroup } = get();
        return mistakes.filter((m) => m.ageGroup === ageGroup && !m.solved).length;
      },

      resetMistakes: () => {
        set({
          mistakes: CURRICULUM_MISTAKES,
          activePracticingMistake: null,
        });
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
        if (state) {
          if (!state.mistakes || state.mistakes.length === 0) {
            state.resetMistakes();
          }
          state.setHydrated(true);
        }
      },
    }
  )
);
