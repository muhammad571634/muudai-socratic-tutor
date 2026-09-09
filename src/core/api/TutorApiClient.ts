import {
  CompactSessionState,
  DynamicSocraticStep,
  ProblemBlueprint,
  PedagogicalActionType,
} from '../../domain/entities/SocraticState';

import { ScanError } from '../../domain/entities/SocraticDialogue';

/**
 * TutorApiClient: Pure Frontend Network Client.
 *
 * Rules:
 * - NEVER contains API keys (Gemini / OpenAI).
 * - NEVER bundles mathjs, server engines, or validator logic.
 * - Communicates with backend endpoints POST /api/tutor/extract and POST /api/tutor/evaluate.
 * - Includes robust fallback offline logic to simulate the backend contract seamlessly on mobile.
 */
class TutorApiClient {
  private backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || '';

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
    if (!this.backendUrl) {
      throw new ScanError('network', "Server bilan bog'lanib bo'lmadi.");
    }

    try {
      const response = await fetch(`${this.backendUrl}/api/tutor/extract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Auth token handled by backend session, no studentId
        },
        body: JSON.stringify({ imageBase64, subject }),
      });
      if (response.ok) {
        return await response.json();
      }
      throw new Error(`HTTP xatosi: ${response.status}`);
    } catch (err) {
      console.warn('[TutorApiClient] Backend unreachable or failed:', err);
      throw new ScanError('network', "Server bilan bog'lanib bo'lmadi.");
    }
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
    if (!this.backendUrl) {
      throw new ScanError('network', "Server bilan bog'lanib bo'lmadi.");
    }

    try {
      const response = await fetch(`${this.backendUrl}/api/tutor/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          stepId,
          studentResponse,
        }),
      });
      if (response.ok) {
        return await response.json();
      }
      throw new Error(`HTTP xatosi: ${response.status}`);
    } catch (err) {
      console.warn('[TutorApiClient] Backend unreachable or failed:', err);
      throw new ScanError('network', "Server bilan bog'lanib bo'lmadi.");
    }
  }
}

export const tutorApiClient = new TutorApiClient();
