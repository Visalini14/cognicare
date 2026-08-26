import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getGameResults } from '../../services/storage';
import { Card, StatCard, DifficultyBadge, EmptyState } from '../../components/common/UIComponents';
import { BarChart3, Award, Clock, Brain, Calendar, Filter, UserCheck } from 'lucide-react';
import type { GameResult } from '../../types';

export const PatientProgressDetail: React.FC = () => {
  const { user } = useAuth();
  const targetPatientId = user?.patientId || 'patient-1';
  const targetPatientName = user?.patientName || 'Aarav Sharma';

  const [results, setResults] = useState<GameResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<GameResult[]>([]);
  const [selectedGame, setSelectedGame] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getGameResults(targetPatientId);
      setResults(data);
      setFilteredResults(data);
      setLoading(false);
    }
    loadData();
  }, [targetPatientId]);

  const handleFilterChange = (game: string) => {
    setSelectedGame(game);
    if (game === 'all') {
      setFilteredResults(results);
    } else {
      setFilteredResults(results.filter((r) => r.gameType === game));
    }
  };

  const totalSessions = filteredResults.length;
  const avgAccuracy = totalSessions > 0 ? Math.round(filteredResults.reduce((acc, r) => acc + r.accuracy, 0) / totalSessions) : 0;
  const avgResponseTime = totalSessions > 0 ? Number((filteredResults.reduce((acc, r) => acc + r.responseTime, 0) / totalSessions).toFixed(1)) : 0;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
          <UserCheck className="w-4 h-4" /> Monitoring Patient Ward
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Patient Analytics ({targetPatientName})</h1>
        <p className="text-slate-500 font-medium text-base">In-depth accuracy trends, reaction speed, and cognitive metrics strictly for {targetPatientName}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Ward Sessions" value={totalSessions} icon={Award} color="indigo" />
        <StatCard title="Average Accuracy" value={`${avgAccuracy}%`} icon={BarChart3} color="emerald" />
        <StatCard title="Avg Reaction Speed" value={`${avgResponseTime}s`} icon={Clock} color="amber" />
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Filter className="w-5 h-5 text-teal-600" /> Filter Ward Performance
          </h2>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Exercises' },
              { id: 'memory-match', label: 'Memory Match' },
              { id: 'pattern-recall', label: 'Pattern Recall' },
              { id: 'recognition-quiz', label: 'Recognition Quiz' },
              { id: 'family-recognition', label: 'Family Recognition' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleFilterChange(item.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedGame === item.id
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400">Loading metrics...</div>
        ) : filteredResults.length === 0 ? (
          <EmptyState title="No Records Found" description={`No game sessions logged for ${targetPatientName} matching the selected filter.`} icon={Brain} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-400">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Game Exercise</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Accuracy</th>
                  <th className="py-3 px-4">Difficulty Level</th>
                  <th className="py-3 px-4">Avg Response Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredResults.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{r.userName || targetPatientName}</td>
                    <td className="py-3 px-4 font-extrabold text-slate-900 capitalize">
                      {r.gameType.replace('-', ' ')}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-teal-700">{r.score}</td>
                    <td className="py-3 px-4 font-bold text-emerald-600">{r.accuracy}%</td>
                    <td className="py-3 px-4">
                      <DifficultyBadge level={r.difficultyLevel} />
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-600">{r.responseTime}s</td>
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
