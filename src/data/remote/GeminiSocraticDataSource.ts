import { AppConfig } from '../../core/config';
import i18n from '../../core/i18n';
import { SubjectType } from '../../domain/entities/Gamification';
import { AppLocale, toPromptLanguageName } from '../../domain/entities/Locale';
import { SocraticPromptBuilder } from '../../domain/prompts/SocraticPromptBuilder';
import {
  SocraticProblemSession,
  SocraticStep,
  shuffleSocraticStep,
  formatEducationalMathText,
  separateProblemContent,
  ScanError,
} from '../../domain/entities/SocraticDialogue';
import { ISocraticAiRepository } from '../../domain/repositories/ISocraticAiRepository';

interface GeminiStepPayload {
  stepNumber: number;
  stepTitle: string;
  tutorExplanation?: string;
  tutorQuestion: string;
  explanationSnippet?: string;
  quickOptions: string[];
  correctOptionIndex: number;
  hintText: string;
  xpReward?: number;
}

interface GeminiSocraticResponse {
  // Model rasmni o'qiy oldimi. JSON sxemada e'lon qilingan (getSocraticJsonSchema),
  // shuning uchun bu yerda ham bo'lishi shart — aks holda tekshiruv o'tkazib yuboriladi.
  isImageReadable?: boolean;
  unreadableReason?: string;
  equation: string;
  problemTitle: string;
  questionText?: string;
  finalAnswer: string;
  steps: GeminiStepPayload[];
}

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
    payload: any,
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
      } catch (err: any) {
        clearTimeout(timeoutId);
        console.warn(`[GeminiSocraticDataSource] Model ${model} request failed:`, err?.message || err);
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
        finalAnswer: {
          type: 'STRING',
          description: 'The verified final correct answer with celebratory icon.',
        },
        steps: {
          type: 'ARRAY',
          description: '2 to 3 progressive Socratic steps leading the child to find the solution.',
          items: {
            type: 'OBJECT',
            properties: {
              stepNumber: { type: 'INTEGER' },
              stepTitle: { type: 'STRING', description: `Short, clean title of this step (e.g. "Expanding the brackets"), written in ${languageName}.` },
              tutorExplanation: {
                type: 'STRING',
                description: 'Deep, clear 3-5 sentence pedagogical explanation of the rule, why it applies, and the step-by-step logic, like an expert tutor explaining in a clean white notebook.',
              },
              tutorQuestion: {
                type: 'STRING',
                description: 'Gentle Socratic question directing the child to the first logical sub-step.',
              },
              explanationSnippet: {
                type: 'STRING',
                description: 'Helpful conceptual tip explaining the rule without solving it completely.',
              },
              quickOptions: {
                type: 'ARRAY',
                items: { type: 'STRING' },
                description: '3 interactive choices for the student: one correct next move, two common misconceptions.',
              },
              correctOptionIndex: {
                type: 'INTEGER',
                description: '0-based index of the correct option in quickOptions array.',
              },
              hintText: {
                type: 'STRING',
                description: 'Encouraging hint if the child gets stuck.',
              },
              xpReward: { type: 'INTEGER' },
            },
            required: [
              'stepNumber',
              'stepTitle',
              'tutorExplanation',
              'tutorQuestion',
              'quickOptions',
              'correctOptionIndex',
              'hintText',
            ],
          },
        },
      },
      // isImageReadable MAJBURIY: aks holda model uni tushirib qoldiradi va
      // xira rasm tekshiruvi (=== false) hech qachon ishlamaydi.
      required: ['isImageReadable', 'equation', 'problemTitle', 'finalAnswer', 'steps'],
    };
  }

  async analyzeNotebookImage(
    base64Image: string,
    subject: SubjectType,
    locale: AppLocale
  ): Promise<SocraticProblemSession> {
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

      const parsedData: GeminiSocraticResponse = JSON.parse(rawText);
      if (parsedData.isImageReadable === false) {
        throw new ScanError('blurry', 'errors.blurry');
      }
      return this.transformToDomainSession(parsedData, subject, locale);
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
  ): Promise<SocraticProblemSession> {
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

      const parsedData: GeminiSocraticResponse = JSON.parse(rawText);
      return this.transformToDomainSession(parsedData, subject, locale);
    } catch (error) {
      console.error('[GeminiSocraticDataSource] Text analysis failed:', error);
      if (error && typeof error === 'object' && 'name' in error && (error as Error).name === 'ScanError') {
        throw error as ScanError;
      }
      throw new ScanError('unknown', 'errors.analysisUnknown');
    }
  }

  private transformToDomainSession(
    data: GeminiSocraticResponse,
    subject: SubjectType,
    locale: AppLocale
  ): SocraticProblemSession {
    // Model biror maydonni tushirib qoldirsa ishlatiladigan zaxira matnlar.
    // Ular ham bola tanlagan tilda bo'lishi kerak — ilgari o'zbekcha qotib
    // qolgan edi va inglizcha darsning o'rtasida o'zbekcha jumla chiqardi.
    const tr = (key: string, params?: Record<string, string | number>) =>
      i18n.t(`session.fallback.${key}`, { lng: locale, ...(params ?? {}) });

    const totalSteps = data.steps.length;
    const domainSteps: SocraticStep[] = data.steps.map((s, idx) => {
      const stepTitleText = s.stepTitle || tr('stepTitle', { number: idx + 1 });
      const rawStep: SocraticStep = {
        id: `step_${idx + 1}_${Date.now()}`,
        stepNumber: s.stepNumber || idx + 1,
        totalSteps,
        stepTitle: formatEducationalMathText(stepTitleText),
        questionHeadline: formatEducationalMathText(stepTitleText),
        tutorExplanation: s.tutorExplanation ? formatEducationalMathText(s.tutorExplanation) : undefined,
        tutorQuestion: formatEducationalMathText(s.tutorQuestion),
        explanationSnippet: s.explanationSnippet ? formatEducationalMathText(s.explanationSnippet) : tr('explanationSnippet'),
        quickOptions: s.quickOptions || [tr('optionA'), tr('optionB'), tr('optionC')],
        correctOptionIndex: typeof s.correctOptionIndex === 'number' ? s.correctOptionIndex : 0,
        hintText: formatEducationalMathText(s.hintText || tr('hintText')),
        xpReward: s.xpReward || 25,
      };
      return shuffleSocraticStep(rawStep);
    });

    const { instruction, equation: separatedEquation } = separateProblemContent(
      data.equation,
      data.questionText
    );

    return {
      id: `session_${Date.now()}`,
      subject,
      equation: separatedEquation || formatEducationalMathText(data.equation || tr('equation')),
      questionText: instruction,
      problemTitle: formatEducationalMathText(data.problemTitle || tr('problemTitle')),
      steps: domainSteps,
      finalAnswer: formatEducationalMathText(data.finalAnswer || tr('finalAnswer')),
      totalXpReward: domainSteps.reduce((acc, step) => acc + step.xpReward, 25),
    };
  }

}
