import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Sparkle,
  Trophy,
  Calculator,
  Atom,
  Flask,
  Lightning,
  Lightbulb,
  CheckCircle,
  Camera,
  ArrowRight,
} from 'phosphor-react-native';
import { theme } from '../../core/theme';
import { AGE_GROUP_CONFIGS, AgeGroup, MistakeItem } from '../../domain/entities/MistakeReview';
import { useMistakeStore } from '../state/useMistakeStore';
import { BentoSpringCard } from './BentoSpringCard';

export interface ReviewMistakesViewProps {
  onBack: () => void;
  onPracticeMistake: (mistake: MistakeItem) => void;
}

export const ReviewMistakesView: React.FC<ReviewMistakesViewProps> = ({
  onBack,
  onPracticeMistake,
}) => {
  const {
    ageGroup,
    setAgeGroup,
    getActiveMistakes,
    solveMistake,
  } = useMistakeStore();

  const activeList = getActiveMistakes();
  const ageConfigs = Object.values(AGE_GROUP_CONFIGS);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Navigation */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={onBack}
          >
            <ArrowLeft size={16} color={theme.colors.textDark} weight="bold" style={styles.backIcon} />
            <Text style={styles.backButtonText}>Home</Text>
          </TouchableOpacity>

          <View style={styles.badgeGroup}>
            <View style={styles.rewardSummaryBadge}>
              <Sparkle size={13} color={theme.colors.starGold} weight="fill" style={styles.badgeIcon} />
              <Text style={styles.rewardSummaryText}>
                {activeList.length * 30} XP Available
              </Text>
            </View>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.overline}>ADAPTIVE MISTAKE VAULT</Text>
          <Text style={styles.heroTitle}>Review & Master</Text>
          <Text style={styles.heroSubtitle}>
            Tailored specifically to your grade curriculum. Practice with Socratic AI hints and earn mastery XP.
          </Text>
        </View>

        {/* Yosh Toifasini Tanlash (Age Group Selector) */}
        <View style={styles.ageSelectorContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.ageScroll}>
            {ageConfigs.map((cfg) => {
              const isActive = ageGroup === cfg.id;
              return (
                <TouchableOpacity
                  key={cfg.id}
                  style={[
                    styles.ageTab,
                    isActive ? styles.ageTabActive : null,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setAgeGroup(cfg.id)}
                >
                  <Text style={[styles.ageLabel, isActive ? styles.ageLabelActive : null]}>
                    {cfg.label}
                  </Text>
                  <Text style={[styles.ageRange, isActive ? styles.ageRangeActive : null]}>
                    {cfg.ageRange}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Agar barcha xatolar yechilgan bo'lsa (All Solved Celebration) */}
        {activeList.length === 0 ? (
          <View style={styles.allClearCard}>
            <View style={styles.trophyCircle}>
              <Trophy size={36} color={theme.colors.starGold} weight="fill" />
            </View>
            <Text style={styles.allClearTitle}>All Mistakes Cleared!</Text>
            <Text style={styles.allClearSubtitle}>
              You have mastered every tricky problem in this grade category. Great job!
            </Text>
            <TouchableOpacity
              style={styles.continueButton}
              activeOpacity={0.85}
              onPress={onBack}
            >
              <Text style={styles.continueButtonText}>Return to Missions</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Real Xatolar Ro'yxati */
          <View style={styles.cardsList}>
            {activeList.map((item) => {
              const subjectColor =
                item.subject === 'math'
                  ? theme.colors.mathBlue
                  : item.subject === 'physics'
                  ? theme.colors.physicsPurple
                  : theme.colors.chemistryOrange;

              return (
                <View key={item.id} style={styles.mistakeCard}>
                  {/* Card Header */}
                  <View style={styles.cardHeaderRow}>
                    <View style={[styles.subjectChip, { backgroundColor: `${subjectColor}15` }]}>
                      {item.subject === 'math' ? (
                        <Calculator size={14} color={subjectColor} weight="bold" style={styles.chipIcon} />
                      ) : item.subject === 'physics' ? (
                        <Atom size={14} color={subjectColor} weight="bold" style={styles.chipIcon} />
                      ) : (
                        <Flask size={14} color={subjectColor} weight="bold" style={styles.chipIcon} />
                      )}
                      <Text style={[styles.subjectChipText, { color: subjectColor }]}>
                        {item.subject.toUpperCase()}
                      </Text>
                    </View>

                    <View style={styles.timestampBadge}>
                      <Text style={styles.timestampText}>{item.createdAt}</Text>
                    </View>

                    <View style={styles.xpRewardPill}>
                      <Lightning size={12} color={theme.colors.mathBlue} weight="fill" />
                      <Text style={styles.xpRewardText}>+{item.xpReward} XP</Text>
                    </View>
                  </View>

                  {/* Topic & Problem Snippet */}
                  <Text style={styles.topicTitle}>{item.topicTitle}</Text>
                  <View style={styles.snippetContainer}>
                    <Text style={styles.snippetText}>{item.questionSnippet}</Text>
                  </View>

                  {/* Socratic Hint Box */}
                  <View style={styles.hintBox}>
                    <Lightbulb size={16} color="#D97706" weight="bold" style={styles.bulbIcon} />
                    <Text style={styles.hintText}>{item.hintSummary}</Text>
                  </View>

                  {/* Action Buttons Row */}
                  <View style={styles.actionsRow}>
                    {/* Tezkor Yechish va XP olish (Test uchun) */}
                    <TouchableOpacity
                      style={styles.quickSolveButton}
                      activeOpacity={0.8}
                      onPress={() => solveMistake(item.id)}
                    >
                      <CheckCircle size={16} color="#34C759" weight="bold" style={styles.checkIcon} />
                      <Text style={styles.quickSolveText}>I Solved It!</Text>
                    </TouchableOpacity>

                    {/* AI Bilan Kamerada O'rganish */}
                    <BentoSpringCard
                      style={[styles.practiceButton, { backgroundColor: subjectColor }]}
                      onPress={() => onPracticeMistake(item)}
                    >
                      <Camera size={16} color="#FFFFFF" weight="bold" style={styles.buttonCamera} />
                      <Text style={styles.practiceButtonText}>AI Guide</Text>
                      <ArrowRight size={14} color="#FFFFFF" weight="bold" />
                    </BentoSpringCard>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radii.pill,
    borderWidth: 1.5,
    borderColor: theme.colors.borderLight,
  },
  backIcon: {
    marginRight: 4,
  },
  backButtonText: {
    color: theme.colors.textDark,
    ...theme.typography.subhead,
    fontWeight: '800',
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardSummaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E7',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.radii.pill,
    borderWidth: 1.2,
    borderColor: '#FFE29A',
  },
  badgeIcon: {
    marginRight: 4,
  },
  rewardSummaryText: {
    color: '#B45309',
    fontSize: 12,
    fontWeight: '800',
  },
  heroSection: {
    marginBottom: 16,
  },
  overline: {
    ...theme.typography.overline,
    color: theme.colors.streakOrange,
    marginBottom: 4,
  },
  heroTitle: {
    ...theme.typography.largeTitle,
    fontSize: 28,
    color: theme.colors.textDark,
    marginBottom: 4,
  },
  heroSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    lineHeight: 20,
    fontSize: 14,
  },
  ageSelectorContainer: {
    marginBottom: 18,
  },
  ageScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  ageTab: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: theme.colors.borderLight,
    alignItems: 'center',
  },
  ageTabActive: {
    backgroundColor: theme.colors.textDark,
    borderColor: theme.colors.textDark,
  },
  ageLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.textDark,
  },
  ageLabelActive: {
    color: '#FFFFFF',
  },
  ageRange: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.textMuted,
    marginTop: 1,
  },
  ageRangeActive: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  allClearCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#EFECE2',
    marginTop: 12,
  },
  trophyCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFF8E7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  allClearTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: theme.colors.textDark,
    marginBottom: 6,
  },
  allClearSubtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
    paddingHorizontal: 16,
  },
  continueButton: {
    backgroundColor: theme.colors.textDark,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: theme.radii.pill,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  cardsList: {
    gap: 14,
  },
  mistakeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: theme.colors.borderLight,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radii.pill,
    marginRight: 6,
  },
  chipIcon: {
    marginRight: 4,
  },
  subjectChipText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  timestampBadge: {
    flex: 1,
  },
  timestampText: {
    color: '#A0A7B5',
    fontSize: 11,
    fontWeight: '600',
  },
  xpRewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5F3FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radii.pill,
    gap: 3,
  },
  xpRewardText: {
    color: theme.colors.mathBlue,
    fontSize: 11,
    fontWeight: '800',
  },
  topicTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.colors.textDark,
    marginBottom: 4,
  },
  snippetContainer: {
    backgroundColor: '#F8F6F0',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.darkPill,
  },
  snippetText: {
    fontSize: 12.5,
    color: '#2A303C',
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  hintBox: {
    flexDirection: 'row',
    backgroundColor: '#FFFDF5',
    borderWidth: 1,
    borderColor: '#FEF3C7',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  bulbIcon: {
    marginRight: 6,
    marginTop: 1,
  },
  hintText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    color: '#78350F',
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickSolveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3FBF5',
    borderWidth: 1.5,
    borderColor: '#34C759',
    borderRadius: 14,
    paddingVertical: 11,
  },
  checkIcon: {
    marginRight: 4,
  },
  quickSolveText: {
    color: '#22863A',
    fontSize: 13,
    fontWeight: '800',
  },
  practiceButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonCamera: {
    marginRight: 4,
  },
  practiceButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    marginRight: 4,
  },
});
