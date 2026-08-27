import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getFamilyMembers, saveGameResult } from '../../services/storage';
import { getAdaptiveState, updateAdaptiveState } from '../../services/adaptiveDifficulty';
import {
  extractFaceEmbeddingFromSource,
  matchLiveFaceToFamily,
  ensureFamilyEmbeddings,
  runBiometricSelfTest,
  initializeFaceRecognitionModels,
  getModelStatus,
  type MatchResult,
} from '../../services/faceRecognition';
import { GameHeader } from '../../components/common/GameHeader';
import { ResultScreen } from '../../components/common/ResultScreen';
import { Button, Card, EmptyState } from '../../components/common/UIComponents';
import { VoiceInput } from '../../components/common/VoiceInput';
import { Users, Heart, HelpCircle, ArrowRight, Play, Camera, CameraOff, AlertCircle, Bug, CheckCircle2, XCircle, Cpu } from 'lucide-react';
import type { FamilyMember } from '../../types';

export interface PhotoQuizOption {
  id: string;
  photoUrl: string;
  name: string;
  relationship: string;
  isCorrect: boolean;
  labelIndex: number;
}

export const FamilyRecognitionGame: React.FC<{ onBackToDashboard: () => void }> = ({ onBackToDashboard }) => {
  const { user } = useAuth();
  const userId = user?.uid || 'patient-1';

  // THREE SEPARATE MODES: 'recall' | 'quiz' | 'camera'
  const [mode, setMode] = useState<'start' | 'select' | 'recall' | 'quiz' | 'camera' | 'result'>('start');
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [score, setScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [levelChanged, setLevelChanged] = useState<'increased' | 'decreased' | 'unchanged'>('unchanged');

  // AI Camera Recognition State & Developer Debug Panel
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<
    | 'idle'
    | 'starting'
    | 'no_face'
    | 'multiple_faces'
    | 'face_detected'
    | 'recognizing'
    | 'recognized'
    | 'unrecognized'
    | 'permission_denied'
    | 'camera_error'
  >('idle');

  const [matchedResult, setMatchedResult] = useState<MatchResult | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [showDebug, setShowDebug] = useState(true);

  // Debug metrics & self-test
  const [videoDim, setVideoDim] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [faceDetected, setFaceDetected] = useState<boolean>(false);
  const [faceCount, setFaceCount] = useState<number>(0);
  const [embeddingStatus, setEmbeddingStatus] = useState<'READY' | 'IDLE' | 'ERROR'>('IDLE');
  const [selfTestResult, setSelfTestResult] = useState<{ passed: boolean; distance: number; message: string }>({
    passed: false,
    distance: 0,
    message: 'Initializing...',
  });

  const [modelState, setModelState] = useState<{ status: string; error: string | null }>({
    status: 'LOADING',
    error: null,
  });

  useEffect(() => {
    async function loadModelsAndFamily() {
      setLoading(true);
      // Step 1: Initialize pretrained neural network models
      await initializeFaceRecognitionModels();
      const statusInfo = getModelStatus();
      setModelState({ status: statusInfo.status, error: statusInfo.error });

      // Step 2: Fetch target patient's registered family members
      const targetPatientId = user?.role === 'caregiver' ? user.patientId : user?.uid || 'patient-1';
      const members = await getFamilyMembers(targetPatientId);

      // Step 3: Ensure 128D neural network descriptors are extracted & cached for all photos
      const processedMembers = await ensureFamilyEmbeddings(members);
      setFamilyMembers(processedMembers);
      setLoading(false);

      // Step 4: Run biometric self-test (TEST 1 requirement)
      const selfTest = await runBiometricSelfTest();
      setSelfTestResult({
        passed: selfTest.passed,
        distance: selfTest.selfDistance,
        message: selfTest.message,
      });
    }
    loadModelsAndFamily();

    const adaptive = getAdaptiveState(userId, 'family-recognition');
    setCurrentLevel(adaptive.currentLevel);
  }, [userId, user]);

  // Clean up camera stream when component unmounts or leaves camera mode
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // REAL-TIME CONTINUOUS DETECTION LOOP
  useEffect(() => {
    let intervalId: any = null;

    if (mode === 'camera' && cameraActive && videoRef.current) {
      intervalId = setInterval(async () => {
        if (!videoRef.current || videoRef.current.readyState < 2) return;

        const w = videoRef.current.videoWidth;
        const h = videoRef.current.videoHeight;
        setVideoDim({ width: w, height: h });

        if (w === 0 || h === 0) return;

        const detection = await extractFaceEmbeddingFromSource(videoRef.current);

        if (!detection.hasFace) {
          setFaceDetected(false);
          setFaceCount(0);
          if (cameraStatus !== 'recognized' && cameraStatus !== 'unrecognized') {
            setCameraStatus('no_face');
          }
        } else if (detection.faceCount > 1) {
          setFaceDetected(true);
          setFaceCount(detection.faceCount);
          if (cameraStatus !== 'recognized' && cameraStatus !== 'unrecognized') {
            setCameraStatus('multiple_faces');
          }
        } else {
          setFaceDetected(true);
          setFaceCount(1);
          setEmbeddingStatus('READY');
          if (cameraStatus === 'no_face' || cameraStatus === 'idle') {
            setCameraStatus('face_detected');
          }
        }
      }, 600);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [mode, cameraActive, cameraStatus]);

  const currentMember = familyMembers[currentIndex];

  const INDIAN_DUMMY_PHOTOS = [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=500&q=80',
  ];

  const quizPhotoOptions: PhotoQuizOption[] = React.useMemo(() => {
    if (!currentMember || familyMembers.length === 0) return [];

    // 1. Correct Option (Real uploaded photo of current family member from Caregiver Portal)
    const correctOpt: PhotoQuizOption = {
      id: currentMember.id || `correct-${currentIndex}`,
      photoUrl: currentMember.photoUrl,
      name: currentMember.name,
      relationship: currentMember.relationship,
      isCorrect: true,
      labelIndex: 0,
    };

    // 2. Distractor options from other uploaded family members
    const otherMembers = familyMembers
      .filter((m) => m.id !== currentMember.id && m.photoUrl !== currentMember.photoUrl)
      .map((m) => ({
        id: m.id,
        photoUrl: m.photoUrl,
        name: m.name,
        relationship: m.relationship,
        isCorrect: false,
        labelIndex: 0,
      }));

    // 3. Fill up to 3 distractors using curated Indian stock photos
    const dummyDistractors: PhotoQuizOption[] = [];
    const baseOffset = currentIndex * 3;
    for (let i = 0; i < 3; i++) {
      const dummyUrl = INDIAN_DUMMY_PHOTOS[(baseOffset + i) % INDIAN_DUMMY_PHOTOS.length];
      if (dummyUrl !== currentMember.photoUrl && !otherMembers.some((om) => om.photoUrl === dummyUrl)) {
        dummyDistractors.push({
          id: `dummy-${currentIndex}-${i}`,
          photoUrl: dummyUrl,
          name: `Relative ${i + 1}`,
          relationship: 'Relative',
          isCorrect: false,
          labelIndex: 0,
        });
      }
    }

    const distractors = [...otherMembers, ...dummyDistractors].slice(0, 3);
    const combined = [correctOpt, ...distractors];

    // Seeded shuffle so order stays fixed for this question
    const seed = (currentIndex + 1) * 31;
    const shuffled = combined.sort((a, b) => {
      const hashA = (a.photoUrl.length * seed) % 100;
      const hashB = (b.photoUrl.length * seed) % 100;
      return hashA - hashB;
    });

    return shuffled.map((opt, idx) => ({ ...opt, labelIndex: idx + 1 }));
  }, [currentMember, familyMembers, currentIndex]);

  const startRecallMode = () => {
    setCurrentIndex(0);
    setMode('recall');
  };

  const startQuizMode = () => {
    setCurrentIndex(0);
    setCorrectAnswers(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setVoiceNotice(null);
    setMode('quiz');
  };

  const startCameraMode = () => {
    setMatchedResult(null);
    setCameraStatus('idle');
    setMode('camera');
  };

  const handleNextRecall = () => {
    if (currentIndex + 1 < familyMembers.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setMode('select');
    }
  };

  const handleSelectQuizOption = async (option: PhotoQuizOption, method: 'button' | 'voice' = 'button') => {
    if (isAnswered) return;

    setSelectedOption(option.id);
    setIsAnswered(true);
    setVoiceNotice(null);

    const isCorrect = option.isCorrect;

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    }

    const { levelChanged: changeType } = updateAdaptiveState(
      userId,
      'family-recognition',
      isCorrect,
      2.5
    );

    setLevelChanged(changeType);

    setTimeout(() => {
      if (currentIndex + 1 < familyMembers.length) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        finishQuiz(isCorrect ? correctAnswers + 1 : correctAnswers, method);
      }
    }, 2200);
  };

  const handleSpokenAnswer = (spokenText: string) => {
    if (isAnswered) return;

    const cleanSpoken = spokenText.toLowerCase().replace(/[^\w\s]/gi, '').trim();

    let matchedOption: PhotoQuizOption | undefined;

    if (cleanSpoken.includes('1') || cleanSpoken.includes('first') || cleanSpoken.includes('one')) {
      matchedOption = quizPhotoOptions.find((o) => o.labelIndex === 1);
    } else if (cleanSpoken.includes('2') || cleanSpoken.includes('second') || cleanSpoken.includes('two')) {
      matchedOption = quizPhotoOptions.find((o) => o.labelIndex === 2);
    } else if (cleanSpoken.includes('3') || cleanSpoken.includes('third') || cleanSpoken.includes('three')) {
      matchedOption = quizPhotoOptions.find((o) => o.labelIndex === 3);
    } else if (cleanSpoken.includes('4') || cleanSpoken.includes('fourth') || cleanSpoken.includes('four')) {
      matchedOption = quizPhotoOptions.find((o) => o.labelIndex === 4);
    } else {
      matchedOption = quizPhotoOptions.find((o) => {
        const cleanName = o.name.toLowerCase();
        const cleanRel = o.relationship.toLowerCase();
        return cleanSpoken.includes(cleanName) || cleanSpoken.includes(cleanRel);
      });
    }

    if (matchedOption) {
      handleSelectQuizOption(matchedOption, 'voice');
    } else {
      setVoiceNotice(`I heard "${spokenText}". Say "Option 1", "Option 2", "Option 3", "Option 4" or tap a photo.`);
    }
  };

  const finishQuiz = async (finalCorrect: number, method: 'button' | 'voice') => {
    const total = familyMembers.length;
    const accuracyPct = Math.round((finalCorrect / total) * 100);
    const finalScore = accuracyPct;

    setScore(finalScore);

    await saveGameResult({
      userId,
      userName: user?.name || 'Aarav Sharma',
      gameType: 'family-recognition',
      score: finalScore,
      accuracy: accuracyPct,
      correctAnswers: finalCorrect,
      totalQuestions: total,
      responseTime: 2.5,
      difficultyLevel: currentLevel,
      inputMethod: method,
      createdAt: new Date().toISOString(),
    });

    setMode('result');
  };

  /* AI CAMERA RECOGNITION PIPELINE */
  const startCameraStream = async () => {
    setCameraStatus('starting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
      });

      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
      setCameraStatus('idle');
    } catch (e: any) {
      console.warn('Camera error', e);
      if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
        setCameraStatus('permission_denied');
      } else {
        setCameraStatus('camera_error');
      }
    }
  };

  const stopCameraStream = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setCameraActive(false);
    setCameraStatus('idle');
    setFaceDetected(false);
    setFaceCount(0);
  };

  const triggerFaceRecognition = async () => {
    if (!videoRef.current || !cameraActive || cameraStatus === 'recognizing') return;

    setCameraStatus('recognizing');

    try {
      // 1. Wrap neural network extraction in a 4.5s timeout safety guard
      const timeoutPromise = new Promise<{ hasFace: boolean; faceCount: number; reason?: any; embedding?: number[]; confidence?: number }>((resolve) => {
        setTimeout(() => {
          resolve({ hasFace: false, faceCount: 0, reason: 'no_face' });
        }, 4500);
      });

      // 2. Extract 128D Neural Net Descriptor with Canvas snapshot
      const detection = await Promise.race([
        extractFaceEmbeddingFromSource(videoRef.current),
        timeoutPromise,
      ]);

      if (!detection.hasFace || !detection.embedding) {
        setCameraStatus('no_face');
        return;
      }

      if (detection.faceCount > 1) {
        setCameraStatus('multiple_faces');
        return;
      }

      // 3. Compare 128D Neural Network Descriptor against Registered Family Members (Euclidean Distance <= 0.48)
      const match = matchLiveFaceToFamily(detection.embedding, familyMembers, 0.48);

      setMatchedResult(match);
      if (match.status === 'recognized') {
        setCameraStatus('recognized');
      } else {
        setCameraStatus('unrecognized');
      }
    } catch (err) {
      console.error('Recognition error:', err);
      setCameraStatus('no_face');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-12 h-12 border-4 border-amber-300 border-t-amber-700 rounded-full animate-spin mx-auto" />
        <p className="text-slate-700 font-extrabold text-xl">Loading Pretrained Neural Network Models & Family Photos...</p>
      </div>
    );
  }

  if (familyMembers.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <EmptyState
          title="No Family Photos Added Yet"
          description="Your caregiver can add family photos, names, and relationships in the Caregiver Portal to activate Recall Aid, Quiz Mode, and AI Camera Recognition."
          icon={Users}
          action={
            <Button variant="outline" size="xl" onClick={onBackToDashboard}>
              Back to Activities
            </Button>
          }
        />
      </div>
    );
  }

  /* INSTRUCTION / PRE-GAME SCREEN */
  if (mode === 'start') {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <Card className="text-center p-8 sm:p-10 border-3 border-amber-200 shadow-xl space-y-6">
          <div className="w-20 h-20 bg-amber-100 text-amber-800 rounded-3xl flex items-center justify-center mx-auto border-2 border-amber-300">
            <Users className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Family Recognition</h2>
            <p className="text-slate-700 text-xl font-bold">
              Practice recognizing your family members and loved ones with photos, memory quizzes, or live camera recognition.
            </p>
            <p className="text-amber-900 font-extrabold text-lg pt-2">
              Take your time. There is no need to hurry.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="xl" icon={Play} onClick={() => setMode('select')} fullWidth>
              Choose Mode
            </Button>
            <Button variant="outline" size="xl" onClick={onBackToDashboard} fullWidth>
              Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  /* MODE SELECTION SCREEN: THREE SEPARATE MODES */
  if (mode === 'select') {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <Card className="text-center p-8 sm:p-10 border-3 border-teal-200 shadow-xl space-y-8">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Family Recognition</h2>
            <p className="text-slate-700 text-xl font-bold mt-2">
              Select one of the three modes below
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* MODE 1: RECALL AID */}
            <Card
              hoverEffect
              onClick={startRecallMode}
              className="p-6 border-3 border-teal-300 hover:border-teal-700 bg-teal-50/50 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <Heart className="w-10 h-10 text-teal-700" />
                <h3 className="text-2xl font-black text-slate-900">❤️ Recall Aid</h3>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                  View family photos with names and relationship descriptions at your own pace.
                </p>
              </div>
              <Button variant="primary" size="md" icon={Heart} fullWidth>
                Start Recall Aid
              </Button>
            </Card>

            {/* MODE 2: QUIZ MODE */}
            <Card
              hoverEffect
              onClick={startQuizMode}
              className="p-6 border-3 border-indigo-300 hover:border-indigo-700 bg-indigo-50/50 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <HelpCircle className="w-10 h-10 text-indigo-700" />
                <h3 className="text-2xl font-black text-slate-900">🧠 Quiz Mode</h3>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                  Identify your family members from photos by tapping or speaking their name.
                </p>
              </div>
              <Button variant="secondary" size="md" icon={HelpCircle} fullWidth>
                Start Family Quiz
              </Button>
            </Card>

            {/* MODE 3: AI CAMERA RECOGNITION */}
            <Card
              hoverEffect
              onClick={startCameraMode}
              className="p-6 border-3 border-amber-300 hover:border-amber-700 bg-amber-50/50 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <Camera className="w-10 h-10 text-amber-700" />
                <h3 className="text-2xl font-black text-slate-900">🤖 Recognize Someone</h3>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                  Use the camera to identify a familiar person in real-time.
                </p>
              </div>
              <Button variant="accent" size="md" icon={Camera} fullWidth>
                Recognize Someone
              </Button>
            </Card>
          </div>

          <Button variant="outline" size="xl" onClick={onBackToDashboard}>
            Back to Activities
          </Button>
        </Card>
      </div>
    );
  }

  /* MODE 1: RECALL AID (PRESERVED SIMPLE PHOTO REVIEW) */
  if (mode === 'recall') {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <GameHeader
          title="Family Recall Aid"
          level={currentLevel}
          onBack={() => setMode('select')}
          instruction={`Card ${currentIndex + 1} of ${familyMembers.length}`}
        />

        <Card className="text-center p-8 sm:p-10 border-3 border-teal-300 shadow-xl space-y-6">
          <div className="w-64 h-64 mx-auto rounded-3xl overflow-hidden shadow-lg border-4 border-white">
            <img
              src={currentMember.photoUrl}
              alt={currentMember.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-4xl font-black text-slate-900">This is {currentMember.name}.</h3>
            <p className="text-2xl font-extrabold text-teal-800">
              She/He is your <span className="underline decoration-teal-500">{currentMember.relationship}</span>.
            </p>
            {currentMember.notes && (
              <p className="text-base font-medium text-slate-600 max-w-md mx-auto pt-2 italic">
                "{currentMember.notes}"
              </p>
            )}
          </div>

          <div className="pt-4 flex justify-center">
            <Button variant="primary" size="xl" icon={ArrowRight} onClick={handleNextRecall} fullWidth>
              {currentIndex + 1 < familyMembers.length ? 'Continue' : 'Finish Recall Aid'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  /* RESULT SCREEN FOR QUIZ MODE */
  if (mode === 'result') {
    return (
      <ResultScreen
        gameTitle="Family Recognition"
        score={score}
        accuracy={Math.round((correctAnswers / familyMembers.length) * 100)}
        correctAnswers={correctAnswers}
        totalQuestions={familyMembers.length}
        responseTime={2.5}
        currentLevel={currentLevel}
        levelChanged={levelChanged}
        onRestart={startQuizMode}
        onBack={onBackToDashboard}
      />
    );
  }

  /* MODE 2: QUIZ MODE (ASK: WHICH PHOTO IS YOUR [RELATIONSHIP] WITH 4 PHOTO OPTIONS) */
  if (mode === 'quiz') {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
        <GameHeader
          title="Family Quiz"
          level={currentLevel}
          score={correctAnswers * 30}
          onBack={() => setMode('select')}
          instruction={`Question ${currentIndex + 1} of ${familyMembers.length}`}
        />

        <Card className="text-center p-6 sm:p-10 border-3 border-indigo-300 shadow-xl space-y-8">
          {/* QUESTION BANNER */}
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-teal-800 text-white p-6 sm:p-8 rounded-3xl space-y-2 shadow-md">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-teal-200 text-xs font-black uppercase tracking-wider rounded-full">
              Family Photo Identification
            </span>
            <h3 className="text-2xl sm:text-4xl font-black leading-tight tracking-tight">
              Which photo shows your <span className="text-amber-300 underline decoration-amber-400 decoration-wavy underline-offset-4">{currentMember.relationship}</span>?
            </h3>
            <p className="text-teal-200 text-lg font-bold">
              ({currentMember.name})
            </p>
          </div>

          {!isAnswered && (
            <div className="pt-2">
              <VoiceInput onConfirmAnswer={handleSpokenAnswer} promptText='Say "Option 1", "Option 2", "Option 3" or "Option 4"' />
            </div>
          )}

          {voiceNotice && (
            <div className="p-4 bg-amber-50 border-2 border-amber-300 text-amber-950 font-extrabold text-base rounded-2xl animate-fadeIn">
              {voiceNotice}
            </div>
          )}

          {/* 4 PHOTO CARDS GRID */}
          <div>
            <p className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4">
              Tap the correct photo card below:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {quizPhotoOptions.map((option) => {
                const isSelected = selectedOption === option.id;
                const isCorrect = option.isCorrect;

                let cardStyle = 'bg-white border-3 border-slate-300 hover:border-teal-600 hover:shadow-xl';
                let badgeStyle = 'bg-slate-800 text-white';

                if (isAnswered) {
                  if (isCorrect) {
                    cardStyle = 'bg-emerald-50 border-4 border-emerald-600 ring-4 ring-emerald-300 shadow-2xl scale-105';
                    badgeStyle = 'bg-emerald-600 text-white';
                  } else if (isSelected) {
                    cardStyle = 'bg-rose-50 border-4 border-rose-600 opacity-80';
                    badgeStyle = 'bg-rose-600 text-white';
                  } else {
                    cardStyle = 'bg-slate-100 border-slate-200 opacity-40';
                    badgeStyle = 'bg-slate-400 text-white';
                  }
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectQuizOption(option, 'button')}
                    disabled={isAnswered}
                    className={`relative rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col items-center group ${cardStyle}`}
                  >
                    {/* OPTION NUMBER BADGE */}
                    <div className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md ${badgeStyle}`}>
                      Option {option.labelIndex}
                    </div>

                    {/* PHOTO PREVIEW */}
                    <div className="w-full h-44 sm:h-52 overflow-hidden bg-slate-200">
                      <img
                        src={option.photoUrl}
                        alt={`Option ${option.labelIndex}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80';
                        }}
                      />
                    </div>

                    {/* SELECTION LABEL */}
                    <div className="p-3 w-full text-center bg-white border-t border-slate-100 font-extrabold text-sm sm:text-base">
                      {isAnswered ? (
                        isCorrect ? (
                          <span className="text-emerald-700 flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> {option.name}
                          </span>
                        ) : isSelected ? (
                          <span className="text-rose-700 flex items-center justify-center gap-1">
                            <XCircle className="w-4 h-4" /> Incorrect
                          </span>
                        ) : (
                          <span className="text-slate-400">Option {option.labelIndex}</span>
                        )
                      ) : (
                        <span className="text-slate-700 group-hover:text-teal-700">Option {option.labelIndex}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ANSWER FEEDBACK */}
          {isAnswered && (
            <div
              className={`p-6 rounded-3xl text-xl font-extrabold transition-all border-2 ${
                selectedOption === quizPhotoOptions.find((o) => o.isCorrect)?.id
                  ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                  : 'bg-amber-100 text-amber-950 border-amber-400'
              }`}
            >
              {selectedOption === quizPhotoOptions.find((o) => o.isCorrect)?.id
                ? `🎉 That's right! This is your ${currentMember.relationship}, ${currentMember.name}!`
                : ` That's okay. Option ${quizPhotoOptions.find((o) => o.isCorrect)?.labelIndex} is your ${currentMember.relationship}, ${currentMember.name}.`}
            </div>
          )}
        </Card>
      </div>
    );
  }

  /* MODE 3: AI CAMERA RECOGNITION (REAL PRETRAINED NEURAL NETWORK & DEV DEBUG PANEL) */
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <GameHeader
        title="Recognize Someone"
        level={currentLevel}
        onBack={() => {
          stopCameraStream();
          setMode('select');
        }}
        instruction="Look at the camera so we can see who this is."
      />

      {/* DEVELOPER DEBUG PANEL TOGGLE BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 hover:bg-slate-300 cursor-pointer"
        >
          <Bug className="w-3.5 h-3.5" />
          {showDebug ? 'Hide Dev Debug Panel' : 'Dev Debug Panel'}
        </button>
      </div>

      {/* DEVELOPER DEBUG PANEL */}
      {showDebug && (
        <div className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-2xl border-2 border-slate-700 space-y-1">
          <p className="font-bold text-amber-400 border-b border-slate-700 pb-1 mb-2">DEVELOPER NEURAL NETWORK DEBUG PANEL</p>
          <div className="flex items-center gap-1.5 text-emerald-300 pb-1 border-b border-slate-800">
            <Cpu className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Pretrained Model Status: <strong className="text-white">{modelState.status} (faceRecognitionNet)</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-300 pb-1 border-b border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Self-Test Result (TEST 1): <strong className="text-white">{selfTestResult.message}</strong></span>
          </div>
          <p>Video Frame Dimensions: <span className="text-white font-bold">{videoDim.width} × {videoDim.height}</span></p>
          <p>Face Detected: <span className={faceDetected ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{faceDetected ? 'YES' : 'NO'}</span></p>
          <p>Detected Faces Count: <span className="text-white font-bold">{faceCount}</span></p>
          <p>Embedding Vector: <span className="text-white font-bold">{embeddingStatus} (Float32Array(128) Neural Net Descriptor)</span></p>
          <p>Registered Candidates: <span className="text-white font-bold">{familyMembers.length}</span> ({familyMembers.map((m) => `${m.name}:${m.embeddings?.length || 0}`).join(', ')})</p>
          {matchedResult && (
            <>
              <p>Best Candidate Match: <span className="text-white font-bold">{matchedResult.matchedMember?.name || 'None'}</span></p>
              <p>Euclidean Distance: <span className="text-amber-300 font-bold">{matchedResult.euclideanDistance.toFixed(4)}</span></p>
              <p>Threshold Required: <span className="text-sky-300 font-bold font-extrabold">{matchedResult.threshold.toFixed(2)} (Distance &le; 0.60)</span></p>
              <p>Final Decision: <span className={matchedResult.status === 'recognized' ? 'text-emerald-400 font-extrabold' : 'text-rose-400 font-extrabold'}>{matchedResult.status === 'recognized' ? 'MATCH' : 'UNKNOWN (NOT MATCHED)'}</span></p>
            </>
          )}
        </div>
      )}

      <Card className="p-8 sm:p-10 border-3 border-amber-300 shadow-xl text-center space-y-6">
        {/* CAMERA DISPLAY FRAME */}
        <div className="w-full max-w-lg h-72 sm:h-80 mx-auto rounded-3xl bg-slate-900 overflow-hidden relative border-4 border-slate-800 shadow-xl flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
          />

          {!cameraActive && (
            <div className="p-6 text-center text-slate-300 space-y-3">
              <Camera className="w-14 h-14 mx-auto text-amber-400 opacity-80" />
              <p className="text-xl font-extrabold text-white">Camera is currently stopped</p>
              <p className="text-sm font-semibold text-slate-400">Click 'Start Camera' below to recognize someone.</p>
            </div>
          )}

          {cameraStatus === 'starting' && (
            <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center text-white p-4">
              <div className="w-10 h-10 border-4 border-amber-300 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-lg font-bold">Starting camera...</p>
            </div>
          )}

          {cameraStatus === 'recognizing' && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4">
              <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xl font-black text-amber-300">Running Neural Network Inference...</p>
            </div>
          )}
        </div>

        {/* STATUS DISPLAY MESSAGES */}
        {cameraStatus === 'no_face' && (
          <div className="p-4 bg-amber-50 border-2 border-amber-300 text-amber-950 font-extrabold text-lg rounded-2xl">
            We can't see a face yet. Please face the camera clearly.
          </div>
        )}

        {cameraStatus === 'face_detected' && (
          <div className="p-4 bg-emerald-50 border-2 border-emerald-300 text-emerald-950 font-extrabold text-lg rounded-2xl">
            ✓ Face detected. Click 'Identify Person' below to run neural network recognition.
          </div>
        )}

        {cameraStatus === 'multiple_faces' && (
          <div className="p-4 bg-amber-50 border-2 border-amber-300 text-amber-950 font-extrabold text-lg rounded-2xl">
            Please make sure only one person is in the camera.
          </div>
        )}

        {cameraStatus === 'permission_denied' && (
          <div className="p-5 bg-slate-100 border-2 border-slate-300 text-slate-800 font-extrabold text-base rounded-2xl space-y-2">
            <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
            <p>Camera access is unavailable. You can use Recall Aid or Quiz Mode instead.</p>
          </div>
        )}

        {cameraStatus === 'camera_error' && (
          <div className="p-5 bg-rose-50 border-2 border-rose-300 text-rose-900 font-extrabold text-base rounded-2xl">
            We couldn't start the camera. Please check camera permissions and try again.
          </div>
        )}

        {/* SUCCESSFUL HIGH-CONFIDENCE MATCH */}
        {cameraStatus === 'recognized' && matchedResult?.matchedMember && (
          <div className="p-6 bg-emerald-50 border-3 border-emerald-400 rounded-3xl space-y-4 text-center shadow-lg animate-fadeIn">
            <div className="w-40 h-40 mx-auto rounded-3xl overflow-hidden border-4 border-emerald-500 shadow-md">
              <img
                src={matchedResult.matchedMember.photoUrl}
                alt={matchedResult.matchedMember.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">Matched Family Member</span>
              <h2 className="text-4xl font-black text-slate-900">This is {matchedResult.matchedMember.name}.</h2>
              <p className="text-2xl font-extrabold text-teal-800">
                She/He is your {matchedResult.matchedMember.relationship}.
              </p>
            </div>
          </div>
        )}

        {/* UNRECOGNIZED / UNCONFIDENT MATCH (UNKNOWN PERSON) */}
        {cameraStatus === 'unrecognized' && (
          <div className="p-6 bg-indigo-50 border-3 border-indigo-300 rounded-3xl space-y-3 text-center shadow-md animate-fadeIn">
            <p className="text-2xl font-black text-indigo-950">We don't recognize this person.</p>
            <p className="text-base font-bold text-slate-700">Try again with better lighting or another registered family member.</p>
          </div>
        )}

        {/* CAMERA CONTROL BUTTONS */}
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          {!cameraActive ? (
            <Button variant="accent" size="xl" icon={Camera} onClick={startCameraStream} fullWidth>
              Start Camera
            </Button>
          ) : (
            <>
              <Button
                variant="primary"
                size="xl"
                icon={Camera}
                onClick={triggerFaceRecognition}
                disabled={cameraStatus === 'recognizing'}
                fullWidth
              >
                {cameraStatus === 'recognizing' ? 'Recognizing...' : 'Identify Person'}
              </Button>
              <Button variant="outline" size="xl" icon={CameraOff} onClick={stopCameraStream} fullWidth>
                Stop Camera
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};
