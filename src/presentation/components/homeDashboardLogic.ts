// O'ylanish: Ushbu fayl Home Dashboard va Sokratik Yo'l uchun toza taqdimot
// mantiqini (presentation logic) saqlaydi. Clean Architecture qoidalariga binoan,
// UI komponentlari va testlar yagona haqiqat manbaidan (single source of truth)
// foydalanadi va React Native bog'liqliklaridan xoli bo'ladi.

import { AppLocale } from '../../domain/entities/Locale';

export type SteppingNodeType = 'completed_check' | 'completed_doc' | 'active_star' | 'locked';

export interface SteppingNodeData {
  id: string;
  type: SteppingNodeType;
  title: string;
  horizontalOffsetPercent: number; // 0 (chap) dan 100 (o'ng) gacha
}

export function resolveNodeAction(type: SteppingNodeType): 'scanner' | 'mistakes' | 'blocked' {
  if (type === 'active_star') return 'scanner';
  if (type === 'completed_check' || type === 'completed_doc') return 'mistakes';
  return 'blocked';
}

export function getSteppingNodesState(activeStepIndex: number = 3): SteppingNodeData[] {
  const baseNodes: {
    id: string;
    defaultCompletedType: SteppingNodeType;
    title: string;
    horizontalOffsetPercent: number;
  }[] = [
    { id: 'node-1', defaultCompletedType: 'completed_check', title: 'Problem 1', horizontalOffsetPercent: 25 },
    { id: 'node-2', defaultCompletedType: 'completed_doc', title: 'Problem 2', horizontalOffsetPercent: 40 },
    { id: 'node-3', defaultCompletedType: 'completed_check', title: 'Problem 3', horizontalOffsetPercent: 60 },
    { id: 'node-4', defaultCompletedType: 'completed_check', title: 'Problem 4', horizontalOffsetPercent: 72 },
    { id: 'node-5', defaultCompletedType: 'completed_doc', title: 'Problem 5', horizontalOffsetPercent: 42 },
  ];

  return baseNodes.map((node, index) => {
    let type: SteppingNodeType;
    if (index < activeStepIndex) {
      type = node.defaultCompletedType;
    } else if (index === activeStepIndex) {
      type = 'active_star';
    } else {
      type = 'locked';
    }

    return {
      id: node.id,
      type,
      title: node.title,
      horizontalOffsetPercent: node.horizontalOffsetPercent,
    };
  });
}

export function formatMistakeBadge(count: number): string | null {
  if (count <= 0) return null;
  if (count > 9) return '9+';
  return String(count);
}

export interface LanguageOption {
  code: AppLocale;
  label: string;
  flag: string;
  badge: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', label: 'English', flag: '🇺🇸', badge: 'EN' },
  { code: 'uz', label: "O'zbekcha", flag: '🇺🇿', badge: 'UZ' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺', badge: 'RU' },
];

export type DashboardSubjectId = 'math' | 'physics' | 'chemistry' | 'biology' | 'english';

export interface SubjectOption {
  id: DashboardSubjectId;
  titleKey: string;
  defaultTitle: string;
  subtitleKey: string;
  defaultSubtitle: string;
  icon: string;
  shortBadge: string;
  isUnlocked: boolean;
  accentColor: string;
  badgeText?: string;
}

export const SUBJECT_OPTIONS: SubjectOption[] = [
  {
    id: 'math',
    titleKey: 'homeDashboard.subjects.math',
    defaultTitle: 'Mathematics',
    subtitleKey: 'homeDashboard.subjects.mathDesc',
    defaultSubtitle: 'Arithmetic, algebra, geometry & problem solving',
    icon: '📐',
    shortBadge: 'Math',
    isUnlocked: true,
    accentColor: '#6C47FF',
    badgeText: 'Active',
  },
  {
    id: 'physics',
    titleKey: 'homeDashboard.subjects.physics',
    defaultTitle: 'Physics',
    subtitleKey: 'homeDashboard.subjects.physicsDesc',
    defaultSubtitle: 'Mechanics, forces, energy & optics',
    icon: '⚡',
    shortBadge: 'Phys',
    isUnlocked: false,
    accentColor: '#3B82F6',
    badgeText: 'Coming Soon',
  },
  {
    id: 'chemistry',
    titleKey: 'homeDashboard.subjects.chemistry',
    defaultTitle: 'Chemistry',
    subtitleKey: 'homeDashboard.subjects.chemistryDesc',
    defaultSubtitle: 'Matter, elements, reactions & formulas',
    icon: '🧪',
    shortBadge: 'Chem',
    isUnlocked: false,
    accentColor: '#06B6D4',
    badgeText: 'Coming Soon',
  },
  {
    id: 'biology',
    titleKey: 'homeDashboard.subjects.biology',
    defaultTitle: 'Biology',
    subtitleKey: 'homeDashboard.subjects.biologyDesc',
    defaultSubtitle: 'Cells, genetics, anatomy & ecology',
    icon: '🧬',
    shortBadge: 'Bio',
    isUnlocked: false,
    accentColor: '#10B981',
    badgeText: 'Coming Soon',
  },
  {
    id: 'english',
    titleKey: 'homeDashboard.subjects.english',
    defaultTitle: 'English Language',
    subtitleKey: 'homeDashboard.subjects.englishDesc',
    defaultSubtitle: 'Grammar, vocabulary, reading & conversation',
    icon: '🇺🇸',
    shortBadge: 'EN',
    isUnlocked: false,
    accentColor: '#F59E0B',
    badgeText: 'Coming Soon',
  },
];

export function isSubjectSelectable(id: DashboardSubjectId): boolean {
  const subject = SUBJECT_OPTIONS.find((s) => s.id === id);
  return subject ? subject.isUnlocked : false;
}

export function getSubjectOptionById(id?: string): SubjectOption {
  const found = SUBJECT_OPTIONS.find((s) => s.id === id);
  return found || SUBJECT_OPTIONS[0];
}

export function formatHeaderMetrics(state: {
  locale: string;
  streakDays: number;
  energy: number;
  maxEnergy: number;
  xp: number;
  gems?: number;
  selectedSubject?: string;
}) {
  const flags: Record<string, { flag: string; badge: string }> = {
    en: { flag: '🇺🇸', badge: 'EN' },
    uz: { flag: '🇺🇿', badge: 'UZ' },
    ru: { flag: '🇷🇺', badge: 'RU' },
  };

  const activeFlag = flags[state.locale] || flags.en;
  const activeSubject = state.selectedSubject
    ? SUBJECT_OPTIONS.find((s) => s.id === state.selectedSubject)
    : undefined;
  const subjectBadge = activeSubject
    ? `${activeSubject.icon} ${activeSubject.shortBadge}`
    : `${activeFlag.flag} ${activeFlag.badge}`;

  return {
    langBadge: `${activeFlag.flag} ${activeFlag.badge}`,
    subjectBadge,
    streakText: `${state.streakDays}`,
    energyText: `${state.energy}/${state.maxEnergy}`,
    xpText: `${state.xp}`,
    gemsText: `${state.gems ?? 957}`,
  };
}
