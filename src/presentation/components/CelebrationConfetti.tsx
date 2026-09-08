import React, { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Sparkle } from 'phosphor-react-native';

const CONFETTI_COLORS = [
  '#58CC02', // Duolingo green
  '#FFD60A', // Star gold
  '#2FB8FF', // Diamond blue
  '#FF9600', // Streak orange
  '#AF52DE', // Purple magic
  '#FF4B4B', // Heart ruby
  '#10B981', // Emerald
];

const NUM_PARTICLES = 36;

interface ParticleProps {
  index: number;
  active: boolean;
}

const ConfettiParticle: React.FC<ParticleProps> = ({ index, active }) => {
  const progress = useSharedValue(0);

  // Deterministic pseudo-random generation per particle to eliminate re-render jumps
  const { targetX, targetY, size, color, delay, rotationTarget, isStar, isRibbon } =
    useMemo(() => {
      const pseudoRand = ((index * 9301 + 49297) % 233280) / 233280;
      const pseudoRand2 = ((index * 12345 + 67891) % 233280) / 233280;
      const angle = (index / NUM_PARTICLES) * 2 * Math.PI + (pseudoRand - 0.5) * 0.4;
      const distance = 95 + pseudoRand2 * 170;

      return {
        targetX: Math.cos(angle) * distance,
        targetY: Math.sin(angle) * distance - 55, // upward burst
        size: 7 + (index % 4) * 3,
        color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
        delay: (index % 6) * 20,
        rotationTarget: 360 * (1 + (index % 3)),
        isStar: index % 4 === 0,
        isRibbon: index % 4 === 2,
      };
    }, [index]);

  useEffect(() => {
    if (active) {
      progress.value = 0;
      progress.value = withDelay(
        delay,
        withTiming(1, {
          duration: 1050 + (index % 4) * 110,
          easing: Easing.out(Easing.quad),
        })
      );
    } else {
      progress.value = 0;
    }
  }, [active, delay, index, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(progress.value, [0, 1], [0, targetX]);
    const translateY = interpolate(progress.value, [0, 0.35, 1], [0, targetY, targetY + 130]);
    const opacity = interpolate(progress.value, [0, 0.7, 1], [1, 1, 0]);
    const scale = interpolate(progress.value, [0, 0.2, 0.75, 1], [0, 1.25, 0.95, 0.35]);
    const rotate = `${interpolate(progress.value, [0, 1], [0, rotationTarget])}deg`;

    return {
      transform: [{ translateX }, { translateY }, { rotate }, { scale }],
      opacity,
    };
  });

  if (isStar) {
    return (
      <Animated.View style={[styles.particle, animatedStyle]}>
        <Sparkle size={size + 6} color={color} weight="fill" />
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.particle,
        animatedStyle,
        {
          width: isRibbon ? size * 0.6 : size,
          height: isRibbon ? size * 1.5 : size,
          backgroundColor: color,
          borderRadius: isRibbon ? 2 : index % 2 === 0 ? size / 2 : 2,
        },
      ]}
    />
  );
};

export interface CelebrationConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

/**
 * Reanimated 3 GPU Confetti and Star Burst for Socratic celebrations.
 * Zero JS thread overhead, locked 60-120fps.
 */
export const CelebrationConfetti: React.FC<CelebrationConfettiProps> = ({
  active,
  onComplete,
}) => {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => {
        onCompleteRef.current?.();
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!active) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: NUM_PARTICLES }).map((_, i) => (
        <ConfettiParticle key={i} index={i} active={active} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  particle: {
    position: 'absolute',
  },
});
