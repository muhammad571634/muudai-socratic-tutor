import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'phosphor-react-native';
import { AiMascotAvatar } from './AiMascotAvatar';
import { DuoButton } from './DuoButton';
import { theme } from '../../core/theme';
import { HapticFeedback } from '../../core/haptics';

export interface DailyStudyTargetScreenProps {
  onBack: () => void;
  onContinue: (target: number) => void;
}

interface TargetOption {
  id: string;
  minutes: number;
  label: string;
}

const TARGET_OPTIONS: TargetOption[] = [
  { id: 'relax', minutes: 5, label: 'Relax' },
  { id: 'normal', minutes: 10, label: 'Normal' },
  { id: 'serious', minutes: 15, label: 'Serious' },
  { id: 'great', minutes: 30, label: 'Great' },
  { id: 'awesome', minutes: 60, label: 'Awesome' },
];

export const DailyStudyTargetScreen: React.FC<DailyStudyTargetScreenProps> = ({
  onBack,
  onContinue,
}) => {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<string>('normal');
  const insets = useSafeAreaInsets();

  const handleSelect = (option: TargetOption) => {
    HapticFeedback.light();
    setSelectedId(option.id);
  };

  const selectedOption = TARGET_OPTIONS.find(o => o.id === selectedId) || TARGET_OPTIONS[1];

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 24) }]}>
      {/* Top Navigation & Progress Bar */}
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
              {t('onboarding.dailyTarget.question', 'What is your daily study target?')}
            </Text>
          </View>
        </View>

        {/* Options List */}
        <View style={styles.list}>
          {TARGET_OPTIONS.map((option) => {
            const isSelected = selectedId === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => handleSelect(option)}
                style={[
                  styles.card,
                  isSelected ? styles.cardSelected : styles.cardDefault,
                ]}
              >
                <Text
                  style={[
                    styles.minutesText,
                    isSelected && styles.textSelected,
                  ]}
                >
                  {option.minutes} min / day
                </Text>

                <Text
                  style={[
                    styles.labelText,
                    isSelected && styles.textSelected,
                  ]}
                >
                  {t(`onboarding.dailyTarget.${option.id}`, option.label)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Continue Button */}
      <View style={styles.footer}>
        <DuoButton
          title={t('scanner.interaction.continue', 'Continue')}
          type="primary"
          onPress={() => {
            HapticFeedback.success();
            onContinue(selectedOption.minutes);
          }}
        />
      </View>
    </View>
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
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 16,
  },
  backButton: {
    padding: 4,
  },
  progressTrack: {
    flex: 1,
    height: 12,
    backgroundColor: '#E5E5E5',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    width: '75%', // Mocking the progress step
    height: '100%',
    backgroundColor: theme.colors.physicsIndigo,
    borderRadius: 6,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  mascotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    gap: 16,
  },
  speechBubble: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    position: 'relative',
  },
  bubbleTail: {
    position: 'absolute',
    left: -8,
    top: '50%',
    marginTop: -8,
    width: 14,
    height: 14,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#E5E5E5',
    transform: [{ rotate: '45deg' }],
  },
  bubbleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 24,
  },
  list: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 2,
  },
  cardDefault: {
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  cardSelected: {
    borderColor: theme.colors.physicsIndigo,
    backgroundColor: '#F5F3FF', // same as LanguageSelectionScreen
  },
  minutesText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
  },
  labelText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#94A3B8',
  },
  textSelected: {
    color: theme.colors.physicsIndigo,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
  },
});
