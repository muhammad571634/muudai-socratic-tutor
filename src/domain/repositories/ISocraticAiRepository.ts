import { SubjectType } from '../entities/Gamification';
import { SocraticProblemSession } from '../entities/SocraticDialogue';

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
}
