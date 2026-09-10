import { SubjectType } from './Gamification';

/**
 * MuudAI — Sokratik dars shartnomasi (yagona model).
 *
 * Bu fayl ilgari ikki joyga bo'lingan edi: `SocraticDialogue.ts` dagi
 * `SocraticStep` (7 ta matn maydoni) va `SocraticState.ts` dagi
 * `DynamicSocraticStep` (5 xil `InteractionFormat`). Bitta qadamda ekranga
 * chiqishi mumkin bo'lgan matn bloklari soni 7 ta edi va dars ekrani aynan
 * shuning uchun chalkash ko'rinardi — model UI'ni to'ldirishga majbur qilardi.
 *
 * Sabab va audit: `docs/UI_ARCHITECTURE.md` §4.3.1 C.
 * Yangi format: `docs/UI_ARCHITECTURE.md` §4.3.2.
 *
 * Endi bir qadamda **to'rtta** narsa bor, boshqasi yo'q:
 *   masala satri · bitta savol · javob zonasi · bitta tugma
 *
 * ⚠️ `finalAnswer` bu yerda YO'Q va ataylab yo'q. Yakuniy javob serverda
 * qoladi (`learning_sessions.final_answer`) va u yerda tekshiruv uchun
 * ishlatiladi. Klientga yuborilmaydi: `docs/PEDAGOGY.md` §1 dagi Sokratik
 * shartnomaning uchinchi qavati — javob paketda bo'lmasa, uni hech qanday
 * prompt aldash yo'li bilan ekranga chiqarib bo'lmaydi. Bola javobni
 * oxirgi qadamni **o'zi yig'ib** biladi.
 */

/**
 * Javob berish formati. V1 da faqat ikkitasi.
 *
 * Ilgari beshta bor edi (`OPEN_QUESTION`, `HINT_OVERLAY`, `RETRY_PROMPT`,
 * `INFO_CARD`) va ular bir vaqtda ekranda turardi. `HINT_OVERLAY` va
 * `RETRY_PROMPT` — bu format emas, ekranning **holati**; ular
 * `docs/UI_ARCHITECTURE.md` §4.3.2 I dagi holatlar ro'yxatiga ko'chdi.
 * `OPEN_QUESTION` V2 (ovozli javob) bilan birga qaytadi.
 */
export type AnswerFormat =
  /** Asosiy format: bola keyingi qatorni plitkalardan quradi. */
  | 'STEP_BUILDER'
  /** Ikkilamchi: "nima uchun?" turidagi savollar uchun 3 ta variant. */
  | 'MULTIPLE_CHOICE';

/**
 * Xato turi — `docs/PEDAGOGY.md` §4 dagi taksonomiya.
 * `mistakes.misconception_tag` ustuniga yoziladi.
 */
export type MisconceptionTag =
  | 'distribution_error'
  | 'sign_error'
  | 'operation_order'
  | 'unit_error'
  | 'concept_gap'
  | 'careless';

/**
 * Yordam zinasi bosqichi. 0 — hali yordam so'ralmagan.
 *
 * Beshta bosqich, chunki `docs/PEDAGOGY.md` §3 da beshta. Ilgari
 * `TutorDiagnosis.hintLevel` `0 | 1 | 2 | 3` edi — zina beshta bo'lsa-yu
 * model to'rttani ko'tarsa, oxirgi ikki bosqich hech qachon ishlamaydi.
 */
export type HintLevel = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Yordamning bir bosqichi nima qiladi.
 *
 * Diqqat: `STEP_BUILDER` da yordam — bu **harakat**, matn emas. Shuning
 * uchun u tarjima talab qilmaydi va javobni oshkor qilmaydi, faqat
 * qidiruv maydonini toraytiradi (`docs/UI_ARCHITECTURE.md` §4.3.2 C).
 */
export type HintAction =
  /** 1-xato (ikkala format): dalda, javobga ishora yo'q. */
  | 'ENCOURAGE'
  /** 2-xato · plitka: nechta plitka kerakligi ko'rsatiladi. */
  | 'REVEAL_SLOT_COUNT'
  /** 2-xato · variant: nima uchun xato ekani tushuntiriladi. */
  | 'EXPLAIN_WHY'
  /** 3-xato · plitka: birinchi plitka joyiga qo'yiladi. */
  | 'PLACE_FIRST_TILE'
  /** 3-xato · variant: soddaroq misolda ko'rsatiladi. */
  | 'SIMPLER_EXAMPLE'
  /** 4-xato: chalg'ituvchilar olib tashlanadi (plitka yoki variant). */
  | 'NARROW_CHOICES'
  /** 5-xato: qadam o'tkaziladi. XP berilmaydi, xatolar daftariga yoziladi. */
  | 'SKIP_STEP';

/** Zinaning bir bosqichi. */
export interface HintRung {
  level: Exclude<HintLevel, 0>;
  action: HintAction;
  /**
   * Bolaga ko'rsatiladigan matn — AI tomonidan bolaning tilida yoziladi.
   *
   * `undefined` bo'lishi mumkin: `REVEAL_SLOT_COUNT` va `NARROW_CHOICES`
   * kabi harakatlar o'zini o'zi tushuntiradi va matnsiz ham ishlaydi.
   * Bo'sh bo'lsa — o'ylab topilgan zaxira matn YOZILMAYDI (`AGENTS.md`
   * 2-taqiq), UI shunchaki harakatni bajaradi.
   */
  message?: string;
}

/** Plitka — bolaning qurilish materiali. */
export interface Tile {
  id: string;
  /** Ekranda ko'rinadigan matn: `5x`, `−20`, `=`. */
  label: string;
  /** `true` bo'lsa — bu chalg'ituvchi, to'g'ri qatorga kirmaydi. */
  isDistractor: boolean;
  /**
   * Chalg'ituvchi plitka qaysi tushunmovchilikni ochib beradi.
   *
   * Bu formatning eng qimmatli tomoni: bola qaysi **noto'g'ri plitkani**
   * olgani "xato qildi" degandan ancha aniq signal. Faqat
   * `isDistractor === true` bo'lganda to'ldiriladi.
   */
  misconceptionTag?: MisconceptionTag;
}

/** Variant tanlash formatidagi bitta variant. */
export interface ChoiceOption {
  id: string;
  label: string;
  /** Noto'g'ri variant qaysi tushunmovchilikka mos keladi. */
  misconceptionTag?: MisconceptionTag;
}

interface LessonStepBase {
  id: string;
  /** 1 dan boshlanadi. */
  stepNumber: number;
  /** `docs/PEDAGOGY.md` §2: reja 2–4 qadamdan iborat. */
  totalSteps: number;
  /**
   * Bolaga beriladigan savol — **bitta jumla**, uning tilida.
   *
   * Ilgari bu yerda `stepTitle`, `questionHeadline`, `tutorExplanation`,
   * `tutorQuestion` va `explanationSnippet` alohida turardi va ekranga
   * beshtasi birdan chiqardi.
   */
  question: string;
  /** Beshta bosqich, tartib bilan. `docs/PEDAGOGY.md` §3. */
  hintLadder: HintRung[];
  xpReward: number;
}

/** Asosiy format: bola keyingi yechim qatorini plitkalardan yig'adi. */
export interface StepBuilderStep extends LessonStepBase {
  format: 'STEP_BUILDER';
  /** Nechta bo'sh slot bor. `docs/UI_ARCHITECTURE.md` §4.3.2 I: 3–6. */
  slotCount: number;
  /** Bank: to'g'ri plitkalar + kamida 2 ta chalg'ituvchi. */
  tiles: Tile[];
  /**
   * Kutilayotgan ifoda — `MathValidator.isEquivalent()` uchun.
   *
   * Bolaning yig'gan qatori bu bilan **matematik tenglik** bo'yicha
   * solishtiriladi, satr sifatida emas: `5x − 20 = 2x + 12` va
   * `−20 + 5x = 12 + 2x` — ikkalasi ham to'g'ri
   * (`docs/UI_ARCHITECTURE.md` §4.3.2 H2).
   */
  expectedExpression: string;
}

/** Ikkilamchi format: "nima uchun?" turidagi savollar uchun. */
export interface MultipleChoiceStep extends LessonStepBase {
  format: 'MULTIPLE_CHOICE';
  /** Roppa-rosa uchta. */
  options: ChoiceOption[];
  correctOptionIndex: number;
}

export type LessonStep = StepBuilderStep | MultipleChoiceStep;

/**
 * Yordam qanchalik ko'p beriladi. Bola mavzuni o'zlashtirgani sayin
 * kamayadi (`topic_mastery` ga qarab server tanlaydi).
 *
 * Nima uchun kerak: plitka bolaga tayyor material beradi — bu boshda
 * foydali, lekin abadiy qolsa bola qog'ozda mustaqil yoza olmaydi.
 * Shuning uchun yordam **so'nadi**: plitkalar maydalashadi, chalg'ituvchilar
 * ko'payadi, oxirida raqam kiritish formatiga o'tiladi (V1.1).
 */
export type ScaffoldLevel = 'full' | 'reduced' | 'minimal';

/** Bitta masala ustidagi to'liq dars. */
export interface SocraticLesson {
  id: string;
  subject: SubjectType;
  /** Daftardan o'qilgan matn — asl tilida, o'zgartirilmasdan. */
  problemText: string;
  equation: string;
  /** `docs/PEDAGOGY.md` §2: 2–4 qadam. Bolaga faqat joriysi ko'rsatiladi. */
  steps: LessonStep[];
  scaffold: ScaffoldLevel;
  totalXpReward: number;
}

/** Bolaning bitta qadamga bergan javobi. */
export type StepAttempt =
  | { format: 'STEP_BUILDER'; stepId: string; tileIds: string[] }
  | { format: 'MULTIPLE_CHOICE'; stepId: string; optionId: string };

/** Javob baholangandan keyingi natija. */
export interface StepResult {
  isCorrect: boolean;
  /** Xato bo'lsa — qaysi tushunmovchilik. `mistakes` jadvaliga yoziladi. */
  misconceptionTag?: MisconceptionTag;
  /** Yangi zina bosqichi (xato bo'lsa oshadi). */
  hintLevel: HintLevel;
  /** Xato bo'lsa — endi qo'llaniladigan yordam. */
  hint?: HintRung;
  /**
   * `true` bo'lsa — 5-bosqichga yetildi, qadam o'tkazib yuboriladi.
   * XP berilmaydi va masala xatolar daftariga tushadi.
   */
  stepSkipped: boolean;
}

/**
 * Shartnoma chegaralari. Bular UI cheklovlaridan kelib chiqadi va AI
 * generatsiyasi ham, server tekshiruvi ham shu raqamlarga tayanadi.
 */
export const LESSON_LIMITS = {
  /** `docs/PEDAGOGY.md` §2 — reja 2–4 qadam. */
  minSteps: 2,
  maxSteps: 4,
  /** Kichik ekranda 6 tadan ortiq slot sig'maydi. */
  minSlots: 3,
  maxSlots: 6,
  /** 8 tadan ortiq plitka 9–15 yoshli bolani ko'mib tashlaydi. */
  minTiles: 5,
  maxTiles: 8,
  /** Kamida 2 ta chalg'ituvchi bo'lmasa — tanlov yo'q, javob o'zi ko'rinib turadi. */
  minDistractors: 2,
  choiceCount: 3,
  hintRungs: 5,
} as const;

/**
 * Qadam shartnomaga mos keladimi.
 *
 * Bu **server tomonda** ishlatiladi: AI chegaradan chiqib ketgan qadam
 * qaytarsa (masalan 9 ta plitka yoki 1 ta chalg'ituvchi), u bolaga
 * ko'rsatilmaydi — qayta so'raladi. Buzilgan qadamni "tuzatib" ekranga
 * chiqarish `AGENTS.md` 2-taqig'iga kiradi.
 */
export function findStepContractViolation(step: LessonStep): string | null {
  if (!step.question.trim()) {
    return 'question is empty';
  }
  if (step.hintLadder.length !== LESSON_LIMITS.hintRungs) {
    return `hintLadder must have ${LESSON_LIMITS.hintRungs} rungs, got ${step.hintLadder.length}`;
  }
  if (step.format === 'MULTIPLE_CHOICE') {
    if (step.options.length !== LESSON_LIMITS.choiceCount) {
      return `expected ${LESSON_LIMITS.choiceCount} options, got ${step.options.length}`;
    }
    if (step.correctOptionIndex < 0 || step.correctOptionIndex >= step.options.length) {
      return `correctOptionIndex ${step.correctOptionIndex} is out of range`;
    }
    return null;
  }

  const { slotCount, tiles } = step;
  if (slotCount < LESSON_LIMITS.minSlots || slotCount > LESSON_LIMITS.maxSlots) {
    return `slotCount ${slotCount} outside ${LESSON_LIMITS.minSlots}–${LESSON_LIMITS.maxSlots}`;
  }
  if (tiles.length < LESSON_LIMITS.minTiles || tiles.length > LESSON_LIMITS.maxTiles) {
    return `tile count ${tiles.length} outside ${LESSON_LIMITS.minTiles}–${LESSON_LIMITS.maxTiles}`;
  }
  const distractors = tiles.filter((tile) => tile.isDistractor);
  if (distractors.length < LESSON_LIMITS.minDistractors) {
    return `needs at least ${LESSON_LIMITS.minDistractors} distractors, got ${distractors.length}`;
  }
  if (tiles.length - distractors.length !== slotCount) {
    return `correct tiles (${tiles.length - distractors.length}) must equal slotCount (${slotCount})`;
  }
  if (!step.expectedExpression.trim()) {
    return 'expectedExpression is empty';
  }
  return null;
}

/** Dars shartnomaga mos keladimi. */
export function findLessonContractViolation(lesson: SocraticLesson): string | null {
  if (lesson.steps.length < LESSON_LIMITS.minSteps || lesson.steps.length > LESSON_LIMITS.maxSteps) {
    return `step count ${lesson.steps.length} outside ${LESSON_LIMITS.minSteps}–${LESSON_LIMITS.maxSteps}`;
  }
  for (const step of lesson.steps) {
    const violation = findStepContractViolation(step);
    if (violation) {
      return `step ${step.stepNumber}: ${violation}`;
    }
  }
  return null;
}

/** Fisher-Yates — joyida emas, nusxada. */
function shuffled<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Plitka bankini yoki variantlarni aralashtiradi.
 *
 * Nima uchun kerak: AI to'g'ri plitkalarni odatda tartib bilan qaytaradi va
 * to'g'ri variantni birinchi qilib qo'yadi. Aralashtirmasak, bola bir necha
 * masaladan keyin naqshni sezadi va o'ylashni to'xtatadi.
 */
export function shuffleStep(step: LessonStep): LessonStep {
  if (step.format === 'STEP_BUILDER') {
    return { ...step, tiles: shuffled(step.tiles) };
  }

  const correct = step.options[step.correctOptionIndex];
  const options = shuffled(step.options);
  const correctOptionIndex = correct ? options.indexOf(correct) : 0;
  return { ...step, options, correctOptionIndex: Math.max(0, correctOptionIndex) };
}

/** Darsdagi barcha qadamlarni aralashtiradi. */
export function shuffleLesson(lesson: SocraticLesson): SocraticLesson {
  return { ...lesson, steps: lesson.steps.map(shuffleStep) };
}

/** Bolaning javobidan chiqqan chalg'ituvchi plitka/variant yorlig'i. */
export function readMisconception(step: LessonStep, attempt: StepAttempt): MisconceptionTag | undefined {
  if (step.format === 'STEP_BUILDER' && attempt.format === 'STEP_BUILDER') {
    const chosenDistractor = step.tiles.find(
      (tile) => tile.isDistractor && attempt.tileIds.includes(tile.id)
    );
    return chosenDistractor?.misconceptionTag;
  }
  if (step.format === 'MULTIPLE_CHOICE' && attempt.format === 'MULTIPLE_CHOICE') {
    return step.options.find((option) => option.id === attempt.optionId)?.misconceptionTag;
  }
  return undefined;
}

/** Navbatdagi yordam bosqichi. Zina tugagan bo'lsa — `undefined`. */
export function nextHint(step: LessonStep, currentLevel: HintLevel): HintRung | undefined {
  return step.hintLadder.find((rung) => rung.level === currentLevel + 1);
}
