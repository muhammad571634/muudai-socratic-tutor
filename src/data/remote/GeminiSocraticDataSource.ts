import { AppConfig } from '../../core/config';
import { SubjectType } from '../../domain/entities/Gamification';
import { AppLocale, toPromptLanguageName } from '../../domain/entities/Locale';
import { SocraticPromptBuilder } from '../../domain/prompts/SocraticPromptBuilder';
import { ScanError } from '../../domain/entities/SocraticDialogue';
import { SocraticLesson } from '../../domain/entities/SocraticLesson';
import { ISocraticAiRepository } from '../../domain/repositories/ISocraticAiRepository';
import {
  LessonResponsePayload,
  MISCONCEPTION_TAGS,
  toSocraticLesson,
} from './lessonPayload';

export class GeminiSocraticDataSource implements ISocraticAiRepository {
  private readonly apiKey: string;
  private readonly model: string;
  private readonly endpoint: string;

  private readonly candidateModels: string[];

  constructor() {
    this.apiKey = AppConfig.gemini.apiKey;
    this.model = AppConfig.gemini.model;
    this.endpoint = AppConfig.gemini.endpoint;
    this.candidateModels = [
      this.model,
      'gemini-3.7-flash',
    ];
  }

  private cleanBase64(rawBase64: string): string {
    if (rawBase64.includes(',')) {
      return rawBase64.split(',')[1];
    }
    return rawBase64.trim();
  }

  /**
   * Oxirgi nosozlik sababi. Bola "Wi-Fi ni tekshir" degan xabarni faqat
   * haqiqatan tarmoq muammosi bo'lganda ko'rishi kerak — model nomi noto'g'ri
   * (404), kalit yaroqsiz (401/403) yoki limit tugagan (429) bo'lsa emas.
   */
  private lastFailureReason: 'network' | 'config' | 'quota' | 'unknown' = 'unknown';

  private failureToScanError(): ScanError {
    switch (this.lastFailureReason) {
      case 'network':
        return new ScanError('network', 'errors.network');
      case 'quota':
        return new ScanError('unknown', 'errors.quota');
      case 'config':
        // Bu dasturchi xatosi — bolaga texnik tafsilot ko'rsatilmaydi,
        // lekin konsolga aniq yoziladi.
        return new ScanError('unknown', 'errors.service');
      default:
        return new ScanError('unknown', 'errors.analysisFailed');
    }
  }

  private async callGeminiWithModelFallback(
    payload: unknown,
    timeoutMs: number = 25000
  ): Promise<string | null> {
    this.lastFailureReason = 'unknown';
    for (const model of this.candidateModels) {
      const url = `${this.endpoint}/${model}:generateContent?key=${this.apiKey}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const json = await response.json();
          const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return text;
          }
        } else {
          console.warn(`[GeminiSocraticDataSource] Model ${model} returned status ${response.status}`);
          if (response.status === 404 || response.status === 400) {
            // Model nomi noto'g'ri yoki so'rov formati buzilgan — dasturchi xatosi
            this.lastFailureReason = 'config';
          } else if (response.status === 401 || response.status === 403) {
            this.lastFailureReason = 'config';
          } else if (response.status === 429) {
            this.lastFailureReason = 'quota';
          } else if (response.status >= 500) {
            this.lastFailureReason = 'network';
          }
        }
      } catch (err) {
        clearTimeout(timeoutId);
        console.warn(`[GeminiSocraticDataSource] Model ${model} request failed:`, err);
        this.lastFailureReason = 'network';
      }
    }

    return null;
  }

  private getSocraticJsonSchema(locale: AppLocale) {
    const languageName = toPromptLanguageName(locale);
    return {
      type: 'OBJECT',
      properties: {
        isImageReadable: {
          type: 'BOOLEAN',
          description: 'Set to false if the image is too blurry, empty, or not a math/science problem. Set to true if legible.'
        },
        unreadableReason: {
          type: 'STRING',
          description: `If isImageReadable is false, provide a short polite reason written in ${languageName}.`
        },
        problemTitle: {
          type: 'STRING',
          description: `Concise, child-friendly title of the topic (e.g. "Number sequences", "Linear equations"), written in ${languageName}.`,
        },
        questionText: {
          type: 'STRING',
          description: 'The exact textual instruction, question prompt, or word problem statement transcribed VERBATIM from the student\'s notebook/textbook (e.g. "Write the missing numbers:", "Solve the equation:", or the full story problem text). Keep the original wording and language of the notebook. NEVER omit or drop the question text!',
        },
        equation: {
          type: 'STRING',
          description: 'The mathematical expression, numbers sequence, equation, or formulas from the problem (e.g. "10, 20, 30, _, 50, 60, _, 80, 90", "5x - 20 = 2x + 12").',
        },
        steps: {
          type: 'ARRAY',
          description: `2 to 4 progressive Socratic steps. NEVER reveal the final answer in any step: the child must derive it by assembling the last step. Every user-facing string must be written in ${languageName}.`,
          items: {
            type: 'OBJECT',
            properties: {
              stepNumber: { type: 'INTEGER' },
              format: {
                type: 'STRING',
                enum: ['STEP_BUILDER', 'MULTIPLE_CHOICE'],
                description: 'Use STEP_BUILDER (preferred, ~2 of every 3 steps) when the child must PERFORM an operation and write the next line of the solution. Use MULTIPLE_CHOICE only when the child must DECIDE something conceptual ("which rule applies first?").',
              },
              question: {
                type: 'STRING',
                description: `ONE short sentence, at most 12 words, written in ${languageName}. This is the only question text on screen — do not add a title, an explanation or a summary.`,
              },
              expectedExpression: {
                type: 'STRING',
                description: 'STEP_BUILDER only. The line the child should end up with, as a plain machine-readable expression (e.g. "5x - 20 = 2x + 12"). Used for server-side mathematical verification.',
              },
              correctTiles: {
                type: 'ARRAY',
                items: { type: 'STRING' },
                description: 'STEP_BUILDER only. 3 to 6 tiles that form expectedExpression, IN THE CORRECT ORDER. Tile granularity must match the concept the step teaches: if the step teaches expanding brackets, use "5x" and "-20" as whole tiles, never "5", "*", "x".',
              },
              distractorTiles: {
                type: 'ARRAY',
                description: 'STEP_BUILDER only. 2 to 4 wrong tiles. Each must be a mistake a real child makes, not a random token.',
                items: {
                  type: 'OBJECT',
                  properties: {
                    label: { type: 'STRING' },
                    misconceptionTag: {
                      type: 'STRING',
                      enum: [...MISCONCEPTION_TAGS],
                      description: 'Which misunderstanding this wrong tile reveals.',
                    },
                  },
                  required: ['label', 'misconceptionTag'],
                },
              },
              options: {
                type: 'ARRAY',
                description: 'MULTIPLE_CHOICE only. Exactly 3 options: one correct, two built from real misconceptions. An option must never contain the reasoning or the answer.',
                items: {
                  type: 'OBJECT',
                  properties: {
                    label: { type: 'STRING' },
                    isCorrect: { type: 'BOOLEAN' },
                    misconceptionTag: { type: 'STRING', enum: [...MISCONCEPTION_TAGS] },
                  },
                  required: ['label', 'isCorrect'],
                },
              },
              hintLadder: {
                type: 'ARRAY',
                description: 'Exactly 5 rungs, levels 1 to 5, in order. Help must get more concrete without EVER stating the answer. For STEP_BUILDER the actions are ENCOURAGE, REVEAL_SLOT_COUNT, PLACE_FIRST_TILE, NARROW_CHOICES, SKIP_STEP. For MULTIPLE_CHOICE they are ENCOURAGE, EXPLAIN_WHY, SIMPLER_EXAMPLE, NARROW_CHOICES, SKIP_STEP.',
                items: {
                  type: 'OBJECT',
                  properties: {
                    level: { type: 'INTEGER' },
                    action: { type: 'STRING' },
                    message: {
                      type: 'STRING',
                      description: `Optional short encouragement or explanation in ${languageName}. Leave empty when the action speaks for itself.`,
                    },
                  },
                  required: ['level', 'action'],
                },
              },
              xpReward: { type: 'INTEGER' },
            },
            required: ['stepNumber', 'format', 'question', 'hintLadder'],
          },
        },
      },
      // isImageReadable MAJBURIY: aks holda model uni tushirib qoldiradi va
      // xira rasm tekshiruvi (=== false) hech qachon ishlamaydi.
      required: ['isImageReadable', 'equation', 'problemTitle', 'steps'],
    };
  }

  async analyzeNotebookImage(
    base64Image: string,
    subject: SubjectType,
    locale: AppLocale
  ): Promise<SocraticLesson> {
    try {
      const cleanData = this.cleanBase64(base64Image);

      const systemPrompt = SocraticPromptBuilder.buildSystemPrompt(subject, locale);

      const payload = {
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: cleanData,
                },
              },
              {
                text: "Please read this student's notebook or screen carefully and transcribe the math/science problem verbatim. If the image is extremely blurry, cut off, or not related to a subject, set isImageReadable to false and explain why. Otherwise, set it to true and provide the pedagogical Socratic breakdown.",
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: this.getSocraticJsonSchema(locale),
          temperature: 0.2,
        },
      };

      const rawText = await this.callGeminiWithModelFallback(payload, 25000);

      if (!rawText) {
        throw this.failureToScanError();
      }

      const parsedData: LessonResponsePayload = JSON.parse(rawText);
      if (parsedData.isImageReadable === false) {
        throw new ScanError('blurry', 'errors.blurry');
      }
      return toSocraticLesson(parsedData, subject, 'GeminiSocraticDataSource');
    } catch (error) {
      console.error('[GeminiSocraticDataSource] Vision analysis failed:', error);
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
      const systemPrompt = SocraticPromptBuilder.buildSystemPrompt(subject, locale);
      const prompt = `Here is the student's typed text problem:\n"${problemText}"\n`;

      const payload = {
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: this.getSocraticJsonSchema(locale),
          temperature: 0.2,
        },
      };

      const rawText = await this.callGeminiWithModelFallback(payload, 15000);

      if (!rawText) {
        throw this.failureToScanError();
      }

      const parsedData: LessonResponsePayload = JSON.parse(rawText);
      return toSocraticLesson(parsedData, subject, 'GeminiSocraticDataSource');
    } catch (error) {
      console.error('[GeminiSocraticDataSource] Text analysis failed:', error);
      if (error && typeof error === 'object' && 'name' in error && (error as Error).name === 'ScanError') {
        throw error as ScanError;
      }
      throw new ScanError('unknown', 'errors.analysisUnknown');
    }
  }

}
