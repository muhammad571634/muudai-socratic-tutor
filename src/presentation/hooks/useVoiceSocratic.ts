import { useEffect, useCallback } from 'react';
import { SocraticStep } from '../../domain/entities/SocraticDialogue';
import { useVoiceStore } from '../state/useVoiceStore';

export interface UseVoiceSocraticProps {
  currentStep?: SocraticStep;
  isFinished?: boolean;
  finalAnswer?: string;
  autoSpeak?: boolean;
}

export const useVoiceSocratic = ({
  currentStep,
  isFinished,
  finalAnswer,
  autoSpeak = true,
}: UseVoiceSocraticProps = {}) => {
  const {
    isSpeaking,
    isMuted,
    autoReadEnabled,
    speakText,
    stopSpeaking,
    toggleMute,
  } = useVoiceStore();

  // Avtomatik o'qib berish (Auto-read on step change)
  useEffect(() => {
    if (!autoSpeak || !autoReadEnabled || isMuted) {
      return;
    }

    if (isFinished && finalAnswer) {
      const victoryPhrase = `${finalAnswer}. Well done! Outstanding work!`;
      speakText(victoryPhrase);
      return;
    }

    if (currentStep) {
      speakText(currentStep.tutorQuestion);
    }

    return () => {
      stopSpeaking();
    };
  }, [currentStep?.id, isFinished, autoSpeak, autoReadEnabled, isMuted]);

  const readCurrentStep = useCallback(() => {
    if (!currentStep) return;
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(currentStep.tutorQuestion);
    }
  }, [currentStep, isSpeaking, speakText, stopSpeaking]);

  const readHint = useCallback(() => {
    if (!currentStep?.hintText) return;
    speakText(`Hint: ${currentStep.hintText}`);
  }, [currentStep, speakText]);

  const speakCelebration = useCallback(() => {
    speakText("That's right! Moving to the next step.");
  }, [speakText]);

  return {
    isSpeaking,
    isMuted,
    toggleMute,
    readCurrentStep,
    readHint,
    speakCelebration,
    stopSpeaking,
  };
};
