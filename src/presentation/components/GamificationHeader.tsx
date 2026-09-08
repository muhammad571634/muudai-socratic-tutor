import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Flame, Lightning, Trophy, Books, Calculator, Atom, Flask } from 'phosphor-react-native';
import { theme } from '../../core/theme';
import { SUBJECT_ITEMS, SubjectItem } from '../../domain/entities/Gamification';
import { useGamificationStore } from '../state/useGamificationStore';

export interface GamificationHeaderProps {
  onOpenSubjects: () => void;
}

export const GamificationHeader: React.FC<GamificationHeaderProps> = ({ onOpenSubjects }) => {
  const {
    xp,
    streakDays,
    energy,
    maxEnergy,
    selectedSubject,
    currentRank,
    setSubject,
  } = useGamificationStore();

  return (
    <View style={styles.container}>
      {/* 1-Qator: Yutuqlar va Statistika (Apple Minimalist) */}
      <View style={styles.statsRow}>
        <View style={styles.badgePill}>
          <Flame size={14} color="#FF9500" weight="fill" style={{ marginRight: 4 }} />
          <Text style={styles.badgeText}>{streakDays} Kun</Text>
        </View>

        <View style={styles.rankBadge}>
          <Trophy size={14} color={theme.colors.mathBlue} weight="bold" style={{ marginRight: 4 }} />
          <Text style={styles.rankText}>
            {currentRank.title} <Text style={styles.rankLevel}>(Lv {currentRank.level})</Text>
          </Text>
        </View>

        <View style={styles.badgePill}>
          <Lightning size={14} color="#FF9500" weight="fill" style={{ marginRight: 4 }} />
          <Text style={styles.badgeText}>{energy}/{maxEnergy}</Text>
        </View>

        <View style={[styles.badgePill, styles.xpPill]}>
          <Text style={styles.xpText}>{xp} XP</Text>
        </View>
      </View>

      {/* 2-Qator: Faqat 3 ta Fan va To'liq Ro'yxat Tugmasi */}
      <View style={styles.subjectsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subjectsScroll}
        >
          {/* To'liq Katta Fanlar Ro'yxatini ochish tugmasi */}
          <TouchableOpacity
            style={styles.menuButton}
            activeOpacity={0.8}
            onPress={onOpenSubjects}
          >
            <Books size={14} color="#3DA9FC" weight="bold" style={{ marginRight: 4 }} />
            <Text style={styles.menuButtonText}>Fanlar Ro'yxati</Text>
          </TouchableOpacity>

          {/* Faqat 3 ta Fan */}
          {SUBJECT_ITEMS.map((subj: SubjectItem) => {
            const isSelected = selectedSubject === subj.id;
            return (
              <TouchableOpacity
                key={subj.id}
                style={[
                  styles.subjectChip,
                  isSelected
                    ? { backgroundColor: subj.accentColor, borderColor: subj.accentColor }
                    : null,
                ]}
                activeOpacity={0.7}
                onPress={() => setSubject(subj.id)}
              >
                {subj.id === 'math' ? (
                  <Calculator size={14} color={isSelected ? '#FFFFFF' : '#8E9BAE'} weight="bold" style={{ marginRight: 6 }} />
                ) : subj.id === 'physics' ? (
                  <Atom size={14} color={isSelected ? '#FFFFFF' : '#8E9BAE'} weight="bold" style={{ marginRight: 6 }} />
                ) : (
                  <Flask size={14} color={isSelected ? '#FFFFFF' : '#8E9BAE'} weight="bold" style={{ marginRight: 6 }} />
                )}
                <Text
                  style={[
                    styles.subjectTitle,
                    isSelected ? styles.subjectTitleActive : null,
                  ]}
                >
                  {subj.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badgePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  rankBadge: {
    backgroundColor: 'rgba(255, 107, 0, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 0, 0.4)',
  },
  rankText: {
    color: theme.colors.mathBlue,
    fontSize: 12,
    fontWeight: '700',
  },
  rankLevel: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
  },
  xpPill: {
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
    borderColor: 'rgba(52, 199, 89, 0.4)',
  },
  xpText: {
    color: '#34C759',
    fontSize: 12,
    fontWeight: '800',
  },
  subjectsContainer: {
    marginTop: 2,
  },
  subjectsScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuButton: {
    backgroundColor: '#1E2536',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radii.pill,
    borderWidth: 1.5,
    borderColor: '#3DA9FC',
    marginRight: 4,
  },
  menuButtonText: {
    color: '#3DA9FC',
    fontWeight: '800',
    fontSize: 12,
  },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radii.pill,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  subjectEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  subjectTitle: {
    color: '#8E9BAE',
    fontSize: 13,
    fontWeight: '600',
  },
  subjectTitleActive: {
    color: '#000000',
    fontWeight: '800',
  },
});
