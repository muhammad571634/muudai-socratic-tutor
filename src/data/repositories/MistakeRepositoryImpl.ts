import { AgeGroup, MistakeItem } from '../../domain/entities/MistakeReview';
import { IMistakeRepository } from '../../domain/repositories/IMistakeRepository';
import { AsyncStorageService } from '../local/storage/AsyncStorageService';

export class MistakeRepositoryImpl implements IMistakeRepository {
  private static readonly MISTAKES_KEY = 'mistakes_notebook';
  private static readonly AGE_GROUP_KEY = 'user_age_group';

  async getAllMistakes(): Promise<MistakeItem[]> {
    try {
      const data = await AsyncStorageService.getItem<MistakeItem[]>(
        MistakeRepositoryImpl.MISTAKES_KEY
      );
      return data || [];
    } catch (error) {
      console.error('[MistakeRepositoryImpl] Failed to load mistakes', error);
      return [];
    }
  }

  async saveMistakes(mistakes: MistakeItem[]): Promise<void> {
    try {
      await AsyncStorageService.setItem(MistakeRepositoryImpl.MISTAKES_KEY, mistakes);
    } catch (error) {
      console.error('[MistakeRepositoryImpl] Failed to save mistakes', error);
      throw error;
    }
  }

  async getAgeGroup(): Promise<AgeGroup | null> {
    try {
      return await AsyncStorageService.getItem<AgeGroup>(
        MistakeRepositoryImpl.AGE_GROUP_KEY
      );
    } catch (error) {
      console.error('[MistakeRepositoryImpl] Failed to load age group', error);
      return null;
    }
  }

  async saveAgeGroup(ageGroup: AgeGroup): Promise<void> {
    try {
      await AsyncStorageService.setItem(MistakeRepositoryImpl.AGE_GROUP_KEY, ageGroup);
    } catch (error) {
      console.error('[MistakeRepositoryImpl] Failed to save age group', error);
      throw error;
    }
  }

  async resetMistakes(): Promise<void> {
    try {
      await AsyncStorageService.removeItem(MistakeRepositoryImpl.MISTAKES_KEY);
    } catch (error) {
      console.error('[MistakeRepositoryImpl] Failed to reset mistakes', error);
    }
  }
}
