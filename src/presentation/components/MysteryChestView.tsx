import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Gift,
  Sparkle,
  CheckCircle,
  LockSimple,
  Lightning,
  Lightbulb,
  Camera,
  Trophy,
} from 'phosphor-react-native';
import { theme } from '../../core/theme';
import { SubjectType } from '../../domain/entities/Gamification';
import { MysteryRiddle } from '../../domain/entities/MysteryChest';
import { useMysteryChestStore } from '../state/useMysteryChestStore';
import { FloatingElement } from './FloatingElement';
import { BentoSpringCard } from './BentoSpringCard';

export interface MysteryChestViewProps {
  onBack: () => void;
  onPracticeWithCamera: (riddle: MysteryRiddle) => void;
}

export const MysteryChestView: React.FC<MysteryChestViewProps> = ({
  onBack,
  onPracticeWithCamera,
}) => {
  const { isUnlockedToday, getRiddle, unlockChest, resetChest } = useMysteryChestStore();
  const [showClue, setShowClue] = useState(false);

  const riddle = getRiddle();

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Navigation Header */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={onBack}
          >
            <ArrowLeft size={16} color={theme.colors.textDark} weight="bold" style={styles.backIcon} />
            <Text style={styles.backButtonText}>Home</Text>
          </TouchableOpacity>

          <View style={styles.rewardSummaryBadge}>
            <Gift size={14} color="#D97706" weight="fill" style={styles.badgeIcon} />
            <Text style={styles.rewardSummaryText}>+100 XP REWARD</Text>
          </View>
        </View>

        {/* Markaziy Oltin Sandiq Animatsiyasi */}
        <View style={styles.chestStage}>
          <FloatingElement distance={6} duration={1400} rotateDeg={4}>
            <View
              style={[
                styles.chestCircle,
                isUnlockedToday ? styles.chestCircleUnlocked : null,
              ]}
            >
              {isUnlockedToday ? (
                <Sparkle size={56} color="#FFFFFF" weight="fill" />
              ) : (
                <Gift size={56} color="#FF9F1C" weight="fill" />
              )}
            </View>
          </FloatingElement>

          <View style={styles.chestStatusBadge}>
            {isUnlockedToday ? (
              <CheckCircle size={14} color="#34C759" weight="fill" style={styles.statusIcon} />
            ) : (
              <LockSimple size={14} color="#D97706" weight="bold" style={styles.statusIcon} />
            )}
            <Text
              style={[
                styles.chestStatusText,
                isUnlockedToday ? { color: '#34C759' } : null,
              ]}
            >
              {isUnlockedToday ? 'CHEST UNLOCKED!' : 'DAILY VAULT LOCKED'}
            </Text>
          </View>
        </View>

        {/* Agar Sandiq Ochilgan Bo'lsa: G'alaba Tabrigi */}
        {isUnlockedToday ? (
          <View style={styles.celebrationCard}>
            <View style={{ marginBottom: 10 }}>
              <Trophy size={48} color="#FFB800" weight="fill" />
            </View>
            <Text style={styles.celebrationTitle}>Tremendous Job!</Text>
            <Text style={styles.celebrationText}>
              You cracked today's secret puzzle and earned{' '}
              <Text style={styles.boldText}>+100 XP</Text> and{' '}
              <Text style={styles.energyBonusText}>+2 Energy</Text>!
            </Text>
            <View style={styles.rewardsRow}>
              <View style={styles.lootPill}>
                <Text style={styles.lootText}>{riddle.badgeReward}</Text>
              </View>
              <View style={styles.energyLootPill}>
                <Lightning size={13} color="#FF9500" weight="fill" style={{ marginRight: 4 }} />
                <Text style={styles.energyLootText}>+2 Recharged</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.returnButton}
              activeOpacity={0.85}
              onPress={onBack}
            >
              <Text style={styles.returnButtonText}>Return to Discovery Hub</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resetLink}
              onPress={resetChest}
            >
              <Text style={styles.resetLinkText}>(Test: Relock Chest)</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Agar Qulflangan Bo'lsa: Qiziqarli Jumboq Qartochkasi */
          <View style={styles.riddleCard}>
            <View style={styles.riddleOverlineRow}>
              <Text style={styles.riddleOverline}>DAILY SECRET RIDDLE</Text>
              <View style={styles.subjectMiniBadge}>
                <Text style={styles.subjectMiniText}>{riddle.subject.toUpperCase()}</Text>
              </View>
            </View>

            <Text style={styles.riddleTitle}>{riddle.title}</Text>
            <Text style={styles.riddleStory}>{riddle.mysteryStory}</Text>

            {/* Matematik Formulaning Sirli Qutisi */}
            <View style={styles.puzzleBox}>
              <Text style={styles.puzzleText}>{riddle.puzzleSnippet}</Text>
            </View>

            {/* Sokratik Maslahatni Ochish (Peek Clue) */}
            {showClue ? (
              <View style={styles.clueBox}>
                <Lightbulb size={16} color="#D97706" weight="fill" style={styles.clueIcon} />
                <Text style={styles.clueText}>{riddle.clueText}</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.peekClueButton}
                activeOpacity={0.7}
                onPress={() => setShowClue(true)}
              >
                <Lightbulb size={15} color="#D97706" weight="bold" style={styles.clueIcon} />
                <Text style={styles.peekClueText}>Peek a Socratic Clue</Text>
              </TouchableOpacity>
            )}

            {/* Harakat Tugmalari */}
            <View style={styles.actionsContainer}>
              {/* Kamerada AI bilan birga yechish */}
              <BentoSpringCard
                style={styles.cameraAIButton}
                onPress={() => onPracticeWithCamera(riddle)}
              >
                <Camera size={18} color="#FFFFFF" weight="bold" style={styles.actionButtonIcon} />
                <Text style={styles.cameraAIButtonText}>Crack via Camera & Voice AI</Text>
              </BentoSpringCard>

              {/* Tezkor Yechdim deb Sandiqni ochish */}
              <TouchableOpacity
                style={styles.instantSolveButton}
                activeOpacity={0.8}
                onPress={unlockChest}
              >
                <Sparkle size={15} color="#22863A" weight="fill" style={styles.actionButtonIcon} />
                <Text style={styles.instantSolveText}>I Solved It! Open Chest (+100 XP)</Text>
              </TouchableOpacity>
            </View>
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
  rewardSummaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7E6',
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
  chestStage: {
    alignItems: 'center',
    marginVertical: 18,
  },
  chestCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: '#FFF5E4',
    borderWidth: 3,
    borderColor: '#FFD180',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF9F1C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  chestCircleUnlocked: {
    backgroundColor: '#34C759',
    borderColor: '#A7F3D0',
    shadowColor: '#34C759',
  },
  chestStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radii.pill,
    marginTop: 14,
    borderWidth: 1.5,
    borderColor: theme.colors.borderLight,
  },
  statusIcon: {
    marginRight: 5,
  },
  chestStatusText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#D97706',
    letterSpacing: 0.6,
  },
  riddleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: theme.colors.borderLight,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  riddleOverlineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  riddleOverline: {
    ...theme.typography.overline,
    color: '#FF9F1C',
  },
  subjectMiniBadge: {
    backgroundColor: '#E5F3FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  subjectMiniText: {
    color: theme.colors.mathBlue,
    fontSize: 10,
    fontWeight: '800',
  },
  riddleTitle: {
    ...theme.typography.title2,
    fontSize: 20,
    color: theme.colors.textDark,
    marginBottom: 8,
  },
  riddleStory: {
    ...theme.typography.body,
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.textMuted,
    marginBottom: 14,
  },
  puzzleBox: {
    backgroundColor: '#F8F6F0',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 14,
    borderLeftWidth: 3.5,
    borderLeftColor: '#FF9F1C',
  },
  puzzleText: {
    fontSize: 14,
    color: '#2A303C',
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  peekClueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFDF5',
    borderWidth: 1,
    borderColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.radii.pill,
    marginBottom: 18,
  },
  clueIcon: {
    marginRight: 5,
  },
  peekClueText: {
    color: '#B45309',
    fontSize: 12,
    fontWeight: '700',
  },
  clueBox: {
    flexDirection: 'row',
    backgroundColor: '#FFFDF5',
    borderWidth: 1,
    borderColor: '#FEF3C7',
    padding: 12,
    borderRadius: 14,
    marginBottom: 18,
    alignItems: 'flex-start',
  },
  clueText: {
    flex: 1,
    color: '#78350F',
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: '500',
  },
  actionsContainer: {
    gap: 10,
  },
  cameraAIButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF7B39',
    paddingVertical: 14,
    borderRadius: 18,
    shadowColor: '#FF7B39',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  actionButtonIcon: {
    marginRight: 6,
  },
  cameraAIButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  instantSolveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3FBF5',
    borderWidth: 1.5,
    borderColor: '#34C759',
    paddingVertical: 12,
    borderRadius: 16,
  },
  instantSolveText: {
    color: '#22863A',
    fontSize: 13,
    fontWeight: '800',
  },
  celebrationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#EFECE2',
  },
  celebrationEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  celebrationTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.textDark,
    marginBottom: 6,
  },
  celebrationText: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 14,
  },
  boldText: {
    color: '#007AFF',
    fontWeight: '900',
  },
  energyBonusText: {
    color: '#FF9500',
    fontWeight: '900',
  },
  rewardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  lootPill: {
    backgroundColor: '#FFF7E6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radii.pill,
    borderWidth: 1.2,
    borderColor: '#FFE29A',
  },
  lootText: {
    color: '#B45309',
    fontSize: 13,
    fontWeight: '800',
  },
  energyLootPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radii.pill,
    borderWidth: 1.2,
    borderColor: '#FDE68A',
  },
  energyLootText: {
    color: '#B45309',
    fontSize: 13,
    fontWeight: '800',
  },
  returnButton: {
    backgroundColor: theme.colors.textDark,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: theme.radii.pill,
  },
  returnButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  resetLink: {
    marginTop: 12,
  },
  resetLinkText: {
    color: '#A0A7B5',
    fontSize: 11,
    fontWeight: '600',
  },
});
