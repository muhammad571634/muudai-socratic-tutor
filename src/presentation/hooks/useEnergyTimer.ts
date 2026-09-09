import { useState, useEffect } from 'react';
import { AppConfig } from '../../core/config';
import { HapticFeedback } from '../../core/haptics';
import { useGamificationStore } from '../state/useGamificationStore';

export interface UseEnergyTimerResult {
  energy: number;
  maxEnergy: number;
  isFull: boolean;
  isDrained: boolean;
  secondsRemaining: number;
  formattedCountdown: string;
  refillProgressPercent: number;
}

const formatSecondsToMinutes = (totalSeconds: number): string => {
  if (totalSeconds <= 0) return '00:00';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const padMin = String(minutes).padStart(2, '0');
  const padSec = String(seconds).padStart(2, '0');
  if (hours > 0) {
    return `${hours}:${padMin}:${padSec}`;
  }
  return `${padMin}:${padSec}`;
};

/**
 * Compute the initial seconds remaining from raw store values without
 * calling checkEnergyRefill(), which can trigger set() and cause
 * "Cannot update a component while rendering" errors.
 */
const computeInitialSecondsRemaining = (): number => {
  const { energy, maxEnergy, lastEnergyRefillTimestamp } = useGamificationStore.getState();
  if (energy >= maxEnergy) return 0;

  const now = Date.now();
  const refillIntervalMs = AppConfig.energy.refillIntervalMs;
  const validTimestamp = lastEnergyRefillTimestamp || now;
  const elapsed = Math.max(0, now - validTimestamp);
  const remainingMs = refillIntervalMs - (elapsed % refillIntervalMs);
  return Math.max(0, Math.ceil(remainingMs / 1000));
};

export const useEnergyTimer = (): UseEnergyTimerResult => {
  const energy = useGamificationStore((s) => s.energy);
  const maxEnergy = useGamificationStore((s) => s.maxEnergy);
  const checkEnergyRefill = useGamificationStore((s) => s.checkEnergyRefill);

  const [secondsRemaining, setSecondsRemaining] = useState<number>(computeInitialSecondsRemaining);

  useEffect(() => {
    if (energy >= maxEnergy) {
      setSecondsRemaining(0);
      return;
    }

    const initialCheck = checkEnergyRefill();
    if (initialCheck.recharged > 0) {
      HapticFeedback.success();
    }
    setSecondsRemaining(initialCheck.secondsUntilNext);

    const intervalId = setInterval(() => {
      const result = checkEnergyRefill();
      if (result.recharged > 0) {
        HapticFeedback.success();
      }
      setSecondsRemaining(result.secondsUntilNext);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [energy, maxEnergy, checkEnergyRefill]);

  const totalIntervalSeconds = AppConfig.energy.refillIntervalSeconds;
  const elapsedSeconds = Math.max(0, totalIntervalSeconds - secondsRemaining);
  const refillProgressPercent =
    energy >= maxEnergy
      ? 100
      : Math.min(100, Math.round((elapsedSeconds / totalIntervalSeconds) * 100));

  return {
    energy,
    maxEnergy,
    isFull: energy >= maxEnergy,
    isDrained: energy <= 0,
    secondsRemaining,
    formattedCountdown: formatSecondsToMinutes(secondsRemaining),
    refillProgressPercent,
  };
};
