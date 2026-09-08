import { SubjectType } from '../entities/Gamification';

export interface GamificationPersistedData {
  xp: number;
  streakDays: number;
  isStreakClaimedToday: boolean;
  lastActiveDateIso: string;
  solvedProblemsCount: number;
  activeDaysCount: number;
  energy: number;
  maxEnergy: number;
  selectedSubject: SubjectType;
}

export interface IGamificationRepository {
  getGamificationData(): Promise<GamificationPersistedData | null>;
  saveGamificationData(data: GamificationPersistedData): Promise<void>;
  resetGamificationData(): Promise<void>;
}
