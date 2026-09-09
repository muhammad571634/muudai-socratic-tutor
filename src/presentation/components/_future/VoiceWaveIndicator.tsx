import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { Sparkle, Microphone, Lightbulb, SpeakerHigh } from 'phosphor-react-native';
import { theme } from '../../../core/theme';
import { TutorVoiceState, TUTOR_STATE_CONFIGS } from '../../../domain/entities/TutorState';

export interface VoiceWaveIndicatorProps {
  state: TutorVoiceState;
  size?: number;
  accentColor?: string;
}

export const VoiceWaveIndicator: React.FC<VoiceWaveIndicatorProps> = ({
  state,
  size = 72,
  accentColor = theme.colors.chemistryOrange,
}) => {
  const pulseScale1 = useSharedValue(1);
  const pulseOpacity1 = useSharedValue(0.6);

  const pulseScale2 = useSharedValue(1);
  const pulseOpacity2 = useSharedValue(0.4);

  const innerScale = useSharedValue(1);

  useEffect(() => {
    cancelAnimation(pulseScale1);
    cancelAnimation(pulseOpacity1);
    cancelAnimation(pulseScale2);
    cancelAnimation(pulseOpacity2);
    cancelAnimation(innerScale);

    if (state === 'speaking' || state === 'listening') {
      const duration = state === 'speaking' ? 1400 : 1800;

      pulseScale1.value = withRepeat(
        withTiming(2.2, { duration, easing: Easing.out(Easing.ease) }),
        -1,
        false
      );
      pulseOpacity1.value = withRepeat(
        withTiming(0, { duration, easing: Easing.out(Easing.ease) }),
        -1,
        false
      );

      pulseScale2.value = withSequence(
        withTiming(1, { duration: duration * 0.3 }),
        withRepeat(
          withTiming(1.8, { duration, easing: Easing.out(Easing.ease) }),
          -1,
          false
        )
      );
      pulseOpacity2.value = withSequence(
        withTiming(0.5, { duration: duration * 0.3 }),
        withRepeat(
          withTiming(0, { duration, easing: Easing.out(Easing.ease) }),
          -1,
          false
        )
      );

      innerScale.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 300, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.96, { duration: 300, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else if (state === 'thinking') {
      innerScale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.92, { duration: 600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      pulseScale1.value = withTiming(1.3, { duration: 500 });
      pulseOpacity1.value = withTiming(0.3, { duration: 500 });
      pulseScale2.value = withTiming(1, { duration: 500 });
      pulseOpacity2.value = withTiming(0, { duration: 500 });
    } else {
      innerScale.value = withRepeat(
        withSequence(
          withTiming(1.03, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.98, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      pulseScale1.value = withTiming(1, { duration: 400 });
      pulseOpacity1.value = withTiming(0, { duration: 400 });
      pulseScale2.value = withTiming(1, { duration: 400 });
      pulseOpacity2.value = withTiming(0, { duration: 400 });
    }
  }, [state, innerScale, pulseOpacity1, pulseOpacity2, pulseScale1, pulseScale2]);

  const animatedWave1 = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale1.value }],
    opacity: pulseOpacity1.value,
  }));

  const animatedWave2 = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale2.value }],
    opacity: pulseOpacity2.value,
  }));

  const animatedInner = useAnimatedStyle(() => ({
    transform: [{ scale: innerScale.value }],
  }));

  const config = TUTOR_STATE_CONFIGS[state];

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* 1-Wave Ring */}
      <Animated.View
        style={[
          styles.waveRing,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: accentColor,
            backgroundColor: `${accentColor}25`,
          },
          animatedWave1,
        ]}
      />

      {/* 2-Wave Ring */}
      <Animated.View
        style={[
          styles.waveRing,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: accentColor,
            backgroundColor: `${accentColor}15`,
          },
          animatedWave2,
        ]}
      />

      {/* Center Core Circle with Crisp Vector Icon */}
      <Animated.View
        style={[
          styles.coreCircle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: accentColor,
          },
          animatedInner,
        ]}
      >
        {state === 'listening' ? (
          <Microphone size={Math.round(size * 0.42)} color={accentColor} weight="bold" />
        ) : state === 'thinking' ? (
          <Lightbulb size={Math.round(size * 0.42)} color={accentColor} weight="fill" />
        ) : state === 'speaking' ? (
          <SpeakerHigh size={Math.round(size * 0.42)} color={accentColor} weight="bold" />
        ) : (
          <Sparkle size={Math.round(size * 0.42)} color={accentColor} weight="fill" />
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  waveRing: {
    position: 'absolute',
    borderWidth: 2,
  },
  coreCircle: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
});
