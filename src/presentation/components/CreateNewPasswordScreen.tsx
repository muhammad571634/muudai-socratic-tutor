// O'ylanish: Ushbu komponent yangi parol o'rnatish (Create New Password) ekranidir.
// Mockup media_1789054151137.png asosida Apple Minimalist va Duolingo uslubida yaratilgan:
// - Tepada orqaga qaytish o'qi (ArrowLeft)
// - "Create new password 🔐" sarlavhasi
// - Tushuntirish matni ("Save the new password in a safe place, if you forget it then you have to do a forgot password again.")
// - 1-maydon: "Create a new password" yorlig'i, pastki binafsha chiziqli kiritish maydoni va ko'zcha (visibility toggle) ikonkasi
// - 2-maydon: "Confirm a new password" yorlig'i, pastki binafsha chiziqli kiritish maydoni va ko'zcha ikonkasi
// - "Remember me" maxsus binafsha rangli katakcha (checkbox)
// - Pastki qismda "Continue" DuoButton tugmasi (Title Case, radius 28)
// - Parol uzunligi (kamida 6 ta belgi) va parollar bir-biriga mosligini to'liq tekshirish (validation).

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
import { ArrowLeft, Eye, EyeSlash, Check } from 'phosphor-react-native';
import { DuoButton } from './DuoButton';
import { theme } from '../../core/theme';
import { HapticFeedback } from '../../core/haptics';

export interface CreateNewPasswordResult {
  password: string;
  rememberMe: boolean;
}

export interface CreateNewPasswordScreenProps {
  onBack: () => void;
  onContinue?: (result: CreateNewPasswordResult) => void;
  onSuccess?: (result: CreateNewPasswordResult) => void;
  initialRememberMe?: boolean;
}

export const CreateNewPasswordScreen: React.FC<CreateNewPasswordScreenProps> = ({
  onBack,
  onContinue,
  onSuccess,
  initialRememberMe = true,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(initialRememberMe);

  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);
  const [confirmFocused, setConfirmFocused] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const passwordInputRef = useRef<TextInput | null>(null);
  const confirmInputRef = useRef<TextInput | null>(null);

  // Android apparat "Back" tugmasi hodisasini boshqarish
  useEffect(() => {
    const backAction = () => {
      onBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [onBack]);

  const togglePasswordVisibility = () => {
    HapticFeedback.light();
    setIsPasswordVisible((prev) => !prev);
  };

  const toggleConfirmVisibility = () => {
    HapticFeedback.light();
    setIsConfirmVisible((prev) => !prev);
  };

  const toggleRememberMe = () => {
    HapticFeedback.light();
    setRememberMe((prev) => !prev);
  };

  const handleContinue = () => {
    const trimmedPassword = password.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (trimmedPassword.length < 6) {
      HapticFeedback.error();
      setValidationError(
        t('auth.createNewPassword.passwordTooShort', 'Password must be at least 6 characters')
      );
      passwordInputRef.current?.focus();
      return;
    }

    if (trimmedPassword !== trimmedConfirm) {
      HapticFeedback.error();
      setValidationError(
        t('auth.createNewPassword.passwordMismatch', 'Passwords do not match')
      );
      confirmInputRef.current?.focus();
      return;
    }

    setValidationError(null);
    HapticFeedback.success();

    const payload: CreateNewPasswordResult = {
      password: trimmedPassword,
      rememberMe,
    };

    // Callback faqat bir marta xavfsiz chaqiriladi (ikkilanishsiz)
    if (onContinue) {
      onContinue(payload);
    } else if (onSuccess) {
      onSuccess(payload);
    }
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

        {/* Yuqori qism: Orqaga qaytish o'qi */}
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
            accessibilityHint="Navigates back to OTP verification screen"
          >
            <ArrowLeft size={24} color={theme.colors.headingDark} weight="bold" />
          </Pressable>
        </View>

        {/* Forma tanasi KeyboardAvoidingView bilan o'ralgan */}
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
            {/* Ekran Sarlavhasi: "Create new password 🔐" */}
            <Text style={styles.title}>
              {t('auth.createNewPassword.title', 'Create new password 🔐')}
            </Text>

            {/* Subtitr tavsifi */}
            <Text style={styles.subtitle}>
              {t(
                'auth.createNewPassword.subtitle',
                'Save the new password in a safe place, if you forget it then you have to do a forgot password again.'
              )}
            </Text>

            {/* 1-maydon: "Create a new password" */}
            <Text style={styles.fieldLabel}>
              {t('auth.createNewPassword.newPasswordLabel', 'Create a new password')}
            </Text>

            {/* 1-maydon pastki chiziqli kiritish maydoni */}
            <View
              style={[
                styles.inputUnderline,
                passwordFocused || password.length > 0
                  ? styles.inputFocused
                  : styles.inputDefault,
              ]}
            >
              <TextInput
                ref={passwordInputRef}
                style={styles.textInput}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (validationError) setValidationError(null);
                }}
                placeholder={t(
                  'auth.createNewPassword.passwordPlaceholder',
                  '••••••••••••'
                )}
                placeholderTextColor={theme.colors.textTertiary}
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => confirmInputRef.current?.focus()}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                maxLength={60}
                selectionColor={theme.colors.physicsIndigo}
                cursorColor={theme.colors.physicsIndigo}
                accessibilityLabel={t(
                  'auth.createNewPassword.newPasswordLabel',
                  'Create a new password'
                )}
                accessibilityHint="Enter your new password"
              />

              <Pressable
                onPress={togglePasswordVisibility}
                style={styles.iconButton}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
              >
                {isPasswordVisible ? (
                  <Eye size={22} color={theme.colors.physicsIndigo} weight="bold" />
                ) : (
                  <EyeSlash size={22} color={theme.colors.physicsIndigo} weight="bold" />
                )}
              </Pressable>
            </View>

            {/* 2-maydon: "Confirm a new password" */}
            <Text style={[styles.fieldLabel, styles.confirmLabelSpacing]}>
              {t('auth.createNewPassword.confirmPasswordLabel', 'Confirm a new password')}
            </Text>

            {/* 2-maydon pastki chiziqli kiritish maydoni */}
            <View
              style={[
                styles.inputUnderline,
                confirmFocused || confirmPassword.length > 0
                  ? styles.inputFocused
                  : styles.inputDefault,
              ]}
            >
              <TextInput
                ref={confirmInputRef}
                style={styles.textInput}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (validationError) setValidationError(null);
                }}
                placeholder={t(
                  'auth.createNewPassword.passwordPlaceholder',
                  '••••••••••••'
                )}
                placeholderTextColor={theme.colors.textTertiary}
                secureTextEntry={!isConfirmVisible}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="newPassword"
                returnKeyType="done"
                onSubmitEditing={handleContinue}
                onFocus={() => setConfirmFocused(true)}
                onBlur={() => setConfirmFocused(false)}
                maxLength={60}
                selectionColor={theme.colors.physicsIndigo}
                cursorColor={theme.colors.physicsIndigo}
                accessibilityLabel={t(
                  'auth.createNewPassword.confirmPasswordLabel',
                  'Confirm a new password'
                )}
                accessibilityHint="Re-enter your new password to confirm"
              />

              <Pressable
                onPress={toggleConfirmVisibility}
                style={styles.iconButton}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel={isConfirmVisible ? 'Hide confirm password' : 'Show confirm password'}
              >
                {isConfirmVisible ? (
                  <Eye size={22} color={theme.colors.physicsIndigo} weight="bold" />
                ) : (
                  <EyeSlash size={22} color={theme.colors.physicsIndigo} weight="bold" />
                )}
              </Pressable>
            </View>

            {/* Tekshiruv xatoligi xabari */}
            {validationError && (
              <Text style={styles.errorText}>{validationError}</Text>
            )}

            {/* "Remember me" binafsha rangli katakcha qatori */}
            <Pressable
              style={styles.rememberRow}
              onPress={toggleRememberMe}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: rememberMe }}
              accessibilityLabel={t('auth.createNewPassword.rememberMe', 'Remember me')}
            >
              <View
                style={[
                  styles.checkbox,
                  rememberMe ? styles.checkboxChecked : styles.checkboxUnchecked,
                ]}
              >
                {rememberMe && (
                  <Check size={14} color="#FFFFFF" weight="bold" />
                )}
              </View>
              <Text style={styles.rememberText}>
                {t('auth.createNewPassword.rememberMe', 'Remember me')}
              </Text>
            </Pressable>
          </ScrollView>

          {/* Pastki Asosiy Tugma: "Continue" */}
          <View
            style={[
              styles.footer,
              {
                paddingBottom: Math.max(insets.bottom, 20),
              },
            ]}
          >
            <DuoButton
              title={t('auth.createNewPassword.continueButton', 'Continue')}
              type="primary"
              borderRadius={28}
              disabled={false}
              textStyle={styles.continueButtonText}
              accessibilityLabel={t('auth.createNewPassword.continueButton', 'Continue')}
              accessibilityHint="Saves your new password"
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
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  backButton: {
    padding: 4,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.headingDark,
    lineHeight: 40,
    letterSpacing: -0.5,
    marginTop: 8,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    lineHeight: 24,
    marginBottom: 36,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.headingDark,
    marginBottom: 8,
  },
  confirmLabelSpacing: {
    marginTop: 28,
  },
  inputUnderline: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
  },
  inputDefault: {
    borderBottomWidth: 1.5,
    borderBottomColor: theme.colors.physicsIndigoBorder,
  },
  inputFocused: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.physicsIndigo,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.headingDark,
    padding: 0,
    letterSpacing: -0.2,
  },
  iconButton: {
    padding: 4,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.badgeHeartRed,
    marginTop: 10,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.physicsIndigo,
  },
  checkboxUnchecked: {
    borderWidth: 2,
    borderColor: theme.colors.physicsIndigoBorder,
    backgroundColor: 'transparent',
  },
  rememberText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.headingDark,
    marginLeft: 12,
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
