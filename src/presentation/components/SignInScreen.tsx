// O'ylanish: Ushbu komponent MuudAI tizimiga kirish (Sign In) ekranidir.
// Apple Minimalist va Duolingo uslubida: orqaga qaytish o'qi, "Hello there 👋" sarlavhasi,
// email va parol uchun pastki chiziqli (underline) kiritish maydonlari, ko'rsatish/yashirish
// ko'z ikonkasi, "Remember me" maxsus binafsha rangli katakcha (checkbox), markazlashtirilgan
// "Forgot Password?" havolasi va pastki qismda "SIGN IN" DuoButton tugmasidan iborat.

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
import { ArrowLeft, Eye, EyeSlash, Check, X } from 'phosphor-react-native';
import { DuoButton } from './DuoButton';
import { theme } from '../../core/theme';
import { HapticFeedback } from '../../core/haptics';

export interface SignInScreenProps {
  onBack: () => void;
  onForgotPassword: () => void;
  onSignInSuccess: (credentials: { email: string; rememberMe: boolean }) => void;
  initialEmail?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValidEmail = (value: string): boolean => EMAIL_REGEX.test(value.trim());

export const SignInScreen: React.FC<SignInScreenProps> = ({
  onBack,
  onForgotPassword,
  onSignInSuccess,
  initialEmail = '',
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState<string>(initialEmail);
  const [password, setPassword] = useState<string>('');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [emailFocused, setEmailFocused] = useState<boolean>(false);
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const emailInputRef = useRef<TextInput | null>(null);
  const passwordInputRef = useRef<TextInput | null>(null);

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

  const togglePasswordVisibility = () => {
    HapticFeedback.light();
    setIsPasswordVisible((prev) => !prev);
  };

  const toggleRememberMe = () => {
    HapticFeedback.light();
    setRememberMe((prev) => !prev);
  };

  const handleClearEmail = () => {
    HapticFeedback.light();
    setEmail('');
    emailInputRef.current?.focus();
  };

  const isFormValid = isValidEmail(email) && password.trim().length >= 6;

  const handleSignIn = () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!isValidEmail(trimmedEmail)) {
      HapticFeedback.error();
      setValidationError(
        t('auth.signIn.invalidEmail', 'Please enter a valid email address')
      );
      emailInputRef.current?.focus();
      return;
    }

    if (trimmedPassword.length < 6) {
      HapticFeedback.error();
      setValidationError(
        t('auth.signIn.invalidPassword', 'Password must be at least 6 characters')
      );
      passwordInputRef.current?.focus();
      return;
    }

    setValidationError(null);
    HapticFeedback.medium();
    onSignInSuccess({
      email: trimmedEmail,
      rememberMe,
    });
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
            accessibilityHint="Navigates to the welcome screen"
          >
            <ArrowLeft size={24} color={theme.colors.headingDark} weight="bold" />
          </Pressable>
        </View>

        {/* Scrollable Form Body inside KeyboardAvoidingView */}
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
            {/* Screen Title: "Hello there 👋" */}
            <Text style={styles.title}>
              {t('auth.signIn.title', 'Hello there 👋')}
            </Text>

            {/* Email Field Label */}
            <Text style={styles.fieldLabel}>
              {t('auth.signIn.emailLabel', 'Email')}
            </Text>

            {/* Email Underline Input */}
            <View
              style={[
                styles.inputUnderline,
                emailFocused || email.length > 0 ? styles.inputFocused : styles.inputDefault,
              ]}
            >
              <TextInput
                ref={emailInputRef}
                style={styles.textInput}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (validationError) setValidationError(null);
                }}
                placeholder={t(
                  'auth.signIn.emailPlaceholder',
                  'andrew.ainsley@yourdomain.com'
                )}
                placeholderTextColor={theme.colors.textTertiary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                autoComplete="email"
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                maxLength={100}
                selectionColor={theme.colors.physicsIndigo}
                cursorColor={theme.colors.physicsIndigo}
                accessibilityLabel={t('auth.signIn.emailLabel', 'Email')}
                accessibilityHint="Enter your email address"
              />

              {emailFocused && email.length > 0 && (
                <Pressable
                  onPress={handleClearEmail}
                  style={styles.iconButton}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Clear email"
                >
                  <View style={styles.clearCircle}>
                    <X size={14} color={theme.colors.textSecondary} weight="bold" />
                  </View>
                </Pressable>
              )}
            </View>

            {/* Password Field Label */}
            <Text style={[styles.fieldLabel, styles.passwordLabelSpacing]}>
              {t('auth.signIn.passwordLabel', 'Password')}
            </Text>

            {/* Password Underline Input */}
            <View
              style={[
                styles.inputUnderline,
                passwordFocused || password.length > 0 ? styles.inputFocused : styles.inputDefault,
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
                placeholder={t('auth.signIn.passwordPlaceholder', '••••••••••••')}
                placeholderTextColor={theme.colors.textTertiary}
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="password"
                autoComplete="password"
                returnKeyType="done"
                onSubmitEditing={handleSignIn}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                maxLength={60}
                selectionColor={theme.colors.physicsIndigo}
                cursorColor={theme.colors.physicsIndigo}
                accessibilityLabel={t('auth.signIn.passwordLabel', 'Password')}
                accessibilityHint="Enter your password"
              />

              <Pressable
                onPress={togglePasswordVisibility}
                style={styles.iconButton}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Toggle password visibility"
              >
                {isPasswordVisible ? (
                  <Eye size={22} color={theme.colors.physicsIndigo} weight="bold" />
                ) : (
                  <EyeSlash size={22} color={theme.colors.physicsIndigo} weight="bold" />
                )}
              </Pressable>
            </View>

            {/* Validation Error Message if any */}
            {validationError && (
              <Text style={styles.errorText}>{validationError}</Text>
            )}

            {/* "Remember me" Checkbox Row */}
            <Pressable
              style={styles.rememberRow}
              onPress={toggleRememberMe}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: rememberMe }}
              accessibilityLabel={t('auth.signIn.rememberMe', 'Remember me')}
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
                {t('auth.signIn.rememberMe', 'Remember me')}
              </Text>
            </Pressable>

            {/* "Forgot Password?" Centered Link */}
            <View style={styles.forgotPasswordContainer}>
              <Pressable
                onPress={() => {
                  HapticFeedback.light();
                  onForgotPassword();
                }}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel={t('auth.signIn.forgotPassword', 'Forgot Password?')}
                accessibilityHint="Navigates to password recovery"
              >
                <Text style={styles.forgotPasswordText}>
                  {t('auth.signIn.forgotPassword', 'Forgot Password?')}
                </Text>
              </Pressable>
            </View>
          </ScrollView>

          {/* Bottom Primary Action Button: "SIGN IN" */}
          <View
            style={[
              styles.footer,
              {
                paddingBottom: Math.max(insets.bottom, 20),
              },
            ]}
          >
            <DuoButton
              title={t('auth.signIn.submitButton', 'SIGN IN')}
              type="primary"
              borderRadius={28}
              disabled={false}
              textStyle={styles.signInButtonText}
              accessibilityLabel={t('auth.signIn.submitButton', 'SIGN IN')}
              accessibilityHint="Signs into your MuudAI account"
              onPress={handleSignIn}
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
    marginBottom: 36,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.headingDark,
    marginBottom: 8,
  },
  passwordLabelSpacing: {
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
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: theme.colors.physicsIndigoBorder,
  },
  rememberText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.headingDark,
    marginLeft: 12,
  },
  forgotPasswordContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    marginTop: 24,
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.physicsIndigo,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    width: '100%',
    backgroundColor: theme.colors.background,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});
