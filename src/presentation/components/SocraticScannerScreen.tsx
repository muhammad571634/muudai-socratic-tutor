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
import { resolveScanErrorMessage } from "../../core/i18n";
import { useTranslation } from "react-i18next";
import { SubjectItem, SUBJECT_ITEMS } from "../../domain/entities/Gamification";
import { RichMathText } from './RichMathText';
import {
  formatEducationalMathText,
  separateProblemContent,
} from "../../domain/entities/SocraticDialogue";
import {
  HintRung,
  LessonStep,
  StepAttempt,
  StepBuilderStep,
  StepResult,
} from "../../domain/entities/SocraticLesson";
import { checkStep } from "../../domain/services/AnswerChecker";
import { useCameraPermission } from "../hooks/useCameraPermission";
import { AiMascotAvatar } from "./AiMascotAvatar";
import { BentoSpringCard } from "./BentoSpringCard";
import { CelebrationConfetti } from "./CelebrationConfetti";


import { tutorApiClient } from "../../core/api/TutorApiClient";

// ─── Prop Types ───────────────────────────────────────────────

export interface SocraticScannerScreenProps {
  onBack: () => void;
  activeSubject?: SubjectItem;
  currentStep?: LessonStep | null;
  isFinished?: boolean;
  stepXp?: number;
  cameraRef?: React.RefObject<CameraView | null>;
  torchOn?: boolean;
  onToggleTorch?: () => void;
  /**
   * Bola javob berdi.
   *
   * Baho SHU EKRANDA, qurilmada chiqariladi (`AnswerChecker`) — shuning uchun
   * rang va tebranish 100 ms ichida keladi (`docs/UI_ARCHITECTURE.md` §5.2).
   * `App.tsx` faqat XP, xatolar daftari va keyingi qadamni boshqaradi.
   */
  onAnswer?: (attempt: StepAttempt, result: StepResult) => void;
  onClaimVictory?: () => void;
  onSnapPhoto?: () => void;
  isAnalyzing?: boolean;
  analysisError?: string | null;
  analysisErrorType?: string | null;
  equation?: string;
  questionText?: string;
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

/**
 * Plitka taxtasi — qadam yig'ish formatining ishlaydigan asosi.
 *
 * ⚠️ 🎨 D1 (Gemini) shu komponentni QAYTA CHIZADI. Bu yerdagi ko'rinish
 * ataylab sodda: maqsad — shartnoma (`StepBuilderStep`) haqiqatan
 * ishlashini ko'rsatish, dizaynni belgilash emas. Barcha holatlar va
 * qoidalar: `docs/UI_ARCHITECTURE.md` §4.3.2 I.
 *
 * Qat'iy qoida (bu yerda ham amal qiladi): plitka qo'yilganda yashil/qizil
 * KO'RSATILMAYDI. Aks holda bola plitkalarni yashil chiqquncha surib chiqadi
 * va hech narsa o'rganmaydi. Tekshirish faqat pastdagi tugma bilan.
 */
const StepBuilderBoard: React.FC<{
  step: StepBuilderStep;
  placedTileIds: string[];
  onTilePress: (tileId: string) => void;
}> = ({ step, placedTileIds, onTilePress }) => {
  const slots = Array.from({ length: step.slotCount }, (_, index) => placedTileIds[index]);

  return (
    <View style={boardStyles.root}>
      <View style={boardStyles.slotRow}>
        {slots.map((tileId, index) => {
          const tile = tileId ? step.tiles.find((candidate) => candidate.id === tileId) : undefined;
          return tile ? (
            <Pressable
              key={`slot_${index}`}
              style={boardStyles.filledSlot}
              onPress={() => onTilePress(tile.id)}
              accessibilityRole="button"
              accessibilityLabel={tile.label}
            >
              <Text style={boardStyles.filledSlotText}>{tile.label}</Text>
            </Pressable>
          ) : (
            <View key={`slot_${index}`} style={boardStyles.emptySlot} />
          );
        })}
      </View>

      <View style={boardStyles.bankRow}>
        {step.tiles.map((tile) => {
          const isUsed = placedTileIds.includes(tile.id);
          return (
            <Pressable
              key={tile.id}
              style={[boardStyles.tile, isUsed && boardStyles.tileUsed]}
              onPress={() => !isUsed && onTilePress(tile.id)}
              disabled={isUsed}
              accessibilityRole="button"
              accessibilityLabel={tile.label}
              accessibilityState={{ disabled: isUsed }}
            >
              {/* Ishlatilgan plitka o'rnida kulrang soya qoladi — bola
                  qayerdan olganini eslab qoladi (Duolingo modeli). */}
              <Text style={[boardStyles.tileText, isUsed && boardStyles.tileTextUsed]}>
                {isUsed ? "" : tile.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const boardStyles = StyleSheet.create({
  root: { gap: 24, paddingVertical: 8 },
  slotRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    minHeight: 52,
    alignItems: "center",
  },
  emptySlot: {
    minWidth: 56,
    height: 44,
    borderRadius: theme.radii.badge,
    borderBottomWidth: 2,
    borderColor: theme.colors.borderLight,
  },
  filledSlot: {
    minWidth: 56,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: theme.radii.badge,
    borderWidth: 2,
    borderColor: theme.colors.mathBlue,
    backgroundColor: theme.colors.cardLight,
    alignItems: "center",
    justifyContent: "center",
  },
  filledSlotText: { fontSize: 17, fontWeight: "700", color: theme.colors.textDark },
  bankRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tile: {
    minWidth: 56,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: theme.radii.badge,
    borderWidth: 2,
    borderColor: theme.colors.borderLight,
    backgroundColor: theme.colors.cardLight,
    alignItems: "center",
    justifyContent: "center",
  },
  tileUsed: { backgroundColor: theme.colors.borderLight, borderColor: theme.colors.borderLight },
  tileText: { fontSize: 17, fontWeight: "700", color: theme.colors.textDark },
  tileTextUsed: { color: theme.colors.borderLight },
});

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

const bannerStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.duoGreen,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: theme.colors.duoGreen,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
  },
  content: {
    padding: 24,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headline: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  xpText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.duoGreen,
  },
});

const InlineCelebrationBanner: React.FC<{
  visible: boolean;
  xpEarned?: number;
  onContinue: () => void;
}> = ({ visible, xpEarned = 25, onContinue }) => {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(200);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 120,
        mass: 0.8,
      });
    } else {
      translateY.value = withTiming(200, { duration: 250, easing: Easing.in(Easing.ease) });
    }
  }, [visible, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible && translateY.value === 200) return null;

  return (
    <Animated.View style={[
      bannerStyles.container,
      { paddingBottom: Math.max(insets.bottom, 24) },
      animatedStyle
    ]}>
      <View style={bannerStyles.content}>
        <View style={bannerStyles.textRow}>
          <View style={bannerStyles.iconBox}>
            <CheckCircle weight="fill" color="#FFF" size={32} />
          </View>
          <View>
            <Text style={bannerStyles.headline}>Ajoyib!</Text>
            <Text style={bannerStyles.xpText}>+{xpEarned} XP</Text>
          </View>
        </View>
        <Pressable 
          style={({ pressed }) => [
            bannerStyles.button,
            pressed && bannerStyles.buttonPressed
          ]}
          onPress={onContinue}
        >
          <Text style={bannerStyles.buttonText}>Davom etish</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
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
  onAnswer = () => {},
  onClaimVictory = () => {},
  onSnapPhoto,
  isAnalyzing = false,
  analysisError,
  analysisErrorType,
  equation,
  questionText,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { hasPermission, isLoading, errorMessage, requestCameraPermission } =
    useCameraPermission();

  // Zaxira demo qadam YO'Q. Haqiqiy masala bo'lmasa `null` bo'lib qoladi va
  // pastdagi darvoza ekranni kamerada ushlab turadi — bola hech qachon
  // o'zi skanerlamagan masalani ko'rmaydi.
  const activeStep: LessonStep | null = propCurrentStep ?? null;

  // Intelligently separate question instruction and mathematical expression
  const { instruction: separatedInstruction, equation: separatedEq } =
    separateProblemContent(equation, questionText);

  const displayInstruction = questionText || separatedInstruction;
  const cleanedEquation = formatEquationDisplay(separatedEq || equation || "");
  
  // Har javobga server chaqiruvi YO'Q (T0.20). Plitka javobi qurilmada
  // `AnswerChecker` orqali ~1 ms da baholanadi — `docs/UI_ARCHITECTURE.md`
  // §4.3.2 D. Bu yerdagi holat faqat suratga olish jarayoni uchun.
  const [isBusy, setIsBusy] = useState<boolean>(false);
  // Xatolar tutorApiClient dan keladi (ScanError). Jimgina yutilmasligi shart —
  // aks holda bola tugmani bosadi va hech narsa bo'lmaydi. AGENTS.md 2-taqiq.
  const [dynamicError, setDynamicError] = useState<string | null>(null);
  const [dynamicErrorType, setDynamicErrorType] = useState<string | null>(null);

  const reportDynamicError = useCallback((err: unknown, context: string) => {
    console.warn(`[SocraticScannerScreen] ${context}:`, err);
    setDynamicError(resolveScanErrorMessage(err));
    setDynamicErrorType(
      err && typeof err === 'object' && 'name' in err && (err as Error).name === 'ScanError'
        ? (err as { type?: string }).type ?? 'unknown'
        : 'unknown'
    );
    HapticFeedback.error();
  }, []);

  const [isSimulatingScan, setIsSimulatingScan] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(-1);
  /** Plitka formatida slotlarga qo'yilgan plitkalar, tartib bilan. */
  const [placedTileIds, setPlacedTileIds] = useState<string[]>([]);
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
      if (displayInstruction) textParts.push(displayInstruction);
      if (cleanedEquation) textParts.push(cleanedEquation);
      if (activeStep?.question) textParts.push(activeStep.question);

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
  }, [activeStep, displayInstruction, cleanedEquation, isSpeaking]);

  // In-flight guard to prevent duplicate step advancement
  const isAdvancingRef = useRef<boolean>(false);
  /** To'g'ri javob tabrik paytida ushlab turiladi, "davom etish" da uzatiladi. */
  const pendingResultRef = useRef<{ attempt: StepAttempt; result: StepResult } | null>(null);

  // Reset state, speech, and timer when active step changes
  useEffect(() => {
    isAdvancingRef.current = false;
    setSelectedOptionIndex(-1);
    setPlacedTileIds([]);
    pendingResultRef.current = null;
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
  }, [activeStep?.id, activeStep?.stepNumber, timerProgress]);

  // Reanimated shake for wrong answers
  const shakeX = useSharedValue(0);
  const animatedShake = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const animatedTimerFill = useAnimatedStyle(() => ({
    width: `${timerProgress.value * 100}%`,
  }));

  // Yordam matni zinadan olinadi (`docs/PEDAGOGY.md` §3). Zina bosqichida
  // matn bo'lmasa — o'ylab topilgan jumla YOZILMAYDI, maslahat qutisi
  // umuman ko'rsatilmaydi.
  const firstHintMessage = activeStep?.hintLadder.find((rung: HintRung) => rung.message)?.message ?? "";

  // Handle celebration continue and step advancement safely
  const handleCelebrationContinue = useCallback(() => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;

    setShowCelebration(false);
    setShowConfetti(false);
    setConfirmedCorrect(false);

    const pending = pendingResultRef.current;
    pendingResultRef.current = null;
    if (pending) {
      onAnswer(pending.attempt, pending.result);
    }
  }, [onAnswer]);

  // Auto-advance fallback timer after celebration triggers
  useEffect(() => {
    if (showCelebration) {
      const autoTimer = setTimeout(() => {
        handleCelebrationContinue();
      }, 2500);
      return () => clearTimeout(autoTimer);
    }
  }, [showCelebration, handleCelebrationContinue]);

  /**
   * Javobni baholaydi va ekranni holatga o'tkazadi.
   *
   * To'g'ri bo'lsa — tabrik ko'rsatiladi va qadam FAQAT "davom etish"
   * bosilganda oldinga suriladi. Xato bo'lsa — silkinish va yordam zinasi.
   */
  const submitAttempt = useCallback(
    (attempt: StepAttempt, wrongVisualIndex: number | null) => {
      if (!activeStep || showCelebration || isAdvancingRef.current) return;

      const outcome = checkStep(activeStep, attempt, 0);
      if (outcome.status === 'needs_server') {
        // Mahalliy tekshiruv aniq javob bera olmadi. Taxmin qilinmaydi:
        // bola noto'g'ri "xato" olsa, ilovaga ishonchni yo'qotadi.
        // Server yo'li T1.4 da ulanadi (`tutorApiClient.verifyUncertainAnswer`).
        console.warn('[SocraticScannerScreen] local check uncertain, server verify not wired yet');
        return;
      }

      pendingResultRef.current = { attempt, result: outcome.result };

      if (outcome.result.isCorrect) {
        setConfirmedCorrect(true);
        setWrongIndex(null);
        setShowGuidanceHint(false);
        HapticFeedback.success();
        setShowConfetti(true);
        setShowCelebration(true);
        return;
      }

      setConfirmedCorrect(false);
      setWrongIndex(wrongVisualIndex);
      setShowGuidanceHint(true);
      onAnswer(attempt, outcome.result);
      HapticFeedback.error();
      shakeX.value = withSequence(
        withSpring(-8, { damping: 5, stiffness: 400 }),
        withSpring(8, { damping: 5, stiffness: 400 }),
        withSpring(0, { damping: 6, stiffness: 300 }),
      );
    },
    [activeStep, onAnswer, shakeX, showCelebration],
  );

  const handleOptionPress = useCallback(
    (index: number) => {
      if (!activeStep || activeStep.format !== 'MULTIPLE_CHOICE') return;
      const option = activeStep.options[index];
      if (!option) return;

      setSelectedOptionIndex(index);
      submitAttempt(
        { format: 'MULTIPLE_CHOICE', stepId: activeStep.id, optionId: option.id },
        index
      );
    },
    [activeStep, submitAttempt],
  );

  const handleTilePress = useCallback((tileId: string) => {
    // Slotdagi plitka bosilsa bankka qaytadi — bekor qilish doim mumkin
    // (`docs/UI_ARCHITECTURE.md` §4.3.2 I).
    setPlacedTileIds((placed) =>
      placed.includes(tileId) ? placed.filter((id) => id !== tileId) : [...placed, tileId]
    );
  }, []);

  const isTileRowComplete =
    activeStep?.format === 'STEP_BUILDER' && placedTileIds.length === activeStep.slotCount;

  // Tugma faqat javob TO'LIQ bo'lganda yonadi (`docs/UI_ARCHITECTURE.md`
  // §4.3.2 I: 1-holat so'niq, 3-holat yonadi).
  const isPrimaryActionEnabled =
    showCelebration ||
    (activeStep?.format === 'STEP_BUILDER' ? isTileRowComplete : selectedOptionIndex >= 0);

  const handleCheckTiles = useCallback(() => {
    if (!activeStep || activeStep.format !== 'STEP_BUILDER' || !isTileRowComplete) return;
    submitAttempt({ format: 'STEP_BUILDER', stepId: activeStep.id, tileIds: placedTileIds }, null);
  }, [activeStep, isTileRowComplete, placedTileIds, submitAttempt]);

  const handleLocalSnapPhoto = async () => {
    if (isBusy) return;
    HapticFeedback.success();
    setIsSimulatingScan(true);
    setIsBusy(true);
    try {
      // Dinamik rejim (POST /api/tutor/extract) Faza 1 gacha o'chirilgan: u
      // hali mavjud bo'lmagan serverga tayanadi va chaqirilsa ishlaydigan
      // tahlil yo'lini to'sib qo'yadi. TASKS.md T0.11 ga qarang.
      setDynamicError(null);
      setDynamicErrorType(null);

      // Haqiqiy Gemini tahlili shu yerda — captureAndAnalyze o'z suratini oladi.
      if (onSnapPhoto) {
        await onSnapPhoto();
      }
    } catch (err) {
      reportDynamicError(err, 'Snap photo error');
    } finally {
      setIsSimulatingScan(false);
      setIsBusy(false);
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

  const visibleError = analysisError || dynamicError;
  const visibleErrorType = analysisError ? analysisErrorType : dynamicErrorType;

  if (visibleError) {
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
                {visibleErrorType === 'network' ? (
                  <Lightning size={44} color="#EF4444" weight="bold" />
                ) : visibleErrorType === 'blurry' ? (
                  <Scan size={44} color="#EF4444" weight="bold" />
                ) : (
                  <XCircle size={44} color="#EF4444" weight="bold" />
                )}
              </View>
              <Text style={permStyles.cardTitle}>Uyog'ey, Xatolik!</Text>
              <Text style={permStyles.cardSubtitle}>{visibleError}</Text>
              <BentoSpringCard style={permStyles.enableButton} onPress={onBack}>
                <Text style={permStyles.enableButtonText}>Orqaga qaytish</Text>
              </BentoSpringCard>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Darvoza: dars ekrani faqat HAQIQIY qadam bo'lganda ko'rsatiladi.
  // `activeStep` null bo'lsa (skanerlash bo'lmagan yoki muvaffaqiyatsiz),
  // ekran kamerada qoladi. Shu tufayli quyidagi kod uchun `activeStep`
  // TypeScript darajasida ham null bo'lmasligi kafolatlanadi.
  if (!activeStep) {
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
            {/* Repetitor va Nutq Pufagi (Duolingo Mascot + Oq Daftar Bubble) */}
            <View style={styles.tutorRow}>
              <View style={styles.mascotWrapper}>
                <AiMascotAvatar
                  size={52}
                  mood={
                    showCelebration
                      ? "celebrating"
                      : wrongIndex !== null
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

                {/* Masala ifodasi — dars davomida o'zgarmaydi */}
                {cleanedEquation ? (
                  <View style={styles.equationCard}>
                    <RichMathText style={styles.equationCardText}>{cleanedEquation}</RichMathText>
                  </View>
                ) : null}

                {/* Sokratik savol — ekrandagi YAGONA savol matni.
                    Sarlavha, tushuntirish va "snippet" bloklari T0.20 da
                    olib tashlandi: shartnomada bitta savol bor, beshta emas
                    (`docs/UI_ARCHITECTURE.md` §4.3.1 C). */}
                <RichMathText style={styles.socraticPromptText}>
                  {activeStep.question.replace(/^["']|["']$/g, "").trim()}
                </RichMathText>
              </View>
            </View>

            {/* Xato urinishda yordam zinasining matni. Matn bo'lmasa —
                quti umuman chiqmaydi (o'ylab topilgan maslahat yozilmaydi). */}
            {wrongIndex !== null && firstHintMessage ? (
              <View style={styles.gentleHintBox}>
                <Text style={styles.gentleHintText}>{firstHintMessage}</Text>
              </View>
            ) : null}

            {activeStep.format === 'MULTIPLE_CHOICE' ? (
              <Animated.View style={[styles.choicesList, animatedShake]}>
                {activeStep.options.map((option, idx) => (
                  <SocraticActionBlock
                    key={option.id}
                    title={option.label}
                    isSelected={selectedOptionIndex === idx}
                    isCorrect={confirmedCorrect && selectedOptionIndex === idx}
                    isWrong={wrongIndex === idx}
                    onPress={() => handleOptionPress(idx)}
                  />
                ))}
              </Animated.View>
            ) : (
              <Animated.View style={animatedShake}>
                <StepBuilderBoard
                  step={activeStep}
                  placedTileIds={placedTileIds}
                  onTilePress={handleTilePress}
                />
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
              isFinished
                ? styles.primaryDuoBtnVictory
                : isPrimaryActionEnabled
                ? styles.primaryDuoBtnActive
                : styles.primaryDuoBtnDisabled,
            ]}
            onPress={() => {
              if (isFinished) {
                onClaimVictory();
              } else if (showCelebration) {
                handleCelebrationContinue();
              } else if (activeStep?.format === 'STEP_BUILDER') {
                handleCheckTiles();
              } else if (selectedOptionIndex >= 0 && !confirmedCorrect) {
                handleOptionPress(selectedOptionIndex);
              }
            }}
            disabled={!isFinished && !isPrimaryActionEnabled}
          >
            <Text
              style={[
                styles.primaryDuoBtnText,
                isFinished || isPrimaryActionEnabled
                  ? styles.primaryDuoBtnTextActive
                  : styles.primaryDuoBtnTextDisabled,
              ]}
            >
              {isFinished
                ? t('scanner.interaction.lessonComplete')
                : showCelebration
                ? t('scanner.interaction.continue')
                : isPrimaryActionEnabled
                ? t('scanner.interaction.checkAnswer')
                : t('scanner.interaction.selectAnswer')}
            </Text>
          </Pressable>
        </View>
        </SafeAreaView>

        {/* Inline Celebration Banner */}
        <InlineCelebrationBanner
          visible={showCelebration}
          xpEarned={stepXp}
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
