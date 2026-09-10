import { SubjectType } from './Gamification';
import { HintLevel } from './SocraticLesson';

/**
 * Sessiya konteksti: AI qadamlarni tuzish uchun nimani biladi.
 *
 * Qadamning O'ZI bu yerda emas — u `SocraticLesson.ts` da
 * (`LessonStep`). Ilgari bu faylda `DynamicSocraticStep` va beshta
 * `InteractionFormat` turardi; ular `SocraticLesson.ts` dagi ikkita
 * `AnswerFormat` ga qisqartirildi (T0.20).
 */

export type PedagogicalActionType = 
  | 'ASK_CLARIFICATION'
  | 'ASK_QUESTION' 
  | 'GIVE_HINT' 
  | 'RETRY' 
  | 'TEACH_PREREQUISITE' 
  | 'ADJUST_DIFFICULTY' 
  | 'CONFIRM_UNDERSTANDING' 
  | 'TRANSFER_CHECK'
  | 'NEXT_CONCEPT'
  | 'MASTERY_ACHIEVED';

/**
 * Yosh guruhi. `docs/PEDAGOGY.md` §5 va `ARCHITECTURE.md` §1.
 *
 * Ilgari bu yerda `'4-6' | '7-9' | '10-12' | '13-15'` turardi va bu
 * hujjatlarga zid edi — ikkisi bir vaqtda to'g'ri bo'lolmaydi (T0.20).
 */
export type AgeBand = 'junior' | 'explorer' | 'scholar';

/**
 * Yoshdan guruhga.
 *
 * `junior` (4–8) V1 da ishlatilmaydi — u alohida ilova (MuudAI Junior, V4).
 * Lekin model bugundanoq uni biladi, shunda Junior qurilganda backend va
 * biznes mantiq qayta yozilmaydi (`ARCHITECTURE.md` §1).
 */
export function toAgeBand(age: number): AgeBand {
  if (age <= 8) return 'junior';
  if (age <= 11) return 'explorer';
  return 'scholar';
}

export interface StudentProfile {
  studentId: string;
  ageBand: AgeBand;
  language: string;
}

export interface ConceptMasteryTracker {
  conceptId: string;
  masteryScore: number;
  attempts: number;
  correctResponses: number;
  incorrectResponses: number;
  detectedMisconceptions: string[];
  hintsUsed: number;
  prerequisiteGaps: string[];
}

export interface ProblemBlueprint {
  subject: SubjectType;
  topic: string;
  subtopic: string;
  learningObjective: string;
  difficulty: number;
  concepts: string[];
  prerequisites: string[];
  expectedSolutionPath: string[];
  commonMisconceptions: string[];
  canonicalAnswer: string;
}

export interface CurrentLearningState {
  currentConcept: string;
  currentSubStepIndex: number;
  expectedStudentAction: string;
  currentDifficulty: number;
  currentPrerequisiteGap?: string;

  attemptsAtCurrentStep: number;
  hintsUsedAtCurrentStep: number;
  independentSolve: boolean;
}

export interface TutorDiagnosis {
  misconceptionDetected?: string;
  missingPrerequisite?: string;
  /**
   * Yordam zinasining bosqichi (0–5).
   *
   * Ilgari `0 | 1 | 2 | 3` edi, zina esa `docs/PEDAGOGY.md` §3 bo'yicha
   * **besh** bosqichli — ya'ni oxirgi ikki bosqich (chalg'ituvchilarni
   * olib tashlash va qadamni o'tkazib yuborish) hech qachon ishlamasdi.
   */
  hintLevel: HintLevel;
  nextBestAction: PedagogicalActionType;
}

export interface CompactSessionState {
  blueprintContext: Pick<ProblemBlueprint, 'topic' | 'learningObjective' | 'expectedSolutionPath' | 'commonMisconceptions'>;
  currentConceptMastery: ConceptMasteryTracker;
  learningState: CurrentLearningState;
  sessionHistory: {
    question: string;
    studentResponse: string;
    isCorrect: boolean;
  }[];
}
