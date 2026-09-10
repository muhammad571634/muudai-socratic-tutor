// O'ylanish: Ushbu komponent elektron pochtaga yuborilgan 4 xonali OTP kodini tasdiqlash ekranidir.
// Mockup media_1789054142349.png asosida Apple Minimalist va Duolingo uslubida yaratilgan:
// - Tepada orqaga qaytish o'qi (ArrowLeft)
// - "You've got mail 📩" sarlavhasi
// - Tushuntirish matni ("We have sent the OTP verification code to your email address. Check your email and enter the code below.")
// - 4 ta raqamli OTP katakchalari ([ 4 ] [ 6 ] [ 7 ] [   ]) - har bir katakcha alohida bosilishi mumkin, faol katakcha binafsha hoshiyali va fonli
// - Qayta yuborish bo'limi: "Didn't receive email?" va "You can resend code in 55 s" (55 s qismi binafsha rangda, 0 bo'lganda "Resend code" havolasi)
// - "Confirm" DuoButton tugmasi
// - Pastki maxsus raqamli klaviatura (1 2 3 / 4 5 6 / 7 8 9 / * 0 ⌫) va apparat/skrinrider klaviaturasi to'liq qo'llab-quvvatlovi.

import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  BackHandler,
  StatusBar,
  TextInput,
  Keyboard,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Backspace } from 'phosphor-react-native';
import { DuoButton } from './DuoButton';
import { theme } from '../../core/theme';
import { HapticFeedback } from '../../core/haptics';

export interface OtpVerificationScreenProps {
  email?: string;
  onBack: () => void;
  onConfirm: (code: string) => void;
  onResendCode?: () => void;
  initialTimerSeconds?: number;
  expectedCode?: string;
}

const KEYPAD_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['*', '0', 'delete'],
];

export const OtpVerificationScreen: React.FC<OtpVerificationScreenProps> = ({
  email,
  onBack,
  onConfirm,
  onResendCode,
  initialTimerSeconds = 55,
  expectedCode,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [code, setCode] = useState<string>('');
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [timer, setTimer] = useState<number>(initialTimerSeconds);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);

  const hiddenInputRef = useRef<TextInput | null>(null);

  // Mobil qurilmalarda dasturiy klaviatura ochilganda maxsus klaviatura bilan to'qnashmasligini ta'minlash
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setIsKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setIsKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Android apparat "Back" tugmasi hodisasini boshqarish
  useEffect(() => {
    const backAction = () => {
      onBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [onBack]);

  // Qayta yuborish sanagichi (Countdown timer) — xotira toza va har soniyada qayta obuna bo'lmaydi
  useEffect(() => {
    if (timer <= 0) return;
    const intervalId = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer > 0]);

  const handleKeyPress = (key: string) => {
    if (key === 'delete') {
      handleDelete();
      return;
    }

    if (key === '*') {
      HapticFeedback.light();
      return;
    }

    if (/^[0-9]$/.test(key)) {
      HapticFeedback.light();
      if (validationError) {
        setValidationError(null);
      }

      // 4 xonali massivga kiritish va fokusni keyingi katakka surish
      const digits = [code[0] || '', code[1] || '', code[2] || '', code[3] || ''];
      digits[focusedIndex] = key;
      const newCode = digits.join('');
      setCode(newCode);

      if (focusedIndex < 3) {
        setFocusedIndex(focusedIndex + 1);
      }
    }
  };

  const handleDelete = () => {
    HapticFeedback.light();
    if (validationError) {
      setValidationError(null);
    }

    const digits = [code[0] || '', code[1] || '', code[2] || '', code[3] || ''];

    if (digits[focusedIndex]) {
      // Joriy katakda raqam bo'lsa, uni tozalash
      digits[focusedIndex] = '';
      setCode(digits.join('').replace(/ +$/, ''));
    } else if (focusedIndex > 0) {
      // Joriy katak bo'sh bo'lsa, oldingi katakka o'tib, uni tozalash
      const prev = focusedIndex - 1;
      digits[prev] = '';
      setCode(digits.join('').replace(/ +$/, ''));
      setFocusedIndex(prev);
    }
  };

  const handleBoxPress = (index: number) => {
    HapticFeedback.light();
    setFocusedIndex(index);
  };

  const handleResend = () => {
    if (timer > 0) return;
    HapticFeedback.light();
    setTimer(initialTimerSeconds);
    if (onResendCode) {
      onResendCode();
    }
  };

  const handleConfirm = () => {
    const cleanCode = code.replace(/\s/g, '');
    if (!/^\d{4}$/.test(cleanCode)) {
      HapticFeedback.error();
      setValidationError(
        t('auth.otpVerification.invalidOtp', 'Please enter a valid 4-digit code')
      );
      return;
    }

    if (expectedCode && cleanCode !== expectedCode) {
      HapticFeedback.error();
      setValidationError(
        t('auth.otpVerification.invalidOtp', 'Please enter a valid 4-digit code')
      );
      return;
    }

    setValidationError(null);
    HapticFeedback.success();
    onConfirm(cleanCode);
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      <StatusBar barStyle="dark-content" />

      {/* Yashirin TextInput: tashqi apparat klaviaturasi, buferdan qo'yish va ekranni o'qish dasturlari uchun */}
      <TextInput
        ref={hiddenInputRef}
        style={styles.hiddenInput}
        value={code}
        onChangeText={(text) => {
          const clean = text.replace(/[^0-9]/g, '').slice(0, 4);
          setCode(clean);
          setFocusedIndex(Math.min(clean.length, 3));
          if (validationError) setValidationError(null);
        }}
        keyboardType="number-pad"
        maxLength={4}
        caretHidden
        accessibilityLabel="OTP Code Input"
      />

      {/* Yuqori qism: Orqaga qaytish tugmasi */}
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
          accessibilityHint="Navigates back to forgot password screen"
        >
          <ArrowLeft size={24} color={theme.colors.headingDark} weight="bold" />
        </Pressable>
      </View>

      {/* Asosiy kontent maydoni (Kichik ekranlarda ham to'liq sig'ishi uchun ScrollView) */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Sarlavha: "You've got mail 📩" */}
        <Text style={styles.title}>
          {t('auth.otpVerification.title', "You've got mail 📩")}
        </Text>

        {/* Tushuntirish matni */}
        <Text style={styles.subtitle}>
          {t(
            'auth.otpVerification.subtitle',
            'We have sent the OTP verification code to your email address. Check your email and enter the code below.'
          )}
        </Text>

        {/* 4 ta OTP katakchalari: har biri bosiladigan va faol holati binafsha rangda ajralib turadi */}
        <View style={styles.otpRow}>
          {[0, 1, 2, 3].map((index) => {
            const digit = code[index] && code[index] !== ' ' ? code[index] : '';
            const isActive = index === focusedIndex;

            return (
              <Pressable
                key={index}
                onPress={() => handleBoxPress(index)}
                style={[
                  styles.otpBox,
                  isActive && styles.otpBoxActive,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`OTP digit ${index + 1}: ${digit || 'empty'}`}
                accessibilityHint="Double tap to edit this digit"
              >
                <Text style={styles.otpDigit}>{digit}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Tekshiruv xatoligi matni */}
        {validationError && (
          <Text style={styles.errorText}>{validationError}</Text>
        )}

        {/* Qayta yuborish bo'limi: "Didn't receive email?" va "You can resend code in 55 s" (55 s binafsha rangda) */}
        <View style={styles.resendContainer}>
          <Text style={styles.didntReceiveText}>
            {t('auth.otpVerification.didntReceive', "Didn't receive email?")}
          </Text>

          {timer > 0 ? (
            <Text style={styles.timerText}>
              {(() => {
                const translated = t(
                  'auth.otpVerification.resendTimer',
                  'You can resend code in {{seconds}} s',
                  { seconds: timer }
                );
                const parts = translated.split(/(\d+\s*(?:soniyada|soniya|s|с)?)/i);
                return parts.map((part, i) => {
                  const isMatch = /^\d+\s*(?:soniyada|soniya|s|с)?$/i.test(part);
                  if (isMatch) {
                    return (
                      <Text key={i} style={styles.timerHighlight}>
                        {part}
                      </Text>
                    );
                  }
                  return <React.Fragment key={i}>{part}</React.Fragment>;
                });
              })()}
            </Text>
          ) : (
            <Pressable
              onPress={handleResend}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel={t('auth.otpVerification.resendNow', 'Resend code')}
            >
              <Text style={styles.resendLinkText}>
                {t('auth.otpVerification.resendNow', 'Resend code')}
              </Text>
            </Pressable>
          )}
        </View>

        {/* "Confirm" Asosiy Harakat Tugmasi */}
        <View style={styles.confirmButtonContainer}>
          <DuoButton
            title={t('auth.otpVerification.confirmButton', 'Confirm')}
            type="primary"
            borderRadius={28}
            disabled={false}
            textStyle={styles.confirmButtonText}
            accessibilityLabel={t('auth.otpVerification.confirmButton', 'Confirm')}
            accessibilityHint="Verifies entered OTP code"
            onPress={handleConfirm}
          />
        </View>
      </ScrollView>

      {/* Maxsus Pastki Raqamli Klaviatura (Dasturiy klaviatura ochiq bo'lmaganda ko'rinadi) */}
      {!isKeyboardVisible && (
        <View style={styles.keypadContainer}>
          {KEYPAD_ROWS.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keypadRow}>
              {row.map((key) => {
                if (key === 'delete') {
                  return (
                    <Pressable
                      key={key}
                      onPress={handleDelete}
                      style={({ pressed }) => [
                        styles.keypadKey,
                        pressed && styles.keypadKeyPressed,
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel="Delete"
                      accessibilityHint="Deletes last digit"
                    >
                      <Backspace
                        size={26}
                        color={theme.colors.headingDark}
                        weight="bold"
                      />
                    </Pressable>
                  );
                }

                return (
                  <Pressable
                    key={key}
                    onPress={() => handleKeyPress(key)}
                    style={({ pressed }) => [
                      styles.keypadKey,
                      pressed && styles.keypadKeyPressed,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={key === '*' ? 'Asterisk' : `Digit ${key}`}
                  >
                    <Text style={styles.keypadText}>{key}</Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.headingDark,
    lineHeight: 40,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    lineHeight: 24,
    marginBottom: 28,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  otpBox: {
    flex: 1,
    maxWidth: 72,
    height: 68,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceMuted,
    borderWidth: 1.5,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  otpBoxActive: {
    borderWidth: 2,
    borderColor: theme.colors.physicsIndigo,
    backgroundColor: theme.colors.physicsIndigoLight,
  },
  otpDigit: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.headingDark,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.badgeHeartRed,
    textAlign: 'center',
    marginBottom: 12,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  didntReceiveText: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.headingDark,
    marginBottom: 6,
  },
  timerText: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  timerHighlight: {
    color: theme.colors.physicsIndigo,
    fontWeight: '700',
  },
  resendLinkText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.physicsIndigo,
  },
  confirmButtonContainer: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 12,
  },
  confirmButtonText: {
    textTransform: 'none',
    fontSize: 17,
    fontWeight: '700',
  },
  keypadContainer: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: theme.colors.surfaceLight,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  keypadKey: {
    flex: 1,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  keypadKeyPressed: {
    backgroundColor: theme.colors.surfaceMuted,
  },
  keypadText: {
    fontSize: 26,
    fontWeight: '600',
    color: theme.colors.headingDark,
  },
});
