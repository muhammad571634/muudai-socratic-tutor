import {
  HintLevel,
  LessonStep,
  StepAttempt,
  StepResult,
  nextHint,
  readMisconception,
} from '../entities/SocraticLesson';
import { MathValidator } from './MathValidator';

/**
 * Bolaning javobini baholaydi — **AI chaqirmasdan**.
 *
 * Bu T0.20 qarorining amaliy natijasi. Ilgari har bir javob serverga borib,
 * AI'dan baho olardi: bitta masalada ~4 ta AI chaqiruvi va har javobda
 * 800–2000 ms kutish. `docs/UI_ARCHITECTURE.md` §5.2 esa javob **100 ms**
 * dan kechikmasligini talab qiladi — tarmoq orqali bu jismonan imkonsiz edi.
 *
 * Plitka formatida javob — plitka id'lari ketma-ketligi. Uni baholash uchun
 * `MathValidator` yetarli: ~1 ms, internetsiz ham ishlaydi.
 * Batafsil: `docs/UI_ARCHITECTURE.md` §4.3.2 D.
 */

/** Baholash natijasi yoki "hal qila olmadim" signali. */
export type CheckOutcome =
  | { status: 'graded'; result: StepResult }
  /**
   * Mahalliy tekshiruv aniq javob bera olmadi (`MathValidator` ifodani
   * tahlil qila olmadi). Faqat SHU holatda serverga/AI'ga murojaat qilinadi
   * (`docs/PEDAGOGY.md` §2.5). Taxmin qilinmaydi — bola noto'g'ri "xato"
   * olsa, ilovaga ishonchni yo'qotadi.
   */
  | { status: 'needs_server'; assembledExpression: string };

/** Bola yiqqan qatorni plitka yorliqlaridan tiklaydi. */
export function assembleExpression(step: LessonStep, tileIds: readonly string[]): string {
  if (step.format !== 'STEP_BUILDER') {
    return '';
  }
  return tileIds
    .map((tileId) => step.tiles.find((tile) => tile.id === tileId)?.label ?? '')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function toResult(
  step: LessonStep,
  attempt: StepAttempt,
  isCorrect: boolean,
  currentHintLevel: HintLevel
): StepResult {
  if (isCorrect) {
    return { isCorrect: true, hintLevel: currentHintLevel, stepSkipped: false };
  }

  const hint = nextHint(step, currentHintLevel);
  const hintLevel = (hint?.level ?? currentHintLevel) as HintLevel;
  const misconceptionTag = readMisconception(step, attempt);

  return {
    isCorrect: false,
    hintLevel,
    stepSkipped: hint?.action === 'SKIP_STEP',
    ...(hint ? { hint } : {}),
    ...(misconceptionTag ? { misconceptionTag } : {}),
  };
}

/**
 * Qadamni baholaydi.
 *
 * @param currentHintLevel Shu qadamda hozirgacha nechta xato qilingan (0 dan).
 */
export function checkStep(
  step: LessonStep,
  attempt: StepAttempt,
  currentHintLevel: HintLevel = 0
): CheckOutcome {
  if (step.format === 'MULTIPLE_CHOICE' && attempt.format === 'MULTIPLE_CHOICE') {
    const isCorrect = step.options[step.correctOptionIndex]?.id === attempt.optionId;
    return { status: 'graded', result: toResult(step, attempt, isCorrect, currentHintLevel) };
  }

  if (step.format === 'STEP_BUILDER' && attempt.format === 'STEP_BUILDER') {
    // Slotlar to'lmagan bo'lsa — bu javob emas, UI tugmani yoqmasligi kerak.
    if (attempt.tileIds.length !== step.slotCount) {
      return { status: 'graded', result: toResult(step, attempt, false, currentHintLevel) };
    }

    const assembled = assembleExpression(step, attempt.tileIds);
    const verdict = MathValidator.isEquivalent(assembled, step.expectedExpression);

    // Tenglik bo'yicha tekshiriladi, satr bo'yicha emas: `5x − 20 = 2x + 12`
    // va `−20 + 5x = 12 + 2x` — ikkalasi ham to'g'ri
    // (`docs/UI_ARCHITECTURE.md` §4.3.2 H2).
    if (!verdict.isCertain) {
      return { status: 'needs_server', assembledExpression: assembled };
    }
    return {
      status: 'graded',
      result: toResult(step, attempt, verdict.isCorrect === true, currentHintLevel),
    };
  }

  // Format va javob turi mos kelmadi — bu dasturchi xatosi, bolaga
  // "noto'g'ri" deb ko'rsatilmaydi.
  throw new Error(`Answer format "${attempt.format}" does not match step format "${step.format}"`);
}
