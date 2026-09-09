import * as math from 'mathjs';

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
      if ((diff as any).isConstantNode && (diff as any).value === 0) {
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
        const ratio = math.simplify(`(${diff1}) / (${diff2})`);
        if ((ratio as any).isConstantNode) {
          return { isCertain: true, isCorrect: true };
        }
      } catch (e) {}

      return { isCertain: true, isCorrect: false };
    } catch (e) {
      return { isCertain: false };
    }
  }
}
