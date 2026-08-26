import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAdaptiveState, updateAdaptiveState, getGameDifficultyParams } from '../../services/adaptiveDifficulty';
import { saveGameResult } from '../../services/storage';
import { GameHeader } from '../../components/common/GameHeader';
import { ResultScreen } from '../../components/common/ResultScreen';
import { Button, Card, DifficultyBadge } from '../../components/common/UIComponents';
import { Play, RotateCcw, Brain } from 'lucide-react';

/* Familiar, easily recognizable icons suitable for elderly users */
const FAMILIAR_ICONS = [
  { emoji: '🍎', label: 'Apple' },
  { emoji: '☕', label: 'Cup' },
  { emoji: '🌸', label: 'Flower' },
  { emoji: '🏠', label: 'House' },
  { emoji: '🐱', label: 'Cat' },
  { emoji: '🚗', label: 'Car' },
  { emoji: '🍌', label: 'Banana' },
  { emoji: '📖', label: 'Book' },
  { emoji: '⏰', label: 'Clock' },
  { emoji: '🔑', label: 'Key' },
];

interface MemoryCard {
  id: number;
  emoji: string;
  label: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryMatchGame: React.FC<{ onBackToDashboard: () => void }> = ({ onBackToDashboard }) => {
  const { user } = useAuth();
  const userId = user?.uid || 'patient-1';

  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; isSuccess: boolean } | null>(null);
  const [levelChanged, setLevelChanged] = useState<'increased' | 'decreased' | 'unchanged'>('unchanged');

  useEffect(() => {
    const adaptive = getAdaptiveState(userId, 'memory-match');
    setCurrentLevel(adaptive.currentLevel);
  }, [userId]);

  useEffect(() => {
    let timer: any;
    if (gameState === 'playing') {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, startTime]);

  const initGame = () => {
    const params = getGameDifficultyParams('memory-match', currentLevel);
    const shuffledPool = [...FAMILIAR_ICONS].sort(() => Math.random() - 0.5);
    const selectedPool = shuffledPool.slice(0, params.pairs);

    const cardDeck: MemoryCard[] = [];
    selectedPool.forEach((item, index) => {
      cardDeck.push({ id: index * 2, emoji: item.emoji, label: item.label, isFlipped: false, isMatched: false });
      cardDeck.push({ id: index * 2 + 1, emoji: item.emoji, label: item.label, isFlipped: false, isMatched: false });
    });

    const randomizedDeck = cardDeck.sort(() => Math.random() - 0.5);

    setCards(randomizedDeck);
    setFlippedIndices([]);
    setMatchedPairs(0);
    setAttempts(0);
    setMistakes(0);
    setScore(0);
    setFeedback(null);
    setIsEvaluating(false);
    setElapsedTime(0);
    setStartTime(Date.now());
    setGameState('playing');
  };

  const handleCardClick = (index: number) => {
    if (gameState !== 'playing' || isEvaluating) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;
    if (flippedIndices.length >= 2) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsEvaluating(true);
      setAttempts(prev => prev + 1);
      const [firstIdx, secondIdx] = newFlipped;

      if (newCards[firstIdx].emoji === newCards[secondIdx].emoji) {
        setFeedback({ text: '✓ Good match!', isSuccess: true });
        setTimeout(() => {
          newCards[firstIdx].isMatched = true;
          newCards[secondIdx].isMatched = true;
          setCards([...newCards]);
          setFlippedIndices([]);
          setIsEvaluating(false);

          const newMatched = matchedPairs + 1;
          setMatchedPairs(newMatched);

          const params = getGameDifficultyParams('memory-match', currentLevel);
          if (newMatched === params.pairs) {
            handleGameComplete(mistakes, startTime, params.pairs);
          }
        }, 600);
      } else {
        setMistakes(prev => prev + 1);
        setFeedback({ text: "Not a match. Let's try again.", isSuccess: false });
        setTimeout(() => {
          newCards[firstIdx].isFlipped = false;
          newCards[secondIdx].isFlipped = false;
          setCards([...newCards]);
          setFlippedIndices([]);
          setIsEvaluating(false);
        }, 1100);
      }
    }
  };

  const handleGameComplete = async (totalMistakes: number, startMs: number, targetPairs: number) => {
    const totalTimeSec = Math.max(1, Math.floor((Date.now() - startMs) / 1000));
    setElapsedTime(totalTimeSec);

    const isHighAccuracy = totalMistakes <= Math.floor(targetPairs / 2);
    const computedScore = Math.max(10, 100 - totalMistakes * 10 - Math.floor(totalTimeSec / 3));
    const computedAccuracy = Math.max(10, Math.round((targetPairs / (targetPairs + totalMistakes)) * 100));

    setScore(computedScore);

    const { newState, levelChanged: changeType } = updateAdaptiveState(
      userId,
      'memory-match',
      isHighAccuracy,
      Number((totalTimeSec / targetPairs).toFixed(1))
    );

    setLevelChanged(changeType);
    setCurrentLevel(newState.currentLevel);

    await saveGameResult({
      userId,
      userName: user?.name || 'Aarav Sharma',
      gameType: 'memory-match',
      score: computedScore,
      accuracy: computedAccuracy,
      correctAnswers: targetPairs,
      totalQuestions: targetPairs + totalMistakes,
      responseTime: Number((totalTimeSec / targetPairs).toFixed(1)),
      difficultyLevel: currentLevel,
      createdAt: new Date().toISOString(),
    });

    setGameState('result');
  };

  const params = getGameDifficultyParams('memory-match', currentLevel);

  /* INSTRUCTION / PRE-GAME SCREEN */
  if (gameState === 'start') {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <Card className="text-center p-8 sm:p-10 border-3 border-teal-200 shadow-xl space-y-6">
          <div className="w-20 h-20 bg-teal-100 text-teal-800 rounded-3xl flex items-center justify-center mx-auto border-2 border-teal-300">
            <Brain className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Memory Match</h2>
            <p className="text-slate-700 text-xl font-bold">
              Remember where the matching pictures are.
            </p>
            <p className="text-teal-800 font-extrabold text-lg pt-2">
              Take your time. There is no need to hurry.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 inline-flex items-center gap-3">
            <span className="text-base font-extrabold text-slate-800">Current Level:</span>
            <DifficultyBadge level={currentLevel} />
            <span className="text-base font-bold text-slate-600">({params.pairs} pairs)</span>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="xl" icon={Play} onClick={initGame} fullWidth>
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
        gameTitle="Memory Match"
        score={score}
        accuracy={Math.max(10, Math.round((params.pairs / (params.pairs + mistakes)) * 100))}
        correctAnswers={params.pairs}
        totalQuestions={params.pairs + mistakes}
        responseTime={Number((elapsedTime / params.pairs).toFixed(1))}
        currentLevel={currentLevel}
        levelChanged={levelChanged}
        onRestart={initGame}
        onBack={onBackToDashboard}
      />
    );
  }

  /* GAMEPLAY SCREEN */
  const gridColsClass =
    params.pairs <= 3
      ? 'grid-cols-2 sm:grid-cols-3'
      : params.pairs <= 4
      ? 'grid-cols-2 sm:grid-cols-4'
      : params.pairs <= 6
      ? 'grid-cols-3 sm:grid-cols-4'
      : 'grid-cols-4 sm:grid-cols-4';

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <GameHeader
        title="Memory Match"
        level={currentLevel}
        score={matchedPairs * 20}
        mistakes={mistakes}
        timeSec={elapsedTime}
        onBack={onBackToDashboard}
        instruction={`Match all ${params.pairs} pairs. Attempts: ${attempts}`}
      />

      {feedback && (
        <div
          className={`max-w-md mx-auto mb-6 p-4 rounded-2xl text-center text-xl font-extrabold shadow-sm transition-all ${
            feedback.isSuccess
              ? 'bg-emerald-100 text-emerald-950 border-2 border-emerald-400'
              : 'bg-indigo-100 text-indigo-950 border-2 border-indigo-300'
          }`}
        >
          {feedback.text}
        </div>
      )}

      <div className={`grid gap-4 sm:gap-6 ${gridColsClass} max-w-3xl mx-auto my-6`}>
        {cards.map((card, idx) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(idx)}
            disabled={card.isMatched || card.isFlipped || isEvaluating}
            className={`min-h-[105px] sm:min-h-[125px] rounded-3xl text-5xl sm:text-6xl flex flex-col items-center justify-center transition-all duration-300 transform cursor-pointer shadow-md select-none border-3 ${
              card.isMatched
                ? 'bg-emerald-100 border-emerald-400 opacity-60 scale-95'
                : card.isFlipped
                ? 'bg-white border-teal-700 shadow-xl'
                : 'bg-teal-800 border-teal-700 text-white hover:scale-105 active:scale-95'
            }`}
          >
            {card.isFlipped || card.isMatched ? (
              <span className="animate-fadeIn">{card.emoji}</span>
            ) : (
              <span className="text-teal-200 text-3xl font-black">?</span>
            )}
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <Button variant="outline" size="lg" icon={RotateCcw} onClick={initGame}>
          Restart Activity
        </Button>
      </div>
    </div>
  );
};
