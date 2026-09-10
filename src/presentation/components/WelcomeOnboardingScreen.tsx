import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { AiMascotAvatar } from './AiMascotAvatar';
import { DuoButton } from './DuoButton';
import { theme } from '../../core/theme';

export interface WelcomeOnboardingScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

/**
 * Onboarding Welcome Screen
 * 100% matched to Duolingo design system.
 */
export const WelcomeOnboardingScreen: React.FC<WelcomeOnboardingScreenProps> = ({
  onGetStarted,
  onLogin,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 24) }]}>
      <View style={styles.content}>
        
        {/* Top Spacer */}
        <View style={styles.spacer} />

        {/* Mascot & Bubble Section */}
        <View style={styles.mascotSection}>
          {/* Speech Bubble */}
          <View style={styles.speechBubble}>
            <Text style={styles.bubbleText}>
              {t('onboarding.welcome.mascotBubble', 'Hi there! I\'m MuudAI!')}
            </Text>
            {/* Bubble Tail */}
            <View style={styles.bubbleTail} />
          </View>

          {/* Socratic Mascot Avatar */}
          <AiMascotAvatar size={160} mood="idle" />
        </View>

        {/* Brand & Subtitle Section */}
        <View style={styles.textSection}>
          <Text style={styles.title}>
            {t('onboarding.welcome.title', 'MuudAI')}
          </Text>
          <Text style={styles.subtitle}>
            {t('onboarding.welcome.subtitle', 'The homework tutor that never just gives the answer. Think, learn, and grow!')}
          </Text>
        </View>

        {/* Bottom Spacer */}
        <View style={styles.spacer} />
      </View>

      {/* Bottom Action Buttons */}
      <View style={styles.footer}>
        <DuoButton
          title={t('onboarding.welcome.getStarted', 'GET STARTED')}
          type="primary"
          onPress={onGetStarted}
          style={styles.primaryButton}
        />
        <DuoButton
          title={t('onboarding.welcome.alreadyHaveAccount', 'I ALREADY HAVE AN ACCOUNT')}
          type="secondary"
          onPress={onLogin}
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
  spacer: {
    flex: 1,
  },
  mascotSection: {
    alignItems: 'center',
    marginBottom: 40,
    zIndex: 10,
  },
  speechBubble: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    marginBottom: 20,
    position: 'relative',
    // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4B4B4B',
    textAlign: 'center',
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -8,
    width: 16,
    height: 16,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: '#E5E5E5',
    transform: [{ rotate: '45deg' }],
  },
  textSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.physicsIndigo,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#777777',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
    width: '100%',
    backgroundColor: '#FFFFFF', // ensures it covers anything behind if scrolled
  },
  primaryButton: {
    marginBottom: 16,
  },
});
