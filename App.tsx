import React, { useState, useRef, useMemo } from 'react';
import { StyleSheet, View, Text, StatusBar, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { CameraView } from 'expo-camera';
import { theme } from './src/core/theme';
import './src/core/i18n'; // Initialize i18n
import { useTranslation } from 'react-i18next';
// Root App Component for MuudAI Real-time Socratic Tutor
import { BentoSubjectGrid } from './src/presentation/components/BentoSubjectGrid';
import { MysteryChestView } from './src/presentation/components/MysteryChestView';
import {
  SocraticStep,
  shuffleSocraticStep,
} from './src/domain/entities/SocraticDialogue';
import { TutorVoiceState } from './src/domain/entities/TutorState';
import { useGamificationStore } from './src/presentation/state/useGamificationStore';
import { useMistakeStore } from './src/presentation/state/useMistakeStore';
import { SubjectType } from './src/domain/entities/Gamification';
import { MistakeItem } from './src/domain/entities/MistakeReview';
import { MysteryRiddle } from './src/domain/entities/MysteryChest';
import { useMysteryChestStore } from './src/presentation/state/useMysteryChestStore';
import { useAppStore } from './src/presentation/state/useAppStore';
import { useSocraticScanner } from './src/presentation/hooks/useSocraticScanner';
import { SocraticScannerScreen } from './src/presentation/components/SocraticScannerScreen';
import { ReviewMistakesView } from './src/presentation/components/ReviewMistakesView';
import { WelcomeOnboardingScreen } from './src/presentation/components/WelcomeOnboardingScreen';
import { LanguageSelectionScreen } from './src/presentation/components/LanguageSelectionScreen';
import { LearnSelectionScreen } from './src/presentation/components/LearnSelectionScreen';
import { DailyStudyTargetScreen } from './src/presentation/components/DailyStudyTargetScreen';
import { ReferralSourceScreen } from './src/presentation/components/ReferralSourceScreen';
import { CreateProfilePromptScreen } from './src/presentation/components/CreateProfilePromptScreen';
import { ProfileNameScreen } from './src/presentation/components/ProfileNameScreen';

function MainApp() {
  const { t } = useTranslation();
  const [currentScreen, setCurrentScreen] = useState<'home' | 'camera' | 'chest' | 'scanner' | 'mistakes'>('home');
  // Onboarding alohida oqim: u `currentScreen` ga aralashmaydi, chunki
  // ko'rsatilishi saqlangan holatga bog'liq, joriy ekranga emas.
  const [onboardingStep, setOnboardingStep] =
    useState<'welcome' | 'language' | 'learn' | 'target' | 'referral' | 'profilePrompt' | 'profileName'>('welcome');
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
  const {
    hasSeenOnboarding,
    isHydrated,
    completeOnboarding,
    chooseLocale,
    studentName,
    setStudentName,
  } = useAppStore();

  // Onboarding qayta boshlanganda (masalan DEV tugmasi bilan) qadamni welcome'ga qaytarish
  React.useEffect(() => {
    if (!hasSeenOnboarding) {
      setOnboardingStep('welcome');
    }
  }, [hasSeenOnboarding]);

  const activeSubject = getActiveSubjectItem();


  // Kamerada xato yoki sirli jumboqni muvaffaqiyatli yechganda
  const handleCompletePracticingMistake = () => {
    if (activePracticingMistake) {
      // XP `solveMistake()` ichida beriladi. Ilgari shu yerda yana bir marta
      // `addXp()` chaqirilardi — bola bitta xato uchun ikki barobar XP olardi.
      solveMistake(activePracticingMistake.id);
      recordSolvedProblem();
      addBonusEnergy(1);
      if (activePracticingMistake.source === 'mystery_chest') {
        useMysteryChestStore.getState().unlockChest();
      }
      setActivePracticingMistake(null);
      setSocraticStepIndex(0);
      setIsSocraticFinished(false);
      clearSession();
      setCurrentScreen('home');
    }
  };

  // Faol Sokratik Bosqich (Real AI Sessiyasi yoki Xatolar Daftari yoki Demo Sokratik Rejim)
  const mistakeStep = useMemo(() => {
    if (!activePracticingMistake) return null;
    const rawStep: SocraticStep = {
      id: `mistake_step_${socraticStepIndex + 1}`,
      stepNumber: socraticStepIndex + 1,
      totalSteps: 2,
      stepTitle: t('app.mistake.stepTitle'),
      questionHeadline: t('app.mistake.questionHeadline'),
      tutorQuestion:
        socraticStepIndex === 0
          ? t('app.mistake.tutorQuestion1', { snippet: activePracticingMistake.questionSnippet })
          : t('app.mistake.tutorQuestion2'),
      explanationSnippet: activePracticingMistake.hintSummary,
      quickOptions:
        socraticStepIndex === 0
          ? [t('app.mistake.optionApplyRule'), t('app.mistake.optionGuess'), t('app.mistake.optionHint')]
          : [t('app.mistake.optionCalculate'), t('app.mistake.optionRecalculate')],
      correctOptionIndex: 0,
      hintText: activePracticingMistake.hintSummary,
      xpReward: Math.round(activePracticingMistake.xpReward / 2),
    };
    return shuffleSocraticStep(rawStep);
  }, [activePracticingMistake, socraticStepIndex, t]);

  // Haqiqiy sessiya yoki xatolar daftaridagi qadam bo'lmasa — `null`.
  // Zaxira demo qadam YO'Q: masala bo'lmasa, skaner ekrani kamerada qoladi.
  const currentSocraticStep: SocraticStep | null = mistakeStep
    ? mistakeStep
    : currentSession
    ? currentSession.steps[socraticStepIndex] ?? currentSession.steps[0] ?? null
    : null;

  /**
   * Bola noto'g'ri variantni tanladi. Qadam daftarga yoziladi va keyinroq
   * takrorlash uchun navbatda turadi (Duolingo "Mistakes" modeli).
   * Ekran shu paytda bosqichni oldinga surmaydi — bola qayta urinadi.
   */
  const handleWrongSocraticAnswer = () => {
    if (!currentSocraticStep || activePracticingMistake) return;

    addMistake({
      ageGroup,
      subject: activeSubject.id,
      topicTitle: currentSession?.problemTitle || currentSocraticStep.stepTitle,
      questionSnippet: currentSocraticStep.tutorQuestion || currentSession?.equation || '',
      hintSummary: currentSocraticStep.hintText || currentSocraticStep.explanationSnippet,
      // Takrorlashda XP kamroq: yangi masala yechish har doim qimmatroq
      // bo'lib qolishi kerak, aks holda xatoni "yig'ish" foydali bo'lib qoladi.
      xpReward: Math.max(5, Math.round(currentSocraticStep.xpReward / 2)),
      source: 'scan',
      sourceKey: `${currentSession?.id ?? 'session'}::${currentSocraticStep.id}`,
    });
  };

  const handleSelectSocraticOption = (optionIndex: number) => {
    // Haqiqiy qadam bo'lmasa XP ham, keyingi bosqich ham yo'q.
    if (!currentSocraticStep) return;

    // XP faqat TO'G'RI javobga. Ilgari bu funksiya indeksni umuman
    // tekshirmasdan har chaqiruvda XP berardi.
    if (optionIndex !== currentSocraticStep.correctOptionIndex) {
      handleWrongSocraticAnswer();
      return;
    }

    addXp(currentSocraticStep.xpReward);
    const total = activePracticingMistake ? 2 : currentSession?.steps.length ?? 0;
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
      // XP faqat haqiqatan tahlil qilingan sessiya uchun beriladi.
      // Ilgari sessiya bo'lmasa ham 50 XP berilardi — ya'ni bola hech narsa
      // yechmasdan mukofot olardi.
      if (!currentSession) {
        setSocraticStepIndex(0);
        setIsSocraticFinished(false);
        clearSession();
        setCurrentScreen('home');
        return;
      }
      addXp(currentSession.totalXpReward);
      recordSolvedProblem();
      setSocraticStepIndex(0);
      setIsSocraticFinished(false);
      clearSession();
      setCurrentScreen('home');
    }
  };

  const handleSnapPhoto = async () => {
    if (activePracticingMistake) {
      setSocraticStepIndex(0);
      setIsSocraticFinished(false);
      return;
    }
    const success = await captureAndAnalyze(cameraRef, activeSubject.id);
    if (success) {
      setSocraticStepIndex(0);
      setIsSocraticFinished(false);
    }
  };


  const handleOpenScannerDirectly = () => {
    const { energy } = useGamificationStore.getState();
    if (energy <= 0) return;
    setActivePracticingMistake(null);
    setSocraticStepIndex(0);
    setIsSocraticFinished(false);
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
    clearSession();
    setCurrentScreen('scanner');
  };

  // ── Onboarding oqimi ────────────────────────────────────────────────
  // Saqlangan holat o'qilgunicha hech narsa ko'rsatilmaydi. Aks holda
  // salomlashuv bir zumga chaqnab, keyin bosh sahifaga sakrab ketardi.
  if (!isHydrated) {
    return <View style={styles.homeContainer} />;
  }

  if (!hasSeenOnboarding) {
    if (onboardingStep === 'welcome') {
      return (
        <WelcomeOnboardingScreen
          onGetStarted={() => setOnboardingStep('language')}
          onLogin={() => setOnboardingStep('language')}
        />
      );
    }

    if (onboardingStep === 'language') {
      return (
        <LanguageSelectionScreen
          onBack={() => setOnboardingStep('welcome')}
          onContinue={(lang) => {
            // Tanlangan til saqlanadi va darhol qo'llanadi.
            chooseLocale(lang);
            setOnboardingStep('learn');
          }}
        />
      );
    }

    if (onboardingStep === 'learn') {
      return (
        <LearnSelectionScreen
          onBack={() => setOnboardingStep('language')}
          onContinue={(_topic) => {
            setOnboardingStep('target');
          }}
        />
      );
    }

    if (onboardingStep === 'target') {
      return (
        <DailyStudyTargetScreen
          onBack={() => setOnboardingStep('learn')}
          onContinue={(_target) => {
            setOnboardingStep('referral');
          }}
        />
      );
    }

    if (onboardingStep === 'referral') {
      return (
        <ReferralSourceScreen
          onBack={() => setOnboardingStep('target')}
          onContinue={(_source) => {
            setOnboardingStep('profilePrompt');
          }}
        />
      );
    }

    if (onboardingStep === 'profilePrompt') {
      return (
        <CreateProfilePromptScreen
          onBack={() => setOnboardingStep('referral')}
          onCreateProfile={() => {
            setOnboardingStep('profileName');
          }}
          onSkip={() => {
            // O'tkazib yuborish tanlandi — onboarding yakunlanadi
            setOnboardingStep('welcome');
            completeOnboarding();
          }}
        />
      );
    }

    if (onboardingStep === 'profileName') {
      return (
        <ProfileNameScreen
          initialName={studentName && studentName !== 'Alex' ? studentName : ''}
          onBack={() => setOnboardingStep('profilePrompt')}
          onContinue={(enteredName) => {
            if (enteredName) {
              setStudentName(enteredName);
            }
            setOnboardingStep('welcome');
            completeOnboarding();
          }}
        />
      );
    }

    return <View style={styles.homeContainer} />;
  }

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
            createdAt: new Date().toISOString(),
            source: 'mystery_chest',
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
    // Sessiya yo'q bo'lsa hamma narsa `undefined` — ekranga o'ylab topilgan
    // masala emas, kamera chiqadi.
    const scannerEquation = isAnalyzing
      ? statusMessage || t('app.scanner.analyzingMessage')
      : activePracticingMistake
      ? activePracticingMistake.questionSnippet
      : currentSession?.equation;

    const scannerQuestionText = isAnalyzing
      ? undefined
      : activePracticingMistake
      ? t('app.scanner.mistakeTitle')
      : currentSession?.questionText;

    const scannerProblemTitle = isAnalyzing
      ? undefined
      : activePracticingMistake
      ? activePracticingMistake.topicTitle
      : currentSession?.problemTitle;

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
        onWrongAnswer={handleWrongSocraticAnswer}
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
