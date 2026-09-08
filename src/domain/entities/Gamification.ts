export type SubjectType = 'math' | 'physics' | 'chemistry';

export interface SubjectItem {
  id: SubjectType;
  title: string;
  subtitle: string;
  vectorIcon: string;
  accentColor: string;
  progressPercent: number;
  statsText: string;
}

export const SUBJECT_ITEMS: SubjectItem[] = [
  {
    id: 'math',
    title: 'Matematika',
    subtitle: 'Sonlar, kasrlar va mantiq',
    vectorIcon: 'calculator-outline',
    accentColor: '#16A34A',
    progressPercent: 35,
    statsText: '12 ta yechildi',
  },
  {
    id: 'physics',
    title: 'Fizika',
    subtitle: 'Kuchlar, harakat va energiya',
    vectorIcon: 'planet-outline',
    accentColor: '#6366F1',
    progressPercent: 20,
    statsText: '8 ta yechildi',
  },
  {
    id: 'chemistry',
    title: 'Kimyo',
    subtitle: 'Molekulyar reaksiyalar va moddalar',
    vectorIcon: 'flask-outline',
    accentColor: '#0284C7',
    progressPercent: 15,
    statsText: '5 ta yechildi',
  },
];

export interface LearnerRank {
  level: number;
  title: string;
  minXp: number;
  minProblemsSolved: number;
  minActiveDays: number;
  unlockedFeatureTitle: string;
  unlockedFeatureBadge: string;
  iconName: string;
  description: string;
}

export const LEARNER_RANKS: LearnerRank[] = [
  {
    level: 1,
    title: 'Curious Mind',
    minXp: 0,
    minProblemsSolved: 0,
    minActiveDays: 0,
    unlockedFeatureTitle: 'Guided Socratic Scanner',
    unlockedFeatureBadge: 'Vision Scanner',
    iconName: 'scan-outline',
    description: 'Developing foundational inquiry and disciplined problem-solving.',
  },
  {
    level: 2,
    title: 'Explorer',
    minXp: 200,
    minProblemsSolved: 15,
    minActiveDays: 3,
    unlockedFeatureTitle: 'Golden Mystery Chest',
    unlockedFeatureBadge: 'Inquiry Vault',
    iconName: 'cube-outline',
    description: 'Formulating independent hypotheses and multi-step deduction.',
  },
  {
    level: 3,
    title: 'Young Scientist',
    minXp: 500,
    minProblemsSolved: 35,
    minActiveDays: 7,
    unlockedFeatureTitle: 'Virtual Science Lab',
    unlockedFeatureBadge: 'Virtual Lab',
    iconName: 'flask-outline',
    description: 'Testing principles through empirical simulation and validation.',
  },
  {
    level: 4,
    title: 'Master Scholar',
    minXp: 1000,
    minProblemsSolved: 70,
    minActiveDays: 14,
    unlockedFeatureTitle: "Parents' Honor Certificate",
    unlockedFeatureBadge: 'Honors Diploma',
    iconName: 'school-outline',
    description: 'Synthesizing knowledge and mastering Socratic pedagogy.',
  },
];

export interface RankProgress {
  currentRank: LearnerRank;
  nextRank: LearnerRank | null;
  currentXp: number;
  currentProblemsSolved: number;
  currentActiveDays: number;
  currentLevelMinXp: number;
  nextLevelXp: number;
  nextLevelProblems: number;
  nextLevelDays: number;
  xpNeededForNextRank: number;
  problemsNeededForNextRank: number;
  daysNeededForNextRank: number;
  progressRatio: number;
  isReadyToLevelUp: boolean;
}

export interface StreakDayInfo {
  dayName: string;
  fullDayName: string;
  completed: boolean;
  isToday: boolean;
}

export const calculateRank = (
  xp: number,
  solvedProblems: number = 0,
  activeDays: number = 0
): LearnerRank => {
  for (let i = LEARNER_RANKS.length - 1; i >= 0; i--) {
    const rank = LEARNER_RANKS[i];
    if (
      xp >= rank.minXp &&
      solvedProblems >= rank.minProblemsSolved &&
      activeDays >= rank.minActiveDays
    ) {
      return rank;
    }
  }
  return LEARNER_RANKS[0];
};

export const calculateRankProgress = (
  xp: number,
  solvedProblems: number = 0,
  activeDays: number = 0
): RankProgress => {
  const currentRank = calculateRank(xp, solvedProblems, activeDays);
  const currentIndex = LEARNER_RANKS.findIndex((r) => r.level === currentRank.level);
  const nextRank = currentIndex < LEARNER_RANKS.length - 1 ? LEARNER_RANKS[currentIndex + 1] : null;

  const currentLevelMinXp = currentRank.minXp;
  const nextLevelXp = nextRank ? nextRank.minXp : currentLevelMinXp + 500;
  const nextLevelProblems = nextRank ? nextRank.minProblemsSolved : currentRank.minProblemsSolved;
  const nextLevelDays = nextRank ? nextRank.minActiveDays : currentRank.minActiveDays;

  const xpNeededForNextRank = Math.max(0, nextLevelXp - xp);
  const problemsNeededForNextRank = Math.max(0, nextLevelProblems - solvedProblems);
  const daysNeededForNextRank = Math.max(0, nextLevelDays - activeDays);

  const xpRatio = nextRank
    ? Math.min(1, Math.max(0, (xp - currentLevelMinXp) / Math.max(1, nextLevelXp - currentLevelMinXp)))
    : 1;

  const problemsRatio = nextRank
    ? Math.min(
        1,
        Math.max(
          0,
          (solvedProblems - currentRank.minProblemsSolved) /
            Math.max(1, nextLevelProblems - currentRank.minProblemsSolved)
        )
      )
    : 1;

  const daysRatio = nextRank
    ? Math.min(
        1,
        Math.max(
          0,
          (activeDays - currentRank.minActiveDays) /
            Math.max(1, nextLevelDays - currentRank.minActiveDays)
        )
      )
    : 1;

  const progressRatio = nextRank ? xpRatio * 0.4 + problemsRatio * 0.4 + daysRatio * 0.2 : 1;

  const isReadyToLevelUp =
    nextRank !== null &&
    xpNeededForNextRank === 0 &&
    problemsNeededForNextRank === 0 &&
    daysNeededForNextRank === 0;

  return {
    currentRank,
    nextRank,
    currentXp: xp,
    currentProblemsSolved: solvedProblems,
    currentActiveDays: activeDays,
    currentLevelMinXp,
    nextLevelXp,
    nextLevelProblems,
    nextLevelDays,
    xpNeededForNextRank,
    problemsNeededForNextRank,
    daysNeededForNextRank,
    progressRatio,
    isReadyToLevelUp,
  };
};

export const getWeeklyStreakStatus = (streakDays: number, isClaimedToday: boolean): StreakDayInfo[] => {
  const days: { short: string; full: string }[] = [
    { short: 'M', full: 'Mon' },
    { short: 'T', full: 'Tue' },
    { short: 'W', full: 'Wed' },
    { short: 'T', full: 'Thu' },
    { short: 'F', full: 'Fri' },
    { short: 'S', full: 'Sat' },
    { short: 'S', full: 'Sun' },
  ];

  const todayIndex = 4; // Friday (sample active day)
  return days.map((day, idx) => {
    const isToday = idx === todayIndex;
    let completed = false;
    if (idx < todayIndex) {
      completed = idx >= Math.max(0, todayIndex - streakDays + (isClaimedToday ? 1 : 0));
    } else if (isToday) {
      completed = isClaimedToday;
    }
    return {
      dayName: day.short,
      fullDayName: day.full,
      completed,
      isToday,
    };
  });
};

