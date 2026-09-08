import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CameraView } from 'expo-camera';
import { Camera, Scan } from 'phosphor-react-native';
import { theme } from '../../core/theme';
import { useCameraPermission } from '../hooks/useCameraPermission';

export interface CameraViewFinderProps {
  children?: React.ReactNode;
  enableTorch?: boolean;
  showDefaultOverlay?: boolean;
  cameraRef?: React.RefObject<CameraView | null>;
}

export const CameraViewFinder: React.FC<CameraViewFinderProps> = ({
  children,
  enableTorch = false,
  showDefaultOverlay = false,
  cameraRef,
}) => {
  const { hasPermission, isLoading, errorMessage, requestCameraPermission } = useCameraPermission();

  if (isLoading) {
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator size="small" color={theme.colors.mathBlue} />
        <Text style={styles.infoText}>Initializing scanner...</Text>
      </View>
    );
  }

  if (hasPermission === false || hasPermission === null) {
    return (
      <View style={styles.stateContainer}>
        <View style={styles.lockIconCircle}>
          <Camera size={36} color={theme.colors.chemistryOrange} weight="bold" />
        </View>
        <Text style={styles.titleText}>Camera Access Required</Text>
        <Text style={styles.descriptionText}>
          Allow rear camera access so your Socratic AI can read your notebook questions. Your child's face is never captured.
        </Text>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        <TouchableOpacity
          style={styles.permissionButton}
          activeOpacity={0.85}
          onPress={requestCameraPermission}
        >
          <Text style={styles.permissionButtonText}>Enable Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.cameraContainer}>
      {/* 1. CameraView without children, strictly rear camera, supports torch */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={enableTorch}
      />

      {/* 2. Absolute overlay for frame if default overlay requested */}
      {showDefaultOverlay ? (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <View style={styles.overlayFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            <View style={styles.guideBadge}>
              <Scan size={14} color="#FFFFFF" weight="bold" style={styles.guideIcon} />
              <Text style={styles.guideText}>Align notebook problem in frame</Text>
            </View>
          </View>
        </View>
      ) : null}

      {/* 3. Floating children (SocraticTargetBox, FloatingSocraticBubble, Dock, etc.) */}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    borderRadius: theme.radii.card,
    overflow: 'hidden',
    backgroundColor: '#000000',
    position: 'relative',
  },
  stateContainer: {
    flex: 1,
    borderRadius: theme.radii.card,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  lockIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFF2E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  titleText: {
    ...theme.typography.title2,
    color: theme.colors.textDark,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  descriptionText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  infoText: {
    ...theme.typography.footnote,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
  },
  errorText: {
    ...theme.typography.footnote,
    color: '#FF3B30',
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: theme.colors.chemistryOrange,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: 14,
    borderRadius: theme.radii.pill,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    ...theme.typography.headline,
    fontSize: 15,
  },
  overlayFrame: {
    flex: 1,
    margin: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 18,
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 16,
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: theme.colors.chemistryOrange,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 3.5,
    borderLeftWidth: 3.5,
    borderTopLeftRadius: 10,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 3.5,
    borderRightWidth: 3.5,
    borderTopRightRadius: 10,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 3.5,
    borderLeftWidth: 3.5,
    borderBottomLeftRadius: 10,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 3.5,
    borderRightWidth: 3.5,
    borderBottomRightRadius: 10,
  },
  guideBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: theme.radii.pill,
  },
  guideIcon: {
    marginRight: 6,
  },
  guideText: {
    color: 'rgba(255, 255, 255, 0.9)',
    ...theme.typography.footnote,
    fontWeight: '700',
  },
});
