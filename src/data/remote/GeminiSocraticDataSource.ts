import { AppConfig } from '../../core/config';
import { SubjectType } from '../../domain/entities/Gamification';
import { SocraticPromptBuilder } from '../../domain/prompts/SocraticPromptBuilder';
import {
  SocraticProblemSession,
  SocraticStep,
  DEMO_SOCRATIC_SESSION,
  shuffleSocraticStep,
  shuffleProblemSession,
  formatEducationalMathText,
  getDemoSocraticSession,
  separateProblemContent,
} from '../../domain/entities/SocraticDialogue';
import { VoiceEvaluationResult } from '../../domain/entities/VoiceEvaluation';
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
      'gemini-3.5-flash',
      'gemini-flash-lite-latest',
      'gemini-3.7-flash',
    ];
  }

  private cleanBase64(rawBase64: string): string {
    if (rawBase64.includes(',')) {
      return rawBase64.split(',')[1];
    }
    return rawBase64.trim();
  }

  private async callGeminiWithModelFallback(
    payload: any,
    timeoutMs: number = 25000
  ): Promise<string | null> {
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
        }
      } catch (err: any) {
        clearTimeout(timeoutId);
        console.warn(`[GeminiSocraticDataSource] Model ${model} request failed:`, err?.message || err);
      }
    }

    return null;
  }

  private getSocraticJsonSchema() {
    return {
      type: 'OBJECT',
      properties: {
        isImageReadable: {
          type: 'BOOLEAN',
          description: 'Set to false if the image is too blurry, empty, or not a math/science problem. Set to true if legible.'
        },
        unreadableReason: {
          type: 'STRING',
          description: 'If isImageReadable is false, provide a short polite reason in Uzbek, e.g. "Rasm xira, iltimos qaytadan oling!"'
        },
        problemTitle: {
          type: 'STRING',
          description: 'Concise, child-friendly title of the topic (e.g. "O\'nliklar ketma-ketligi", "Chiziqli tenglamalar").',
        },
        questionText: {
          type: 'STRING',
          description: 'The exact textual instruction, question prompt, or word problem statement transcribed from the student\'s notebook/textbook (e.g. "Tushirib qoldirilgan sonlarni yozing:", "Tenglamani yeching:", or the full story problem text). NEVER omit or drop the question text!',
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
              stepTitle: { type: 'STRING', description: 'Short, clean title of this step (e.g. "Qavslarni ochish")' },
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
      required: ['equation', 'problemTitle', 'finalAnswer', 'steps'],
    };
  }

  async analyzeNotebookImage(
    base64Image: string,
    subject: SubjectType
  ): Promise<SocraticProblemSession> {
    try {
      const cleanData = this.cleanBase64(base64Image);

      const systemPrompt = SocraticPromptBuilder.buildSystemPrompt(subject);

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
          responseSchema: this.getSocraticJsonSchema(),
          temperature: 0.2,
        },
      };

      const rawText = await this.callGeminiWithModelFallback(payload, 25000);

      if (!rawText) {
        console.warn('[GeminiSocraticDataSource] All candidate models failed, using fallback session');
        return this.createFallbackSession(subject);
      }

      const parsedData: GeminiSocraticResponse = JSON.parse(rawText);
      return this.transformToDomainSession(parsedData, subject);
    } catch (error) {
      console.error('[GeminiSocraticDataSource] Vision analysis failed:', error);
      return this.createFallbackSession(subject);
    }
  }

  async generateSocraticFromText(
    problemText: string,
    subject: SubjectType
  ): Promise<SocraticProblemSession> {
    try {
      const systemPrompt = SocraticPromptBuilder.buildSystemPrompt(subject);
      const prompt = `Here is the student's typed text problem:\n"${problemText}"\n`;

      const payload = {
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: this.getSocraticJsonSchema(),
          temperature: 0.2,
        },
      };

      const rawText = await this.callGeminiWithModelFallback(payload, 15000);

      if (!rawText) {
        return this.createFallbackSession(subject);
      }

      const parsedData: GeminiSocraticResponse = JSON.parse(rawText);
      return this.transformToDomainSession(parsedData, subject);
    } catch (error) {
      console.error('[GeminiSocraticDataSource] Text analysis failed:', error);
      return this.createFallbackSession(subject);
    }
  }

  async evaluateVoiceAnswer(
    base64Audio: string,
    currentStep: SocraticStep,
    subject: SubjectType
  ): Promise<VoiceEvaluationResult> {
    try {
      const cleanAudio = this.cleanBase64(base64Audio);

      const systemPrompt = `
You are Socrates Jr., an affectionate and brilliant AI tutor for children in ${subject.toUpperCase()}.
A student spoke their answer via microphone for the following Socratic question:

QUESTION: "${currentStep.tutorQuestion}"
AVAILABLE CHOICES: ${JSON.stringify(currentStep.quickOptions)}
EXPECTED CORRECT CHOICE: "${currentStep.quickOptions[currentStep.correctOptionIndex] || ''}" (Index: ${currentStep.correctOptionIndex})

LANGUAGE & AUDIO INSTRUCTIONS:
1. The student may speak in Uzbek, English, or Russian (e.g. "to'rt", "variant A", "four", "hadlarni o'tkazish").
2. Transcribe exactly what was spoken in 'transcription'. If audio is completely silent or background noise, set transcription to "(No clear speech heard)".
3. Determine 'isCorrect': true if their answer matches the correct idea or option.
4. If it matches a choice, set 'matchedOptionIndex' (0, 1, or 2). If not, set -1.
5. Provide 'feedbackText' in friendly, enthusiastic language matching the student's question/language (Uzbek or English).
   - If correct: celebrate joyfully!
   - If incorrect: give a warm, encouraging hint without scolding.
   - If silent: kindly ask them to speak a little louder or tap a card.
6. Award 'xpEarned': ${currentStep.xpReward || 25} XP if correct, 5 XP for trying.
`;

      const voiceSchema = {
        type: 'OBJECT',
        properties: {
          transcription: {
            type: 'STRING',
            description: "Transcribed words spoken by the child.",
          },
          isCorrect: {
            type: 'BOOLEAN',
            description: 'Whether the child answered correctly.',
          },
          matchedOptionIndex: {
            type: 'INTEGER',
            description: '0-based index of matched option or -1.',
          },
          feedbackText: {
            type: 'STRING',
            description: 'Warm, positive feedback for the child in English.',
          },
          xpEarned: {
            type: 'INTEGER',
            description: 'XP points earned.',
          },
        },
        required: [
          'transcription',
          'isCorrect',
          'matchedOptionIndex',
          'feedbackText',
          'xpEarned',
        ],
      };

      const payload = {
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: 'audio/m4a',
                  data: cleanAudio,
                },
              },
              {
                text: systemPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: voiceSchema,
          temperature: 0.1,
        },
      };

      const rawText = await this.callGeminiWithModelFallback(payload, 15000);

      if (!rawText) {
        return this.createLocalVoiceEvaluation(currentStep, '');
      }

      const parsed = JSON.parse(rawText);
      const isCorrect = Boolean(parsed.isCorrect);

      return {
        isCorrect,
        transcription: parsed.transcription || '(Audio eshitildi)',
        matchedOptionIndex: typeof parsed.matchedOptionIndex === 'number'
          ? parsed.matchedOptionIndex
          : (isCorrect ? currentStep.correctOptionIndex : -1),
        feedbackText: parsed.feedbackText || (isCorrect ? "Barakalla! To'g'ri topding!" : "Qayta o'ylab ko'r-chi!"),
        xpEarned: isCorrect ? (parsed.xpEarned || currentStep.xpReward || 25) : 5,
      };
    } catch (error) {
      console.warn('[GeminiSocraticDataSource] Voice evaluation error, using fallback:', error);
      return this.createLocalVoiceEvaluation(currentStep, '');
    }
  }

  private createLocalVoiceEvaluation(
    currentStep: SocraticStep,
    spokenText: string
  ): VoiceEvaluationResult {
    const cleanSpoken = spokenText.toLowerCase().trim();
    const correctOptionText = (currentStep.quickOptions[currentStep.correctOptionIndex] || '').toLowerCase().trim();

    const isMatch =
      cleanSpoken.includes(correctOptionText) ||
      correctOptionText.includes(cleanSpoken) ||
      cleanSpoken.includes('ha') ||
      cleanSpoken.includes('to\'g\'ri') ||
      cleanSpoken.includes('yes') ||
      cleanSpoken.includes('correct');

    return {
      isCorrect: isMatch,
      transcription: spokenText || 'Ovoz eshitildi',
      matchedOptionIndex: isMatch ? currentStep.correctOptionIndex : (currentStep.correctOptionIndex + 1) % currentStep.quickOptions.length,
      feedbackText: isMatch ? "Ajoyib! To'g'ri javob berding!" : "Yaxshi urinish! Keling, birgalikda yana o'ylab ko'ramiz.",
      xpEarned: currentStep.xpReward || 25,
    };
  }

  private transformToDomainSession(
    data: GeminiSocraticResponse,
    subject: SubjectType
  ): SocraticProblemSession {
    const totalSteps = data.steps.length;
    const domainSteps: SocraticStep[] = data.steps.map((s, idx) => {
      const stepTitleText = s.stepTitle || `${idx + 1}-qadam • Tahlil`;
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

  private createFallbackSession(subject: SubjectType): SocraticProblemSession {
    return getDemoSocraticSession(subject);
  }
}
