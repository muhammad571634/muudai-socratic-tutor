// O'ylanish: Ushbu komponent onboarding jarayonidagi profil yaratish bosqichining "How old are you?" ekranidir.
// Apple Minimalist va Duolingo uslubida: orqaga qaytish tugmasi, markazlashtirilgan progress kapsulasi (~48%),
// katta qalin sarlavha ("How old are you? 🎂"), "Age" yorlig'i ostidagi gorizontal chiziqli (underline) kiritish maydoni,
// avtofokus, number-pad klaviatura, matnni tozalash tugmasi va pastki qismda "Continue" DuoButton tugmasi mavjud.

import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  BackHandler,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, X } from 'phosphor-react-native';
import { DuoButton } from './DuoButton';
import { theme } from '../../core/theme';
import { HapticFeedback } from '../../core/haptics';
import { useAppStore } from '../state/useAppStore';

export interface ProfileAgeScreenProps {
  onBack: () => void;
  onContinue: (age: string) => void;
  initialAge?: string;
}

export const ProfileAgeScreen: React.FC<ProfileAgeScreenProps> = ({
  onBack,
  onContinue,
  initialAge = '',
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const setStudentAge = useAppStore((state) => state.setStudentAge);

  const [age, setAge] = useState<string>(initialAge);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<TextInput | null>(null);

  // Android apparat "Back" tugmasi hodisasini boshqarish
  useEffect(() => {
    const backAction = () => {
      onBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [onBack]);

  const parsedAge = parseInt(age.trim(), 10);
  const isContinueDisabled =
    age.trim().length === 0 || isNaN(parsedAge) || parsedAge <= 0 || parsedAge > 120;

  const handleContinue = () => {
    const trimmed = age.trim();
    const parsed = parseInt(trimmed, 10);
    if (!trimmed || isNaN(parsed) || parsed <= 0 || parsed > 120) return;
    HapticFeedback.medium();
    setStudentAge(trimmed);
    onContinue(trimmed);
  };

  const handleClear = () => {
    HapticFeedback.light();
    setAge('');
    inputRef.current?.focus();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
          },
        ]}
      >
        <StatusBar barStyle="dark-content" />

        {/* Top Header: Back Arrow + Centered Progress Capsule Bar */}
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              HapticFeedback.light();
              onBack();
            }}
            style={styles.backButton}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Back"
            accessibilityHint="Navigates to the previous screen"
          >
            <ArrowLeft size={24} color={theme.colors.titleDark} weight="bold" />
          </Pressable>

          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View style={styles.progressBar} />
            </View>
          </View>
        </View>

        {/* Form Body inside KeyboardAvoidingView */}
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Screen Title */}
            <Text style={styles.title}>
              {t('onboarding.profileAge.title', 'How old are you?')} 🎂
            </Text>

            {/* Field Label */}
            <Text style={styles.label}>
              {t('onboarding.profileAge.ageLabel', 'Age')}
            </Text>

            {/* Input Row with Bottom Border Underline */}
            <View
              style={[
                styles.inputContainer,
                isFocused ? styles.inputContainerFocused : styles.inputContainerDefault,
              ]}
            >
              <TextInput
                ref={inputRef}
                style={styles.textInput}
                value={age}
                onChangeText={(text) => {
                  const digits = text.replace(/[^0-9]/g, '');
                  setAge(digits.replace(/^0+(?=\d)/, ''));
                }}
                placeholder={t('onboarding.profileAge.placeholder', '25')}
                placeholderTextColor={theme.colors.textTertiary}
                autoFocus
                keyboardType="number-pad"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleContinue}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                maxLength={3}
                selectionColor={theme.colors.physicsIndigo}
                cursorColor={theme.colors.physicsIndigo}
                accessibilityLabel={t('onboarding.profileAge.ageLabel', 'Age')}
                accessibilityHint="Enter your age in years"
              />

              {age.length > 0 && (
                <Pressable
                  onPress={handleClear}
                  style={styles.clearButton}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Clear age text"
                  accessibilityHint="Clears the age field"
                >
                  <View style={styles.clearCircle}>
                    <X size={14} color={theme.colors.textSecondary} weight="bold" />
                  </View>
                </Pressable>
              )}
            </View>
          </ScrollView>

          {/* Bottom Sticky Continue Button */}
          <View
            style={[
              styles.footer,
              {
                paddingBottom: Math.max(insets.bottom, 16),
              },
            ]}
          >
            <DuoButton
              title={t('onboarding.profileAge.continue', 'Continue')}
              type="primary"
              borderRadius={28}
              disabled={isContinueDisabled}
              textStyle={styles.continueButtonText}
              accessibilityLabel={t('onboarding.profileAge.continue', 'Continue')}
              accessibilityHint="Saves your age and continues to email setup"
              onPress={handleContinue}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    position: 'relative',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  backButton: {
    position: 'absolute',
    left: 24,
    padding: 4,
    zIndex: 10,
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    width: 180,
    height: 10,
    backgroundColor: theme.colors.progressTrackBg,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    width: '48%',
    height: '100%',
    backgroundColor: theme.colors.physicsIndigo,
    borderRadius: 5,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.titleDark,
    lineHeight: 36,
    letterSpacing: -0.5,
    marginBottom: 40,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.titleDark,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  inputContainerDefault: {
    borderBottomWidth: 1.5,
    borderBottomColor: theme.colors.borderMuted,
  },
  inputContainerFocused: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.physicsIndigo,
  },
  textInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.headingDark,
    padding: 0,
    letterSpacing: -0.2,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    width: '100%',
    backgroundColor: theme.colors.background,
  },
  continueButtonText: {
    textTransform: 'none',
    fontSize: 17,
    fontWeight: '700',
  },
});
