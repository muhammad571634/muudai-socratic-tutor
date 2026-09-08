import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { theme } from '../../core/theme';
import { HapticFeedback } from '../../core/haptics';

export type MascotMood = 'idle' | 'listening' | 'thinking' | 'celebrating';

export interface AiMascotAvatarProps {
  size?: number;
  mood?: MascotMood;
  onPress?: () => void;
}

/**
 * Duolingo uslubidagi jonli AI Repetitor Maskoti (MuudAI Buddy).
 * 60-120fps GPU Reanimated 3 orqali mayin suzadi, ko'zlarini qisadi va teginishga javob beradi.
 */
export const AiMascotAvatar: React.FC<AiMascotAvatarProps> = ({
  size = 54,
  mood = 'idle',
  onPress,
}) => {
  // Reanimated 3 GPU animatsiyalari
  const floatY = useSharedValue(0);
  const eyeBlink = useSharedValue(1);
  const haloScale = useSharedValue(1);
  const tapScale = useSharedValue(1);

  useEffect(() => {
    // 1. Mayin havoda suzish (Floating)
    floatY.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(4, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // 2. Tabiiy ko'z pirpiratish (Eye Blink)
    eyeBlink.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2800 }),
        withTiming(0.15, { duration: 90 }),
        withTiming(1, { duration: 120 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      false
    );

    // 3. Orqa neon nurning sekin urishi (Aura Breathing)
    haloScale.value = withRepeat(
      withSequence(
        withTiming(1.25, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [floatY, eyeBlink, haloScale]);

  useEffect(() => {
    if (mood === 'celebrating') {
      tapScale.value = withRepeat(
        withSequence(
          withTiming(1.25, { duration: 200 }),
          withTiming(0.95, { duration: 200 })
        ),
        4,
        true
      );
    } else if (mood === 'listening') {
      haloScale.value = withRepeat(
        withSequence(
          withTiming(1.4, { duration: 450 }),
          withTiming(1.1, { duration: 450 })
        ),
        -1,
        true
      );
    } else if (mood === 'thinking') {
      floatY.value = withRepeat(
        withSequence(
          withTiming(-8, { duration: 700 }),
          withTiming(2, { duration: 700 })
        ),
        -1,
        true
      );
    }
  }, [mood, tapScale, haloScale, floatY]);

  const animatedHeadStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: floatY.value },
      { scale: tapScale.value },
    ],
  }));

  const animatedEyeStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: eyeBlink.value }],
  }));

  const animatedHaloStyle = useAnimatedStyle(() => ({
    transform: [{ scale: haloScale.value }],
  }));

  const handlePress = () => {
    HapticFeedback.medium();
    tapScale.value = withSequence(
      withSpring(1.22, { damping: 8, stiffness: 380 }),
      withSpring(1, { damping: 10, stiffness: 260 })
    );
    if (onPress) onPress();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      style={[styles.container, { width: size, height: size }]}
    >
      {/* 1. Orqa mayin neon aura nuri */}
      <Animated.View style={[styles.haloGlow, animatedHaloStyle]} />

      {/* 2. Jonli Robot Boshchasi */}
      <Animated.View style={[styles.robotContainer, animatedHeadStyle]}>
        {/* Yuqori antenna */}
        <View style={styles.antennaStem} />
        <View style={styles.antennaOrb} />

        {/* Yon quloqchinlar (Headphones) */}
        <View style={styles.earLeft} />
        <View style={styles.earRight} />

        {/* Robot Yuzi (Shisha Kapsula) */}
        <View style={styles.robotFace}>
          {/* Qorong'u LED Displey */}
          <View style={styles.ledScreen}>
            {/* Chap Ko'z (Cyan LED) */}
            <Animated.View style={[styles.eye, animatedEyeStyle]} />
            {/* O'ng Ko'z (Cyan LED) */}
            <Animated.View style={[styles.eye, animatedEyeStyle]} />
          </View>
        </View>

        {/* Onlayn Sokratik AI Yashil Nuqtasi */}
        <View style={styles.onlineBadge} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  haloGlow: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(40, 172, 255, 0.25)',
    shadowColor: theme.colors.mathBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  robotContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  antennaStem: {
    position: 'absolute',
    top: 2,
    width: 2.5,
    height: 7,
    backgroundColor: '#94A3B8',
    borderRadius: 1,
    zIndex: 1,
  },
  antennaOrb: {
    position: 'absolute',
    top: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.streakOrange,
    borderWidth: 1.2,
    borderColor: '#FFFFFF',
    zIndex: 2,
    shadowColor: theme.colors.streakOrange,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  earLeft: {
    position: 'absolute',
    left: 2,
    width: 5,
    height: 14,
    borderRadius: 3,
    backgroundColor: theme.colors.mathBlue,
    zIndex: 1,
  },
  earRight: {
    position: 'absolute',
    right: 2,
    width: 5,
    height: 14,
    borderRadius: 3,
    backgroundColor: theme.colors.mathBlue,
    zIndex: 1,
  },
  robotFace: {
    width: 38,
    height: 33,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 3,
  },
  ledScreen: {
    width: 28,
    height: 19,
    borderRadius: 9,
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  eye: {
    width: 6,
    height: 7,
    borderRadius: 3,
    backgroundColor: '#00E5FF',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#34C759',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 10,
  },
});
