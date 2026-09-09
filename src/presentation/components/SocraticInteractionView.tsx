import React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ActivityIndicator } from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { Lightbulb, ArrowClockwise, Check, Sparkle } from 'phosphor-react-native';
import { InteractionFormat } from '../../domain/entities/SocraticState';
import { theme } from '../../core/theme';
import { HapticFeedback } from '../../core/haptics';

interface Props {
  format: InteractionFormat;
  quickOptions?: string[];
  hintText?: string;
  isSubmitting?: boolean;
  onSubmit: (response: string) => void;
}

export const SocraticInteractionView: React.FC<Props> = ({
  format,
  quickOptions,
  hintText,
  isSubmitting = false,
  onSubmit,
}) => {
  const [text, setText] = React.useState('');

  const handlePress = (val: string) => {
    if (isSubmitting) return;
    HapticFeedback.medium();
    onSubmit(val);
  };

  // 1. MULTIPLE_CHOICE (Duolingo style 3D buttons)
  if (format === 'MULTIPLE_CHOICE' && quickOptions && quickOptions.length > 0) {
    return (
      <Animated.View entering={FadeInDown.duration(300)} style={styles.container}>
        {quickOptions.map((opt, i) => (
          <Pressable
            key={i}
            disabled={isSubmitting}
            style={({ pressed }) => [
              styles.choiceButton,
              pressed && styles.choiceButtonPressed,
              isSubmitting && styles.disabledButton,
            ]}
            onPress={() => handlePress(opt)}
          >
            <View style={styles.choiceDot}>
              <Text style={styles.choiceDotText}>{String.fromCharCode(65 + i)}</Text>
            </View>
            <Text style={styles.choiceButtonText}>{opt}</Text>
          </Pressable>
        ))}
      </Animated.View>
    );
  }

  // 2. OPEN_QUESTION (Clean numeric / formula input with Duolingo submit button)
  if (format === 'OPEN_QUESTION') {
    return (
      <Animated.View entering={FadeInDown.duration(300)} style={styles.container}>
        <View style={styles.inputCard}>
          <TextInput
            style={styles.textInput}
            placeholder="Javobingizni kiriting (masalan: x = 4)..."
            placeholderTextColor="#9CA3AF"
            value={text}
            onChangeText={setText}
            editable={!isSubmitting}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <Pressable
          disabled={isSubmitting || !text.trim()}
          style={({ pressed }) => [
            styles.primaryDuoBtn,
            (!text.trim() || isSubmitting) && styles.disabledButton,
            pressed && styles.primaryDuoBtnPressed,
          ]}
          onPress={() => {
            handlePress(text.trim());
            setText('');
          }}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.primaryDuoBtnText}>Javobni Tekshirish</Text>
          )}
        </Pressable>
      </Animated.View>
    );
  }

  // 3. HINT_OVERLAY (Encouraging Socratic hint card)
  if (format === 'HINT_OVERLAY') {
    return (
      <Animated.View entering={FadeInUp.duration(350)} style={styles.container}>
        <View style={styles.hintOverlayBox}>
          <View style={styles.hintHeaderRow}>
            <View style={styles.hintIconCircle}>
              <Lightbulb size={22} color="#D97706" weight="fill" />
            </View>
            <Text style={styles.hintTitle}>Ustozning ko'rsatmasi</Text>
          </View>
          <Text style={styles.hintBodyText}>
            {hintText || "Qoidani yana bir bor eslaymiz: qavs ochilganda ishoralarga diqqat qiling."}
          </Text>
        </View>

        <Pressable
          disabled={isSubmitting}
          style={styles.secondaryDuoBtn}
          onPress={() => handlePress("HINT_ACKNOWLEDGED")}
        >
          <Text style={styles.secondaryDuoBtnText}>Tushunarli, davom etamiz</Text>
        </Pressable>
      </Animated.View>
    );
  }

  // 4. RETRY_PROMPT (Gentle Duolingo retry prompt)
  if (format === 'RETRY_PROMPT') {
    return (
      <Animated.View entering={FadeInUp.duration(350)} style={styles.container}>
        {hintText ? (
          <View style={styles.warningHintBox}>
            <Text style={styles.warningHintText}>{hintText}</Text>
          </View>
        ) : null}

        <Pressable
          disabled={isSubmitting}
          style={styles.retryDuoBtn}
          onPress={() => handlePress("RETRY")}
        >
          <ArrowClockwise size={20} color="#FFFFFF" weight="bold" />
          <Text style={styles.retryDuoBtnText}>Qaytadan urinib ko'rish</Text>
        </Pressable>
      </Animated.View>
    );
  }

  // 5. INFO_CARD (Celebration / Clarification informational card)
  if (format === 'INFO_CARD') {
    return (
      <Animated.View entering={FadeInUp.duration(350)} style={styles.container}>
        <Pressable
          disabled={isSubmitting}
          style={styles.victoryDuoBtn}
          onPress={() => handlePress("CONTINUE")}
        >
          <Sparkle size={22} color="#FFFFFF" weight="fill" />
          <Text style={styles.victoryDuoBtnText}>Davom etish</Text>
        </Pressable>
      </Animated.View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    paddingTop: 8,
    gap: 12,
  },
  choiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderColor: '#E5E7EB',
    borderBottomColor: '#D1D5DB',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  choiceButtonPressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 3,
  },
  choiceDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
  },
  choiceDotText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6B7280',
  },
  choiceButtonText: {
    flex: 1,
    fontSize: 15.5,
    fontWeight: '700',
    color: '#1F2937',
    lineHeight: 21,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: '#E5E7EB',
    borderBottomColor: '#D1D5DB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textInput: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    minHeight: 36,
  },
  primaryDuoBtn: {
    backgroundColor: '#58CC02',
    borderRadius: 18,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderColor: '#46A302',
    borderBottomColor: '#2B6C00',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryDuoBtnPressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 3,
  },
  primaryDuoBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  hintOverlayBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 18,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: '#FDE68A',
    borderBottomColor: '#F59E0B',
    padding: 16,
    gap: 8,
  },
  hintHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hintIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#B45309',
  },
  hintBodyText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    color: '#92400E',
  },
  secondaryDuoBtn: {
    backgroundColor: '#3B82F6',
    borderRadius: 18,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderColor: '#2563EB',
    borderBottomColor: '#1D4ED8',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryDuoBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  warningHintBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FECACA',
    padding: 12,
  },
  warningHintText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#B91C1C',
    lineHeight: 19,
    textAlign: 'center',
  },
  retryDuoBtn: {
    flexDirection: 'row',
    backgroundColor: '#EF4444',
    borderRadius: 18,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderColor: '#DC2626',
    borderBottomColor: '#991B1B',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  retryDuoBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  victoryDuoBtn: {
    flexDirection: 'row',
    backgroundColor: '#FF9600',
    borderRadius: 18,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderColor: '#CC7800',
    borderBottomColor: '#995A00',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  victoryDuoBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
