import { useCameraPermissions } from 'expo-camera';
import { useState, useCallback } from 'react';

export interface UseCameraPermissionResult {
  hasPermission: boolean | null;
  isLoading: boolean;
  errorMessage: string | null;
  requestCameraPermission: () => Promise<boolean>;
}

export const useCameraPermission = (): UseCameraPermissionResult => {
  const [permission, requestPermission] = useCameraPermissions();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRequestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setErrorMessage(null);
      const response = await requestPermission();
      return response.granted;
    } catch (error) {
      const fallbackMessage = 'An unexpected error occurred while requesting camera permission';
      const finalMessage = error instanceof Error ? error.message : fallbackMessage;
      setErrorMessage(finalMessage);
      return false;
    }
  }, [requestPermission]);

  return {
    hasPermission: permission ? permission.granted : null,
    isLoading: !permission,
    errorMessage,
    requestCameraPermission: handleRequestPermission,
  };
};
