import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Pressable } from 'react-native';
import { Image, Microphone, Flashlight } from 'phosphor-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { HapticFeedback } from '../../core/haptics';

export interface AppleCameraDockProps {
  isTorchOn: boolean;
  isListening?: boolean;
  onToggleTorch: () => void;
  onSnap: () => void;
  onMicPress?: () => void;
  onGalleryPress?: () => void;
}

/**
 * Apple Minimalist Camera Control Dock
 */
export const AppleCameraDock: React.FC<AppleCameraDockProps> = ({
  isTorchOn,
  isListening = false,
  onToggleTorch,
  onSnap,
  onMicPress,
  onGalleryPress,
}) => {
  const shutterScale = useSharedValue(1);

  const animatedShutterStyle = useAnimatedStyle(() => ({
    transform: [{ scale: shutterScale.value }],
  }));

  const handlePressInShutter = () => {
    shutterScale.value = withSpring(0.88, { damping: 18, stiffness: 240 });
  };

  const handlePressOutShutter = () => {
    shutterScale.value = withSpring(1, { damping: 18, stiffness: 240 });
  };

  const handleShutterTap = () => {
    HapticFeedback.medium();
    onSnap();
  };

  const handleMicTap = () => {
    HapticFeedback.selection();
    if (onMicPress) onMicPress();
  };

  const handleTorchTap = () => {
    HapticFeedback.selection();
    onToggleTorch();
  };

  const handleGalleryTap = () => {
    HapticFeedback.light();
    if (onGalleryPress) onGalleryPress();
  };

  return (
    <View style={styles.dockContainer}>
      <View style={styles.controlsRow}>
        {/* 1. Gallery Button */}
        <TouchableOpacity
          style={styles.auxiliaryButton}
          activeOpacity={0.7}
          onPress={handleGalleryTap}
        >
          <Image size={24} color="#FFFFFF" weight="bold" />
          <Text style={styles.auxiliaryLabel}>Gallery</Text>
        </TouchableOpacity>

        {/* 2. Apple Camera Center Shutter Button */}
        <Pressable
          onPressIn={handlePressInShutter}
          onPressOut={handlePressOutShutter}
          onPress={handleShutterTap}
          style={styles.shutterTouchable}
        >
          <View style={styles.shutterOuterRing}>
            <Animated.View style={[styles.shutterInnerCircle, animatedShutterStyle]} />
          </View>
        </Pressable>

        {/* 3. Mic Button */}
        <TouchableOpacity
          style={[
            styles.auxiliaryButton,
            isListening ? styles.micActiveButton : null,
          ]}
          activeOpacity={0.7}
          onPress={handleMicTap}
        >
          <Microphone
            size={24}
            color={isListening ? '#000000' : '#FFFFFF'}
            weight={isListening ? 'fill' : 'bold'}
          />
          <Text
            style={[
              styles.auxiliaryLabel,
              isListening ? styles.micActiveLabel : null,
            ]}
          >
            {isListening ? 'Listening' : 'Voice'}
          </Text>
        </TouchableOpacity>

        {/* 4. Flashlight (Torch) Button */}
        <TouchableOpacity
          style={[
            styles.auxiliaryButton,
            isTorchOn ? styles.torchActiveButton : null,
          ]}
          activeOpacity={0.7}
          onPress={handleTorchTap}
        >
          <Flashlight
            size={24}
            color={isTorchOn ? '#000000' : '#FFFFFF'}
            weight={isTorchOn ? 'fill' : 'bold'}
          />
          <Text
            style={[
              styles.auxiliaryLabel,
              isTorchOn ? styles.torchActiveLabel : null,
            ]}
          >
            {isTorchOn ? 'On' : 'Flash'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dockContainer: {
    paddingHorizontal: 28,
    paddingTop: 14,
    paddingBottom: 22,
    backgroundColor: 'rgba(10, 10, 14, 0.78)',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
  },
  auxiliaryButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  auxiliaryLabel: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  torchActiveButton: {
    backgroundColor: '#FFCC00',
    borderColor: '#FFE066',
  },
  torchActiveLabel: {
    color: '#000000',
    fontWeight: '800',
  },
  micActiveButton: {
    backgroundColor: '#34C759', // Apple Green
    borderColor: '#30D158',
  },
  micActiveLabel: {
    color: '#000000',
    fontWeight: '800',
  },
  shutterTouchable: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterOuterRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  shutterInnerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
});

