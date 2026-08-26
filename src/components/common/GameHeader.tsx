import React from 'react';
import { ArrowLeft, Clock, Award, ShieldAlert } from 'lucide-react';
import { Button, DifficultyBadge } from './UIComponents';

interface GameHeaderProps {
  title: string;
  level: number;
  score?: number;
  mistakes?: number;
  timeSec?: number;
  onBack: () => void;
  instruction?: string;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  title,
  level,
  score,
  mistakes,
  timeSec,
  onBack,
  instruction,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="md" icon={ArrowLeft} onClick={onBack}>
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h1>
              <DifficultyBadge level={level} />
            </div>
            {instruction && <p className="text-base font-semibold text-slate-600 mt-1">{instruction}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-100 p-3 rounded-2xl border border-slate-200">
          {score !== undefined && (
            <div className="flex items-center gap-2 px-4 py-1.5 bg-teal-100 text-teal-900 rounded-xl font-extrabold text-base">
              <Award className="w-5 h-5 text-teal-700" />
              <span>Score: {score}</span>
            </div>
          )}

          {mistakes !== undefined && (
            <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-100 text-amber-900 rounded-xl font-extrabold text-base">
              <ShieldAlert className="w-5 h-5 text-amber-700" />
              <span>Mistakes: {mistakes}</span>
            </div>
          )}

          {timeSec !== undefined && (
            <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-100 text-indigo-900 rounded-xl font-extrabold text-base">
              <Clock className="w-5 h-5 text-indigo-700" />
              <span>{timeSec}s</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
