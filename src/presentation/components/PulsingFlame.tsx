// O'ylanish: Ushbu komponent kunlik o'quv streakini (Flame) silliq Reanimated 3 animatsiyasi
// va Phosphor Icons 'fill' vazni bilan ta'minlaydi.
import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Flame } from 'phosphor-react-native';
import { theme } from '../../core/theme';

export interface PulsingFlameProps {
  size?: number;
  color?: string;
}

export const PulsingFlame: React.FC<PulsingFlameProps> = ({
  size = 18,
  color = theme.colors.streakOrange,
}) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.18, { duration: 650, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0, { duration: 650, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Flame size={size} color={color} weight="fill" />
    </Animated.View>
  );
};
