// O'ylanish: Ushbu komponent Duolingo/Apple uslubida joriy level nishonini Phosphor Icons
// (Plant, Compass, Flask, GraduationCap, Trophy) va to'liq hisoblangan rank progressi bilan ko'rsatadi.
import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Plant, Compass, Flask, GraduationCap, Trophy } from 'phosphor-react-native';
import { theme } from '../../core/theme';
import { LearnerRank, RankProgress, calculateRankProgress } from '../../domain/entities/Gamification';
import { HapticFeedback } from '../../core/haptics';
import { useTranslation } from 'react-i18next';

export interface ModernLevelBadgeProps {
  currentRank: LearnerRank;
  currentXp: number;
  solvedProblems?: number;
  activeDays?: number;
  rankProgress?: RankProgress;
  onPress?: () => void;
}

const renderRankIcon = (level: number, color: string) => {
  switch (level) {
    case 1:
      return <Plant size={18} color={color} weight="fill" />;
    case 2:
      return <Compass size={18} color={color} weight="bold" />;
    case 3:
      return <Flask size={18} color={color} weight="fill" />;
    case 4:
      return <GraduationCap size={18} color={color} weight="fill" />;
    default:
      return <Trophy size={18} color={color} weight="fill" />;
  }
};

export const ModernLevelBadge: React.FC<ModernLevelBadgeProps> = ({
  currentRank,
  currentXp,
  solvedProblems = 0,
  activeDays = 0,
  rankProgress: propRankProgress,
  onPress,
}) => {
  const { t } = useTranslation();
  const rankProgress = propRankProgress || calculateRankProgress(currentXp, solvedProblems, activeDays);
  const scale = useSharedValue(1);
  const animatedProgress = useSharedValue(rankProgress.progressRatio);

  useEffect(() => {
    animatedProgress.value = withTiming(rankProgress.progressRatio, { duration: 600 });
  }, [rankProgress.progressRatio, animatedProgress]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${Math.round(animatedProgress.value * 100)}%`,
  }));

  const handlePressIn = () => {
    HapticFeedback.light();
    scale.value = withSpring(0.96, {
      damping: 14,
      stiffness: 350,
      mass: 0.8,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 260,
      mass: 0.8,
    });
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={`Level ${currentRank.level}, ${t(currentRank.titleKey)}, progress ${Math.round(rankProgress.progressRatio * 100)} percent`}
    >
      <Animated.View style={[styles.container, animatedContainerStyle]}>
        {/* Academic Rank Insignia */}
        <View style={styles.avatarContainer}>
          {renderRankIcon(currentRank.level, theme.colors.blueActive)}
        </View>

        {/* Level and Title Column */}
        <View style={styles.textColumn}>
          <Text style={styles.levelOverline}>LEVEL {currentRank.level}</Text>
          <Text style={styles.rankTitle} numberOfLines={1}>
            {t(currentRank.titleKey)}
          </Text>
        </View>

        {/* Minimalist Progress Track */}
        <View style={styles.progressColumn}>
          <Text style={styles.xpText}>
            {currentXp}/{rankProgress.nextLevelXp} XP
          </Text>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressBar, animatedProgressStyle]} />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radii.pill,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: theme.colors.borderLight,
  },
  avatarContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.surfaceBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  textColumn: {
    marginRight: 10,
  },
  levelOverline: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.blueActive,
    letterSpacing: 0.8,
  },
  rankTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.titleDark,
    letterSpacing: -0.2,
  },
  progressColumn: {
    alignItems: 'flex-end',
  },
  xpText: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginBottom: 3,
  },
  progressTrack: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.progressTrackBg,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: theme.colors.blueActive,
  },
});
