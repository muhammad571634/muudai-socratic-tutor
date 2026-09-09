import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stop, CheckCircle, Microphone } from 'phosphor-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { theme } from '../../../core/theme';
import { HapticFeedback } from '../../../core/haptics';
import { VoiceRecordingState } from '../../../domain/entities/VoiceEvaluation';

export interface MagicMicOrbProps {
  recordingState: VoiceRecordingState;
  recordingDuration: number;
  onPress: () => void;
  disabled?: boolean;
}

/**
 * Bolalar uchun Apple Intelligence / Siri uslubidagi Sehrli Ovoz Shari (Magic Mic Orb).
 * Katta, taktil va jozibali interfeys orqali bolani gapirishga undaydi.
 */
export const MagicMicOrb: React.FC<MagicMicOrbProps> = ({
  recordingState,
  recordingDuration,
  onPress,
  disabled = false,
}) => {
  const isRecording = recordingState === 'recording';
  const isAnalyzing = recordingState === 'analyzing';
  const isSuccess = recordingState === 'success';

  // 1. Orqa nur nafas olishi (Aura breathing)
  const auraScale = useSharedValue(1);
  const auraOpacity = useSharedValue(0.4);

  // 2. Yozish pulsatsiyasi
  const pulseScale = useSharedValue(1);

  // 3. Tugma bosilish fizikasi
  const tapScale = useSharedValue(1);

  useEffect(() => {
    if (isRecording) {
      // Yozilayotganda qizg'in tebranish
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.28, { duration: 550, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.0, { duration: 550, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      auraOpacity.value = withRepeat(
        withSequence(withTiming(0.8, { duration: 550 }), withTiming(0.3, { duration: 550 })),
        -1,
        true
      );
    } else {
      // Tinch holatda mayin nafas olish
      pulseScale.value = withSpring(1);
      auraScale.value = withRepeat(
        withSequence(
          withTiming(1.18, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.0, { duration: 1800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      auraOpacity.value = withRepeat(
        withSequence(withTiming(0.45, { duration: 1800 }), withTiming(0.2, { duration: 1800 })),
        -1,
        true
      );
    }
  }, [isRecording, pulseScale, auraScale, auraOpacity]);

  const animatedAuraStyle = useAnimatedStyle(() => ({
    transform: [{ scale: isRecording ? pulseScale.value : auraScale.value }],
    opacity: auraOpacity.value,
  }));

  const animatedOrbStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: isRecording ? pulseScale.value : 1 },
      { scale: tapScale.value },
    ],
  }));

  const handlePress = () => {
    if (disabled) return;
    HapticFeedback.medium();
    tapScale.value = withSequence(
      withSpring(0.9, { damping: 10, stiffness: 400 }),
      withSpring(1, { damping: 8, stiffness: 300 })
    );
    onPress();
  };

  const formatSecs = (secs: number): string => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.wrapper}>
      {/* 1. Orqa Mayin Neon Aura Shari */}
      <Animated.View
        style={[
          styles.auraGlow,
          isRecording ? styles.auraRecording : isAnalyzing ? styles.auraAnalyzing : styles.auraIdle,
          animatedAuraStyle,
        ]}
      />

      {/* 2. Asosiy Dumaloq Taktil Orb Tugmasi */}
      <Animated.View style={animatedOrbStyle}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handlePress}
          disabled={disabled || isAnalyzing}
          style={[
            styles.orbButton,
            isRecording ? styles.orbRecording : null,
            isAnalyzing ? styles.orbAnalyzing : null,
            isSuccess ? styles.orbSuccess : null,
          ]}
        >
          {isAnalyzing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : isRecording ? (
            <Stop size={28} color="#FFFFFF" weight="fill" />
          ) : isSuccess ? (
            <CheckCircle size={30} color="#FFFFFF" weight="fill" />
          ) : (
            <Microphone size={30} color="#FFFFFF" weight="bold" />
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* 3. Bolalar uchun Do'stona Maslahat Yozuvi */}
      <View style={styles.labelContainer}>
        {isRecording ? (
          <View style={styles.recordingLabelRow}>
            <View style={styles.redRecordDot} />
            <Text style={styles.recordingLabelText}>
              Listening ({formatSecs(recordingDuration)}) • Tap to finish
            </Text>
          </View>
        ) : isAnalyzing ? (
          <Text style={styles.analyzingLabelText}>
            MuudAI is analyzing your answer...
          </Text>
        ) : isSuccess ? (
          <Text style={styles.successLabelText}>
            Awesome! You got it right!
          </Text>
        ) : (
          <Text style={styles.idleLabelText}>
            Tap to speak your answer
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    position: 'relative',
  },
  auraGlow: {
    position: 'absolute',
    width: 82,
    height: 82,
    borderRadius: 41,
    top: -5,
  },
  auraIdle: {
    backgroundColor: 'rgba(0, 122, 255, 0.35)',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 18,
  },
  auraRecording: {
    backgroundColor: 'rgba(239, 68, 68, 0.45)',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 22,
  },
  auraAnalyzing: {
    backgroundColor: 'rgba(139, 92, 246, 0.45)',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 22,
  },
  orbButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  orbRecording: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
  },
  orbAnalyzing: {
    backgroundColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
  },
  orbSuccess: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
  },
  labelContainer: {
    marginTop: 8,
    alignItems: 'center',
    minHeight: 22,
  },
  recordingLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  redRecordDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  recordingLabelText: {
    color: '#EF4444',
    fontSize: 12.5,
    fontWeight: '800',
  },
  analyzingLabelText: {
    color: '#8B5CF6',
    fontSize: 12.5,
    fontWeight: '800',
  },
  successLabelText: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '800',
  },
  idleLabelText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700',
  },
});
