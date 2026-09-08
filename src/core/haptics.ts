import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Apple Taptic Engine va Android Haptic Feedback xizmati.
 * Har qanday xatolik va platforma nomuvofiqligini xavfsiz (try/catch) boshqaradi.
 */
export const HapticFeedback = {
  // Kartochka va kichik tugmalarni bosganda (Light Impact)
  light: async (): Promise<void> => {
    if (Platform.OS === 'web') return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Platform unsupported or disabled
    }
  },

  // Mikrofon yoki filtr kabi asosiy tugmalarni bosganda (Medium Impact)
  medium: async (): Promise<void> => {
    if (Platform.OS === 'web') return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Platform unsupported or disabled
    }
  },

  // Missiya tugaganda, sandiq ochilganda yoki XP qo'shilganda (Success Pattern)
  success: async (): Promise<void> => {
    if (Platform.OS === 'web') return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Platform unsupported or disabled
    }
  },

  // Elementlar orasida tanlaganda (Selection Tick)
  selection: async (): Promise<void> => {
    if (Platform.OS === 'web') return;
    try {
      await Haptics.selectionAsync();
    } catch {
      // Platform unsupported or disabled
    }
  },

  // Xatolik yuz berganda (Error Pattern)
  error: async (): Promise<void> => {
    if (Platform.OS === 'web') return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {
      // Platform unsupported or disabled
    }
  },
};
