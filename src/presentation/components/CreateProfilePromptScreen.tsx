import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { AiMascotAvatar } from './AiMascotAvatar';
import { CelebrationConfetti } from './CelebrationConfetti';
import { DuoButton } from './DuoButton';
import { theme } from '../../core/theme';
import { HapticFeedback } from '../../core/haptics';

export interface CreateProfilePromptScreenProps {
  onBack?: () => void;
  onCreateProfile: () => void;
  onSkip: () => void;
}

/**
 * Onboarding Celebration / Profile Prompt Screen.
 * Displays celebratory mascot (MuudAI Buddy) bouncing happily with raised arms,
 * speech bubble saying "Awesome!", description, and "CREATE PROFILE" / "SKIP" actions.
 */
export const CreateProfilePromptScreen: React.FC<CreateProfilePromptScreenProps> = ({
  onBack,
  onCreateProfile,
  onSkip,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Joyful celebration haptic pulse upon arrival
    HapticFeedback.success();
  }, []);

  useEffect(() => {
    if (!onBack) return;
    const backAction = () => {
      onBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [onBack]);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: Math.max(insets.bottom, 24),
        },
      ]}
    >
      <StatusBar barStyle="dark-content" />

      {/* Confetti Celebration Burst */}
      <CelebrationConfetti
        active={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />

      {/* Main Content Area */}
      <View style={styles.content}>
        {/* Top Spacer to position elements harmoniously */}
        <View style={styles.topSpacer} />

        {/* Speech Bubble pointing down to mascot */}
        <View style={styles.speechBubbleContainer}>
          <View style={styles.speechBubble}>
            <Text style={styles.speechBubbleText}>
              {t('onboarding.profilePrompt.speechBubble', 'Awesome!')}
            </Text>
            <View style={styles.speechBubbleTail} />
          </View>
        </View>

        {/* Celebratory Mascot in Center */}
        <View style={styles.mascotContainer}>
          <AiMascotAvatar size={150} mood="celebrating" />
        </View>

        {/* Description Text */}
        <View style={styles.textContainer}>
          <Text style={styles.description}>
            {t(
              'onboarding.profilePrompt.description',
              'Create a profile now so you can save progress and connect with friends. Or you can skip it.'
            )}
          </Text>
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </View>

      {/* Bottom Sticky Action Buttons */}
      <View style={styles.footer}>
        <DuoButton
          title={t('onboarding.profilePrompt.createProfile', 'CREATE PROFILE')}
          type="primary"
          onPress={() => {
            HapticFeedback.medium();
            onCreateProfile();
          }}
          style={styles.primaryButton}
        />
        <DuoButton
          title={t('onboarding.profilePrompt.skip', 'SKIP')}
          type="secondary"
          onPress={() => {
            HapticFeedback.light();
            onSkip();
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  topSpacer: {
    flex: 0.8,
  },
  speechBubbleContainer: {
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 10,
  },
  speechBubble: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  speechBubbleText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  speechBubbleTail: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -8,
    width: 16,
    height: 16,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: '#E2E8F0',
    transform: [{ rotate: '45deg' }],
  },
  mascotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    zIndex: 5,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
    maxWidth: 340,
  },
  description: {
    fontSize: 17,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
    lineHeight: 25,
    letterSpacing: -0.2,
  },
  bottomSpacer: {
    flex: 1.2,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  primaryButton: {
    marginBottom: 14,
  },
});
