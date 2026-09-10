// O'ylanish: Ushbu komponent Apple Minimalist va Duolingo o'ynoqi uslubini birlashtiradi.
// Yuqorida yutuqlar pills (Rank, Streak, Energy Battery), pastida esa vaqtga mos jonli salomlashuv,
// interaktiv o'quvchi avatari va teginishga mos animatsiyali AI Repetitor maskoti aks etadi.

import React, { useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Pressable } from 'react-native';
import {
  Sun,
  SunHorizon,
  MoonStars,
  Moon,
  Lightning,
  Student,
  CaretRight,
} from 'phosphor-react-native';
import { theme } from '../../core/theme';
import { getLiveGreeting } from '../../domain/entities/Greeting';
import { LearnerRank, RankProgress } from '../../domain/entities/Gamification';
import { HapticFeedback } from '../../core/haptics';
import { AiMascotAvatar } from './AiMascotAvatar';
import { ModernLevelBadge } from './ModernLevelBadge';
import { PulsingFlame } from './PulsingFlame';
import { GamificationModalTab } from './GamificationDetailModal';

export interface LiveGreetingHeaderProps {
  studentName?: string;
  studentEmail?: string;
  currentRank: LearnerRank;
  currentXp: number;
  solvedProblems?: number;
  activeDays?: number;
  rankProgress?: RankProgress;
  streakDays: number;
  energy: number;
  maxEnergy: number;
  onOpenGamificationTab: (tab: GamificationModalTab) => void;
}

export const LiveGreetingHeader: React.FC<LiveGreetingHeaderProps> = ({
  studentName = '',
  studentEmail = 'alex@muudai.com',
  currentRank,
  currentXp,
  solvedProblems = 0,
  activeDays = 0,
  rankProgress,
  streakDays,
  energy,
  maxEnergy,
  onOpenGamificationTab,
}) => {
  const greeting = useMemo(() => getLiveGreeting(studentName), [studentName]);

  const getTimeTheme = () => {
    switch (greeting.timeSlot) {
      case 'morning':
        return {
          icon: <Sun size={14} color={theme.colors.morningGold} weight="fill" style={styles.timeIcon} />,
          color: theme.colors.morningGold,
          bg: theme.colors.morningGoldLight,
          border: theme.colors.morningGoldBorder,
        };
      case 'afternoon':
        return {
          icon: <SunHorizon size={14} color={theme.colors.afternoonBlue} weight="fill" style={styles.timeIcon} />,
          color: theme.colors.afternoonBlue,
          bg: theme.colors.afternoonBlueLight,
          border: theme.colors.afternoonBlueBorder,
        };
      case 'evening':
        return {
          icon: <MoonStars size={14} color={theme.colors.eveningPurple} weight="fill" style={styles.timeIcon} />,
          color: theme.colors.eveningPurple,
          bg: theme.colors.eveningPurpleLight,
          border: theme.colors.eveningPurpleBorder,
        };
      case 'night':
      default:
        return {
          icon: <Moon size={14} color={theme.colors.nightEmerald} weight="fill" style={styles.timeIcon} />,
          color: theme.colors.nightEmerald,
          bg: theme.colors.nightEmeraldLight,
          border: theme.colors.nightEmeraldBorder,
        };
    }
  };

  const timeTheme = getTimeTheme();

  const getEnergyColor = () => {
    if (energy >= 4) return theme.colors.successGreen;
    if (energy >= 2) return theme.colors.streakOrange;
    return '#FF3B30';
  };

  return (
    <View style={styles.container}>
      {/* 1. Yuqori Navigatsiya & Gamifikatsiya Status Qatori (Rank, Streak, Energy) */}
      <View style={styles.topStatsRow}>
        <ModernLevelBadge
          currentRank={currentRank}
          currentXp={currentXp}
          solvedProblems={solvedProblems}
          activeDays={activeDays}
          rankProgress={rankProgress}
          onPress={() => {
            HapticFeedback.light();
            onOpenGamificationTab('rank');
          }}
        />

        <View style={styles.rightStatsGroup}>
          {/* Streak Status Pill with Pulsing Flame */}
          <TouchableOpacity
            style={styles.pillStat}
            activeOpacity={0.8}
            onPress={() => {
              HapticFeedback.light();
              onOpenGamificationTab('streak');
            }}
            accessibilityRole="button"
            accessibilityLabel={`${streakDays} days streak`}
          >
            <PulsingFlame size={18} />
            <Text style={styles.pillStatText}>{streakDays}D</Text>
          </TouchableOpacity>

          {/* Energy Battery Status Pill */}
          <TouchableOpacity
            style={[styles.pillStat, styles.pillStatEnergy]}
            activeOpacity={0.8}
            onPress={() => {
              HapticFeedback.light();
              onOpenGamificationTab('energy');
            }}
            accessibilityRole="button"
            accessibilityLabel={`Energy ${energy} out of ${maxEnergy}`}
          >
            <Lightning size={18} color={getEnergyColor()} weight="fill" />
            <Text style={[styles.pillStatText, { color: getEnergyColor() }]}>
              {energy}/{maxEnergy}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Jonli Dinamik Salomlashuv va AI Masqot Bloki */}
      <View style={styles.greetingHeroCard}>
        <View style={styles.greetingLeftCol}>
          {/* Vaqt nishoni (Morning / Afternoon / Evening / Night Mission) */}
          <View style={[styles.timeBadge, { backgroundColor: timeTheme.bg, borderColor: timeTheme.border }]}>
            {timeTheme.icon}
            <Text style={[styles.timeBadgeText, { color: timeTheme.color }]}>
              {greeting.timeSlot.toUpperCase()} MISSION
            </Text>
          </View>

          {/* Dinamik Katta Sarlavha */}
          <Text style={styles.headlineText} numberOfLines={1}>
            {greeting.headline}
          </Text>

          {/* Rag'batlantiruvchi Quyi Matn */}
          <Text style={styles.subtitleText} numberOfLines={2}>
            {greeting.subtitle}
          </Text>
        </View>

        {/* O'ngdagi Jonli AI Masqot (MuudAI Buddy) */}
        <View style={styles.mascotWrapper}>
          <AiMascotAvatar
            size={58}
            onPress={() => {
              HapticFeedback.medium();
              onOpenGamificationTab('rank');
            }}
          />
        </View>
      </View>

      {/* 3. O'quvchi Profil Qatori (Interaktiv Taktil Apple Minimalist) */}
      <Pressable
        style={styles.profileRow}
        onPress={() => {
          HapticFeedback.light();
          onOpenGamificationTab('rank');
        }}
        accessibilityRole="button"
        accessibilityLabel={
          studentName
            ? `${studentName}'s learner profile. View ranking and achievements.`
            : 'Learner profile. View ranking and achievements.'
        }
      >
        <View style={styles.avatarCircle}>
          <Student size={26} color="#FFFFFF" weight="bold" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{studentName ? `${studentName} Learner` : 'Learner'}</Text>
          <Text style={styles.profileEmail}>{studentEmail}</Text>
        </View>
        <CaretRight size={18} color={theme.colors.textTertiary} weight="bold" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  topStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rightStatsGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  pillStat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBg,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: theme.colors.borderLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radii.pill,
    gap: 6,
  },
  pillStatEnergy: {
    borderColor: theme.colors.statXpBorder,
    backgroundColor: theme.colors.streakOrangeLight,
  },
  pillStatText: {
    fontSize: 13,
    fontWeight: '900',
    color: theme.colors.headingDark,
    letterSpacing: -0.2,
  },
  greetingHeroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: theme.colors.borderMuted,
    marginBottom: 14,
  },
  greetingLeftCol: {
    flex: 1,
    paddingRight: 10,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: theme.radii.pill,
    borderWidth: 1,
    marginBottom: 6,
  },
  timeIcon: {
    marginRight: 5,
  },
  timeBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  headlineText: {
    fontSize: 24,
    fontWeight: '900',
    color: theme.colors.headingDark,
    letterSpacing: -0.6,
    lineHeight: 28,
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    letterSpacing: -0.1,
    lineHeight: 20,
  },
  mascotWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.physicsIndigo,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: theme.colors.physicsIndigoShadow,
    borderBottomWidth: 3,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.headingDark,
    letterSpacing: -0.3,
  },
  profileEmail: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    marginTop: 2,
    letterSpacing: -0.1,
  },
});
