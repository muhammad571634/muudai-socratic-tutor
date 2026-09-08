import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export interface FloatingElementProps {
  children: React.ReactNode;
  distance?: number;
  duration?: number;
  rotateDeg?: number;
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  distance = 5,
  duration = 1600,
  rotateDeg = 0,
}) => {
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Silliq havoda suzish (Floating hover)
    translateY.value = withRepeat(
      withSequence(
        withTiming(-distance, { duration, easing: Easing.inOut(Easing.ease) }),
        withTiming(distance, { duration, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Agar aylanish berilgan bo'lsa
    if (rotateDeg > 0) {
      rotation.value = withRepeat(
        withSequence(
          withTiming(rotateDeg, { duration: duration * 1.2, easing: Easing.inOut(Easing.ease) }),
          withTiming(-rotateDeg, { duration: duration * 1.2, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }
  }, [distance, duration, rotateDeg, rotation, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};
