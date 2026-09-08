import { AgeGroup, MistakeItem } from '../entities/MistakeReview';

export interface IMistakeRepository {
  getAllMistakes(): Promise<MistakeItem[]>;
  saveMistakes(mistakes: MistakeItem[]): Promise<void>;
  getAgeGroup(): Promise<AgeGroup | null>;
  saveAgeGroup(ageGroup: AgeGroup): Promise<void>;
  resetMistakes(): Promise<void>;
}
