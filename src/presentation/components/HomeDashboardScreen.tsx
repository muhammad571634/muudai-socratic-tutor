// O'ylanish: Ushbu komponent MuudAI loyihasining yangi, Duolingo va Apple Minimalist
// uslubidagi to'liq Home Dashboard ekranidir.
// Mockup (media_1789057276062.png) ga 100% mos:
// 1. Yuqorida: HomeHeaderBar (🇺🇸 EN, 🔥 4, 💎 5/5, ⭐ 120)
// 2. O'rtada: SocraticSteppingPath (S-shaklidagi 3D yo'l, START! pufakchasi, maskotlar va marra kubogi)
// 3. Pastda: BottomTabBar (Home, Review, Challenge, Profile)
// 4. Integratsiya: Skaner, Xatolar daftari, Sirli sandiq, Gamifikatsiya modali va Profil ko'rinishi

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeHeaderBar, LanguageSelectionModal } from './HomeHeaderBar';
import { SocraticSteppingPath } from './SocraticSteppingPath';
import { BottomTabBar, BottomNavTab } from './BottomTabBar';
import { ProfileView } from './ProfileView';
import { GamificationDetailModal, GamificationModalTab } from './GamificationDetailModal';
import { useGamificationStore } from '../state/useGamificationStore';
import { useAppStore } from '../state/useAppStore';
import { useMistakeStore } from '../state/useMistakeStore';
import { AppLocale } from '../../domain/entities/Locale';

export interface HomeDashboardScreenProps {
  onOpenScanner: () => void;
  onOpenMistakes: () => void;
  onOpenMysteryChest: () => void;
  onOpenLab?: () => void;
}

export const HomeDashboardScreen: React.FC<HomeDashboardScreenProps> = ({
  onOpenScanner,
  onOpenMistakes,
  onOpenMysteryChest,
}) => {
  const [activeTab, setActiveTab] = useState<BottomNavTab>('home');
  const [isGamificationModalOpen, setIsGamificationModalOpen] = useState<boolean>(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);
  const [gamificationTab, setGamificationTab] = useState<GamificationModalTab>('rank');

  // Global do'konlardan ma'lumotlar
  const {
    xp,
    streakDays,
    energy,
    maxEnergy,
  } = useGamificationStore();

  const {
    locale,
    chooseLocale,
  } = useAppStore();

  const activeMistakesCount = useMistakeStore((s) => s.getActiveCount());

  // Gamifikatsiya modalini ochish
  const handleOpenGamification = (tab: GamificationModalTab) => {
    setGamificationTab(tab);
    setIsGamificationModalOpen(true);
  };

  // Skanerni ochishdan oldin energiya tekshiruvi
  const handleOpenScannerWithEnergyCheck = () => {
    if (energy <= 0) {
      handleOpenGamification('energy');
      return;
    }
    onOpenScanner();
  };

  // Pastki tab tanlanganda
  const handleSelectTab = (tab: BottomNavTab) => {
    if (tab === 'review') {
      onOpenMistakes();
      return;
    }
    if (tab === 'challenge') {
      onOpenMysteryChest();
      return;
    }
    setActiveTab(tab);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* 1. Yuqori Gamifikatsiya Paneli (Faqat Home tabida ko'rsatiladi) */}
      {activeTab === 'home' && (
        <HomeHeaderBar
          currentLocale={locale || 'en'}
          onSelectLocale={(newLocale: AppLocale) => chooseLocale(newLocale)}
          streakDays={streakDays}
          energy={energy}
          maxEnergy={maxEnergy}
          xp={xp}
          onPressStreak={() => handleOpenGamification('streak')}
          onPressEnergy={() => handleOpenGamification('energy')}
          onPressXp={() => handleOpenGamification('rank')}
          isLanguageModalOpen={isLanguageModalOpen}
          onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
          onCloseLanguageModal={() => setIsLanguageModalOpen(false)}
        />
      )}

      {/* 2. Asosiy Kontent (Home yoki Profile) */}
      <View style={styles.mainContent}>
        {activeTab === 'home' && (
          <SocraticSteppingPath
            onOpenScanner={handleOpenScannerWithEnergyCheck}
            onOpenMistakes={onOpenMistakes}
            onOpenMysteryChest={onOpenMysteryChest}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            onBackToHome={() => setActiveTab('home')}
            onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
          />
        )}
      </View>

      {/* 3. Pastki Navigatsiya Paneli */}
      <BottomTabBar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        mistakesBadgeCount={activeMistakesCount}
      />

      {/* 4. Gamifikatsiya Tafsilotlari Modali (Streak, Rank, Energy) */}
      <GamificationDetailModal
        visible={isGamificationModalOpen}
        initialTab={gamificationTab}
        onClose={() => setIsGamificationModalOpen(false)}
        onPracticeMistakes={() => {
          setIsGamificationModalOpen(false);
          onOpenMistakes();
        }}
      />

      {/* 5. Markazlashtirilgan Til Tanlash Modali (Header va Profile uchun bir xil) */}
      <LanguageSelectionModal
        visible={isLanguageModalOpen}
        currentLocale={locale || 'en'}
        onSelectLocale={(newLocale: AppLocale) => chooseLocale(newLocale)}
        onClose={() => setIsLanguageModalOpen(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
