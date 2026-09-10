import React from 'react';
import { StyleSheet, Text, View, Pressable, StyleProp, ViewStyle, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { theme } from '../../core/theme';
import { HapticFeedback } from '../../core/haptics';

export type DuoButtonType = 'primary' | 'secondary' | 'danger' | 'success';

export interface DuoButtonProps {
  title: string;
  onPress: () => void;
  type?: DuoButtonType;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const DuoButton: React.FC<DuoButtonProps> = ({
  title,
  onPress,
  type = 'primary',
  disabled = false,
  style,
  textStyle,
}) => {
  const isPressed = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: withSpring(isPressed.value ? 4 : 0, { damping: 14, stiffness: 350, mass: 0.8 }) },
      ],
    };
  });

  const getButtonStyles = () => {
    if (disabled) {
      return {
        bg: '#E5E5E5',
        shadow: '#D4D4D4',
        text: '#AFAFAF',
        border: 'transparent',
      };
    }
    switch (type) {
      case 'secondary':
        return {
          bg: theme.colors.physicsIndigoLight,
          shadow: theme.colors.physicsIndigoBorder,
          text: theme.colors.physicsIndigo,
          border: theme.colors.physicsIndigoBorder,
        };
      case 'danger':
        return {
          bg: theme.colors.chemistryOrange,
          shadow: theme.colors.chemistryOrangeShadow,
          text: '#FFFFFF',
          border: 'transparent',
        };
      case 'success':
        return {
          bg: theme.colors.successGreen,
          shadow: theme.colors.successGreenShadow,
          text: '#FFFFFF',
          border: 'transparent',
        };
      case 'primary':
      default:
        return {
          bg: theme.colors.physicsIndigo,
          shadow: theme.colors.physicsIndigoShadow,
          text: '#FFFFFF',
          border: 'transparent',
        };
    }
  };

  const colors = getButtonStyles();

  const handlePressIn = () => {
    if (disabled) return;
    HapticFeedback.light();
    isPressed.value = true;
  };

  const handlePressOut = () => {
    if (disabled) return;
    isPressed.value = false;
  };

  const shadowHeight = type === 'secondary' ? 2 : 4;

  return (
    <View style={[styles.container, style]}>
      {/* Shadow layer */}
      <View
        style={[
          styles.shadow,
          {
            backgroundColor: colors.shadow,
            borderRadius: 16,
            top: shadowHeight,
          },
        ]}
      />
      {/* Front layer */}
      <AnimatedPressable
        onPress={disabled ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.button,
          {
            backgroundColor: colors.bg,
            borderColor: colors.border !== 'transparent' ? colors.border : colors.bg,
            borderWidth: colors.border !== 'transparent' ? 2 : 0,
          },
          animatedStyle,
        ]}
      >
        <Text style={[styles.text, { color: colors.text }, textStyle]}>
          {title}
        </Text>
      </AnimatedPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    height: 56,
  },
  shadow: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    bottom: -4,
  },
  button: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
