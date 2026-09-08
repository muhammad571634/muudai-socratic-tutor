import { SubjectType } from './Gamification';
import { AgeGroup } from './MistakeReview';

export interface MysteryRiddle {
  id: string;
  ageGroup: AgeGroup;
  subject: SubjectType;
  title: string;
  mysteryStory: string;
  puzzleSnippet: string;
  clueText: string;
  xpReward: number;
  badgeReward: string;
  sourceMistakeId?: string;
}

export const DAILY_MYSTERY_RIDDLES: Record<AgeGroup, MysteryRiddle> = {
  junior: {
    id: 'chest_j1',
    ageGroup: 'junior',
    subject: 'math',
    title: 'The Fraction Vault',
    mysteryStory: 'A magical vault requires 1 whole pizza slice. You only have 2/4 and 1/4. How much more do you need?',
    puzzleSnippet: '1 - (2/4 + 1/4) = ?',
    clueText: 'Combine 2/4 and 1/4 first (which equals 3/4). One whole is 4/4!',
    xpReward: 100,
    badgeReward: 'Golden Pizza Explorer Badge',
  },
  middle: {
    id: 'chest_m1',
    ageGroup: 'middle',
    subject: 'math',
    title: 'The Balance of Signs',
    mysteryStory: 'The chest is locked with an ancient equation. Shift the negative term across the portal without breaking the spell!',
    puzzleSnippet: '4x - 12 = 20 → What is x?',
    clueText: 'Add 12 to both sides first: 4x = 32. Then divide by 4!',
    xpReward: 100,
    badgeReward: 'Master Alchemist Key',
  },
  teen: {
    id: 'chest_t1',
    ageGroup: 'teen',
    subject: 'physics',
    title: 'The Gravity Enigma',
    mysteryStory: 'A spaceship is landing on an asteroid. Calculate the braking force needed to land safely before fuel runs out!',
    puzzleSnippet: 'F = m × a (m = 1000 kg, deceleration a = 9.8 m/s²)',
    clueText: 'Multiply mass directly by deceleration: 1000 × 9.8 Newtons!',
    xpReward: 100,
    badgeReward: 'Cosmic Navigator Crest',
  },
};
