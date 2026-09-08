// O'ylanish: Ushbu komponent MuudAI Home/Dashboard asosiy sahifasidir.
// Apple Minimalist va Duolingo 3D uslubida (4-17 yoshli bolalar uchun) 0 kognitiv yuklama,
// yirik 900 qalinlikdagi tipografiya, 3D taktil soya (borderBottomWidth: 4-6),
// Phosphor Icons, jonli salomlashuv, 3 ta statistik kartalar, dinamik 5 ta fan/yo'l kartalari,
// interaktiv 7 kunlik streak kapsulalari, Duolingo chunky 3D tugmasi va suzuvchi kamera dokini o'z ichiga oladi.

import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Flame,
  Lightning,
  Clock,
  CheckCircle,
  Calculator,
  Atom,
  Flask,
  Gift,
  LockSimple,
  Check,
  Sparkle,
  CaretRight,
} from 'phosphor-react-native';
import { theme } from '../../core/theme';
import { SubjectType } from '../../domain/entities/Gamification';
import { useHomeDashboard } from '../hooks/useHomeDashboard';
import { BentoSpringCard } from './BentoSpringCard';
import { LiveGreetingHeader } from './LiveGreetingHeader';
import { FloatingCameraDock } from './FloatingCameraDock';
import { GamificationDetailModal, GamificationModalTab } from './GamificationDetailModal';
import { PulsingFlame } from './PulsingFlame';
import { HeroScanBanner } from './HeroScanBanner';
import { HapticFeedback } from '../../core/haptics';

export interface BentoSubjectGridProps {
  onStartSubject: (subject: SubjectType) => void;
  onOpenMysteryChest: () => void;
  onOpenLab?: () => void;
  onOpenScanner?: () => void;
}

export const BentoSubjectGrid: React.FC<BentoSubjectGridProps> = ({
  onStartSubject,
  onOpenMysteryChest,
  onOpenLab,
  onOpenScanner,
}) => {
  const insets = useSafeAreaInsets();
  const {
    studentName,
    studentEmail,
    xp,
    currentRank,
    rankProgress,
    streakDays,
    isStreakClaimedToday,
    weeklyStreak,
    solvedProblemsCount,
    activeDaysCount,
    studyHours,
    energy,
    maxEnergy,
    hasChestAccess,
    isChestUnlockedToday,
    hasLabAccess,
    activeSubject,
    claimDailyStreak,
    selectSubject,
  } = useHomeDashboard('Alex');

  const [isGamificationModalOpen, setIsGamificationModalOpen] = useState<boolean>(false);
  const [gamificationTab, setGamificationTab] = useState<GamificationModalTab>('rank');

  const handleOpenGamification = (tab: GamificationModalTab) => {
    HapticFeedback.light();
    setGamificationTab(tab);
    setIsGamificationModalOpen(true);
  };

  const handleSelectSubjectCard = (subject: SubjectType) => {
    HapticFeedback.medium();
    selectSubject(subject);
    onStartSubject(subject);
  };

  const handleLaunchScanner = () => {
    HapticFeedback.medium();
    if (onOpenScanner) {
      onOpenScanner();
    } else {
      handleSelectSubjectCard(activeSubject.id);
    }
  };

  const handlePressStreakButton = () => {
    HapticFeedback.success();
    if (!isStreakClaimedToday) {
      claimDailyStreak();
    } else {
      handleSelectSubjectCard(activeSubject.id);
    }
  };

  const isMathActive = activeSubject.id === 'math';
  const isPhysicsActive = activeSubject.id === 'physics';
  const isChemistryActive = activeSubject.id === 'chemistry';

  return (
    <View style={styles.screenWrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: Math.max(120, insets.bottom + 95) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Live Dynamic Greeting & Header (Status Pills, Time-Greeting, Avatar, AI Mascot) */}
        <LiveGreetingHeader
          studentName={studentName}
          studentEmail={studentEmail}
          currentRank={currentRank}
          currentXp={xp}
          solvedProblems={solvedProblemsCount}
          activeDays={activeDaysCount}
          rankProgress={rankProgress}
          streakDays={streakDays}
          energy={energy}
          maxEnergy={maxEnergy}
          onOpenGamificationTab={handleOpenGamification}
        />

        {/* 2. "Progress since joining class" Chunky 3D Stat Cards */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionHeader}>Progress since joining class</Text>
          <View style={styles.statsGrid}>
            {/* Card 1: XP Earned */}
            <BentoSpringCard
              style={[styles.statBox, styles.statBoxXp]}
              onPress={() => handleOpenGamification('rank')}
            >
              <View style={[styles.statIconBadge, { backgroundColor: theme.colors.statXpBg }]}>
                <Lightning size={22} color={theme.colors.statXpIcon} weight="fill" />
              </View>
              <View style={styles.statMeta}>
                <Text style={styles.statNumber}>{xp}</Text>
                <Text style={styles.statLabel}>XP Earned</Text>
              </View>
            </BentoSpringCard>

            {/* Card 2: Study Time */}
            <BentoSpringCard
              style={[styles.statBox, styles.statBoxTime]}
              onPress={() => handleOpenGamification('streak')}
            >
              <View style={[styles.statIconBadge, { backgroundColor: theme.colors.statTimeBg }]}>
                <Clock size={22} color={theme.colors.statTimeIcon} weight="bold" />
              </View>
              <View style={styles.statMeta}>
                <Text style={styles.statNumber}>{studyHours} hrs</Text>
                <Text style={styles.statLabel}>Study Time</Text>
              </View>
            </BentoSpringCard>

            {/* Card 3: Solved Challenges */}
            <BentoSpringCard
              style={[styles.statBox, styles.statBoxSolved]}
              onPress={() => handleOpenGamification('rank')}
            >
              <View style={[styles.statIconBadge, { backgroundColor: theme.colors.statSolvedBg }]}>
                <CheckCircle size={22} color={theme.colors.statSolvedIcon} weight="fill" />
              </View>
              <View style={styles.statMeta}>
                <Text style={styles.statNumber}>{solvedProblemsCount}</Text>
                <Text style={styles.statLabel}>Problems</Text>
              </View>
            </BentoSpringCard>
          </View>
        </View>

        {/* 2.5 Hero Socratic AI Scanner Banner */}
        <HeroScanBanner onPress={handleLaunchScanner} />

        {/* 3. Assignments & Learning Journey (5 Standalone 3D Cards with Distinct Identities) */}
        <View style={styles.assignmentsSection}>
          <Text style={styles.sectionHeader}>Today's assignments</Text>

          <View style={styles.assignmentsList}>
            {/* 1. Mathematics Card (Green theme, Calculator, Progress Indicator) */}
            <BentoSpringCard
              style={[styles.subjectCard, styles.mathCard]}
              onPress={() => handleSelectSubjectCard('math')}
            >
              <View style={[styles.subjectIconBox, { backgroundColor: theme.colors.mathGreenLight, borderColor: theme.colors.mathGreenBorder }]}>
                <Calculator size={24} color={theme.colors.mathGreen} weight="bold" />
              </View>
              <View style={styles.subjectInfo}>
                <View style={styles.subjectTitleRow}>
                  <Text style={styles.subjectTitle}>Mathematics</Text>
                  <View style={[styles.statusBadge, { backgroundColor: isMathActive ? theme.colors.mathGreenBadge : theme.colors.surfaceMuted }]}>
                    <Text style={[styles.statusBadgeText, { color: isMathActive ? theme.colors.mathGreenShadow : theme.colors.textSecondary }]}>
                      {isMathActive ? 'Active' : 'Resume'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.subjectSubtitle}>Fractions, equations & spatial logic</Text>
                {/* Progress bar indicator */}
                <View style={styles.progressRow}>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressBar, { width: '65%', backgroundColor: theme.colors.mathGreen }]} />
                  </View>
                  <Text style={styles.progressText}>2 of 3 done</Text>
                </View>
              </View>
              <CaretRight size={18} color={theme.colors.mathGreen} weight="bold" style={styles.cardArrow} />
            </BentoSpringCard>

            {/* 2. Physics Card (Indigo/Purple theme, Atom, Interactive Badge) */}
            <BentoSpringCard
              style={[styles.subjectCard, styles.physicsCard]}
              onPress={() => handleSelectSubjectCard('physics')}
            >
              <View style={[styles.subjectIconBox, { backgroundColor: theme.colors.physicsIndigoLight, borderColor: theme.colors.physicsIndigoBorder }]}>
                <Atom size={24} color={theme.colors.physicsIndigo} weight="bold" />
              </View>
              <View style={styles.subjectInfo}>
                <View style={styles.subjectTitleRow}>
                  <Text style={styles.subjectTitle}>Physics: Forces & Motion</Text>
                  <View style={[styles.statusBadge, { backgroundColor: isPhysicsActive ? theme.colors.physicsIndigoBadge : theme.colors.surfaceOrange }]}>
                    <Text style={[styles.statusBadgeText, { color: isPhysicsActive ? theme.colors.physicsIndigoShadow : theme.colors.orangeActive }]}>
                      {isPhysicsActive ? 'Active' : 'In Progress'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.subjectSubtitle}>Gravity, momentum & kinetic energy</Text>
                {/* Interactive challenge badge */}
                <View style={styles.interactiveBadgeRow}>
                  <View style={styles.interactiveBadge}>
                    <Text style={styles.interactiveBadgeText}>Challenge 1/2</Text>
                  </View>
                </View>
              </View>
              <CaretRight size={18} color={theme.colors.physicsIndigo} weight="bold" style={styles.cardArrow} />
            </BentoSpringCard>

            {/* 3. Chemistry Card (Sky/Cyan theme, Flask, Molecular Reactions) */}
            <BentoSpringCard
              style={[styles.subjectCard, styles.chemistryCard]}
              onPress={() => handleSelectSubjectCard('chemistry')}
            >
              <View style={[styles.subjectIconBox, { backgroundColor: theme.colors.chemistryCyanLight, borderColor: theme.colors.chemistryCyanBorder }]}>
                <Flask size={24} color={theme.colors.chemistryCyan} weight="bold" />
              </View>
              <View style={styles.subjectInfo}>
                <View style={styles.subjectTitleRow}>
                  <Text style={styles.subjectTitle}>Chemistry: Molecular Reactions</Text>
                  <View style={[styles.statusBadge, { backgroundColor: isChemistryActive ? theme.colors.chemistryCyanBadge : theme.colors.surfaceBlue }]}>
                    <Text style={[styles.statusBadgeText, { color: isChemistryActive ? theme.colors.chemistryCyanShadow : theme.colors.chemistryCyan }]}>
                      {isChemistryActive ? 'Active' : 'Ready'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.subjectSubtitle}>Synthesize water and explore atomic bonds</Text>
                <View style={styles.progressRow}>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressBar, { width: '30%', backgroundColor: theme.colors.chemistryCyan }]} />
                  </View>
                  <Text style={styles.progressText}>Ready to start</Text>
                </View>
              </View>
              <CaretRight size={18} color={theme.colors.chemistryCyan} weight="bold" style={styles.cardArrow} />
            </BentoSpringCard>

            {/* 4. Daily Mystery Chest (Yellow/Amber theme, Gift/Sparkle/LockSimple, Level 2 Criteria) */}
            <BentoSpringCard
              style={[styles.subjectCard, styles.chestCard]}
              onPress={() => {
                if (hasChestAccess) {
                  onOpenMysteryChest();
                } else {
                  handleOpenGamification('rank');
                }
              }}
            >
              <View style={[styles.subjectIconBox, { backgroundColor: theme.colors.chestAmberLight, borderColor: theme.colors.chestAmberBorder }]}>
                {hasChestAccess ? (
                  isChestUnlockedToday ? (
                    <Sparkle size={24} color={theme.colors.chestAmber} weight="fill" />
                  ) : (
                    <Gift size={24} color={theme.colors.chestAmber} weight="fill" />
                  )
                ) : (
                  <LockSimple size={24} color={theme.colors.textMuted} weight="bold" />
                )}
              </View>
              <View style={styles.subjectInfo}>
                <View style={styles.subjectTitleRow}>
                  <Text style={styles.subjectTitle}>
                    {hasChestAccess ? 'Daily Mystery Chest' : 'Mystery Chest (Level 2)'}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      !hasChestAccess
                        ? { backgroundColor: theme.colors.badgeLockedBg }
                        : isChestUnlockedToday
                        ? { backgroundColor: theme.colors.mathGreenBadge }
                        : { backgroundColor: theme.colors.chestAmberBadge },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        !hasChestAccess
                          ? { color: theme.colors.badgeLockedText }
                          : isChestUnlockedToday
                          ? { color: theme.colors.mathGreenShadow }
                          : { color: theme.colors.chestAmber },
                      ]}
                    >
                      {!hasChestAccess ? 'Locked (Lv 2)' : isChestUnlockedToday ? 'Claimed' : '+100 XP'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.subjectSubtitle}>
                  {hasChestAccess
                    ? isChestUnlockedToday
                      ? 'Loot claimed today (+100 XP added to vault)'
                      : 'Solve daily riddle & unlock hidden bonus rewards'
                    : 'Reach Level 2 (Explorer) to unlock secret chests'}
                </Text>
              </View>
              <CaretRight size={18} color={theme.colors.chestAmber} weight="bold" style={styles.cardArrow} />
            </BentoSpringCard>

            {/* 5. Virtual Science Lab (Teal/Emerald theme, Flask, Level 3 Criteria) */}
            {onOpenLab ? (
              <BentoSpringCard
                style={[styles.subjectCard, styles.labCard]}
                onPress={() => {
                  if (hasLabAccess) {
                    onOpenLab();
                  } else {
                    handleOpenGamification('rank');
                  }
                }}
              >
                <View
                  style={[
                    styles.subjectIconBox,
                    {
                      backgroundColor: hasLabAccess ? theme.colors.labTealLight : theme.colors.badgeLockedBg,
                      borderColor: hasLabAccess ? theme.colors.labTealBorder : theme.colors.badgeLockedBorder,
                    },
                  ]}
                >
                  {hasLabAccess ? (
                    <Flask size={24} color={theme.colors.labTeal} weight="fill" />
                  ) : (
                    <LockSimple size={24} color={theme.colors.textMuted} weight="bold" />
                  )}
                </View>
                <View style={styles.subjectInfo}>
                  <View style={styles.subjectTitleRow}>
                    <Text style={styles.subjectTitle}>
                      {hasLabAccess ? 'Virtual Science Lab' : 'Science Lab (Level 3)'}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        hasLabAccess ? { backgroundColor: theme.colors.labTealBadge } : { backgroundColor: theme.colors.badgeLockedBg },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          hasLabAccess ? { color: theme.colors.labTealShadow } : { color: theme.colors.badgeLockedText },
                        ]}
                      >
                        {hasLabAccess ? 'Explore' : 'Locked (Lv 3)'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.subjectSubtitle}>
                    {hasLabAccess
                      ? 'Interactive physics & chemistry lab simulator'
                      : 'Reach Level 3 (Young Scientist) to unlock lab'}
                  </Text>
                </View>
                <CaretRight size={18} color={theme.colors.labTeal} weight="bold" style={styles.cardArrow} />
              </BentoSpringCard>
            ) : null}
          </View>
        </View>

        {/* 5. Daily Streak Hero Card (Duolingo 3D Block + 7-Day Interactive Capsule Row + Chunky 3D Button) */}
        <View style={styles.streakSection}>
          {/* Dynamic Motivational Speech Bubble */}
          <View style={styles.speechBubble}>
            <Text style={styles.speechBubbleText}>
              {isStreakClaimedToday
                ? `Incredible job! ${studentName}'s ${streakDays}-day streak is secured today. Keep learning!`
                : `Keep it up! ${studentName} is on a ${streakDays}-day streak. Practice today to keep your flame burning!`}
            </Text>
          </View>

          {/* Hero Flame & Giant Streak Number */}
          <View style={styles.streakHero}>
            <View style={styles.streakHeroIconCircle}>
              <PulsingFlame size={48} />
            </View>
            <Text style={styles.streakHugeNumber}>{streakDays}</Text>
            <Text style={styles.streakHeroLabel}>day streak</Text>
          </View>

          {/* Interactive Weekly 7-Day Capsule Row */}
          <View style={styles.weekCard}>
            <View style={styles.weekDaysRow}>
              {weeklyStreak.map((day, idx) => (
                <Pressable
                  key={idx}
                  style={styles.dayCol}
                  onPress={() => handleOpenGamification('streak')}
                  accessibilityRole="button"
                  accessibilityLabel={`${day.fullDayName}: ${day.completed ? 'Completed' : day.isToday ? 'Active goal' : 'Upcoming'}`}
                >
                  <Text
                    style={[
                      styles.dayName,
                      day.isToday ? styles.dayNameToday : null,
                    ]}
                  >
                    {day.dayName}
                  </Text>
                  <View
                    style={[
                      styles.dayCircle,
                      day.completed ? styles.dayCircleDone : null,
                      day.isToday && !day.completed ? styles.dayCircleToday : null,
                    ]}
                  >
                    {day.completed ? (
                      <Check size={16} color="#FFFFFF" weight="bold" />
                    ) : day.isToday ? (
                      <Flame size={14} color={theme.colors.streakOrange} weight="fill" />
                    ) : null}
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Duolingo Chunky 3D Action Button */}
          <BentoSpringCard
            style={styles.duoChunkyButton}
            onPress={handlePressStreakButton}
          >
            <View style={styles.duoChunkyButtonContent}>
              <Flame size={22} color="#FFFFFF" weight="fill" />
              <Text style={styles.duoChunkyButtonText}>
                {isStreakClaimedToday ? 'PRACTICE TODAY (+15 XP)' : 'CLAIM DAILY STREAK (+20 XP)'}
              </Text>
            </View>
          </BentoSpringCard>
        </View>
      </ScrollView>

      {/* 6. Apple-Minimalist Floating Camera Dock */}
      <FloatingCameraDock
        onOpenScanner={handleLaunchScanner}
        onOpenChest={() => {
          if (hasChestAccess) {
            onOpenMysteryChest();
          } else {
            handleOpenGamification('rank');
          }
        }}
        onOpenLab={() => {
          if (hasLabAccess && onOpenLab) {
            onOpenLab();
          } else {
            handleOpenGamification('rank');
          }
        }}
        hasChestNotification={hasChestAccess && !isChestUnlockedToday}
      />

      {/* Gamification Detail Modal (Level, Streak, Energy) */}
      <GamificationDetailModal
        visible={isGamificationModalOpen}
        initialTab={gamificationTab}
        onClose={() => setIsGamificationModalOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  statsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '900',
    color: theme.colors.headingDark,
    letterSpacing: -0.4,
    lineHeight: 26,
    marginBottom: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: theme.colors.cardBg,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  statBoxXp: {
    borderColor: theme.colors.statXpBorder,
    borderBottomColor: theme.colors.statXpShadow,
  },
  statBoxTime: {
    borderColor: theme.colors.statTimeBorder,
    borderBottomColor: theme.colors.statTimeShadow,
  },
  statBoxSolved: {
    borderColor: theme.colors.statSolvedBorder,
    borderBottomColor: theme.colors.statSolvedShadow,
  },
  statIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statMeta: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: theme.colors.headingDark,
    letterSpacing: -0.4,
    lineHeight: 24,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  assignmentsSection: {
    marginBottom: 28,
  },
  assignmentsList: {
    gap: 12,
  },
  subjectCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBg,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  mathCard: {
    borderColor: theme.colors.mathGreenBorder,
    borderBottomColor: theme.colors.mathGreen,
  },
  physicsCard: {
    borderColor: theme.colors.physicsIndigoBorder,
    borderBottomColor: theme.colors.physicsIndigo,
  },
  chemistryCard: {
    borderColor: theme.colors.chemistryCyanBorder,
    borderBottomColor: theme.colors.chemistryCyan,
  },
  chestCard: {
    borderColor: theme.colors.chestAmberBorder,
    borderBottomColor: theme.colors.chestAmber,
  },
  labCard: {
    borderColor: theme.colors.labTealBorder,
    borderBottomColor: theme.colors.labTeal,
  },
  subjectIconBox: {
    width: 46,
    height: 46,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    marginRight: 14,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
    paddingRight: 6,
  },
  subjectTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: theme.colors.headingDark,
    letterSpacing: -0.3,
    lineHeight: 22,
    flex: 1,
  },
  subjectSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    lineHeight: 18,
    letterSpacing: -0.1,
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radii.pill,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.progressTrackBg,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    letterSpacing: -0.1,
  },
  interactiveBadgeRow: {
    marginTop: 2,
  },
  interactiveBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.physicsIndigoLight,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  interactiveBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.physicsIndigoShadow,
    letterSpacing: 0.2,
  },
  cardArrow: {
    marginLeft: 6,
  },
  streakSection: {
    alignItems: 'center',
    paddingTop: 8,
    marginBottom: 20,
  },
  speechBubble: {
    backgroundColor: theme.colors.cardBg,
    borderWidth: 2,
    borderBottomWidth: 3,
    borderColor: theme.colors.borderLight,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
    maxWidth: '92%',
  },
  speechBubbleText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.headingDark,
    textAlign: 'center',
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  streakHero: {
    alignItems: 'center',
    marginBottom: 16,
  },
  streakHeroIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.streakHeroBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: theme.colors.streakHeroBorder,
    borderBottomWidth: 4,
    borderBottomColor: theme.colors.streakHeroShadow,
  },
  streakHugeNumber: {
    fontSize: 76,
    fontWeight: '900',
    color: theme.colors.streakOrange,
    lineHeight: 76,
    letterSpacing: -2,
  },
  streakHeroLabel: {
    fontSize: 20,
    fontWeight: '900',
    color: theme.colors.streakOrange,
    letterSpacing: -0.3,
    marginTop: -2,
    textTransform: 'uppercase',
  },
  weekCard: {
    width: '100%',
    backgroundColor: theme.colors.cardBg,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: theme.colors.borderLight,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayCol: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  dayName: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.textSecondary,
    letterSpacing: 0.2,
  },
  dayNameToday: {
    color: theme.colors.streakOrange,
    fontWeight: '900',
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.streakDayPendingBg,
    borderWidth: 1,
    borderColor: theme.colors.streakDayPendingBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCircleDone: {
    backgroundColor: theme.colors.streakDayDoneBg,
    borderColor: theme.colors.streakDayDoneBg,
  },
  dayCircleToday: {
    borderWidth: 2,
    borderColor: theme.colors.streakDayTodayBorder,
    backgroundColor: theme.colors.streakOrangeLight,
  },
  duoChunkyButton: {
    width: '100%',
    backgroundColor: theme.colors.duoButtonBg,
    borderWidth: 2,
    borderBottomWidth: 6,
    borderColor: theme.colors.duoButtonBorder,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  duoChunkyButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  duoChunkyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
