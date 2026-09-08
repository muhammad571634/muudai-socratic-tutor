// O'ylanish: Ushbu komponent Apple Minimalist va Duolingo 3D uslubidagi AI Socratic Camera
// Scanner Hero CTA kartasidir. Katta 900 qalin tipografiya, taktil 3D soya (borderBottomWidth: 5)
// va mayin spring bosilish orqali bolaga bir zumda kamerani ochishga taklif beradi.

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Scan, Sparkle, ArrowRight, Camera } from 'phosphor-react-native';
import { theme } from '../../core/theme';
import { BentoSpringCard } from './BentoSpringCard';

export interface HeroScanBannerProps {
  onPress: () => void;
}

export const HeroScanBanner: React.FC<HeroScanBannerProps> = ({ onPress }) => {
  return (
    <BentoSpringCard style={styles.bannerCard} onPress={onPress}>
      <View style={styles.contentRow}>
        {/* Chapdagi Katta Taktil Kamera/Skaner Qutisi */}
        <View style={styles.cameraBox}>
          <Scan size={28} color={theme.colors.streakOrange} weight="bold" />
          <View style={styles.innerCameraBadge}>
            <Camera size={12} color="#FFFFFF" weight="fill" />
          </View>
        </View>

        {/* Markazdagi Aniq va Qiziqarli Sokratik Matn Bloki */}
        <View style={styles.textColumn}>
          {/* AI Status Nishoni */}
          <View style={styles.statusPill}>
            <Sparkle size={12} color={theme.colors.streakOrange} weight="fill" style={styles.pillIcon} />
            <Text style={styles.statusPillText}>AI SOCRATIC SCANNER</Text>
          </View>

          {/* Katta va Aniq Sarlavha */}
          <Text style={styles.headlineText}>Think It Through with AI</Text>

          {/* Tushunarli Yo'riqnoma */}
          <Text style={styles.subheadText} numberOfLines={2}>
            Point at any problem — Socrates Jr. guides you question by question with zero spoilers
          </Text>
        </View>

        {/* O'ngdagi Duolingo 3D Harakat Tugmasi */}
        <View style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Scan</Text>
          <ArrowRight size={14} color="#FFFFFF" weight="bold" style={styles.actionIcon} />
        </View>
      </View>
    </BentoSpringCard>
  );
};

const styles = StyleSheet.create({
  bannerCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderColor: theme.colors.statXpBorder,
    borderBottomColor: theme.colors.orangeActive,
    marginBottom: 24,
    shadowColor: theme.colors.orangeActive,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cameraBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: theme.colors.statXpBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.statXpBorder,
    borderBottomWidth: 3,
    marginRight: 12,
    position: 'relative',
  },
  innerCameraBadge: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.streakOrange,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  textColumn: {
    flex: 1,
    paddingRight: 8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.statXpBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radii.pill,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: theme.colors.surfaceOrangeBorder,
  },
  pillIcon: {
    marginRight: 4,
  },
  statusPillText: {
    color: theme.colors.orangeActive,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  headlineText: {
    color: theme.colors.titleDark,
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 23,
    marginBottom: 3,
  },
  subheadText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16.5,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.streakOrange,
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: theme.radii.pill,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: theme.colors.duoButtonBorder,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  actionIcon: {
    marginLeft: 4,
  },
});
