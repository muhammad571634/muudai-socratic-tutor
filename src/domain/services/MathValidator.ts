import * as math from 'mathjs';

/**
 * Javobni matematik tenglik bo'yicha tekshiradi (satr solishtirmaydi).
 *
 * T0.20 dan keyin bu sinf **asosiy baholovchi**: plitka formatida bolaning
 * yig'gan qatori shu yerda tekshiriladi va AI chaqirilmaydi. Shuning uchun
 * `isEquivalent` ning har bir yo'li ehtiyotkorlik talab qiladi —
 * noto'g'ri "to'g'ri" bola uchun to'g'ridan-to'g'ri noto'g'ri ta'lim.
 *
 * `isCertain: false` — "hal qila olmadim" degani; chaqiruvchi shundagina
 * AI'ga eskalatsiya qiladi (`docs/PEDAGOGY.md` §2.5).
 *
 * `backend/` dan `src/domain/services/` ga ko'chirildi (T0.20): baholash
 * endi qurilmada ham, Edge Function ichida ham bir xil kod bilan bo'ladi.
 * Ikki nusxa bo'lsa, bola telefonida "to'g'ri" bo'lgan javob serverda
 * "xato" bo'lib chiqishi mumkin edi.
 */
export class MathValidator {
  /**
   * Evaluates if two expressions or equations are mathematically equivalent.
   */
  static isEquivalent(studentExpr: string, expectedExpr: string): { isCertain: boolean; isCorrect?: boolean } {
    try {
      const cleanStudent = this.cleanExpression(studentExpr);
      const cleanExpected = this.cleanExpression(expectedExpr);

      // Simple exact match after cleanup
      if (cleanStudent === cleanExpected) return { isCertain: true, isCorrect: true };

      if (cleanStudent.includes('=') && cleanExpected.includes('=')) {
        return this.compareEquations(cleanStudent, cleanExpected);
      } else if (cleanStudent.includes('=') || cleanExpected.includes('=')) {
        return { isCertain: true, isCorrect: false };
      }

      return this.compareExpressions(cleanStudent, cleanExpected);
    } catch (error) {
      console.warn('[MathValidator] Parsing failed, falling back to AI uncertainty', error);
      return { isCertain: false };
    }
  }

  private static cleanExpression(expr: string): string {
    return expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/:/g, '/')
      .replace(/,/g, '.')
      .toLowerCase()
      .trim();
  }

  private static compareExpressions(expr1: string, expr2: string): { isCertain: boolean; isCorrect?: boolean } {
    try {
      // 1. Direct simplification equality
      const sim1 = math.simplify(expr1).toString();
      const sim2 = math.simplify(expr2).toString();
      if (sim1 === sim2) return { isCertain: true, isCorrect: true };

      // 2. Diff evaluation
      const diff = math.simplify(`(${expr1}) - (${expr2})`);
      const diffNode = diff as { isConstantNode?: boolean; value?: unknown };
      if (diffNode.isConstantNode && diffNode.value === 0) {
        return { isCertain: true, isCorrect: true };
      }
      if (diff.toString() === '0') {
        return { isCertain: true, isCorrect: true };
      }
      return { isCertain: true, isCorrect: false };
    } catch (e) {
      return { isCertain: false };
    }
  }

  private static compareEquations(eq1: string, eq2: string): { isCertain: boolean; isCorrect?: boolean } {
    try {
      const [l1, r1] = eq1.split('=');
      const [l2, r2] = eq2.split('=');

      const diff1 = math.simplify(`(${l1}) - (${r1})`).toString();
      const diff2 = math.simplify(`(${l2}) - (${r2})`).toString();

      if (diff1 === diff2) return { isCertain: true, isCorrect: true };
      
      const negDiff2 = math.simplify(`-1 * (${diff2})`).toString();
      if (diff1 === negDiff2) return { isCertain: true, isCorrect: true };

      try {
        // Ikkala tenglama bir xil bo'lib, faqat koeffitsientga farq qilsa
        // (masalan `2x = 8` va `x = 4`) — nisbat o'zgarmas son bo'ladi.
        //
        // ⚠️ Nol bundan mustasno. Bola `5 = 5` yozsa, `diff1` nolga aylanadi
        // va nisbat ham nol bo'ladi — ya'ni `5 = 5` ISTALGAN tenglamaga
        // "to'g'ri" deb baholanardi va bola ball olardi (`backend/README.md`).
        const ratio = math.simplify(`(${diff1}) / (${diff2})`);
        const ratioValue = Number((ratio as { value?: unknown }).value);
        if (Number.isFinite(ratioValue) && ratioValue !== 0) {
          return { isCertain: true, isCorrect: true };
        }
      } catch (e) {}

      return { isCertain: true, isCorrect: false };
    } catch (e) {
      return { isCertain: false };
    }
  }
}
