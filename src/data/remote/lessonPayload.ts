import {
  formatEducationalMathText,
  separateProblemContent,
  ScanError,
} from '../../domain/entities/SocraticDialogue';
import { SubjectType } from '../../domain/entities/Gamification';
import {
  HintLevel,
  HintRung,
  LessonStep,
  MisconceptionTag,
  SocraticLesson,
  Tile,
  findLessonContractViolation,
  shuffleLesson,
} from '../../domain/entities/SocraticLesson';

/**
 * AI javobini `SocraticLesson` ga o'girish — Gemini va OpenAI uchun umumiy.
 *
 * Ikkala manba ham bir xil JSON shaklini so'raydi, shuning uchun o'girish va
 * tekshirish mantiqi bitta joyda turadi. Ilgari u ikki faylga nusxalangan edi
 * va tuzatish faqat bittasiga tushardi.
 */

export interface LessonHintPayload {
  level: number;
  action: string;
  message?: string;
}

export interface LessonDistractorPayload {
  label: string;
  misconceptionTag: string;
}

export interface LessonChoicePayload {
  label: string;
  isCorrect: boolean;
  misconceptionTag?: string;
}

export interface LessonStepPayload {
  stepNumber: number;
  format: string;
  question: string;
  /** STEP_BUILDER: to'g'ri plitkalar, TO'G'RI TARTIBDA. */
  correctTiles?: string[];
  /** STEP_BUILDER: chalg'ituvchilar, har biri xato yorlig'i bilan. */
  distractorTiles?: LessonDistractorPayload[];
  /** STEP_BUILDER: `MathValidator` uchun kutilayotgan ifoda. */
  expectedExpression?: string;
  /** MULTIPLE_CHOICE: uchta variant. */
  options?: LessonChoicePayload[];
  hintLadder?: LessonHintPayload[];
  xpReward?: number;
}

export interface LessonResponsePayload {
  /** Model rasmni o'qiy oldimi (`getSocraticJsonSchema` da majburiy). */
  isImageReadable?: boolean;
  unreadableReason?: string;
  equation?: string;
  problemTitle?: string;
  questionText?: string;
  steps?: LessonStepPayload[];
}

/**
 * Zina bosqichlarining tartibi — formatga qarab.
 *
 * `docs/PEDAGOGY.md` §3 va `docs/UI_ARCHITECTURE.md` §4.3.2 C. Tartib qat'iy:
 * har bosqich oldingisidan konkretroq, lekin hech biri javobni aytmaydi.
 */
export const HINT_ACTIONS_BY_FORMAT: Record<LessonStep['format'], readonly HintRung['action'][]> = {
  STEP_BUILDER: ['ENCOURAGE', 'REVEAL_SLOT_COUNT', 'PLACE_FIRST_TILE', 'NARROW_CHOICES', 'SKIP_STEP'],
  MULTIPLE_CHOICE: ['ENCOURAGE', 'EXPLAIN_WHY', 'SIMPLER_EXAMPLE', 'NARROW_CHOICES', 'SKIP_STEP'],
};

export const MISCONCEPTION_TAGS: readonly MisconceptionTag[] = [
  'distribution_error',
  'sign_error',
  'operation_order',
  'unit_error',
  'concept_gap',
  'careless',
];

function toMisconceptionTag(raw: string | undefined): MisconceptionTag {
  const match = MISCONCEPTION_TAGS.find((tag) => tag === raw);
  // Noma'lum yorliq kelsa, o'ylab topilgan aniq yorliq qo'yilmaydi:
  // `concept_gap` — "qoidani bilmaydi", eng umumiy va eng zararsiz holat.
  return match ?? 'concept_gap';
}

function toHintLadder(payload: LessonHintPayload[], format: LessonStep['format']): HintRung[] {
  return HINT_ACTIONS_BY_FORMAT[format].map((action, index) => {
    const level = (index + 1) as Exclude<HintLevel, 0>;
    const message = payload.find((rung) => rung.level === level)?.message?.trim();
    // Matn bo'sh bo'lsa — zaxira jumla YOZILMAYDI. `REVEAL_SLOT_COUNT` va
    // `NARROW_CHOICES` o'zini o'zi tushuntiradi, UI harakatni bajaradi.
    return { level, action, ...(message ? { message: formatEducationalMathText(message) } : {}) };
  });
}

function toLessonStep(payload: LessonStepPayload, index: number, totalSteps: number): LessonStep {
  const id = `step_${index + 1}_${Date.now()}`;
  const base = {
    id,
    stepNumber: payload.stepNumber || index + 1,
    totalSteps,
    question: formatEducationalMathText(payload.question ?? ''),
    xpReward: payload.xpReward && payload.xpReward > 0 ? payload.xpReward : 25,
  };

  if (payload.format === 'MULTIPLE_CHOICE') {
    const rawOptions = payload.options ?? [];
    return {
      ...base,
      format: 'MULTIPLE_CHOICE',
      options: rawOptions.map((option, optionIndex) => ({
        id: `${id}_opt_${optionIndex}`,
        label: formatEducationalMathText(option.label),
        ...(option.isCorrect ? {} : { misconceptionTag: toMisconceptionTag(option.misconceptionTag) }),
      })),
      correctOptionIndex: Math.max(0, rawOptions.findIndex((option) => option.isCorrect)),
      hintLadder: toHintLadder(payload.hintLadder ?? [], 'MULTIPLE_CHOICE'),
    };
  }

  const correctTiles: Tile[] = (payload.correctTiles ?? []).map((label, tileIndex) => ({
    id: `${id}_tile_${tileIndex}`,
    label: formatEducationalMathText(label),
    isDistractor: false,
  }));
  const distractorTiles: Tile[] = (payload.distractorTiles ?? []).map((distractor, tileIndex) => ({
    id: `${id}_dis_${tileIndex}`,
    label: formatEducationalMathText(distractor.label),
    isDistractor: true,
    misconceptionTag: toMisconceptionTag(distractor.misconceptionTag),
  }));

  return {
    ...base,
    format: 'STEP_BUILDER',
    slotCount: correctTiles.length,
    tiles: [...correctTiles, ...distractorTiles],
    expectedExpression: (payload.expectedExpression ?? '').trim(),
    hintLadder: toHintLadder(payload.hintLadder ?? [], 'STEP_BUILDER'),
  };
}

/**
 * AI javobini domen modeliga o'giradi va shartnomaga solishtiradi.
 *
 * ⚠️ Bu yerda ZAXIRA MAZMUN YO'Q. Ilgari model biror maydonni tushirib
 * qoldirsa, `session.fallback.*` kalitlaridan o'ylab topilgan qadam yasalardi
 * ("A varianti", "Qoidani eslaymiz") va bola o'zi so'ramagan mazmunni
 * o'rganardi. `AGENTS.md` 2-taqiq, `docs/PEDAGOGY.md` §2.5.
 *
 * Endi shartnomani buzgan dars bolaga ko'rsatilmaydi — xato rost aytiladi.
 */
export function toSocraticLesson(
  data: LessonResponsePayload,
  subject: SubjectType,
  source: string
): SocraticLesson {
  const rawSteps = data.steps ?? [];
  const steps = rawSteps.map((step, index) => toLessonStep(step, index, rawSteps.length));

  const { instruction, equation } = separateProblemContent(data.equation, data.questionText);

  const lesson: SocraticLesson = {
    id: `lesson_${Date.now()}`,
    subject,
    problemText: instruction || formatEducationalMathText(data.problemTitle ?? ''),
    equation,
    steps,
    scaffold: 'full',
    totalXpReward: steps.reduce((total, step) => total + step.xpReward, 0),
  };

  if (!lesson.equation.trim() && !lesson.problemText.trim()) {
    console.warn(`[${source}] lesson rejected: no problem text and no equation`);
    throw new ScanError('not_a_problem', 'errors.imageUnreadable');
  }

  const violation = findLessonContractViolation(lesson);
  if (violation) {
    console.warn(`[${source}] lesson rejected: ${violation}`);
    throw new ScanError('unknown', 'errors.malformedResponse');
  }

  return shuffleLesson(lesson);
}
