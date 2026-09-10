/**
 * Skanerlash xatolari va matematik matnni formatlash yordamchilari.
 *
 * Dars qadamlari modeli bu yerda EMAS — u `SocraticLesson.ts` ga ko'chdi
 * (T0.20). Sabab: bu yerdagi `SocraticStep` va `SocraticState.ts` dagi
 * `DynamicSocraticStep` ikkita parallel model edi va bitta qadamga 7 ta
 * matn maydoni berardi (`docs/UI_ARCHITECTURE.md` §4.3.1 C).
 */

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
