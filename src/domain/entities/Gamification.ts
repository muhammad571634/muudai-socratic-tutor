export type SubjectType = 'math' | 'physics' | 'chemistry';

export interface SubjectItem {
  id: SubjectType;
  /** i18n kaliti. Matn UI qatlamida `t(titleKey)` bilan olinadi. */
  titleKey: string;
  /** i18n kaliti. */
  subtitleKey: string;
  vectorIcon: string;
  accentColor: string;
}

export const SUBJECT_ITEMS: SubjectItem[] = [
  {
    id: 'math',
    titleKey: 'subjects.math.title',
    subtitleKey: 'subjects.math.subtitle',
    vectorIcon: 'calculator-outline',
    accentColor: '#16A34A',
  },
  {
    id: 'physics',
    titleKey: 'subjects.physics.title',
    subtitleKey: 'subjects.physics.subtitle',
    vectorIcon: 'planet-outline',
    accentColor: '#6366F1',
  },
  {
    id: 'chemistry',
    titleKey: 'subjects.chemistry.title',
    subtitleKey: 'subjects.chemistry.subtitle',
    vectorIcon: 'flask-outline',
    accentColor: '#0284C7',
  },
];

export interface LearnerRank {
  level: number;
  /** i18n kalitlari — matn UI qatlamida `t(...)` bilan olinadi. */
  titleKey: string;
  minXp: number;
  minProblemsSolved: number;
  minActiveDays: number;
  unlockedFeatureTitleKey: string;
  unlockedFeatureBadgeKey: string;
  iconName: string;
  descriptionKey: string;
}

export const LEARNER_RANKS: LearnerRank[] = [
  {
    level: 1,
    titleKey: 'ranks.level1.title',
    minXp: 0,
    minProblemsSolved: 0,
    minActiveDays: 0,
    unlockedFeatureTitleKey: 'ranks.level1.unlockedFeatureTitle',
    unlockedFeatureBadgeKey: 'ranks.level1.unlockedFeatureBadge',
    iconName: 'scan-outline',
    descriptionKey: 'ranks.level1.description',
  },
  {
    level: 2,
    titleKey: 'ranks.level2.title',
    minXp: 200,
    minProblemsSolved: 15,
    minActiveDays: 3,
    unlockedFeatureTitleKey: 'ranks.level2.unlockedFeatureTitle',
    unlockedFeatureBadgeKey: 'ranks.level2.unlockedFeatureBadge',
    iconName: 'cube-outline',
    descriptionKey: 'ranks.level2.description',
  },
  {
    level: 3,
    titleKey: 'ranks.level3.title',
    minXp: 500,
    minProblemsSolved: 35,
    minActiveDays: 7,
    unlockedFeatureTitleKey: 'ranks.level3.unlockedFeatureTitle',
    unlockedFeatureBadgeKey: 'ranks.level3.unlockedFeatureBadge',
    iconName: 'flask-outline',
    descriptionKey: 'ranks.level3.description',
  },
  {
    level: 4,
    titleKey: 'ranks.level4.title',
    minXp: 1000,
    minProblemsSolved: 70,
    minActiveDays: 14,
    unlockedFeatureTitleKey: 'ranks.level4.unlockedFeatureTitle',
    unlockedFeatureBadgeKey: 'ranks.level4.unlockedFeatureBadge',
    iconName: 'school-outline',
    descriptionKey: 'ranks.level4.description',
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
  /** 0 = dushanba ... 6 = yakshanba */
  weekdayIndex: number;
  /** i18n kalitlari — 'M', 'D' kabi qisqa va to'liq kun nomlari uchun. */
  shortNameKey: string;
  longNameKey: string;
  completed: boolean;
  isToday: boolean;
}

/** Dushanbadan boshlanadigan hafta (ISO-8601). */
const WEEKDAY_IDS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

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

export const getWeeklyStreakStatus = (
  streakDays: number,
  isClaimedToday: boolean,
  now: Date = new Date()
): StreakDayInfo[] => {
  // JS `getDay()` yakshanbadan boshlanadi (0=Yak). Interfeys dushanbadan
  // boshlanadigan haftani ko'rsatadi, shuning uchun surib qo'yamiz.
  // Ilgari bu yerda `todayIndex = 4` qattiq yozilgan edi — hafta qaysi kun
  // bo'lishidan qat'i nazar "bugun" doim juma bo'lib ko'rinardi.
  const todayIndex = (now.getDay() + 6) % 7;

  return WEEKDAY_IDS.map((dayId, idx) => {
    const isToday = idx === todayIndex;
    let completed = false;
    if (idx < todayIndex) {
      completed = idx >= Math.max(0, todayIndex - streakDays + (isClaimedToday ? 1 : 0));
    } else if (isToday) {
      completed = isClaimedToday;
    }
    return {
      weekdayIndex: idx,
      shortNameKey: `weekday.short.${dayId}`,
      longNameKey: `weekday.long.${dayId}`,
      completed,
      isToday,
    };
  });
};
