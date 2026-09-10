// O'ylanish: Ushbu komponent Duolingo-style Home Dashboard uchun yuqori
// gamifikatsiya panelini (Top Gamification Header Bar) taqdim etadi.
// Unda:
// 1. Chapda bayroqli til tugmasi (🇺🇸 EN, 🇺🇿 UZ, 🇷🇺 RU) va tezkor til tanlash modali
// 2. Olovli streak ko'rsatkichi (🔥 4)
// 3. Olmos/energiya ko'rsatkichi (💎 5/5)
// 4. Yulduzli XP ko'rsatkichi (⭐ 120)
// 5. Toza oq fon va pastki nozik ajratuvchi chiziq (Apple Minimalist HIG)

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { Check, X } from 'phosphor-react-native';
import { theme } from '../../core/theme';
import { HapticFeedback } from '../../core/haptics';
import { useTranslation } from 'react-i18next';
import { AppLocale, SUPPORTED_LOCALES } from '../../domain/entities/Locale';

export interface HomeHeaderBarProps {
  currentLocale: string;
  onSelectLocale: (locale: AppLocale) => void;
  streakDays?: number;
  energy?: number;
  maxEnergy?: number;
  xp?: number;
  onPressStreak?: () => void;
  onPressEnergy?: () => void;
  onPressXp?: () => void;
  isLanguageModalOpen?: boolean;
  onOpenLanguageModal?: () => void;
  onCloseLanguageModal?: () => void;
}

import {
  LanguageOption,
  LANGUAGE_OPTIONS,
  formatHeaderMetrics,
} from './homeDashboardLogic';

export {
  LanguageOption,
  LANGUAGE_OPTIONS,
  formatHeaderMetrics,
};

export interface LanguageSelectionModalProps {
  visible: boolean;
  currentLocale: string;
  onSelectLocale: (locale: AppLocale) => void;
  onClose: () => void;
}

export const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  visible,
  currentLocale,
  onSelectLocale,
  onClose,
}) => {
  const { t } = useTranslation();

  const handleChooseLanguage = (code: AppLocale) => {
    HapticFeedback.selection();
    onSelectLocale(code);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
          {/* Modal Sarlavhasi */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>
                {t('homeDashboard.languages.title', 'Select Language')}
              </Text>
              <Text style={styles.modalSubtitle}>
                {t('homeDashboard.languages.subtitle', 'Choose your preferred language')}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.modalCloseButton}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <X size={20} color="#64748B" weight="bold" />
            </TouchableOpacity>
          </View>

          {/* Til Variantlari Ro'yxati */}
          <View style={styles.langListContainer}>
            {LANGUAGE_OPTIONS.map((item) => {
              const isSelected = item.code === currentLocale;
              return (
                <TouchableOpacity
                  key={item.code}
                  activeOpacity={0.75}
                  onPress={() => handleChooseLanguage(item.code)}
                  style={[
                    styles.langOptionCard,
                    isSelected && styles.langOptionCardSelected,
                  ]}
                >
                  <View style={styles.langOptionLeft}>
                    <Text style={styles.optionFlag}>{item.flag}</Text>
                    <View>
                      <Text
                        style={[
                          styles.optionLabel,
                          isSelected && styles.optionLabelSelected,
                        ]}
                      >
                        {item.label}
                      </Text>
                      <Text style={styles.optionBadgeText}>{item.badge}</Text>
                    </View>
                  </View>

                  {isSelected && (
                    <View style={styles.checkBadge}>
                      <Check size={16} color="#FFFFFF" weight="bold" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export const HomeHeaderBar: React.FC<HomeHeaderBarProps> = ({
  currentLocale,
  onSelectLocale,
  streakDays = 4,
  energy = 5,
  maxEnergy = 5,
  xp = 120,
  onPressStreak,
  onPressEnergy,
  onPressXp,
  isLanguageModalOpen,
  onOpenLanguageModal,
  onCloseLanguageModal,
}) => {
  const { t } = useTranslation();
  const [internalLangModalVisible, setInternalLangModalVisible] = useState<boolean>(false);

  const isModalVisible =
    isLanguageModalOpen !== undefined ? isLanguageModalOpen : internalLangModalVisible;

  const openModal = () => {
    HapticFeedback.light();
    if (onOpenLanguageModal) {
      onOpenLanguageModal();
    } else {
      setInternalLangModalVisible(true);
    }
  };

  const closeModal = () => {
    if (onCloseLanguageModal) {
      onCloseLanguageModal();
    } else {
      setInternalLangModalVisible(false);
    }
  };

  // Joriy til uchun ma'lumot
  const activeLang =
    LANGUAGE_OPTIONS.find((opt) => opt.code === currentLocale) || LANGUAGE_OPTIONS[0];

  return (
    <>
      <View style={styles.headerContainer}>
        {/* 1. Chap: Bayroqli Til Kapsulasi */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={openModal}
          style={styles.langPillButton}
          accessibilityRole="button"
          accessibilityLabel={t('homeDashboard.languages.title', 'Select Language')}
        >
          <Text style={styles.flagEmoji}>{activeLang.flag}</Text>
          <Text style={styles.langCodeText}>{activeLang.badge}</Text>
        </TouchableOpacity>

        {/* 2. Markaz va O'ng: Gamifikatsiya Ko'rsatkichlari */}
        <View style={styles.metricsGroup}>
          {/* Streak Ko'rsatkichi (🔥 4) */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPressStreak}
            style={styles.metricItem}
            accessibilityRole="button"
            accessibilityLabel={`${streakDays} ${t('homeDashboard.streakTooltip', 'Day Streak')}`}
          >
            <Text style={styles.metricEmoji}>🔥</Text>
            <Text style={[styles.metricCount, styles.streakText]}>{streakDays}</Text>
          </TouchableOpacity>

          {/* Energiya / Olmos Ko'rsatkichi (💎 5/5) */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPressEnergy}
            style={styles.metricItem}
            accessibilityRole="button"
            accessibilityLabel={`${energy}/${maxEnergy} ${t('homeDashboard.energyTooltip', 'Energy')}`}
          >
            <Text style={styles.metricEmoji}>💎</Text>
            <Text style={[styles.metricCount, styles.energyText]}>
              {energy}/{maxEnergy}
            </Text>
          </TouchableOpacity>

          {/* XP Yulduz Ko'rsatkichi (⭐ 120) */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPressXp}
            style={styles.metricItem}
            accessibilityRole="button"
            accessibilityLabel={`${xp} ${t('homeDashboard.xpTooltip', 'XP')}`}
          >
            <Text style={styles.metricEmoji}>⭐</Text>
            <Text style={[styles.metricCount, styles.xpText]}>{xp}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Standalone holat uchun til tanlash modali */}
      {isLanguageModalOpen === undefined && (
        <LanguageSelectionModal
          visible={isModalVisible}
          currentLocale={currentLocale}
          onSelectLocale={onSelectLocale}
          onClose={closeModal}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    zIndex: 10,
  },
  langPillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  flagEmoji: {
    fontSize: 16,
  },
  langCodeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
    letterSpacing: 0.5,
  },
  metricsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  metricEmoji: {
    fontSize: 18,
  },
  metricCount: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  streakText: {
    color: '#FF9600',
  },
  energyText: {
    color: '#1CB0F6',
  },
  xpText: {
    color: '#EAB308',
  },
  // Modal Dizayni
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  langListContainer: {
    gap: 10,
  },
  langOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  langOptionCardSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  langOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  optionFlag: {
    fontSize: 26,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  optionLabelSelected: {
    color: '#4F46E5',
  },
  optionBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 1,
  },
  checkBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
