import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle, Lightning, Sparkle } from 'phosphor-react-native';
import { HapticFeedback } from '../../core/haptics';

export interface DuolingoCelebrationBannerProps {
  visible: boolean;
  xpEarned: number;
  headline?: string;
  onContinue: () => void;
}

/**
 * Authentic Duolingo-style celebratory bottom sheet banner with Reanimated 3 spring physics.
 * 60-120fps GPU driven with tactile extrusion button and smooth entrance/exit transitions.
 */
export const DuolingoCelebrationBanner: React.FC<DuolingoCelebrationBannerProps> = ({
  visible,
  xpEarned,
  headline = 'Ajoyib!',
  onContinue,
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(320);
  const opacity = useSharedValue(0);
  const btnScale = useSharedValue(1);
  const btnTranslateY = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      HapticFeedback.success();
      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 180,
      });
      opacity.value = withTiming(1, { duration: 180 });
    } else {
      translateY.value = withTiming(320, {
        duration: 220,
        easing: Easing.in(Easing.ease),
      });
      opacity.value = withTiming(0, { duration: 180 });
    }
  }, [visible, translateY, opacity]);

  const animatedContainer = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const animatedBtn = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }, { translateY: btnTranslateY.value }],
  }));

  const handlePressIn = () => {
    HapticFeedback.light();
    btnScale.value = withSpring(0.98, { damping: 16, stiffness: 350 });
    btnTranslateY.value = withSpring(3, { damping: 16, stiffness: 350 });
  };

  const handlePressOut = () => {
    btnScale.value = withSpring(1, { damping: 14, stiffness: 260 });
    btnTranslateY.value = withSpring(0, { damping: 14, stiffness: 260 });
  };

  const handleContinuePress = () => {
    HapticFeedback.medium();
    onContinue();
  };

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[
        styles.bannerContainer,
        { paddingBottom: Math.max(20, insets.bottom + 12) },
        animatedContainer,
      ]}
    >
      {/* Top row: Checkmark circle + Heading & XP */}
      <View style={styles.contentRow}>
        <View style={styles.checkBadge}>
          <CheckCircle size={32} color="#58CC02" weight="fill" />
        </View>

        <View style={styles.textColumn}>
          <View style={styles.headingRow}>
            <Text style={styles.headlineText}>{headline}</Text>
            <Sparkle size={18} color="#58CC02" weight="fill" />
          </View>

          <View style={styles.xpPill}>
            <Lightning size={14} color="#58A700" weight="fill" />
            <Text style={styles.xpText}>+{xpEarned} XP OLINDI! 🎉</Text>
          </View>
        </View>
      </View>

      {/* Chunky 3D Duolingo Green Continue Button */}
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleContinuePress}
        accessibilityRole="button"
        accessibilityLabel="Keyingi qadamga o'tish"
      >
        <Animated.View style={[styles.continueButton, animatedBtn]}>
          <Text style={styles.continueButtonText}>DAVOM ETISH</Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#D7FFB8',
    borderTopWidth: 2,
    borderTopColor: '#B8F28B',
    paddingHorizontal: 20,
    paddingTop: 18,
    gap: 16,
    zIndex: 100,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  checkBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#B8F28B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#58CC02',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  textColumn: {
    flex: 1,
    gap: 3,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headlineText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#277A00',
    letterSpacing: -0.4,
  },
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  xpText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#3B8700',
    letterSpacing: 0.3,
  },
  continueButton: {
    width: '100%',
    backgroundColor: '#58CC02',
    borderRadius: 18,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderColor: '#46A302',
    borderBottomColor: '#3B8700',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
});
