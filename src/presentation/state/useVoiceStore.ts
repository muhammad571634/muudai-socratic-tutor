import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { speechService } from '../../core/speechService';
import { HapticFeedback } from '../../core/haptics';

export interface VoiceState {
  isSpeaking: boolean;
  isMuted: boolean;
  autoReadEnabled: boolean;
  activeSpeechText: string;

  speakText: (text: string, onDone?: () => void) => void;
  stopSpeaking: () => void;
  toggleMute: () => void;
  toggleAutoRead: () => void;
  setIsSpeaking: (speaking: boolean) => void;
}

export const useVoiceStore = create<VoiceState>()(
  persist(
    (set, get) => ({
      isSpeaking: false,
      isMuted: false,
      autoReadEnabled: true,
      activeSpeechText: '',

      setIsSpeaking: (speaking: boolean) => {
        set({ isSpeaking: speaking });
      },

      speakText: (text: string, onDone?: () => void) => {
        const { isMuted } = get();
        if (isMuted || !text || !text.trim()) {
          return;
        }

        set({ activeSpeechText: text, isSpeaking: true });

        speechService.speak(text, {
          onStart: () => {
            set({ isSpeaking: true });
          },
          onDone: () => {
            set({ isSpeaking: false, activeSpeechText: '' });
            onDone?.();
          },
          onStopped: () => {
            set({ isSpeaking: false, activeSpeechText: '' });
          },
          onError: () => {
            set({ isSpeaking: false, activeSpeechText: '' });
          },
        });
      },

      stopSpeaking: () => {
        speechService.stop();
        set({ isSpeaking: false, activeSpeechText: '' });
      },

      toggleMute: () => {
        const nextMuted = !get().isMuted;
        HapticFeedback.selection();
        if (nextMuted) {
          speechService.stop();
          set({ isMuted: true, isSpeaking: false, activeSpeechText: '' });
        } else {
          set({ isMuted: false });
        }
      },

      toggleAutoRead: () => {
        HapticFeedback.selection();
        set((state) => ({ autoReadEnabled: !state.autoReadEnabled }));
      },
    }),
    {
      name: 'muudai_voice_settings_storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isMuted: state.isMuted,
        autoReadEnabled: state.autoReadEnabled,
      }),
    }
  )
);
