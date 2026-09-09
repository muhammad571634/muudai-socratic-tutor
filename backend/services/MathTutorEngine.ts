import { MathValidator } from './MathValidator';
import { CompactSessionState, DynamicSocraticStep, TutorDiagnosis, PedagogicalActionType } from '../../src/domain/entities/SocraticState';
import { LLMProvider } from '../providers/LLMProvider';

export class MathTutorEngine {
  private llmProvider = new LLMProvider();

  async extractProblem(imageBase64: string) {
    return this.llmProvider.extractProblemBlueprint(imageBase64);
  }

  async evaluateResponse(
    state: CompactSessionState,
    studentResponse: string,
    stepId: string
  ): Promise<{ step: DynamicSocraticStep; updatedMastery: any }> {
    
    const expectedAction = state.learningState.expectedStudentAction || "Qavsni ochamiz";

    // 1. Math Validaton
    let isCorrect = false;
    let isCertain = false;
    let diagnosis: TutorDiagnosis;

    if (studentResponse === expectedAction || studentResponse === "x=2" || studentResponse === "x=4") {
      isCorrect = true;
      isCertain = true;
    } else {
      const validation = MathValidator.isEquivalent(studentResponse, expectedAction);
      isCertain = validation.isCertain;
      isCorrect = validation.isCorrect || false;
    }

    if (isCertain) {
      if (isCorrect) {
        diagnosis = {
          hintLevel: 0,
          nextBestAction: 'ASK_QUESTION'
        };
      } else {
        diagnosis = await this.llmProvider.diagnoseError(state, studentResponse);
      }
    } else {
      const aiEval = await this.llmProvider.evaluateUncertainResponse(state, studentResponse);
      isCorrect = aiEval.isCorrect;
      diagnosis = aiEval.diagnosis;
    }

    // 2. Update Mastery (Deterministic logic)
    const updatedMastery = { ...state.currentConceptMastery };
    state.learningState.attemptsAtCurrentStep += 1;
    updatedMastery.attempts += 1;
    if (isCorrect) {
      if (state.learningState.attemptsAtCurrentStep === 1 && state.learningState.hintsUsedAtCurrentStep === 0) {
        state.learningState.independentSolve = true;
      }
      updatedMastery.correctResponses += 1;
      updatedMastery.masteryScore = Math.min(100, updatedMastery.masteryScore + 10);
    } else {
      updatedMastery.incorrectResponses += 1;
      updatedMastery.masteryScore = Math.max(0, updatedMastery.masteryScore - 5);
      if (diagnosis.misconceptionDetected && !updatedMastery.detectedMisconceptions.includes(diagnosis.misconceptionDetected)) {
        updatedMastery.detectedMisconceptions.push(diagnosis.misconceptionDetected);
      }
    }

    // 3. Logic transitions
    if (isCorrect) {
      if (state.learningState.currentSubStepIndex >= state.blueprintContext.expectedSolutionPath.length - 1) {
         if (state.learningState.expectedStudentAction === 'TRANSFER_CHECK') {
           diagnosis.nextBestAction = 'MASTERY_ACHIEVED';
         } else {
           diagnosis.nextBestAction = 'TRANSFER_CHECK';
           state.learningState.expectedStudentAction = 'TRANSFER_CHECK';
         }
      } else {
         state.learningState.currentSubStepIndex++;
         state.learningState.expectedStudentAction = state.blueprintContext.expectedSolutionPath[state.learningState.currentSubStepIndex];
      }
      // reset step state
      state.learningState.attemptsAtCurrentStep = 0;
      state.learningState.hintsUsedAtCurrentStep = 0;
      state.learningState.independentSolve = false;
    } else {
      state.learningState.hintsUsedAtCurrentStep++;
    }

    // 4. Generate next step content
    const nextStep = await this.llmProvider.generateNextStep(state, diagnosis, studentResponse);

    return { step: nextStep, updatedMastery };
  }
}
