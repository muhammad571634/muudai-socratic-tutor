/**
 * Bolaning ovozli javobini tahlil qilish natijalari uchun Domen Entity
 */
export interface VoiceEvaluationResult {
  transcription: string;
  isCorrect: boolean;
  matchedOptionIndex: number;
  feedbackText: string;
  xpEarned: number;
}

export type VoiceRecordingState = 'idle' | 'recording' | 'analyzing' | 'success' | 'error';
