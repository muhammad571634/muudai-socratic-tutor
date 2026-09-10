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
import {
  ArrowLeft,
  GoogleLogo,
  FacebookLogo,
  TiktokLogo,
  AppleLogo,
  Television,
  Users,
  YoutubeLogo,
} from 'phosphor-react-native';
import { AiMascotAvatar } from './AiMascotAvatar';
import { DuoButton } from './DuoButton';
import { theme } from '../../core/theme';
import { HapticFeedback } from '../../core/haptics';

export interface ReferralOption {
  id: string;
  titleKey: string;
  renderIcon: () => React.ReactNode;
}

export interface ReferralSourceScreenProps {
  onBack: () => void;
  onContinue: (selectedSource: string) => void;
}

const REFERRAL_OPTIONS: ReferralOption[] = [
  {
    id: 'google',
    titleKey: 'onboarding.referralSelection.google',
    renderIcon: () => (
      <View style={[styles.iconBadge, { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' }]}>
        <GoogleLogo size={24} color="#EA4335" weight="bold" />
      </View>
    ),
  },
  {
    id: 'facebook',
    titleKey: 'onboarding.referralSelection.facebook',
    renderIcon: () => (
      <View style={[styles.iconBadge, { backgroundColor: '#1877F2' }]}>
        <FacebookLogo size={22} color="#FFFFFF" weight="fill" />
      </View>
    ),
  },
  {
    id: 'tiktok',
    titleKey: 'onboarding.referralSelection.tiktok',
    renderIcon: () => (
      <View style={[styles.iconBadge, { backgroundColor: '#000000' }]}>
        <TiktokLogo size={22} color="#FFFFFF" weight="fill" />
      </View>
    ),
  },
  {
    id: 'app_store',
    titleKey: 'onboarding.referralSelection.appStore',
    renderIcon: () => (
      <View style={[styles.iconBadge, { backgroundColor: '#007AFF' }]}>
        <AppleLogo size={22} color="#FFFFFF" weight="fill" />
      </View>
    ),
  },
  {
    id: 'tv',
    titleKey: 'onboarding.referralSelection.television',
    renderIcon: () => (
      <View style={[styles.iconBadge, { backgroundColor: '#7952FC' }]}>
        <Television size={22} color="#FFFFFF" weight="bold" />
      </View>
    ),
  },
  {
    id: 'friends',
    titleKey: 'onboarding.referralSelection.friends',
    renderIcon: () => (
      <View style={[styles.iconBadge, { backgroundColor: '#FF9600' }]}>
        <Users size={22} color="#FFFFFF" weight="fill" />
      </View>
    ),
  },
  {
    id: 'youtube',
    titleKey: 'onboarding.referralSelection.youtube',
    renderIcon: () => (
      <View style={[styles.iconBadge, { backgroundColor: '#FF0000' }]}>
        <YoutubeLogo size={22} color="#FFFFFF" weight="fill" />
      </View>
    ),
  },
];

/**
 * Onboarding Step 4: How did you know about MuudAI?
 * 100% Duolingo design system with brand badges and ~60% progress.
 */
export const ReferralSourceScreen: React.FC<ReferralSourceScreenProps> = ({
  onBack,
  onContinue,
}) => {
  const { t } = useTranslation();
  const [selectedSource, setSelectedSource] = useState<string>('tiktok');

  const handleSelect = (sourceId: string) => {
    HapticFeedback.light();
    setSelectedSource(sourceId);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navigation & Progress Bar (~60%) */}
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
              {t('onboarding.referralSelection.question', 'How did you know about MuudAI?')}
            </Text>
          </View>
        </View>

        {/* Options List */}
        <View style={styles.optionsList}>
          {REFERRAL_OPTIONS.map((item) => {
            const isSelected = selectedSource === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => handleSelect(item.id)}
                style={[
                  styles.optionCard,
                  isSelected ? styles.optionCardSelected : styles.optionCardDefault,
                ]}
              >
                {item.renderIcon()}
                <Text
                  style={[
                    styles.optionName,
                    isSelected && styles.optionNameSelected,
                  ]}
                >
                  {t(item.titleKey)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky Bottom Continue Button */}
      <View style={styles.footer}>
        <DuoButton
          title={t('onboarding.referralSelection.continue', 'Continue')}
          type="primary"
          onPress={() => onContinue(selectedSource)}
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
    width: '60%',
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
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  optionNameSelected: {
    color: theme.colors.physicsIndigo,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'android' ? 36 : 24,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
  },
});
