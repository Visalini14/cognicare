import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAdaptiveState, updateAdaptiveState, getGameDifficultyParams } from '../../services/adaptiveDifficulty';
import { saveGameResult } from '../../services/storage';
import { GameHeader } from '../../components/common/GameHeader';
import { ResultScreen } from '../../components/common/ResultScreen';
import { Button, Card, DifficultyBadge } from '../../components/common/UIComponents';
import { Play, Eye, Sparkles, RotateCcw } from 'lucide-react';

interface PatternShape {
  id: string;
  symbol: string;
  name: string;
  color: string;
}

const SHAPE_POOL: PatternShape[] = [
  { id: 'circle', symbol: '●', name: 'Circle', color: 'text-blue-600 border-blue-600 bg-blue-50' },
  { id: 'square', symbol: '■', name: 'Square', color: 'text-emerald-600 border-emerald-600 bg-emerald-50' },
  { id: 'triangle', symbol: '▲', name: 'Triangle', color: 'text-amber-600 border-amber-600 bg-amber-50' },
  { id: 'diamond', symbol: '◆', name: 'Diamond', color: 'text-purple-600 border-purple-600 bg-purple-50' },
  { id: 'star', symbol: '⭐', name: 'Star', color: 'text-yellow-500 border-yellow-500 bg-yellow-50' },
  { id: 'heart', symbol: '💖', name: 'Heart', color: 'text-rose-600 border-rose-600 bg-rose-50' },
];

export const PatternRecallGame: React.FC<{ onBackToDashboard: () => void }> = ({ onBackToDashboard }) => {
  const { user } = useAuth();
  const userId = user?.uid || 'patient-1';

  const [gameState, setGameState] = useState<'start' | 'preview' | 'input' | 'feedback' | 'result'>('start');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [targetSequence, setTargetSequence] = useState<PatternShape[]>([]);
  const [userSequence, setUserSequence] = useState<PatternShape[]>([]);
  const [highlightIdx, setHighlightIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState<{ isCorrect: boolean; msg: string } | null>(null);
  const [levelChanged, setLevelChanged] = useState<'increased' | 'decreased' | 'unchanged'>('unchanged');

  useEffect(() => {
    const adaptive = getAdaptiveState(userId, 'pattern-recall');
    setCurrentLevel(adaptive.currentLevel);
  }, [userId]);

  const generateSequence = (length: number): PatternShape[] => {
    const seq: PatternShape[] = [];
    for (let i = 0; i < length; i++) {
      const randomShape = SHAPE_POOL[Math.floor(Math.random() * SHAPE_POOL.length)];
      seq.push(randomShape);
    }
    return seq;
  };

  const startNewRound = () => {
    const params = getGameDifficultyParams('pattern-recall', currentLevel);
    const seq = generateSequence(params.sequenceLength);
    setTargetSequence(seq);
    setUserSequence([]);
    setFeedbackMessage(null);
    setGameState('preview');

    let index = 0;
    const interval = setInterval(() => {
      if (index < seq.length) {
        setHighlightIdx(index);
        index++;
      } else {
        setHighlightIdx(null);
        clearInterval(interval);
        setTimeout(() => {
          setGameState('input');
          setStartTime(Date.now()); // Precise response time starting when patient input is enabled
        }, 500);
      }
    }, params.displaySpeedMs);
  };

  const handleSelectItem = (shape: PatternShape) => {
    if (gameState !== 'input') return;

    const newSeq = [...userSequence, shape];
    setUserSequence(newSeq);

    const targetItem = targetSequence[newSeq.length - 1];

    if (shape.id !== targetItem.id) {
      setFeedbackMessage({ isCorrect: false, msg: "That's okay. Let's try again." });
      setGameState('feedback');

      setTimeout(() => {
        handleRoundFinish(false);
      }, 1400);
      return;
    }

    if (newSeq.length === targetSequence.length) {
      setFeedbackMessage({ isCorrect: true, msg: '✓ Excellent recall! Perfect pattern match.' });
      setGameState('feedback');

      setTimeout(() => {
        handleRoundFinish(true);
      }, 1400);
    }
  };

  const handleClearSelection = () => {
    if (gameState === 'input') {
      setUserSequence([]);
    }
  };

  const handleRoundFinish = async (isCorrect: boolean) => {
    const totalTimeSec = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    setElapsedTime(totalTimeSec);

    const { newState, levelChanged: changeType } = updateAdaptiveState(
      userId,
      'pattern-recall',
      isCorrect,
      Number((totalTimeSec / targetSequence.length).toFixed(1))
    );

    setLevelChanged(changeType);
    setCurrentLevel(newState.currentLevel);

    const computedScore = isCorrect ? Math.max(50, 100 - totalTimeSec * 3) : 30;
    const accuracyPct = isCorrect ? 100 : 0;
    setScore(computedScore);

    await saveGameResult({
      userId,
      userName: user?.name || 'Aarav Sharma',
      gameType: 'pattern-recall',
      score: computedScore,
      accuracy: accuracyPct,
      correctAnswers: isCorrect ? 1 : 0,
      totalQuestions: 1,
      responseTime: Number((totalTimeSec / targetSequence.length).toFixed(1)),
      difficultyLevel: currentLevel,
      createdAt: new Date().toISOString(),
    });

    setGameState('result');
  };

  const params = getGameDifficultyParams('pattern-recall', currentLevel);

  /* INSTRUCTION / PRE-GAME SCREEN */
  if (gameState === 'start') {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <Card className="text-center p-8 sm:p-10 border-3 border-indigo-200 shadow-xl space-y-6">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-800 rounded-3xl flex items-center justify-center mx-auto border-2 border-indigo-300">
            <Sparkles className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Pattern Recall</h2>
            <p className="text-slate-700 text-xl font-bold">
              Watch the pattern carefully, then remember it.
            </p>
            <p className="text-indigo-900 font-extrabold text-lg pt-2">
              Take your time. There is no need to hurry.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 inline-flex items-center gap-3">
            <span className="text-base font-extrabold text-slate-800">Current Level:</span>
            <DifficultyBadge level={currentLevel} />
            <span className="text-base font-bold text-slate-600">({params.sequenceLength} items)</span>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="xl" icon={Play} onClick={startNewRound} fullWidth>
              Start Activity
            </Button>
            <Button variant="outline" size="xl" onClick={onBackToDashboard} fullWidth>
              Back
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
        gameTitle="Pattern Recall"
        score={score}
        accuracy={feedbackMessage?.isCorrect ? 100 : 0}
        correctAnswers={feedbackMessage?.isCorrect ? 1 : 0}
        totalQuestions={1}
        responseTime={Number((elapsedTime / params.sequenceLength).toFixed(1))}
        currentLevel={currentLevel}
        levelChanged={levelChanged}
        onRestart={startNewRound}
        onBack={onBackToDashboard}
      />
    );
  }

  /* GAMEPLAY SCREEN */
  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <GameHeader
        title="Pattern Recall"
        level={currentLevel}
        onBack={onBackToDashboard}
        instruction={
          gameState === 'preview'
            ? `Watch carefully... (${params.sequenceLength} items)`
            : `Repeat the sequence in order!`
        }
      />

      <Card className="text-center py-10 mb-8 border-3 border-indigo-200 bg-gradient-to-b from-white to-indigo-50/40">
        {gameState === 'preview' && (
          <div>
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-100 text-indigo-950 text-base font-black mb-8 border border-indigo-300">
              <Eye className="w-6 h-6 text-indigo-700" /> Watch Carefully...
            </div>
            <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap min-h-[130px]">
              {targetSequence.map((shape, idx) => (
                <div
                  key={idx}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex flex-col items-center justify-center text-4xl sm:text-5xl shadow-md transition-all duration-300 border-3 ${
                    highlightIdx === idx
                      ? 'scale-125 border-indigo-700 ring-4 ring-indigo-600 shadow-2xl z-10 bg-white'
                      : 'opacity-20 border-slate-300 scale-90 bg-slate-100'
                  }`}
                >
                  <span>{shape.symbol}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {gameState === 'input' && (
          <div>
            <p className="text-xl font-extrabold text-slate-800 mb-6">Your Selected Sequence:</p>
            <div className="flex items-center justify-center gap-3 sm:gap-4 min-h-[85px] flex-wrap">
              {Array.from({ length: params.sequenceLength }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl border-3 border-dashed border-slate-300 flex items-center justify-center text-3xl font-extrabold bg-white ${
                    userSequence[idx] ? 'border-solid border-teal-700 bg-teal-50 shadow-sm text-teal-900' : ''
                  }`}
                >
                  {userSequence[idx] ? userSequence[idx].symbol : '?'}
                </div>
              ))}
            </div>

            {userSequence.length > 0 && (
              <div className="mt-6">
                <Button variant="outline" size="sm" icon={RotateCcw} onClick={handleClearSelection}>
                  Clear Selection
                </Button>
              </div>
            )}
          </div>
        )}

        {gameState === 'feedback' && feedbackMessage && (
          <div className="py-4">
            <div
              className={`inline-block p-6 rounded-3xl text-2xl font-black mb-2 shadow-sm ${
                feedbackMessage.isCorrect
                  ? 'bg-emerald-100 text-emerald-950 border-3 border-emerald-400'
                  : 'bg-indigo-100 text-indigo-950 border-3 border-indigo-300'
              }`}
            >
              {feedbackMessage.msg}
            </div>
          </div>
        )}
      </Card>

      {/* INPUT BUTTONS GRID */}
      {gameState === 'input' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 max-w-3xl mx-auto">
          {SHAPE_POOL.map((shape) => (
            <button
              key={shape.id}
              onClick={() => handleSelectItem(shape)}
              className={`p-5 bg-white border-3 border-slate-300 rounded-3xl hover:border-indigo-700 hover:shadow-xl active:scale-95 transition-all text-center flex flex-col items-center justify-center cursor-pointer min-h-[110px] ${shape.color}`}
            >
              <span className="text-5xl mb-1">{shape.symbol}</span>
              <span className="text-xs font-black uppercase tracking-wider">{shape.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
