import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Scan } from 'phosphor-react-native';
import { theme } from '../../core/theme';

export interface SocraticTargetBoxProps {
  equation: string;
  isScanning?: boolean;
}

/**
 * 2-rasmdagi Apple-uslubidagi Skaner Nishon Ramkasi (Focus Bounding Box).
 * 4 ta oq burchak qavsi, formulani tanish paneli va Reanimated 3 lazer skaner nuri.
 */
export const SocraticTargetBox: React.FC<SocraticTargetBoxProps> = ({
  equation,
  isScanning = true,
}) => {
  const scanLineY = useSharedValue(0);

  useEffect(() => {
    if (isScanning) {
      scanLineY.value = withRepeat(
        withSequence(
          withTiming(76, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }
  }, [isScanning, scanLineY]);

  const animatedScanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLineY.value }],
  }));

  return (
    <View style={styles.container}>
      {/* 4 Burchakli Yengil Fokus Ramkasi */}
      <View style={styles.targetFrame}>
        {/* Burchaklar */}
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />

        {/* Lazer Skaner Chizig'i */}
        {isScanning ? (
          <Animated.View style={[styles.scanLine, animatedScanLineStyle]} />
        ) : null}

        {/* Tan olingan tenglama / masala */}
        <View style={styles.equationContent}>
          <View style={styles.scanIndicatorRow}>
            <Scan size={14} color="#00E5FF" weight="bold" style={styles.scanMiniIcon} />
            <Text style={styles.equationLabel}>Target Problem</Text>
          </View>
          <Text style={styles.equationText} numberOfLines={1}>
            {equation}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 6,
    marginBottom: 8,
    width: '92%',
  },
  targetFrame: {
    width: '100%',
    height: 60,
    borderRadius: 16,
    backgroundColor: 'rgba(10, 10, 14, 0.45)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderColor: '#FFFFFF',
  },
  topLeft: {
    top: -1,
    left: -1,
    borderTopWidth: 2.5,
    borderLeftWidth: 2.5,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: -1,
    right: -1,
    borderTopWidth: 2.5,
    borderRightWidth: 2.5,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: -1,
    left: -1,
    borderBottomWidth: 2.5,
    borderLeftWidth: 2.5,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: -1,
    right: -1,
    borderBottomWidth: 2.5,
    borderRightWidth: 2.5,
    borderBottomRightRadius: 8,
  },
  scanLine: {
    position: 'absolute',
    top: 4,
    left: 8,
    right: 8,
    height: 1.5,
    backgroundColor: '#00E5FF',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
    zIndex: 5,
  },
  equationContent: {
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  scanIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  scanMiniIcon: {
    marginRight: 4,
  },
  equationLabel: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  equationText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
});
