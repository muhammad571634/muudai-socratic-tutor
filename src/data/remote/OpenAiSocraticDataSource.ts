import { AppConfig } from '../../core/config';
import { SubjectType } from '../../domain/entities/Gamification';
import { AppLocale } from '../../domain/entities/Locale';
import { SocraticPromptBuilder } from '../../domain/prompts/SocraticPromptBuilder';
import { ScanError } from '../../domain/entities/SocraticDialogue';
import { SocraticLesson } from '../../domain/entities/SocraticLesson';
import { ISocraticAiRepository } from '../../domain/repositories/ISocraticAiRepository';
import {
  LessonResponsePayload,
  MISCONCEPTION_TAGS,
  toSocraticLesson,
} from './lessonPayload';

/** OpenAI chat message — matn yoki matn+rasm qismlaridan iborat. */
type OpenAiMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string | Array<Record<string, unknown>>;
};

/**
 * OpenAiSocraticDataSource: Implementation of ISocraticAiRepository for OpenAI ChatGPT
 * (e.g. gpt-4o, gpt-4o-mini). Production-ready and interchangeable with Gemini.
 */
export class OpenAiSocraticDataSource implements ISocraticAiRepository {
  private readonly apiKey: string;
  private readonly model: string;
  private readonly endpoint: string;

  constructor() {
    this.apiKey = AppConfig.openai.apiKey;
    this.model = AppConfig.openai.model;
    this.endpoint = AppConfig.openai.endpoint;
  }

  /**
   * Sokratik prompt + qat'iy JSON shartnomasi.
   *
   * OpenAI'da Gemini'dagi kabi `responseSchema` yo'q, shuning uchun shakl
   * promptning o'zida beriladi. Ikkala kirish nuqtasi ham shu bitta
   * shartnomani ishlatadi — aks holda rasm va matn yo'llari bir-biridan
   * ajralib ketadi.
   */
  private buildJsonContract(subject: SubjectType, locale: AppLocale): string {
    return SocraticPromptBuilder.buildSystemPrompt(subject, locale) +
      '\n\nYou MUST reply in valid JSON format matching this structure:\n' +
      JSON.stringify({
        isImageReadable: true,
        unreadableReason: '',
        problemTitle: 'Topic title',
        questionText: 'Exact problem text transcribed from the notebook',
        equation: 'Numbers or equation',
        steps: [
          {
            stepNumber: 1,
            format: 'STEP_BUILDER',
            question: 'One short question, at most 12 words',
            expectedExpression: '5x - 20 = 2x + 12',
            correctTiles: ['5x', '-20', '=', '2x', '+12'],
            distractorTiles: [
              { label: '5x-4', misconceptionTag: 'distribution_error' },
              { label: '+6', misconceptionTag: 'sign_error' },
            ],
            hintLadder: [
              { level: 1, action: 'ENCOURAGE', message: 'Short encouragement' },
              { level: 2, action: 'REVEAL_SLOT_COUNT' },
              { level: 3, action: 'PLACE_FIRST_TILE' },
              { level: 4, action: 'NARROW_CHOICES' },
              { level: 5, action: 'SKIP_STEP', message: 'This one was hard, we will come back to it' },
            ],
            xpReward: 25,
          },
        ],
      }) +
      `\n\nRules:
- 2 to 4 steps. NEVER reveal the final answer anywhere: the child derives it by assembling the last step.
- Prefer format STEP_BUILDER (about 2 of every 3 steps): the child performs the operation and builds the next line. Use MULTIPLE_CHOICE (exactly 3 options, each {label, isCorrect, misconceptionTag}) only for conceptual "which rule applies?" decisions.
- correctTiles: 3 to 6 tiles in the CORRECT order. Tile granularity matches the concept taught: for expanding brackets use "5x" and "-20" as whole tiles, never "5", "*", "x".
- distractorTiles: 2 to 4 wrong tiles, each a mistake a real child makes, tagged with one of ${MISCONCEPTION_TAGS.join(', ')}.
- hintLadder: exactly 5 rungs, levels 1..5, growing more concrete, never stating the answer.
- Every user-facing string is written in the student's language.`;
  }

  private cleanBase64(rawBase64: string): string {
    if (rawBase64.includes(',')) {
      return rawBase64.split(',')[1];
    }
    return rawBase64.trim();
  }

  private async callOpenAi(
    messages: OpenAiMessage[],
    timeoutMs: number = 25000
  ): Promise<string | null> {
    if (!this.apiKey) {
      console.warn('[OpenAiSocraticDataSource] No OpenAI API key configured.');
      return null;
    }

    const url = `${this.endpoint}/chat/completions`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          response_format: { type: 'json_object' },
          messages,
          temperature: 0.2,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        const text = json?.choices?.[0]?.message?.content;
        if (text) {
          return text;
        }
      } else {
        console.warn(`[OpenAiSocraticDataSource] Returned status ${response.status}`);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn('[OpenAiSocraticDataSource] Request failed:', err);
    }

    return null;
  }

  async analyzeNotebookImage(
    base64Image: string,
    subject: SubjectType,
    locale: AppLocale
  ): Promise<SocraticLesson> {
    try {
      const cleanData = this.cleanBase64(base64Image);
      const systemPrompt = this.buildJsonContract(subject, locale);

      const messages: OpenAiMessage[] = [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: "Please read this student's notebook or screen carefully and transcribe the math/science problem verbatim. If the image is extremely blurry, cut off, or not related to a subject, set isImageReadable to false and explain why in unreadableReason. Otherwise, set it to true and provide the pedagogical Socratic breakdown.",
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${cleanData}`,
              },
            },
          ],
        },
      ];

      const rawText = await this.callOpenAi(messages, 25000);

      if (!rawText) {
        throw new ScanError('network', 'errors.network');
      }

      const parsedData: LessonResponsePayload = JSON.parse(rawText);

      if (parsedData.isImageReadable === false) {
        throw new ScanError('blurry', 'errors.blurry');
      }

      return toSocraticLesson(parsedData, subject, 'OpenAiSocraticDataSource');
    } catch (error) {
      console.error('[OpenAiSocraticDataSource] Vision analysis error:', error);
      if (error && typeof error === 'object' && 'name' in error && (error as Error).name === 'ScanError') {
        throw error as ScanError;
      }
      throw new ScanError('unknown', 'errors.analysisUnknown');
    }
  }

  async generateSocraticFromText(
    problemText: string,
    subject: SubjectType,
    locale: AppLocale
  ): Promise<SocraticLesson> {
    try {
      const systemPrompt = this.buildJsonContract(subject, locale);

      const messages: OpenAiMessage[] = [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Here is the student's typed text problem:\n"${problemText}"\n`,
        },
      ];

      const rawText = await this.callOpenAi(messages, 15000);

      if (!rawText) {
        throw new ScanError('network', 'errors.network');
      }

      const parsedData: LessonResponsePayload = JSON.parse(rawText);
      return toSocraticLesson(parsedData, subject, 'OpenAiSocraticDataSource');
    } catch (error) {
      console.error('[OpenAiSocraticDataSource] Text analysis failed:', error);
      if (error && typeof error === 'object' && 'name' in error && (error as Error).name === 'ScanError') {
        throw error as ScanError;
      }
      throw new ScanError('unknown', 'errors.analysisUnknown');
    }
  }

}
