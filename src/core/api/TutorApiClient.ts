import { ScanError } from '../../domain/entities/SocraticDialogue';
import {
  CompactSessionState,
  DynamicSocraticStep,
  ProblemBlueprint,
} from '../../domain/entities/SocraticState';

/**
 * TutorApiClient: Pure Frontend Network Client.
 *
 * Rules (see AGENTS.md and ARCHITECTURE.md):
 * - NEVER contains API keys (Gemini / OpenAI). The backend holds them.
 * - NEVER bundles mathjs, server engines, or validator logic.
 * - Communicates with POST /api/tutor/extract and POST /api/tutor/evaluate.
 * - NEVER returns fabricated lesson content. If the backend cannot be reached,
 *   this client throws a ScanError so the UI can tell the child the truth.
 *
 * Why no offline fallback: a hardcoded lesson is served regardless of what the
 * child actually photographed, so the child is taught a problem they never
 * asked about — and any error in that hardcoded maths is taught as fact.
 * See docs/PEDAGOGY.md §2.5 and the second prohibition in AGENTS.md.
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
   * POST /api/tutor/extract
   * Camera -> Backend Vision extraction -> ProblemBlueprint + Initial Step
   */
  async extractProblem(
    imageBase64: string,
    subject: string = 'math'
  ): Promise<{
    sessionId: string;
    blueprint: ProblemBlueprint;
    initialStep: DynamicSocraticStep;
  }> {
    if (!imageBase64 || imageBase64.length < 50) {
      throw new ScanError('blurry', 'errors.blurry');
    }

    return this.postJson('/api/tutor/extract', { imageBase64, subject });
  }

  /**
   * POST /api/tutor/evaluate
   * Student Response -> Backend MathValidator + Tutor Diagnosis -> Next DynamicSocraticStep
   */
  async evaluateResponse(
    sessionId: string,
    stepId: string,
    studentResponse: string,
    state?: CompactSessionState
  ): Promise<{
    step: DynamicSocraticStep;
    updatedMastery: { masteryScore: number };
  }> {
    return this.postJson('/api/tutor/evaluate', {
      sessionId,
      stepId,
      studentResponse,
      state,
    });
  }
}

export const tutorApiClient = new TutorApiClient();
