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
import { Sparkle } from 'phosphor-react-native';
import { theme } from '../../core/theme';
import { HapticFeedback } from '../../core/haptics';

export type MascotMood = 'idle' | 'listening' | 'thinking' | 'celebrating';

export interface AiMascotAvatarProps {
  size?: number;
  mood?: MascotMood;
  onPress?: () => void;
  showCelebrationArms?: boolean;
}

/**
 * Duolingo uslubidagi jonli AI Repetitor Maskoti (MuudAI Buddy).
 * 60-120fps GPU Reanimated orqali mayin suzadi, ko'zlarini qisadi,
 * g'alaba/nishonlash holatida qo'llarini ko'tarib quvonadi va teginishga javob beradi.
 */
export const AiMascotAvatar: React.FC<AiMascotAvatarProps> = ({
  size = 54,
  mood = 'idle',
  onPress,
  showCelebrationArms,
}) => {
  // Reanimated GPU animatsiyalari
  const floatY = useSharedValue(0);
  const eyeBlink = useSharedValue(1);
  const haloScale = useSharedValue(1);
  const tapScale = useSharedValue(1);

  // Nishonlash (Celebration) holati shared value'lari
  const jumpY = useSharedValue(0);
  const squashScaleY = useSharedValue(1);
  const squashScaleX = useSharedValue(1);
  const leftArmRot = useSharedValue(-38);
  const rightArmRot = useSharedValue(38);
  const legKick = useSharedValue(0);
  const sparkleScale = useSharedValue(0.8);

  const isCelebrating = mood === 'celebrating';
  const baseScale = size / 54;
  const shouldShowArms = isCelebrating && (showCelebrationArms ?? size >= 54);

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
    if (isCelebrating) {
      // 1. Quvnoq sakrash va elastik (squash & stretch) fizika
      jumpY.value = withRepeat(
        withSequence(
          withTiming(-16, { duration: 320, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
          withTiming(0, { duration: 280, easing: Easing.bezier(0.42, 0, 1, 1) })
        ),
        -1,
        true
      );

      squashScaleY.value = withRepeat(
        withSequence(
          withTiming(1.12, { duration: 320 }),
          withTiming(0.9, { duration: 280 })
        ),
        -1,
        true
      );

      squashScaleX.value = withRepeat(
        withSequence(
          withTiming(0.92, { duration: 320 }),
          withTiming(1.08, { duration: 280 })
        ),
        -1,
        true
      );

      // 2. Havoda ko'tarilgan qo'llarning quvnoq silkinishi
      leftArmRot.value = withRepeat(
        withSequence(
          withTiming(-56, { duration: 220, easing: Easing.inOut(Easing.ease) }),
          withTiming(-30, { duration: 220, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );

      rightArmRot.value = withRepeat(
        withSequence(
          withTiming(56, { duration: 220, easing: Easing.inOut(Easing.ease) }),
          withTiming(30, { duration: 220, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );

      // 3. Havoda oyoqchalarning erkin tebranishi
      legKick.value = withRepeat(
        withSequence(
          withTiming(10, { duration: 260, easing: Easing.inOut(Easing.ease) }),
          withTiming(-10, { duration: 260, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );

      // 4. Mayin yulduzchalar charaqlashi
      sparkleScale.value = withRepeat(
        withSequence(
          withTiming(1.25, { duration: 500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.75, { duration: 500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );

      // 5. Orqa neon auraning g'alaba nuri
      haloScale.value = withRepeat(
        withSequence(
          withTiming(1.45, { duration: 400, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.15, { duration: 400, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
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
    } else {
      jumpY.value = 0;
      squashScaleY.value = 1;
      squashScaleX.value = 1;
      leftArmRot.value = -38;
      rightArmRot.value = 38;
      legKick.value = 0;
      sparkleScale.value = 0.8;
    }
  }, [
    isCelebrating,
    mood,
    jumpY,
    squashScaleY,
    squashScaleX,
    leftArmRot,
    rightArmRot,
    legKick,
    sparkleScale,
    haloScale,
    floatY,
  ]);

  const animatedHeadStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: isCelebrating ? jumpY.value : floatY.value },
      { scaleX: (isCelebrating ? squashScaleX.value : 1) * tapScale.value * baseScale },
      { scaleY: (isCelebrating ? squashScaleY.value : 1) * tapScale.value * baseScale },
    ],
  }));

  const animatedEyeStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: eyeBlink.value }],
  }));

  const animatedHaloStyle = useAnimatedStyle(() => ({
    transform: [{ scale: haloScale.value * baseScale }],
  }));

  const animatedLeftArmStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -3 },
      { translateY: 4 },
      { rotate: `${leftArmRot.value}deg` },
      { translateY: -8 },
    ],
  }));

  const animatedRightArmStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: 3 },
      { translateY: 4 },
      { rotate: `${rightArmRot.value}deg` },
      { translateY: -8 },
    ],
  }));

  const animatedLeftLegStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${legKick.value}deg` }],
  }));

  const animatedRightLegStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-legKick.value}deg` }],
  }));

  const animatedSparkleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sparkleScale.value }],
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

      {/* 2. Jonli Robot Boshchasi va Nishonlash Tanasi */}
      <Animated.View style={[styles.robotContainer, animatedHeadStyle]}>
        {/* Nishonlash paytidagi ko'tarilgan qo'llar */}
        {shouldShowArms && (
          <>
            <Animated.View style={[styles.armLeft, animatedLeftArmStyle]}>
              <View style={styles.armBar} />
              <View style={styles.hand} />
            </Animated.View>
            <Animated.View style={[styles.armRight, animatedRightArmStyle]}>
              <View style={styles.armBar} />
              <View style={styles.hand} />
            </Animated.View>
          </>
        )}

        {/* Yuqori antenna */}
        <View style={styles.antennaStem} />
        <Animated.View style={[styles.antennaOrb, isCelebrating && animatedSparkleStyle]} />

        {/* Yon quloqchinlar (Headphones) */}
        <View style={styles.earLeft} />
        <View style={styles.earRight} />

        {/* Nishonlash paytidagi sakrovchi oyoqchalar */}
        {shouldShowArms && (
          <>
            <Animated.View style={[styles.legLeft, animatedLeftLegStyle]}>
              <View style={styles.legBar} />
              <View style={styles.foot} />
            </Animated.View>
            <Animated.View style={[styles.legRight, animatedRightLegStyle]}>
              <View style={styles.legBar} />
              <View style={styles.foot} />
            </Animated.View>
          </>
        )}

        {/* Robot Yuzi (Shisha Kapsula) */}
        <View style={styles.robotFace}>
          {/* Qorong'u LED Displey */}
          <View style={styles.ledScreen}>
            {isCelebrating ? (
              <>
                {/* Chap Ko'z (Quvnoq ^ LED yoyi) */}
                <View style={styles.happyEye}>
                  <View style={styles.happyEyeArc} />
                </View>

                {/* Quvnoq tabassum qilayotgan tilchali og'izcha */}
                <View style={styles.mouthSmile}>
                  <View style={styles.mouthTongue} />
                </View>

                {/* O'ng Ko'z (Quvnoq ^ LED yoyi) */}
                <View style={styles.happyEye}>
                  <View style={styles.happyEyeArc} />
                </View>
              </>
            ) : (
              <>
                {/* Chap Ko'z (Cyan LED) */}
                <Animated.View style={[styles.eye, animatedEyeStyle]} />
                {/* O'ng Ko'z (Cyan LED) */}
                <Animated.View style={[styles.eye, animatedEyeStyle]} />
              </>
            )}
          </View>

          {/* Quvnoq yanoqchalar (Blush) */}
          {isCelebrating && (
            <>
              <View style={styles.blushLeft} />
              <View style={styles.blushRight} />
            </>
          )}
        </View>

        {/* Onlayn Sokratik AI Yashil Nuqtasi */}
        <View style={styles.onlineBadge} />

        {/* Nishonlash yulduzchalari */}
        {isCelebrating && (
          <>
            <Animated.View style={[styles.sparkleTopLeft, animatedSparkleStyle]}>
              <Sparkle size={10} color="#FFD60A" weight="fill" />
            </Animated.View>
            <Animated.View style={[styles.sparkleTopRight, animatedSparkleStyle]}>
              <Sparkle size={12} color="#AF52DE" weight="fill" />
            </Animated.View>
            <Animated.View style={[styles.sparkleBottomLeft, animatedSparkleStyle]}>
              <Sparkle size={9} color="#00E5FF" weight="fill" />
            </Animated.View>
          </>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'visible',
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
    zIndex: 2,
  },
  earRight: {
    position: 'absolute',
    right: 2,
    width: 5,
    height: 14,
    borderRadius: 3,
    backgroundColor: theme.colors.mathBlue,
    zIndex: 2,
  },
  armLeft: {
    position: 'absolute',
    top: 10,
    left: -8,
    width: 12,
    height: 22,
    zIndex: 1,
    alignItems: 'center',
  },
  armRight: {
    position: 'absolute',
    top: 10,
    right: -8,
    width: 12,
    height: 22,
    zIndex: 1,
    alignItems: 'center',
  },
  armBar: {
    width: 4.5,
    height: 16,
    borderRadius: 2.5,
    backgroundColor: theme.colors.mathBlue,
  },
  hand: {
    position: 'absolute',
    top: -3,
    width: 7.5,
    height: 7.5,
    borderRadius: 3.8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#BAE6FD',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  legLeft: {
    position: 'absolute',
    bottom: -7,
    left: 13,
    width: 6,
    height: 10,
    zIndex: 1,
    alignItems: 'center',
  },
  legRight: {
    position: 'absolute',
    bottom: -7,
    right: 13,
    width: 6,
    height: 10,
    zIndex: 1,
    alignItems: 'center',
  },
  legBar: {
    width: 3.5,
    height: 7,
    borderRadius: 1.8,
    backgroundColor: '#94A3B8',
  },
  foot: {
    position: 'absolute',
    bottom: 0,
    width: 7,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.mathBlue,
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
    paddingHorizontal: 2,
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
  happyEye: {
    width: 7,
    height: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  happyEyeArc: {
    width: 7,
    height: 5.5,
    borderTopWidth: 2,
    borderLeftWidth: 1.8,
    borderRightWidth: 1.8,
    borderBottomWidth: 0,
    borderColor: '#00E5FF',
    borderTopLeftRadius: 3.5,
    borderTopRightRadius: 3.5,
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.95,
    shadowRadius: 3,
  },
  mouthSmile: {
    width: 8,
    height: 5,
    backgroundColor: '#1E1B4B',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderWidth: 0.6,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  mouthTongue: {
    width: 5,
    height: 2.6,
    backgroundColor: '#FF4B4B',
    borderTopLeftRadius: 2.5,
    borderTopRightRadius: 2.5,
  },
  blushLeft: {
    position: 'absolute',
    bottom: 5,
    left: 4,
    width: 5.5,
    height: 3,
    borderRadius: 1.8,
    backgroundColor: 'rgba(255, 107, 129, 0.55)',
    zIndex: 4,
  },
  blushRight: {
    position: 'absolute',
    bottom: 5,
    right: 4,
    width: 5.5,
    height: 3,
    borderRadius: 1.8,
    backgroundColor: 'rgba(255, 107, 129, 0.55)',
    zIndex: 4,
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
  sparkleTopLeft: {
    position: 'absolute',
    top: -10,
    left: -12,
    zIndex: 20,
  },
  sparkleTopRight: {
    position: 'absolute',
    top: -8,
    right: -12,
    zIndex: 20,
  },
  sparkleBottomLeft: {
    position: 'absolute',
    bottom: -6,
    left: -10,
    zIndex: 20,
  },
});

