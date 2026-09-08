import { useState, useCallback } from 'react';
import { useAudioRecorder } from './useAudioRecorder';
import { GeminiSocraticDataSource } from '../../data/remote/GeminiSocraticDataSource';
import { SocraticStep } from '../../domain/entities/SocraticDialogue';
import { SubjectType } from '../../domain/entities/Gamification';
import { VoiceEvaluationResult, VoiceRecordingState } from '../../domain/entities/VoiceEvaluation';
import { useGamificationStore } from '../state/useGamificationStore';
import { useMistakeStore } from '../state/useMistakeStore';
import { useVoiceStore } from '../state/useVoiceStore';
import { HapticFeedback } from '../../core/haptics';

const geminiDataSource = new GeminiSocraticDataSource();

export interface UseVoiceAnswerHandlerProps {
  currentStep: SocraticStep;
  subject: SubjectType;
  onCorrectAnswer: (matchedOptionIndex: number) => void;
  onWrongAnswer?: (feedbackText: string) => void;
}

export interface UseVoiceAnswerHandlerResult {
  recordingState: VoiceRecordingState;
  isRecording: boolean;
  isAnalyzing: boolean;
  meteringLevel: number;
  recordingDuration: number;
  lastEvaluation: VoiceEvaluationResult | null;
  toggleRecording: () => Promise<void>;
  cancelVoice: () => Promise<void>;
  clearEvaluation: () => void;
}

export const useVoiceAnswerHandler = ({
  currentStep,
  subject,
  onCorrectAnswer,
  onWrongAnswer,
}: UseVoiceAnswerHandlerProps): UseVoiceAnswerHandlerResult => {
  const [recordingState, setRecordingState] = useState<VoiceRecordingState>('idle');
  const [lastEvaluation, setLastEvaluation] = useState<VoiceEvaluationResult | null>(null);

  const {
    isRecording,
    recordingDuration,
    meteringLevel,
    startRecording,
    stopRecording,
    cancelRecording,
  } = useAudioRecorder();

  const { addXp } = useGamificationStore();
  const { addMistake } = useMistakeStore();
  const { isMuted, speakText } = useVoiceStore();

  const toggleRecording = useCallback(async () => {
    if (recordingState === 'analyzing') {
      return;
    }

    // 1. Agar yozilayotgan bo'lsa -> To'xtatish va tahlil qilish
    if (isRecording) {
      setRecordingState('analyzing');
      HapticFeedback.medium();

      const base64Audio = await stopRecording();

      if (!base64Audio) {
        setRecordingState('error');
        setTimeout(() => setRecordingState('idle'), 2000);
        return;
      }

      try {
        const evaluation: VoiceEvaluationResult = await geminiDataSource.evaluateVoiceAnswer(
          base64Audio,
          currentStep,
          subject
        );

        setLastEvaluation(evaluation);

        if (evaluation.isCorrect) {
          setRecordingState('success');
          HapticFeedback.success();
          addXp(evaluation.xpEarned);

          // Ovozli javob qaytarish
          if (!isMuted) {
            speakText(evaluation.feedbackText);
          }

          // Keyingi qadamga o'tish
          onCorrectAnswer(
            evaluation.matchedOptionIndex >= 0
              ? evaluation.matchedOptionIndex
              : currentStep.correctOptionIndex
          );
        } else {
          setRecordingState('error');
          HapticFeedback.error();

          // Xatolar bankiga saqlash
          addMistake({
            ageGroup: 'junior',
            subject,
            topicTitle: currentStep.stepTitle,
            questionSnippet: currentStep.tutorQuestion,
            hintSummary: currentStep.hintText,
            xpReward: currentStep.xpReward || 25,
          });

          if (!isMuted) {
            speakText(evaluation.feedbackText);
          }

          if (onWrongAnswer) {
            onWrongAnswer(evaluation.feedbackText);
          }
        }

        // 3 soniyadan keyin holatni tozalash
        setTimeout(() => {
          setRecordingState('idle');
        }, 3000);
      } catch (err) {
        console.error('[useVoiceAnswerHandler] Evaluation failed:', err);
        setRecordingState('error');
        setTimeout(() => setRecordingState('idle'), 2000);
      }
    } else {
      // 2. Yozishni boshlash
      const started = await startRecording();
      if (started) {
        setRecordingState('recording');
        setLastEvaluation(null);
      }
    }
  }, [
    recordingState,
    isRecording,
    stopRecording,
    startRecording,
    currentStep,
    subject,
    addXp,
    addMistake,
    isMuted,
    speakText,
    onCorrectAnswer,
    onWrongAnswer,
  ]);

  const cancelVoice = useCallback(async () => {
    await cancelRecording();
    setRecordingState('idle');
    setLastEvaluation(null);
  }, [cancelRecording]);

  const clearEvaluation = useCallback(() => {
    setLastEvaluation(null);
  }, []);

  return {
    recordingState,
    isRecording,
    isAnalyzing: recordingState === 'analyzing',
    meteringLevel,
    recordingDuration,
    lastEvaluation,
    toggleRecording,
    cancelVoice,
    clearEvaluation,
  };
};
