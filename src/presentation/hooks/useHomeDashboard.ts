// O'ylanish: Clean Architecture talablariga binoan, UI komponentlarida hech qanday
// biznes mantiq bo'lmasligi kerak. Ushbu useHomeDashboard hooki dashboard uchun
// barcha holat, hisob-kitoblar, dinamik fan kartalari va harakatlarni o'zida birlashtiradi.

import { useMemo, useCallback } from 'react';
import { useGamificationStore } from '../state/useGamificationStore';
import { useMysteryChestStore } from '../state/useMysteryChestStore';
import { useEnergyTimer } from './useEnergyTimer';
import { getLiveGreeting, GreetingInfo } from '../../domain/entities/Greeting';
import {
  SubjectType,
  LearnerRank,
  RankProgress,
  StreakDayInfo,
  SubjectItem,
  SUBJECT_ITEMS,
} from '../../domain/entities/Gamification';
import { HapticFeedback } from '../../core/haptics';

export interface DashboardSubjectCardInfo extends SubjectItem {
  isActive: boolean;
  statusBadgeText: string;
}

export interface UseHomeDashboardResult {
  // Student Profile & Greeting
  studentName: string;
  studentEmail: string;
  greeting: GreetingInfo;

  // Gamification Metrics
  xp: number;
  currentRank: LearnerRank;
  rankProgress: RankProgress;
  streakDays: number;
  isStreakClaimedToday: boolean;
  weeklyStreak: StreakDayInfo[];
  solvedProblemsCount: number;
  activeDaysCount: number;
  studyHours: number;

  // Energy
  energy: number;
  maxEnergy: number;
  isEnergyDrained: boolean;
  energyCountdown: string;
  refillProgressPercent: number;

  // Feature Access Flags
  hasChestAccess: boolean;
  isChestUnlockedToday: boolean;
  hasLabAccess: boolean;
  activeSubject: SubjectItem;
  subjects: DashboardSubjectCardInfo[];

  // Handlers
  claimDailyStreak: () => void;
  selectSubject: (subject: SubjectType) => void;
}

export const useHomeDashboard = (studentName: string = 'Alex'): UseHomeDashboardResult => {
  const {
    xp,
    streakDays,
    isStreakClaimedToday,
    solvedProblemsCount,
    activeDaysCount,
    currentRank,
    getRankProgress,
    getWeeklyStreak,
    canAccessMysteryChest,
    canAccessLaboratory,
    getActiveSubjectItem,
    claimDailyStreak: storeClaimStreak,
    setSubject,
  } = useGamificationStore();

  const isChestUnlockedToday = useMysteryChestStore((s) => s.isUnlockedToday);
  const {
    energy,
    maxEnergy,
    isDrained: isEnergyDrained,
    formattedCountdown: energyCountdown,
    refillProgressPercent,
  } = useEnergyTimer();

  const greeting = useMemo(() => getLiveGreeting(studentName), [studentName]);
  const hasChestAccess = canAccessMysteryChest();
  const hasLabAccess = canAccessLaboratory();
  const weeklyStreak = getWeeklyStreak();
  const rankProgress = getRankProgress();
  const activeSubject = getActiveSubjectItem();

  // O'quv soatlari hisob-kitobi (streak va hal qilingan masalalar asosida)
  const studyHours = useMemo(() => {
    const base = Math.max(1, Math.round(streakDays * 1.5));
    const solvedBonus = Math.floor(solvedProblemsCount * 0.25);
    return base + solvedBonus;
  }, [streakDays, solvedProblemsCount]);

  // Dinamik fan kartalari (faol fanga qarab status nishonlari o'zgaradi)
  const subjects: DashboardSubjectCardInfo[] = useMemo(() => {
    return SUBJECT_ITEMS.map((item) => {
      const isActive = item.id === activeSubject.id;
      let statusBadgeText = 'Ready';
      if (isActive) {
        statusBadgeText = 'Active';
      } else if (item.id === 'physics') {
        statusBadgeText = 'In Progress';
      } else if (item.id === 'math') {
        statusBadgeText = 'Resume';
      }
      return {
        ...item,
        isActive,
        statusBadgeText,
      };
    });
  }, [activeSubject.id]);

  const claimDailyStreak = useCallback(() => {
    if (!isStreakClaimedToday) {
      HapticFeedback.success();
      storeClaimStreak();
    }
  }, [isStreakClaimedToday, storeClaimStreak]);

  const selectSubject = useCallback(
    (subject: SubjectType) => {
      HapticFeedback.medium();
      setSubject(subject);
    },
    [setSubject]
  );

  return {
    studentName,
    studentEmail: 'alex@muudai.com',
    greeting,
    xp,
    currentRank,
    rankProgress,
    streakDays,
    isStreakClaimedToday,
    weeklyStreak,
    solvedProblemsCount,
    activeDaysCount,
    studyHours,
    energy,
    maxEnergy,
    isEnergyDrained,
    energyCountdown,
    refillProgressPercent,
    hasChestAccess,
    isChestUnlockedToday,
    hasLabAccess,
    activeSubject,
    subjects,
    claimDailyStreak,
    selectSubject,
  };
};
