import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Svg, {
  Path,
  Circle,
  Rect,
  G,
  ClipPath,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { CheckCircle, Lightning, Coffee } from 'phosphor-react-native';
import { theme } from '../../core/theme';
import { useEnergyTimer } from '../hooks/useEnergyTimer';

export interface HumanoidEnergyMeterProps {
  energy: number;
  maxEnergy?: number;
  size?: 'normal' | 'compact';
}

interface LevelColorConfig {
  color: string;
  gradientEnd: string;
  title: string;
  subtitle: string;
  fillHeight: number; // In viewBox units (0 to 160)
}

const ENERGY_LEVEL_CONFIGS: Record<number, LevelColorConfig> = {
  0: {
    color: '#8E8E93',
    gradientEnd: '#636366',
    title: 'Drained',
    subtitle: 'Recharge needed before next live session',
    fillHeight: 0,
  },
  1: {
    color: '#FF3B30',
    gradientEnd: '#FF453A',
    title: 'Low Battery (Feet)',
    subtitle: '1 session remaining • Rest or recharge soon',
    fillHeight: 30, // Red feet & calves
  },
  2: {
    color: '#FF9500',
    gradientEnd: '#FF9F0A',
    title: 'Warming Up (Legs)',
    subtitle: '2 sessions remaining • Ready for short review',
    fillHeight: 64, // Orange legs
  },
  3: {
    color: '#FFCC00',
    gradientEnd: '#FFD60A',
    title: 'Half Power (Core)',
    subtitle: '3 sessions remaining • Balanced focus',
    fillHeight: 96, // Yellow torso/waist
  },
  4: {
    color: '#30D158',
    gradientEnd: '#34C759',
    title: 'High Vitality (Chest)',
    subtitle: '4 sessions remaining • Sharp and ready',
    fillHeight: 126, // Green shoulders/chest
  },
  5: {
    color: '#34C759',
    gradientEnd: '#28CD41',
    title: 'Supercharged (Full Mind)',
    subtitle: 'Peak mental clarity • Full 5 sessions available',
    fillHeight: 160, // 100% full including glowing head
  },
};

/**
 * Humanoid Silhouette Path Generator
 * ViewBox: 0 0 100 160
 * Head center: (50, 18), radius: 14
 * Symmetrical body, arms, and legs.
 */
const BODY_PATH = `
  M 44,34
  C 32,36 20,38 18,44
  C 16,50 14,84 14,88
  C 14,94 22,94 24,88
  C 25,82 26,56 26,50
  L 28,92
  L 28,148
  C 28,154 44,154 44,148
  L 44,98
  C 46,94 54,94 56,98
  L 56,148
  C 56,154 72,154 72,148
  L 72,92
  L 74,50
  C 74,56 75,82 76,88
  C 78,94 86,94 86,88
  C 86,84 84,50 82,44
  C 80,38 68,36 56,34
  Z
`;

interface SingleFigureProps {
  level: number;
  isActive: boolean;
}

const MiniHumanoidFigure: React.FC<SingleFigureProps> = ({ level, isActive }) => {
  const config = ENERGY_LEVEL_CONFIGS[level];
  const fillY = 160 - config.fillHeight;
  const clipId = `miniHumanoidClip_${level}`;
  const gradId = `miniGrad_${level}`;

  return (
    <View style={[styles.miniFigureContainer, isActive ? styles.miniFigureActive : null]}>
      <Svg width={38} height={62} viewBox="0 0 100 160">
        <Defs>
          <ClipPath id={clipId}>
            <Circle cx="50" cy="18" r="14" />
            <Path d={BODY_PATH} />
          </ClipPath>
          <LinearGradient id={gradId} x1="0" y1="1" x2="0" y2="0">
            <Stop offset="0" stopColor={config.color} />
            <Stop offset="1" stopColor={config.gradientEnd} />
          </LinearGradient>
        </Defs>

        {/* Empty Body Background */}
        <G clipPath={`url(#${clipId})`}>
          <Rect x="0" y="0" width="100" height="160" fill="#F2F2F7" />
          {/* Liquid Fill */}
          <Rect
            x="0"
            y={fillY}
            width="100"
            height={config.fillHeight}
            fill={`url(#${gradId})`}
          />
        </G>

        {/* Outline */}
        <Circle
          cx="50"
          cy="18"
          r="14"
          fill="none"
          stroke={isActive ? config.color : '#8E8E93'}
          strokeWidth="3"
        />
        <Path
          d={BODY_PATH}
          fill="none"
          stroke={isActive ? config.color : '#8E8E93'}
          strokeWidth="3"
        />
      </Svg>
      <Text style={[styles.miniLevelText, isActive ? { color: config.color, fontWeight: '900' } : null]}>
        {level}
      </Text>
    </View>
  );
};

export const HumanoidEnergyMeter: React.FC<HumanoidEnergyMeterProps> = ({
  energy: propEnergy,
  maxEnergy: propMaxEnergy = 5,
}) => {
  const {
    energy: liveEnergy,
    maxEnergy: liveMax,
    isFull,
    isDrained,
    formattedCountdown,
    refillProgressPercent,
  } = useEnergyTimer();

  const effectiveEnergy = typeof propEnergy === 'number' ? propEnergy : liveEnergy;
  const effectiveMax = propMaxEnergy || liveMax;
  const clampedEnergy = Math.max(0, Math.min(effectiveEnergy, effectiveMax));
  const activeConfig = ENERGY_LEVEL_CONFIGS[clampedEnergy] || ENERGY_LEVEL_CONFIGS[5];
  const fillY = 160 - activeConfig.fillHeight;

  return (
    <View style={styles.container}>
      {/* 1. Katta Qahramon Inson Qiyofasi (Hero Liquid Avatar) */}
      <View style={styles.heroWrapper}>
        <View style={[styles.glowRing, { borderColor: `${activeConfig.color}25`, backgroundColor: `${activeConfig.color}08` }]}>
          <Svg width={96} height={156} viewBox="0 0 100 160">
            <Defs>
              <ClipPath id="heroHumanoidClip">
                <Circle cx="50" cy="18" r="14" />
                <Path d={BODY_PATH} />
              </ClipPath>
              <LinearGradient id="heroGradient" x1="0" y1="1" x2="0" y2="0">
                <Stop offset="0" stopColor={activeConfig.color} />
                <Stop offset="0.8" stopColor={activeConfig.gradientEnd} />
              </LinearGradient>
            </Defs>

            {/* Inson Tanasi Qatlamlari */}
            <G clipPath="url(#heroHumanoidClip)">
              {/* Oq/Kulrang Bo'sh Tana */}
              <Rect x="0" y="0" width="100" height="160" fill="#F2F2F7" />

              {/* Suyuqlik Sifatida To'lib Boruvchi Energiya */}
              <Rect
                x="0"
                y={fillY}
                width="100"
                height={activeConfig.fillHeight}
                fill="url(#heroGradient)"
              />
            </G>

            {/* Aniq Apple Minimalist Kontur Chiziqlari */}
            <Circle
              cx="50"
              cy="18"
              r="14"
              fill="none"
              stroke={activeConfig.color}
              strokeWidth="2.8"
            />
            <Path
              d={BODY_PATH}
              fill="none"
              stroke={activeConfig.color}
              strokeWidth="2.8"
            />
          </Svg>
        </View>

        {/* Holat Matni */}
        <View style={styles.statusBadge}>
          <Text style={[styles.statusTitle, { color: activeConfig.color }]}>
            {activeConfig.title}
          </Text>
          <Text style={styles.statusSubtitle}>{activeConfig.subtitle}</Text>
        </View>

        {/* JONLI RECHARGE TAYMERI & STATUS */}
        {isFull ? (
          <View style={styles.fullRechargeBadge}>
            <CheckCircle size={15} color="#34C759" weight="fill" style={{ marginRight: 5 }} />
            <Text style={styles.fullRechargeText}>Batteries 100% Full • Ready to explore</Text>
          </View>
        ) : (
          <View style={styles.countdownContainer}>
            <View style={styles.countdownRow}>
              <View style={styles.countdownLeft}>
                <Lightning size={14} color="#FF9500" weight="fill" style={{ marginRight: 4 }} />
                <Text style={styles.countdownLabel}>Next +1 Energy in</Text>
              </View>
              <Text style={styles.countdownTimer}>{formattedCountdown}</Text>
            </View>

            <View style={styles.timerProgressTrack}>
              <View style={[styles.timerProgressBar, { width: `${refillProgressPercent}%` }]} />
            </View>
          </View>
        )}

        {/* Agar energiya butunlay tugagan bo'lsa: Spaced Repetition / Rest maslahati */}
        {isDrained && (
          <View style={styles.restNoticeCard}>
            <Coffee size={16} color="#FF9500" weight="bold" style={{ marginRight: 8, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.restNoticeTitle}>Spaced Learning Rest</Text>
              <Text style={styles.restNoticeSub}>
                Studies show memory consolidates during rest. Take a short pause while energy replenishes!
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* 2. 5 Bosqichli Vizual Strip (Yuklangan Rasm Nusxasi) */}
      <View style={styles.progressionSection}>
        <Text style={styles.progressionLabel}>ENERGY LEVELS (1 — 5)</Text>
        <View style={styles.stripRow}>
          {[1, 2, 3, 4, 5].map((lvl) => (
            <MiniHumanoidFigure
              key={lvl}
              level={lvl}
              isActive={clampedEnergy === lvl}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  heroWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  glowRing: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 36,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  statusBadge: {
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 16,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  statusSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 16,
  },
  progressionSection: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    alignItems: 'center',
  },
  progressionLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#8E8E93',
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  stripRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
  },
  miniFigureContainer: {
    alignItems: 'center',
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  miniFigureActive: {
    borderColor: theme.colors.streakOrange,
    borderWidth: 1.5,
    backgroundColor: '#FFFBF7',
    shadowColor: theme.colors.streakOrange,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  miniLevelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8E8E93',
    marginTop: 2,
  },
  fullRechargeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2FBF5',
    borderWidth: 1,
    borderColor: '#D1F2DD',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: theme.radii.pill,
    marginTop: 10,
  },
  fullRechargeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#248A3D',
  },
  countdownContainer: {
    width: 220,
    backgroundColor: '#FFFDF5',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  countdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 6,
  },
  countdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countdownLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  countdownTimer: {
    fontSize: 12,
    fontWeight: '900',
    color: '#B45309',
    fontFamily: 'monospace',
  },
  timerProgressTrack: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FEF3C7',
    overflow: 'hidden',
  },
  timerProgressBar: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#FF9500',
  },
  restNoticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    borderRadius: 14,
    padding: 10,
    marginTop: 10,
    width: '100%',
  },
  restNoticeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#C2410C',
    marginBottom: 2,
  },
  restNoticeSub: {
    fontSize: 11,
    color: '#9A3412',
    lineHeight: 15,
  },
});
