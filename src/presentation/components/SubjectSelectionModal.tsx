// O'ylanish: Ushbu modal Duolingo-style fanlar va til tanlash oynasidir.
// Foydalanuvchi talabi:
// 1. "til tanlash joyiga bizni nimalarni qo'shib qo'y, fanlarni."
// 2. "Bitta matematika ochiq turadi, qolgan hammasi bo'lib xiralashib turishi kerak"
// 3. "va shunda qaysi fanni tanlasa, o'shanda START bosganda o'sha fan bilan integratsiya bo'lib ketishi kerak."
// Modalda ikkita toza tab bor: "Fanlar" (birlamchi) va "Til sozlamasi".
// Matematika to'liq faol, qolgan fanlar (Fizika, Kimyo, Biologiya, Ingliz tili) xiralashtirilgan
// va "Tez kunda" belgisi bilan himoyalangan.

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { Check, X, Lock, Sparkle, Globe, Books } from 'phosphor-react-native';
import { theme } from '../../core/theme';
import { HapticFeedback } from '../../core/haptics';
import { useTranslation } from 'react-i18next';
import { AppLocale } from '../../domain/entities/Locale';
import {
  DashboardSubjectId,
  SubjectOption,
  SUBJECT_OPTIONS,
  LANGUAGE_OPTIONS,
  LanguageOption,
} from './homeDashboardLogic';

export interface SubjectSelectionModalProps {
  visible: boolean;
  currentLocale: string;
  selectedSubject?: string;
  onSelectLocale: (locale: AppLocale) => void;
  onSelectSubject: (subject: DashboardSubjectId) => void;
  onClose: () => void;
  initialTab?: 'subjects' | 'languages';
}

export const SubjectSelectionModal: React.FC<SubjectSelectionModalProps> = ({
  visible,
  currentLocale,
  selectedSubject = 'math',
  onSelectLocale,
  onSelectSubject,
  onClose,
  initialTab = 'subjects',
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'subjects' | 'languages'>(initialTab);
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setActiveTab(initialTab);
      setLockedNotice(null);
    }
  }, [visible, initialTab]);

  const handleChooseSubject = (subject: SubjectOption) => {
    if (!subject.isUnlocked) {
      HapticFeedback.error();
      const localizedName = t(subject.titleKey, subject.defaultTitle);
      setLockedNotice(
        t('homeDashboard.subjects.comingSoonNotice', {
          subject: localizedName,
          defaultValue: `${localizedName} is coming soon! For now, continue with Mathematics.`,
        })
      );
      return;
    }

    HapticFeedback.selection();
    setLockedNotice(null);
    onSelectSubject(subject.id);
    onClose();
  };

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
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>
                {activeTab === 'subjects'
                  ? t('homeDashboard.subjects.title', 'Subjects & Courses')
                  : t('homeDashboard.languages.title', 'Select Language')}
              </Text>
              <Text style={styles.modalSubtitle}>
                {activeTab === 'subjects'
                  ? t('homeDashboard.subjects.subtitle', 'Choose a subject to practice')
                  : t('homeDashboard.languages.subtitle', 'Choose your preferred language')}
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

          {/* Segmented Tab Switcher (Fanlar / Til) */}
          <View style={styles.tabSegmentContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                HapticFeedback.light();
                setActiveTab('subjects');
                setLockedNotice(null);
              }}
              style={[
                styles.segmentTab,
                activeTab === 'subjects' && styles.segmentTabActive,
              ]}
            >
              <Books
                size={18}
                color={activeTab === 'subjects' ? '#6C47FF' : '#64748B'}
                weight={activeTab === 'subjects' ? 'fill' : 'bold'}
              />
              <Text
                style={[
                  styles.segmentLabel,
                  activeTab === 'subjects' && styles.segmentLabelActive,
                ]}
              >
                {t('homeDashboard.subjects.title', 'Subjects')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                HapticFeedback.light();
                setActiveTab('languages');
                setLockedNotice(null);
              }}
              style={[
                styles.segmentTab,
                activeTab === 'languages' && styles.segmentTabActive,
              ]}
            >
              <Globe
                size={18}
                color={activeTab === 'languages' ? '#6C47FF' : '#64748B'}
                weight={activeTab === 'languages' ? 'fill' : 'bold'}
              />
              <Text
                style={[
                  styles.segmentLabel,
                  activeTab === 'languages' && styles.segmentLabelActive,
                ]}
              >
                {t('homeDashboard.profile.language', 'Language')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Qulflangan fanga bosilganda chiqadigan ogohlantirish bannari */}
          {lockedNotice && (
            <View style={styles.noticeBanner}>
              <Text style={styles.noticeText}>🔒 {lockedNotice}</Text>
            </View>
          )}

          {/* 1. Fanlar Ro'yxati */}
          {activeTab === 'subjects' && (
            <ScrollView
              style={styles.scrollList}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            >
              {SUBJECT_OPTIONS.map((item) => {
                const isSelected = item.id === selectedSubject;
                const isLocked = !item.isUnlocked;

                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={isLocked ? 0.6 : 0.8}
                    onPress={() => handleChooseSubject(item)}
                    style={[
                      styles.cardItem,
                      isSelected && styles.cardItemSelected,
                      isLocked && styles.cardItemLocked,
                    ]}
                  >
                    <View style={styles.cardLeft}>
                      <View
                        style={[
                          styles.iconCircle,
                          {
                            backgroundColor: isLocked
                              ? '#E2E8F0'
                              : `${item.accentColor}1A`,
                          },
                        ]}
                      >
                        <Text style={[styles.subjectEmoji, isLocked && styles.emojiDimmed]}>
                          {item.icon}
                        </Text>
                      </View>

                      <View style={styles.textContainer}>
                        <View style={styles.titleRow}>
                          <Text
                            style={[
                              styles.cardTitle,
                              isSelected && styles.cardTitleSelected,
                              isLocked && styles.cardTitleLocked,
                            ]}
                          >
                            {t(item.titleKey, item.defaultTitle)}
                          </Text>
                          {isLocked ? (
                            <View style={styles.comingSoonBadge}>
                              <Lock size={12} color="#94A3B8" weight="bold" />
                              <Text style={styles.comingSoonText}>
                                {t('homeDashboard.subjects.comingSoon', 'Coming Soon')}
                              </Text>
                            </View>
                          ) : (
                            <View style={styles.activeBadge}>
                              <Text style={styles.activeBadgeText}>
                                {t('homeDashboard.subjects.unlocked', 'Open')}
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text
                          style={[
                            styles.cardSubtitle,
                            isLocked && styles.cardSubtitleLocked,
                          ]}
                          numberOfLines={1}
                        >
                          {t(item.subtitleKey, item.defaultSubtitle)}
                        </Text>
                      </View>
                    </View>

                    {isSelected && !isLocked && (
                      <View style={styles.checkBadge}>
                        <Check size={16} color="#FFFFFF" weight="bold" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* 2. Tillar Ro'yxati */}
          {activeTab === 'languages' && (
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
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 36,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    fontSize: 13,
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
  tabSegmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  segmentTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 8,
  },
  segmentTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  segmentLabelActive: {
    color: '#6C47FF',
    fontWeight: '800',
  },
  noticeBanner: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  noticeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
    lineHeight: 16,
  },
  scrollList: {
    maxHeight: 340,
  },
  listContent: {
    gap: 10,
    paddingBottom: 8,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  cardItemSelected: {
    backgroundColor: '#F5F3FF',
    borderColor: '#6C47FF',
  },
  cardItemLocked: {
    opacity: 0.55,
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subjectEmoji: {
    fontSize: 22,
  },
  emojiDimmed: {
    opacity: 0.6,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  cardTitleSelected: {
    color: '#6C47FF',
  },
  cardTitleLocked: {
    color: '#64748B',
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  cardSubtitleLocked: {
    color: '#94A3B8',
  },
  activeBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  activeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16A34A',
  },
  comingSoonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
  },
  comingSoonText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  checkBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#6C47FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  // Tillar Ro'yxati
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
    backgroundColor: '#F5F3FF',
    borderColor: '#6C47FF',
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
    color: '#6C47FF',
  },
  optionBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 1,
  },
});
