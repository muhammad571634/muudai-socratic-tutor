import { SubjectType } from './Gamification';

export type ScanErrorType = 'network' | 'blurry' | 'not_a_problem' | 'unknown';
/**
 * Bolaga ko'rsatiladigan skanerlash xatosi.
 *
 * Xabar matni emas, **i18n kaliti** saqlanadi. Sabab: xato domain va data
 * qatlamida tug'iladi, ular esa hech qanday tilni bilmasligi kerak. Matnga
 * aylantirish UI chegarasida bo'ladi — `resolveScanErrorMessage()`
 * (`src/core/i18n`).
 */
export class ScanError extends Error {
  constructor(
    public type: ScanErrorType,
    public messageKey: string,
    public messageParams?: Record<string, string | number>
  ) {
    super(messageKey);
    this.name = 'ScanError';
  }
}
export interface SocraticStep {
  id: string;
  stepNumber: number;
  totalSteps: number;
  stepTitle: string;
  questionHeadline?: string;
  tutorExplanation?: string; // AI Tutorning chuqur, qadam-ba-qadam tushuntirishi (3-5 jumla)
  tutorQuestion: string;
  explanationSnippet: string;
  quickOptions: string[];
  optionSubtitles?: string[];
  correctOptionIndex: number;
  hintText: string;
  xpReward: number;
}

export interface SocraticProblemSession {
  id: string;
  subject: SubjectType;
  problemTitle: string;
  questionText?: string;
  equation: string;
  steps: SocraticStep[];
  finalAnswer: string;
  totalXpReward: number;
}

/**
 * Progressive Socratic Dialogue Session (Algebraic Linear Equation with Parentheses)
 */
/**
 * DIQQAT — bu yerda demo/namuna dars TURMAYDI.
 *
 * Ilgari shu joyda uchta o'ylab topilgan sessiya bor edi
 * (DEMO_SOCRATIC_SESSION, DEMO_PHYSICS_SESSION, DEMO_CHEMISTRY_SESSION) va ular
 * `App.tsx` hamda `SocraticScannerScreen` da zaxira sifatida ekranga chiqardi:
 * bola hech narsa skanerlamasdan turib "5x - 20 = 2x + 12" masalasini ko'rar,
 * uni yechar va XP olardi. Ya'ni ilova bolaga u so'ramagan masalani, o'zi
 * tekshirmagan matematika bilan o'rgatardi.
 *
 * Bu `AGENTS.md` ning 2-taqig'i va `docs/PEDAGOGY.md` §2.5 ga zid. TASKS.md
 * ko'rsatishicha, soxta dars uch marta qaytib kelgan (T0.3, T0.11, va shu).
 * Shuning uchun u endi "o'chirilgan" emas — **umuman mavjud emas**. Zaxira
 * ma'lumot yo'q bo'lsa, uni tasodifan ekranga chiqarib bo'lmaydi.
 *
 * Masala faqat bitta yo'l bilan paydo bo'ladi: bola rasm oladi va AI uni
 * haqiqatan tahlil qiladi. Sessiya bo'lmasa — ekran kamerada qoladi.
 */

export function formatEducationalMathText(text: string): string {
  if (!text) return '';
  let result = text;

  // 0. Strip LaTeX dollar markers ($ or $$) and convert common LaTeX symbols to Unicode
  result = result
    .replace(/\\times/g, '×')
    .replace(/\\div/g, ':')
    .replace(/\\cdot/g, '·')
    .replace(/\\approx/g, '≈')
    .replace(/\\le(q)?/g, '≤')
    .replace(/\\ge(q)?/g, '≥')
    .replace(/\\ne(q)?/g, '≠')
    .replace(/\$\$?/g, '');

  // 1. Replace division slash between numbers: e.g. "9288 / 8" -> "9288 : 8"
  result = result.replace(/(\d+)\s*\/\s*(\d+)/g, '$1 : $2');

  // 2. Replace multiplication asterisk between numbers: e.g. "12 * 8" -> "12 × 8"
  result = result.replace(/(\d+)\s*\*\s*(\d+)/g, '$1 × $2');

  // 3. Format 4+ digit numbers with dot thousand separator (1161 -> 1.161, 9288 -> 9.288)
  // Lookbehind (?<![\d.,]) ensures we don't match parts of existing formatted numbers or decimals
  // Lookahead (?!\.\d) ensures we don't re-match numbers already formatted or decimal parts
  result = result.replace(/(?<![\d.,])\b(\d{4,})\b(?!\.\d)/g, (match) => {
    return match.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  });

  return result;
}

/**
 * Randomizes options for a Socratic step, formats math numbers/symbols according to pedagogical standards,
 * and recalculates correctOptionIndex so the correct answer is evenly distributed across A, B, and C.
 */
export function shuffleSocraticStep(step: SocraticStep): SocraticStep {
  if (!step.quickOptions || step.quickOptions.length <= 1) {
    return {
      ...step,
      stepTitle: formatEducationalMathText(step.stepTitle),
      tutorQuestion: formatEducationalMathText(step.tutorQuestion),
      hintText: formatEducationalMathText(step.hintText),
      quickOptions: (step.quickOptions || []).map((o) => formatEducationalMathText(o)),
    };
  }

  const rawCorrectIndex =
    typeof step.correctOptionIndex === 'number' &&
    step.correctOptionIndex >= 0 &&
    step.correctOptionIndex < step.quickOptions.length
      ? step.correctOptionIndex
      : 0;

  const pairs = step.quickOptions.map((opt, i) => ({
    text: formatEducationalMathText(opt),
    subtitle: step.optionSubtitles?.[i] ? formatEducationalMathText(step.optionSubtitles[i]) : undefined,
    isCorrect: i === rawCorrectIndex,
  }));

  // Fisher-Yates random shuffle
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }

  const newCorrectIndex = pairs.findIndex((p) => p.isCorrect);

  return {
    ...step,
    stepTitle: formatEducationalMathText(step.stepTitle),
    questionHeadline: step.questionHeadline ? formatEducationalMathText(step.questionHeadline) : undefined,
    tutorExplanation: step.tutorExplanation ? formatEducationalMathText(step.tutorExplanation) : undefined,
    tutorQuestion: formatEducationalMathText(step.tutorQuestion),
    explanationSnippet: formatEducationalMathText(step.explanationSnippet || ''),
    hintText: formatEducationalMathText(step.hintText),
    quickOptions: pairs.map((p) => p.text),
    optionSubtitles: step.optionSubtitles ? pairs.map((p) => p.subtitle || '') : undefined,
    correctOptionIndex: newCorrectIndex >= 0 ? newCorrectIndex : 0,
  };
}

/**
 * Intelligently and universally separates full problem content into an instruction/question prompt
 * and a standalone mathematical formula or number sequence.
 * 
 * Works universally across:
 * - Math sequences: "Tushirib qoldirilgan sonlarni yozing: 10, 20, 30, _, 50..."
 * - Algebraic equations: "Tenglamani yeching: 5x - 20 = 2x + 12"
 * - Story word problems (Matnli masalalar)
 * - Physics / Chemistry problems with given conditions
 */
export function separateProblemContent(
  rawEquation?: string,
  explicitQuestionText?: string
): { instruction?: string; equation: string } {
  if (explicitQuestionText && explicitQuestionText.trim().length > 0) {
    return {
      instruction: formatEducationalMathText(explicitQuestionText.trim()),
      equation: formatEducationalMathText(rawEquation?.trim() || ''),
    };
  }

  if (!rawEquation) {
    return { equation: '' };
  }

  const trimmed = rawEquation.trim();

  // 1. If contains newline separating instruction and equation
  if (trimmed.includes('\n')) {
    const lines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length > 1) {
      return {
        instruction: formatEducationalMathText(lines[0]),
        equation: formatEducationalMathText(lines.slice(1).join(' ')),
      };
    }
  }

  // 2. If contains colon separating introductory sentence from math expression
  // e.g., "Tushirib qoldirilgan sonlarni yozing: 10, 20, 30..."
  const colonMatch = trimmed.match(/^([^:=]+:)\s*(.+)$/);
  if (colonMatch && /[a-zA-Zа-яА-Яo'g'shch]{3,}/i.test(colonMatch[1])) {
    return {
      instruction: formatEducationalMathText(colonMatch[1].trim()),
      equation: formatEducationalMathText(colonMatch[2].trim()),
    };
  }

  // 3. If string starts with words followed by formula/numbers
  const wordPrefixMatch = trimmed.match(/^([a-zA-Zа-яА-Яo'g'shch\s]{6,}\b)\s*([0-9xXyYzZaAbBcCdDeEfF+\-*/:=_÷×·]{3,}.*)$/i);
  if (wordPrefixMatch && !wordPrefixMatch[1].includes('=')) {
    return {
      instruction: formatEducationalMathText(wordPrefixMatch[1].trim() + ':'),
      equation: formatEducationalMathText(wordPrefixMatch[2].trim()),
    };
  }

  return { equation: formatEducationalMathText(trimmed) };
}

/**
 * Shuffles all steps in a Socratic problem session and formats all math text.
 */
export function shuffleProblemSession(session: SocraticProblemSession): SocraticProblemSession {
  return {
    ...session,
    equation: formatEducationalMathText(session.equation),
    problemTitle: formatEducationalMathText(session.problemTitle),
    questionText: session.questionText ? formatEducationalMathText(session.questionText) : undefined,
    finalAnswer: formatEducationalMathText(session.finalAnswer),
    steps: session.steps.map((step) => shuffleSocraticStep(step)),
  };
}
