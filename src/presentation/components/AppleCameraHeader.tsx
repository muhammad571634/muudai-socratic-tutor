import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Modal,
} from 'react-native';
import {
  CaretLeft,
  CaretDown,
  CaretUp,
  Lightning,
  CheckCircle,
  Calculator,
  Atom,
  Flask,
} from 'phosphor-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { theme } from '../../core/theme';
import { HapticFeedback } from '../../core/haptics';
import {
  SubjectItem,
  SubjectType,
  SUBJECT_ITEMS,
} from '../../domain/entities/Gamification';

export interface AppleCameraHeaderProps {
  onBack: () => void;
  activeSubject: SubjectItem;
  onSelectSubject: (subject: SubjectType) => void;
  stepXp?: number;
  totalXp?: number;
}

const renderSubjectIcon = (subjectId: SubjectType, size: number, color: string) => {
  switch (subjectId) {
    case 'math':
      return <Calculator size={size} color={color} weight="bold" />;
    case 'physics':
      return <Atom size={size} color={color} weight="bold" />;
    case 'chemistry':
      return <Flask size={size} color={color} weight="bold" />;
    default:
      return <Calculator size={size} color={color} weight="bold" />;
  }
};

/**
 * Apple-Minimalist & Kid-Friendly Camera Screen Navigation Island.
 * - Left Capsule: Frosted Glass Back Button with spring compression.
 * - Center Capsule: Interactive Subject Capsule with Ambient Glow & Quick Switcher Dropdown.
 * - Right Capsule: Gamified Golden XP Sparkle Pill (+25 XP).
 */
export const AppleCameraHeader: React.FC<AppleCameraHeaderProps> = ({
  onBack,
  activeSubject,
  onSelectSubject,
  stepXp = 25,
  totalXp,
}) => {
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  // Reanimated 3 Spring values
  const backScale = useSharedValue(1);
  const subjectScale = useSharedValue(1);
  const xpScale = useSharedValue(1);

  const animatedBackStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backScale.value }],
  }));

  const animatedSubjectStyle = useAnimatedStyle(() => ({
    transform: [{ scale: subjectScale.value }],
  }));

  const animatedXpStyle = useAnimatedStyle(() => ({
    transform: [{ scale: xpScale.value }],
  }));

  // Back button press handlers
  const handleBackPressIn = () => {
    backScale.value = withSpring(0.9, { damping: 16, stiffness: 240 });
  };
  const handleBackPressOut = () => {
    backScale.value = withSpring(1, { damping: 16, stiffness: 240 });
  };
  const handleBackPress = () => {
    HapticFeedback.light();
    onBack();
  };

  // Subject pill press handlers
  const handleSubjectPressIn = () => {
    subjectScale.value = withSpring(0.94, { damping: 16, stiffness: 240 });
  };
  const handleSubjectPressOut = () => {
    subjectScale.value = withSpring(1, { damping: 16, stiffness: 240 });
  };
  const handleToggleSwitcher = () => {
    HapticFeedback.selection();
    setIsSwitcherOpen((prev) => !prev);
  };

  // XP pill press handler
  const handleXpPress = () => {
    HapticFeedback.light();
    xpScale.value = withSequence(
      withTiming(1.15, { duration: 120 }),
      withSpring(1, { damping: 12, stiffness: 200 })
    );
  };

  const handleSelectSubjectItem = (subjectId: SubjectType) => {
    HapticFeedback.selection();
    onSelectSubject(subjectId);
    setIsSwitcherOpen(false);
  };

  return (
    <>
      <View style={styles.islandContainer}>
        {/* 1. Chap Kapsula: Apple Frosted Glass Orqaga Tugmasi */}
        <Pressable
          onPressIn={handleBackPressIn}
          onPressOut={handleBackPressOut}
          onPress={handleBackPress}
          hitSlop={8}
        >
          <Animated.View style={[styles.frostedBackCapsule, animatedBackStyle]}>
            <CaretLeft size={22} color="#FFFFFF" weight="bold" />
          </Animated.View>
        </Pressable>

        {/* 2. O'rta Kapsula: Interaktiv Fan Tanlagich Kapsulasi */}
        <Pressable
          onPressIn={handleSubjectPressIn}
          onPressOut={handleSubjectPressOut}
          onPress={handleToggleSwitcher}
          hitSlop={6}
        >
          <Animated.View
            style={[
              styles.subjectCapsule,
              {
                borderColor: `${activeSubject.accentColor}66`,
                shadowColor: activeSubject.accentColor,
              },
              animatedSubjectStyle,
            ]}
          >
            {/* Fan Belgisi Qora Aylanada */}
            <View
              style={[
                styles.subjectIconCircle,
                { backgroundColor: `${activeSubject.accentColor}33` },
              ]}
            >
              {renderSubjectIcon(activeSubject.id, 16, activeSubject.accentColor)}
            </View>

            {/* Fan Nomi */}
            <Text style={styles.subjectTitleText}>{activeSubject.title}</Text>

            {/* Ochiluvchi Strelka (Chevron) */}
            {isSwitcherOpen ? (
              <CaretUp
                size={14}
                color="rgba(255, 255, 255, 0.75)"
                weight="bold"
                style={styles.chevronIcon}
              />
            ) : (
              <CaretDown
                size={14}
                color="rgba(255, 255, 255, 0.75)"
                weight="bold"
                style={styles.chevronIcon}
              />
            )}
          </Animated.View>
        </Pressable>

        {/* 3. O'ng Kapsula: Gamifikatsiyalangan Oltin XP Belgisi */}
        <Pressable onPress={handleXpPress} hitSlop={6}>
          <Animated.View style={[styles.xpCapsule, animatedXpStyle]}>
            <View style={styles.xpIconBadge}>
              <Lightning size={14} color="#FFD60A" weight="fill" />
            </View>
            <Text style={styles.xpAmountText}>+{stepXp} XP</Text>
          </Animated.View>
        </Pressable>
      </View>

      {/* 4. Apple Glass Fanlar Menyusi (Dropdown Modal) */}
      <Modal
        visible={isSwitcherOpen}
        transparent
        animationType="none"
        onRequestClose={() => setIsSwitcherOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setIsSwitcherOpen(false)}
        >
          <Animated.View
            entering={FadeIn.duration(160)}
            exiting={FadeOut.duration(120)}
            style={styles.switcherCard}
          >
            <View style={styles.switcherHeaderRow}>
              <Text style={styles.switcherTitle}>Select Subject</Text>
              <Text style={styles.switcherSub}>Point camera at your problem or formula</Text>
            </View>

            <View style={styles.subjectsList}>
              {SUBJECT_ITEMS.map((item) => {
                const isSelected = item.id === activeSubject.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.subjectOptionRow,
                      isSelected ? styles.subjectOptionSelected : null,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => handleSelectSubjectItem(item.id)}
                  >
                    <View
                      style={[
                        styles.optionIconContainer,
                        { backgroundColor: `${item.accentColor}25` },
                      ]}
                    >
                      {renderSubjectIcon(item.id, 20, item.accentColor)}
                    </View>

                    <View style={styles.optionTextContainer}>
                      <Text style={styles.optionTitle}>{item.title}</Text>
                      <Text style={styles.optionSubtitle}>{item.subtitle}</Text>
                    </View>

                    {isSelected ? (
                      <CheckCircle
                        size={22}
                        color={item.accentColor}
                        weight="fill"
                      />
                    ) : (
                      <Text style={styles.optionStatsText}>{item.statsText}</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  islandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: 'rgba(10, 10, 14, 0.72)',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.12)',
    zIndex: 20,
  },
  frostedBackCapsule: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  subjectCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    paddingLeft: 6,
    paddingRight: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(25, 25, 34, 0.85)',
    borderWidth: 1.2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  subjectIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  subjectTitleText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  chevronIcon: {
    marginLeft: 6,
  },
  xpCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 214, 10, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 214, 10, 0.45)',
    shadowColor: '#FFD60A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  xpIconBadge: {
    marginRight: 4,
  },
  xpAmountText: {
    color: '#FFD60A',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-start',
    paddingTop: 85,
    paddingHorizontal: 20,
  },
  switcherCard: {
    backgroundColor: 'rgba(28, 28, 36, 0.96)',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  switcherHeaderRow: {
    marginBottom: 14,
  },
  switcherTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  switcherSub: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 2,
  },
  subjectsList: {
    gap: 8,
  },
  subjectOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  subjectOptionSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  optionIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  optionSubtitle: {
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 12,
    marginTop: 1,
  },
  optionStatsText: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 12,
    fontWeight: '600',
  },
});
