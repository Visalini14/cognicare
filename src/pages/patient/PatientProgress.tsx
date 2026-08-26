import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getGameResults } from '../../services/storage';
import { Card, StatCard, DifficultyBadge, EmptyState } from '../../components/common/UIComponents';
import { Trophy, Award, Clock, Brain, Calendar } from 'lucide-react';
import type { GameResult } from '../../types';

export const PatientProgress: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.uid || 'patient-1';

  const [results, setResults] = useState<GameResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getGameResults(userId);
      setResults(data);
      setLoading(false);
    }
    loadData();
  }, [userId]);

  const totalGames = results.length;
  const avgAccuracy = totalGames > 0 ? Math.round(results.reduce((acc, r) => acc + r.accuracy, 0) / totalGames) : 0;
  const avgSpeed = totalGames > 0 ? Number((results.reduce((acc, r) => acc + r.responseTime, 0) / totalGames).toFixed(1)) : 0;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="border-b-2 border-slate-200 pb-4">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">My Progress</h1>
        <p className="text-slate-600 text-lg font-semibold mt-1">Review your completed cognitive activities and milestones</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Activities Completed" value={totalGames} icon={Award} color="teal" />
        <StatCard title="Overall Accuracy" value={`${avgAccuracy}%`} icon={Trophy} color="emerald" />
        <StatCard title="Average Response Speed" value={`${avgSpeed}s`} icon={Clock} color="indigo" />
      </div>

      <Card className="p-8 border-3 border-slate-200">
        <h2 className="text-2xl font-black text-slate-900 mb-6">Recent Training Activity</h2>

        {loading ? (
          <div className="py-12 text-center text-slate-500 font-extrabold text-lg">Loading your history...</div>
        ) : results.length === 0 ? (
          <EmptyState
            title="No Activity Logged Yet"
            description="Complete activities from the Home or Activities page to view your achievements here."
            icon={Brain}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-xs font-black uppercase text-slate-500">
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Activity Name</th>
                  <th className="py-4 px-4">Score</th>
                  <th className="py-4 px-4">Accuracy</th>
                  <th className="py-4 px-4">Level</th>
                  <th className="py-4 px-4">Speed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-base">
                {results.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="py-4 px-4 font-bold text-slate-700">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-slate-400" />
                        {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-extrabold text-slate-900 capitalize">
                      {r.gameType.replace('-', ' ')}
                    </td>
                    <td className="py-4 px-4 font-extrabold text-teal-800">{r.score}</td>
                    <td className="py-4 px-4 font-bold text-emerald-700">{r.accuracy}%</td>
                    <td className="py-4 px-4">
                      <DifficultyBadge level={r.difficultyLevel} />
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-700">{r.responseTime}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
