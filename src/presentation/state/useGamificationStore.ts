import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConfig } from '../../core/config';
import {
  SubjectType,
  LearnerRank,
  SUBJECT_ITEMS,
  SubjectItem,
  RankProgress,
  StreakDayInfo,
  calculateRank,
  calculateRankProgress,
  getWeeklyStreakStatus,
} from '../../domain/entities/Gamification';

export interface EnergyRefillResult {
  recharged: number;
  secondsUntilNext: number;
}

export interface GamificationState {
  xp: number;
  streakDays: number;
  isStreakClaimedToday: boolean;
  lastActiveDateIso: string;
  solvedProblemsCount: number;
  activeDaysCount: number;
  energy: number;
  maxEnergy: number;
  lastEnergyRefillTimestamp: number;
  selectedSubject: SubjectType;
  currentRank: LearnerRank;
  isHydrated: boolean;

  // Selectors & Computed
  getActiveSubjectItem: () => SubjectItem;
  getRankProgress: () => RankProgress;
  getWeeklyStreak: () => StreakDayInfo[];
  canAccessMysteryChest: () => boolean;
  canAccessLaboratory: () => boolean;
  canAccessHonorCertificate: () => boolean;

  // Actions
  addXp: (amount: number) => void;
  recordSolvedProblem: () => void;
  recordActiveDay: () => void;
  consumeEnergy: () => boolean;
  replenishEnergy: () => void;
  addBonusEnergy: (amount: number) => void;
  checkEnergyRefill: () => EnergyRefillResult;
  claimDailyStreak: () => void;
  setSubject: (subject: SubjectType) => void;
  checkDailyRefresh: () => void;
  setHydrated: (hydrated: boolean) => void;
  resetProgress: () => void;
}

const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      xp: 120,
      streakDays: 5,
      isStreakClaimedToday: false,
      lastActiveDateIso: getTodayDateString(),
      solvedProblemsCount: 8,
      activeDaysCount: 2,
      energy: 5,
      maxEnergy: 5,
      lastEnergyRefillTimestamp: Date.now(),
      selectedSubject: 'math',
      currentRank: calculateRank(120, 8, 2),
      isHydrated: false,

      getActiveSubjectItem: () => {
        const currentId = get().selectedSubject;
        return SUBJECT_ITEMS.find((s) => s.id === currentId) || SUBJECT_ITEMS[0];
      },

      getRankProgress: () => {
        const { xp, solvedProblemsCount, activeDaysCount } = get();
        return calculateRankProgress(xp, solvedProblemsCount, activeDaysCount);
      },

      getWeeklyStreak: () => {
        return getWeeklyStreakStatus(get().streakDays, get().isStreakClaimedToday);
      },

      canAccessMysteryChest: () => {
        return get().currentRank.level >= 2;
      },

      canAccessLaboratory: () => {
        return get().currentRank.level >= 3;
      },

      canAccessHonorCertificate: () => {
        return get().currentRank.level >= 4;
      },

      addXp: (amount: number) => {
        set((state) => {
          const newXp = state.xp + amount;
          return {
            xp: newXp,
            currentRank: calculateRank(newXp, state.solvedProblemsCount, state.activeDaysCount),
          };
        });
      },

      recordSolvedProblem: () => {
        set((state) => {
          const newSolved = state.solvedProblemsCount + 1;
          return {
            solvedProblemsCount: newSolved,
            currentRank: calculateRank(state.xp, newSolved, state.activeDaysCount),
          };
        });
      },

      recordActiveDay: () => {
        set((state) => {
          const newDays = state.activeDaysCount + 1;
          return {
            activeDaysCount: newDays,
            currentRank: calculateRank(state.xp, state.solvedProblemsCount, newDays),
          };
        });
      },

      consumeEnergy: () => {
        const { energy, maxEnergy, lastEnergyRefillTimestamp } = get();
        if (energy <= 0) {
          return false;
        }
        const now = Date.now();
        // Agar energiya to'liq bo'lsa, refill taymeri aynan hozirdan boshlanadi
        const newTimestamp = energy === maxEnergy ? now : (lastEnergyRefillTimestamp || now);
        set({
          energy: energy - 1,
          lastEnergyRefillTimestamp: newTimestamp,
        });
        return true;
      },

      replenishEnergy: () => {
        set((state) => ({
          energy: state.maxEnergy,
          lastEnergyRefillTimestamp: Date.now(),
        }));
      },

      addBonusEnergy: (amount: number) => {
        set((state) => {
          const newEnergy = Math.min(state.maxEnergy, state.energy + amount);
          return {
            energy: newEnergy,
            lastEnergyRefillTimestamp: newEnergy >= state.maxEnergy ? Date.now() : state.lastEnergyRefillTimestamp,
          };
        });
      },

      checkEnergyRefill: (): EnergyRefillResult => {
        const { energy, maxEnergy, lastEnergyRefillTimestamp } = get();
        if (energy >= maxEnergy) {
          return { recharged: 0, secondsUntilNext: 0 };
        }

        const now = Date.now();
        const refillIntervalMs = AppConfig.energy.refillIntervalMs;
        const validTimestamp = lastEnergyRefillTimestamp || now;
        const elapsed = Math.max(0, now - validTimestamp);

        if (elapsed >= refillIntervalMs) {
          const rechargeCount = Math.floor(elapsed / refillIntervalMs);
          const newEnergy = Math.min(maxEnergy, energy + rechargeCount);
          const isNowFull = newEnergy >= maxEnergy;
          const nextTimestamp = isNowFull
            ? now
            : validTimestamp + (rechargeCount * refillIntervalMs);
          const remainingMs = isNowFull
            ? 0
            : refillIntervalMs - (now - nextTimestamp);

          set({
            energy: newEnergy,
            lastEnergyRefillTimestamp: nextTimestamp,
          });

          return {
            recharged: rechargeCount,
            secondsUntilNext: Math.max(0, Math.ceil(remainingMs / 1000)),
          };
        } else {
          const remainingMs = refillIntervalMs - elapsed;
          return {
            recharged: 0,
            secondsUntilNext: Math.max(0, Math.ceil(remainingMs / 1000)),
          };
        }
      },

      claimDailyStreak: () => {
        const { isStreakClaimedToday, streakDays, xp, solvedProblemsCount, activeDaysCount } = get();
        if (isStreakClaimedToday) return;

        const newXp = xp + 20;
        const newActiveDays = activeDaysCount + 1;
        set({
          streakDays: streakDays + 1,
          activeDaysCount: newActiveDays,
          isStreakClaimedToday: true,
          lastActiveDateIso: getTodayDateString(),
          xp: newXp,
          currentRank: calculateRank(newXp, solvedProblemsCount, newActiveDays),
        });
      },

      setSubject: (subject: SubjectType) => {
        set({ selectedSubject: subject });
      },

      checkDailyRefresh: () => {
        const { lastActiveDateIso, xp, solvedProblemsCount, activeDaysCount, maxEnergy } = get();
        const today = getTodayDateString();

        if (lastActiveDateIso !== today) {
          // Yangi kun keldi: streakni qayta da'vo qilish ochiladi va energiya to'liq tiklanadi
          set({
            isStreakClaimedToday: false,
            lastActiveDateIso: today,
            energy: maxEnergy,
            lastEnergyRefillTimestamp: Date.now(),
            currentRank: calculateRank(xp, solvedProblemsCount, activeDaysCount),
          });
        } else {
          // Rank holatini sinxronlashtirish
          set({
            currentRank: calculateRank(xp, solvedProblemsCount, activeDaysCount),
          });
        }
      },

      setHydrated: (hydrated: boolean) => {
        set({ isHydrated: hydrated });
      },

      resetProgress: () => {
        const today = getTodayDateString();
        set({
          xp: 0,
          streakDays: 1,
          isStreakClaimedToday: false,
          lastActiveDateIso: today,
          solvedProblemsCount: 0,
          activeDaysCount: 1,
          energy: 5,
          maxEnergy: 5,
          lastEnergyRefillTimestamp: Date.now(),
          selectedSubject: 'math',
          currentRank: calculateRank(0, 0, 1),
        });
      },
    }),
    {
      name: 'muudai_gamification_storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        xp: state.xp,
        streakDays: state.streakDays,
        isStreakClaimedToday: state.isStreakClaimedToday,
        lastActiveDateIso: state.lastActiveDateIso,
        solvedProblemsCount: state.solvedProblemsCount,
        activeDaysCount: state.activeDaysCount,
        energy: state.energy,
        maxEnergy: state.maxEnergy,
        lastEnergyRefillTimestamp: state.lastEnergyRefillTimestamp,
        selectedSubject: state.selectedSubject,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.checkDailyRefresh();
          state.checkEnergyRefill();
          state.setHydrated(true);
        }
      },
    }
  )
);
