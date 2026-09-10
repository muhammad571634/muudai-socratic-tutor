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

export interface LanguageOption {
  id: string;
  name: string;
  flag: string;
  isAvailable?: boolean;
}

export interface LanguageSelectionScreenProps {
  onBack: () => void;
  onContinue: (selectedLanguage: string) => void;
}

const AVAILABLE_LANGUAGES: LanguageOption[] = [
  { id: 'en', name: 'English', flag: '🇺🇸', isAvailable: true },
  { id: 'uz', name: 'O‘zbekcha', flag: '🇺🇿', isAvailable: true },
  { id: 'ru', name: 'Русский', flag: '🇷🇺', isAvailable: true },
  { id: 'zh', name: 'Mandarin', flag: '🇨🇳', isAvailable: false },
  { id: 'es', name: 'Spanish', flag: '🇪🇸', isAvailable: false },
];

/**
 * Onboarding Step 2: Language Selection Screen
 * 100% matched to Duolingo onboarding flow.
 */
export const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({
  onBack,
  onContinue,
}) => {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [nativeLanguage] = useState<LanguageOption>({
    id: 'id',
    name: 'Indonesia',
    flag: '🇮🇩',
    isAvailable: true,
  });
  const insets = useSafeAreaInsets();

  const handleSelect = (lang: LanguageOption) => {
    if (lang.isAvailable === false) return;
    HapticFeedback.light();
    setSelectedLanguage(lang.id);
  };

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
              {t('onboarding.languageSelection.question', 'What language do you want to use for MuudAI?')}
            </Text>
          </View>
        </View>

        {/* Section 1: Native Language */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('onboarding.languageSelection.nativeLanguageTitle', 'Your Native Language')}
          </Text>

          <View style={styles.nativeCard}>
            <View style={styles.languageInfo}>
              <Text style={styles.flagEmoji}>{nativeLanguage.flag}</Text>
              <Text style={styles.languageName}>{nativeLanguage.name}</Text>
            </View>
            <Pressable
              onPress={() => HapticFeedback.light()}
              hitSlop={8}
            >
              <Text style={styles.changeText}>
                {t('onboarding.languageSelection.change', 'Change')}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Section 2: App Language */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('onboarding.languageSelection.appLanguageTitle', 'App Language')}
          </Text>

          <View style={styles.languageList}>
            {AVAILABLE_LANGUAGES.map((lang) => {
              const isSelected = selectedLanguage === lang.id;
              const isAvailable = lang.isAvailable !== false;
              return (
                <Pressable
                  key={lang.id}
                  disabled={!isAvailable}
                  onPress={() => handleSelect(lang)}
                  style={[
                    styles.languageCard,
                    isSelected ? styles.languageCardSelected : styles.languageCardDefault,
                    !isAvailable && styles.comingSoonCard,
                  ]}
                >
                  <View style={styles.languageInfo}>
                    <Text style={styles.flagEmoji}>{lang.flag}</Text>
                    <Text
                      style={[
                        styles.languageName,
                        isSelected && styles.languageNameSelected,
                        !isAvailable && styles.comingSoonText,
                      ]}
                    >
                      {lang.name}
                    </Text>
                  </View>

                  {!isAvailable && (
                    <View style={styles.comingSoonBadge}>
                      <Text style={styles.comingSoonBadgeText}>
                        {t('onboarding.comingSoon', 'Coming soon')}
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Continue Button */}
      <View style={styles.footer}>
        <DuoButton
          title={t('onboarding.languageSelection.continue', 'Continue')}
          type="primary"
          onPress={() => onContinue(selectedLanguage)}
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
    width: '20%',
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
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 12,
  },
  nativeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.colors.physicsIndigo,
    backgroundColor: '#FFFFFF',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  flagEmoji: {
    fontSize: 26,
  },
  languageName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
  },
  languageNameSelected: {
    color: theme.colors.physicsIndigo,
  },
  changeText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.physicsIndigo,
  },
  languageList: {
    gap: 12,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
  },
  languageCardDefault: {
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  languageCardSelected: {
    borderColor: theme.colors.physicsIndigo,
    backgroundColor: '#F5F3FF',
  },
  comingSoonCard: {
    opacity: 0.55,
  },
  comingSoonText: {
    color: '#94A3B8',
  },
  comingSoonBadge: {
    backgroundColor: theme.colors.badgeLockedBg,
    borderColor: theme.colors.badgeLockedBorder,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  comingSoonBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.badgeLockedText,
    letterSpacing: 0.3,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
  },
});
