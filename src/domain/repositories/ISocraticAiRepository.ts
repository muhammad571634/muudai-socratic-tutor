import { SubjectType } from '../entities/Gamification';
import { AppLocale } from '../entities/Locale';
import { SocraticLesson } from '../entities/SocraticLesson';

export interface ISocraticAiRepository {
  /**
   * Analyzes an image captured from a student's notebook or textbook using Multimodal AI
   * and generates a multi-step Socratic lesson.
   *
   * The returned lesson never carries the final answer — verification keeps it
   * server-side (see the note at the top of `SocraticLesson.ts`).
   *
   * @param locale Language the generated dialogue must be written in.
   */
  analyzeNotebookImage(
    base64Image: string,
    subject: SubjectType,
    locale: AppLocale
  ): Promise<SocraticLesson>;

  /**
   * Generates a Socratic dialogue from an entered problem or text snippet.
   *
   * @param locale Language the generated dialogue must be written in.
   */
  generateSocraticFromText(
    problemText: string,
    subject: SubjectType,
    locale: AppLocale
  ): Promise<SocraticLesson>;
}
