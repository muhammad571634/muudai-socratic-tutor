import { SubjectType } from '../entities/Gamification';
import { SocraticProblemSession, SocraticStep } from '../entities/SocraticDialogue';
import { VoiceEvaluationResult } from '../entities/VoiceEvaluation';

export interface ISocraticAiRepository {
  /**
   * Analyzes an image captured from a student's notebook or textbook using Multimodal AI
   * and generates a multi-step Socratic guided dialogue.
   */
  analyzeNotebookImage(
    base64Image: string,
    subject: SubjectType
  ): Promise<SocraticProblemSession>;

  /**
   * Generates a Socratic dialogue from an entered problem or text snippet.
   */
  generateSocraticFromText(
    problemText: string,
    subject: SubjectType
  ): Promise<SocraticProblemSession>;

  /**
   * Evaluates a child's spoken audio answer for the current Socratic step
   * using Multimodal Audio AI and returns encouraging feedback.
   */
  evaluateVoiceAnswer(
    base64Audio: string,
    currentStep: SocraticStep,
    subject: SubjectType
  ): Promise<VoiceEvaluationResult>;
}
