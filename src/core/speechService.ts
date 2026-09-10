import * as Speech from 'expo-speech';

import { getSpeechLanguageTag } from './i18n';

export interface SpeechOptions {
  pitch?: number;
  rate?: number;
  language?: string;
  onStart?: () => void;
  onDone?: () => void;
  onStopped?: () => void;
  onError?: (error: Error) => void;
}

/**
 * SpeechService: Centralized safe Text-to-Speech service for Socrates Jr.
 * Uses native iOS/Android TTS engines, tunes pitch & rate for child listeners,
 * and speaks in the locale the student selected in the app (see src/core/i18n).
 */
export class SpeechService {
  private static instance: SpeechService;
  private isCurrentlySpeaking: boolean = false;

  private constructor() {}

  public static getInstance(): SpeechService {
    if (!SpeechService.instance) {
      SpeechService.instance = new SpeechService();
    }
    return SpeechService.instance;
  }

  public async isSpeaking(): Promise<boolean> {
    try {
      return await Speech.isSpeakingAsync();
    } catch {
      return this.isCurrentlySpeaking;
    }
  }

  public stop(): void {
    try {
      Speech.stop();
      this.isCurrentlySpeaking = false;
    } catch (err) {
      console.warn('[SpeechService] Error while stopping speech:', err);
    }
  }

  public speak(text: string, options?: SpeechOptions): void {
    if (!text || !text.trim()) return;

    try {
      // Stop previous utterance to avoid audio overlap
      this.stop();

      // Til foydalanuvchi tanlagan ilova tilidan olinadi (i18n). Matn ichidagi
      // so'zlarga qarab taxmin qilinmaydi: chaqiruvchi xohlasa `options.language`
      // orqali aniq BCP-47 tegini majburlay oladi.
      const lang = options?.language || getSpeechLanguageTag();
      const pitch = options?.pitch ?? 1.05; // Slightly cheerful, warm tone
      const rate = options?.rate ?? 0.88;   // Clear, gentle pace for comprehension

      this.isCurrentlySpeaking = true;

      Speech.speak(text, {
        language: lang,
        pitch,
        rate,
        onStart: () => {
          this.isCurrentlySpeaking = true;
          options?.onStart?.();
        },
        onDone: () => {
          this.isCurrentlySpeaking = false;
          options?.onDone?.();
        },
        onStopped: () => {
          this.isCurrentlySpeaking = false;
          options?.onStopped?.();
        },
        onError: (err) => {
          this.isCurrentlySpeaking = false;
          console.warn('[SpeechService] Speech synthesis error:', err);
          options?.onError?.(new Error(String(err)));
        },
      });
    } catch (error) {
      this.isCurrentlySpeaking = false;
      console.warn('[SpeechService] Failed to invoke Speech.speak:', error);
      options?.onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  }
}

export const speechService = SpeechService.getInstance();
