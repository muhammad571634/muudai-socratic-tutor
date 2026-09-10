import { SubjectType } from '../entities/Gamification';
import { AppLocale } from '../entities/Locale';
import { SocraticProblemSession } from '../entities/SocraticDialogue';

export interface ISocraticAiRepository {
  /**
   * Analyzes an image captured from a student's notebook or textbook using Multimodal AI
   * and generates a multi-step Socratic guided dialogue.
   *
   * @param locale Language the generated dialogue must be written in.
   */
  analyzeNotebookImage(
    base64Image: string,
    subject: SubjectType,
    locale: AppLocale
  ): Promise<SocraticProblemSession>;

  /**
   * Generates a Socratic dialogue from an entered problem or text snippet.
   *
   * @param locale Language the generated dialogue must be written in.
   */
  generateSocraticFromText(
    problemText: string,
    subject: SubjectType,
    locale: AppLocale
  ): Promise<SocraticProblemSession>;
}
