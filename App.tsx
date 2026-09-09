import React, { useState, useRef, useMemo } from 'react';
import { StyleSheet, View, Text, StatusBar, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { CameraView } from 'expo-camera';
import { theme } from './src/core/theme';
// Root App Component for MuudAI Real-time Socratic Tutor
import { BentoSubjectGrid } from './src/presentation/components/BentoSubjectGrid';
import { MysteryChestView } from './src/presentation/components/MysteryChestView';
import {
  SocraticStep,
  DEMO_SOCRATIC_SESSION,
  getDemoSocraticSession,
  shuffleSocraticStep,
} from './src/domain/entities/SocraticDialogue';
import { TutorVoiceState } from './src/domain/entities/TutorState';
import { useGamificationStore } from './src/presentation/state/useGamificationStore';
import { useMistakeStore } from './src/presentation/state/useMistakeStore';
import { SubjectType } from './src/domain/entities/Gamification';
import { MistakeItem } from './src/domain/entities/MistakeReview';
import { MysteryRiddle } from './src/domain/entities/MysteryChest';
import { useMysteryChestStore } from './src/presentation/state/useMysteryChestStore';
import { useSocraticScanner } from './src/presentation/hooks/useSocraticScanner';
import { SocraticScannerScreen } from './src/presentation/components/SocraticScannerScreen';
import { ReviewMistakesView } from './src/presentation/components/ReviewMistakesView';

function MainApp() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'camera' | 'chest' | 'scanner' | 'mistakes'>('home');
  const [voiceState, setVoiceState] = useState<TutorVoiceState>('idle');
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [socraticStepIndex, setSocraticStepIndex] = useState<number>(0);
  const [isSocraticFinished, setIsSocraticFinished] = useState<boolean>(false);

  const cameraRef = useRef<CameraView | null>(null);
  const {
    currentSession,
    isAnalyzing,
    statusMessage,
    analysisError,
    analysisErrorType,
    captureAndAnalyze,
    clearSession,
  } = useSocraticScanner();

  const {
    getActiveSubjectItem,
    addXp,
    addBonusEnergy,
    recordSolvedProblem,
    setSubject,
  } = useGamificationStore();
  const {
    activePracticingMistake,
    setActivePracticingMistake,
    solveMistake,
    addMistake,
    ageGroup,
  } = useMistakeStore();

  const activeSubject = getActiveSubjectItem();


  // Kamerada xato yoki sirli jumboqni muvaffaqiyatli yechganda
  const handleCompletePracticingMistake = () => {
    if (activePracticingMistake) {
      solveMistake(activePracticingMistake.id);
      addXp(activePracticingMistake.xpReward);
      recordSolvedProblem();
      addBonusEnergy(1);
      if (activePracticingMistake.createdAt === 'Mystery Chest') {
        useMysteryChestStore.getState().unlockChest();
      }
      setActivePracticingMistake(null);
      setSocraticStepIndex(0);
      setIsSocraticFinished(false);
      setStepsWithMistake(new Set());
      clearSession();
      setCurrentScreen('home');
    }
  };

  const fallbackDemoSession = useMemo(
    () => getDemoSocraticSession(activeSubject.id),
    [activeSubject.id]
  );

  // Faol Sokratik Bosqich (Real AI Sessiyasi yoki Xatolar Daftari yoki Demo Sokratik Rejim)
  const mistakeStep = useMemo(() => {
    if (!activePracticingMistake) return null;
    const rawStep: SocraticStep = {
      id: `mistake_step_${socraticStepIndex + 1}`,
      stepNumber: socraticStepIndex + 1,
      totalSteps: 2,
      stepTitle: "Bosqichma-bosqich tahlil",
      questionHeadline: "Xatoni tahlil qilish",
      tutorQuestion:
        socraticStepIndex === 0
          ? `Keling, birga tahlil qilamiz: ${activePracticingMistake.questionSnippet}. Qaysi usul to'g'ri?`
          : `Deyarli yetib keldik! Yakuniy hisoblash qanday bo'ladi?`,
      explanationSnippet: activePracticingMistake.hintSummary,
      quickOptions:
        socraticStepIndex === 0
          ? ["To'g'ri qoidani qo'llash", "Taxminiy javob", "Maslahat olish"]
          : ["To'g'ri hisoblash", "Qayta hisoblash"],
      correctOptionIndex: 0,
      hintText: activePracticingMistake.hintSummary,
      xpReward: Math.round(activePracticingMistake.xpReward / 2),
    };
    return shuffleSocraticStep(rawStep);
  }, [activePracticingMistake, socraticStepIndex]);

  const currentSocraticStep: SocraticStep | null = mistakeStep
    ? mistakeStep
    : currentSession
    ? (currentSession.steps[socraticStepIndex] || currentSession.steps[0])
    : (fallbackDemoSession.steps[socraticStepIndex] || fallbackDemoSession.steps[fallbackDemoSession.steps.length - 1]);

  // Bola bir qadamda xato qilgan bo'lsa, o'sha qadam uchun XP berilmaydi.
  // Ekran to'g'ri javob berilmaguncha oldinga o'tkazmaydi, shuning uchun bu
  // yerga faqat to'g'ri javob keladi — lekin yordamsiz yechganini bilishimiz
  // kerak (docs/PEDAGOGY.md §8: mastery faqat yordamsiz javobdan hisoblanadi).
  const [stepsWithMistake, setStepsWithMistake] = useState<Set<number>>(new Set());

  // Bola noto'g'ri variantni bosganda — xatolar daftariga yoziladi.
  // Bu MuudAI ning asosiy tsikli: xato → ertaga takrorlash → +1 energiya.
  const handleWrongAnswer = (_chosenIndex: number) => {
    setStepsWithMistake((prev) => new Set(prev).add(socraticStepIndex));

    // Xatolar daftaridagi masalani qayta yechayotganda yangi xato yozilmaydi —
    // aks holda ro'yxat cheksiz o'sib ketadi.
    if (activePracticingMistake || !currentSocraticStep) return;

    const problemTitle = currentSession?.problemTitle || fallbackDemoSession.problemTitle;
    addMistake({
      ageGroup,
      subject: activeSubject.id,
      topicTitle: currentSocraticStep.stepTitle || problemTitle,
      questionSnippet: currentSocraticStep.tutorQuestion,
      hintSummary: currentSocraticStep.hintText,
      xpReward: currentSocraticStep.xpReward,
    });
  };

  const handleSelectSocraticOption = (_optionIndex: number) => {
    // XP faqat qadam xatosiz yechilganda beriladi.
    const solvedUnaided = !stepsWithMistake.has(socraticStepIndex);
    if (currentSocraticStep && solvedUnaided) addXp(currentSocraticStep.xpReward);
    const total = activePracticingMistake
      ? 2
      : currentSession
      ? currentSession.steps.length
      : fallbackDemoSession.steps.length;
    if (socraticStepIndex + 1 < total) {
      setSocraticStepIndex((prev) => prev + 1);
    } else {
      setIsSocraticFinished(true);
    }
  };

  const handleClaimVictory = () => {
    if (activePracticingMistake) {
      handleCompletePracticingMistake();
    } else {
      if (currentSession) {
        addXp(currentSession.totalXpReward);
      } else {
        addXp(50);
      }
      recordSolvedProblem();
      setSocraticStepIndex(0);
      setIsSocraticFinished(false);
      setStepsWithMistake(new Set());
      clearSession();
      setCurrentScreen('home');
    }
  };

  const handleSnapPhoto = async () => {
    if (activePracticingMistake) {
      setSocraticStepIndex(0);
      setIsSocraticFinished(false);
      setStepsWithMistake(new Set());
      return;
    }
    const success = await captureAndAnalyze(cameraRef, activeSubject.id);
    if (success) {
      setSocraticStepIndex(0);
      setIsSocraticFinished(false);
      setStepsWithMistake(new Set());
    }
  };


  const handleOpenScannerDirectly = () => {
    const { energy } = useGamificationStore.getState();
    if (energy <= 0) return;
    setActivePracticingMistake(null);
    setSocraticStepIndex(0);
    setIsSocraticFinished(false);
    setStepsWithMistake(new Set());
    clearSession();
    setCurrentScreen('scanner');
  };

  const handleStartSubjectDirectly = (subject: SubjectType) => {
    if (subject !== 'math') return;
    const { energy } = useGamificationStore.getState();
    if (energy <= 0) return;
    setSubject(subject);
    setActivePracticingMistake(null);
    setSocraticStepIndex(0);
    setIsSocraticFinished(false);
    setStepsWithMistake(new Set());
    clearSession();
    setCurrentScreen('scanner');
  };

  // 1. Asosiy Bosh Sahifa: Bento Grid (Ultra-Pro Home Dashboard)
  if (currentScreen === 'home') {
    return (
      <SafeAreaView style={styles.homeContainer}>
        <StatusBar barStyle="dark-content" />
        <BentoSubjectGrid
          onStartSubject={handleStartSubjectDirectly}
          onOpenMysteryChest={() => setCurrentScreen('chest')}
          onOpenScanner={handleOpenScannerDirectly}
          onOpenMistakes={() => setCurrentScreen('mistakes')}
        />
      </SafeAreaView>
    );
  }

  // 2. Sirli Sandiq Sahifasi (Daily Mystery Chest Riddle & Loot View)
  if (currentScreen === 'chest') {
    return (
      <MysteryChestView
        onBack={() => setCurrentScreen('home')}
        onPracticeWithCamera={(riddle: MysteryRiddle) => {
          setSubject(riddle.subject);
          setActivePracticingMistake({
            id: riddle.sourceMistakeId || riddle.id,
            ageGroup: riddle.ageGroup,
            subject: riddle.subject,
            topicTitle: riddle.title,
            questionSnippet: riddle.puzzleSnippet,
            hintSummary: riddle.clueText,
            xpReward: riddle.xpReward,
            solved: false,
            createdAt: 'Mystery Chest',
          });
          setSocraticStepIndex(0);
          setIsSocraticFinished(false);
          clearSession();
          setCurrentScreen('scanner');
        }}
      />
    );
  }

  if (currentScreen === 'mistakes') {
    return (
      <ReviewMistakesView
        onBack={() => setCurrentScreen('home')}
        onPracticeMistake={(mistake: MistakeItem) => {
          setActivePracticingMistake(mistake);
          setSocraticStepIndex(0);
          setIsSocraticFinished(false);
          clearSession();
          setCurrentScreen('scanner');
        }}
      />
    );
  }

  // 3. Socratic AI Camera Scanner (Full-Screen Socratic AR Vision & Tutor Screen)
  if (currentScreen === 'scanner' || currentScreen === 'camera') {
    const scannerEquation = isAnalyzing
      ? statusMessage || "Socrates Jr. masalani o'qiyapti..."
      : activePracticingMistake
      ? activePracticingMistake.questionSnippet
      : currentSession
      ? currentSession.equation
      : fallbackDemoSession.equation;

    const scannerQuestionText = isAnalyzing
      ? undefined
      : activePracticingMistake
      ? "Xatolar daftarchasidagi masalani birga tahlil qilamiz:"
      : currentSession?.questionText || fallbackDemoSession.questionText;

    const scannerProblemTitle = isAnalyzing
      ? undefined
      : activePracticingMistake
      ? activePracticingMistake.topicTitle
      : currentSession?.problemTitle || fallbackDemoSession.problemTitle;

    return (
      <SocraticScannerScreen
        onBack={() => {
          setActivePracticingMistake(null);
          setSocraticStepIndex(0);
          setIsSocraticFinished(false);
          clearSession();
          setCurrentScreen('home');
        }}
        activeSubject={activeSubject}
        currentStep={currentSocraticStep}
        isFinished={isSocraticFinished}
        stepXp={currentSocraticStep ? currentSocraticStep.xpReward : 25}
        cameraRef={cameraRef}
        torchOn={torchOn}
        onToggleTorch={() => setTorchOn((prev) => !prev)}
        onSelectOption={handleSelectSocraticOption}
        onWrongAnswer={handleWrongAnswer}
        onClaimVictory={handleClaimVictory}
        onSnapPhoto={handleSnapPhoto}
        isAnalyzing={isAnalyzing}
        analysisError={analysisError}
        analysisErrorType={analysisErrorType}
        equation={scannerEquation}
        questionText={scannerQuestionText}
        problemTitle={scannerProblemTitle}
      />
    );
  }

  // Fallback to Home Dashboard
  return (
    <SafeAreaView style={styles.homeContainer}>
      <StatusBar barStyle="dark-content" />
      <BentoSubjectGrid
        onStartSubject={handleStartSubjectDirectly}
        onOpenMysteryChest={() => setCurrentScreen('chest')}
        onOpenScanner={handleOpenScannerDirectly}
        onOpenMistakes={() => setCurrentScreen('mistakes')}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider style={styles.rootProvider}>
      <MainApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootProvider: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  homeContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
