import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAdaptiveState, updateAdaptiveState, getGameDifficultyParams } from '../../services/adaptiveDifficulty';
import { saveGameResult } from '../../services/storage';
import { GameHeader } from '../../components/common/GameHeader';
import { ResultScreen } from '../../components/common/ResultScreen';
import { Button, Card, DifficultyBadge } from '../../components/common/UIComponents';
import { VoiceInput } from '../../components/common/VoiceInput';
import { Play, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';
import type { RecognitionQuestion } from '../../types';

/* Everyday objects & simple daily routines pool */
const RECOGNITION_POOL: RecognitionQuestion[] = [
  {
    id: 'obj_1',
    iconSymbol: '🍎',
    question: 'What item is shown above?',
    correctAnswer: 'Apple',
    options: ['Apple', 'Book', 'Cup', 'Shoe'],
    category: 'object',
    difficultyTier: 1,
  },
  {
    id: 'obj_2',
    iconSymbol: '☕',
    question: 'What item is used to drink warm tea or coffee?',
    correctAnswer: 'Cup',
    options: ['Cup', 'Plate', 'Key', 'Comb'],
    category: 'object',
    difficultyTier: 1,
  },
  {
    id: 'obj_3',
    iconSymbol: '🥄',
    question: 'What utensil is used for eating soup or cereal?',
    correctAnswer: 'Spoon',
    options: ['Spoon', 'Fork', 'Pen', 'Brush'],
    category: 'object',
    difficultyTier: 1,
  },
  {
    id: 'obj_4',
    iconSymbol: '📖',
    question: 'What object contains pages for reading stories?',
    correctAnswer: 'Book',
    options: ['Book', 'Towel', 'Clock', 'Box'],
    category: 'object',
    difficultyTier: 2,
  },
  {
    id: 'obj_5',
    iconSymbol: '📱',
    question: 'What device is used to call family and friends?',
    correctAnswer: 'Phone',
    options: ['Phone', 'Radio', 'Watch', 'Glass'],
    category: 'object',
    difficultyTier: 2,
  },
  {
    id: 'obj_6',
    iconSymbol: '🪑',
    question: 'What furniture piece is used for sitting comfortably?',
    correctAnswer: 'Chair',
    options: ['Chair', 'Table', 'Bed', 'Door'],
    category: 'object',
    difficultyTier: 2,
  },
  {
    id: 'obj_7',
    iconSymbol: '⏰',
    question: 'What tool tells us the time of day?',
    correctAnswer: 'Clock',
    options: ['Clock', 'Calendar', 'Mirror', 'Lamp'],
    category: 'object',
    difficultyTier: 3,
  },
  {
    id: 'obj_8',
    iconSymbol: '🔑',
    question: 'What object is used to lock or open a door safely?',
    correctAnswer: 'Key',
    options: ['Key', 'Ring', 'Coin', 'Card'],
    category: 'object',
    difficultyTier: 3,
  },
  {
    id: 'obj_9',
    iconSymbol: '🪥',
    question: 'What item is used to brush teeth every morning?',
    correctAnswer: 'Toothbrush',
    options: ['Toothbrush', 'Comb', 'Soap', 'Razor'],
    category: 'routine',
    difficultyTier: 3,
  },
  {
    id: 'obj_10',
    iconSymbol: '🧴',
    question: 'What container holds drinking water during a walk?',
    correctAnswer: 'Water bottle',
    options: ['Water bottle', 'Glass', 'Jug', 'Vase'],
    category: 'object',
    difficultyTier: 4,
  },
  {
    id: 'rt_1',
    iconSymbol: '🪥',
    question: 'Which daily routine is shown in this picture?',
    correctAnswer: 'Brushing teeth',
    options: ['Brushing teeth', 'Washing hands', 'Combing hair', 'Washing face'],
    category: 'routine',
    difficultyTier: 4,
  },
  {
    id: 'rt_2',
    iconSymbol: '💧',
    question: 'What healthy habit is shown above?',
    correctAnswer: 'Drinking water',
    options: ['Drinking water', 'Cooking food', 'Washing dishes', 'Gardening'],
    category: 'routine',
    difficultyTier: 4,
  },
  {
    id: 'rt_3',
    iconSymbol: '🍲',
    question: 'What daily wellness activity is represented here?',
    correctAnswer: 'Eating meals',
    options: ['Eating meals', 'Buying groceries', 'Cleaning table', 'Baking'],
    category: 'routine',
    difficultyTier: 5,
  },
  {
    id: 'rt_4',
    iconSymbol: '😴',
    question: 'What restful activity happens at night time?',
    correctAnswer: 'Sleeping',
    options: ['Sleeping', 'Reading', 'Watching TV', 'Sitting'],
    category: 'routine',
    difficultyTier: 5,
  },
  {
    id: 'rt_5',
    iconSymbol: '🚶',
    question: 'What gentle exercise involves moving outdoors?',
    correctAnswer: 'Taking a walk',
    options: ['Taking a walk', 'Running', 'Dancing', 'Stretching'],
    category: 'routine',
    difficultyTier: 5,
  },
];

export const RecognitionQuizGame: React.FC<{ onBackToDashboard: () => void }> = ({ onBackToDashboard }) => {
  const { user } = useAuth();
  const userId = user?.uid || 'patient-1';

  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [sessionQuestions, setSessionQuestions] = useState<RecognitionQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const totalQuestions = 5;
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [accumulatedResponseTimes, setAccumulatedResponseTimes] = useState<number[]>([]);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [levelChanged, setLevelChanged] = useState<'increased' | 'decreased' | 'unchanged'>('unchanged');

  useEffect(() => {
    const adaptive = getAdaptiveState(userId, 'recognition-quiz');
    setCurrentLevel(adaptive.currentLevel);
  }, [userId]);

  const startGame = () => {
    // Shuffle and pick 5 distinct questions per session
    const shuffledPool = [...RECOGNITION_POOL].sort(() => Math.random() - 0.5);
    setSessionQuestions(shuffledPool.slice(0, totalQuestions));
    setQuestionIndex(0);
    setCorrectAnswers(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setVoiceNotice(null);
    setScore(0);
    setAccumulatedResponseTimes([]);
    setStartTime(Date.now()); // Precise timing from active gameplay start
    setGameState('playing');
  };

  const currentQuestion = sessionQuestions[questionIndex] || RECOGNITION_POOL[0];
  const params = getGameDifficultyParams('recognition-quiz', currentLevel);

  // Generate randomized answer options where correct answer is never fixed to the same position
  const displayOptions = React.useMemo(() => {
    const correct = currentQuestion.correctAnswer;
    const distractors = currentQuestion.options.filter(o => o !== correct);
    const neededDistractors = params.optionCount - 1;
    const chosenDistractors = distractors.slice(0, neededDistractors);
    return [correct, ...chosenDistractors].sort(() => Math.random() - 0.5);
  }, [currentQuestion, params.optionCount]);

  const handleSelectOption = async (option: string, method: 'button' | 'voice' = 'button') => {
    if (isAnswered) return;

    // Calculate response time strictly from when this question was shown
    const responseTimeSec = Number((Math.max(0.5, (Date.now() - startTime) / 1000)).toFixed(1));
    const newTimes = [...accumulatedResponseTimes, responseTimeSec];
    setAccumulatedResponseTimes(newTimes);

    setSelectedOption(option);
    setIsAnswered(true);
    setVoiceNotice(null);

    const isCorrect = option === currentQuestion.correctAnswer;

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }

    const { newState, levelChanged: changeType } = updateAdaptiveState(
      userId,
      'recognition-quiz',
      isCorrect,
      responseTimeSec
    );

    setLevelChanged(changeType);
    setCurrentLevel(newState.currentLevel);

    setTimeout(() => {
      if (questionIndex + 1 < totalQuestions) {
        setQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
        setStartTime(Date.now()); // Reset timer for next question
      } else {
        finishGame(isCorrect ? correctAnswers + 1 : correctAnswers, newTimes, method);
      }
    }, 1400);
  };

  /* SPOKEN VOICE ANSWER EVALUATION */
  const handleSpokenAnswer = (spokenText: string) => {
    if (isAnswered) return;

    const cleanSpoken = spokenText.toLowerCase().replace(/[^\w\s]/gi, '').trim();
    if (!cleanSpoken) return;

    let matchedOption: string | undefined;

    // 1. Check for option index match ("option 1", "first", "choice 1", "1", etc.)
    const optionIndices = [
      ['1', 'one', 'first', 'option 1', 'choice 1'],
      ['2', 'two', 'second', 'option 2', 'choice 2'],
      ['3', 'three', 'third', 'option 3', 'choice 3'],
      ['4', 'four', 'fourth', 'option 4', 'choice 4'],
    ];

    for (let idx = 0; idx < displayOptions.length; idx++) {
      const aliases = optionIndices[idx] || [];
      if (aliases.some((alias) => cleanSpoken === alias || cleanSpoken.includes(alias))) {
        matchedOption = displayOptions[idx];
        break;
      }
    }

    // 2. Direct string, token, and synonym matching if option index was not spoken
    if (!matchedOption) {
      const synonyms: Record<string, string[]> = {
        'apple': ['apple', 'fruit', 'red apple'],
        'cup': ['cup', 'mug', 'tea', 'coffee', 'glass'],
        'spoon': ['spoon', 'utensil'],
        'book': ['book', 'notebook', 'read', 'story'],
        'phone': ['phone', 'mobile', 'cellphone', 'telephone', 'call'],
        'chair': ['chair', 'seat', 'stool'],
        'clock': ['clock', 'time', 'watch'],
        'key': ['key', 'lock'],
        'toothbrush': ['toothbrush', 'brush', 'teeth'],
        'water bottle': ['bottle', 'water', 'water bottle'],
        'brushing teeth': ['brushing', 'brush', 'teeth', 'tooth'],
        'drinking water': ['drinking', 'drink', 'water'],
        'eating meals': ['eating', 'eat', 'food', 'meal', 'meals'],
        'sleeping': ['sleeping', 'sleep', 'bed'],
        'taking a walk': ['walking', 'walk', 'stroll'],
      };

      for (const opt of displayOptions) {
        const cleanOpt = opt.toLowerCase().trim();

        // Direct equality or substring match
        if (cleanSpoken === cleanOpt || cleanSpoken.includes(cleanOpt) || cleanOpt.includes(cleanSpoken)) {
          matchedOption = opt;
          break;
        }

        // Token match (e.g., "bottle" matching "Water bottle")
        const optWords = cleanOpt.split(/\s+/);
        const spokenWords = cleanSpoken.split(/\s+/);

        if (spokenWords.some((sw) => sw.length >= 3 && optWords.some((ow) => ow.includes(sw) || sw.includes(ow)))) {
          matchedOption = opt;
          break;
        }

        // Synonym match
        const synList = synonyms[cleanOpt] || [];
        if (synList.some((syn) => cleanSpoken.includes(syn))) {
          matchedOption = opt;
          break;
        }
      }
    }

    if (matchedOption) {
      handleSelectOption(matchedOption, 'voice');
    } else {
      setVoiceNotice(`I heard "${spokenText}". Say "Option 1", "Option 2", or tap an answer button.`);
    }
  };

  const finishGame = async (finalCorrect: number, timesList: number[], method: 'button' | 'voice') => {
    const accuracyPct = Math.round((finalCorrect / totalQuestions) * 100);
    const finalScore = accuracyPct * 10;
    const avgResponseSec = timesList.length > 0
      ? Number((timesList.reduce((a, b) => a + b, 0) / timesList.length).toFixed(1))
      : 2.5;

    setScore(finalScore);

    await saveGameResult({
      userId,
      userName: user?.name || 'Aarav Sharma',
      gameType: 'recognition-quiz',
      score: finalScore,
      accuracy: accuracyPct,
      correctAnswers: finalCorrect,
      totalQuestions,
      responseTime: avgResponseSec,
      difficultyLevel: currentLevel,
      inputMethod: method,
      createdAt: new Date().toISOString(),
    });

    setGameState('result');
  };

  /* INSTRUCTION / PRE-GAME SCREEN */
  if (gameState === 'start') {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <Card className="text-center p-8 sm:p-10 border-3 border-emerald-200 shadow-xl space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-800 rounded-3xl flex items-center justify-center mx-auto border-2 border-emerald-300">
            <HelpCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Recognition Activity</h2>
            <p className="text-slate-700 text-xl font-bold">
              Look at the picture and choose the answer.
            </p>
            <p className="text-emerald-900 font-extrabold text-lg pt-2">
              Take your time. There is no need to hurry.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 inline-flex items-center gap-3">
            <span className="text-base font-extrabold text-slate-800">Current Level:</span>
            <DifficultyBadge level={currentLevel} />
            <span className="text-base font-bold text-slate-600">({params.optionCount} choices)</span>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="xl" icon={Play} onClick={startGame} fullWidth>
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
  const avgTimeRecorded = accumulatedResponseTimes.length > 0
    ? Number((accumulatedResponseTimes.reduce((a, b) => a + b, 0) / accumulatedResponseTimes.length).toFixed(1))
    : 2.5;

  if (gameState === 'result') {
    return (
      <ResultScreen
        gameTitle="Recognition Activity"
        score={score}
        accuracy={Math.round((correctAnswers / totalQuestions) * 100)}
        correctAnswers={correctAnswers}
        totalQuestions={totalQuestions}
        responseTime={avgTimeRecorded}
        currentLevel={currentLevel}
        levelChanged={levelChanged}
        onRestart={startGame}
        onBack={onBackToDashboard}
      />
    );
  }

  /* GAMEPLAY SCREEN */
  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <GameHeader
        title="Recognition Activity"
        level={currentLevel}
        score={correctAnswers * 20}
        onBack={onBackToDashboard}
        instruction={`Item ${questionIndex + 1} of ${totalQuestions}`}
      />

      <Card className="p-8 sm:p-10 border-3 border-emerald-200 shadow-lg text-center my-8 space-y-6">
        <div className="w-36 h-36 bg-slate-100 rounded-3xl flex items-center justify-center text-8xl mx-auto shadow-inner border-2 border-slate-300">
          {currentQuestion.iconSymbol}
        </div>

        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{currentQuestion.question}</h3>

        {/* VOICE INPUT ACCESSIBILITY OPTION */}
        {!isAnswered && (
          <div className="pt-2">
            <VoiceInput onConfirmAnswer={handleSpokenAnswer} promptText="Speak your answer" />
          </div>
        )}

        {/* UNMATCHED VOICE NOTICE */}
        {voiceNotice && (
          <div className="p-4 bg-amber-50 border-2 border-amber-300 text-amber-950 font-extrabold text-base rounded-2xl animate-fadeIn">
            {voiceNotice}
          </div>
        )}

        {/* GENTLE FEEDBACK AFTER ANSWERING */}
        {isAnswered && (
          <div
            className={`p-5 rounded-3xl text-xl font-extrabold shadow-sm transition-all ${
              selectedOption === currentQuestion.correctAnswer
                ? 'bg-emerald-100 text-emerald-950 border-2 border-emerald-400'
                : 'bg-indigo-100 text-indigo-950 border-2 border-indigo-300'
            }`}
          >
            {selectedOption === currentQuestion.correctAnswer
              ? "✓ That's right! Good work."
              : "That's okay. Let's try again."}
          </div>
        )}

        {/* BUTTON ANSWER SELECTION AREA */}
        <div>
          <p className="text-sm font-black uppercase text-slate-400 tracking-wider mb-4">Or select an answer below:</p>
          <div
            className={`grid gap-5 max-w-2xl mx-auto ${
              displayOptions.length <= 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'
            }`}
          >
            {displayOptions.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === currentQuestion.correctAnswer;

              let btnStyle = 'bg-white border-3 border-slate-300 hover:border-emerald-600 text-slate-900';
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-600 border-3 border-emerald-700 text-white shadow-lg';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-600 border-3 border-rose-700 text-white shadow-lg';
                } else {
                  btnStyle = 'bg-slate-100 border border-slate-200 text-slate-400 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt, 'button')}
                  disabled={isAnswered}
                  className={`p-5 sm:p-6 rounded-3xl font-extrabold text-2xl transition-all flex items-center justify-between min-h-[72px] cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full text-sm font-black flex items-center justify-center border shrink-0 ${
                      isAnswered && isCorrect
                        ? 'bg-emerald-700 text-white border-emerald-500'
                        : isAnswered && isSelected
                        ? 'bg-rose-700 text-white border-rose-500'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}>
                      {idx + 1}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-8 h-8 text-white" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-8 h-8 text-white" />}
                </button>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};
