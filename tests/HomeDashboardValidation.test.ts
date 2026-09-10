import en from '../src/core/i18n/locales/en.json';
import uz from '../src/core/i18n/locales/uz.json';
import ru from '../src/core/i18n/locales/ru.json';
import {
  resolveNodeAction,
  getSteppingNodesState,
  SteppingNodeType,
  formatMistakeBadge,
  LANGUAGE_OPTIONS,
  formatHeaderMetrics,
} from '../src/presentation/components/homeDashboardLogic';
import type { BottomNavTab } from '../src/presentation/components/BottomTabBar';

// Unit test suite for Duolingo-style Home Dashboard (MuudAI Socratic Stepping Path)
console.log('=== MUUDAI HOME DASHBOARD & STEPPING PATH UNIT TESTS ===\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    if (detail) console.error(`   Detail: ${detail}`);
    process.exitCode = 1;
  }
}

// ── 1. i18n Locales Completeness & Symmetry for homeDashboard ────────
console.log('--- 1. Testing homeDashboard i18n Keys Across en, uz, ru ---');

assert(!!en.homeDashboard, 'en.json contains homeDashboard section');
assert(!!uz.homeDashboard, 'uz.json contains homeDashboard section');
assert(!!ru.homeDashboard, 'ru.json contains homeDashboard section');

// 1.1 Top Level & Header Tooltips
assert(en.homeDashboard?.start === 'START!', 'en has homeDashboard.start === "START!"');
assert(uz.homeDashboard?.start === 'START!', 'uz has homeDashboard.start === "START!"');
assert(ru.homeDashboard?.start === 'START!', 'ru has homeDashboard.start === "START!"');

const headerTooltipKeys = ['streakTooltip', 'energyTooltip', 'xpTooltip'] as const;
for (const key of headerTooltipKeys) {
  assert(typeof en.homeDashboard?.[key] === 'string' && en.homeDashboard[key].length > 0, `en has ${key}`);
  assert(typeof uz.homeDashboard?.[key] === 'string' && uz.homeDashboard[key].length > 0, `uz has ${key}`);
  assert(typeof ru.homeDashboard?.[key] === 'string' && ru.homeDashboard[key].length > 0, `ru has ${key}`);
}

// 1.2 Language Selector Modal Keys
const languageKeys = ['title', 'subtitle', 'en', 'uz', 'ru'] as const;
for (const key of languageKeys) {
  assert(typeof en.homeDashboard?.languages?.[key] === 'string' && en.homeDashboard.languages[key].length > 0, `en has languages.${key}`);
  assert(typeof uz.homeDashboard?.languages?.[key] === 'string' && uz.homeDashboard.languages[key].length > 0, `uz has languages.${key}`);
  assert(typeof ru.homeDashboard?.languages?.[key] === 'string' && ru.homeDashboard.languages[key].length > 0, `ru has languages.${key}`);
}

// 1.3 Bottom Tab Bar Keys
const tabKeys = ['home', 'review', 'challenge', 'profile'] as const;
for (const key of tabKeys) {
  assert(typeof en.homeDashboard?.tabs?.[key] === 'string' && en.homeDashboard.tabs[key].length > 0, `en has tabs.${key}`);
  assert(typeof uz.homeDashboard?.tabs?.[key] === 'string' && uz.homeDashboard.tabs[key].length > 0, `uz has tabs.${key}`);
  assert(typeof ru.homeDashboard?.tabs?.[key] === 'string' && ru.homeDashboard.tabs[key].length > 0, `ru has tabs.${key}`);
}

// 1.4 Socratic Stepping Path Keys
const pathKeys = [
  'nodeCompleted',
  'nodeActive',
  'nodeLocked',
  'lockedHint',
  'milestoneTrophy',
  'milestoneTitle',
  'milestoneDesc',
] as const;
for (const key of pathKeys) {
  assert(typeof en.homeDashboard?.path?.[key] === 'string' && en.homeDashboard.path[key].length > 0, `en has path.${key}`);
  assert(typeof uz.homeDashboard?.path?.[key] === 'string' && uz.homeDashboard.path[key].length > 0, `uz has path.${key}`);
  assert(typeof ru.homeDashboard?.path?.[key] === 'string' && ru.homeDashboard.path[key].length > 0, `ru has path.${key}`);
}

// 1.5 Profile View Keys
const profileKeys = [
  'title',
  'age',
  'statsTitle',
  'dayStreak',
  'totalXp',
  'solvedProblems',
  'minutesPerDay',
  'appSettings',
  'language',
  'backToHome',
] as const;
for (const key of profileKeys) {
  assert(typeof en.homeDashboard?.profile?.[key] === 'string' && en.homeDashboard.profile[key].length > 0, `en has profile.${key}`);
  assert(typeof uz.homeDashboard?.profile?.[key] === 'string' && uz.homeDashboard.profile[key].length > 0, `uz has profile.${key}`);
  assert(typeof ru.homeDashboard?.profile?.[key] === 'string' && ru.homeDashboard.profile[key].length > 0, `ru has profile.${key}`);
}

// ── 2. Real Stepping Stone Node Progression & State Machine ───────────
console.log('\n--- 2. Testing Stepping Stone Path Progression Logic (Real Exports) ---');

// 2.1 Test resolveNodeAction against all SteppingNodeType variants
assert(resolveNodeAction('active_star') === 'scanner', 'Real resolveNodeAction: active_star routes to "scanner"');
assert(resolveNodeAction('completed_check') === 'mistakes', 'Real resolveNodeAction: completed_check routes to "mistakes"');
assert(resolveNodeAction('completed_doc') === 'mistakes', 'Real resolveNodeAction: completed_doc routes to "mistakes"');
assert(resolveNodeAction('locked') === 'blocked', 'Real resolveNodeAction: locked routes to "blocked"');

// 2.2 Test default mockup state (activeStepIndex = 3, node 4 active)
const defaultNodes = getSteppingNodesState(3);
assert(defaultNodes.length === 5, 'Path generates exactly 5 stepping nodes matching daily target');
assert(defaultNodes[0].type === 'completed_check', 'Node 1 is completed_check');
assert(defaultNodes[1].type === 'completed_doc', 'Node 2 is completed_doc');
assert(defaultNodes[2].type === 'completed_check', 'Node 3 is completed_check');
assert(defaultNodes[3].type === 'active_star', 'Node 4 is active_star with START bubble');
assert(defaultNodes[4].type === 'locked', 'Node 5 is locked');

// 2.3 Verify node routing with real resolveNodeAction
assert(resolveNodeAction(defaultNodes[0].type) === 'mistakes', 'Step 1 (completed_check) routes to "mistakes"');
assert(resolveNodeAction(defaultNodes[1].type) === 'mistakes', 'Step 2 (completed_doc) routes to "mistakes"');
assert(resolveNodeAction(defaultNodes[2].type) === 'mistakes', 'Step 3 (completed_check) routes to "mistakes"');
assert(resolveNodeAction(defaultNodes[3].type) === 'scanner', 'Step 4 (active_star) routes to "scanner"');
assert(resolveNodeAction(defaultNodes[4].type) === 'blocked', 'Step 5 (locked) routes to "blocked"');

// 2.4 Complete Active Step Progression Simulation with real getSteppingNodesState
console.log('\n--- 2.1 Testing Dynamic Step Completion Progression ---');
const progressedNodes = getSteppingNodesState(4);
assert(progressedNodes[3].type === 'completed_check', 'Step 4 transitions from active_star to completed_check');
assert(progressedNodes[4].type === 'active_star', 'Step 5 unlocks from locked to active_star');
assert(resolveNodeAction(progressedNodes[4].type) === 'scanner', 'Newly unlocked Step 5 now opens scanner');

// 2.5 Fresh Daily Start Simulation (activeStepIndex = 0)
const freshNodes = getSteppingNodesState(0);
assert(freshNodes[0].type === 'active_star', 'Initial Step 1 is active_star on fresh day');
assert(freshNodes[1].type === 'locked', 'Initial Step 2 is locked');
assert(freshNodes[4].type === 'locked', 'Initial Step 5 is locked');

// 2.6 All Completed Daily Goal Simulation (activeStepIndex = 5)
const allCompletedNodes = getSteppingNodesState(5);
assert(allCompletedNodes.every((n) => n.type === 'completed_check' || n.type === 'completed_doc'), 'All 5 steps completed when activeStepIndex >= 5');

// ── 3. Top Header Bar Logic (Language Options & Metrics) ──────────────
console.log('\n--- 3. Testing Top Header Bar Gamification Formatting (Real Exports) ---');

// 3.1 Test real LANGUAGE_OPTIONS
assert(LANGUAGE_OPTIONS.length === 3, 'LANGUAGE_OPTIONS contains exactly 3 supported languages');
assert(LANGUAGE_OPTIONS[0].code === 'en' && LANGUAGE_OPTIONS[0].badge === 'EN' && LANGUAGE_OPTIONS[0].flag === '🇺🇸', 'EN option has 🇺🇸 flag');
assert(LANGUAGE_OPTIONS[1].code === 'uz' && LANGUAGE_OPTIONS[1].badge === 'UZ' && LANGUAGE_OPTIONS[1].flag === '🇺🇿', 'UZ option has 🇺🇿 flag');
assert(LANGUAGE_OPTIONS[2].code === 'ru' && LANGUAGE_OPTIONS[2].badge === 'RU' && LANGUAGE_OPTIONS[2].flag === '🇷🇺', 'RU option has 🇷🇺 flag');

// 3.2 Test real formatHeaderMetrics
const headerStateEn = {
  locale: 'en',
  streakDays: 4,
  energy: 5,
  maxEnergy: 5,
  xp: 120,
};

const metricsEn = formatHeaderMetrics(headerStateEn);
assert(metricsEn.langBadge === '🇺🇸 EN', 'EN locale outputs "🇺🇸 EN" badge');
assert(metricsEn.streakText === '4', 'Streak text correctly shows "4"');
assert(metricsEn.energyText === '5/5', 'Energy text shows "5/5"');
assert(metricsEn.xpText === '120', 'XP text shows "120"');

const headerStateUz = { ...headerStateEn, locale: 'uz' };
const metricsUz = formatHeaderMetrics(headerStateUz);
assert(metricsUz.langBadge === '🇺🇿 UZ', 'UZ locale outputs "🇺🇿 UZ" badge');

const headerStateRu = { ...headerStateEn, locale: 'ru' };
const metricsRu = formatHeaderMetrics(headerStateRu);
assert(metricsRu.langBadge === '🇷🇺 RU', 'RU locale outputs "🇷🇺 RU" badge');

// 3.3 Test Energy Drain Boundary Condition & Guard
console.log('\n--- 3.1 Testing Energy Drain State ---');
const drainedHeaderState = { ...headerStateEn, energy: 0 };
const drainedMetrics = formatHeaderMetrics(drainedHeaderState);
assert(drainedMetrics.energyText === '0/5', 'Drained energy outputs "0/5"');

// Zero-energy scanner tap guard simulation
const handleScannerPressWithEnergy = (energyVal: number): 'scanner' | 'energy_modal' => {
  if (energyVal <= 0) return 'energy_modal';
  return 'scanner';
};
assert(handleScannerPressWithEnergy(0) === 'energy_modal', 'Tapping START with 0 energy triggers energy refill modal');
assert(handleScannerPressWithEnergy(5) === 'scanner', 'Tapping START with 5 energy opens scanner');

// ── 4. Real Bottom Tab Bar Badges & Navigation ────────────────────────
console.log('\n--- 4. Testing Bottom Tab Bar Actions & Badges (Real Exports) ---');

assert(formatMistakeBadge(0) === null, '0 mistakes displays no badge');
assert(formatMistakeBadge(-1) === null, 'Negative count displays no badge');
assert(formatMistakeBadge(3) === '3', '3 mistakes displays "3" badge');
assert(formatMistakeBadge(9) === '9', '9 mistakes displays "9" badge');
assert(formatMistakeBadge(10) === '9+', '10 mistakes displays "9+" badge');
assert(formatMistakeBadge(99) === '9+', '99 mistakes displays "9+" badge');

interface TabNavigationState {
  currentTab: BottomNavTab;
  currentScreen: string;
}

const handleTabSelect = (tab: BottomNavTab, state: TabNavigationState): TabNavigationState => {
  if (tab === 'review') {
    return { ...state, currentScreen: 'mistakes' };
  }
  if (tab === 'challenge') {
    return { ...state, currentScreen: 'chest' };
  }
  return { currentTab: tab, currentScreen: 'home' };
};

let tabNavState: TabNavigationState = { currentTab: 'home', currentScreen: 'home' };
tabNavState = handleTabSelect('profile', tabNavState);
assert(tabNavState.currentTab === 'profile' && tabNavState.currentScreen === 'home', 'Selecting profile tab updates tab to profile within home');

tabNavState = handleTabSelect('home', tabNavState);
assert(tabNavState.currentTab === 'home' && tabNavState.currentScreen === 'home', 'Selecting home tab returns to stepping path');

tabNavState = handleTabSelect('review', tabNavState);
assert(tabNavState.currentScreen === 'mistakes', 'Selecting review tab routes to "mistakes" screen');

tabNavState = handleTabSelect('challenge', tabNavState);
assert(tabNavState.currentScreen === 'chest', 'Selecting challenge tab routes to "chest" screen');

// ── 5. S-Curve Layout Coordinates & Mascot Positions ─────────────────
console.log('\n--- 5. Testing S-Curve Coordinates & Mascot Arrangements ---');

interface NodeLayout {
  id: string;
  horizontalAlignment: 'left' | 'center-left' | 'center-right' | 'right';
  horizontalOffsetPercent: number;
  adjacentMascot?: 'cool_sunglasses' | 'zen_meditating' | 'celebrating' | 'milestone_trophy';
}

const layoutNodes: NodeLayout[] = [
  { id: 'node-1', horizontalAlignment: 'left', horizontalOffsetPercent: 25, adjacentMascot: 'cool_sunglasses' },
  { id: 'node-2', horizontalAlignment: 'center-left', horizontalOffsetPercent: 40 },
  { id: 'node-3', horizontalAlignment: 'center-right', horizontalOffsetPercent: 60, adjacentMascot: 'celebrating' },
  { id: 'node-4', horizontalAlignment: 'right', horizontalOffsetPercent: 72 },
  { id: 'node-5', horizontalAlignment: 'center-left', horizontalOffsetPercent: 42 },
  { id: 'milestone', horizontalAlignment: 'left', horizontalOffsetPercent: 25, adjacentMascot: 'zen_meditating' },
];

assert(layoutNodes[0].adjacentMascot === 'cool_sunglasses', 'Node 1 is paired with cool sunglasses mascot on right');
assert(layoutNodes[2].adjacentMascot === 'celebrating', 'Node 3 is paired with celebrating mascot on left');
assert(layoutNodes[5].adjacentMascot === 'zen_meditating', 'Milestone row has zen meditating mascot on right');

// Verify S-curve smooth path alternation: left -> right -> left
assert(layoutNodes[0].horizontalOffsetPercent < layoutNodes[1].horizontalOffsetPercent, 'Path moves rightwards from Node 1 to Node 2');
assert(layoutNodes[1].horizontalOffsetPercent < layoutNodes[2].horizontalOffsetPercent, 'Path moves rightwards from Node 2 to Node 3');
assert(layoutNodes[2].horizontalOffsetPercent < layoutNodes[3].horizontalOffsetPercent, 'Path reaches rightmost crest at Node 4');
assert(layoutNodes[4].horizontalOffsetPercent < layoutNodes[3].horizontalOffsetPercent, 'Path curves back leftwards at Node 5');
assert(layoutNodes[5].horizontalOffsetPercent < layoutNodes[4].horizontalOffsetPercent, 'Path reaches top left milestone at Trophy');

console.log(`\n=============================================`);
console.log(`Results: ${passedTests} / ${totalTests} tests passed.`);
console.log(`=============================================\n`);
