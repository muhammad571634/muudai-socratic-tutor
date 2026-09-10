// O'ylanish: Ushbu komponent foydalanuvchi muvaffaqiyatli profil yaratgandan keyingi
// tabriklash va salomlashuv ekranidir (media_1789050913174.png skrinshotiga 100% mos).
// Apple Minimalist & Duolingo uslubida: bayramona konfetti (CelebrationConfetti),
// "Hurray!!" nutq pufakchasi, jonli Reanimated animatsiyali quvnoq MuudAI tomchi maskoti,
// "Welcome 👋" sarlavhasi, "Your profile has been created successfully." tavsifi
// va pastki qismda "CONTINUE TO HOME" DuoButton tugmasi mavjud.

import React, { useEffect, useState, useCallback } from 'react';
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
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { DuoButton } from './DuoButton';
import { CelebrationConfetti } from './CelebrationConfetti';
import { theme } from '../../core/theme';
import { HapticFeedback } from '../../core/haptics';

const MASCOT_IMG = require('../../../assets/mascot_celebrating.png');

export interface ProfileSuccessScreenProps {
  onContinue: () => void;
}

export const ProfileSuccessScreen: React.FC<ProfileSuccessScreenProps> = ({
  onContinue,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const [showConfetti, setShowConfetti] = useState<boolean>(true);
  const [isContinuing, setIsContinuing] = useState<boolean>(false);

  // Reanimated GPU shared values for playful mascot celebration
  const jumpY = useSharedValue<number>(0);
  const squashScaleY = useSharedValue<number>(1);
  const squashScaleX = useSharedValue<number>(1);
  const rotationDeg = useSharedValue<number>(0);
  const entranceScale = useSharedValue<number>(0.85);
  const speechBubbleY = useSharedValue<number>(10);
  const speechBubbleOpacity = useSharedValue<number>(0);

  // Responsive mascot sizing so layout stays perfectly balanced on all screen heights
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

    // 2. Continuous smooth bouncing jump loop (starts at 0 -> -12 -> returns to 0, repeat with reverse=false)
    jumpY.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 360, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
        withTiming(0, { duration: 320, easing: Easing.bezier(0.42, 0, 1, 1) })
      ),
      -1,
      false
    );

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

    // 3. Playful subtle rotation rocking
    rotationDeg.value = withRepeat(
      withSequence(
        withTiming(-2.5, { duration: 400, easing: Easing.inOut(Easing.ease) }),
        withTiming(2.5, { duration: 400, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
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
    if (isContinuing) return;
    setIsContinuing(true);
    HapticFeedback.medium();
    onContinue();
  }, [isContinuing, onContinue]);

  // Android hardware back button handler: complete onboarding or navigate forward
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
            <Text style={styles.speechBubbleText}>
              {t('onboarding.profileSuccess.hurray', 'Hurray!!')}
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
            accessibilityLabel="MuudAI mascot celebrating"
          />
        </View>

        {/* Title: "Welcome 👋" with nested Text for flawless multi-language inline rendering */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>
            <Text style={styles.titleWelcome}>
              {t('onboarding.profileSuccess.welcome', 'Welcome')}
            </Text>
            <Text style={styles.titleEmoji}> 👋</Text>
          </Text>
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          {t(
            'onboarding.profileSuccess.subtitle',
            'Your profile has been created successfully.'
          )}
        </Text>
      </View>

      {/* Bottom Sticky Action: "CONTINUE TO HOME" matching ProfilePasswordScreen footer spacing */}
      <View
        style={[
          styles.footer,
          {
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
      >
        <DuoButton
          title={t('onboarding.profileSuccess.continueToHome', 'CONTINUE TO HOME')}
          type="primary"
          borderRadius={28}
          disabled={isContinuing}
          textStyle={styles.continueButtonText}
          accessibilityLabel={t(
            'onboarding.profileSuccess.continueToHome',
            'CONTINUE TO HOME'
          )}
          accessibilityHint="Completes setup and navigates to the home dashboard"
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
    backgroundColor: theme.colors.cardLight,
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: theme.colors.dockBorder,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
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
    backgroundColor: theme.colors.cardLight,
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
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  titleText: {
    textAlign: 'center',
  },
  titleWelcome: {
    fontSize: 34,
    fontWeight: '800',
    color: theme.colors.physicsIndigo,
    letterSpacing: -0.6,
  },
  titleEmoji: {
    fontSize: 30,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 290,
    letterSpacing: -0.2,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    width: '100%',
    backgroundColor: theme.colors.background,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});
