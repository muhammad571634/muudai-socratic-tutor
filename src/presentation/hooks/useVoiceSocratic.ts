import { useEffect, useCallback } from 'react';
import { LessonStep } from '../../domain/entities/SocraticLesson';
import { useVoiceStore } from '../state/useVoiceStore';

export interface UseVoiceSocraticProps {
  currentStep?: LessonStep;
  autoSpeak?: boolean;
}

/**
 * Qadam savolini ovoz bilan o'qib beradi.
 *
 * Yakuniy javob bu yerda YO'Q va ataylab yo'q: `SocraticLesson` uni
 * klientga umuman olib kelmaydi (`SocraticLesson.ts` boshidagi izoh).
 * Ilgari bu hook tugash paytida `"${finalAnswer}. Well done!"` deb javobni
 * ovoz bilan aytib berardi — Sokratik shartnomani ham, i18n qoidasini ham
 * buzgan holda (matn inglizcha qotib qolgan edi).
 */
export const useVoiceSocratic = ({
  currentStep,
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

    if (currentStep) {
      speakText(currentStep.question);
    }

    return () => {
      stopSpeaking();
    };
  }, [currentStep?.id, autoSpeak, autoReadEnabled, isMuted]);

  const readCurrentStep = useCallback(() => {
    if (!currentStep) return;
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(currentStep.question);
    }
  }, [currentStep, isSpeaking, speakText, stopSpeaking]);

  /** Yordam matnini o'qiydi. Matn AI'dan bolaning tilida keladi. */
  const readHint = useCallback(
    (hintMessage: string) => {
      if (!hintMessage.trim()) return;
      speakText(hintMessage);
    },
    [speakText]
  );

  return {
    isSpeaking,
    isMuted,
    toggleMute,
    readCurrentStep,
    readHint,
    stopSpeaking,
  };
};
