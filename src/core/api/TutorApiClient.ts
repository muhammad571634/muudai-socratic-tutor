import { ScanError } from '../../domain/entities/SocraticDialogue';
import { SocraticLesson } from '../../domain/entities/SocraticLesson';

/**
 * TutorApiClient: Pure Frontend Network Client.
 *
 * Rules (see AGENTS.md and ARCHITECTURE.md):
 * - NEVER contains API keys (Gemini / OpenAI). The backend holds them.
 * - NEVER bundles server engines or prompt logic.
 * - NEVER returns fabricated lesson content. If the backend cannot be reached,
 *   this client throws a ScanError so the UI can tell the child the truth.
 *
 * Why no offline fallback: a hardcoded lesson is served regardless of what the
 * child actually photographed, so the child is taught a problem they never
 * asked about — and any error in that hardcoded maths is taught as fact.
 * See docs/PEDAGOGY.md §2.5 and the second prohibition in AGENTS.md.
 *
 * ⚠️ There is no per-answer endpoint any more (T0.20). A tile answer is a list
 * of tile ids, so `AnswerChecker` grades it on the device in about a
 * millisecond — see docs/UI_ARCHITECTURE.md §4.3.2 D. The server is called
 * once to build the lesson, and again only when local checking is uncertain.
 *
 * The base URL becomes the Supabase Edge Function URL in T1.1 / T1.4;
 * ARCHITECTURE.md §4 is the authority on that, not this file.
 */
class TutorApiClient {
  private backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || '';

  private assertBackendConfigured(): string {
    if (!this.backendUrl) {
      throw new ScanError('network', 'errors.backendNotConfigured');
    }
    return this.backendUrl;
  }

  private async postJson<T>(path: string, body: unknown): Promise<T> {
    const baseUrl = this.assertBackendConfigured();

    let response: Response;
    try {
      response = await fetch(`${baseUrl}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.warn(`[TutorApiClient] ${path} unreachable:`, err);
      throw new ScanError('network', 'errors.network');
    }

    if (!response.ok) {
      console.warn(`[TutorApiClient] ${path} returned status ${response.status}`);
      throw new ScanError('unknown', 'errors.serverError');
    }

    try {
      return (await response.json()) as T;
    } catch (err) {
      console.warn(`[TutorApiClient] ${path} returned malformed JSON:`, err);
      throw new ScanError('unknown', 'errors.malformedResponse');
    }
  }

  /**
   * POST /api/tutor/lesson
   * Camera -> backend vision + verification -> a complete Socratic lesson.
   *
   * The whole plan arrives in one call, which is why a problem now costs one
   * AI call instead of one per answer. The plan is never shown to the child:
   * they only ever see the current step (docs/PEDAGOGY.md §2).
   */
  async buildLesson(imageBase64: string, subject: string = 'math'): Promise<SocraticLesson> {
    if (!imageBase64 || imageBase64.length < 50) {
      throw new ScanError('blurry', 'errors.blurry');
    }

    return this.postJson('/api/tutor/lesson', { imageBase64, subject });
  }

  /**
   * POST /api/tutor/verify
   * Escalation path only: the child assembled something the on-device
   * MathValidator could not parse (`CheckOutcome.status === 'needs_server'`).
   *
   * Never call this to grade a normal answer — that would put the network back
   * in front of every tap and break the 100 ms budget in UI_ARCHITECTURE §5.2.
   */
  async verifyUncertainAnswer(
    lessonId: string,
    stepId: string,
    assembledExpression: string
  ): Promise<{ isCorrect: boolean }> {
    return this.postJson('/api/tutor/verify', { lessonId, stepId, assembledExpression });
  }
}

export const tutorApiClient = new TutorApiClient();
