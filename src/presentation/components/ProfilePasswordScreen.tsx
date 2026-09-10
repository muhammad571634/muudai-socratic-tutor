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
import { ArrowLeft, Eye, EyeSlash } from 'phosphor-react-native';
import { DuoButton } from './DuoButton';
import { theme } from '../../core/theme';
import { HapticFeedback } from '../../core/haptics';
import { useAppStore } from '../state/useAppStore';

export interface ProfilePasswordScreenProps {
  onBack: () => void;
  onContinue: (password: string) => void;
  initialPassword?: string;
}

export const ProfilePasswordScreen: React.FC<ProfilePasswordScreenProps> = ({
  onBack,
  onContinue,
  initialPassword = '',
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const setStudentPassword = useAppStore((state) => state.setStudentPassword);

  const [password, setPassword] = useState<string>(initialPassword);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
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

  // Prop o'zgarganda yoki orqaga qaytib kelganda parolni tiklash
  useEffect(() => {
    if (initialPassword && !password) {
      setPassword(initialPassword);
    }
  }, [initialPassword]);

  // Oddiy tekshiruv: parol kamida 6 belgi bo'lsin
  const isContinueDisabled = password.trim().length < 6;

  const handleContinue = () => {
    const trimmed = password.trim();
    if (trimmed.length < 6) {
      HapticFeedback.error();
      return;
    }
    HapticFeedback.medium();
    setStudentPassword(trimmed);
    onContinue(trimmed);
  };

  const togglePasswordVisibility = () => {
    HapticFeedback.light();
    setIsPasswordVisible(!isPasswordVisible);
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
              {/* Parol bosqichi — 100% to'liq qadam */}
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
              {t('onboarding.profilePassword.title', 'Create a password')} 🔐
            </Text>

            {/* Field Label */}
            <Text style={styles.label}>
              {t('onboarding.profilePassword.passwordLabel', 'Password')}
            </Text>

            {/* Input Row with Bottom Border Underline */}
            <View
              style={[
                styles.inputContainer,
                isFocused || password.length > 0
                  ? styles.inputContainerActive
                  : styles.inputContainerDefault,
              ]}
            >
              <TextInput
                ref={inputRef}
                style={styles.textInput}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••••••"
                placeholderTextColor={theme.colors.textTertiary}
                autoFocus
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="password"
                returnKeyType="done"
                onSubmitEditing={handleContinue}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                maxLength={50}
                selectionColor={theme.colors.physicsIndigo}
                cursorColor={theme.colors.physicsIndigo}
                accessibilityLabel={t('onboarding.profilePassword.passwordLabel', 'Password')}
                accessibilityHint="Create a password for your account"
              />

              <Pressable
                onPress={togglePasswordVisibility}
                style={styles.eyeButton}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Toggle password visibility"
              >
                {isPasswordVisible ? (
                  <Eye size={24} color={theme.colors.physicsIndigo} weight="bold" />
                ) : (
                  <EyeSlash size={24} color={theme.colors.physicsIndigo} weight="bold" />
                )}
              </Pressable>
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
              title={t('onboarding.profilePassword.continue', 'Continue')}
              type="primary"
              borderRadius={28}
              disabled={isContinueDisabled}
              textStyle={styles.continueButtonText}
              accessibilityLabel={t('onboarding.profilePassword.continue', 'Continue')}
              accessibilityHint="Saves your password and completes profile setup"
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
    width: 200,
    height: 10,
    backgroundColor: theme.colors.progressTrackBg,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    width: '100%',
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
  inputContainerActive: {
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
  eyeButton: {
    padding: 4,
    marginLeft: 8,
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
    letterSpacing: 0,
  },
});
