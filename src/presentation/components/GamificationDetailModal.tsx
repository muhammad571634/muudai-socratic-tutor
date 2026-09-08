// O'ylanish: Ushbu komponent Duolingo va Apple Minimalist uslubida 3 ta tabni (Level, Streak, Energy)
// yirik jonli Phosphor Icons (18-48px), 900 qalin tipografiya, taktil 3D kartalar va bolalarga (4-17 yosh) mos
// qisqa, tushunarli vizual belgilar bilan ta'minlaydi. Barcha ortiqcha emoji va platformaga bog'liq belgilar olib tashlandi.

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import {
  Plant,
  Compass,
  Flask,
  Trophy,
  Crown,
  GraduationCap,
  Flame,
  Lightning,
  PuzzlePiece,
  CalendarCheck,
  Sparkle,
  Check,
  CheckCircle,
  ArrowCircleUp,
  Clock,
  BatteryFull,
  BatteryCharging,
  BatteryLow,
  Brain,
  ShieldCheck,
  Certificate,
  Medal,
  SealCheck,
  CaretRight,
  Target,
  Gift,
  MagnifyingGlass,
  type IconWeight,
} from 'phosphor-react-native';
import { theme } from '../../core/theme';
import { HapticFeedback } from '../../core/haptics';
import { LEARNER_RANKS } from '../../domain/entities/Gamification';
import { useGamificationStore } from '../state/useGamificationStore';
import { useEnergyTimer } from '../hooks/useEnergyTimer';
import { PulsingFlame } from './PulsingFlame';

export type GamificationModalTab = 'rank' | 'streak' | 'energy';

export interface GamificationDetailModalProps {
  visible: boolean;
  initialTab?: GamificationModalTab;
  onClose: () => void;
  onPracticeMistakes?: () => void;
}

export const renderRankIcon = (
  level: number,
  size: number = 24,
  color: string = '#007AFF',
  weight: IconWeight = 'fill'
) => {
  switch (level) {
    case 1:
      return <Plant size={size} color={color} weight={weight} />;
    case 2:
      return <Compass size={size} color={color} weight={weight === 'fill' ? 'bold' : weight} />;
    case 3:
      return <Flask size={size} color={color} weight={weight} />;
    case 4:
      return <Trophy size={size} color={color} weight={weight} />;
    default:
      return <Trophy size={size} color={color} weight={weight} />;
  }
};

export const renderMilestonePerkIcon = (
  level: number,
  size: number = 16,
  color: string = '#CA8A04'
) => {
  switch (level) {
    case 1:
      return <MagnifyingGlass size={size} color={color} weight="bold" />;
    case 2:
      return <Gift size={size} color={color} weight="fill" />;
    case 3:
      return <Flask size={size} color={color} weight="fill" />;
    case 4:
      return <Certificate size={size} color={color} weight="fill" />;
    default:
      return <Sparkle size={size} color={color} weight="fill" />;
  }
};

export const getMilestonePerkTitle = (level: number): string => {
  switch (level) {
    case 1:
      return 'Socratic Scanner';
    case 2:
      return 'Mystery Chest';
    case 3:
      return 'Virtual Lab';
    case 4:
      return 'Honors Diploma';
    default:
      return 'Secret Reward';
  }
};

const getRankThemeColors = (level: number) => {
  switch (level) {
    case 1:
      return {
        bg: theme.colors.surfaceGreen,
        border: theme.colors.surfaceGreenBorder,
        shadow: theme.colors.successGreen,
        text: theme.colors.greenActiveDark,
        accent: theme.colors.greenActive,
      };
    case 2:
      return {
        bg: theme.colors.surfaceOrange,
        border: theme.colors.surfaceOrangeBorder,
        shadow: theme.colors.streakOrange,
        text: theme.colors.orangeActiveDark,
        accent: theme.colors.orangeActive,
      };
    case 3:
      return {
        bg: theme.colors.surfaceBlue,
        border: theme.colors.surfaceBlueBorder,
        shadow: theme.colors.mathBlue,
        text: theme.colors.blueActiveDark,
        accent: theme.colors.blueActive,
      };
    case 4:
    default:
      return {
        bg: theme.colors.surfaceGold,
        border: theme.colors.surfaceGoldBorder,
        shadow: theme.colors.goldActive,
        text: theme.colors.goldActiveDark,
        accent: theme.colors.goldActive,
      };
  }
};

interface ChunkyTabPillProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  activeColor: string;
  activeBg: string;
  activeBorder: string;
  activeBorderBottom: string;
  onPress: () => void;
}

const ChunkyTabPill: React.FC<ChunkyTabPillProps> = ({
  label,
  icon,
  isActive,
  activeColor,
  activeBg,
  activeBorder,
  activeBorderBottom,
  onPress,
}) => {
  const pressOffset = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pressOffset.value }],
  }));

  const handlePressIn = () => {
    pressOffset.value = withSpring(2.5, { damping: 15, stiffness: 350 });
  };

  const handlePressOut = () => {
    pressOffset.value = withSpring(0, { damping: 15, stiffness: 350 });
  };

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.tabPill,
          isActive
            ? {
                backgroundColor: activeBg,
                borderColor: activeBorder,
                borderBottomColor: activeBorderBottom,
                borderBottomWidth: 4,
              }
            : styles.tabPillInactive,
        ]}
      >
        <View style={styles.tabIconContainer}>{icon}</View>
        <Text
          style={[
            styles.tabPillText,
            isActive ? { color: activeColor } : styles.tabPillTextInactive,
          ]}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

interface ChunkyButtonProps {
  label: string;
  icon?: React.ReactNode;
  backgroundColor: string;
  borderColor: string;
  shadowColor: string;
  textColor?: string;
  disabled?: boolean;
  onPress: () => void;
}

const ChunkyButton: React.FC<ChunkyButtonProps> = ({
  label,
  icon,
  backgroundColor,
  borderColor,
  shadowColor,
  textColor = theme.colors.background,
  disabled = false,
  onPress,
}) => {
  const pressOffset = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pressOffset.value }],
  }));

  const handlePressIn = () => {
    if (disabled) return;
    pressOffset.value = withSpring(3.5, { damping: 14, stiffness: 350 });
  };

  const handlePressOut = () => {
    if (disabled) return;
    pressOffset.value = withSpring(0, { damping: 14, stiffness: 350 });
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        disabled={disabled}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.chunkyActionBtn,
          {
            backgroundColor,
            borderColor,
            borderBottomColor: shadowColor,
            opacity: disabled ? 0.8 : 1,
          },
        ]}
      >
        {icon ? <View style={styles.chunkyBtnIcon}>{icon}</View> : null}
        <Text style={[styles.chunkyActionBtnText, { color: textColor }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
};

export const GamificationDetailModal: React.FC<GamificationDetailModalProps> = ({
  visible,
  initialTab = 'rank',
  onClose,
  onPracticeMistakes,
}) => {
  const [activeTab, setActiveTab] = useState<GamificationModalTab>(initialTab);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const {
    xp,
    streakDays,
    isStreakClaimedToday,
    solvedProblemsCount,
    activeDaysCount,
    energy,
    maxEnergy,
    currentRank,
    getRankProgress,
    getWeeklyStreak,
    canAccessHonorCertificate,
    claimDailyStreak,
    addBonusEnergy,
  } = useGamificationStore();

  const {
    formattedCountdown,
    refillProgressPercent,
    isFull: isEnergyFull,
  } = useEnergyTimer();

  const rankProgress = getRankProgress();
  const weeklyStreak = getWeeklyStreak();
  const rankColors = getRankThemeColors(currentRank.level);

  // Modal ochilganda tanlangan tabni yangilash
  useEffect(() => {
    if (visible) {
      setActiveTab(initialTab);
    }
  }, [visible, initialTab]);

  // Reanimated 3 progress animatsiyasi
  const animatedProgress = useSharedValue(rankProgress.progressRatio);
  useEffect(() => {
    animatedProgress.value = withTiming(rankProgress.progressRatio, { duration: 450 });
  }, [rankProgress.progressRatio, animatedProgress]);

  const animatedProgressBarStyle = useAnimatedStyle(() => ({
    width: `${Math.round(animatedProgress.value * 100)}%`,
  }));

  // Reanimated 3 energy refill progress animatsiyasi
  const animatedEnergyProgress = useSharedValue(refillProgressPercent);
  useEffect(() => {
    animatedEnergyProgress.value = withTiming(refillProgressPercent, { duration: 300 });
  }, [refillProgressPercent, animatedEnergyProgress]);

  const animatedEnergyBarStyle = useAnimatedStyle(() => ({
    width: `${Math.round(animatedEnergyProgress.value)}%`,
  }));

  const handleTabChange = (tab: GamificationModalTab) => {
    HapticFeedback.selection();
    setActiveTab(tab);
  };

  const handleClaimStreak = () => {
    HapticFeedback.success();
    claimDailyStreak();
  };

  const handlePracticeRefill = () => {
    HapticFeedback.success();
    if (energy < maxEnergy) {
      addBonusEnergy(1);
    }
    if (onPracticeMistakes) {
      onClose();
      onPracticeMistakes();
    }
  };

  // 7 kunlik haftalik doirachalar: Su, Mo, Tu, We, Th, Fr, Sa
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;
  const currentDayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const storeDayMap = [6, 0, 1, 2, 3, 4, 5]; // Sunday -> weeklyStreak[6], Monday -> weeklyStreak[0]

  const weeklyDayCards = dayNames.map((label, idx) => {
    const storeInfo = weeklyStreak[storeDayMap[idx]];
    const isToday = idx === currentDayIndex || Boolean(storeInfo?.isToday);
    const isCompleted = isToday
      ? isStreakClaimedToday
      : Boolean(storeInfo?.completed || (idx < currentDayIndex && (currentDayIndex - idx) <= streakDays));

    return {
      label,
      isToday,
      isCompleted,
    };
  });

  const completedDaysCount = weeklyDayCards.filter((d) => d.isCompleted).length;

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        {/* Apple Dimmed Backdrop Dismiss */}
        <Pressable style={styles.backdropDismiss} onPress={onClose} />

        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(160)}
          style={styles.sheetContainer}
        >
          {/* Apple Drag Indicator */}
          <View style={styles.dragPillContainer}>
            <View style={styles.dragPill} />
          </View>

          {/* 1. Chunky 3D Segmented Tab Selector Bar */}
          <View style={styles.tabSelectorBar}>
            <ChunkyTabPill
              label="LEVEL"
              icon={
                <GraduationCap
                  size={20}
                  color={activeTab === 'rank' ? theme.colors.blueActiveDark : theme.colors.textSecondary}
                  weight={activeTab === 'rank' ? 'fill' : 'bold'}
                />
              }
              isActive={activeTab === 'rank'}
              activeColor={theme.colors.blueActiveDark}
              activeBg={theme.colors.surfaceBlue}
              activeBorder={theme.colors.surfaceBlueBorder}
              activeBorderBottom={theme.colors.blueActive}
              onPress={() => handleTabChange('rank')}
            />

            <ChunkyTabPill
              label="STREAK"
              icon={
                <Flame
                  size={20}
                  color={activeTab === 'streak' ? theme.colors.orangeActiveDark : theme.colors.textSecondary}
                  weight={activeTab === 'streak' ? 'fill' : 'bold'}
                />
              }
              isActive={activeTab === 'streak'}
              activeColor={theme.colors.orangeActiveDark}
              activeBg={theme.colors.surfaceOrange}
              activeBorder={theme.colors.surfaceOrangeBorder}
              activeBorderBottom={theme.colors.orangeActive}
              onPress={() => handleTabChange('streak')}
            />

            <ChunkyTabPill
              label="ENERGY"
              icon={
                <Lightning
                  size={20}
                  color={activeTab === 'energy' ? theme.colors.blueActiveDark : theme.colors.textSecondary}
                  weight={activeTab === 'energy' ? 'fill' : 'bold'}
                />
              }
              isActive={activeTab === 'energy'}
              activeColor={theme.colors.blueActiveDark}
              activeBg={theme.colors.surfaceBlue}
              activeBorder={theme.colors.surfaceBlueBorder}
              activeBorderBottom={theme.colors.blueActive}
              onPress={() => handleTabChange('energy')}
            />
          </View>

          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.scrollBodyContent}
            showsVerticalScrollIndicator={false}
          >
            {/* ============================================================== */}
            {/* TAB 1: LEVEL & MASTERY                                         */}
            {/* ============================================================== */}
            {activeTab === 'rank' && (
              <View style={styles.tabContent}>
                {/* Hero Level Card with Dynamic Rank Colors & Big 88px 3D Badge */}
                <View style={styles.heroLevelCard}>
                  <View
                    style={[
                      styles.heroBadgeCircle,
                      {
                        borderColor: rankColors.border,
                        borderBottomColor: rankColors.shadow,
                        backgroundColor: rankColors.bg,
                      },
                    ]}
                  >
                    {renderRankIcon(currentRank.level, 46, rankColors.accent, 'fill')}
                  </View>

                  <View
                    style={[
                      styles.heroLevelPill,
                      {
                        backgroundColor: rankColors.bg,
                        borderColor: rankColors.border,
                      },
                    ]}
                  >
                    <Text style={[styles.heroLevelPillText, { color: rankColors.text }]}>
                      LEVEL {currentRank.level}
                    </Text>
                  </View>

                  <Text style={styles.heroRankTitle}>{currentRank.title}</Text>

                  {/* Punchy Visual Status Chip (No wordy sentences) */}
                  <View
                    style={[
                      styles.heroStatusChip,
                      rankProgress.isReadyToLevelUp
                        ? styles.heroStatusChipReady
                        : styles.heroStatusChipNormal,
                    ]}
                  >
                    {rankProgress.isReadyToLevelUp ? (
                      <Sparkle
                        size={16}
                        color={theme.colors.greenActive}
                        weight="fill"
                        style={styles.heroChipIcon}
                      />
                    ) : (
                      <ArrowCircleUp
                        size={16}
                        color={theme.colors.blueActive}
                        weight="bold"
                        style={styles.heroChipIcon}
                      />
                    )}
                    <Text
                      style={[
                        styles.heroStatusChipText,
                        rankProgress.isReadyToLevelUp
                          ? styles.heroStatusChipTextReady
                          : styles.heroStatusChipTextNormal,
                      ]}
                    >
                      {rankProgress.isReadyToLevelUp
                        ? 'Ready to Level Up'
                        : rankProgress.nextRank
                        ? `Next: ${rankProgress.nextRank.title}`
                        : 'Master Scholar Highest Rank'}
                    </Text>
                  </View>
                </View>

                {/* 3 Chunky 3D Stat Cards with Big Expressive Badges (Responsive layout for 320px+) */}
                <View style={styles.statsCardsRow}>
                  {/* Card 1: Solved Problems */}
                  <View style={styles.chunkyStatCardProblems}>
                    <View style={styles.statIconBadgeGreen}>
                      <PuzzlePiece size={24} color={theme.colors.greenActive} weight="fill" />
                    </View>
                    <View style={styles.statValueRow}>
                      <Text style={styles.statValueNumber}>{solvedProblemsCount}</Text>
                      <Text style={styles.statTargetNumber}>
                        /{rankProgress.nextLevelProblems}
                      </Text>
                    </View>
                    <Text style={styles.statLabel}>SOLVED</Text>
                    <View style={styles.miniProgressTrack}>
                      <View
                        style={[
                          styles.miniProgressBar,
                          {
                            width: `${Math.min(
                              100,
                              Math.round(
                                (solvedProblemsCount / Math.max(1, rankProgress.nextLevelProblems)) * 100
                              )
                            )}%`,
                            backgroundColor: theme.colors.successGreen,
                          },
                        ]}
                      />
                    </View>
                  </View>

                  {/* Card 2: Study Days */}
                  <View style={styles.chunkyStatCardDays}>
                    <View style={styles.statIconBadgeOrange}>
                      <CalendarCheck size={24} color={theme.colors.streakOrange} weight="bold" />
                    </View>
                    <View style={styles.statValueRow}>
                      <Text style={styles.statValueNumber}>{activeDaysCount}</Text>
                      <Text style={styles.statTargetNumber}>
                        /{rankProgress.nextLevelDays}
                      </Text>
                    </View>
                    <Text style={styles.statLabel}>DAYS</Text>
                    <View style={styles.miniProgressTrack}>
                      <View
                        style={[
                          styles.miniProgressBar,
                          {
                            width: `${Math.min(
                              100,
                              Math.round(
                                (activeDaysCount / Math.max(1, rankProgress.nextLevelDays)) * 100
                              )
                            )}%`,
                            backgroundColor: theme.colors.streakOrange,
                          },
                        ]}
                      />
                    </View>
                  </View>

                  {/* Card 3: Inquiry XP */}
                  <View style={styles.chunkyStatCardXp}>
                    <View style={styles.statIconBadgeBlue}>
                      <Lightning size={24} color={theme.colors.mathBlue} weight="fill" />
                    </View>
                    <View style={styles.statValueRow}>
                      <Text style={styles.statValueNumber}>{xp}</Text>
                      {rankProgress.nextRank ? (
                        <Text style={styles.statTargetNumber}>
                          /{rankProgress.nextLevelXp}
                        </Text>
                      ) : null}
                    </View>
                    <Text style={styles.statLabel}>XP</Text>
                    <View style={styles.miniProgressTrack}>
                      <View
                        style={[
                          styles.miniProgressBar,
                          {
                            width: `${Math.min(
                              100,
                              Math.round(
                                (xp / Math.max(1, rankProgress.nextLevelXp)) * 100
                              )
                            )}%`,
                            backgroundColor: theme.colors.mathBlue,
                          },
                        ]}
                      />
                    </View>
                  </View>
                </View>

                {/* Overall Milestone Readiness Progress Card */}
                <View style={styles.milestoneCard}>
                  <View style={styles.milestoneHeaderRow}>
                    <Text style={styles.milestoneTitle}>LEVEL PROGRESS</Text>
                    <Text style={styles.milestonePercent}>
                      {Math.round(rankProgress.progressRatio * 100)}%
                    </Text>
                  </View>

                  {/* Thick 12px Chunky Progress Bar */}
                  <View style={styles.progressTrackLarge}>
                    <Animated.View style={[styles.progressBarLarge, animatedProgressBarStyle]} />
                  </View>

                  {/* Visual Requirement Chips with Positive Done State (Ages 4-17) */}
                  {rankProgress.isReadyToLevelUp ? (
                    <View style={styles.readyBannerPill}>
                      <CheckCircle
                        size={20}
                        color={theme.colors.greenActive}
                        weight="fill"
                        style={styles.readyBannerIcon}
                      />
                      <Text style={styles.readyBannerText}>Ready to Level Up! Tap to Claim</Text>
                    </View>
                  ) : rankProgress.nextRank ? (
                    <View style={styles.reqChipsRow}>
                      {/* Problems requirement chip */}
                      <View
                        style={[
                          styles.reqChipPill,
                          rankProgress.problemsNeededForNextRank === 0
                            ? styles.reqChipPillDone
                            : null,
                        ]}
                      >
                        <PuzzlePiece
                          size={15}
                          color={rankProgress.problemsNeededForNextRank === 0 ? theme.colors.greenActive : theme.colors.textSecondary}
                          weight="fill"
                          style={{ marginRight: 4 }}
                        />
                        {rankProgress.problemsNeededForNextRank === 0 ? (
                          <Check size={14} color={theme.colors.greenActiveDark} weight="bold" style={{ marginRight: 2 }} />
                        ) : (
                          <Text style={styles.reqChipNumber}>
                            {rankProgress.problemsNeededForNextRank}
                          </Text>
                        )}
                        <Text
                          style={[
                            styles.reqChipLabel,
                            rankProgress.problemsNeededForNextRank === 0
                              ? styles.reqChipLabelDone
                              : null,
                          ]}
                        >
                          {rankProgress.problemsNeededForNextRank === 0 ? 'Done' : 'left'}
                        </Text>
                      </View>

                      {/* Days requirement chip */}
                      <View
                        style={[
                          styles.reqChipPill,
                          rankProgress.daysNeededForNextRank === 0
                            ? styles.reqChipPillDone
                            : null,
                        ]}
                      >
                        <CalendarCheck
                          size={15}
                          color={rankProgress.daysNeededForNextRank === 0 ? theme.colors.greenActive : theme.colors.textSecondary}
                          weight="bold"
                          style={{ marginRight: 4 }}
                        />
                        {rankProgress.daysNeededForNextRank === 0 ? (
                          <Check size={14} color={theme.colors.greenActiveDark} weight="bold" style={{ marginRight: 2 }} />
                        ) : (
                          <Text style={styles.reqChipNumber}>
                            {rankProgress.daysNeededForNextRank}
                          </Text>
                        )}
                        <Text
                          style={[
                            styles.reqChipLabel,
                            rankProgress.daysNeededForNextRank === 0
                              ? styles.reqChipLabelDone
                              : null,
                          ]}
                        >
                          {rankProgress.daysNeededForNextRank === 0 ? 'Done' : 'left'}
                        </Text>
                      </View>

                      {/* XP requirement chip */}
                      <View
                        style={[
                          styles.reqChipPill,
                          rankProgress.xpNeededForNextRank === 0
                            ? styles.reqChipPillDone
                            : null,
                        ]}
                      >
                        <Lightning
                          size={15}
                          color={rankProgress.xpNeededForNextRank === 0 ? theme.colors.greenActive : theme.colors.textSecondary}
                          weight="fill"
                          style={{ marginRight: 4 }}
                        />
                        {rankProgress.xpNeededForNextRank === 0 ? (
                          <Check size={14} color={theme.colors.greenActiveDark} weight="bold" style={{ marginRight: 2 }} />
                        ) : (
                          <Text style={styles.reqChipNumber}>
                            {rankProgress.xpNeededForNextRank}
                          </Text>
                        )}
                        <Text
                          style={[
                            styles.reqChipLabel,
                            rankProgress.xpNeededForNextRank === 0
                              ? styles.reqChipLabelDone
                              : null,
                          ]}
                        >
                          {rankProgress.xpNeededForNextRank === 0 ? 'Done' : 'XP'}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.readyBannerPill}>
                      <Trophy size={18} color="#CA8A04" weight="fill" style={{ marginRight: 6 }} />
                      <Text style={styles.readyBannerText}>Master Scholar Highest Rank</Text>
                    </View>
                  )}
                </View>

                {/* Milestone Roadmap Step Journey */}
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionHeaderTitle}>LEARNING ROADMAP</Text>
                  <View style={styles.sectionHeaderBadgeContainer}>
                    <Text style={styles.sectionHeaderBadgeText}>4 LEVELS</Text>
                  </View>
                </View>

                {/* Duolingo-style 3D Stepping Stone Roadmap */}
                <View style={styles.stepRoadmapCard}>
                  {LEARNER_RANKS.map((rank, index) => {
                    const isCompleted = currentRank.level > rank.level;
                    const isCurrent = currentRank.level === rank.level;
                    const isLocked = currentRank.level < rank.level;
                    const isLast = index === LEARNER_RANKS.length - 1;

                    return (
                      <View key={rank.level} style={styles.stepItemWrapper}>
                        <View style={styles.stepRow}>
                          {/* Chunky 46px Stepping Stone Node */}
                          <View style={styles.stepNodeCol}>
                            <View
                              style={[
                                styles.stepNodeCircle,
                                isCompleted
                                  ? styles.stepNodeCircleCompleted
                                  : isCurrent
                                  ? styles.stepNodeCircleCurrent
                                  : styles.stepNodeCircleLocked,
                              ]}
                            >
                              {isCompleted ? (
                                <Check
                                  size={22}
                                  color={theme.colors.background}
                                  weight="bold"
                                />
                              ) : (
                                renderRankIcon(
                                  rank.level,
                                  20,
                                  isCurrent ? theme.colors.blueActiveDark : theme.colors.textSecondary,
                                  isCurrent ? 'fill' : 'bold'
                                )
                              )}
                            </View>

                            {/* Connecting 3D Step Line */}
                            {!isLast && (
                              <View
                                style={[
                                  styles.stepConnectorLine,
                                  isCompleted ? styles.stepConnectorLineActive : null,
                                ]}
                              />
                            )}
                          </View>

                          {/* 3D Step Content Card */}
                          <Pressable
                            style={[
                              styles.stepContentCard,
                              isCurrent ? styles.stepContentCardCurrent : null,
                              isCompleted ? styles.stepContentCardCompleted : null,
                            ]}
                            onPress={() => {
                              if (rank.level === 4) {
                                HapticFeedback.light();
                                setShowCertificateModal(true);
                              }
                            }}
                          >
                            <View style={styles.stepHeaderRow}>
                              <Text
                                style={[
                                  styles.stepRankTitle,
                                  !isLocked
                                    ? styles.stepRankTitleActive
                                    : styles.stepRankTitleLocked,
                                ]}
                              >
                                Level {rank.level}: {rank.title}
                              </Text>

                              {/* Status Badge */}
                              <View
                                style={[
                                  styles.statusPillBadge,
                                  isCurrent
                                    ? styles.statusPillBadgeCurrent
                                    : isCompleted
                                    ? styles.statusPillBadgeCompleted
                                    : styles.statusPillBadgeLocked,
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.statusPillBadgeText,
                                    isCurrent
                                      ? styles.statusPillBadgeTextCurrent
                                      : isCompleted
                                      ? styles.statusPillBadgeTextCompleted
                                      : styles.statusPillBadgeTextLocked,
                                  ]}
                                >
                                  {isCurrent ? 'ACTIVE' : isCompleted ? 'DONE' : 'LOCKED'}
                                </Text>
                              </View>
                            </View>

                            {/* Rewards & Visual Target Chips */}
                            <View style={styles.stepPerkRow}>
                              <View style={styles.perkBadgePill}>
                                <View style={{ marginRight: 4 }}>
                                  {renderMilestonePerkIcon(rank.level, 16, '#CA8A04')}
                                </View>
                                <Text style={styles.perkBadgeText}>{getMilestonePerkTitle(rank.level)}</Text>
                              </View>

                              {/* Goal Mini-Chips (Clean & Self-explanatory) */}
                              <View style={styles.stepGoalRow}>
                                {rank.minProblemsSolved === 0 ? (
                                  <View style={styles.goalMiniChip}>
                                    <Plant size={12} color={theme.colors.greenActive} weight="fill" style={{ marginRight: 4 }} />
                                    <Text style={styles.goalMiniChipText}>Starter</Text>
                                  </View>
                                ) : (
                                  <>
                                    <View style={styles.goalMiniChip}>
                                      <PuzzlePiece size={12} color={theme.colors.textSecondary} weight="fill" style={{ marginRight: 3 }} />
                                      <Text style={styles.goalMiniChipText}>
                                        {rank.minProblemsSolved}
                                      </Text>
                                    </View>
                                    <View style={styles.goalMiniChip}>
                                      <CalendarCheck size={12} color={theme.colors.textSecondary} weight="bold" style={{ marginRight: 3 }} />
                                      <Text style={styles.goalMiniChipText}>
                                        {rank.minActiveDays}
                                      </Text>
                                    </View>
                                    <View style={styles.goalMiniChip}>
                                      <Lightning size={12} color={theme.colors.textSecondary} weight="fill" style={{ marginRight: 3 }} />
                                      <Text style={styles.goalMiniChipText}>
                                        {rank.minXp}
                                      </Text>
                                    </View>
                                  </>
                                )}
                              </View>
                            </View>
                          </Pressable>
                        </View>
                      </View>
                    );
                  })}
                </View>

                {/* Parents' Honors Certificate Banner */}
                <Pressable
                  style={styles.certificatePromoCard}
                  onPress={() => {
                    HapticFeedback.light();
                    setShowCertificateModal(true);
                  }}
                >
                  <View style={styles.certIconContainer}>
                    <Certificate size={28} color={theme.colors.goldActive} weight="fill" />
                  </View>
                  <View style={styles.certContentCol}>
                    <Text style={styles.certCardTitle}>Honors Diploma</Text>
                    <Text style={styles.certCardSub}>
                      {canAccessHonorCertificate()
                        ? 'Master Scholar! Tap to view'
                        : 'Tap to preview certificate'}
                    </Text>
                  </View>
                  <CaretRight
                    size={20}
                    color={theme.colors.goldActive}
                    weight="bold"
                    style={styles.certChevron}
                  />
                </Pressable>
              </View>
            )}

            {/* ============================================================== */}
            {/* TAB 2: DAILY STREAK                                            */}
            {/* ============================================================== */}
            {activeTab === 'streak' && (
              <View style={styles.tabContent}>
                {/* Hero Mascot Flame Card with Big 96px Mascot Badge */}
                <View style={styles.heroFlameCard}>
                  <View style={styles.heroFlameAvatar}>
                    <PulsingFlame size={64} />
                  </View>
                  <Text style={styles.heroStreakNumber}>{streakDays}</Text>
                  <Text style={styles.heroStreakUnit}>DAY STREAK</Text>

                  {/* Punchy Badge (No wordy paragraphs) */}
                  <View
                    style={[
                      styles.heroStreakBadge,
                      isStreakClaimedToday
                        ? styles.heroStreakBadgeClaimed
                        : styles.heroStreakBadgePending,
                    ]}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      {isStreakClaimedToday ? (
                        <Flame size={16} color={theme.colors.greenActiveDark} weight="fill" />
                      ) : (
                        <Lightning size={16} color={theme.colors.orangeActiveDark} weight="fill" />
                      )}
                      <Text style={styles.heroStreakBadgeText}>
                        {isStreakClaimedToday ? 'Blazing Today' : 'Keep It Burning'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Weekly Day Tactile 3D Circles: Su, Mo, Tu, We, Th, Fr, Sa */}
                <View style={styles.weeklyStreakCard}>
                  <View style={styles.weeklyHeaderRow}>
                    <Text style={styles.weeklyCardTitle}>THIS WEEK</Text>
                    <Text style={styles.weeklyCardBadge}>
                      {completedDaysCount}/7 Days
                    </Text>
                  </View>

                  <View style={styles.weekCirclesRow}>
                    {weeklyDayCards.map((dayItem, idx) => (
                      <View key={idx} style={styles.dayCircleCol}>
                        <View
                          style={[
                            styles.dayCircle,
                            dayItem.isCompleted
                              ? styles.dayCircleCompleted
                              : dayItem.isToday
                              ? styles.dayCircleToday
                              : styles.dayCircleEmpty,
                          ]}
                        >
                          {dayItem.isCompleted ? (
                            <Check
                              size={20}
                              color={theme.colors.background}
                              weight="bold"
                            />
                          ) : dayItem.isToday ? (
                            <PulsingFlame size={20} />
                          ) : (
                            <Flame
                              size={16}
                              color={theme.colors.borderMuted}
                              weight="bold"
                            />
                          )}
                        </View>
                        <Text
                          style={[
                            styles.dayCircleLabel,
                            dayItem.isToday ? styles.dayCircleLabelToday : null,
                          ]}
                        >
                          {dayItem.label}
                        </Text>
                        {dayItem.isToday && <View style={styles.todayIndicatorDot} />}
                      </View>
                    ))}
                  </View>
                </View>

                {/* Streak Freeze Protection 3D Card */}
                <View style={styles.freezeCard}>
                  <View style={styles.freezeIconCircle}>
                    <ShieldCheck size={28} color={theme.colors.freezeBlue} weight="bold" />
                  </View>
                  <View style={styles.freezeContentCol}>
                    <Text style={styles.freezeTitle}>Streak Protected</Text>
                    <Text style={styles.freezeSub}>1 Day Shield Active</Text>
                  </View>
                  <View style={styles.freezeActivePill}>
                    <Text style={styles.freezeActivePillText}>ACTIVE</Text>
                  </View>
                </View>

                {/* Chunky 3D Orange Action Button */}
                <ChunkyButton
                  label={
                    isStreakClaimedToday
                      ? 'Streak Claimed Today'
                      : 'Claim Streak (+20 XP)'
                  }
                  icon={
                    isStreakClaimedToday ? (
                      <CheckCircle size={22} color={theme.colors.background} weight="fill" />
                    ) : (
                      <Flame size={22} color={theme.colors.background} weight="fill" />
                    )
                  }
                  backgroundColor={
                    isStreakClaimedToday
                      ? theme.colors.successGreen
                      : theme.colors.streakOrange
                  }
                  borderColor={
                    isStreakClaimedToday
                      ? theme.colors.successGreen
                      : theme.colors.streakOrange
                  }
                  shadowColor={
                    isStreakClaimedToday
                      ? theme.colors.successGreenShadow
                      : theme.colors.chemistryOrangeShadow
                  }
                  disabled={isStreakClaimedToday}
                  onPress={handleClaimStreak}
                />
              </View>
            )}

            {/* ============================================================== */}
            {/* TAB 3: ENERGY                                                  */}
            {/* ============================================================== */}
            {activeTab === 'energy' && (
              <View style={styles.tabContent}>
                {/* 5 Chunky Lightning Bolts / Energy Charges Card */}
                <View style={styles.heroEnergyCard}>
                  {/* Energy Hero Badge Circle (46px Lightning Hero Marker) */}
                  <View style={styles.heroEnergyAvatar}>
                    <Lightning size={46} color={theme.colors.streakOrange} weight="fill" />
                  </View>

                  {/* Energy Title: Fixed to show accurate state */}
                  <Text style={styles.energyChargesTitle}>
                    {energy >= maxEnergy
                      ? `${maxEnergy}/${maxEnergy} FULL ENERGY`
                      : `${energy}/${maxEnergy} ENERGY`}
                  </Text>

                  {/* Punchy Visual Status Pill */}
                  <View
                    style={[
                      styles.energyStatusPill,
                      energy === maxEnergy
                        ? styles.energyStatusPillFull
                        : styles.energyStatusPillCharging,
                    ]}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                      {energy === maxEnergy ? (
                        <BatteryFull size={16} color={theme.colors.greenActiveDark} weight="fill" />
                      ) : energy > 0 ? (
                        <BatteryCharging size={16} color={theme.colors.blueActiveDark} weight="bold" />
                      ) : (
                        <BatteryLow size={16} color={theme.colors.textSecondary} weight="bold" />
                      )}
                      <Text
                        style={[
                          styles.energyStatusPillText,
                          energy === maxEnergy
                            ? styles.energyStatusPillTextFull
                            : styles.energyStatusPillTextCharging,
                        ]}
                      >
                        {energy === maxEnergy
                          ? 'Ready for Questions'
                          : energy > 0
                          ? 'Recharging'
                          : 'Brain Rest Time'}
                      </Text>
                    </View>
                  </View>

                  {/* 5 Chunky 3D Lightning Batteries */}
                  <View style={styles.energyChargesRow}>
                    {[1, 2, 3, 4, 5].map((chargeSlot) => {
                      const isCharged = chargeSlot <= energy;
                      return (
                        <View
                          key={chargeSlot}
                          style={[
                            styles.energyChargeBox,
                            isCharged
                              ? styles.energyChargeBoxFilled
                              : styles.energyChargeBoxEmpty,
                          ]}
                        >
                          <Lightning
                            size={28}
                            color={
                              isCharged
                                ? theme.colors.background
                                : theme.colors.borderMuted
                            }
                            weight={isCharged ? 'fill' : 'bold'}
                          />
                          <Text
                            style={[
                              styles.energyChargeSlotNumber,
                              isCharged ? styles.energyChargeSlotNumberFilled : null,
                            ]}
                          >
                            {chargeSlot}
                          </Text>
                        </View>
                      );
                    })}
                  </View>

                  {/* Live Refill Countdown Timer */}
                  {isEnergyFull ? (
                    <View style={styles.fullEnergyPill}>
                      <CheckCircle
                        size={18}
                        color={theme.colors.greenActive}
                        weight="fill"
                        style={styles.fullEnergyIcon}
                      />
                      <Text style={styles.fullEnergyText}>5 of 5 Ready • Full Battery</Text>
                    </View>
                  ) : (
                    <View style={styles.liveCountdownCard}>
                      <View style={styles.countdownRow}>
                        <View style={styles.countdownLabelContainer}>
                          <Clock
                            size={18}
                            color={theme.colors.orangeActive}
                            weight="bold"
                            style={styles.countdownIcon}
                          />
                          <Text style={styles.countdownLabel}>Next +1 in</Text>
                        </View>
                        <Text style={styles.countdownValue}>{formattedCountdown}</Text>
                      </View>

                      {/* Smooth Progress Bar */}
                      <View style={styles.countdownTrack}>
                        <Animated.View
                          style={[styles.countdownBar, animatedEnergyBarStyle]}
                        />
                      </View>
                      <Text style={styles.countdownHint}>Auto-refills every 10 min</Text>
                    </View>
                  )}
                </View>

                {/* Encouraging Brain Rest Tip (Short, Punchy 3D Card) */}
                <View style={styles.brainRestCard}>
                  <View style={styles.brainRestIconCircle}>
                    <Brain size={28} color={theme.colors.purpleActive} weight="bold" />
                  </View>
                  <View style={styles.brainRestContentCol}>
                    <Text style={styles.brainRestTitle}>Brain Power Tip</Text>
                    <Text style={styles.brainRestSub}>
                      Short breaks boost memory & focus
                    </Text>
                  </View>
                  <View style={styles.brainRestBadge}>
                    <Text style={styles.brainRestBadgeText}>+1</Text>
                  </View>
                </View>

                {/* Practice Mistakes to Refill Action Button */}
                <ChunkyButton
                  label={
                    energy >= maxEnergy
                      ? 'Practice Mistakes'
                      : 'Practice to Refill (+1)'
                  }
                  icon={
                    energy >= maxEnergy ? (
                      <Target size={22} color={theme.colors.background} weight="bold" />
                    ) : (
                      <Lightning size={22} color={theme.colors.background} weight="fill" />
                    )
                  }
                  backgroundColor={theme.colors.mathBlue}
                  borderColor={theme.colors.mathBlue}
                  shadowColor={theme.colors.mathBlueShadow}
                  onPress={handlePracticeRefill}
                />
              </View>
            )}
          </ScrollView>

          {/* 5. Clean Chunky Done Button */}
          <View style={styles.footerContainer}>
            <ChunkyButton
              label="Done"
              backgroundColor={theme.colors.surfaceLight}
              borderColor={theme.colors.dragPill}
              shadowColor={theme.colors.borderMuted}
              textColor={theme.colors.headingDark}
              onPress={() => {
                HapticFeedback.light();
                onClose();
              }}
            />
          </View>
        </Animated.View>
      </View>

      {/* PARENTS' SOCRATIC HONORS CERTIFICATE MODAL */}
      <Modal
        visible={showCertificateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCertificateModal(false)}
      >
        <View style={styles.certModalBackdrop}>
          <View style={styles.certCardContainer}>
            <View style={styles.certInnerBorder}>
              {/* Seal of Excellence */}
              <View style={styles.certSeal}>
                <SealCheck size={36} color={theme.colors.goldActive} weight="fill" />
              </View>

              <Text style={styles.certInstitutionTitle}>MUUD ACADEMY OF INQUIRY</Text>
              <Text style={styles.certDiplomaHeadline}>HONORS CERTIFICATE</Text>
              <View style={styles.certDivider} />

              <Text style={styles.certGrantText}>Awarded to:</Text>
              <Text style={styles.certStudentName}>ALEX LEARNER</Text>

              <Text style={styles.certBodyText}>
                Mastery in Socratic Mathematics, Physics, and Chemistry.
              </Text>

              {/* Verified Proof Badges with Real Achievement Data */}
              <View style={styles.certStatsBadgeRow}>
                <View style={styles.certStatPill}>
                  <PuzzlePiece size={16} color={theme.colors.goldActive} weight="fill" style={{ marginBottom: 2 }} />
                  <Text style={styles.certStatPillNumber}>
                    {Math.max(70, solvedProblemsCount)}+
                  </Text>
                  <Text style={styles.certStatPillLabel}>SOLVED</Text>
                </View>
                <View style={styles.certStatPill}>
                  <CalendarCheck size={16} color={theme.colors.goldActive} weight="bold" style={{ marginBottom: 2 }} />
                  <Text style={styles.certStatPillNumber}>
                    {Math.max(14, activeDaysCount)}+
                  </Text>
                  <Text style={styles.certStatPillLabel}>DAYS</Text>
                </View>
                <View style={styles.certStatPill}>
                  <Lightning size={16} color={theme.colors.goldActive} weight="fill" style={{ marginBottom: 2 }} />
                  <Text style={styles.certStatPillNumber}>
                    {Math.max(1000, xp).toLocaleString()}+
                  </Text>
                  <Text style={styles.certStatPillLabel}>XP</Text>
                </View>
              </View>

              {/* Signatures & Seal */}
              <View style={styles.certSignRow}>
                <View style={styles.certSignCol}>
                  <Text style={styles.certSignTitle}>MuudAI Core</Text>
                  <Text style={styles.certSignRole}>AI Tutor</Text>
                </View>
                <View style={styles.certStampCircle}>
                  <Medal size={16} color={theme.colors.goldActive} weight="bold" />
                  <Text style={styles.certStampText}>VERIFIED</Text>
                </View>
                <View style={styles.certSignCol}>
                  <Text style={styles.certSignTitle}>2026 Honors</Text>
                  <Text style={styles.certSignRole}>Scholar</Text>
                </View>
              </View>
            </View>

            <Pressable
              style={styles.certCloseBtn}
              onPress={() => setShowCertificateModal(false)}
            >
              <Text style={styles.certCloseBtnText}>Close Certificate</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: theme.colors.overlayBackdrop,
    justifyContent: 'flex-end',
  },
  backdropDismiss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheetContainer: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.radii.card,
    borderTopRightRadius: theme.radii.card,
    maxHeight: '92%',
    paddingBottom: 20,
    shadowColor: theme.colors.headingDark,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
  },
  dragPillContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  dragPill: {
    width: 42,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: theme.colors.dragPill,
  },

  /* 1. Chunky 3D Segmented Tab Selector Bar */
  tabSelectorBar: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 18,
    marginBottom: 14,
  },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  tabPillInactive: {
    backgroundColor: theme.colors.surfaceLight,
    borderColor: theme.colors.dragPill,
    borderBottomColor: theme.colors.borderMuted,
    borderBottomWidth: 4,
  },
  tabIconContainer: {
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabPillText: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  tabPillTextInactive: {
    color: theme.colors.textSecondary,
  },

  scrollBody: {
    paddingHorizontal: 18,
  },
  scrollBodyContent: {
    paddingBottom: 16,
  },
  tabContent: {
    paddingTop: 2,
  },

  /* Hero Level Card */
  heroLevelCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: theme.colors.dragPill,
    borderBottomWidth: 4,
    borderBottomColor: theme.colors.borderMuted,
  },
  heroBadgeCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderBottomWidth: 5,
  },
  heroLevelPill: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 6,
    borderWidth: 1,
  },
  heroLevelPillText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  heroRankTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: theme.colors.headingDark,
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  heroStatusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  heroChipIcon: {
    marginRight: 6,
  },
  heroStatusChipNormal: {
    backgroundColor: theme.colors.surfaceBlue,
    borderColor: theme.colors.surfaceBlueBorder,
  },
  heroStatusChipReady: {
    backgroundColor: theme.colors.surfaceGreen,
    borderColor: theme.colors.surfaceGreenBorder,
  },
  heroStatusChipText: {
    fontSize: 13,
    fontWeight: '800',
  },
  heroStatusChipTextNormal: {
    color: theme.colors.blueActiveDark,
  },
  heroStatusChipTextReady: {
    color: theme.colors.greenActiveDark,
  },

  /* 3 Clean Chunky Stat Cards */
  statsCardsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  chunkyStatCardProblems: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.surfaceGreenBorder,
    borderBottomWidth: 4,
    borderBottomColor: theme.colors.successGreen,
  },
  chunkyStatCardDays: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.surfaceOrangeBorder,
    borderBottomWidth: 4,
    borderBottomColor: theme.colors.streakOrange,
  },
  chunkyStatCardXp: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.surfaceBlueBorder,
    borderBottomWidth: 4,
    borderBottomColor: theme.colors.mathBlue,
  },
  statIconBadgeGreen: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: theme.colors.surfaceGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.surfaceGreenBorder,
    borderBottomWidth: 3,
    borderBottomColor: theme.colors.successGreen,
  },
  statIconBadgeOrange: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: theme.colors.surfaceOrange,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.surfaceOrangeBorder,
    borderBottomWidth: 3,
    borderBottomColor: theme.colors.streakOrange,
  },
  statIconBadgeBlue: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: theme.colors.surfaceBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBlueBorder,
    borderBottomWidth: 3,
    borderBottomColor: theme.colors.mathBlue,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 2,
  },
  statValueNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.headingDark,
  },
  statTargetNumber: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.textSecondary,
    marginLeft: 1,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: theme.colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.8,
  },
  miniProgressTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.surfaceMuted,
    overflow: 'hidden',
  },
  miniProgressBar: {
    height: '100%',
    borderRadius: 3,
  },

  /* Milestone Overall Progress Card */
  milestoneCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: theme.colors.dragPill,
    borderBottomWidth: 4,
    borderBottomColor: theme.colors.borderMuted,
  },
  milestoneHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  milestoneTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: theme.colors.headingDark,
    letterSpacing: 0.8,
  },
  milestonePercent: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.blueActive,
  },
  progressTrackLarge: {
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.surfaceMuted,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarLarge: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: theme.colors.blueActive,
  },
  readyBannerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceGreen,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.surfaceGreenBorder,
  },
  readyBannerIcon: {
    marginRight: 8,
  },
  readyBannerText: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.greenActiveDark,
  },
  reqChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  reqChipPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceLight,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.dragPill,
  },
  reqChipPillDone: {
    backgroundColor: theme.colors.surfaceGreen,
    borderColor: theme.colors.surfaceGreenBorder,
  },
  reqChipNumber: {
    fontSize: 13,
    fontWeight: '900',
    color: theme.colors.headingDark,
    marginRight: 3,
  },
  reqChipNumberDone: {
    color: theme.colors.greenActiveDark,
  },
  reqChipLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  reqChipLabelDone: {
    color: theme.colors.greenActiveDark,
  },

  /* Milestone Step Journey Roadmap */
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sectionHeaderTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: theme.colors.headingDark,
    letterSpacing: 0.8,
  },
  sectionHeaderBadgeContainer: {
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.dragPill,
  },
  sectionHeaderBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
  },
  stepRoadmapCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 24,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: theme.colors.dragPill,
    borderBottomWidth: 4,
    borderBottomColor: theme.colors.borderMuted,
  },
  stepItemWrapper: {
    marginBottom: 6,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  stepNodeCol: {
    width: 48,
    alignItems: 'center',
    marginRight: 12,
  },
  stepNodeCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderBottomWidth: 4,
  },
  stepNodeCircleCompleted: {
    backgroundColor: theme.colors.successGreen,
    borderColor: theme.colors.successGreen,
    borderBottomColor: theme.colors.successGreenShadow,
  },
  stepNodeCircleCurrent: {
    backgroundColor: theme.colors.surfaceBlue,
    borderColor: theme.colors.blueActive,
    borderBottomColor: theme.colors.blueActiveDark,
  },
  stepNodeCircleLocked: {
    backgroundColor: theme.colors.surfaceLight,
    borderColor: theme.colors.dragPill,
    borderBottomColor: theme.colors.borderMuted,
  },
  stepConnectorLine: {
    width: 4,
    flex: 1,
    backgroundColor: theme.colors.dragPill,
    marginVertical: 4,
    borderRadius: 2,
  },
  stepConnectorLineActive: {
    backgroundColor: theme.colors.surfaceGreenBorder,
  },
  stepContentCard: {
    flex: 1,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: theme.colors.dragPill,
    borderBottomWidth: 3.5,
    borderBottomColor: theme.colors.borderMuted,
  },
  stepContentCardCompleted: {
    backgroundColor: theme.colors.surfaceGreen,
    borderColor: theme.colors.surfaceGreenBorder,
    borderBottomColor: theme.colors.successGreen,
  },
  stepContentCardCurrent: {
    backgroundColor: theme.colors.surfaceBlue,
    borderColor: theme.colors.surfaceBlueBorder,
    borderBottomColor: theme.colors.blueActive,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepRankTitle: {
    fontSize: 14,
    fontWeight: '900',
    flex: 1,
  },
  stepRankTitleActive: {
    color: theme.colors.headingDark,
  },
  stepRankTitleLocked: {
    color: theme.colors.textSecondary,
  },
  statusPillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 6,
  },
  statusPillBadgeCurrent: {
    backgroundColor: theme.colors.surfaceBlueBorder,
  },
  statusPillBadgeCompleted: {
    backgroundColor: theme.colors.surfaceGreenBorder,
  },
  statusPillBadgeLocked: {
    backgroundColor: theme.colors.surfaceMuted,
  },
  statusPillBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  statusPillBadgeTextCurrent: {
    color: theme.colors.blueActiveDark,
  },
  statusPillBadgeTextCompleted: {
    color: theme.colors.greenActiveDark,
  },
  statusPillBadgeTextLocked: {
    color: theme.colors.textSecondary,
  },
  stepPerkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  perkBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.dragPill,
  },
  perkBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.headingDark,
  },
  stepGoalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  goalMiniChip: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.dragPill,
  },
  goalMiniChipText: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.textSecondary,
  },

  /* Honors Certificate Card */
  certificatePromoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceGold,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1.5,
    borderColor: theme.colors.surfaceGoldBorder,
    borderBottomWidth: 4,
    borderBottomColor: theme.colors.goldActive,
    marginBottom: 14,
  },
  certIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceGoldBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  certContentCol: {
    flex: 1,
  },
  certCardTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: theme.colors.goldActiveDark,
    marginBottom: 2,
  },
  certCardSub: {
    fontSize: 12,
    color: theme.colors.goldActive,
    fontWeight: '700',
  },
  certChevron: {
    marginLeft: 6,
  },

  /* TAB 2: DAILY STREAK */
  heroFlameCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceOrange,
    borderRadius: 26,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: theme.colors.surfaceOrangeBorder,
    borderBottomWidth: 4.5,
    borderBottomColor: theme.colors.orangeActive,
  },
  heroFlameAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: theme.colors.surfaceOrangeBorder,
    borderBottomWidth: 4,
    borderBottomColor: theme.colors.streakOrange,
  },
  heroStreakNumber: {
    fontSize: 64,
    fontWeight: '900',
    color: theme.colors.orangeActive,
    letterSpacing: -1.5,
    lineHeight: 68,
  },
  heroStreakUnit: {
    fontSize: 15,
    fontWeight: '900',
    color: theme.colors.orangeActiveDark,
    letterSpacing: 1,
    marginBottom: 8,
  },
  heroStreakBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  heroStreakBadgeClaimed: {
    backgroundColor: theme.colors.surfaceGreen,
    borderColor: theme.colors.surfaceGreenBorder,
  },
  heroStreakBadgePending: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.surfaceOrangeBorder,
  },
  heroStreakBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.orangeActiveDark,
  },

  /* Weekly Day Tactile Circles */
  weeklyStreakCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: theme.colors.dragPill,
    borderBottomWidth: 4,
    borderBottomColor: theme.colors.borderMuted,
  },
  weeklyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  weeklyCardTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: theme.colors.textSecondary,
    letterSpacing: 1,
  },
  weeklyCardBadge: {
    fontSize: 12,
    fontWeight: '900',
    color: theme.colors.orangeActive,
  },
  weekCirclesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayCircleCol: {
    alignItems: 'center',
  },
  dayCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
  },
  dayCircleCompleted: {
    backgroundColor: theme.colors.streakOrange,
    borderColor: theme.colors.streakOrange,
    borderBottomColor: theme.colors.chemistryOrangeShadow,
  },
  dayCircleEmpty: {
    backgroundColor: theme.colors.surfaceLight,
    borderColor: theme.colors.dragPill,
    borderBottomColor: theme.colors.borderMuted,
  },
  dayCircleToday: {
    backgroundColor: theme.colors.surfaceOrange,
    borderColor: theme.colors.streakOrange,
    borderBottomColor: theme.colors.chemistryOrangeShadow,
  },
  dayCircleLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: theme.colors.textSecondary,
  },
  dayCircleLabelToday: {
    color: theme.colors.streakOrange,
    fontWeight: '900',
  },
  todayIndicatorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.streakOrange,
    marginTop: 2,
  },

  /* Streak Freeze */
  freezeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.freezeBlueSurface,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1.5,
    borderColor: theme.colors.freezeBlueBorder,
    borderBottomWidth: 4,
    borderBottomColor: theme.colors.freezeBlue,
    marginBottom: 16,
  },
  freezeIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.freezeBlueBorder,
    borderBottomWidth: 4,
    borderBottomColor: theme.colors.freezeBlue,
  },
  freezeContentCol: {
    flex: 1,
  },
  freezeTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: theme.colors.freezeBlue,
    marginBottom: 2,
  },
  freezeSub: {
    fontSize: 12,
    color: theme.colors.freezeBlue,
    fontWeight: '700',
  },
  freezeActivePill: {
    backgroundColor: theme.colors.freezeBlueBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  freezeActivePillText: {
    fontSize: 10,
    fontWeight: '900',
    color: theme.colors.freezeBlue,
    letterSpacing: 0.5,
  },

  /* TAB 3: ENERGY */
  heroEnergyCard: {
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: theme.colors.dragPill,
    borderBottomWidth: 4,
    borderBottomColor: theme.colors.borderMuted,
    alignItems: 'center',
  },
  heroEnergyAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: theme.colors.surfaceOrange,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: theme.colors.surfaceOrangeBorder,
    borderBottomWidth: 5,
    borderBottomColor: theme.colors.streakOrange,
  },
  energyChargesTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.headingDark,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  energyStatusPill: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  energyStatusPillFull: {
    backgroundColor: theme.colors.surfaceGreen,
    borderColor: theme.colors.surfaceGreenBorder,
  },
  energyStatusPillCharging: {
    backgroundColor: theme.colors.surfaceBlue,
    borderColor: theme.colors.surfaceBlueBorder,
  },
  energyStatusPillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  energyStatusPillTextFull: {
    color: theme.colors.greenActiveDark,
  },
  energyStatusPillTextCharging: {
    color: theme.colors.blueActiveDark,
  },
  energyChargesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    marginBottom: 14,
  },
  energyChargeBox: {
    flex: 1,
    height: 72,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderBottomWidth: 4,
  },
  energyChargeBoxFilled: {
    backgroundColor: theme.colors.mathBlue,
    borderColor: theme.colors.mathBlue,
    borderBottomColor: theme.colors.mathBlueShadow,
  },
  energyChargeBoxEmpty: {
    backgroundColor: theme.colors.surfaceLight,
    borderColor: theme.colors.dragPill,
    borderBottomColor: theme.colors.borderMuted,
  },
  energyChargeSlotNumber: {
    fontSize: 12,
    fontWeight: '900',
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  energyChargeSlotNumberFilled: {
    color: theme.colors.background,
  },

  /* Countdown Card */
  fullEnergyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceGreen,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.surfaceGreenBorder,
  },
  fullEnergyIcon: {
    marginRight: 6,
  },
  fullEnergyText: {
    fontSize: 13,
    fontWeight: '900',
    color: theme.colors.greenActiveDark,
  },
  liveCountdownCard: {
    width: '100%',
    backgroundColor: theme.colors.background,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.surfaceOrangeBorder,
    borderBottomWidth: 3.5,
    borderBottomColor: theme.colors.orangeActive,
  },
  countdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  countdownLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countdownIcon: {
    marginRight: 6,
  },
  countdownLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.orangeActiveDark,
  },
  countdownValue: {
    fontSize: 16,
    fontWeight: '900',
    color: theme.colors.orangeActive,
  },
  countdownTrack: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.surfaceOrange,
    overflow: 'hidden',
    marginBottom: 6,
  },
  countdownBar: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: theme.colors.orangeActive,
  },
  countdownHint: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontWeight: '700',
  },

  /* Brain Rest Card */
  brainRestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfacePurple,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1.5,
    borderColor: theme.colors.surfacePurpleBorder,
    borderBottomWidth: 4,
    borderBottomColor: theme.colors.purpleActive,
    marginBottom: 14,
  },
  brainRestIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: theme.colors.surfacePurpleBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: theme.colors.surfacePurpleBorder,
    borderBottomWidth: 3,
    borderBottomColor: theme.colors.purpleActive,
  },
  brainRestContentCol: {
    flex: 1,
  },
  brainRestTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: theme.colors.purpleActive,
    marginBottom: 2,
  },
  brainRestSub: {
    fontSize: 12,
    color: theme.colors.purpleActiveDark,
    fontWeight: '700',
  },
  brainRestBadge: {
    backgroundColor: theme.colors.surfacePurpleBorder,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  brainRestBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: theme.colors.purpleActiveDark,
  },

  /* Chunky Action Button */
  chunkyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    borderBottomWidth: 4.5,
    marginBottom: 8,
  },
  chunkyBtnIcon: {
    marginRight: 8,
  },
  chunkyActionBtnText: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.2,
  },

  /* 5. Clean Chunky Done Button */
  footerContainer: {
    paddingHorizontal: 18,
    paddingTop: 8,
  },

  /* Parents' Honors Diploma Modal */
  certModalBackdrop: {
    flex: 1,
    backgroundColor: theme.colors.modalOverlayDark,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  certCardContainer: {
    width: '100%',
    backgroundColor: theme.colors.surfaceGold,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1.5,
    borderColor: theme.colors.surfaceGoldBorder,
    borderBottomWidth: 5,
    borderBottomColor: theme.colors.goldActive,
    shadowColor: theme.colors.headingDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  certInnerBorder: {
    borderWidth: 1,
    borderColor: theme.colors.surfaceGoldBorder,
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  certSeal: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.surfaceGold,
    borderWidth: 2,
    borderColor: theme.colors.goldActive,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  certInstitutionTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: theme.colors.goldActive,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  certDiplomaHeadline: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.headingDark,
    letterSpacing: -0.2,
  },
  certDivider: {
    width: 52,
    height: 2.5,
    backgroundColor: theme.colors.goldActive,
    marginVertical: 10,
    borderRadius: 1.5,
  },
  certGrantText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  certStudentName: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.goldActiveDark,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  certBodyText: {
    fontSize: 12,
    color: theme.colors.headingDark,
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 14,
    fontWeight: '700',
  },
  certStatsBadgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    width: '100%',
  },
  certStatPill: {
    flex: 1,
    backgroundColor: theme.colors.surfaceGold,
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.surfaceGoldBorder,
  },
  certStatPillNumber: {
    fontSize: 15,
    fontWeight: '900',
    color: theme.colors.goldActiveDark,
  },
  certStatPillLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.goldActive,
    letterSpacing: 0.5,
  },
  certSignRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceGoldBorder,
  },
  certSignCol: {
    alignItems: 'center',
  },
  certSignTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: theme.colors.headingDark,
  },
  certSignRole: {
    fontSize: 9,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  certStampCircle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: theme.colors.goldActive,
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: theme.colors.surfaceGold,
  },
  certStampText: {
    fontSize: 9,
    fontWeight: '900',
    color: theme.colors.goldActive,
    letterSpacing: 0.5,
  },
  certCloseBtn: {
    marginTop: 14,
    backgroundColor: theme.colors.headingDark,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  certCloseBtnText: {
    color: theme.colors.background,
    fontSize: 14,
    fontWeight: '900',
  },
});
