import {
  GamificationPersistedData,
  IGamificationRepository,
} from '../../domain/repositories/IGamificationRepository';
import { AsyncStorageService } from '../local/storage/AsyncStorageService';

export class GamificationRepositoryImpl implements IGamificationRepository {
  private static readonly STORAGE_KEY = 'gamification_state';

  async getGamificationData(): Promise<GamificationPersistedData | null> {
    try {
      return await AsyncStorageService.getItem<GamificationPersistedData>(
        GamificationRepositoryImpl.STORAGE_KEY
      );
    } catch (error) {
      console.error('[GamificationRepositoryImpl] Failed to load data', error);
      return null;
    }
  }

  async saveGamificationData(data: GamificationPersistedData): Promise<void> {
    try {
      await AsyncStorageService.setItem(GamificationRepositoryImpl.STORAGE_KEY, data);
    } catch (error) {
      console.error('[GamificationRepositoryImpl] Failed to save data', error);
      throw error;
    }
  }

  async resetGamificationData(): Promise<void> {
    try {
      await AsyncStorageService.removeItem(GamificationRepositoryImpl.STORAGE_KEY);
    } catch (error) {
      console.error('[GamificationRepositoryImpl] Failed to reset data', error);
    }
  }
}
