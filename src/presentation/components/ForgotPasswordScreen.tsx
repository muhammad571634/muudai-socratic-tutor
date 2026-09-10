// O'ylanish: Ushbu komponent parolni unutganda tiklash (Forgot Password) ekranidir.
// Apple Minimalist va Duolingo uslubida: orqaga qaytish o'qi, "Forgot Password 🔑" sarlavhasi,
// tushuntirish subtitri ("Enter your email address to get an OTP code to reset your password."),
// email uchun pastki chiziqli (underline) kiritish maydoni va pastki qismda "Continue" DuoButton tugmasi.
// Muvaffaqiyatli yuborilganda tasdiqlovchi xabar (success feedback) ko'rsatiladi va kirish sahifasiga qaytish imkoni beriladi.

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
import { ArrowLeft, CheckCircle, X } from 'phosphor-react-native';
import { DuoButton } from './DuoButton';
import { theme } from '../../core/theme';
import { HapticFeedback } from '../../core/haptics';

export interface ForgotPasswordScreenProps {
  onBack: () => void;
  onSubmitSuccess?: (email: string) => void;
  onContinue?: (email: string) => void;
  initialEmail?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValidEmail = (value: string): boolean => EMAIL_REGEX.test(value.trim());

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onBack,
  onSubmitSuccess,
  onContinue,
  initialEmail = '',
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState<string>(initialEmail);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const inputRef = useRef<TextInput | null>(null);

  // Synchronize initialEmail if updated by parent
  useEffect(() => {
    if (initialEmail && !email) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  // Android apparat "Back" tugmasi hodisasini boshqarish
  useEffect(() => {
    const backAction = () => {
      onBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [onBack]);

  const handleClear = () => {
    HapticFeedback.light();
    setEmail('');
    inputRef.current?.focus();
  };

  const handleContinue = () => {
    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) {
      HapticFeedback.error();
      setValidationError(
        t('auth.forgotPassword.invalidEmail', 'Please enter a valid email address')
      );
      inputRef.current?.focus();
      return;
    }

    setValidationError(null);
    HapticFeedback.success();
    if (onContinue) {
      onContinue(trimmed);
    } else if (onSubmitSuccess) {
      onSubmitSuccess(trimmed);
    } else {
      setIsSuccess(true);
    }
  };

  const handleFinishAndReturn = () => {
    HapticFeedback.medium();
    if (onSubmitSuccess) {
      onSubmitSuccess(email.trim());
    } else {
      onBack();
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

        {/* Top Header: Back Arrow */}
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
            accessibilityHint="Navigates back to sign in screen"
          >
            <ArrowLeft size={24} color={theme.colors.headingDark} weight="bold" />
          </Pressable>
        </View>

        {isSuccess ? (
          /* Muvaffaqiyatli OTP yuborildi holati (Success Feedback View) */
          <View style={styles.successContainer}>
            <View style={styles.successCard}>
              <View style={styles.successIconBadge}>
                <CheckCircle size={44} color={theme.colors.successGreen} weight="fill" />
              </View>

              <Text style={styles.successTitle}>
                {t('auth.forgotPassword.successTitle', 'OTP Code Sent! 📩')}
              </Text>

              <Text style={styles.successMessage}>
                {t(
                  'auth.forgotPassword.successMessage',
                  "We've sent an OTP code to {{email}} to reset your password.",
                  { email: email.trim() }
                )}
              </Text>
            </View>

            <View
              style={[
                styles.footer,
                {
                  paddingBottom: Math.max(insets.bottom, 20),
                },
              ]}
            >
              <DuoButton
                title={t('auth.forgotPassword.backToSignIn', 'Back to Sign In')}
                type="primary"
                borderRadius={28}
                textStyle={styles.continueButtonText}
                accessibilityLabel={t('auth.forgotPassword.backToSignIn', 'Back to Sign In')}
                onPress={handleFinishAndReturn}
              />
            </View>
          </View>
        ) : (
          /* Form Body inside KeyboardAvoidingView */
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
              {/* Screen Title: "Forgot Password 🔑" */}
              <Text style={styles.title}>
                {t('auth.forgotPassword.title', 'Forgot Password 🔑')}
              </Text>

              {/* Subtitle Description */}
              <Text style={styles.subtitle}>
                {t(
                  'auth.forgotPassword.subtitle',
                  'Enter your email address to get an OTP code to reset your password.'
                )}
              </Text>

              {/* Field Label: "Email" */}
              <Text style={styles.label}>
                {t('auth.forgotPassword.emailLabel', 'Email')}
              </Text>

              {/* Underline Input */}
              <View
                style={[
                  styles.inputContainer,
                  isFocused || email.length > 0
                    ? styles.inputContainerFocused
                    : styles.inputContainerDefault,
                ]}
              >
                <TextInput
                  ref={inputRef}
                  style={styles.textInput}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder={t(
                    'auth.forgotPassword.emailPlaceholder',
                    'andrew.ainsley@yourdomain.com'
                  )}
                  placeholderTextColor={theme.colors.textTertiary}
                  autoFocus
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                  autoComplete="email"
                  returnKeyType="done"
                  onSubmitEditing={handleContinue}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  maxLength={100}
                  selectionColor={theme.colors.physicsIndigo}
                  cursorColor={theme.colors.physicsIndigo}
                  accessibilityLabel={t('auth.forgotPassword.emailLabel', 'Email')}
                  accessibilityHint="Enter your email address to get a reset code"
                />

                {isFocused && email.length > 0 && (
                  <Pressable
                    onPress={handleClear}
                    style={styles.clearButton}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Clear email text"
                  >
                    <View style={styles.clearCircle}>
                      <X size={14} color={theme.colors.textSecondary} weight="bold" />
                    </View>
                  </Pressable>
                )}
              </View>

              {validationError && (
                <Text style={styles.errorText}>{validationError}</Text>
              )}
            </ScrollView>

            {/* Bottom Sticky "Continue" Button */}
            <View
              style={[
                styles.footer,
                {
                  paddingBottom: Math.max(insets.bottom, 20),
                },
              ]}
            >
              <DuoButton
                title={t('auth.forgotPassword.submitButton', 'Continue')}
                type="primary"
                borderRadius={28}
                disabled={false}
                textStyle={styles.continueButtonText}
                accessibilityLabel={t('auth.forgotPassword.submitButton', 'Continue')}
                accessibilityHint="Sends OTP reset code to your email"
                onPress={handleContinue}
              />
            </View>
          </KeyboardAvoidingView>
        )}
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
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.headingDark,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
  },
  inputContainerDefault: {
    borderBottomWidth: 1.5,
    borderBottomColor: theme.colors.physicsIndigoBorder,
  },
  inputContainerFocused: {
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
  errorText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.badgeHeartRed,
    marginTop: 10,
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
  successContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  successCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  successIconBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.badgeOnlineBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: theme.colors.badgeOnlineBorder,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.headingDark,
    textAlign: 'center',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
