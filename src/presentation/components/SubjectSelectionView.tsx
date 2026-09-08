import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'phosphor-react-native';
import { SUBJECT_ITEMS, SubjectItem } from '../../domain/entities/Gamification';
import { SubjectCard } from './SubjectCard';
import { useGamificationStore } from '../state/useGamificationStore';
import { theme } from '../../core/theme';

export interface SubjectSelectionViewProps {
  onClose: () => void;
}

export const SubjectSelectionView: React.FC<SubjectSelectionViewProps> = ({ onClose }) => {
  const { selectedSubject, setSubject } = useGamificationStore();

  const handleSelectSubject = (item: SubjectItem) => {
    setSubject(item.id);
    onClose();
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Apple Navigation Bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.overlineText}>CURRICULUM</Text>
            <Text style={styles.pageTitle}>Subjects</Text>
            <Text style={styles.pageSubtitle}>Select your focus area for today</Text>
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            activeOpacity={0.8}
            onPress={onClose}
          >
            <X size={18} color={theme.colors.textDark} weight="bold" />
          </TouchableOpacity>
        </View>

        {/* 3 Core Subjects Cards */}
        <View style={styles.cardsContainer}>
          {SUBJECT_ITEMS.map((item) => (
            <SubjectCard
              key={item.id}
              subject={item}
              isSelected={selectedSubject === item.id}
              onSelect={handleSelectSubject}
            />
          ))}
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 26,
    marginTop: 8,
  },
  overlineText: {
    ...theme.typography.overline,
    color: theme.colors.textMuted,
    marginBottom: 2,
  },
  pageTitle: {
    ...theme.typography.largeTitle,
    color: theme.colors.textDark,
  },
  pageSubtitle: {
    ...theme.typography.subhead,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.borderLight,
  },
  cardsContainer: {
    marginTop: 4,
  },
});
