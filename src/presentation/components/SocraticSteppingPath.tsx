// O'ylanish: Ushbu komponent Duolingo uslubidagi Sokratik Dars Yo'li (Socratic Stepping Path).
// Reference mockup (media_1789057276062.png) ga 100% mos:
// 1. S-shaklidagi vertikal yo'l bo'ylab joylashgan 3D dumaloq tosh-tugmalar (stepping stone nodes)
// 2. Sariq 3D bajarilgan toshlar (check va doc belgilari bilan - bosilganda takrorlash ochiladi)
// 3. Binafsharang 3D faol tosh (yulduz belgisi va ustida suzuvchi "START!" pufakchasi bilan - bosilganda skaner ochiladi)
// 4. Kulrang 3D qulflangan toshlar (qulf belgisi bilan)
// 5. Kumush Marra Kubogi (26 raqami bilan)
// 6. Uchta quvnoq maskot illyustratsiyasi: Zen maskot (yuqori o'ng), Ko'zoynakli maskot (pastki o'ng), Nishonlovchi maskot (o'rta chap)
// 7. GPU Reanimated 3D bosilish (spring tactile press) va mayin suzuvchi "START!" animatsiyasi

import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import {
  Check,
  FileText,
  Star,
  LockSimple,
  Sparkle,
} from 'phosphor-react-native';
import { theme } from '../../core/theme';
import { HapticFeedback } from '../../core/haptics';
import { useTranslation } from 'react-i18next';
import {
  CoolSunglassesMascot,
  ZenMascot,
  MilestoneTrophy,
} from './HomeMascotIllustrations';

const MASCOT_CELEBRATING_IMG = require('../../../assets/mascot_celebrating.png');

export interface SocraticSteppingPathProps {
  onOpenScanner: () => void;
  onOpenMistakes: () => void;
  onOpenMysteryChest?: () => void;
  activeStepIndex?: number;
}

import {
  SteppingNodeType,
  SteppingNodeData,
  resolveNodeAction,
  getSteppingNodesState,
} from './homeDashboardLogic';

export {
  SteppingNodeType,
  SteppingNodeData,
  resolveNodeAction,
  getSteppingNodesState,
};

/**
 * 3D Stepping Stone Tugmasi
 */
interface SteppingStoneButtonProps {
  type: SteppingNodeType;
  onPress: () => void;
  accessibilityLabel: string;
  showStartBubble?: boolean;
  startBubbleText?: string;
}

const SteppingStoneButton: React.FC<SteppingStoneButtonProps> = ({
  type,
  onPress,
  accessibilityLabel,
  showStartBubble = false,
  startBubbleText = 'START!',
}) => {
  const pressY = useSharedValue(0);
  const bubbleFloatY = useSharedValue(0);

  useEffect(() => {
    if (showStartBubble) {
      bubbleFloatY.value = withRepeat(
        withSequence(
          withTiming(-6, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }
  }, [showStartBubble, bubbleFloatY]);

  const handlePressIn = () => {
    pressY.value = withTiming(6, { duration: 70 });
  };

  const handlePressOut = () => {
    pressY.value = withSpring(0, { damping: 12, stiffness: 350 });
  };

  const animatedButtonFaceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pressY.value }],
  }));

  const animatedBubbleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bubbleFloatY.value }],
  }));

  // Ranglar konfiguratsiyasi
  let baseColor = '#E09200'; // Pastki 3D soya
  let faceColor = '#FFC000'; // Yuqori sirt
  let highlightColor = '#FFE072'; // Yuqori yorug'lik
  let isLocked = type === 'locked';
  let isActive = type === 'active_star';

  if (isActive) {
    baseColor = '#4B25C6';
    faceColor = '#6A3DF5';
    highlightColor = '#A485FF';
  } else if (isLocked) {
    baseColor = '#CBD5E1';
    faceColor = '#E2E8F0';
    highlightColor = '#F8FAFC';
  }

  return (
    <View style={styles.stoneWrapper}>
      {/* Faol tugma ustidagi "START!" suzuvchi pufakchasi - bosish mumkin */}
      {showStartBubble && (
        <Animated.View style={[styles.startBubbleContainer, animatedBubbleStyle]}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={startBubbleText}
          >
            <View style={styles.startBubbleBox}>
              <Text style={styles.startBubbleText}>{startBubbleText}</Text>
            </View>
            {/* Pastga qaragan uchburchak dumi */}
            <View style={styles.startBubbleTailBorder} />
            <View style={styles.startBubbleTailFill} />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* 3D Taktil Tugma */}
      <TouchableOpacity
        activeOpacity={0.95}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={styles.touchableArea}
      >
        {/* Pastki 3D soya qatlami */}
        <View style={[styles.stone3DBase, { backgroundColor: baseColor }]} />

        {/* Bosiladigan old yuz qatlami */}
        <Animated.View
          style={[
            styles.stoneFrontFace,
            { backgroundColor: faceColor },
            animatedButtonFaceStyle,
          ]}
        >
          {/* Yuqori yarim oy nurlanish (3D Gloss Reflection Arc) */}
          <View
            style={[
              styles.glossHighlight,
              { borderColor: highlightColor },
            ]}
          />

          {/* Markazdagi nishon / belgi */}
          {type === 'completed_check' && (
            <View style={styles.whiteIconPill}>
              <Check size={22} color="#FF9600" weight="bold" />
            </View>
          )}

          {type === 'completed_doc' && (
            <View style={styles.whiteIconPill}>
              <FileText size={22} color="#FF9600" weight="bold" />
            </View>
          )}

          {type === 'active_star' && (
            <View style={styles.starContainer}>
              <Star size={34} color="#FFFFFF" weight="fill" />
            </View>
          )}

          {type === 'locked' && (
            <View style={styles.lockedIconPill}>
              <LockSimple size={24} color="#94A3B8" weight="fill" />
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export const SocraticSteppingPath: React.FC<SocraticSteppingPathProps> = ({
  onOpenScanner,
  onOpenMistakes,
  onOpenMysteryChest,
  activeStepIndex = 3,
}) => {
  const { t } = useTranslation();
  const nodes = getSteppingNodesState(activeStepIndex);
  const node5 = nodes[4];
  const node4 = nodes[3];
  const node3 = nodes[2];
  const node2 = nodes[1];
  const node1 = nodes[0];

  const handlePressNode = (type: SteppingNodeType) => {
    const action = resolveNodeAction(type);
    if (action === 'scanner') {
      HapticFeedback.success();
      onOpenScanner();
    } else if (action === 'mistakes') {
      HapticFeedback.light();
      onOpenMistakes();
    } else {
      HapticFeedback.error();
      Alert.alert(
        t('homeDashboard.path.nodeLocked', 'Locked Problem'),
        t('homeDashboard.path.lockedHint', 'Complete the active problem first to unlock this step!')
      );
    }
  };

  const handlePressTrophy = () => {
    HapticFeedback.medium();
    Alert.alert(
      t('homeDashboard.path.milestoneTitle', 'Milestone 26 Trophy!'),
      t(
        'homeDashboard.path.milestoneDesc',
        'You are making steady progress! Complete today’s path to reach the next milestone.'
      )
    );
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* ── 1. Yuqori Qator: Marra Kubogi va Zen Maskot ── */}
      <View style={styles.topMilestoneRow}>
        {/* Chap: 26 raqamli kumush kubok */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePressTrophy}
          style={styles.trophyTouchable}
          accessibilityRole="button"
          accessibilityLabel={t('homeDashboard.path.milestoneTrophy', 'Milestone 26 Trophy')}
        >
          <MilestoneTrophy width={95} height={100} />
        </TouchableOpacity>

        {/* O'ng: Zen Meditatsiya Maskoti */}
        <View style={styles.zenMascotWrapper}>
          <ZenMascot width={105} height={110} />
        </View>
      </View>

      {/* ── 2. Stepping Stone 5: Qulflangan Kulrang Tosh (Center-Left) ── */}
      <View style={[styles.nodeRow, styles.nodeRow5]}>
        <SteppingStoneButton
          type={node5.type}
          onPress={() => handlePressNode(node5.type)}
          showStartBubble={node5.type === 'active_star'}
          startBubbleText={t('homeDashboard.start', 'START!')}
          accessibilityLabel={
            node5.type === 'active_star'
              ? t('homeDashboard.path.nodeActive', 'Current problem - tap to start')
              : node5.type === 'locked'
              ? t('homeDashboard.path.nodeLocked', 'Locked problem')
              : t('homeDashboard.path.nodeCompleted', 'Completed problem - tap to review')
          }
        />
      </View>

      {/* ── 3. Stepping Stone 4: Faol Binafsharang Tosh + START! (Right Side) ── */}
      <View style={[styles.nodeRow, styles.nodeRow4]}>
        <SteppingStoneButton
          type={node4.type}
          onPress={() => handlePressNode(node4.type)}
          showStartBubble={node4.type === 'active_star'}
          startBubbleText={t('homeDashboard.start', 'START!')}
          accessibilityLabel={
            node4.type === 'active_star'
              ? t('homeDashboard.path.nodeActive', 'Current problem - tap to start')
              : node4.type === 'locked'
              ? t('homeDashboard.path.nodeLocked', 'Locked problem')
              : t('homeDashboard.path.nodeCompleted', 'Completed problem - tap to review')
          }
        />
      </View>

      {/* ── 4. Stepping Stone 3 & Quvnoq Nishonlovchi Maskot (Center & Left) ── */}
      <View style={styles.middleRowWithCelebratingMascot}>
        {/* Chapda: Quvnoq sakrovchi maskot */}
        <View style={styles.celebratingMascotWrapper}>
          <Image
            source={MASCOT_CELEBRATING_IMG}
            style={styles.celebratingMascotImage}
            resizeMode="contain"
          />
        </View>

        {/* Markaz-o'ngda: Tosh 3 */}
        <View style={styles.node3Wrapper}>
          <SteppingStoneButton
            type={node3.type}
            onPress={() => handlePressNode(node3.type)}
            showStartBubble={node3.type === 'active_star'}
            startBubbleText={t('homeDashboard.start', 'START!')}
            accessibilityLabel={
              node3.type === 'active_star'
                ? t('homeDashboard.path.nodeActive', 'Current problem - tap to start')
                : node3.type === 'locked'
                ? t('homeDashboard.path.nodeLocked', 'Locked problem')
                : t('homeDashboard.path.nodeCompleted', 'Completed problem - tap to review')
            }
          />
        </View>
      </View>

      {/* ── 5. Stepping Stone 2: Sariq Hujjatli Tosh (Center-Left) ── */}
      <View style={[styles.nodeRow, styles.nodeRow2]}>
        <SteppingStoneButton
          type={node2.type}
          onPress={() => handlePressNode(node2.type)}
          showStartBubble={node2.type === 'active_star'}
          startBubbleText={t('homeDashboard.start', 'START!')}
          accessibilityLabel={
            node2.type === 'active_star'
              ? t('homeDashboard.path.nodeActive', 'Current problem - tap to start')
              : node2.type === 'locked'
              ? t('homeDashboard.path.nodeLocked', 'Locked problem')
              : t('homeDashboard.path.nodeCompleted', 'Completed problem - tap to review')
          }
        />
      </View>

      {/* ── 6. Stepping Stone 1 & Ko'zoynakli Maskot (Bottom & Right) ── */}
      <View style={styles.bottomRowWithCoolMascot}>
        {/* Chap-markazda: Tosh 1 */}
        <View style={styles.node1Wrapper}>
          <SteppingStoneButton
            type={node1.type}
            onPress={() => handlePressNode(node1.type)}
            showStartBubble={node1.type === 'active_star'}
            startBubbleText={t('homeDashboard.start', 'START!')}
            accessibilityLabel={
              node1.type === 'active_star'
                ? t('homeDashboard.path.nodeActive', 'Current problem - tap to start')
                : node1.type === 'locked'
                ? t('homeDashboard.path.nodeLocked', 'Locked problem')
                : t('homeDashboard.path.nodeCompleted', 'Completed problem - tap to review')
            }
          />
        </View>

        {/* O'ngda: Ko'zoynakli Cool Maskot */}
        <View style={styles.coolMascotWrapper}>
          <CoolSunglassesMascot width={110} height={115} />
        </View>
      </View>

      {/* Pastki bo'shliq */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  // 1. Yuqori Qator
  topMilestoneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  trophyTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  zenMascotWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  // Qatorlar (S-curve joylashuvi)
  nodeRow: {
    width: '100%',
    paddingVertical: 12,
  },
  nodeRow5: {
    alignItems: 'center',
    marginLeft: -40, // center-left
  },
  nodeRow4: {
    alignItems: 'flex-end',
    paddingRight: 48, // right side
    marginTop: 6,
    marginBottom: 10,
  },
  nodeRow2: {
    alignItems: 'center',
    marginLeft: -40, // center-left
    marginVertical: 10,
  },
  // O'rta qator (Nishonlovchi maskot bilan)
  middleRowWithCelebratingMascot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
    paddingHorizontal: 12,
  },
  celebratingMascotWrapper: {
    width: 100,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  celebratingMascotImage: {
    width: 95,
    height: 115,
  },
  node3Wrapper: {
    alignItems: 'center',
    marginRight: 60, // center-right
  },
  // Pastki qator (Ko'zoynakli maskot bilan)
  bottomRowWithCoolMascot: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingHorizontal: 16,
  },
  node1Wrapper: {
    paddingLeft: 30, // left side
    marginBottom: 10,
  },
  coolMascotWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  bottomSpacer: {
    height: 30,
  },
  // 3D Tosh Dizayni
  stoneWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 86,
    height: 74,
  },
  touchableArea: {
    width: 86,
    height: 74,
    position: 'relative',
  },
  stone3DBase: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    borderRadius: 34,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  stoneFrontFace: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 64,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  glossHighlight: {
    position: 'absolute',
    top: 3,
    left: 7,
    right: 7,
    height: 28,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderTopWidth: 3.5,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 0,
    opacity: 0.85,
  },
  whiteIconPill: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  starContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedIconPill: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // "START!" Suzuvchi Pufakchasi
  startBubbleContainer: {
    position: 'absolute',
    bottom: 74,
    alignItems: 'center',
    zIndex: 20,
  },
  startBubbleBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#6A3DF5',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
    shadowColor: '#6A3DF5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  startBubbleText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1E1B4B',
    letterSpacing: 0.5,
  },
  startBubbleTailBorder: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#6A3DF5',
    alignSelf: 'center',
  },
  startBubbleTailFill: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
    position: 'absolute',
    bottom: 2,
    alignSelf: 'center',
  },
});
