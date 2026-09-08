import {
  GamificationPersistedData,
  IGamificationRepository,
} from '../../domain/repositories/IGamificationRepository';
import { database } from '../local/database';
import UserProgressModel from '../local/database/models/UserProgressModel';
import { SubjectType } from '../../domain/entities/Gamification';
import { Q } from '@nozbe/watermelondb';

export class GamificationRepositoryImpl implements IGamificationRepository {
  async getGamificationData(): Promise<GamificationPersistedData | null> {
    try {
      const records = await database.get<UserProgressModel>('user_progress').query().fetch();
      
      if (records.length === 0) {
        return null;
      }
      
      const record = records[0];
      return {
        xp: record.xp,
        streakDays: record.streakDays,
        isStreakClaimedToday: record.isStreakClaimedToday,
        lastActiveDateIso: record.lastActiveDateIso,
        solvedProblemsCount: record.solvedProblemsCount,
        activeDaysCount: record.activeDaysCount,
        energy: record.energy,
        maxEnergy: record.maxEnergy,
        selectedSubject: record.selectedSubject as SubjectType,
      };
    } catch (error) {
      console.error('[GamificationRepositoryImpl] Failed to load data from WatermelonDB', error);
      return null;
    }
  }

  async saveGamificationData(data: GamificationPersistedData): Promise<void> {
    try {
      await database.write(async () => {
        const records = await database.get<UserProgressModel>('user_progress').query().fetch();
        if (records.length > 0) {
          const record = records[0];
          await record.update(r => {
            r.xp = data.xp;
            r.streakDays = data.streakDays;
            r.isStreakClaimedToday = data.isStreakClaimedToday;
            r.lastActiveDateIso = data.lastActiveDateIso;
            r.solvedProblemsCount = data.solvedProblemsCount;
            r.activeDaysCount = data.activeDaysCount;
            r.energy = data.energy;
            r.maxEnergy = data.maxEnergy;
            r.selectedSubject = data.selectedSubject;
          });
        } else {
          await database.get<UserProgressModel>('user_progress').create(r => {
            r.xp = data.xp;
            r.streakDays = data.streakDays;
            r.isStreakClaimedToday = data.isStreakClaimedToday;
            r.lastActiveDateIso = data.lastActiveDateIso;
            r.solvedProblemsCount = data.solvedProblemsCount;
            r.activeDaysCount = data.activeDaysCount;
            r.energy = data.energy;
            r.maxEnergy = data.maxEnergy;
            r.selectedSubject = data.selectedSubject;
          });
        }
      });
    } catch (error) {
      console.error('[GamificationRepositoryImpl] Failed to save data to WatermelonDB', error);
      throw error;
    }
  }

  async resetGamificationData(): Promise<void> {
    try {
      await database.write(async () => {
        const records = await database.get<UserProgressModel>('user_progress').query().fetch();
        for (const record of records) {
          await record.destroyPermanently();
        }
      });
    } catch (error) {
      console.error('[GamificationRepositoryImpl] Failed to reset data', error);
    }
  }
}
