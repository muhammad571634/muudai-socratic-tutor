// O'ylanish: Ushbu komponent Duolingo va Apple Minimalist uslubidagi
// pastki navigatsiya panelidir (Bottom Navigation Tab Bar).
// 4 ta tabni o'z ichiga oladi:
// 1. Home (Faol binafsha rang #6A3DF5)
// 2. Review (Xatolar daftari / Mistakes vault)
// 3. Challenge (Kunlik sirli sandiq jumboqlari)
// 4. Profile (Foydalanuvchi hisobi, statistika va sozlamalar)

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  House,
  Trophy,
  BookOpen,
  Star,
  User,
} from 'phosphor-react-native';
import { theme } from '../../core/theme';
import { HapticFeedback } from '../../core/haptics';
import { useTranslation } from 'react-i18next';

export type BottomNavTab = 'home' | 'challenge' | 'review' | 'premium' | 'profile';

export interface BottomTabBarProps {
  activeTab: BottomNavTab;
  onSelectTab: (tab: BottomNavTab) => void;
  mistakesBadgeCount?: number;
}

import { formatMistakeBadge } from './homeDashboardLogic';
export { formatMistakeBadge };

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onSelectTab,
  mistakesBadgeCount = 0,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const handleTabPress = (tab: BottomNavTab) => {
    HapticFeedback.light();
    onSelectTab(tab);
  };

  const badgeText = formatMistakeBadge(mistakesBadgeCount);

  const tabs: {
    id: BottomNavTab;
    label: string;
    renderIcon: (isActive: boolean) => React.ReactNode;
  }[] = [
    {
      id: 'home',
      label: t('homeDashboard.tabs.home', 'Home'),
      renderIcon: (isActive) => (
        <House
          size={24}
          color={isActive ? '#6C47FF' : '#94A3B8'}
          weight={isActive ? 'fill' : 'bold'}
        />
      ),
    },
    {
      id: 'challenge',
      label: t('homeDashboard.tabs.challenge', 'Challenge'),
      renderIcon: (isActive) => (
        <Trophy
          size={24}
          color={isActive ? '#6C47FF' : '#94A3B8'}
          weight={isActive ? 'fill' : 'bold'}
        />
      ),
    },
    {
      id: 'review',
      label: t('homeDashboard.tabs.review', 'Review'),
      renderIcon: (isActive) => (
        <View style={styles.iconWithBadgeWrapper}>
          <BookOpen
            size={24}
            color={isActive ? '#6C47FF' : '#94A3B8'}
            weight={isActive ? 'fill' : 'bold'}
          />
          {badgeText !== null && (
            <View style={styles.mistakeBadge}>
              <Text style={styles.mistakeBadgeText}>{badgeText}</Text>
            </View>
          )}
        </View>
      ),
    },
    {
      id: 'premium',
      label: t('homeDashboard.tabs.premium', 'Premium'),
      renderIcon: (isActive) => (
        <Star
          size={24}
          color={isActive ? '#6C47FF' : '#94A3B8'}
          weight={isActive ? 'fill' : 'bold'}
        />
      ),
    },
    {
      id: 'profile',
      label: t('homeDashboard.tabs.profile', 'Profile'),
      renderIcon: (isActive) => (
        <User
          size={24}
          color={isActive ? '#6C47FF' : '#94A3B8'}
          weight={isActive ? 'fill' : 'bold'}
        />
      ),
    },
  ];

  return (
    <View style={[styles.barContainer, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.tabsRow}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.7}
              onPress={() => handleTabPress(tab.id)}
              style={styles.tabItem}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={tab.label}
            >
              <View style={styles.iconContainer}>
                {tab.renderIcon(isActive)}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  isActive ? styles.tabLabelActive : styles.tabLabelInactive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  barContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 8,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    width: 32,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWithBadgeWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mistakeBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  mistakeBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: -0.1,
  },
  tabLabelActive: {
    color: '#6C47FF',
  },
  tabLabelInactive: {
    color: '#94A3B8',
  },
});
