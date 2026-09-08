import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Flask,
  Planet,
  Cube,
  Play,
  GraduationCap,
  Minus,
  Plus,
  Sparkle,
  Lightbulb,
} from 'phosphor-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { theme } from '../../core/theme';
import { HapticFeedback } from '../../core/haptics';
import { useGamificationStore } from '../state/useGamificationStore';
import { useVoiceStore } from '../state/useVoiceStore';

export type LabTab = 'physics' | 'chemistry';

export interface VirtualScienceLabViewProps {
  onBack: () => void;
}

export const VirtualScienceLabView: React.FC<VirtualScienceLabViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<LabTab>('physics');

  // Physics Simulation State: Newton's 2nd Law (F = m * a -> a = F / m)
  const [mass, setMass] = useState<number>(2); // kg
  const [force, setForce] = useState<number>(8); // N
  const [isSimulatingPhysics, setIsSimulatingPhysics] = useState(false);

  // Chemistry Simulation State: 2H2 + O2 -> 2H2O
  const [hydrogenCount, setHydrogenCount] = useState<number>(2);
  const [oxygenCount, setOxygenCount] = useState<number>(1);
  const [waterYield, setWaterYield] = useState<number>(0);
  const [chemStatus, setChemStatus] = useState<string>('Ready for stoichiometric synthesis');

  const { addXp, recordSolvedProblem } = useGamificationStore();
  const { speakText } = useVoiceStore();

  // Animation values for Physics Cart
  const cartTranslateX = useSharedValue(0);
  const chemGlowScale = useSharedValue(1);

  const animatedCartStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: cartTranslateX.value }],
  }));

  const animatedFlaskGlow = useAnimatedStyle(() => ({
    transform: [{ scale: chemGlowScale.value }],
  }));

  const acceleration = Number((force / mass).toFixed(1));

  // Physics Run
  const handleRunPhysicsExperiment = () => {
    if (isSimulatingPhysics) return;
    HapticFeedback.medium();
    setIsSimulatingPhysics(true);

    const prompt = `Testing Newton's Second Law. Force ${force} Newtons applied to mass ${mass} kilograms yields an acceleration of ${acceleration} meters per second squared.`;
    speakText(prompt);

    // Speed depends on acceleration: higher a = faster duration
    const duration = Math.max(500, Math.min(2000, 2000 / (acceleration * 0.5)));

    cartTranslateX.value = withSequence(
      withTiming(240, { duration, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 600, easing: Easing.inOut(Easing.ease) })
    );

    setTimeout(() => {
      HapticFeedback.success();
      setIsSimulatingPhysics(false);
      addXp(30);
      recordSolvedProblem();
    }, duration + 650);
  };

  // Chemistry Synthesize Reaction
  const handleSynthesizeMolecules = () => {
    HapticFeedback.medium();
    chemGlowScale.value = withSequence(
      withTiming(1.15, { duration: 250 }),
      withTiming(1, { duration: 250 })
    );

    // 2H2 + 1O2 -> 2H2O
    const waterProduced = Math.min(Math.floor(hydrogenCount / 2), oxygenCount) * 2;

    if (waterProduced > 0) {
      setWaterYield((prev) => prev + waterProduced);
      setChemStatus(`Synthesized ${waterProduced} water molecules (H₂O)!`);
      HapticFeedback.success();
      addXp(40);
      recordSolvedProblem();
      speakText(`Reaction successful! Formed ${waterProduced} water molecules. Mass is conserved!`);
    } else {
      setChemStatus('Not enough reactants! Remember: 2 H₂ molecules require 1 O₂ molecule.');
      HapticFeedback.error();
      speakText('Need at least 2 hydrogen and 1 oxygen to form water.');
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={onBack}
        >
          <ArrowLeft size={16} color={theme.colors.textDark} weight="bold" style={{ marginRight: 4 }} />
          <Text style={styles.backButtonText}>Home</Text>
        </TouchableOpacity>

        <View style={styles.labBadge}>
          <Flask size={14} color="#9046FE" weight="bold" style={{ marginRight: 4 }} />
          <Text style={styles.labBadgeText}>LEVEL 3 • SCIENCE LAB</Text>
        </View>
      </View>

      {/* Segmented Control: Physics vs Chemistry */}
      <View style={styles.segmentedControl}>
        <TouchableOpacity
          style={[
            styles.segmentItem,
            activeTab === 'physics' ? styles.segmentItemActive : null,
          ]}
          activeOpacity={0.8}
          onPress={() => {
            HapticFeedback.selection();
            setActiveTab('physics');
          }}
        >
          <Planet
            size={14}
            color={activeTab === 'physics' ? '#9046FE' : '#8E8E93'}
            weight="bold"
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.segmentText, activeTab === 'physics' ? styles.segmentTextActive : null]}>
            Physics: Motion & Force
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentItem,
            activeTab === 'chemistry' ? styles.segmentItemActive : null,
          ]}
          activeOpacity={0.8}
          onPress={() => {
            HapticFeedback.selection();
            setActiveTab('chemistry');
          }}
        >
          <Flask
            size={14}
            color={activeTab === 'chemistry' ? '#FF7B39' : '#8E8E93'}
            weight="bold"
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.segmentText, activeTab === 'chemistry' ? styles.segmentTextActive : null]}>
            Chemistry: Synthesis
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= PHYSICS LAB ================= */}
        {activeTab === 'physics' ? (
          <View style={styles.tabContent}>
            {/* Experiment Title Card */}
            <View style={styles.labCard}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardOverline}>INTERACTIVE EXPERIMENT</Text>
                <View style={styles.formulaPill}>
                  <Text style={styles.formulaPillText}>F = m × a</Text>
                </View>
              </View>
              <Text style={styles.cardTitle}>Newton’s Second Law Simulator</Text>
              <Text style={styles.cardSub}>
                Adjust the mass of the cart and applied force to empirically observe how acceleration changes.
              </Text>

              {/* Physical Cart Track View */}
              <View style={styles.trackContainer}>
                <View style={styles.trackRuler}>
                  <Text style={styles.rulerMarker}>0m</Text>
                  <Text style={styles.rulerMarker}>10m</Text>
                  <Text style={styles.rulerMarker}>20m</Text>
                </View>

                {/* Animated Cart */}
                <Animated.View style={[styles.cartBox, animatedCartStyle]}>
                  <Cube size={28} color="#9046FE" weight="bold" />
                  <Text style={styles.cartMassText}>{mass} kg</Text>
                </Animated.View>
                <View style={styles.trackFloor} />
              </View>

              {/* Metrics Readout */}
              <View style={styles.metricsRow}>
                <View style={styles.metricPill}>
                  <Text style={styles.metricLabel}>Force (F)</Text>
                  <Text style={[styles.metricValue, { color: '#FF9500' }]}>{force} N</Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricPill}>
                  <Text style={styles.metricLabel}>Mass (m)</Text>
                  <Text style={[styles.metricValue, { color: '#007AFF' }]}>{mass} kg</Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricPill}>
                  <Text style={styles.metricLabel}>Acceleration (a)</Text>
                  <Text style={[styles.metricValue, { color: '#34C759' }]}>{acceleration} m/s²</Text>
                </View>
              </View>

              {/* Controls: Mass Selector */}
              <View style={styles.controlSection}>
                <Text style={styles.controlSectionLabel}>Select Cart Mass (m):</Text>
                <View style={styles.selectorPillsRow}>
                  {[1, 2, 4, 8].map((m) => (
                    <TouchableOpacity
                      key={m}
                      style={[styles.selectorPill, mass === m ? styles.selectorPillActive : null]}
                      activeOpacity={0.75}
                      onPress={() => {
                        HapticFeedback.selection();
                        setMass(m);
                      }}
                    >
                      <Text style={[styles.selectorPillText, mass === m ? styles.selectorPillTextActive : null]}>
                        {m} kg
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Controls: Force Selector */}
              <View style={styles.controlSection}>
                <Text style={styles.controlSectionLabel}>Select Applied Force (F):</Text>
                <View style={styles.selectorPillsRow}>
                  {[4, 8, 16, 32].map((f) => (
                    <TouchableOpacity
                      key={f}
                      style={[styles.selectorPill, force === f ? styles.selectorPillActiveOrange : null]}
                      activeOpacity={0.75}
                      onPress={() => {
                        HapticFeedback.selection();
                        setForce(f);
                      }}
                    >
                      <Text style={[styles.selectorPillText, force === f ? styles.selectorPillTextActiveOrange : null]}>
                        {f} N
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Action Button */}
              <TouchableOpacity
                style={[styles.launchBtn, isSimulatingPhysics ? styles.launchBtnDisabled : null]}
                activeOpacity={0.85}
                disabled={isSimulatingPhysics}
                onPress={handleRunPhysicsExperiment}
              >
                <Play size={18} color="#FFFFFF" weight="fill" style={{ marginRight: 6 }} />
                <Text style={styles.launchBtnText}>
                  {isSimulatingPhysics ? 'Accelerating Cart...' : 'Apply Force & Launch Cart (+30 XP)'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Socratic Reflection Prompt */}
            <View style={styles.socraticPromptCard}>
              <GraduationCap size={18} color="#9046FE" weight="bold" style={{ marginRight: 8, marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.socraticPromptTitle}>Socratic Observation</Text>
                <Text style={styles.socraticPromptBody}>
                  Notice that if you double the mass from 2 kg to 4 kg while keeping the force at 8 N, the acceleration cuts in half from 4 m/s² to 2 m/s²!
                </Text>
              </View>
            </View>
          </View>
        ) : (
          /* ================= CHEMISTRY LAB ================= */
          <View style={styles.tabContent}>
            <View style={styles.labCard}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardOverline}>MOLECULAR LAB</Text>
                <View style={[styles.formulaPill, { backgroundColor: '#FFF0EA', borderColor: '#FFD3C2' }]}>
                  <Text style={[styles.formulaPillText, { color: '#C2410C' }]}>2H₂ + O₂ → 2H₂O</Text>
                </View>
              </View>

              <Text style={styles.cardTitle}>Water Synthesis Reaction</Text>
              <Text style={styles.cardSub}>
                Combine diatomic Hydrogen (H₂) and Oxygen (O₂) molecules in stoichiometric proportions to synthesize water molecules.
              </Text>

              {/* Flask Reaction Stage */}
              <Animated.View style={[styles.flaskStage, animatedFlaskGlow]}>
                <View style={styles.flaskCircle}>
                  <Flask size={64} color="#FF7B39" weight="fill" />
                </View>
                <Text style={styles.yieldCounterText}>{waterYield} Water Molecules Formed</Text>
                <Text style={styles.chemStatusText}>{chemStatus}</Text>
              </Animated.View>

              {/* Reactants Controls */}
              <View style={styles.reactantsRow}>
                {/* Hydrogen */}
                <View style={styles.reactantBox}>
                  <Text style={styles.reactantTitle}>Hydrogen (H₂)</Text>
                  <Text style={styles.reactantCount}>{hydrogenCount}</Text>
                  <View style={styles.miniBtnRow}>
                    <TouchableOpacity
                      style={styles.counterBtn}
                      onPress={() => setHydrogenCount((c) => Math.max(0, c - 1))}
                    >
                      <Minus size={16} color="#007AFF" weight="bold" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.counterBtn}
                      onPress={() => setHydrogenCount((c) => c + 1)}
                    >
                      <Plus size={16} color="#007AFF" weight="bold" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Oxygen */}
                <View style={styles.reactantBox}>
                  <Text style={styles.reactantTitle}>Oxygen (O₂)</Text>
                  <Text style={styles.reactantCount}>{oxygenCount}</Text>
                  <View style={styles.miniBtnRow}>
                    <TouchableOpacity
                      style={styles.counterBtn}
                      onPress={() => setOxygenCount((c) => Math.max(0, c - 1))}
                    >
                      <Minus size={16} color="#FF7B39" weight="bold" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.counterBtn}
                      onPress={() => setOxygenCount((c) => c + 1)}
                    >
                      <Plus size={16} color="#FF7B39" weight="bold" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Synthesize Button */}
              <TouchableOpacity
                style={[styles.launchBtn, { backgroundColor: '#FF7B39' }]}
                activeOpacity={0.85}
                onPress={handleSynthesizeMolecules}
              >
                <Sparkle size={18} color="#FFFFFF" weight="fill" style={{ marginRight: 6 }} />
                <Text style={styles.launchBtnText}>Synthesize Reaction (+40 XP)</Text>
              </TouchableOpacity>
            </View>

            {/* Socratic Reflection Prompt */}
            <View style={styles.socraticPromptCard}>
              <Lightbulb size={18} color="#FF7B39" weight="bold" style={{ marginRight: 8, marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.socraticPromptTitle}>Law of Conservation of Mass</Text>
                <Text style={styles.socraticPromptBody}>
                  Atoms cannot appear from nothing or disappear. Each water molecule (H₂O) requires 2 hydrogen atoms and 1 oxygen atom!
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radii.pill,
    borderWidth: 1.5,
    borderColor: theme.colors.borderLight,
  },
  backButtonText: {
    color: theme.colors.textDark,
    ...theme.typography.subhead,
    fontWeight: '800',
  },
  labBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5EFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.radii.pill,
    borderWidth: 1.2,
    borderColor: '#E9D5FF',
  },
  labBadgeText: {
    color: '#7E22CE',
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#EFECE2',
    marginHorizontal: 18,
    padding: 3,
    borderRadius: 14,
    marginBottom: 14,
  },
  segmentItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 11,
  },
  segmentItemActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E8E93',
  },
  segmentTextActive: {
    color: '#000000',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 18,
    paddingBottom: 36,
  },
  tabContent: {},
  labCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: theme.colors.borderLight,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardOverline: {
    ...theme.typography.overline,
    color: '#9046FE',
  },
  formulaPill: {
    backgroundColor: '#F3EEFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E4D4FF',
  },
  formulaPillText: {
    color: '#6B21A8',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  cardTitle: {
    ...theme.typography.title2,
    fontSize: 20,
    color: theme.colors.textDark,
    marginBottom: 6,
  },
  cardSub: {
    ...theme.typography.body,
    fontSize: 13.5,
    lineHeight: 19,
    color: theme.colors.textMuted,
    marginBottom: 16,
  },
  trackContainer: {
    height: 120,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    justifyContent: 'flex-end',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  trackRuler: {
    position: 'absolute',
    top: 10,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rulerMarker: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  cartBox: {
    width: 68,
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#9046FE',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#9046FE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 4,
  },
  cartMassText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B21A8',
  },
  trackFloor: {
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
    width: '100%',
  },
  metricsRow: {
    flexDirection: 'row',
    backgroundColor: '#F8F6F0',
    borderRadius: 16,
    paddingVertical: 10,
    marginBottom: 16,
  },
  metricPill: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    backgroundColor: '#E5E0D5',
  },
  metricLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#71717A',
    marginBottom: 3,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  controlSection: {
    marginBottom: 14,
  },
  controlSectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textDark,
    marginBottom: 8,
  },
  selectorPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  selectorPill: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 9,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  selectorPillActive: {
    backgroundColor: '#F3EEFF',
    borderColor: '#9046FE',
  },
  selectorPillActiveOrange: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FF9500',
  },
  selectorPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
  },
  selectorPillTextActive: {
    color: '#6B21A8',
  },
  selectorPillTextActiveOrange: {
    color: '#C2410C',
  },
  launchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9046FE',
    paddingVertical: 14,
    borderRadius: 18,
    shadowColor: '#9046FE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 6,
  },
  launchBtnDisabled: {
    opacity: 0.6,
  },
  launchBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  socraticPromptCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: theme.colors.borderLight,
  },
  socraticPromptTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.textDark,
    marginBottom: 4,
  },
  socraticPromptBody: {
    fontSize: 12.5,
    lineHeight: 18,
    color: theme.colors.textMuted,
  },
  flaskStage: {
    alignItems: 'center',
    paddingVertical: 18,
    backgroundColor: '#FFF8F5',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FFE4D9',
    marginBottom: 16,
  },
  flaskCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#FF7B39',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  yieldCounterText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#9A3412',
    marginBottom: 4,
  },
  chemStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#C2410C',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  reactantsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  reactantBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reactantTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
  },
  reactantCount: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  miniBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
