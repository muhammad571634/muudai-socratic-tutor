import { AppConfig } from '../../core/config';
import { SubjectType } from '../../domain/entities/Gamification';
import { SocraticPromptBuilder } from '../../domain/prompts/SocraticPromptBuilder';
import {
  SocraticProblemSession,
  SocraticStep,
  shuffleSocraticStep,
  formatEducationalMathText,
  getDemoSocraticSession,
  separateProblemContent,
  ScanError
} from '../../domain/entities/SocraticDialogue';
import { ISocraticAiRepository } from '../../domain/repositories/ISocraticAiRepository';

interface OpenAiStepPayload {
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

interface OpenAiSocraticResponse {
  isImageReadable?: boolean;
  unreadableReason?: string;
  equation: string;
  problemTitle: string;
  questionText?: string;
  finalAnswer: string;
  steps: OpenAiStepPayload[];
}

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

  private cleanBase64(rawBase64: string): string {
    if (rawBase64.includes(',')) {
      return rawBase64.split(',')[1];
    }
    return rawBase64.trim();
  }

  private async callOpenAi(
    messages: any[],
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
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn('[OpenAiSocraticDataSource] Request failed:', err?.message || err);
    }

    return null;
  }

  async analyzeNotebookImage(
    base64Image: string,
    subject: SubjectType
  ): Promise<SocraticProblemSession> {
    try {
      const cleanData = this.cleanBase64(base64Image);
      const systemPrompt = SocraticPromptBuilder.buildSystemPrompt(subject) +
        '\n\nYou MUST reply in valid JSON format matching this structure:\n' +
        JSON.stringify({
          isImageReadable: true,
          unreadableReason: '',
          problemTitle: 'Topic Title',
          questionText: 'Exact problem text from textbook',
          equation: 'Numbers or equation',
          finalAnswer: 'Final result',
          steps: [
            {
              stepNumber: 1,
              stepTitle: 'Step title',
              tutorExplanation: 'Pedagogical explanation in friendly language',
              tutorQuestion: 'Socratic guiding question',
              explanationSnippet: 'Brief hint',
              quickOptions: ['Option A', 'Option B', 'Option C'],
              correctOptionIndex: 0,
              hintText: 'Hint for student',
              xpReward: 25,
            },
          ],
        });

      const messages = [
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
        throw new ScanError('network', "Internet ulanishida muammo bor. Wi-Fi ni tekshirib ko'r!");
      }

      const parsedData: OpenAiSocraticResponse = JSON.parse(rawText);

      if (parsedData.isImageReadable === false) {
        throw new ScanError('blurry', parsedData.unreadableReason || "Rasm biroz xira chiqdi \uD83D\uDE05 Qani, yana bir marta urinamiz!");
      }

      return this.transformToDomainSession(parsedData, subject);
    } catch (error) {
      console.error('[OpenAiSocraticDataSource] Vision analysis error:', error);
      if (error && typeof error === 'object' && 'name' in error && (error as Error).name === 'ScanError') {
        throw error as ScanError;
      }
      throw new ScanError('unknown', "Tahlil qilishda noma'lum xatolik yuz berdi.");
    }
  }

  async generateSocraticFromText(
    problemText: string,
    subject: SubjectType
  ): Promise<SocraticProblemSession> {
    try {
      const systemPrompt = SocraticPromptBuilder.buildSystemPrompt(subject) +
        '\n\nYou MUST reply in valid JSON format.';

      const messages = [
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
        throw new ScanError('network', "Internet ulanishida muammo bor. Wi-Fi ni tekshirib ko'r!");
      }

      const parsedData: OpenAiSocraticResponse = JSON.parse(rawText);
      return this.transformToDomainSession(parsedData, subject);
    } catch (error) {
      console.error('[OpenAiSocraticDataSource] Text analysis failed:', error);
      if (error && typeof error === 'object' && 'name' in error && (error as Error).name === 'ScanError') {
        throw error as ScanError;
      }
      throw new ScanError('unknown', "Tahlil qilishda noma'lum xatolik yuz berdi.");
    }
  }

  private transformToDomainSession(
    data: OpenAiSocraticResponse,
    subject: SubjectType
  ): SocraticProblemSession {
    const totalSteps = data.steps.length;
    const domainSteps: SocraticStep[] = data.steps.map((s, idx) => {
      const stepTitleText = s.stepTitle || `${idx + 1}-qadam - Tahlil`;
      const rawStep: SocraticStep = {
        id: `step_${idx + 1}_${Date.now()}`,
        stepNumber: s.stepNumber || idx + 1,
        totalSteps,
        stepTitle: formatEducationalMathText(stepTitleText),
        questionHeadline: formatEducationalMathText(stepTitleText),
        tutorExplanation: s.tutorExplanation ? formatEducationalMathText(s.tutorExplanation) : undefined,
        tutorQuestion: formatEducationalMathText(s.tutorQuestion),
        explanationSnippet: s.explanationSnippet ? formatEducationalMathText(s.explanationSnippet) : "Asosiy qoidani eslaymiz.",
        quickOptions: s.quickOptions || ['Variant A', 'Variant B', 'Variant C'],
        correctOptionIndex: typeof s.correctOptionIndex === 'number' ? s.correctOptionIndex : 0,
        hintText: formatEducationalMathText(s.hintText || "Masalani kichikroq bo'laklarga ajratib ko'ring."),
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
      equation: separatedEquation || formatEducationalMathText(data.equation || 'Daftardagi masala'),
      questionText: instruction,
      problemTitle: formatEducationalMathText(data.problemTitle || 'Sokratik Yechim'),
      steps: domainSteps,
      finalAnswer: formatEducationalMathText(data.finalAnswer || "Ajoyib! Masala to'liq yechildi!"),
      totalXpReward: domainSteps.reduce((acc, step) => acc + step.xpReward, 25),
    };
  }

}
