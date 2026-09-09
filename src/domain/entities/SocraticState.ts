import { SubjectType } from './Gamification';

export type InteractionFormat = 
  | 'MULTIPLE_CHOICE'
  | 'OPEN_QUESTION' 
  | 'HINT_OVERLAY'
  | 'RETRY_PROMPT'
  | 'INFO_CARD';

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

export type AgeBand = '4-6' | '7-9' | '10-12' | '13-15';

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
  hintLevel: 0 | 1 | 2 | 3;
  nextBestAction: PedagogicalActionType;
}

export interface DynamicSocraticStep {
  id: string;
  pedagogicalAction?: PedagogicalActionType;
  content: {
    tutorExplanation?: string;
    tutorQuestion?: string;
  };
  uiParams: {
    interactionFormat: InteractionFormat;
    quickOptions?: string[]; // Only if MULTIPLE_CHOICE
    hintText?: string;
  };
  xpReward: number;
}

export interface CompactSessionState {
  blueprintContext: Pick<ProblemBlueprint, 'topic' | 'learningObjective' | 'expectedSolutionPath' | 'commonMisconceptions'>;
  currentConceptMastery: ConceptMasteryTracker;
  learningState: CurrentLearningState;
  sessionHistory: {
    tutorQuestion: string;
    studentResponse: string;
    isCorrect: boolean;
  }[]; 
}
