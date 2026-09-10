// O'ylanish: Ushbu komponent Home Dashboarddagi Profile tabiga mos bo'lgan
// foydalanuvchi hisobi, o'qish statistikasi va ilova sozlamalari ko'rinishidir.
// Apple Minimalist HIG talablariga to'liq javob beradi: 0 kognitiv yuklama,
// Bento grid formatidagi statistika, AiMascotAvatar va til sozlamasi.

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Fire,
  Star,
  Target,
  CheckCircle,
  Globe,
  CaretRight,
  ArrowLeft,
  User,
  Envelope,
  Calendar,
} from 'phosphor-react-native';
import { theme } from '../../core/theme';
import { HapticFeedback } from '../../core/haptics';
import { useTranslation } from 'react-i18next';
import { AiMascotAvatar } from './AiMascotAvatar';
import { useAppStore } from '../state/useAppStore';
import { useGamificationStore } from '../state/useGamificationStore';

export interface ProfileViewProps {
  onBackToHome: () => void;
  onOpenLanguageModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onBackToHome,
  onOpenLanguageModal,
}) => {
  const { t } = useTranslation();
  const {
    studentName,
    studentAge,
    studentEmail,
    dailyGoalMinutes,
    locale,
  } = useAppStore();

  const {
    xp,
    streakDays,
    solvedProblemsCount,
  } = useGamificationStore();

  const displayName = studentName || 'Student';
  const displayEmail = studentEmail || 'student@muudai.com';

  const getLanguageLabel = (loc: string | null) => {
    if (loc === 'uz') return "🇺🇿 O'zbekcha";
    if (loc === 'ru') return '🇷🇺 Русский';
    return '🇺🇸 English';
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Yuqori Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            HapticFeedback.light();
            onBackToHome();
          }}
          style={styles.backButton}
        >
          <ArrowLeft size={22} color="#0F172A" weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {t('homeDashboard.profile.title', 'Profile')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Foydalanuvchi Karta */}
      <View style={styles.userHeroCard}>
        <View style={styles.avatarWrapper}>
          <AiMascotAvatar size={68} mood="idle" />
        </View>
        <Text style={styles.userName}>{displayName}</Text>
        <Text style={styles.userEmail}>{displayEmail}</Text>

        {studentAge ? (
          <View style={styles.ageBadge}>
            <Text style={styles.ageBadgeText}>
              {studentAge} {t('homeDashboard.profile.age', 'years old')}
            </Text>
          </View>
        ) : null}
      </View>

      {/* O'qish Statistikasi (Bento Grid) */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeading}>
          {t('homeDashboard.profile.statsTitle', 'Learning Stats')}
        </Text>

        <View style={styles.statsGrid}>
          {/* Streak Karta */}
          <View style={[styles.statCard, styles.streakCardBg]}>
            <Fire size={24} color="#FF9600" weight="fill" />
            <Text style={styles.statValue}>{streakDays}</Text>
            <Text style={styles.statLabel}>
              {t('homeDashboard.profile.dayStreak', 'Day Streak')}
            </Text>
          </View>

          {/* Jami XP Karta */}
          <View style={[styles.statCard, styles.xpCardBg]}>
            <Star size={24} color="#EAB308" weight="fill" />
            <Text style={styles.statValue}>{xp}</Text>
            <Text style={styles.statLabel}>
              {t('homeDashboard.profile.totalXp', 'Total XP')}
            </Text>
          </View>

          {/* Yechilgan Masalalar */}
          <View style={[styles.statCard, styles.solvedCardBg]}>
            <CheckCircle size={24} color="#16A34A" weight="fill" />
            <Text style={styles.statValue}>{solvedProblemsCount}</Text>
            <Text style={styles.statLabel}>
              {t('homeDashboard.profile.solvedProblems', 'Solved')}
            </Text>
          </View>

          {/* Kunlik Maqsad */}
          <View style={[styles.statCard, styles.goalCardBg]}>
            <Target size={24} color="#6366F1" weight="fill" />
            <Text style={styles.statValue}>{dailyGoalMinutes}</Text>
            <Text style={styles.statLabel}>
              {t('homeDashboard.profile.minutesPerDay', 'min / day')}
            </Text>
          </View>
        </View>
      </View>

      {/* Sozlamalar Guruhi */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeading}>
          {t('homeDashboard.profile.appSettings', 'App Settings')}
        </Text>

        {/* Tilni o'zgartirish */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            HapticFeedback.light();
            onOpenLanguageModal();
          }}
          style={styles.settingsRow}
        >
          <View style={styles.settingsRowLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
              <Globe size={20} color="#6366F1" weight="bold" />
            </View>
            <Text style={styles.settingsRowLabel}>
              {t('homeDashboard.profile.language', 'App Language')}
            </Text>
          </View>
          <View style={styles.settingsRowRight}>
            <Text style={styles.settingsRowValue}>{getLanguageLabel(locale)}</Text>
            <CaretRight size={18} color="#94A3B8" weight="bold" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Bosh Sahifaga Qaytish Tugmasi */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          HapticFeedback.light();
          onBackToHome();
        }}
        style={styles.backToHomeButton}
      >
        <Text style={styles.backToHomeButtonText}>
          {t('homeDashboard.profile.backToHome', 'Back to Home')}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSpacer: {
    width: 40,
  },
  userHeroCard: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  avatarWrapper: {
    marginBottom: 12,
  },
  userName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
  },
  ageBadge: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
  },
  ageBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4F46E5',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  streakCardBg: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
  },
  xpCardBg: {
    backgroundColor: '#FEFCE8',
    borderColor: '#FEF08A',
  },
  solvedCardBg: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  goalCardBg: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  settingsRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsRowLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  settingsRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  settingsRowValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6366F1',
  },
  backToHomeButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#6A3DF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#6A3DF5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  backToHomeButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});
