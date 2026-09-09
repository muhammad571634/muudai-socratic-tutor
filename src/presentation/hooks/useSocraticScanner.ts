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
        const mins = Math.floor(refillStatus.secondsUntilNext / 60);
        const secs = refillStatus.secondsUntilNext % 60;
        const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
        setAnalysisError(`Energy exhausted. Your brain is resting! Next +1 Energy in ${timeStr}.`);
        HapticFeedback.error();
        return false;
      }

      try {
        setIsAnalyzing(true);
        setAnalysisError(null);
        setStatusMessage('Focusing Socratic lens on problem...');
        HapticFeedback.medium();

        let session: SocraticProblemSession;

        if (cameraRef?.current?.takePictureAsync) {
          try {
            const photo = await cameraRef.current.takePictureAsync({
              base64: true,
              quality: 0.7,
            });

            if (photo?.base64 && photo.width && photo.height) {
              // Markaziy ramkani hisoblash (taxminan ekranning o'rtasidagi 300x150 yoki shunga mos)
              // Keling, rasmning markazidan 60% eni va 30% bo'yini qirqib olamiz (skaner ramkasi)
              const cropWidth = Math.floor(photo.width * 0.8);
              const cropHeight = Math.floor(photo.height * 0.4);
              const originX = Math.floor((photo.width - cropWidth) / 2);
              const originY = Math.floor((photo.height - cropHeight) / 2);

              const manipResult = await ImageManipulator.manipulateAsync(
                photo.uri,
                [{ crop: { originX, originY, width: cropWidth, height: cropHeight } }],
                { base64: true, compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
              );

              setStatusMessage("Socrates Jr. daftardagi masalani o'rganmoqda...");
              session = await socraticDataSource.analyzeNotebookImage(manipResult.base64 || photo.base64, subject);
            } else if (photo?.base64) {
              setStatusMessage("Socrates Jr. daftardagi masalani o'rganmoqda...");
              session = await socraticDataSource.analyzeNotebookImage(photo.base64, subject);
            } else {
              setStatusMessage('Sokratik dars tayyorlanmoqda...');
              session = await socraticDataSource.generateSocraticFromText('3x + 5 = 20', subject);
            }
          } catch (cameraErr: any) { if (cameraErr?.message && cameraErr.message.includes("qaytadan")) { setAnalysisError(cameraErr.message); setIsAnalyzing(false); return false; }
            console.warn('[useSocraticScanner] Camera snapshot failed, generating Socratic session:', cameraErr);
            setStatusMessage('Sokratik dars tayyorlanmoqda...');
            session = await socraticDataSource.generateSocraticFromText('3x + 5 = 20', subject);
          }
        } else {
          setStatusMessage('Synthesizing Socratic inquiry...');
          session = await socraticDataSource.generateSocraticFromText('3x + 5 = 20', subject);
        }

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
