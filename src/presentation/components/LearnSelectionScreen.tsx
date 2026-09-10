import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'phosphor-react-native';
import { AiMascotAvatar } from './AiMascotAvatar';
import { DuoButton } from './DuoButton';
import { theme } from '../../core/theme';
import { HapticFeedback } from '../../core/haptics';

export interface SubjectOption {
  id: string;
  titleKey: string;
  descKey: string;
  icon: string;
}

export interface LearnSelectionScreenProps {
  onBack: () => void;
  onContinue: (selectedSubject: string) => void;
}

const SUBJECT_OPTIONS: SubjectOption[] = [
  {
    id: 'math',
    titleKey: 'onboarding.learnSelection.math',
    descKey: 'onboarding.learnSelection.mathDesc',
    icon: '📐',
  },
  {
    id: 'physics',
    titleKey: 'onboarding.learnSelection.physics',
    descKey: 'onboarding.learnSelection.physicsDesc',
    icon: '⚡',
  },
  {
    id: 'chemistry',
    titleKey: 'onboarding.learnSelection.chemistry',
    descKey: 'onboarding.learnSelection.chemistryDesc',
    icon: '🧪',
  },
  {
    id: 'biology',
    titleKey: 'onboarding.learnSelection.biology',
    descKey: 'onboarding.learnSelection.biologyDesc',
    icon: '🔬',
  },
  {
    id: 'cs',
    titleKey: 'onboarding.learnSelection.cs',
    descKey: 'onboarding.learnSelection.csDesc',
    icon: '💻',
  },
];

/**
 * Onboarding Step 3: School Subject Selection Screen (STEM)
 * Tailored to MuudAI's Socratic Education Pedagogy.
 */
export const LearnSelectionScreen: React.FC<LearnSelectionScreenProps> = ({
  onBack,
  onContinue,
}) => {
  const { t } = useTranslation();
  const [selectedSubject, setSelectedSubject] = useState<string>('math');

  const handleSelect = (subjectId: string) => {
    HapticFeedback.light();
    setSelectedSubject(subjectId);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navigation & Progress Bar (~40%) */}
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            HapticFeedback.light();
            onBack();
          }}
          style={styles.backButton}
          hitSlop={12}
        >
          <ArrowLeft size={24} color="#1E293B" weight="bold" />
        </Pressable>

        <View style={styles.progressTrack}>
          <View style={styles.progressBar} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mascot & Speech Bubble Row */}
        <View style={styles.mascotRow}>
          <AiMascotAvatar size={80} mood="idle" />

          <View style={styles.speechBubble}>
            <View style={styles.bubbleTail} />
            <Text style={styles.bubbleText}>
              {t('onboarding.learnSelection.question', 'What subject do you want help with?')}
            </Text>
          </View>
        </View>

        {/* Subjects List */}
        <View style={styles.optionsList}>
          {SUBJECT_OPTIONS.map((item) => {
            const isSelected = selectedSubject === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => handleSelect(item.id)}
                style={[
                  styles.optionCard,
                  isSelected ? styles.optionCardSelected : styles.optionCardDefault,
                ]}
              >
                <Text style={styles.iconEmoji}>{item.icon}</Text>
                <View style={styles.textColumn}>
                  <Text
                    style={[
                      styles.optionName,
                      isSelected && styles.optionNameSelected,
                    ]}
                  >
                    {t(item.titleKey)}
                  </Text>
                  <Text style={styles.optionDesc}>
                    {t(item.descKey)}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky Bottom Continue Button */}
      <View style={styles.footer}>
        <DuoButton
          title={t('onboarding.learnSelection.continue', 'Continue')}
          type="primary"
          onPress={() => onContinue(selectedSubject)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 16,
  },
  backButton: {
    padding: 4,
  },
  progressTrack: {
    flex: 1,
    height: 12,
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    width: '40%',
    height: '100%',
    backgroundColor: theme.colors.physicsIndigo,
    borderRadius: 6,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  mascotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    gap: 12,
  },
  speechBubble: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleTail: {
    position: 'absolute',
    left: -8,
    top: '50%',
    marginTop: -8,
    width: 16,
    height: 16,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: '#E5E5E5',
    transform: [{ rotate: '45deg' }],
  },
  bubbleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 22,
  },
  optionsList: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    gap: 16,
  },
  optionCardDefault: {
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  optionCardSelected: {
    borderColor: theme.colors.physicsIndigo,
    backgroundColor: '#F5F3FF',
  },
  iconEmoji: {
    fontSize: 28,
  },
  textColumn: {
    flex: 1,
  },
  optionName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  optionNameSelected: {
    color: theme.colors.physicsIndigo,
  },
  optionDesc: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'android' ? 36 : 24,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
  },
});
