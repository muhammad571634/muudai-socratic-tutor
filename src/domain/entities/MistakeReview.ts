import { SubjectType } from './Gamification';

export type AgeGroup = 'junior' | 'middle' | 'teen';

export interface AgeGroupConfig {
  id: AgeGroup;
  label: string;
  ageRange: string;
  gradeText: string;
}

export const AGE_GROUP_CONFIGS: Record<AgeGroup, AgeGroupConfig> = {
  junior: {
    id: 'junior',
    label: 'Junior',
    ageRange: '8-10 yosh',
    gradeText: '3-4 sinf',
  },
  middle: {
    id: 'middle',
    label: 'Middle',
    ageRange: '11-13 yosh',
    gradeText: '5-7 sinf',
  },
  teen: {
    id: 'teen',
    label: 'High School',
    ageRange: '14-16 yosh',
    gradeText: '8-10 sinf',
  },
};

export interface MistakeItem {
  id: string;
  ageGroup: AgeGroup;
  subject: SubjectType;
  topicTitle: string;
  questionSnippet: string;
  hintSummary: string;
  xpReward: number;
  solved: boolean;
  createdAt: string;
}

// Har bir yosh guruhiga xos aniq darslik masalalari
export const CURRICULUM_MISTAKES: MistakeItem[] = [
  // 1. JUNIOR (8-10 yosh): Boshlang'ich maktab
  {
    id: 'j1',
    ageGroup: 'junior',
    subject: 'math',
    topicTitle: 'Fractions Basics',
    questionSnippet: '1/2 + 1/4 = ? (Added denominators instead of finding common)',
    hintSummary: 'Make the bottom numbers the same first! Turn 1/2 into 2/4.',
    xpReward: 25,
    solved: false,
    createdAt: 'Today, 2:15 PM',
  },
  {
    id: 'j2',
    ageGroup: 'junior',
    subject: 'physics',
    topicTitle: 'States of Matter',
    questionSnippet: 'Why does ice float on liquid water?',
    hintSummary: 'Ice is less dense than water because water molecules expand when freezing!',
    xpReward: 25,
    solved: false,
    createdAt: 'Yesterday',
  },
  {
    id: 'j3',
    ageGroup: 'junior',
    subject: 'chemistry',
    topicTitle: 'Solubility & Mixing',
    questionSnippet: 'Why does oil not dissolve in water?',
    hintSummary: 'Water molecules like polar things, while oil molecules are non-polar!',
    xpReward: 25,
    solved: false,
    createdAt: '2 days ago',
  },

  // 2. MIDDLE (11-13 yosh): O'rta maktab
  {
    id: 'm1',
    ageGroup: 'middle',
    subject: 'math',
    topicTitle: 'Linear Equations',
    questionSnippet: '3x - 7 = 14 (Negative sign flip error)',
    hintSummary: 'When moving -7 across the equal sign, it becomes +7! So 3x = 21.',
    xpReward: 30,
    solved: false,
    createdAt: 'Today, 4:30 PM',
  },
  {
    id: 'm2',
    ageGroup: 'middle',
    subject: 'physics',
    topicTitle: 'Speed & Velocity',
    questionSnippet: 'Speed = Distance / Time (Unit conversion mismatch: km/h to m/s)',
    hintSummary: 'Divide by 3.6 to convert km/h directly into m/s!',
    xpReward: 30,
    solved: false,
    createdAt: 'Today, 11:00 AM',
  },
  {
    id: 'm3',
    ageGroup: 'middle',
    subject: 'chemistry',
    topicTitle: 'Acids & Bases (pH scale)',
    questionSnippet: 'Is lemon juice (pH 2) an acid or base?',
    hintSummary: 'Anything with a pH less than 7 is an Acid. pH 7 is neutral water!',
    xpReward: 30,
    solved: false,
    createdAt: '3 days ago',
  },

  // 3. TEEN (14-16 yosh): Yuqori sinflar
  {
    id: 't1',
    ageGroup: 'teen',
    subject: 'math',
    topicTitle: 'Quadratic Factoring',
    questionSnippet: 'x² - 5x + 6 = 0 (Sign confusion in binomial factors)',
    hintSummary: 'Find two numbers that multiply to +6 and add to -5: (-2) and (-3)!',
    xpReward: 40,
    solved: false,
    createdAt: 'Today, 6:10 PM',
  },
  {
    id: 't2',
    ageGroup: 'teen',
    subject: 'physics',
    topicTitle: "Newton's 2nd Law",
    questionSnippet: 'F_net = m × a on a 30° inclined slope with friction',
    hintSummary: 'Break gravity into parallel (mg sin θ) and perpendicular (mg cos θ) vectors!',
    xpReward: 40,
    solved: false,
    createdAt: 'Yesterday',
  },
  {
    id: 't3',
    ageGroup: 'teen',
    subject: 'chemistry',
    topicTitle: 'Stoichiometry & Balancing',
    questionSnippet: '2Al + 3Cl₂ → 2AlCl₃ (Mole ratio calculation error)',
    hintSummary: 'Use molar ratios directly from the balanced coefficients: 2 moles Al per 3 moles Cl₂.',
    xpReward: 40,
    solved: false,
    createdAt: 'Yesterday',
  },
];
