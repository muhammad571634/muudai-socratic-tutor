import { useState, useCallback } from 'react';
import { CameraView } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { SubjectType } from '../../domain/entities/Gamification';
import {
  SocraticProblemSession,
  DEMO_SOCRATIC_SESSION,
  ScanError,
  ScanErrorType
} from '../../domain/entities/SocraticDialogue';
import { getSocraticAiRepository } from '../../data/remote/AiRepositoryFactory';
import { useGamificationStore } from '../state/useGamificationStore';
import { HapticFeedback } from '../../core/haptics';
import { getActiveLocale } from '../../core/i18n';

export interface UseSocraticScannerResult {
  currentSession: SocraticProblemSession | null;
  isAnalyzing: boolean;
  statusMessage: string;
  analysisError: string | null;
  analysisErrorType: ScanErrorType | null;
  captureAndAnalyze: (cameraRef: React.RefObject<CameraView | null>, subject: SubjectType) => Promise<boolean>;
  setSession: (session: SocraticProblemSession) => void;
  resetToDemo: () => void;
  clearSession: () => void;
}

const socraticDataSource = getSocraticAiRepository();

export const useSocraticScanner = (): UseSocraticScannerResult => {
  const [currentSession, setCurrentSession] = useState<SocraticProblemSession | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisErrorType, setAnalysisErrorType] = useState<ScanErrorType | null>(null);

  const captureAndAnalyze = useCallback(
    async (cameraRef: React.RefObject<CameraView | null>, subject: SubjectType): Promise<boolean> => {
      const { energy, consumeEnergy } = useGamificationStore.getState();

      if (energy <= 0) {
        const refillStatus = useGamificationStore.getState().checkEnergyRefill();
        const hours = Math.floor(refillStatus.secondsUntilNext / 3600);
        const mins = Math.floor((refillStatus.secondsUntilNext % 3600) / 60);
        const secs = refillStatus.secondsUntilNext % 60;
        const timeStr =
          hours > 0
            ? `${hours}h ${mins}m`
            : mins > 0
            ? `${mins}m ${secs}s`
            : `${secs}s`;
        setAnalysisError(`Energy exhausted. Your brain is resting! Next +1 Energy in ${timeStr}.`);
        HapticFeedback.error();
        return false;
      }

      try {
        setIsAnalyzing(true);
        setAnalysisError(null);
        setStatusMessage('Focusing Socratic lens on problem...');
        HapticFeedback.medium();

        // Bolaning daftaridagi masaladan boshqa hech narsa o'rgatilmaydi.
        // Kamera ishlamasa yoki tahlil muvaffaqiyatsiz bo'lsa — ScanError tashlanadi
        // va bolaga rost xabar ko'rsatiladi. Oldingi kod bu yerda '3x + 5 = 20'
        // masalasini o'ylab topib, uni bolaga o'rgatardi. AGENTS.md 2-taqiq.
        if (!cameraRef?.current?.takePictureAsync) {
          throw new ScanError('unknown', "Kamera ishga tushmadi. Ilovani qayta ochib ko'ring.");
        }

        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7, // No base64 here
        });

        if (!photo?.uri) {
          throw new ScanError('blurry', "Surat olinmadi 😅 Qani, yana bir marta urinamiz!");
        }

        let imageBase64 = '';

        // Skaner ramkasi: rasmning markazidan kesib olamiz
        if (photo.width && photo.height) {
          try {
            const cropWidth = Math.floor(photo.width * 0.8);
            const cropHeight = Math.floor(photo.height * 0.4);
            const originX = Math.floor((photo.width - cropWidth) / 2);
            const originY = Math.floor((photo.height - cropHeight) / 2);

            const manipResult = await ImageManipulator.manipulateAsync(
              photo.uri,
              [
                { crop: { originX, originY, width: cropWidth, height: cropHeight } },
                { resize: { width: 1080 } }
              ],
              { base64: true, compress: 0.75, format: ImageManipulator.SaveFormat.JPEG }
            );
            if (manipResult.base64) {
              imageBase64 = manipResult.base64;
            }
          } catch (cropErr) {
            // Kesish muvaffaqiyatsiz bo'lsa — to'liq suratni yuboramiz.
            // Bu xavfsiz zaxira: rasm baribir bolaning o'z daftaridan.
            console.warn('[useSocraticScanner] Crop failed, sending full photo:', cropErr);
            const fallbackResult = await ImageManipulator.manipulateAsync(
              photo.uri,
              [],
              { base64: true, compress: 0.75, format: ImageManipulator.SaveFormat.JPEG }
            );
            if (fallbackResult.base64) {
              imageBase64 = fallbackResult.base64;
            }
          }
        }

        if (!imageBase64) {
           const fallbackResult = await ImageManipulator.manipulateAsync(
              photo.uri,
              [],
              { base64: true, compress: 0.75, format: ImageManipulator.SaveFormat.JPEG }
            );
            imageBase64 = fallbackResult.base64 || '';
        }

        if (!imageBase64) {
          throw new ScanError('unknown', "Suratni o'qib bo'lmadi. Qayta urinib ko'ring.");
        }

        setStatusMessage("Socrates Jr. daftardagi masalani o'rganmoqda...");
        // Til chaqiruv paytida o'qiladi: bola sozlamalarda tilni almashtirsa,
        // keyingi skanerlash darhol yangi tilda keladi.
        const session: SocraticProblemSession = await socraticDataSource.analyzeNotebookImage(
          imageBase64,
          subject,
          getActiveLocale()
        );

        // 3. 1 Energiya yechish va zafar signali
        consumeEnergy();
        setCurrentSession(session);
        HapticFeedback.success();
        setIsAnalyzing(false);
        setStatusMessage('');
        return true;
      } catch (error: unknown) {
        console.error('[useSocraticScanner] Error during scan & analyze:', error);
        
        let errorMsg = 'Failed to analyze notebook. Please hold still and retry.';
        let errorType: ScanErrorType = 'unknown';

        if (error && typeof error === 'object' && 'name' in error && (error as Error).name === 'ScanError') {
          errorMsg = (error as ScanError).message;
          errorType = (error as ScanError).type;
        } else if (error instanceof Error) {
          errorMsg = error.message;
        }

        setAnalysisError(errorMsg);
        setAnalysisErrorType(errorType);
        HapticFeedback.error();
        setIsAnalyzing(false);
        setStatusMessage('');
        return false;
      }
    },
    []
  );

  const setSession = useCallback((session: SocraticProblemSession) => {
    setCurrentSession(session);
    setAnalysisError(null);
  }, []);

  const resetToDemo = useCallback(() => {
    setCurrentSession(DEMO_SOCRATIC_SESSION);
    setAnalysisError(null);
  }, []);

  const clearSession = useCallback(() => {
    setCurrentSession(null);
    setAnalysisError(null);
    setAnalysisErrorType(null);
    setStatusMessage('');
    setIsAnalyzing(false);
  }, []);

  return {
    currentSession,
    isAnalyzing,
    statusMessage,
    analysisError,
    analysisErrorType,
    captureAndAnalyze,
    setSession,
    resetToDemo,
    clearSession,
  };
};
