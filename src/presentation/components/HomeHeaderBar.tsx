// O'ylanish: Ushbu komponent Duolingo va MuudAI uchun yuqori
// gamifikatsiya panelini (Top Gamification Header Bar) taqdim etadi.
// Mockup (media_1789059526763.jpg) bilan 100% birga-bir o'xshash:
// 1. Binafsha fon (#6C47FF) va oq rangli silliq tipografiya
// 2. Chapda: Kurs / Til kapsulasi (🇺🇸 EN / Fanlar tanlash)
// 3. Markazda: Olovli streak (🔥 4) va oq matn
// 4. O'ngda: Moviy kristall/olmos (💎 957) va oq matn
// 5. Eng o'ngda: 3D oltin yulduz (⭐) tugmasi
// 6. Integratsiya: Fanlar va til tanlash modali (Matematika faol, boshqalar xiralashgan)

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../../core/theme';
import { HapticFeedback } from '../../core/haptics';
import { useTranslation } from 'react-i18next';
import { AppLocale } from '../../domain/entities/Locale';
import {
  HeaderFlameIcon,
  HeaderGemIcon,
  HeaderStarIcon,
} from './HomeHeaderIcons';
import {
  SubjectSelectionModal,
  SubjectSelectionModalProps,
} from './SubjectSelectionModal';
import {
  LanguageOption,
  LANGUAGE_OPTIONS,
  formatHeaderMetrics,
  DashboardSubjectId,
  SUBJECT_OPTIONS,
} from './homeDashboardLogic';

export {
  LanguageOption,
  LANGUAGE_OPTIONS,
  formatHeaderMetrics,
  SubjectSelectionModal,
};

export interface HomeHeaderBarProps {
  currentLocale: string;
  onSelectLocale: (locale: AppLocale) => void;
  selectedSubject?: DashboardSubjectId | string;
  onSelectSubject?: (subject: DashboardSubjectId) => void;
  streakDays?: number;
  energy?: number;
  maxEnergy?: number;
  gems?: number;
  xp?: number;
  onPressStreak?: () => void;
  onPressEnergy?: () => void;
  onPressXp?: () => void;
  isLanguageModalOpen?: boolean;
  onOpenLanguageModal?: () => void;
  onCloseLanguageModal?: () => void;
}

export interface LanguageSelectionModalProps {
  visible: boolean;
  currentLocale: string;
  selectedSubject?: string;
  onSelectLocale: (locale: AppLocale) => void;
  onSelectSubject?: (subject: DashboardSubjectId) => void;
  onClose: () => void;
}

/**
 * Backward compatibility wrapper for LanguageSelectionModal
 */
export const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  visible,
  currentLocale,
  selectedSubject = 'math',
  onSelectLocale,
  onSelectSubject = () => {},
  onClose,
}) => {
  return (
    <SubjectSelectionModal
      visible={visible}
      currentLocale={currentLocale}
      selectedSubject={selectedSubject}
      onSelectLocale={onSelectLocale}
      onSelectSubject={onSelectSubject}
      onClose={onClose}
      initialTab="subjects"
    />
  );
};

export const HomeHeaderBar: React.FC<HomeHeaderBarProps> = ({
  currentLocale,
  onSelectLocale,
  selectedSubject = 'math',
  onSelectSubject = () => {},
  streakDays = 4,
  energy = 5,
  maxEnergy = 5,
  gems = 957,
  xp = 120,
  onPressStreak,
  onPressEnergy,
  onPressXp,
  isLanguageModalOpen,
  onOpenLanguageModal,
  onCloseLanguageModal,
}) => {
  const { t } = useTranslation();
  const [internalModalVisible, setInternalModalVisible] = useState<boolean>(false);

  const isModalVisible =
    isLanguageModalOpen !== undefined ? isLanguageModalOpen : internalModalVisible;

  const openModal = () => {
    HapticFeedback.light();
    if (onOpenLanguageModal) {
      onOpenLanguageModal();
    } else {
      setInternalModalVisible(true);
    }
  };

  const closeModal = () => {
    if (onCloseLanguageModal) {
      onCloseLanguageModal();
    } else {
      setInternalModalVisible(false);
    }
  };

  // Joriy til va fan ma'lumotlari
  const activeLang =
    LANGUAGE_OPTIONS.find((opt) => opt.code === currentLocale) || LANGUAGE_OPTIONS[0];
  const activeSubjectOpt =
    SUBJECT_OPTIONS.find((s) => s.id === selectedSubject);

  const pillIcon = activeSubjectOpt ? activeSubjectOpt.icon : activeLang.flag;
  const pillText = activeSubjectOpt ? activeSubjectOpt.shortBadge : activeLang.badge;

  return (
    <>
      <View style={styles.headerContainer}>
        {/* 1. Chap: Fan va Til Kapsulasi (Mockup: 📐 Math yoki 🇺🇸 EN) */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={openModal}
          style={styles.langPillButton}
          accessibilityRole="button"
          accessibilityLabel={t('homeDashboard.subjects.title', 'Select Subject or Language')}
        >
          <Text style={styles.flagEmoji}>{pillIcon}</Text>
          <Text style={styles.langCodeText}>{pillText}</Text>
        </TouchableOpacity>

        {/* 2. Streak Ko'rsatkichi (Olovli Ikon + Oq Matn "4") */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onPressStreak}
          style={styles.metricItem}
          accessibilityRole="button"
          accessibilityLabel={`${streakDays} ${t('homeDashboard.streakTooltip', 'Day Streak')}`}
        >
          <HeaderFlameIcon size={21} />
          <Text style={styles.metricCount}>{streakDays}</Text>
        </TouchableOpacity>

        {/* 3. Kristall / Olmos / Energiya Ko'rsatkichi (Cyan Gem + Oq Matn "957") */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onPressEnergy}
          style={styles.metricItem}
          accessibilityRole="button"
          accessibilityLabel={`${gems} ${t('homeDashboard.energyTooltip', 'Energy / Gems')}`}
        >
          <HeaderGemIcon size={21} />
          <Text style={styles.metricCount}>{gems}</Text>
        </TouchableOpacity>

        {/* 4. 3D Oltin Yulduz Ko'rsatkichi (Golden 3D Star Icon) */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onPressXp}
          style={styles.starItem}
          accessibilityRole="button"
          accessibilityLabel={`${xp} ${t('homeDashboard.xpTooltip', 'XP')}`}
        >
          <HeaderStarIcon size={25} />
        </TouchableOpacity>
      </View>

      {/* Standalone holatda Fanlar va Til Tanlash Modali (faqat tashqi boshqaruv bo'lmaganda) */}
      {!onOpenLanguageModal && (
        <SubjectSelectionModal
          visible={isModalVisible}
          currentLocale={currentLocale}
          selectedSubject={selectedSubject}
          onSelectLocale={onSelectLocale}
          onSelectSubject={(subject) => {
            onSelectSubject(subject);
            closeModal();
          }}
          onClose={closeModal}
          initialTab="subjects"
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#6C47FF',
    zIndex: 10,
  },
  langPillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    gap: 6,
  },
  flagEmoji: {
    fontSize: 16,
  },
  langCodeText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  starItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  metricCount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});
