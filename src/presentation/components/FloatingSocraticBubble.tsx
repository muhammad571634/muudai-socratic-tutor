import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, Pressable, ActivityIndicator } from 'react-native';
import {
  XCircle,
  CheckCircle,
  Gift,
  SpeakerHigh,
  Lightbulb,
  Stop,
  Microphone,
  Sparkle,
} from 'phosphor-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  FadeInDown,
  FadeOutUp,
  LinearTransition,
} from 'react-native-reanimated';
import { theme } from '../../core/theme';
import { SocraticStep } from '../../domain/entities/SocraticDialogue';
import { SubjectType } from '../../domain/entities/Gamification';
import { HapticFeedback } from '../../core/haptics';
import { useVoiceSocratic } from '../hooks/useVoiceSocratic';
import { useVoiceAnswerHandler } from '../hooks/useVoiceAnswerHandler';
import { CelebrationConfetti } from './CelebrationConfetti';
import { AiMascotAvatar, MascotMood } from './AiMascotAvatar';

export interface FloatingSocraticBubbleProps {
  currentStep: SocraticStep;
  isFinished: boolean;
  finalAnswer: string;
  subject?: SubjectType;
  onSelectOption: (optionIndex: number) => void;
  onClaimVictory: () => void;
}

const OPTION_BADGES = ['A', 'B', 'C', 'D'];
const BADGE_ACCENT_COLORS = ['#0A84FF', '#BF5AF2', '#FF9F0A', '#30D158'];

/**
 * 60-120fps Taktil Apple Variant Pufakchasi
 */
interface TactileOptionPillProps {
  optionText: string;
  badgeLetter: string;
  badgeColor: string;
  isWrong: boolean;
  isSelected: boolean;
  onPress: () => void;
}

const TactileOptionPill: React.FC<TactileOptionPillProps> = ({
  optionText,
  badgeLetter,
  badgeColor,
  isWrong,
  isSelected,
  onPress,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 16, stiffness: 280 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 16, stiffness: 280 });
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View
        style={[
          styles.optionPill,
          isWrong ? styles.optionPillWrong : null,
          isSelected ? styles.optionPillCorrect : null,
          animatedStyle,
        ]}
      >
        <View
          style={[
            styles.optionBadge,
            {
              backgroundColor: isWrong
                ? '#FF453A'
                : isSelected
                ? '#30D158'
                : badgeColor,
            },
          ]}
        >
          <Text style={styles.optionBadgeText}>{badgeLetter}</Text>
        </View>

        <Text
          style={[
            styles.optionPillText,
            isWrong ? styles.optionPillTextWrong : null,
            isSelected ? styles.optionPillTextCorrect : null,
          ]}
        >
          {optionText}
        </Text>

        {isWrong ? (
          <XCircle size={18} color="#FF453A" weight="fill" />
        ) : isSelected ? (
          <CheckCircle size={18} color="#30D158" weight="fill" />
        ) : null}
      </Animated.View>
    </Pressable>
  );
};

/**
 * Apple-Minimalist Frosted Dynamic Island Sokratik Muloqot Kartasi
 * "Oddiylik bu boylikdir" falsafasiga asoslangan:
 * - Jonli MuudAI AI Maskot hamrohligi (kayfiyatlari bilan)
 * - Ortiqcha darslik jumlalarisiz, faqat eng zarur katta va qulay savol
 * - Taktil Apple spring 60-120fps variant tugmalari
 * - Yagona, ixcham ovozli va maslahat boshqaruvi
 */
export const FloatingSocraticBubble: React.FC<FloatingSocraticBubbleProps> = ({
  currentStep,
  isFinished,
  finalAnswer,
  subject = 'math',
  onSelectOption,
  onClaimVictory,
}) => {
  const [showHint, setShowHint] = useState(false);
  const [wrongIndex, setWrongIndex] = useState<number | null>(null);
  const [selectedCorrectIndex, setSelectedCorrectIndex] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Ovozli o'qib berish (TTS)
  const { isSpeaking, readCurrentStep, readHint, speakCelebration } = useVoiceSocratic({
    currentStep,
    isFinished,
    finalAnswer,
    autoSpeak: true,
  });

  // Reanimated 3 Xatolik silkinishi
  const shakeX = useSharedValue(0);

  const animatedShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  // Ovozli javobni qabul qilish (Voice Input / Gemini STT)
  const {
    recordingState,
    recordingDuration,
    lastEvaluation,
    toggleRecording,
  } = useVoiceAnswerHandler({
    currentStep,
    subject,
    onCorrectAnswer: (matchedIndex) => {
      setWrongIndex(null);
      setSelectedCorrectIndex(matchedIndex);
      setShowHint(false);
      setShowConfetti(true);
      setTimeout(() => {
        setSelectedCorrectIndex(null);
        onSelectOption(matchedIndex);
      }, 400);
    },
    onWrongAnswer: () => {
      setShowHint(true);
      shakeX.value = withSequence(
        withSpring(-8, { damping: 5, stiffness: 400 }),
        withSpring(8, { damping: 5, stiffness: 400 }),
        withSpring(0, { damping: 6, stiffness: 300 })
      );
    },
  });

  // Maskot kayfiyatini dinamik aniqlash (Jon beruvchi AI holati)
  const mascotMood: MascotMood = useMemo(() => {
    if (isFinished || selectedCorrectIndex !== null) return 'celebrating';
    if (recordingState === 'recording') return 'listening';
    if (recordingState === 'analyzing' || isSpeaking) return 'thinking';
    return 'idle';
  }, [isFinished, selectedCorrectIndex, recordingState, isSpeaking]);

  const handleOptionPress = (index: number) => {
    HapticFeedback.light();

    if (index === currentStep.correctOptionIndex) {
      setWrongIndex(null);
      setSelectedCorrectIndex(index);
      setShowHint(false);
      HapticFeedback.success();
      setShowConfetti(true);
      speakCelebration();
      setTimeout(() => {
        setSelectedCorrectIndex(null);
        onSelectOption(index);
      }, 350);
    } else {
      setWrongIndex(index);
      setShowHint(true);
      readHint();
      HapticFeedback.error();
      shakeX.value = withSequence(
        withSpring(-8, { damping: 5, stiffness: 400 }),
        withSpring(8, { damping: 5, stiffness: 400 }),
        withSpring(0, { damping: 6, stiffness: 300 })
      );
    }
  };

  const formatSecs = (secs: number): string => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.outerContainer}>
      {/* 1. G'alaba Konfetti Portlashi */}
      <CelebrationConfetti
        active={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />

      <Animated.View style={[styles.bubbleWrapper, animatedShakeStyle]}>
        {/* 2. Apple Frosted Glass Dynamic Island Kartasi */}
        <View style={styles.cardContainer}>
          {isFinished ? (
            /* ZAFAR EKANI (G'alaba va Mukofot Olish) */
            <Animated.View
              entering={FadeInDown.springify().damping(18).stiffness(160)}
              style={styles.victoryContent}
            >
              {/* Jonli nishonlayotgan maskot */}
              <View style={styles.victoryMascotRow}>
                <AiMascotAvatar size={62} mood="celebrating" />
              </View>

              <Text style={styles.victoryMainTitle}>Awesome! Problem Solved!</Text>
              <Text style={styles.victorySubText}>Verified Solution:</Text>

              <View style={styles.solutionBox}>
                <Text style={styles.solutionText}>{finalAnswer}</Text>
              </View>

              <Pressable
                style={styles.claimButton}
                onPress={() => {
                  HapticFeedback.success();
                  onClaimVictory();
                }}
              >
                <Gift size={18} color="#FFFFFF" weight="bold" style={styles.claimIcon} />
                <Text style={styles.claimButtonText}>Claim Reward (+100 XP)</Text>
              </Pressable>
            </Animated.View>
          ) : (
            /* SIMPLE, ALIVE & DISTRACTION-FREE SOCRATIC QUESTION AND CONTROLS */
            <Animated.View
              key={currentStep.id}
              entering={FadeInDown.springify().damping(18).stiffness(180)}
              layout={LinearTransition.springify().damping(20).stiffness(200)}
              style={styles.stepContent}
            >
              {/* Top Control Header: Live AI Mascot + Step Capsule + Speech */}
              <View style={styles.topHeaderRow}>
                <View style={styles.tutorProfileRow}>
                  <AiMascotAvatar size={38} mood={mascotMood} />
                  <View style={styles.tutorInfo}>
                    <View style={styles.tutorTitleRow}>
                      <Text style={styles.tutorName}>MuudAI</Text>
                      <View style={styles.liveIndicatorDot} />
                    </View>
                    <View style={styles.stepCapsule}>
                      <Text style={styles.stepCapsuleText}>
                        Step {currentStep.stepNumber} of {currentStep.totalSteps}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Read aloud button */}
                <Pressable
                  style={[
                    styles.speakerCapsule,
                    isSpeaking ? styles.speakerCapsuleActive : null,
                  ]}
                  onPress={() => {
                    HapticFeedback.light();
                    readCurrentStep();
                  }}
                >
                  <SpeakerHigh
                    size={16}
                    color="#FFFFFF"
                    weight="bold"
                  />
                  <Text style={styles.speakerCapsuleText}>
                    {isSpeaking ? "Speaking..." : "Listen"}
                  </Text>
                </Pressable>
              </View>

              {/* Socratic Question (Clear, bold, single focal point) */}
              <Text style={styles.questionText}>{currentStep.tutorQuestion}</Text>

              {/* TACTILE OPTION PILLS (Smooth Apple Springs) */}
              <View style={styles.optionsList}>
                {currentStep.quickOptions.map((optionText, idx) => {
                  const isWrong = wrongIndex === idx;
                  const isSelected = selectedCorrectIndex === idx;
                  const badgeLetter = OPTION_BADGES[idx] || `${idx + 1}`;
                  const badgeColor = BADGE_ACCENT_COLORS[idx % BADGE_ACCENT_COLORS.length];

                  return (
                    <TactileOptionPill
                      key={idx}
                      optionText={optionText}
                      badgeLetter={badgeLetter}
                      badgeColor={badgeColor}
                      isWrong={isWrong}
                      isSelected={isSelected}
                      onPress={() => handleOptionPress(idx)}
                    />
                  );
                })}
              </View>

              {/* BOTTOM ACTION ROW (Hint + Apple Intelligence Voice Capsule) */}
              <View style={styles.bottomActionRow}>
                {/* 1. Hint Toggle */}
                <Pressable
                  style={[
                    styles.hintToggleBtn,
                    showHint ? styles.hintToggleBtnActive : null,
                  ]}
                  onPress={() => {
                    HapticFeedback.light();
                    setShowHint((prev) => !prev);
                  }}
                >
                  <Lightbulb
                    size={16}
                    color={showHint ? '#FF9F0A' : 'rgba(255, 255, 255, 0.75)'}
                    weight={showHint ? 'fill' : 'bold'}
                  />
                  <Text
                    style={[
                      styles.hintToggleText,
                      showHint ? styles.hintToggleTextActive : null,
                    ]}
                  >
                    Hint
                  </Text>
                </Pressable>

                {/* 2. Apple Intelligence Voice Capsule */}
                <Pressable
                  style={[
                    styles.voiceActionCapsule,
                    recordingState === 'recording'
                      ? styles.voiceActionRecording
                      : recordingState === 'analyzing'
                      ? styles.voiceActionAnalyzing
                      : null,
                  ]}
                  onPress={() => {
                    HapticFeedback.selection();
                    toggleRecording();
                  }}
                  disabled={recordingState === 'analyzing'}
                >
                  {recordingState === 'analyzing' ? (
                    <ActivityIndicator size="small" color="#FFFFFF" style={styles.miniSpinner} />
                  ) : recordingState === 'recording' ? (
                    <Stop size={14} color="#FF453A" weight="fill" />
                  ) : (
                    <Microphone size={16} color="#0A84FF" weight="bold" />
                  )}

                  <Text
                    style={[
                      styles.voiceActionText,
                      recordingState === 'recording'
                        ? styles.voiceActionTextRecording
                        : recordingState === 'analyzing'
                        ? styles.voiceActionTextAnalyzing
                        : null,
                    ]}
                  >
                    {recordingState === 'recording'
                      ? `Listening (${formatSecs(recordingDuration)})...`
                      : recordingState === 'analyzing'
                      ? "Thinking..."
                      : 'Tap to Speak'}
                  </Text>

                  {recordingState === 'idle' ? (
                    <Sparkle size={13} color="#0A84FF" weight="fill" style={styles.sparkleIcon} />
                  ) : null}
                </Pressable>
              </View>

              {/* OVOZLI JAVOB NATIJASI (Ixcham va Chiroyli Toast) */}
              {lastEvaluation ? (
                <View
                  style={[
                    styles.voiceFeedbackToast,
                    lastEvaluation.isCorrect
                      ? styles.voiceFeedbackSuccess
                      : styles.voiceFeedbackError,
                  ]}
                >
                  {lastEvaluation.isCorrect ? (
                    <CheckCircle size={16} color="#30D158" weight="fill" />
                  ) : (
                    <Lightbulb size={16} color="#FF9F0A" weight="fill" />
                  )}
                  <Text style={styles.voiceFeedbackBody} numberOfLines={2}>
                    {lastEvaluation.feedbackText}
                  </Text>
                </View>
              ) : null}

              {/* MASLAHAT KO'RSATILGANDA (Yumshoq Frosted Toast) */}
              {showHint ? (
                <Animated.View
                  entering={FadeInDown.springify().damping(18).stiffness(200)}
                  exiting={FadeOutUp.duration(150)}
                  style={styles.hintToast}
                >
                  <Lightbulb size={16} color="#FFD60A" weight="fill" style={styles.hintToastIcon} />
                  <Text style={styles.hintToastText}>{currentStep.hintText}</Text>
                </Animated.View>
              ) : null}
            </Animated.View>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    position: 'relative',
  },
  bubbleWrapper: {
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 14,
  },
  cardContainer: {
    backgroundColor: 'rgba(20, 20, 26, 0.90)',
    borderRadius: 26,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 16,
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 22,
    elevation: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  stepContent: {
    width: '100%',
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tutorProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tutorInfo: {
    justifyContent: 'center',
  },
  tutorTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 2,
  },
  tutorName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  liveIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#30D158',
  },
  stepCapsule: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radii.pill,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignSelf: 'flex-start',
  },
  stepCapsuleText: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  speakerCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.09)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radii.pill,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    gap: 5,
  },
  speakerCapsuleActive: {
    backgroundColor: '#0A84FF',
    borderColor: '#0A84FF',
  },
  speakerCapsuleText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
  },
  questionText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 25,
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  optionsList: {
    gap: 8,
    marginBottom: 12,
  },
  optionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  optionPillWrong: {
    backgroundColor: 'rgba(255, 69, 58, 0.22)',
    borderColor: '#FF453A',
  },
  optionPillCorrect: {
    backgroundColor: 'rgba(48, 209, 88, 0.22)',
    borderColor: '#30D158',
  },
  optionBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  optionBadgeText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  optionPillText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
    flex: 1,
  },
  optionPillTextWrong: {
    color: '#FF6961',
  },
  optionPillTextCorrect: {
    color: '#30D158',
  },
  bottomActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  hintToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: theme.radii.pill,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    gap: 5,
  },
  hintToggleBtnActive: {
    backgroundColor: 'rgba(255, 159, 10, 0.2)',
    borderColor: '#FF9F0A',
  },
  hintToggleText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '700',
  },
  hintToggleTextActive: {
    color: '#FF9F0A',
  },
  voiceActionCapsule: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(10, 132, 255, 0.14)',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: theme.radii.pill,
    borderWidth: 0.5,
    borderColor: 'rgba(10, 132, 255, 0.35)',
    gap: 6,
  },
  voiceActionRecording: {
    backgroundColor: 'rgba(255, 69, 58, 0.22)',
    borderColor: '#FF453A',
  },
  voiceActionAnalyzing: {
    backgroundColor: 'rgba(175, 82, 222, 0.22)',
    borderColor: '#AF52DE',
  },
  voiceActionText: {
    color: '#0A84FF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  voiceActionTextRecording: {
    color: '#FF453A',
  },
  voiceActionTextAnalyzing: {
    color: '#AF52DE',
  },
  sparkleIcon: {
    marginLeft: 2,
  },
  miniSpinner: {
    marginRight: 2,
  },
  voiceFeedbackToast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 0.5,
    marginTop: 8,
  },
  voiceFeedbackSuccess: {
    backgroundColor: 'rgba(48, 209, 88, 0.14)',
    borderColor: 'rgba(48, 209, 88, 0.35)',
  },
  voiceFeedbackError: {
    backgroundColor: 'rgba(255, 159, 10, 0.14)',
    borderColor: 'rgba(255, 159, 10, 0.35)',
  },
  voiceFeedbackBody: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    lineHeight: 16,
  },
  hintToast: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 159, 10, 0.14)',
    borderRadius: 14,
    padding: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 159, 10, 0.3)',
    marginTop: 8,
  },
  hintToastIcon: {
    marginRight: 6,
    marginTop: 1,
  },
  hintToastText: {
    color: '#FFD60A',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
    flex: 1,
  },
  victoryContent: {
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
  },
  victoryMascotRow: {
    marginBottom: 10,
  },
  victoryMainTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
  },
  victorySubText: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 12.5,
    marginBottom: 10,
  },
  solutionBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    marginBottom: 14,
    width: '100%',
    alignItems: 'center',
  },
  solutionText: {
    color: '#30D158',
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#30D158',
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: theme.radii.pill,
    width: '100%',
    shadowColor: '#30D158',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  claimIcon: {
    marginRight: 6,
  },
  claimButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
