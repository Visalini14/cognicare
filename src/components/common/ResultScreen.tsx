import React from 'react';
import { ArrowRight, TrendingUp, TrendingDown, Star, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Button, Card, DifficultyBadge } from './UIComponents';

interface ResultScreenProps {
  gameTitle: string;
  score: number;
  accuracy: number;
  correctAnswers: number;
  totalQuestions: number;
  responseTime: number;
  currentLevel: number;
  levelChanged?: 'increased' | 'decreased' | 'unchanged';
  onRestart: () => void;
  onBack: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  gameTitle,
  score,
  accuracy,
  correctAnswers,
  totalQuestions,
  responseTime,
  currentLevel,
  levelChanged = 'unchanged',
  onRestart,
  onBack,
}) => {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Card className="text-center p-8 sm:p-10 border-3 border-teal-200 shadow-xl relative overflow-hidden">
        <div className="w-20 h-20 bg-teal-100 text-teal-800 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-teal-300">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Activity Complete!</h2>
        <p className="text-slate-700 font-bold text-xl mt-2">
          You completed <span className="text-teal-800 font-extrabold">{gameTitle}</span>
        </p>

        <div className="my-6 p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3">
            {levelChanged === 'increased' && (
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl border border-emerald-300">
                <TrendingUp className="w-7 h-7" />
              </div>
            )}
            {levelChanged === 'decreased' && (
              <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl border border-amber-300">
                <TrendingDown className="w-7 h-7" />
              </div>
            )}
            {levelChanged === 'unchanged' && (
              <div className="p-3 bg-teal-100 text-teal-800 rounded-2xl border border-teal-300">
                <Star className="w-7 h-7" />
              </div>
            )}
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-wide">Difficulty Status</p>
              <h4 className="text-lg font-extrabold text-slate-900 mt-0.5">
                {levelChanged === 'increased' && 'Well done! Advanced to next difficulty level.'}
                {levelChanged === 'decreased' && 'Level adjusted for optimal comfort.'}
                {levelChanged === 'unchanged' && 'Good work! Current level maintained.'}
              </h4>
            </div>
          </div>
          <DifficultyBadge level={currentLevel} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
          <div className="p-4 bg-teal-50 rounded-2xl border-2 border-teal-200 text-center">
            <p className="text-xs font-black uppercase text-teal-800">Score</p>
            <p className="text-3xl font-black text-teal-900 mt-1">{score}</p>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-200 text-center">
            <p className="text-xs font-black uppercase text-emerald-800">Accuracy</p>
            <p className="text-3xl font-black text-emerald-900 mt-1">{accuracy}%</p>
          </div>

          <div className="p-4 bg-indigo-50 rounded-2xl border-2 border-indigo-200 text-center">
            <p className="text-xs font-black uppercase text-indigo-800">Correct</p>
            <p className="text-3xl font-black text-indigo-900 mt-1">
              {correctAnswers}/{totalQuestions}
            </p>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-200 text-center">
            <p className="text-xs font-black uppercase text-amber-800">Avg Speed</p>
            <p className="text-3xl font-black text-amber-900 mt-1">{responseTime}s</p>
          </div>
        </div>

        <p className="text-lg font-bold text-slate-700 mb-8">
          Well done! Let's try another activity or play again.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="primary" size="xl" icon={RotateCcw} onClick={onRestart} fullWidth>
            Play Again
          </Button>
          <Button variant="outline" size="xl" icon={ArrowRight} onClick={onBack} fullWidth>
            Back to Activities
          </Button>
        </div>
      </Card>
    </div>
  );
};
