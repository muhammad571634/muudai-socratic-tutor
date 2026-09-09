// O'ylanish: Ushbu komponent Socratic AR Vision va Duolingo uslubidagi interaktiv ta'limni
// Apple HIG minimalist dizayn va Reanimated 3 GPU animatsiyalari bilan 100% to'liq amalga oshiradi.

import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
  FadeInDown,
  FadeInUp,
  type SharedValue,
} from "react-native-reanimated";
import {
  CaretLeft,
  CaretDown,
  Lightning,
  Flashlight,
  Scan,
  Lightbulb,
  Microphone,
  CheckCircle,
  XCircle,
  Camera,
  GraduationCap,
  Trophy,
  NotePencil,
  Sparkle,
  Calculator,
  Atom,
  Flask,
  StopCircle,
  SpeakerHigh,
  X,
} from "phosphor-react-native";
import { CameraView } from "expo-camera";

import { theme } from "../../core/theme";
import { HapticFeedback } from "../../core/haptics";
import { speechService } from "../../core/speechService";
import { SubjectItem, SUBJECT_ITEMS } from "../../domain/entities/Gamification";
import { RichMathText } from './RichMathText';
import {
  SocraticStep,
  DEMO_SOCRATIC_SESSION,
  formatEducationalMathText,
  separateProblemContent,
} from "../../domain/entities/SocraticDialogue";
import { useCameraPermission } from "../hooks/useCameraPermission";
import { AiMascotAvatar } from "./AiMascotAvatar";
import { BentoSpringCard } from "./BentoSpringCard";
import { CelebrationConfetti } from "./CelebrationConfetti";
import { DuolingoCelebrationBanner } from "./DuolingoCelebrationBanner";
import { SocraticGuidanceCard } from "./SocraticGuidanceCard";
import { tutorApiClient } from "../../core/api/TutorApiClient";
import { ProblemBlueprint, DynamicSocraticStep } from "../../domain/entities/SocraticState";
import { SocraticInteractionView } from "./SocraticInteractionView";

// ─── Prop Types ───────────────────────────────────────────────

export interface SocraticScannerScreenProps {
  onBack: () => void;
  activeSubject?: SubjectItem;
  currentStep?: SocraticStep | null;
  isFinished?: boolean;
  stepXp?: number;
  cameraRef?: React.RefObject<CameraView | null>;
  torchOn?: boolean;
  onToggleTorch?: () => void;
  onSelectOption?: (optionIndex: number) => void;
  onClaimVictory?: () => void;
  onSnapPhoto?: () => void;
  isAnalyzing?: boolean;
  analysisError?: string | null;
  analysisErrorType?: string | null;
  equation?: string;
  questionText?: string;
  problemTitle?: string;
}

// ─── Sub-components ───────────────────────────────────────────

/** Reanimated pulsing green dot for AI Live status */
const PulsingDot: React.FC = () => {
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.6, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [pulseScale, pulseOpacity]);

  const animatedGlow = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  return (
    <View style={pulsingDotStyles.container}>
      <Animated.View style={[pulsingDotStyles.glow, animatedGlow]} />
      <View style={pulsingDotStyles.core} />
    </View>
  );
};

const pulsingDotStyles = StyleSheet.create({
  container: {
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  glow: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "rgba(88, 204, 2, 0.4)",
  },
  core: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#58CC02",
  },
});

/** Animated sound wave bars (5 bars for AI voice visualization) */
const SoundWaveBars: React.FC<{ isActive?: boolean }> = ({
  isActive = false,
}) => {
  const bar1 = useSharedValue(0.4);
  const bar2 = useSharedValue(0.7);
  const bar3 = useSharedValue(1);
  const bar4 = useSharedValue(0.6);
  const bar5 = useSharedValue(0.3);

  useEffect(() => {
    const animateBar = (
      sv: SharedValue<number>,
      min: number,
      max: number,
      dur: number,
    ) => {
      sv.value = withRepeat(
        withSequence(
          withTiming(max, { duration: dur, easing: Easing.inOut(Easing.ease) }),
          withTiming(min, { duration: dur, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      );
    };
    if (isActive) {
      animateBar(bar1, 0.4, 1.0, 200);
      animateBar(bar2, 0.5, 1.0, 180);
      animateBar(bar3, 0.6, 1.0, 220);
      animateBar(bar4, 0.4, 0.95, 190);
      animateBar(bar5, 0.3, 0.85, 210);
    } else {
      animateBar(bar1, 0.3, 0.6, 420);
      animateBar(bar2, 0.35, 0.75, 380);
      animateBar(bar3, 0.4, 0.85, 450);
      animateBar(bar4, 0.3, 0.65, 400);
      animateBar(bar5, 0.25, 0.55, 430);
    }
  }, [bar1, bar2, bar3, bar4, bar5, isActive]);

  const makeBarStyle = (sv: SharedValue<number>) =>
    useAnimatedStyle(() => ({
      transform: [{ scaleY: sv.value }],
    }));

  const s1 = makeBarStyle(bar1);
  const s2 = makeBarStyle(bar2);
  const s3 = makeBarStyle(bar3);
  const s4 = makeBarStyle(bar4);
  const s5 = makeBarStyle(bar5);

  return (
    <View style={waveStyles.container}>
      {[s1, s2, s3, s4, s5].map((animStyle, idx) => (
        <Animated.View key={idx} style={[waveStyles.bar, animStyle]} />
      ))}
    </View>
  );
};

const waveStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2.5,
    height: 18,
    backgroundColor: theme.colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    borderRadius: theme.radii.pill,
  },
  bar: {
    width: 3,
    height: 16,
    borderRadius: 1.5,
    backgroundColor: theme.colors.duoGreen,
  },
});

/** Duolingo 3D tactile interactive action block (NO A/B/C lettering) */
interface SocraticActionBlockProps {
  title: string;
  subtitle?: string;
  isSelected: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  isDisabled?: boolean;
  onPress: () => void;
}

const SocraticActionBlock: React.FC<SocraticActionBlockProps> = ({
  title,
  subtitle,
  isSelected,
  isCorrect,
  isWrong,
  isDisabled,
  onPress,
}) => {
  const cardScale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedCard = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }, { translateY: translateY.value }],
    opacity: isDisabled ? 0.55 : 1,
  }));

  const handlePressIn = () => {
    if (isDisabled) return;
    HapticFeedback.light();
    cardScale.value = withSpring(0.98, { damping: 16, stiffness: 350 });
    translateY.value = withSpring(3, { damping: 16, stiffness: 350 });
  };

  const handlePressOut = () => {
    if (isDisabled) return;
    cardScale.value = withSpring(1, { damping: 14, stiffness: 260 });
    translateY.value = withSpring(0, { damping: 14, stiffness: 260 });
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={isDisabled ? undefined : onPress}
      accessibilityRole="button"
      accessibilityLabel={`Tanlov: ${title}`}
      disabled={isDisabled}
    >
      <Animated.View
        style={[
          choiceStyles.card,
          isCorrect
            ? choiceStyles.cardCorrect
            : isSelected
              ? choiceStyles.cardSelected
              : isWrong
                ? choiceStyles.cardWrong
                : null,
          animatedCard,
        ]}
      >
        {/* Status Indicator Icon: Dot / Check / X */}
        <View
          style={[
            choiceStyles.dotIndicator,
            isCorrect
              ? choiceStyles.dotIndicatorCorrect
              : isSelected
                ? choiceStyles.dotIndicatorSelected
                : isWrong
                  ? choiceStyles.dotIndicatorWrong
                  : null,
          ]}
        >
          {isCorrect ? (
            <CheckCircle size={18} color="#FFFFFF" weight="fill" />
          ) : isSelected ? (
            <CheckCircle size={18} color="#FFFFFF" weight="fill" />
          ) : isWrong ? (
            <XCircle size={18} color="#FFFFFF" weight="fill" />
          ) : (
            <View style={choiceStyles.innerDot} />
          )}
        </View>

        {/* Content texts */}
        <View style={choiceStyles.contentCol}>
          <RichMathText
            style={[
              choiceStyles.titleText,
              isSelected && choiceStyles.titleTextSelected,
              isCorrect && choiceStyles.titleTextCorrect,
              isWrong && choiceStyles.titleTextWrong,
            ]}
          >
            {title}
          </RichMathText>
          {subtitle ? (
            <RichMathText
              style={[
                choiceStyles.subtitleText,
                isCorrect && choiceStyles.subtitleTextCorrect,
                isSelected && !isCorrect && choiceStyles.subtitleTextSelected,
                isWrong && choiceStyles.subtitleTextWrong,
              ]}
            >
              {subtitle}
            </RichMathText>
          ) : null}
        </View>
      </Animated.View>
    </Pressable>
  );
};

const choiceStyles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: "#E5E7EB",
    borderBottomColor: "#D1D5DB",
    gap: 12,
  },
  cardSelected: {
    backgroundColor: "#F0F9FF",
    borderColor: "#38BDF8",
    borderBottomColor: "#0284C7",
  },
  cardCorrect: {
    backgroundColor: "#F0FDF4",
    borderColor: "#4ADE80",
    borderBottomColor: "#16A34A",
  },
  cardWrong: {
    backgroundColor: "#FEF2F2",
    borderColor: "#F87171",
    borderBottomColor: "#DC2626",
  },
  dotIndicator: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
  },
  dotIndicatorSelected: {
    backgroundColor: "#0284C7",
    borderColor: "#0369A1",
  },
  dotIndicatorCorrect: {
    backgroundColor: "#16A34A",
    borderColor: "#15803D",
  },
  dotIndicatorWrong: {
    backgroundColor: "#DC2626",
    borderColor: "#B91C1C",
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
  },
  contentCol: {
    flex: 1,
    gap: 2,
  },
  titleText: {
    fontSize: 15.5,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: -0.2,
    lineHeight: 21,
  },
  titleTextSelected: {
    color: "#0369A1",
  },
  titleTextCorrect: {
    color: "#15803D",
  },
  titleTextWrong: {
    color: "#B91C1C",
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    lineHeight: 16,
  },
  subtitleTextSelected: {
    color: "#0369A1",
  },
  subtitleTextCorrect: {
    color: "#15803D",
  },
  subtitleTextWrong: {
    color: "#B91C1C",
  },
});

// ─── Camera Permission Screen State ───────────────────────────

interface CameraPermissionScreenProps {
  onRequest: () => void;
  errorMessage: string | null;
  onBack: () => void;
  activeSubject: SubjectItem;
}

const CameraPermissionScreen: React.FC<CameraPermissionScreenProps> = ({
  onRequest,
  errorMessage,
  onBack,
}) => (
  <View style={permStyles.root}>
    <StatusBar barStyle="light-content" />
    <SafeAreaView edges={["top", "bottom"]} style={permStyles.safeArea}>
      <View style={permStyles.topBar}>
        <Pressable style={permStyles.circularBtn} onPress={onBack} hitSlop={10}>
          <CaretLeft size={20} color="#FFFFFF" weight="bold" />
        </Pressable>
      </View>

      <View style={permStyles.centerCardWrapper}>
        <View style={permStyles.whiteCard}>
          <View style={permStyles.cameraCircle}>
            <Camera size={44} color={theme.colors.streakOrange} weight="bold" />
          </View>
          <Text style={permStyles.cardTitle}>Kameraga ruxsat kerak</Text>
          <Text style={permStyles.cardSubtitle}>
            Daftar yoki kitobdagi misollarni skanerlash va Sokratik usulda o'rganish uchun kameraga ruxsat bering.
          </Text>

          {errorMessage ? (
            <Text style={permStyles.errorNotice}>{errorMessage}</Text>
          ) : null}

          <BentoSpringCard
            style={permStyles.enableButton}
            onPress={() => {
              HapticFeedback.medium();
              onRequest();
            }}
          >
            <Text style={permStyles.enableButtonText}>Kamerani yoqish</Text>
          </BentoSpringCard>
        </View>
      </View>
    </SafeAreaView>
  </View>
);

const permStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000000" },
  safeArea: { flex: 1 },
  topBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "flex-start",
  },
  circularBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    justifyContent: "center",
    alignItems: "center",
  },
  centerCardWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  whiteCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 36,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  cameraCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF7ED",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1B1931",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: -0.4,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 26,
  },
  errorNotice: {
    fontSize: 12,
    color: "#EF4444",
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "600",
  },
  enableButton: {
    width: "100%",
    backgroundColor: "#FF9600",
    borderRadius: 20,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderColor: "#CC7800",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  enableButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
});

// ─── Equation & LaTeX Formatter ──────────────────────────────

/** Formats raw LaTeX equations into clean, readable mobile text and limits length safely */
const formatEquationDisplay = (raw: string): string => {
  if (!raw) return "";
  let formatted = raw.trim();

  // 1. Convert LaTeX fractions: \frac{a}{b} -> (a)/(b)
  formatted = formatted.replace(
    /\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g,
    "($1)/($2)"
  );
  formatted = formatted.replace(
    /\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g,
    "($1)/($2)"
  );

  // 2. Convert common LaTeX math symbols into crisp Unicode
  formatted = formatted.replace(/\\cdot/g, "·");
  formatted = formatted.replace(/\\times/g, "×");
  formatted = formatted.replace(/\\div/g, "÷");
  formatted = formatted.replace(/\\sqrt\s*\{([^{}]+)\}/g, "√($1)");
  formatted = formatted.replace(/\\pm/g, "±");
  formatted = formatted.replace(/\\le/g, "≤");
  formatted = formatted.replace(/\\ge/g, "≥");
  formatted = formatted.replace(/\\neq/g, "≠");
  formatted = formatted.replace(/\\approx/g, "≈");
  formatted = formatted.replace(/\\pi/g, "π");
  formatted = formatted.replace(/\\infty/g, "∞");

  // 3. Remove remaining LaTeX command backslashes, math environments & braces
  formatted = formatted.replace(/\\text\s*\{([^{}]+)\}/g, "$1");
  formatted = formatted.replace(/\\mathrm\s*\{([^{}]+)\}/g, "$1");
  formatted = formatted.replace(/\\[a-zA-Z]+/g, "");
  formatted = formatted.replace(/[{}]/g, "");
  formatted = formatted.replace(/\s+/g, " ").trim();

  // 4. Pedagogical school math normalization (dot thousand separator, school division : )
  formatted = formatEducationalMathText(formatted);

  // 5. Safe limit to preserve UI layout
  if (formatted.length > 130) {
    return formatted.slice(0, 127) + "...";
  }
  return formatted;
};

// ─── Main Socratic Scanner Screen ─────────────────────────────

export const SocraticScannerScreen: React.FC<SocraticScannerScreenProps> = ({
  onBack,
  activeSubject = SUBJECT_ITEMS[0],
  currentStep: propCurrentStep,
  isFinished = false,
  stepXp = 25,
  cameraRef,
  torchOn = false,
  onToggleTorch = () => {},
  onSelectOption = () => {},
  onClaimVictory = () => {},
  onSnapPhoto,
  isAnalyzing = false,
  analysisError,
  analysisErrorType,
  equation = "5x - 20 = 2x + 12",
  questionText,
  problemTitle,
}) => {
  const insets = useSafeAreaInsets();
  const { hasPermission, isLoading, errorMessage, requestCameraPermission } =
    useCameraPermission();

  // Fallback to demo step 1 if no step provided
  const activeStep: SocraticStep =
    propCurrentStep || DEMO_SOCRATIC_SESSION.steps[0];

  // Intelligently separate question instruction and mathematical expression
  const { instruction: separatedInstruction, equation: separatedEq } =
    separateProblemContent(equation, questionText);

  const displayInstruction = questionText || separatedInstruction;
  const cleanedEquation = formatEquationDisplay(separatedEq || equation || "");

  const [viewMode, setViewMode] = useState<"scan" | "chat">("scan");
  
  // ── Socratic Dynamic API State ──
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [blueprint, setBlueprint] = useState<ProblemBlueprint | null>(null);
  const [dynamicStep, setDynamicStep] = useState<DynamicSocraticStep | null>(null);
  const [isSubmittingAPI, setIsSubmittingAPI] = useState<boolean>(false);
  const [sessionFinished, setSessionFinished] = useState<boolean>(false);
  const [masteryScore, setMasteryScore] = useState<number>(0);

  const [isSimulatingScan, setIsSimulatingScan] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(-1);
  const [confirmedCorrect, setConfirmedCorrect] = useState<boolean>(false);
  const [wrongIndex, setWrongIndex] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [showGuidanceHint, setShowGuidanceHint] = useState<boolean>(false);

  // 30-second Productive Struggle Timer
  const [secondsLeft, setSecondsLeft] = useState(30);
  const timerProgress = useSharedValue(1);

  // 🔊 Savolni ovozli o'qish (TTS - Text to Speech)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const handleSpeakQuestion = useCallback(async () => {
    try {
      const isCurrentlySpeaking = await speechService.isSpeaking();
      if (isCurrentlySpeaking || isSpeaking) {
        speechService.stop();
        setIsSpeaking(false);
        return;
      }

      const textParts: string[] = [];
      const title = blueprint?.learningObjective || activeStep.stepTitle;
      const explanation = dynamicStep?.content.tutorExplanation || activeStep.tutorExplanation || displayInstruction;
      const question = dynamicStep?.content.tutorQuestion || activeStep.tutorQuestion;

      if (title) textParts.push(title);
      if (explanation) textParts.push(explanation);
      if (cleanedEquation) textParts.push(cleanedEquation);
      if (question) textParts.push(question);

      const fullTextToSpeak = textParts.join(". ");
      HapticFeedback.light();
      setIsSpeaking(true);

      speechService.speak(fullTextToSpeak, {
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch (err) {
      console.warn("[SocraticScannerScreen] Speech error:", err);
      setIsSpeaking(false);
    }
  }, [blueprint, dynamicStep, activeStep, displayInstruction, cleanedEquation, isSpeaking]);

  // In-flight guard to prevent duplicate step advancement
  const isAdvancingRef = useRef<boolean>(false);

  // Reset state, speech, and timer when active step changes
  useEffect(() => {
    isAdvancingRef.current = false;
    setSelectedOptionIndex(-1);
    setConfirmedCorrect(false);
    setWrongIndex(null);
    setShowCelebration(false);
    setShowConfetti(false);
    setShowGuidanceHint(false);

    // Stop ongoing speech
    speechService.stop();
    setIsSpeaking(false);

    // Reset timer
    setSecondsLeft(30);
    timerProgress.value = 1;
    timerProgress.value = withTiming(0, { duration: 30000, easing: Easing.linear });

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      speechService.stop();
    };
  }, [activeStep.id, activeStep.stepNumber, timerProgress]);

  // Reanimated shake for wrong answers
  const shakeX = useSharedValue(0);
  const animatedShake = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const animatedTimerFill = useAnimatedStyle(() => ({
    width: `${timerProgress.value * 100}%`,
  }));

  // Clean hint without redundant "Eslatma: " prefix
  const cleanHint = (activeStep.hintText || "")
    .replace(/^Eslatma:\s*/i, "")
    .trim();

  // Handle celebration continue and step advancement safely
  const handleCelebrationContinue = useCallback(() => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;

    setShowCelebration(false);
    setShowConfetti(false);
    setConfirmedCorrect(false);

    const chosenIndex =
      selectedOptionIndex >= 0
        ? selectedOptionIndex
        : activeStep.correctOptionIndex;
    onSelectOption(chosenIndex);
  }, [activeStep.correctOptionIndex, onSelectOption, selectedOptionIndex]);

  // Auto-advance fallback timer after celebration triggers
  useEffect(() => {
    if (showCelebration) {
      const autoTimer = setTimeout(() => {
        handleCelebrationContinue();
      }, 2500);
      return () => clearTimeout(autoTimer);
    }
  }, [showCelebration, handleCelebrationContinue]);

  // Handle option selection
  const handleOptionPress = useCallback(
    (index: number) => {
      if (showCelebration || isAdvancingRef.current) return;

      setSelectedOptionIndex(index);

      if (index === activeStep.correctOptionIndex) {
        setConfirmedCorrect(true);
        setWrongIndex(null);
        setShowGuidanceHint(false);
        HapticFeedback.success();
        setShowConfetti(true);
        setShowCelebration(true);
      } else {
        setConfirmedCorrect(false);
        setWrongIndex(index);
        setShowGuidanceHint(true);
        HapticFeedback.error();
        shakeX.value = withSequence(
          withSpring(-8, { damping: 5, stiffness: 400 }),
          withSpring(8, { damping: 5, stiffness: 400 }),
          withSpring(0, { damping: 6, stiffness: 300 }),
        );
      }
    },
    [activeStep, shakeX, showCelebration],
  );

  const handleLocalSnapPhoto = async () => {
    if (isSubmittingAPI) return;
    HapticFeedback.success();
    setIsSimulatingScan(true);
    setIsSubmittingAPI(true);
    try {
      let base64Image = 'MOCK_IMAGE_SCAN';
      if (cameraRef?.current) {
        try {
          const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.5 });
          if (photo?.base64) {
            base64Image = photo.base64;
          }
        } catch (camErr) {
          console.warn('[SocraticScannerScreen] Camera takePicture error:', camErr);
        }
      }

      // Call POST /api/tutor/extract
      const extractResult = await tutorApiClient.extractProblem(base64Image, activeSubject.id);
      setSessionId(extractResult.sessionId);
      setBlueprint(extractResult.blueprint);
      setDynamicStep(extractResult.initialStep);
      setSessionFinished(false);

      if (onSnapPhoto) {
        await onSnapPhoto();
      }
    } catch (err) {
      console.warn('[SocraticScannerScreen] Snap photo error:', err);
    } finally {
      setIsSimulatingScan(false);
      setIsSubmittingAPI(false);
      setViewMode('chat');
    }
  };

  const handleDynamicSubmit = async (response: string) => {
    if (isSubmittingAPI || sessionFinished) return;
    setIsSubmittingAPI(true);
    speechService.stop();
    setIsSpeaking(false);

    try {
      const activeSessionId = sessionId || `sess_${Date.now()}`;
      const currentStepId = dynamicStep?.id || activeStep.id;

      // Call POST /api/tutor/evaluate
      const evalResult = await tutorApiClient.evaluateResponse(
        activeSessionId,
        currentStepId,
        response
      );

      const nextStep = evalResult.step;
      setDynamicStep(nextStep);
      if (evalResult.updatedMastery?.masteryScore) {
        setMasteryScore(evalResult.updatedMastery.masteryScore);
      }

      // Handle pedagogical action triggers:
      if (nextStep.pedagogicalAction === 'GIVE_HINT') {
        HapticFeedback.error();
        shakeX.value = withSequence(
          withSpring(-8, { damping: 5, stiffness: 400 }),
          withSpring(8, { damping: 5, stiffness: 400 }),
          withSpring(0, { damping: 6, stiffness: 300 }),
        );
      } else if (nextStep.pedagogicalAction === 'MASTERY_ACHIEVED') {
        HapticFeedback.success();
        setShowConfetti(true);
        setShowCelebration(true);
        setSessionFinished(true);
      } else if (nextStep.pedagogicalAction === 'TRANSFER_CHECK') {
        HapticFeedback.medium();
        setShowConfetti(true);
      } else {
        HapticFeedback.success();
      }
    } catch (err) {
      console.warn('[SocraticScannerScreen] Evaluate error:', err);
    } finally {
      setIsSubmittingAPI(false);
    }
  };

// Handle main CTA button press (contextual action)
  const handleActionButtonPress = async () => {
    HapticFeedback.medium();
    if (isFinished) {
      onClaimVictory();
    } else if (showCelebration) {
      handleCelebrationContinue();
    } else if (selectedOptionIndex >= 0 && !confirmedCorrect) {
      handleOptionPress(selectedOptionIndex);
    }
  };

  // Camera permission gate
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color={theme.colors.duoGreen} />
        <Text style={styles.loadingText}>Kamera yuklanmoqda...</Text>
      </View>
    );
  }

  if (hasPermission === false || hasPermission === null) {
    return (
      <CameraPermissionScreen
        onRequest={requestCameraPermission}
        errorMessage={errorMessage}
        onBack={onBack}
        activeSubject={activeSubject}
      />
    );
  }

  if (analysisError) {
    return (
      <View style={permStyles.root}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView edges={["top", "bottom"]} style={permStyles.safeArea}>
          <View style={permStyles.topBar}>
            <Pressable style={permStyles.circularBtn} onPress={onBack} hitSlop={10}>
              <CaretLeft size={20} color="#FFFFFF" weight="bold" />
            </Pressable>
          </View>
          <View style={permStyles.centerCardWrapper}>
            <View style={permStyles.whiteCard}>
              <View style={[permStyles.cameraCircle, { backgroundColor: "#FEE2E2" }]}>
                {analysisErrorType === 'network' ? (
                  <Lightning size={44} color="#EF4444" weight="bold" />
                ) : analysisErrorType === 'blurry' ? (
                  <Scan size={44} color="#EF4444" weight="bold" />
                ) : (
                  <XCircle size={44} color="#EF4444" weight="bold" />
                )}
              </View>
              <Text style={permStyles.cardTitle}>Uyog'ey, Xatolik!</Text>
              <Text style={permStyles.cardSubtitle}>{analysisError}</Text>
              <BentoSpringCard style={permStyles.enableButton} onPress={onBack}>
                <Text style={permStyles.enableButtonText}>Orqaga qaytish</Text>
              </BentoSpringCard>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (viewMode === "scan") {
    return (
      <View style={scanStyles.root}>
        <StatusBar barStyle="light-content" />
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="back"
          enableTorch={torchOn}
        />

        {/* Flash Overlay when taking photo */}
        {isSimulatingScan ? <View style={scanStyles.flashOverlay} /> : null}

        {/* AI Analysis HUD Overlay */}
        {isSimulatingScan || isAnalyzing ? (
          <View style={scanStyles.analyzingOverlay}>
            <ActivityIndicator size="large" color="#58CC02" />
            <Text style={scanStyles.analyzingText}>
              Socrates Jr. masalani tahlil qilmoqda...
            </Text>
          </View>
        ) : null}

        <SafeAreaView edges={["top", "bottom"]} style={scanStyles.safeArea}>
          {/* Top Bar */}
          <View style={scanStyles.topBar}>
            <Pressable style={scanStyles.iconBtn} onPress={onBack}>
              <CaretLeft size={24} color="#FFF" weight="bold" />
            </Pressable>
            <Pressable style={scanStyles.iconBtn} onPress={onToggleTorch}>
              <Flashlight
                size={24}
                color={torchOn ? "#FFD60A" : "#FFF"}
                weight={torchOn ? "fill" : "bold"}
              />
            </Pressable>
          </View>

          {/* Reticle / Viewfinder */}
          <View style={scanStyles.reticleWrapper}>
            <View style={scanStyles.reticleBox}>
              <View style={[scanStyles.corner, scanStyles.tl]} />
              <View style={[scanStyles.corner, scanStyles.tr]} />
              <View style={[scanStyles.corner, scanStyles.bl]} />
              <View style={[scanStyles.corner, scanStyles.br]} />
            </View>
            <Text style={scanStyles.reticleHint}>
              Misolni ramka ichiga to'g'rilang
            </Text>
          </View>

          {/* Bottom Dock */}
          <View
            style={[
              scanStyles.bottomDock,
              { paddingBottom: Math.max(32, insets.bottom + 16) },
            ]}
          >
            <Pressable
              style={scanStyles.sideBtn}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Galereyadan tanlash"
            >
              <View style={scanStyles.sideBtnIconBox}>
                <NotePencil size={22} color="#FFF" />
              </View>
              <Text style={scanStyles.sideBtnLabel}>Galereya</Text>
            </Pressable>

            <Pressable
              style={scanStyles.shutterOuter}
              onPress={handleLocalSnapPhoto}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Rasmga olish"
            >
              <View style={scanStyles.shutterInner} />
            </Pressable>

            {/* Spacer for visual balance */}
            <View style={scanStyles.sideBtn} />
          </View>
        </SafeAreaView>
      </View>
    );
  }
  return (
    <View style={styles.screenRoot}>
      <StatusBar barStyle="dark-content" />

      {/* ═══════════════ 1. DUOLINGO MINIMALIST HEADER ═══════════════ */}
      <SafeAreaView edges={["top"]} style={styles.headerSafeArea}>
        <View style={styles.headerRow}>
          {/* Left: Close ✕ Button */}
          <Pressable
            style={styles.closeBtn}
            onPress={() => {
              HapticFeedback.light();
              onBack();
            }}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Darsdan chiqish"
          >
            <X size={24} color="#9CA3AF" weight="bold" />
          </Pressable>

          {/* Center: Duolingo Clean Progress Bar */}
          <View style={styles.duoProgressTrack}>
            <Animated.View
              style={[
                styles.duoProgressFill,
                {
                  width: `${Math.min(
                    100,
                    Math.max(
                      15,
                      ((activeStep.stepNumber || 1) / (activeStep.totalSteps || 3)) * 100
                    )
                  )}%`,
                },
              ]}
            />
          </View>
        </View>
      </SafeAreaView>

      {/* ═══════════════ 2. OQ DAFTAR CONTENT BODY ═══════════════ */}
      <ScrollView
        style={styles.scrollBody}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(100, insets.bottom + 90) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {isFinished ? (
          /* Clean Victory Screen */
          <View style={styles.victoryCard}>
            <View style={styles.victoryMascotWrap}>
              <AiMascotAvatar size={80} mood="celebrating" />
            </View>
            <Text style={styles.victoryTitle}>
              Dars muvaffaqiyatli yakunlandi! 🎉
            </Text>
            <Text style={styles.victorySubtitle}>
              Siz barcha 3 ta Sokratik bosqichni repititor bilan mustaqil bajardingiz.
            </Text>
            <View style={styles.victoryXpBadge}>
              <Sparkle size={16} color="#D97706" weight="fill" />
              <Text style={styles.victoryXpBadgeText}>+{stepXp * 2} XP QO'SHILDI</Text>
              <Sparkle size={16} color="#D97706" weight="fill" />
            </View>
          </View>
        ) : (
          <>
            {/* Dars Qadami Sarlavhasi (Duolingo style bold title) */}
            <Text style={styles.lessonTitle}>
              {blueprint?.learningObjective || activeStep.stepTitle || `${activeStep.stepNumber || 1}-qadam tahlili`}
            </Text>

            {/* Repetitor va Nutq Pufagi (Duolingo Mascot + Oq Daftar Bubble) */}
            <View style={styles.tutorRow}>
              <View style={styles.mascotWrapper}>
                <AiMascotAvatar
                  size={52}
                  mood={
                    dynamicStep?.pedagogicalAction === 'MASTERY_ACHIEVED' || showCelebration
                      ? "celebrating"
                      : dynamicStep?.pedagogicalAction === 'GIVE_HINT' || wrongIndex !== null
                      ? "thinking"
                      : isSpeaking
                      ? "listening"
                      : "idle"
                  }
                />
              </View>

              {/* Speech Bubble / Oq Daftar Tahlili */}
              <View style={styles.speechBubble}>
                {/* 🔊 Ovozli tinglash tugmachasi */}
                <Pressable
                  style={[styles.ttsSpeakerBtn, isSpeaking && styles.ttsSpeakerBtnActive]}
                  onPress={handleSpeakQuestion}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel="Ovozda tinglash"
                >
                  <SpeakerHigh
                    size={22}
                    color={isSpeaking ? "#FFFFFF" : "#0284C7"}
                    weight={isSpeaking ? "fill" : "bold"}
                  />
                </Pressable>

                {/* AI Repetitorning chuqur tahlili va tushuntirishi */}
                <RichMathText style={styles.tutorExplanationText}>
                  {dynamicStep?.content.tutorExplanation || activeStep.tutorExplanation || activeStep.explanationSnippet || "Qoidani eslaymiz."}
                </RichMathText>

                {/* Masala ifodasi (katta matematik matn) */}
                {cleanedEquation ? (
                  <View style={styles.equationCard}>
                    <RichMathText style={styles.equationCardText}>{cleanedEquation}</RichMathText>
                  </View>
                ) : null}

                {/* Sokratik savol */}
                <RichMathText style={styles.socraticPromptText}>
                  {(dynamicStep?.content.tutorQuestion || activeStep.tutorQuestion || "").replace(/^["']|["']$/g, "").trim()}
                </RichMathText>
              </View>
            </View>

            {/* Xato urinishda sokratik muloyim ko'rsatma */}
            {(wrongIndex !== null || dynamicStep?.pedagogicalAction === 'GIVE_HINT') ? (
              <View style={styles.gentleHintBox}>
                <Text style={styles.gentleHintTitle}>💡 Keling, yana bir bor o'ylab ko'ramiz:</Text>
                <Text style={styles.gentleHintText}>
                  {dynamicStep?.uiParams.hintText || cleanHint || activeStep.hintText}
                </Text>
              </View>
            ) : null}

            {/* Dynamic Socratic Interaction View or Fallback Choices List */}
            {dynamicStep ? (
              <Animated.View style={animatedShake}>
                <SocraticInteractionView
                  format={dynamicStep.uiParams.interactionFormat}
                  quickOptions={dynamicStep.uiParams.quickOptions}
                  hintText={dynamicStep.uiParams.hintText}
                  isSubmitting={isSubmittingAPI}
                  onSubmit={handleDynamicSubmit}
                />
              </Animated.View>
            ) : (
              <Animated.View style={[styles.choicesList, animatedShake]}>
                {activeStep.quickOptions.map((optionText, idx) => {
                  const isSelected = selectedOptionIndex === idx;
                  const isWrong = wrongIndex === idx;
                  const isCardCorrect = confirmedCorrect && isSelected;
                  const subtitle =
                    activeStep.optionSubtitles && activeStep.optionSubtitles[idx]
                      ? activeStep.optionSubtitles[idx]
                      : undefined;

                  return (
                    <SocraticActionBlock
                      key={`${activeStep.id}_${idx}`}
                      title={optionText}
                      subtitle={subtitle}
                      isSelected={isSelected}
                      isCorrect={isCardCorrect}
                      isWrong={isWrong}
                      onPress={() => handleOptionPress(idx)}
                    />
                  );
                })}
              </Animated.View>
            )}
          </>
        )}
      </ScrollView>

      {/* ═══════════════ 3. FIXED BOTTOM "TEKSHIRISH" DOCK ═══════════════ */}
      <SafeAreaView edges={["bottom"]} style={styles.bottomDockSafeArea}>
        <View style={styles.bottomDockInner}>
          <Pressable
            style={[
              styles.primaryDuoBtn,
              isFinished || sessionFinished
                ? styles.primaryDuoBtnVictory
                : dynamicStep
                ? styles.primaryDuoBtnActive
                : selectedOptionIndex >= 0
                ? styles.primaryDuoBtnActive
                : styles.primaryDuoBtnDisabled,
            ]}
            onPress={() => {
              if (isFinished || sessionFinished) {
                onClaimVictory();
              } else if (showCelebration) {
                handleCelebrationContinue();
              } else if (selectedOptionIndex >= 0 && !confirmedCorrect) {
                handleOptionPress(selectedOptionIndex);
              }
            }}
            disabled={!dynamicStep && selectedOptionIndex < 0 && !isFinished && !sessionFinished}
          >
            <Text
              style={[
                styles.primaryDuoBtnText,
                selectedOptionIndex >= 0 || isFinished || sessionFinished || dynamicStep
                  ? styles.primaryDuoBtnTextActive
                  : styles.primaryDuoBtnTextDisabled,
              ]}
            >
              {isFinished || sessionFinished
                ? "DARS YAKUNLANDI 🎉"
                : dynamicStep
                ? (dynamicStep.uiParams.interactionFormat === 'OPEN_QUESTION' ? "JAVOBINGIZNI KIRITING" : "DAVOM ETISH")
                : selectedOptionIndex >= 0
                ? "TEKSHIRISH"
                : "JAVOBNI TANLANG"}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>

      {/* 4. Duolingo Celebration Bottom Banner */}
      <DuolingoCelebrationBanner
        visible={showCelebration}
        xpEarned={stepXp}
        headline="Ajoyib!"
        onContinue={handleCelebrationContinue}
      />

      {/* GPU Confetti Burst */}
      <CelebrationConfetti
        active={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />
    </View>
  );
};

// ─── Styles: Duolingo Oq Daftar Minimalist Design ─────────────

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
  },

  // ── 1. Minimalist Duolingo Header ──
  headerSafeArea: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    zIndex: 20,
  },
  headerRow: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  closeBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  duoProgressTrack: {
    flex: 1,
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    overflow: "hidden",
  },
  duoProgressFill: {
    height: "100%",
    backgroundColor: "#58CC02",
    borderRadius: 6,
  },

  // ── 2. Scrollable Body (Oq Daftar) ──
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 18,
  },
  lessonTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1F2937",
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  tutorRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  mascotWrapper: {
    paddingTop: 4,
  },
  speechBubble: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderBottomWidth: 4,
    borderBottomColor: "#D1D5DB",
    padding: 16,
    gap: 10,
  },
  ttsSpeakerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0F9FF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#BAE6FD",
    alignSelf: "flex-start",
  },
  ttsSpeakerBtnActive: {
    backgroundColor: "#0284C7",
    borderColor: "#0369A1",
  },
  tutorExplanationText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#374151",
    fontWeight: "500",
  },
  equationCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginVertical: 2,
  },
  equationCardText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  socraticPromptText: {
    fontSize: 15.5,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 22,
  },
  transcriptionPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    gap: 6,
    alignSelf: "flex-start",
  },
  transcriptionText: {
    fontSize: 13,
    color: "#15803D",
    fontWeight: "600",
  },
  gentleHintBox: {
    backgroundColor: "#FFFBEB",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#FDE68A",
    gap: 4,
  },
  gentleHintTitle: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#B45309",
  },
  gentleHintText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#92400E",
    fontWeight: "500",
  },
  choicesList: {
    gap: 12,
    marginTop: 6,
  },

  // ── 3. Fixed Bottom Action Dock ──
  bottomDockSafeArea: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  bottomDockInner: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  primaryDuoBtn: {
    height: 50,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderBottomWidth: 4,
  },
  primaryDuoBtnActive: {
    backgroundColor: "#58CC02",
    borderColor: "#46A302",
    borderBottomColor: "#2B6C00",
  },
  primaryDuoBtnDisabled: {
    backgroundColor: "#E5E7EB",
    borderColor: "#D1D5DB",
    borderBottomColor: "#9CA3AF",
  },
  primaryDuoBtnVictory: {
    backgroundColor: "#FF9600",
    borderColor: "#CC7800",
    borderBottomColor: "#995A00",
  },
  primaryDuoBtnText: {
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  primaryDuoBtnTextActive: {
    color: "#FFFFFF",
  },
  primaryDuoBtnTextDisabled: {
    color: "#9CA3AF",
  },

  // ── 4. Victory Presentation ──
  victoryCard: {
    alignItems: "center",
    paddingVertical: 36,
    paddingHorizontal: 20,
    gap: 14,
  },
  victoryMascotWrap: {
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  victoryTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
    letterSpacing: -0.3,
    textAlign: "center",
  },
  victorySubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  victoryXpBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "#FDE68A",
    gap: 6,
    marginTop: 8,
  },
  victoryXpBadgeText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#D97706",
  },
});

const scanStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  flashOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#FFF",
    zIndex: 100,
    opacity: 0.8,
  },
  safeArea: { flex: 1, justifyContent: "space-between" },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.16)",
    justifyContent: "center",
    alignItems: "center",
  },
  reticleWrapper: { flex: 1, justifyContent: "center", alignItems: "center" },
  reticleBox: {
    width: 280,
    height: 140,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    position: "relative",
  },
  corner: { position: "absolute", width: 20, height: 20, borderColor: "#FFF" },
  tl: { top: -2, left: -2, borderTopWidth: 3, borderLeftWidth: 3 },
  tr: { top: -2, right: -2, borderTopWidth: 3, borderRightWidth: 3 },
  bl: { bottom: -2, left: -2, borderBottomWidth: 3, borderLeftWidth: 3 },
  br: { bottom: -2, right: -2, borderBottomWidth: 3, borderRightWidth: 3 },
  reticleHint: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 16,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bottomDock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingBottom: 20,
  },
  sideBtn: { alignItems: "center", width: 60, gap: 6 },
  sideBtnIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  sideBtnLabel: { color: "#FFF", fontSize: 12, fontWeight: "600" },
  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  shutterInner: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    backgroundColor: "#FFF",
  },
  analyzingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 50,
    gap: 16,
    paddingHorizontal: 24,
  },
  analyzingText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.2,
  },
});
