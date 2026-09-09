// O'ylanish: Ushbu komponent ekranning quyi qismida suzuvchi (floating dock)
// Apple-minimalist boshqaruv panelidir. Markazda katta 3D Sokratik Kamera tugmasi,
// yonlarida esa Daily Chest va Virtual Lab kabi tezkor tugmalar joylashgan.
// SafeAreaInsets orqali barcha qurilmalarga to'liq moslashadi va har bir tugma taktil spring animatsiyaga ega.

import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Scan, Gift, Flask, Sparkle } from 'phosphor-react-native';
import { theme } from '../../core/theme';
import { HapticFeedback } from '../../core/haptics';

export interface FloatingCameraDockProps {
  onOpenScanner: () => void;
  onOpenChest: () => void;
  onOpenLab?: () => void;
  hasChestNotification?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TactileDockButtonProps {
  onPress: () => void;
  accessibilityLabel: string;
  children: React.ReactNode;
  style?: object;
  scaleDown?: number;
}

const TactileDockButton: React.FC<TactileDockButtonProps> = ({
  onPress,
  accessibilityLabel,
  children,
  style,
  scaleDown = 0.93,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    HapticFeedback.light();
    scale.value = withSpring(scaleDown, { damping: 14, stiffness: 350, mass: 0.8 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 260, mass: 0.8 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
};

export const FloatingCameraDock: React.FC<FloatingCameraDockProps> = ({
  onOpenScanner,
  onOpenChest,
  onOpenLab,
  hasChestNotification = true,
}) => {
  const insets = useSafeAreaInsets();
  const bottomPosition = Math.max(16, insets.bottom + 6);

  return (
    <View style={[styles.dockContainer, { bottom: bottomPosition }]} pointerEvents="box-none">
      <View style={styles.dockGlassCard}>
        {/* Chapdagi Sirli Sandiq Tugmasi */}
        <TactileDockButton
          style={styles.dockSideButton}
          onPress={onOpenChest}
          accessibilityLabel="Daily Mystery Chest"
        >
          <View style={styles.chestIconContainer}>
            <Gift size={22} color={theme.colors.chestAmber} weight="fill" />
            {hasChestNotification && (
              <View style={styles.notificationDot}>
                <Sparkle size={8} color="#FFFFFF" weight="fill" />
              </View>
            )}
          </View>
          <Text style={styles.chestButtonLabel}>Chest</Text>
        </TactileDockButton>

        {/* Markazdagi Katta 3D Sokratik Kamera Skaner Tugmasi */}
        <TactileDockButton
          style={styles.centerScannerButton}
          scaleDown={0.9}
          onPress={onOpenScanner}
          accessibilityLabel="Open Socratic Camera Scanner"
        >
          <View style={styles.centerIconCircle}>
            <Scan size={26} color="#FFFFFF" weight="bold" />
          </View>
          <Text style={styles.centerButtonLabel}>AI SCANNER</Text>
        </TactileDockButton>

        {/* O'ngdagi Virtual Ilmiy Lab Tugmasi (V1.2 da qaytadi) */}
        {onOpenLab ? (
          <TactileDockButton
            style={styles.dockSideButton}
            onPress={onOpenLab}
            accessibilityLabel="Virtual Science Lab"
          >
            <View style={styles.labIconContainer}>
              <Flask size={22} color={theme.colors.labTeal} weight="fill" />
            </View>
            <Text style={styles.labButtonLabel}>Lab</Text>
          </TactileDockButton>
        ) : (
          <View style={styles.dockSideButton} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dockContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  dockGlassCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.dockBg,
    borderRadius: 32,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderColor: theme.colors.dockBorder,
    borderBottomColor: theme.colors.dockBorderBottom,
    shadowColor: theme.colors.headingDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    width: '100%',
    maxWidth: 360,
  },
  dockSideButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minWidth: 64,
  },
  chestIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.chestAmberLight,
    borderWidth: 1.5,
    borderColor: theme.colors.chestAmberBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
    position: 'relative',
  },
  labIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.labTealLight,
    borderWidth: 1.5,
    borderColor: theme.colors.labTealBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  chestButtonLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.chestAmber,
    letterSpacing: 0.2,
  },
  labButtonLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.labTeal,
    letterSpacing: 0.2,
  },
  centerScannerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16,
  },
  centerIconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: theme.colors.dockCenterBg,
    borderWidth: 3,
    borderBottomWidth: 5,
    borderColor: theme.colors.dockCenterBorder,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.dockCenterShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  centerButtonLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: theme.colors.dockCenterBg,
    letterSpacing: 0.6,
    marginTop: 4,
  },
});
