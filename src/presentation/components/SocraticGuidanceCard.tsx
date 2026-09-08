import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { Lightbulb, ArrowClockwise, X } from 'phosphor-react-native';
import { HapticFeedback } from '../../core/haptics';
import { formatEducationalMathText } from '../../domain/entities/SocraticDialogue';
import { RichMathText } from './RichMathText';

export interface SocraticGuidanceCardProps {
  visible: boolean;
  hintText: string;
  title?: string;
  retryLabel?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

/**
 * Calm, elegant yellow/amber hint card with gentle Socratic guidance.
 * Designed according to Apple HIG and Duolingo pedagogy principles.
 */
export const SocraticGuidanceCard: React.FC<SocraticGuidanceCardProps> = ({
  visible,
  hintText,
  title = 'Sokratik Maslahat',
  retryLabel = 'Boshqa variantni tanlash',
  onRetry,
  onDismiss,
}) => {
  if (!visible || !hintText) {
    return null;
  }

  const formattedHint = formatEducationalMathText(hintText);

  const handleRetry = () => {
    HapticFeedback.light();
    if (onRetry) {
      onRetry();
    }
  };

  const handleDismiss = () => {
    HapticFeedback.light();
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(18).stiffness(220)}
      exiting={FadeOutUp.duration(160)}
      style={styles.cardContainer}
    >
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <View style={styles.iconCircle}>
            <Lightbulb size={16} color="#D97706" weight="fill" />
          </View>
          <Text style={styles.titleText}>{title}</Text>
        </View>

        {onDismiss ? (
          <Pressable
            style={styles.closeBtn}
            onPress={handleDismiss}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Dismiss hint"
          >
            <X size={14} color="#92400E" weight="bold" />
          </Pressable>
        ) : null}
      </View>

      {/* Guidance explanation text */}
      <RichMathText style={styles.bodyText}>{formattedHint}</RichMathText>

      {/* Action footer */}
      {onRetry ? (
        <View style={styles.actionRow}>
          <Pressable
            style={styles.retryChip}
            onPress={handleRetry}
            accessibilityRole="button"
            accessibilityLabel={retryLabel}
          >
            <ArrowClockwise size={13} color="#92400E" weight="bold" />
            <Text style={styles.retryChipText}>{retryLabel}</Text>
          </Pressable>
        </View>
      ) : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFBEB',
    borderRadius: 18,
    borderWidth: 1.5,
    borderBottomWidth: 4,
    borderColor: '#FDE68A',
    borderBottomColor: '#F59E0B',
    padding: 14,
    gap: 10,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
    letterSpacing: -0.2,
  },
  closeBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#78350F',
    lineHeight: 19,
    paddingLeft: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  retryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  retryChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
});
