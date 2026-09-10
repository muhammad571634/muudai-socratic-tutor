// O'ylanish: Ushbu komponent MuudAI loyihasining Duolingo va Apple Minimalist
// uslubidagi to'liq Home Dashboard ekranidir.
// Mockup (media_1789059526763.jpg) bilan 100% birga-bir o'xshash:
// 1. Yuqorida: Binafsha rangli HomeHeaderBar (#6C47FF, 🇺🇸 EN, 🔥 4, 💎 957, ⭐)
// 2. O'rtada: Oq kartali SocraticSteppingPath (S-shaklidagi 3D yo'l, START! pufakchasi, maskotlar va marra kubogi)
// 3. Pastda: BottomTabBar (Home, Review, Challenge, Profile)
// 4. Fanlar integratsiyasi: Til tanlash joyidan fanlar ochiladi (Matematika faol, boshqalar xiralashgan),
//    START bosilganda tanlangan fan bilan Sokratik skaner to'g'ridan-to'g'ri integratsiya bo'ladi.

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeHeaderBar } from './HomeHeaderBar';
import { SubjectSelectionModal } from './SubjectSelectionModal';
import { SocraticSteppingPath } from './SocraticSteppingPath';
import { BottomTabBar, BottomNavTab } from './BottomTabBar';
import { ProfileView } from './ProfileView';
import { GamificationDetailModal, GamificationModalTab } from './GamificationDetailModal';
import { useGamificationStore } from '../state/useGamificationStore';
import { useAppStore } from '../state/useAppStore';
import { useMistakeStore } from '../state/useMistakeStore';
import { AppLocale } from '../../domain/entities/Locale';
import { SubjectType } from '../../domain/entities/Gamification';
import { DashboardSubjectId } from './homeDashboardLogic';

export interface HomeDashboardScreenProps {
  onOpenScanner: (subject?: SubjectType) => void;
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
  const [modalInitialTab, setModalInitialTab] = useState<'subjects' | 'languages'>('subjects');
  const [gamificationTab, setGamificationTab] = useState<GamificationModalTab>('rank');

  // Global do'konlardan ma'lumotlar
  const {
    xp,
    streakDays,
    energy,
    maxEnergy,
    selectedSubject,
    setSubject,
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

  // Skanerni ochishdan oldin energiya tekshiruvi va tanlangan fan integratsiyasi
  const handleOpenScannerWithEnergyCheck = () => {
    if (energy <= 0) {
      handleOpenGamification('energy');
      return;
    }
    onOpenScanner(selectedSubject);
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
    if (tab === 'premium') {
      handleOpenGamification('energy');
      return;
    }
    setActiveTab(tab);
  };

  const handleSubjectChange = (subjectId: DashboardSubjectId) => {
    if (subjectId === 'math' || subjectId === 'physics' || subjectId === 'chemistry') {
      setSubject(subjectId);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: activeTab === 'home' ? '#6C47FF' : '#FFFFFF' },
      ]}
      edges={['top', 'left', 'right']}
    >
      {/* 1. Yuqori Gamifikatsiya Paneli (Mockup media_1789059526763.jpg ga 100% birga-bir mos) */}
      {activeTab === 'home' && (
        <HomeHeaderBar
          currentLocale={locale || 'en'}
          onSelectLocale={(newLocale: AppLocale) => chooseLocale(newLocale)}
          selectedSubject={selectedSubject}
          onSelectSubject={handleSubjectChange}
          streakDays={streakDays}
          energy={energy}
          maxEnergy={maxEnergy}
          gems={957}
          xp={xp}
          onPressStreak={() => handleOpenGamification('streak')}
          onPressEnergy={() => handleOpenGamification('energy')}
          onPressXp={() => handleOpenGamification('rank')}
          isLanguageModalOpen={isLanguageModalOpen}
          onOpenLanguageModal={() => {
            setModalInitialTab('subjects');
            setIsLanguageModalOpen(true);
          }}
          onCloseLanguageModal={() => setIsLanguageModalOpen(false)}
        />
      )}

      {/* 2. Asosiy Kontent (Oq karta dizaynida Socratic Stepping Path yoki Profile) */}
      <View
        style={[
          styles.mainContent,
          activeTab === 'home' && styles.mainContentHomeCard,
        ]}
      >
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
            onOpenLanguageModal={() => {
              setModalInitialTab('languages');
              setIsLanguageModalOpen(true);
            }}
          />
        )}
      </View>

      {/* 3. Pastki Navigatsiya Paneli (Mockupga 100% mos) */}
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

      {/* 5. Markazlashtirilgan Yagona Fan va Til Tanlash Modali */}
      <SubjectSelectionModal
        visible={isLanguageModalOpen}
        currentLocale={locale || 'en'}
        selectedSubject={selectedSubject}
        onSelectLocale={(newLocale: AppLocale) => chooseLocale(newLocale)}
        onSelectSubject={handleSubjectChange}
        onClose={() => setIsLanguageModalOpen(false)}
        initialTab={modalInitialTab}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainContentHomeCard: {
    backgroundColor: '#FFFFFF',
  },
});
