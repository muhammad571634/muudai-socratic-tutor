import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DAILY_MYSTERY_RIDDLES, MysteryRiddle } from '../../domain/entities/MysteryChest';
import { useGamificationStore } from './useGamificationStore';
import { useMistakeStore } from './useMistakeStore';
import { HapticFeedback } from '../../core/haptics';

export interface MysteryChestState {
  isUnlockedToday: boolean;
  lastUnlockedDateIso: string;
  isHydrated: boolean;

  getRiddle: () => MysteryRiddle;
  unlockChest: () => void;
  resetChest: () => void;
  setHydrated: (hydrated: boolean) => void;
}

const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const useMysteryChestStore = create<MysteryChestState>()(
  persist(
    (set, get) => ({
      isUnlockedToday: false,
      lastUnlockedDateIso: '',
      isHydrated: false,

      getRiddle: () => {
        const mistakeStore = useMistakeStore.getState();
        const unsolvedMistakes = mistakeStore.getActiveMistakes();

        // 1. Agar bolaning real qiynalgan xatosi bo'lsa, uni sirli jumboqqa aylantiramiz!
        if (unsolvedMistakes.length > 0) {
          const target = unsolvedMistakes[0];
          return {
            id: `chest_from_${target.id}`,
            ageGroup: target.ageGroup,
            subject: target.subject,
            title: `The Enigma of ${target.topicTitle}`,
            mysteryStory: `An ancient secret chest has locked itself with a concept you recently encountered: "${target.topicTitle}". Crack the equation below to retrieve the lost key!`,
            puzzleSnippet: target.questionSnippet,
            clueText: target.hintSummary,
            xpReward: 100,
            badgeReward: 'Master of Concepts Key',
            sourceMistakeId: target.id,
          };
        }

        // 2. Agar barcha xatolarini to'g'irlagan bo'lsa, rasmiy o'quv dasturidan kunlik sirli jumboq beriladi
        const ageGroup = mistakeStore.ageGroup;
        return DAILY_MYSTERY_RIDDLES[ageGroup] || DAILY_MYSTERY_RIDDLES.middle;
      },

      unlockChest: () => {
        if (!get().isUnlockedToday) {
          const currentRiddle = get().getRiddle();

          // Agar jumboq bolaning real xatosiga bog'langan bo'lsa, uni "Mastered" deb belgilaymiz
          if (currentRiddle.sourceMistakeId) {
            useMistakeStore.getState().solveMistake(currentRiddle.sourceMistakeId);
          }

          // 100 XP + 2 Bonus Energy mukofot qo'shiladi, xato mastered qilinadi va zafarli Taptic tebranish beriladi
          HapticFeedback.success();
          const gamificationStore = useGamificationStore.getState();
          gamificationStore.addXp(100);
          gamificationStore.addBonusEnergy(2);
          gamificationStore.recordSolvedProblem();

          set({
            isUnlockedToday: true,
            lastUnlockedDateIso: getTodayDateString(),
          });
        }
      },

      resetChest: () => {
        set({
          isUnlockedToday: false,
          lastUnlockedDateIso: '',
        });
      },

      setHydrated: (hydrated: boolean) => {
        set({ isHydrated: hydrated });
      },
    }),
    {
      name: 'muudai_mystery_chest_storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isUnlockedToday: state.isUnlockedToday,
        lastUnlockedDateIso: state.lastUnlockedDateIso,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const today = getTodayDateString();
          // Yangi kun bo'lsa, sandiq avtomatik qayta qulflanadi
          if (state.lastUnlockedDateIso !== today) {
            state.resetChest();
          }
          state.setHydrated(true);
        }
      },
    }
  )
);
