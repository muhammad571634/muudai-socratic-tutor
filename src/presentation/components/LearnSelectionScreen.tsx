import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Calculator,
  Atom,
  Flask,
  Dna,
  Cpu,
} from 'phosphor-react-native';
import { AiMascotAvatar } from './AiMascotAvatar';
import { DuoButton } from './DuoButton';
import { theme } from '../../core/theme';
import { HapticFeedback } from '../../core/haptics';

export interface SubjectOption {
  id: string;
  titleKey: string;
  descKey: string;
  badgeBg: string;
  badgeBorder: string;
  renderIcon: () => React.ReactNode;
  isAvailable?: boolean;
}

const SUBJECT_OPTIONS: SubjectOption[] = [
  {
    id: 'math',
    titleKey: 'onboarding.learnSelection.math',
    descKey: 'onboarding.learnSelection.mathDesc',
    badgeBg: '#1CB0F6',
    badgeBorder: '#1899D6',
    renderIcon: () => <Calculator size={26} color="#FFFFFF" weight="fill" />,
    isAvailable: true,
  },
  {
    id: 'physics',
    titleKey: 'onboarding.learnSelection.physics',
    descKey: 'onboarding.learnSelection.physicsDesc',
    badgeBg: '#7952FC',
    badgeBorder: '#5B3AC7',
    renderIcon: () => <Atom size={26} color="#FFFFFF" weight="bold" />,
    isAvailable: false,
  },
  {
    id: 'chemistry',
    titleKey: 'onboarding.learnSelection.chemistry',
    descKey: 'onboarding.learnSelection.chemistryDesc',
    badgeBg: '#FF9600',
    badgeBorder: '#CC7800',
    renderIcon: () => <Flask size={26} color="#FFFFFF" weight="fill" />,
    isAvailable: false,
  },
  {
    id: 'biology',
    titleKey: 'onboarding.learnSelection.biology',
    descKey: 'onboarding.learnSelection.biologyDesc',
    badgeBg: '#58CC02',
    badgeBorder: '#46A302',
    renderIcon: () => <Dna size={26} color="#FFFFFF" weight="bold" />,
    isAvailable: false,
  },
  {
    id: 'cs',
    titleKey: 'onboarding.learnSelection.cs',
    descKey: 'onboarding.learnSelection.csDesc',
    badgeBg: '#00CD9C',
    badgeBorder: '#00A77E',
    renderIcon: () => <Cpu size={26} color="#FFFFFF" weight="fill" />,
    isAvailable: false,
  },
];

/**
 * Onboarding Step 3: School Subject Selection Screen (STEM)
 * 100% Duolingo design system with 3D vibrant icon badges.
 */
export const LearnSelectionScreen: React.FC<LearnSelectionScreenProps> = ({
  onBack,
  onContinue,
}) => {
  const { t } = useTranslation();
  const [selectedSubject, setSelectedSubject] = useState<string>('math');
  const insets = useSafeAreaInsets();

  const handleSelect = (item: SubjectOption) => {
    if (item.isAvailable === false) return;
    HapticFeedback.light();
    setSelectedSubject(item.id);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 24) }]}>
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
            const isAvailable = item.isAvailable !== false;
            return (
              <Pressable
                key={item.id}
                disabled={!isAvailable}
                onPress={() => handleSelect(item)}
                style={[
                  styles.optionCard,
                  isSelected ? styles.optionCardSelected : styles.optionCardDefault,
                  !isAvailable && styles.comingSoonCard,
                ]}
              >
                {/* 3D Duolingo Icon Badge */}
                <View
                  style={[
                    styles.iconBadge,
                    {
                      backgroundColor: item.badgeBg,
                      borderBottomColor: item.badgeBorder,
                    },
                    !isAvailable && styles.iconBadgeDisabled,
                  ]}
                >
                  {item.renderIcon()}
                </View>

                {/* Subject Details */}
                <View style={styles.textColumn}>
                  <View style={styles.subjectHeaderRow}>
                    <Text
                      style={[
                        styles.optionName,
                        isSelected && styles.optionNameSelected,
                        !isAvailable && styles.optionNameDisabled,
                      ]}
                    >
                      {t(item.titleKey)}
                    </Text>
                    {!isAvailable && (
                      <View style={styles.comingSoonBadge}>
                        <Text style={styles.comingSoonBadgeText}>
                          {t('onboarding.comingSoon', 'Coming soon')}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.optionDesc, !isAvailable && styles.optionDescDisabled]}>
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
    </View>
  );
};

export interface LearnSelectionScreenProps {
  onBack: () => void;
  onContinue: (selectedSubject: string) => void;
}

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
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
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
  comingSoonCard: {
    opacity: 0.55,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderBottomWidth: 3.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBadgeDisabled: {
    opacity: 0.7,
  },
  textColumn: {
    flex: 1,
  },
  subjectHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  optionName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
  },
  optionNameSelected: {
    color: theme.colors.physicsIndigo,
  },
  optionNameDisabled: {
    color: '#64748B',
  },
  optionDesc: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  optionDescDisabled: {
    color: '#94A3B8',
  },
  comingSoonBadge: {
    backgroundColor: theme.colors.badgeLockedBg,
    borderColor: theme.colors.badgeLockedBorder,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  comingSoonBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.badgeLockedText,
    letterSpacing: 0.3,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'android' ? 36 : 24,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
  },
});
