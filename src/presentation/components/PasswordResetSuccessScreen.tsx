// O'ylanish: Ushbu komponent foydalanuvchi parolni muvaffaqiyatli tiklab, yangi parol o'rnatgandan
// keyingi tabriklash va salomlashuv ekranidir (mockup media_1789055256312.png asosida 100% yaratilgan).
// Apple Minimalist & Duolingo uslubida:
// - Tepada "Hurray!!" nutq pufakchasi (speech bubble pastga, maskotga qaratilgan quyruqcha bilan)
// - Bayramona Reanimated sakrash va cho'zilish (squash/jump) animatsiyali MuudAI tomchi maskoti
// - Bayramona konfetti (CelebrationConfetti) zarralari
// - Katta binafsha rangli sarlavha: "Welcome back!"
// - Tushunarli tavsif: "You have successfully reset and created a new password."
// - Pastki qismda "CONTINUE TO HOME" DuoButton 3D tugmasi (type="primary", radius 28)
// - Android apparat orqaga qaytish tugmasi va to'liq qulaylik (accessibility + haptics) ta'minlangan.

import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  BackHandler,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { DuoButton } from './DuoButton';
import { CelebrationConfetti } from './CelebrationConfetti';
import { theme } from '../../core/theme';
import { HapticFeedback } from '../../core/haptics';

const MASCOT_IMG = require('../../../assets/mascot_celebrating.png');

export interface PasswordResetSuccessScreenProps {
  onContinue?: () => void;
  onSuccess?: () => void;
}

export const PasswordResetSuccessScreen: React.FC<PasswordResetSuccessScreenProps> = ({
  onContinue,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const [showConfetti, setShowConfetti] = useState<boolean>(true);
  const [isContinuing, setIsContinuing] = useState<boolean>(false);
  const isContinuingRef = useRef<boolean>(false);

  // Reanimated GPU shared values for playful celebration mascot & speech bubble
  const jumpY = useSharedValue<number>(0);
  const squashScaleY = useSharedValue<number>(1);
  const squashScaleX = useSharedValue<number>(1);
  const rotationDeg = useSharedValue<number>(0);
  const entranceScale = useSharedValue<number>(0.85);
  const speechBubbleY = useSharedValue<number>(10);
  const speechBubbleOpacity = useSharedValue<number>(0);

  // Responsive mascot sizing so layout stays perfectly balanced across various screen sizes
  const isCompactScreen = screenHeight < 700;
  const mascotWidth = isCompactScreen ? 155 : 185;
  const mascotHeight = isCompactScreen ? 197 : 235;

  useEffect(() => {
    // Joyful celebration haptic pulse upon arrival
    HapticFeedback.success();

    // 1. Smooth spring entrance for mascot and speech bubble
    entranceScale.value = withSpring(1, { damping: 12, stiffness: 200 });
    speechBubbleOpacity.value = withTiming(1, { duration: 350 });
    speechBubbleY.value = withSpring(0, { damping: 14, stiffness: 220 });

    // 2. Continuous smooth bouncing jump loop (0 -> -12 -> 0)
    jumpY.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 360, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
        withTiming(0, { duration: 320, easing: Easing.bezier(0.42, 0, 1, 1) })
      ),
      -1,
      false
    );

    // Playful squash & stretch
    squashScaleY.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 360 }),
        withTiming(0.96, { duration: 320 })
      ),
      -1,
      false
    );

    squashScaleX.value = withRepeat(
      withSequence(
        withTiming(0.96, { duration: 360 }),
        withTiming(1.04, { duration: 320 })
      ),
      -1,
      false
    );

    // 3. Playful subtle rocking rotation
    rotationDeg.value = withRepeat(
      withSequence(
        withTiming(-2.5, { duration: 400, easing: Easing.inOut(Easing.ease) }),
        withTiming(2.5, { duration: 400, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    return () => {
      cancelAnimation(jumpY);
      cancelAnimation(squashScaleY);
      cancelAnimation(squashScaleX);
      cancelAnimation(rotationDeg);
      cancelAnimation(entranceScale);
      cancelAnimation(speechBubbleOpacity);
      cancelAnimation(speechBubbleY);
    };
  }, [
    entranceScale,
    jumpY,
    rotationDeg,
    speechBubbleOpacity,
    speechBubbleY,
    squashScaleX,
    squashScaleY,
  ]);

  const handleContinuePress = useCallback(() => {
    if (isContinuingRef.current) return;
    isContinuingRef.current = true;
    setIsContinuing(true);
    HapticFeedback.medium();
    const action = onContinue ?? onSuccess;
    action?.();
  }, [onContinue, onSuccess]);

  // Android hardware back button handler: cleanly completes flow and navigates to home
  useEffect(() => {
    const backAction = () => {
      handleContinuePress();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [handleContinuePress]);

  const animatedMascotStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: jumpY.value },
      { scaleX: squashScaleX.value * entranceScale.value },
      { scaleY: squashScaleY.value * entranceScale.value },
      { rotate: `${rotationDeg.value}deg` },
    ],
  }));

  const animatedSpeechBubbleStyle = useAnimatedStyle(() => ({
    opacity: speechBubbleOpacity.value,
    transform: [{ translateY: speechBubbleY.value }],
  }));

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 16,
        },
      ]}
    >
      <StatusBar barStyle="dark-content" />

      {/* Confetti Celebration Particle Burst */}
      <CelebrationConfetti
        active={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />

      {/* Main Center Stage */}
      <View style={styles.centerStage}>
        {/* Top Speech Bubble pointing down to the mascot */}
        <Animated.View style={[styles.speechBubbleContainer, animatedSpeechBubbleStyle]}>
          <View style={styles.speechBubble}>
            <Text
              style={styles.speechBubbleText}
              accessible
              accessibilityRole="text"
              accessibilityLabel={t('auth.passwordResetSuccess.hurray', 'Hurray!!')}
            >
              {t('auth.passwordResetSuccess.hurray', 'Hurray!!')}
            </Text>
            <View style={styles.speechBubbleTail} />
          </View>
        </Animated.View>

        {/* Celebratory Droplet Mascot with animated jump & squash */}
        <View style={styles.mascotArea}>
          <Animated.Image
            source={MASCOT_IMG}
            style={[
              styles.mascotImage,
              { width: mascotWidth, height: mascotHeight },
              animatedMascotStyle,
            ]}
            resizeMode="contain"
            accessible
            accessibilityRole="image"
            accessibilityLabel={t(
              'auth.passwordResetSuccess.mascotAlt',
              'MuudAI celebration mascot'
            )}
          />
        </View>

        {/* Headline: "Welcome back!" in large purple text */}
        <Text style={styles.titleWelcomeBack}>
          {t('auth.passwordResetSuccess.welcomeBack', 'Welcome back!')}
        </Text>

        {/* Subtitle description */}
        <Text style={styles.subtitle}>
          {t(
            'auth.passwordResetSuccess.subtitle',
            'You have successfully reset and created a new password.'
          )}
        </Text>
      </View>

      {/* Bottom Sticky Action: "CONTINUE TO HOME" DuoButton */}
      <View
        style={[
          styles.footer,
          {
            paddingBottom: Math.max(insets.bottom, 20),
          },
        ]}
      >
        <DuoButton
          title={t('auth.passwordResetSuccess.continueToHome', 'CONTINUE TO HOME')}
          type="primary"
          borderRadius={28}
          disabled={isContinuing}
          textStyle={styles.continueButtonText}
          accessibilityLabel={t(
            'auth.passwordResetSuccess.continueToHome',
            'CONTINUE TO HOME'
          )}
          accessibilityHint="Completes password reset and navigates to the home dashboard"
          onPress={handleContinuePress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'space-between',
  },
  centerStage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  speechBubbleContainer: {
    alignItems: 'center',
    marginBottom: 28,
    zIndex: 10,
  },
  speechBubble: {
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: theme.colors.dockBorder,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'visible',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  speechBubbleText: {
    fontSize: 19,
    fontWeight: '800',
    color: theme.colors.titleDark,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  speechBubbleTail: {
    position: 'absolute',
    bottom: -6,
    alignSelf: 'center',
    width: 12,
    height: 12,
    backgroundColor: theme.colors.surfaceLight,
    borderRightWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: theme.colors.dockBorder,
    transform: [{ rotate: '45deg' }],
  },
  mascotArea: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 26,
  },
  mascotImage: {
    zIndex: 5,
  },
  titleWelcomeBack: {
    fontSize: 34,
    fontWeight: '800',
    color: theme.colors.physicsIndigo,
    letterSpacing: -0.6,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
    letterSpacing: -0.2,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    width: '100%',
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});
