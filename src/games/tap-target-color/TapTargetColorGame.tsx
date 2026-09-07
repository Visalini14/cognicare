import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getAdaptiveState, updateAdaptiveState, getGameDifficultyParams } from '../../services/adaptiveDifficulty';
import { saveGameResult, saveActivityLogEntry } from '../../services/storage';
import { GameHeader } from '../../components/common/GameHeader';
import { ResultScreen } from '../../components/common/ResultScreen';
import { Button, Card } from '../../components/common/UIComponents';
import { Target, Play, CheckCircle2, XCircle, Volume2 } from 'lucide-react';

export interface ColorItem {
  id: string;
  name: string;
  labels: Record<string, string>;
  bgClass: string;
  borderClass: string;
  textClass: string;
  ringClass: string;
  lightBgClass: string;
  hex: string;
}

export const COLOR_ITEMS: ColorItem[] = [
  { id: 'red', name: 'Red', labels: { en: 'RED', ta: 'சிகப்பு', hi: 'लाल' }, bgClass: 'bg-rose-500', borderClass: 'border-rose-600', textClass: 'text-rose-600', ringClass: 'ring-rose-400', lightBgClass: 'bg-rose-50', hex: '#ef4444' },
  { id: 'blue', name: 'Blue', labels: { en: 'BLUE', ta: 'நீலம்', hi: 'नीला' }, bgClass: 'bg-sky-500', borderClass: 'border-sky-600', textClass: 'text-sky-600', ringClass: 'ring-sky-400', lightBgClass: 'bg-sky-50', hex: '#0284c7' },
  { id: 'green', name: 'Green', labels: { en: 'GREEN', ta: 'பச்சை', hi: 'हरा' }, bgClass: 'bg-emerald-500', borderClass: 'border-emerald-600', textClass: 'text-emerald-600', ringClass: 'ring-emerald-400', lightBgClass: 'bg-emerald-50', hex: '#10b981' },
  { id: 'yellow', name: 'Yellow', labels: { en: 'YELLOW', ta: 'மஞ்சள்', hi: 'पीला' }, bgClass: 'bg-amber-400', borderClass: 'border-amber-500', textClass: 'text-amber-700', ringClass: 'ring-amber-300', lightBgClass: 'bg-amber-50', hex: '#f59e0b' },
  { id: 'orange', name: 'Orange', labels: { en: 'ORANGE', ta: 'ஆரஞ்சு', hi: 'नारंगी' }, bgClass: 'bg-orange-500', borderClass: 'border-orange-600', textClass: 'text-orange-600', ringClass: 'ring-orange-400', lightBgClass: 'bg-orange-50', hex: '#f97316' },
  { id: 'purple', name: 'Purple', labels: { en: 'PURPLE', ta: 'ஊதா', hi: 'बैंगनी' }, bgClass: 'bg-purple-500', borderClass: 'border-purple-600', textClass: 'text-purple-600', ringClass: 'ring-purple-400', lightBgClass: 'bg-purple-50', hex: '#a855f7' },
  { id: 'pink', name: 'Pink', labels: { en: 'PINK', ta: 'இளஞ்சிவப்பு', hi: 'गुलाबी' }, bgClass: 'bg-pink-500', borderClass: 'border-pink-600', textClass: 'text-pink-600', ringClass: 'ring-pink-400', lightBgClass: 'bg-pink-50', hex: '#ec4899' },
  { id: 'cyan', name: 'Cyan', labels: { en: 'CYAN', ta: 'சயான்', hi: 'हल्का नीला' }, bgClass: 'bg-cyan-500', borderClass: 'border-cyan-600', textClass: 'text-cyan-600', ringClass: 'ring-cyan-400', lightBgClass: 'bg-cyan-50', hex: '#06b6d4' },
];

export const SHAPES = ['●', '■', '▲', '★', '◆', '♥'];

// Visually similar distractors map for higher levels (3-5)
const SIMILAR_COLORS: Record<string, string[]> = {
  red: ['pink', 'orange', 'yellow'],
  blue: ['cyan', 'purple'],
  green: ['yellow', 'cyan'],
  yellow: ['orange', 'green'],
  orange: ['red', 'yellow', 'pink'],
  purple: ['pink', 'blue'],
  pink: ['red', 'purple', 'orange'],
  cyan: ['blue', 'green'],
};

export interface GridObject {
  id: string;
  color: ColorItem;
  shape: string;
  isTarget: boolean;
  tapped: boolean;
  isCorrectTap?: boolean;
  isMistakeTap?: boolean;
}

export const TapTargetColorGame: React.FC<{ onBackToDashboard: () => void }> = ({ onBackToDashboard }) => {
  const { user } = useAuth();
  const { speakText, currentLanguage, ui } = useLanguage();
  const userId = user?.uid || 'patient-1';

  const [gameState, setGameState] = useState<'start' | 'playing' | 'round_end' | 'result'>('start');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [round, setRound] = useState(1);
  const TOTAL_ROUNDS = 5;

  const [targetColor, setTargetColor] = useState<ColorItem>(COLOR_ITEMS[0]);
  const [objects, setObjects] = useState<GridObject[]>([]);
  const [roundTimerSec, setRoundTimerSec] = useState(10);
  const [roundActive, setRoundActive] = useState(false);

  // Cumulative Session Metrics
  const [score, setScore] = useState(0);
  const [correctTaps, setCorrectTaps] = useState(0);
  const [totalTargets, setTotalTargets] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [finalAccuracy, setFinalAccuracy] = useState(0);
  const [avgResponseTime, setAvgResponseTime] = useState(0);
  const [levelChanged, setLevelChanged] = useState<'increased' | 'decreased' | 'unchanged'>('unchanged');

  const previousTargetRef = useRef<string | null>(null);
  const timerIntervalRef = useRef<any>(null);

  useEffect(() => {
    const adaptive = getAdaptiveState(userId, 'tap-target-color');
    setCurrentLevel(adaptive.currentLevel);
  }, [userId]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const announceTargetColor = (target: ColorItem, roundNum: number) => {
    const colorLabel = target.labels[currentLanguage] || target.labels.en || target.name;
    let msg = `Round ${roundNum}. Tap only the ${colorLabel} objects!`;
    if (currentLanguage === 'ta') {
      msg = `சுற்று ${roundNum}. ${colorLabel} நிறப் பொருட்களை மட்டுமே தொடுங்கள்!`;
    } else if (currentLanguage === 'hi') {
      msg = `राउंड ${roundNum}. केवल ${colorLabel} रंग की वस्तुओं पर टैप करें!`;
    }
    speakText(msg, true);
  };

  const startNewGameSession = () => {
    const adaptive = getAdaptiveState(userId, 'tap-target-color');
    setCurrentLevel(adaptive.currentLevel);
    setScore(0);
    setCorrectTaps(0);
    setTotalTargets(0);
    setMistakes(0);
    setRound(1);
    setSessionStartTime(Date.now());
    setupRound(1, adaptive.currentLevel);
  };

  const setupRound = (roundNum: number, level: number) => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    const params = getGameDifficultyParams('tap-target-color', level);
    const timeLimit = Math.max(4, Math.round(params.displaySpeedMs / 1000));
    setRoundTimerSec(timeLimit);

    // Pick random target color (avoid repeating previous round if possible)
    let availableTargets = COLOR_ITEMS;
    if (level <= 2) {
      // First 4 main colors for lower levels
      availableTargets = COLOR_ITEMS.slice(0, 4);
    }
    let chosenTarget = availableTargets[Math.floor(Math.random() * availableTargets.length)];
    if (previousTargetRef.current && availableTargets.length > 1) {
      const filtered = availableTargets.filter((c) => c.id !== previousTargetRef.current);
      chosenTarget = filtered[Math.floor(Math.random() * filtered.length)];
    }
    previousTargetRef.current = chosenTarget.id;
    setTargetColor(chosenTarget);

    const totalGridObjects = params.sequenceLength; // e.g. 6, 8, 12, 16, 20
    const targetObjCount = Math.min(params.pairs, totalGridObjects - 2); // e.g. 2, 3, 4, 5, 6
    const distractorCount = totalGridObjects - targetObjCount;

    setTotalTargets((prev) => prev + targetObjCount);

    // Select distractor colors based on level
    let distractorPool: ColorItem[] = [];
    if (level >= 3 && SIMILAR_COLORS[chosenTarget.id]) {
      // High level: include visually similar colors (Go/No-Go challenge)
      const similarIds = SIMILAR_COLORS[chosenTarget.id];
      const similarItems = COLOR_ITEMS.filter((c) => similarIds.includes(c.id));
      const otherItems = COLOR_ITEMS.filter((c) => c.id !== chosenTarget.id);
      distractorPool = [...similarItems, ...otherItems];
    } else {
      // Low level: distinct distractors
      distractorPool = COLOR_ITEMS.filter((c) => c.id !== chosenTarget.id);
    }

    const gridList: GridObject[] = [];

    // Create target objects
    for (let i = 0; i < targetObjCount; i++) {
      const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      gridList.push({
        id: `target-${roundNum}-${i}-${Math.random().toString(36).substring(2, 6)}`,
        color: chosenTarget,
        shape: randomShape,
        isTarget: true,
        tapped: false,
      });
    }

    // Create distractor objects
    for (let i = 0; i < distractorCount; i++) {
      const randomDistractorColor = distractorPool[Math.floor(Math.random() * distractorPool.length)];
      const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      gridList.push({
        id: `distractor-${roundNum}-${i}-${Math.random().toString(36).substring(2, 6)}`,
        color: randomDistractorColor,
        shape: randomShape,
        isTarget: false,
        tapped: false,
      });
    }

    // Shuffle grid objects randomly
    const shuffled = gridList.sort(() => Math.random() - 0.5);
    setObjects(shuffled);

    setGameState('playing');
    setRoundActive(true);

    // Announce target color instruction
    announceTargetColor(chosenTarget, roundNum);

    // Start Round Timer Countdown
    timerIntervalRef.current = setInterval(() => {
      setRoundTimerSec((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          handleRoundTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTapObject = (obj: GridObject) => {
    if (gameState !== 'playing' || !roundActive || obj.tapped) return;

    if (obj.isTarget) {
      // Correct Tap
      const updatedObjects = objects.map((item) =>
        item.id === obj.id ? { ...item, tapped: true, isCorrectTap: true } : item
      );
      setObjects(updatedObjects);
      setCorrectTaps((prev) => prev + 1);
      setScore((prev) => prev + 25);

      // Check if all target objects in this round have been tapped
      const remainingTargets = updatedObjects.filter((item) => item.isTarget && !item.tapped);
      if (remainingTargets.length === 0) {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        setRoundActive(false);
        setTimeout(() => advanceToNextRoundOrFinish(), 800);
      }
    } else {
      // Mistake Tap (Tapped non-target distractor)
      const updatedObjects = objects.map((item) =>
        item.id === obj.id ? { ...item, tapped: true, isMistakeTap: true } : item
      );
      setObjects(updatedObjects);
      setMistakes((prev) => prev + 1);
      setScore((prev) => Math.max(0, prev - 10));
    }
  };

  const handleRoundTimeOut = () => {
    setRoundActive(false);
    advanceToNextRoundOrFinish();
  };

  const advanceToNextRoundOrFinish = () => {
    if (round < TOTAL_ROUNDS) {
      setRound((prev) => prev + 1);
      setupRound(round + 1, currentLevel);
    } else {
      finishGameSession();
    }
  };

  const finishGameSession = async () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    const sessionDurationSec = Math.max(1, Math.floor((Date.now() - sessionStartTime) / 1000));
    const totalAttempted = correctTaps + mistakes;
    const computedAccuracy = totalAttempted > 0
      ? Math.max(0, Math.min(100, Math.round((correctTaps / Math.max(totalTargets, totalAttempted)) * 100)))
      : 0;

    const avgSpeed = Number((sessionDurationSec / Math.max(1, correctTaps)).toFixed(1));

    setFinalAccuracy(computedAccuracy);
    setAvgResponseTime(avgSpeed);

    // Update adaptive difficulty state & persist cognitiveLevel to Firestore 'users'
    const isSuccess = computedAccuracy >= 70;
    const { newState, levelChanged: changeType } = updateAdaptiveState(
      userId,
      'tap-target-color',
      isSuccess,
      avgSpeed
    );

    setLevelChanged(changeType);
    setCurrentLevel(newState.currentLevel);

    // Log Game Result to Firestore 'gameResults'
    await saveGameResult({
      userId,
      userName: user?.name || 'Aarav Sharma',
      gameType: 'tap-target-color',
      score,
      accuracy: computedAccuracy,
      correctAnswers: correctTaps,
      totalQuestions: totalTargets,
      responseTime: avgSpeed,
      difficultyLevel: currentLevel,
      createdAt: new Date().toISOString(),
    });

    // Log Activity Entry to Firestore 'activityLogs'
    await saveActivityLogEntry({
      patientId: userId,
      patientName: user?.name || 'Aarav Sharma',
      eventType: 'game_played',
      title: 'Game Played: Tap Target Color',
      details: `Score: ${score} | Accuracy: ${computedAccuracy}% | Level: ${currentLevel} | Speed: ${avgSpeed}s`,
    });

    setGameState('result');
  };

  const targetColorLabel = targetColor.labels[currentLanguage] || targetColor.labels.en || targetColor.name;

  /* INSTRUCTION / PRE-GAME SCREEN */
  if (gameState === 'start') {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        <GameHeader
          title={ui.tapTargetColorTitle || 'Tap the Target Color'}
          level={currentLevel}
          onBack={onBackToDashboard}
          instruction="Go/No-Go visual attention & impulse control task"
        />

        <Card className="p-8 text-center space-y-6 border-3 border-rose-200 bg-gradient-to-br from-rose-50/50 to-white shadow-xl">
          <div className="w-20 h-20 bg-rose-600 text-white rounded-3xl flex items-center justify-center mx-auto shadow-lg ring-4 ring-rose-200">
            <Target className="w-11 h-11" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">How to Play</h2>
            <p className="text-slate-700 text-base font-semibold leading-relaxed">
              At the start of each round, a <span className="font-extrabold text-rose-700">Target Color</span> will be announced. Tap <strong>ONLY</strong> the objects matching the target color while ignoring all other colors!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-2">
            <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 text-left">
              <span className="text-xs font-black uppercase text-rose-600 block mb-1">Rule 1</span>
              <p className="text-sm font-bold text-slate-800">Listen for the target color instruction at the start of each round.</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 text-left">
              <span className="text-xs font-black uppercase text-emerald-600 block mb-1">Rule 2</span>
              <p className="text-sm font-bold text-slate-800">Tap matching target objects before the round timer runs out.</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 text-left">
              <span className="text-xs font-black uppercase text-amber-600 block mb-1">Rule 3</span>
              <p className="text-sm font-bold text-slate-800">Avoid tapping non-target colors to maintain high accuracy!</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="xl" icon={Play} onClick={startNewGameSession}>
              Start Game
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  /* RESULT SCREEN */
  if (gameState === 'result') {
    return (
      <ResultScreen
        gameTitle={ui.tapTargetColorTitle || 'Tap the Target Color'}
        score={score}
        accuracy={finalAccuracy}
        correctAnswers={correctTaps}
        totalQuestions={totalTargets}
        responseTime={avgResponseTime}
        currentLevel={currentLevel}
        levelChanged={levelChanged}
        onRestart={startNewGameSession}
        onBack={onBackToDashboard}
      />
    );
  }

  /* ACTIVE PLAYING SCREEN */
  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      <GameHeader
        title={ui.tapTargetColorTitle || 'Tap the Target Color'}
        level={currentLevel}
        score={score}
        mistakes={mistakes}
        timeSec={roundTimerSec}
        onBack={onBackToDashboard}
        instruction={`Round ${round} of ${TOTAL_ROUNDS}`}
      />

      {/* TARGET ANNOUNCEMENT BANNER */}
      <div className={`p-6 rounded-3xl border-3 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 ${targetColor.lightBgClass} ${targetColor.borderClass}`}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl ${targetColor.bgClass} text-white flex items-center justify-center text-2xl font-black shadow-md border-2 ${targetColor.borderClass}`}>
            ●
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">Current Target Color</span>
            <div className="flex items-center gap-2">
              <h2 className={`text-3xl font-black tracking-tight ${targetColor.textClass}`}>
                {targetColorLabel}
              </h2>
              <button
                type="button"
                onClick={() => announceTargetColor(targetColor, round)}
                className="p-2 rounded-xl bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 shadow-sm cursor-pointer"
                title="Hear Target Color"
              >
                <Volume2 className="w-5 h-5 text-teal-700" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-[10px] font-black uppercase text-slate-400 block">Round Progress</span>
            <span className="text-lg font-black text-slate-900">{round} / {TOTAL_ROUNDS}</span>
          </div>

          <div className="px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-[10px] font-black uppercase text-slate-400 block">Timer</span>
            <span className={`text-lg font-black ${roundTimerSec <= 3 ? 'text-rose-600 animate-pulse' : 'text-slate-900'}`}>
              {roundTimerSec}s
            </span>
          </div>
        </div>
      </div>

      {/* GRID OF OBJECTS */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border-3 border-slate-200 shadow-md">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 sm:gap-6">
          {objects.map((obj) => {
            const isTapped = obj.tapped;
            const isCorrect = obj.isCorrectTap;
            const isMistake = obj.isMistakeTap;

            return (
              <button
                key={obj.id}
                type="button"
                disabled={isTapped || !roundActive}
                onClick={() => handleTapObject(obj)}
                className={`relative aspect-square rounded-3xl border-3 flex items-center justify-center text-4xl sm:text-5xl font-bold transition-all cursor-pointer select-none active:scale-95 shadow-md ${
                  isCorrect
                    ? 'bg-emerald-100 border-emerald-500 ring-4 ring-emerald-300 opacity-90 scale-95'
                    : isMistake
                    ? 'bg-rose-100 border-rose-500 ring-4 ring-rose-300 opacity-90 animate-shake'
                    : `${obj.color.bgClass} ${obj.color.borderClass} text-white hover:scale-105 hover:shadow-xl`
                }`}
              >
                {isCorrect ? (
                  <CheckCircle2 className="w-12 h-12 text-emerald-700 animate-bounce" />
                ) : isMistake ? (
                  <XCircle className="w-12 h-12 text-rose-700" />
                ) : (
                  <span>{obj.shape}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
