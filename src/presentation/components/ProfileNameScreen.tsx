// O'ylanish: Ushbu komponent onboarding jarayonidagi profil yaratish bosqichining "What is your name?" ekranidir.
// Apple Minimalist va Duolingo uslubida: orqaga qaytish tugmasi, progress kapsulasi, katta qalin sarlavha,
// "Full Name" yorlig'i ostidagi toza gorizontal chiziqli (underline) matn kiritish maydoni,
// avtofokus, matnni tozalash tugmasi va pastki qismda "Continue" DuoButton tugmasi mavjud.

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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, X } from 'phosphor-react-native';
import { DuoButton } from './DuoButton';
import { theme } from '../../core/theme';
import { HapticFeedback } from '../../core/haptics';
import { useAppStore } from '../state/useAppStore';

export interface ProfileNameScreenProps {
  onBack: () => void;
  onContinue: (name: string) => void;
  initialName?: string;
}

export const ProfileNameScreen: React.FC<ProfileNameScreenProps> = ({
  onBack,
  onContinue,
  initialName = '',
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const setStudentName = useAppStore((state) => state.setStudentName);

  const [name, setName] = useState<string>(initialName);
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

  const handleContinue = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    HapticFeedback.medium();
    setStudentName(trimmed);
    onContinue(trimmed);
  };

  const handleClear = () => {
    HapticFeedback.light();
    setName('');
    inputRef.current?.focus();
  };

  const isContinueDisabled = name.trim().length === 0;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            paddingBottom: Math.max(insets.bottom, 20),
          },
        ]}
      >
        <StatusBar barStyle="dark-content" />

        {/* Top Header: Back Arrow + Progress Capsule Bar */}
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
          >
            <ArrowLeft size={24} color="#1E293B" weight="bold" />
          </Pressable>

          <View style={styles.progressTrack}>
            <View style={styles.progressBar} />
          </View>
        </View>

        {/* Form Body inside KeyboardAvoidingView */}
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.content}>
            {/* Screen Title */}
            <Text style={styles.title}>
              {t('onboarding.profileName.title', 'What is your name?')} 👱 👩
            </Text>

            {/* Field Label */}
            <Text style={styles.label}>
              {t('onboarding.profileName.fullNameLabel', 'Full Name')}
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
                value={name}
                onChangeText={setName}
                placeholder={t('onboarding.profileName.placeholder', 'Andrew Ainsley')}
                placeholderTextColor="#94A3B8"
                autoFocus
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleContinue}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                maxLength={50}
                selectionColor={theme.colors.physicsIndigo}
                accessibilityLabel={t('onboarding.profileName.fullNameLabel', 'Full Name')}
              />

              {name.length > 0 && (
                <Pressable
                  onPress={handleClear}
                  style={styles.clearButton}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Clear name text"
                >
                  <View style={styles.clearCircle}>
                    <X size={14} color="#64748B" weight="bold" />
                  </View>
                </Pressable>
              )}
            </View>
          </View>

          {/* Bottom Sticky Continue Button */}
          <View style={styles.footer}>
            <DuoButton
              title={t('onboarding.profileName.continue', 'Continue')}
              type="primary"
              borderRadius={28}
              disabled={isContinueDisabled}
              textStyle={styles.continueButtonText}
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 20,
  },
  backButton: {
    padding: 4,
    marginRight: 24,
  },
  progressTrack: {
    width: 160,
    height: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    width: '30%',
    height: '100%',
    backgroundColor: theme.colors.physicsIndigo,
    borderRadius: 5,
  },
  keyboardAvoid: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
    lineHeight: 36,
    letterSpacing: -0.5,
    marginBottom: 40,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  inputContainerDefault: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#CBD5E1',
  },
  inputContainerFocused: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.physicsIndigo,
  },
  textInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
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
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'android' ? 12 : 8,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  continueButtonText: {
    textTransform: 'none',
    fontSize: 17,
    fontWeight: '700',
  },
});
