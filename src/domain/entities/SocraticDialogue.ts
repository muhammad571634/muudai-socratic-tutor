import { SubjectType } from './Gamification';

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
export const DEMO_SOCRATIC_SESSION: SocraticProblemSession = {
  id: 'session_linear_eq_1',
  subject: 'math',
  problemTitle: 'Qavsli chiziqli tenglama',
  questionText: "Tenglamani yeching va noma'lum x ning qiymatini toping:",
  equation: '5(x - 4) = 2(x + 6)',
  totalXpReward: 75,
  finalAnswer: 'x = 32 : 3 (≈ 10.67)',
  steps: [
    {
      id: 'step_1',
      stepNumber: 1,
      totalSteps: 3,
      stepTitle: 'Qavslarni ochish qoidasi',
      questionHeadline: '1-qadam • Asosiy qonuniyat',
      tutorExplanation: "Tenglamada qavslar bo'lsa, qavs oldidagi son ichidagi har bir hadga ko'paytiriladi. Masalan, chap tomonda 5 soni (x - 4) ga ko'payadi: 5 · x = 5x va 5 · (-4) = -20. O'ng tomonda esa 2 soni (x + 6) ga ko'payadi: 2 · x = 2x va 2 · 6 = 12.",
      tutorQuestion: "Tenglamani soddalashtirish uchun birinchi navbatda qanday amalni bajaramiz?",
      explanationSnippet: 'Qavs tashqarisidagi sonni ichidagi har bir hadga ko\'paytiramiz',
      quickOptions: [
        'Qavslarni ko\'paytirib ochamiz',
        'Faqat sonlarni bir tomonga o\'tkazamiz',
        'Qavslarni shunchaki olib tashlaymiz',
      ],
      optionSubtitles: [
        'To\'g\'ri fundamental qadam',
        'Avval qavslarni ochish shart',
        'Qavs qoidasi buziladi',
      ],
      correctOptionIndex: 0,
      hintText: 'Tenglamani soddalashtirish uchun avval qavslarni ochib olish kerak.',
      xpReward: 25,
    },
    {
      id: 'step_2',
      stepNumber: 2,
      totalSteps: 3,
      stepTitle: 'Hadlarni guruhlash',
      questionHeadline: '2-qadam • Hadlarni o\'tkazish',
      tutorExplanation: "Qavslarni ochgach: 5x - 20 = 2x + 12 ifodasi hosil bo'ldi. Matematika qoidasiga ko'ra, noma'lumlarni (x larni) tenglikning chap tomoniga, ma'lum sonlarni esa o'ng tomoniga to'plash kerak. Biror had narigi tomonga o'tganda uning ishorasi teskarisiga o'zgaradi.",
      tutorQuestion: "Endi 2x ni chap tomonga o'tkazish uchun nima qilamiz?",
      explanationSnippet: 'O\'ng tomondagi 2x ni chapga ayirib o\'tkazamiz',
      quickOptions: [
        'Chap tomonga 2x ni ayirib o\'tkazamiz',
        'O\'ng tomonga 5x ni qo\'shamiz',
        'Faqat 20 bilan 12 ni qo\'shamiz',
      ],
      optionSubtitles: [
        'To\'g\'ri: 5x - 2x = 3x hosil bo\'ladi',
        'Noma\'lumlar ikki tomonda qolib ketadi',
        'X larni o\'tkazish esdan chiqadi',
      ],
      correctOptionIndex: 0,
      hintText: 'Bir xil hadlarni (x larni) bir tomonga, ozod sonlarni ikkinchi tomonga to\'playmiz.',
      xpReward: 25,
    },
    {
      id: 'step_3',
      stepNumber: 3,
      totalSteps: 3,
      stepTitle: 'Noma\'lum x ni hisoblash',
      questionHeadline: '3-qadam • Yakuniy natija',
      tutorExplanation: "Barcha amallardan so'ng tenglamamiz 3x = 32 ko'rinishiga keldi. Bu yerda 3 va x ko'paytuvchilar, 32 esa ko'paytma. Noma'lum x ko'paytuvchini topish uchun ko'paytmani ma'lum ko'paytuvchiga bo'lamiz: x = 32 : 3.",
      tutorQuestion: "3x = 32 tenglamasidan x ning yakuniy qiymati qanday topiladi?",
      explanationSnippet: 'Ikkala tomonni 3 ga bo\'lamiz',
      quickOptions: [
        '32 ni 3 ga bo\'lamiz (x = 32 : 3)',
        '32 dan 3 ni ayiramiz',
        '32 ni 3 ga ko\'paytiramiz',
      ],
      optionSubtitles: [
        'To\'g\'ri yakuniy javob',
        'Ko\'paytirish amali ayirishga aylanmaydi',
        'Bo\'lish o\'rniga ko\'paytirish xatosi',
      ],
      correctOptionIndex: 0,
      hintText: 'Noma\'lum ko\'paytuvchini topish uchun ko\'paytmani ma\'lum ko\'paytuvchiga bo\'lamiz.',
      xpReward: 25,
    },
  ],
};

/**
 * Progressive Socratic Dialogue Session for Physics (Newton's 2nd Law)
 */
export const DEMO_PHYSICS_SESSION: SocraticProblemSession = {
  id: 'session_physics_newton_1',
  subject: 'physics',
  problemTitle: 'Nyutonning 2-qonuni: Kuch va Tezlanish',
  questionText: "Kuch F = 10 N va massa m = 2 kg berilgan. Jismning tezlanishini hisoblang:",
  equation: 'F = 10 N, m = 2 kg, a = ?',
  totalXpReward: 75,
  finalAnswer: 'a = 5 m/s²',
  steps: [
    {
      id: 'step_phys_1',
      stepNumber: 1,
      totalSteps: 3,
      stepTitle: 'Fizik qonuniyatni aniqlash',
      questionHeadline: '1-qadam • Fizik qonuniyat',
      tutorExplanation: "Nyutonning ikkinchi qonuni mexanikaning eng muhim qonunidir. Unga ko'ra, jismga ta'sir qiluvchi kuch (F) uning massasi (m) va olgan tezlanishi (a) ning ko'paytmasiga teng: F = m · a.",
      tutorQuestion: 'Kuch va tezlanish o\'rtasidagi fundamental bog\'liqlik qaysi formula bilan ifodalanadi?',
      explanationSnippet: 'Kuch teng massa ko\'paytirilgan tezlanish',
      quickOptions: [
        'F = m · a (Kuch = Massa × Tezlanish)',
        'F = m : a (Kuch = Massa / Tezlanish)',
        'F = m + a (Kuch = Massa + Tezlanish)',
      ],
      optionSubtitles: [
        'Nyutonning mashhur 2-qonuni',
        'Bo\'lish nisbati noto\'g\'ri',
        'Qo\'shish amali noto\'g\'ri',
      ],
      correctOptionIndex: 0,
      hintText: 'Jismga berilgan kuch uning massasi va olgan tezlanishi ko\'paytmasiga teng.',
      xpReward: 25,
    },
    {
      id: 'step_phys_2',
      stepNumber: 2,
      totalSteps: 3,
      stepTitle: 'Tezlanish formulasini ifodalash',
      questionHeadline: '2-qadam • Formuladan ifodalash',
      tutorExplanation: "Masala shartida kuch F = 10 N va massa m = 2 kg berilgan, tezlanish a ni topish so'ralmoqda. F = m · a tenglamasidan noma'lum a ko'paytuvchini topish uchun tenglikning ikkala tomonini massaga (m) bo'lamiz: a = F : m.",
      tutorQuestion: 'F = m · a formulasidan tezlanishni (a) qanday ifodalaymiz?',
      explanationSnippet: 'Ikkala tomonni massaga bo\'lamiz',
      quickOptions: [
        'a = F : m (Kuchni massaga bo\'lamiz)',
        'a = F · m (Kuchni massaga ko\'paytiramiz)',
        'a = m : F (Massani kuchga bo\'lamiz)',
      ],
      optionSubtitles: [
        'To\'g\'ri keltirib chiqarish',
        'O\'lchov birligi buziladi',
        'Teskari nisbat',
      ],
      correctOptionIndex: 0,
      hintText: 'Tezlanishni topish uchun ta\'sir qilayotgan kuchni jism massasiga bo\'lish kerak.',
      xpReward: 25,
    },
    {
      id: 'step_phys_3',
      stepNumber: 3,
      totalSteps: 3,
      stepTitle: 'Sonli natijani hisoblash',
      questionHeadline: '3-qadam • Yakuniy hisob',
      tutorExplanation: "Endi olingan formulaga sonlarni qo'yamiz: a = 10 N : 2 kg. 10 ni 2 ga bo'lsak 5 hosil bo'ladi. Xalqaro birliklar sistemasida tezlanish m/s² da o'lchanadi.",
      tutorQuestion: 'a = 10 N : 2 kg ifodasi hisoblanganda jism qanday tezlanish oladi?',
      explanationSnippet: '10 ni 2 ga bo\'lamiz',
      quickOptions: [
        'a = 5 m/s²',
        'a = 20 m/s²',
        'a = 0.2 m/s²',
      ],
      optionSubtitles: [
        'To\'g\'ri hisoblandi: 10 : 2 = 5',
        'Ko\'paytirib yuborildi',
        'Teskari bo\'lindi',
      ],
      correctOptionIndex: 0,
      hintText: '10 ni 2 ga bo\'lamiz: natija 5 m/s² bo\'ladi.',
      xpReward: 25,
    },
  ],
};

/**
 * Progressive Socratic Dialogue Session for Chemistry (Water Synthesis)
 */
export const DEMO_CHEMISTRY_SESSION: SocraticProblemSession = {
  id: 'session_chem_water_1',
  subject: 'chemistry',
  problemTitle: 'Suv hosil bo\'lish reaksiyasi tenglamasi',
  questionText: "Vodorod va kisloroddan suv hosil bo'lish kimyoviy reaksiyasini tenglashtiring:",
  equation: 'H₂ + O₂ → H₂O',
  totalXpReward: 75,
  finalAnswer: '2H₂ + O₂ → 2H₂O',
  steps: [
    {
      id: 'step_chem_1',
      stepNumber: 1,
      totalSteps: 3,
      stepTitle: 'Modda massasining saqlanish qonuni',
      questionHeadline: '1-qadam • Asosiy kimyoviy qonun',
      tutorExplanation: "Kimyoviy reaksiyalarda moddalar yo'qdan bor bo'lmaydi va bordan yo'qolmaydi (Lomonosov-Lavuazye qonuni). Bu shuni anglatadiki, reaksiyaga kirishgan moddalardagi atomlar soni reaksiya natijasida hosil bo'lgan mahsulotdagi atomlar soniga har doim teng bo'lishi shart.",
      tutorQuestion: 'Kimyoviy reaksiyani to\'g\'ri tenglashtirishning asosiy fundamental qoidasi nima?',
      explanationSnippet: 'Chap va o\'ng tomondagi atomlar soni teng bo\'lishi shart',
      quickOptions: [
        'Har bir element atomlari soni teng bo\'lishi shart',
        'Faqat kislorod atomlari teng bo\'lsa yetarli',
        'Formuladagi indekslarni o\'zgartirish mumkin',
      ],
      optionSubtitles: [
        'Lomonosov-Lavuazye qonuni',
        'Barcha elementlar hisobga olinishi kerak',
        'Indekslarni o\'zgartirish moddani buzadi',
      ],
      correctOptionIndex: 0,
      hintText: 'Reaksiyaga kirishgan moddalar atomlari soni hosil bo\'lgan moddalar atomlariga teng bo\'lishi kerak.',
      xpReward: 25,
    },
    {
      id: 'step_chem_2',
      stepNumber: 2,
      totalSteps: 3,
      stepTitle: 'Kislorod atomlarini tenglashtirish',
      questionHeadline: '2-qadam • Kislorod atomlari',
      tutorExplanation: "Reaksiyaning chap tomonida O₂ molekulasi bo'lib, unda 2 ta kislorod atomi bor. O'ng tomonda esa bitta H₂O molekulasi bor va unda faqat 1 ta kislorod atomi mavjud. Kislorod atomlarini tenglashtirish uchun H₂O formulasi oldiga 2 koeffitsiyentini qo'yamiz: 2H₂O.",
      tutorQuestion: 'O\'ng tomondagi kislorod atomlarini 2 ta qilish uchun nima qilish kerak?',
      explanationSnippet: 'H₂O oldiga 2 koeffitsiyentini qo\'yamiz',
      quickOptions: [
        'H₂O oldiga 2 qo\'yamiz (2H₂O)',
        'O₂ indeksini o\'chirib tashlaymiz',
        'H₂O ga qo\'shimcha O qo\'shamiz',
      ],
      optionSubtitles: [
        'To\'g\'ri: 2 ta kislorod atomi bo\'ladi',
        'Modda formulasi buziladi',
        'Yangi modda kiritilmaydi',
      ],
      correctOptionIndex: 0,
      hintText: 'Tenglashtirish faqat formula oldiga koeffitsiyent qo\'yish orqali amalga oshiriladi.',
      xpReward: 25,
    },
    {
      id: 'step_chem_3',
      stepNumber: 3,
      totalSteps: 3,
      stepTitle: 'Vodorod atomlarini yakuniy tenglashtirish',
      questionHeadline: '3-qadam • Vodorod atomlari',
      tutorExplanation: "H₂O oldiga 2 qo'yganimizdan so'ng (2H₂O), o'ng tomonda 2 · 2 = 4 ta vodorod atomi hosil bo'ldi. Chap tomondagi H₂ da esa 2 ta vodorod bor. Chap tomonda ham 4 ta vodorod bo'lishi uchun H₂ oldiga ham 2 koeffitsiyentini qo'yamiz: 2H₂ + O₂ = 2H₂O.",
      tutorQuestion: 'Chap tomondagi vodorod atomlarini tenglashtirish uchun qaysi koeffitsiyent qo\'yiladi?',
      explanationSnippet: 'Chapdagi H₂ oldiga 2 qo\'yamiz',
      quickOptions: [
        '2H₂ qo\'yamiz (2H₂ + O₂ = 2H₂O)',
        '3H₂ qo\'yamiz',
        'Koeffitsiyent qo\'yilmaydi',
      ],
      optionSubtitles: [
        'Reaksiya to\'liq tenglashdi',
        'Ortiqcha atom hosil bo\'ladi',
        'Tenglik buziladi',
      ],
      correctOptionIndex: 0,
      hintText: '4 ta vodorod atomi bo\'lishi uchun chap tomondagi H₂ oldiga 2 qo\'yiladi.',
      xpReward: 25,
    },
  ],
};

/**
 * Pedagogical Math Formatter (Adheres strictly to school mathematical standards):
 * 1. Formats arithmetic division ('/' between numbers) as school division symbol ' : '
 * 2. Formats arithmetic multiplication ('*' between numbers) as school multiplication symbol ' × '
 * 3. Formats 4+ digit numbers with standard thousands separators (e.g. 1161 -> 1.161, 9288 -> 9.288, 8000 -> 8.000)
 */
export function formatEducationalMathText(text: string): string {
  if (!text) return '';
  let result = text;

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

export const getDemoSocraticSession = (subject: SubjectType = 'math'): SocraticProblemSession => {
  let session: SocraticProblemSession;
  switch (subject) {
    case 'physics':
      session = DEMO_PHYSICS_SESSION;
      break;
    case 'chemistry':
      session = DEMO_CHEMISTRY_SESSION;
      break;
    case 'math':
    default:
      session = DEMO_SOCRATIC_SESSION;
      break;
  }
  return shuffleProblemSession(session);
};

