import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getGameResults } from '../../services/storage';
import { Card, DifficultyBadge, EmptyState } from '../../components/common/UIComponents';
import { ShieldCheck, Calendar, Search, UserCheck } from 'lucide-react';
import type { GameResult } from '../../types';

export const ActivityLog: React.FC = () => {
  const { user } = useAuth();
  const targetPatientId = user?.patientId || 'patient-1';
  const targetPatientName = user?.patientName || 'Aarav Sharma';

  const [results, setResults] = useState<GameResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getGameResults(targetPatientId);
      setResults(data);
      setLoading(false);
    }
    loadData();
  }, [targetPatientId]);

  const filtered = results.filter(
    (r) =>
      r.gameType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.userName && r.userName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
          <UserCheck className="w-4 h-4" /> Ward Audit Logs
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Patient Activity Logs ({targetPatientName})</h1>
        <p className="text-slate-500 font-medium text-base">Complete audit record of game sessions strictly for {targetPatientName}</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search exercise type..."
            className="w-full bg-transparent focus:outline-none text-sm font-semibold text-slate-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400">Loading activity logs...</div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No Activity Logs" description={`No logged activities recorded for ${targetPatientName} yet.`} icon={ShieldCheck} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-400">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Exercise</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Accuracy</th>
                  <th className="py-3 px-4">Difficulty Level</th>
                  <th className="py-3 px-4">Response Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {new Date(r.createdAt).toLocaleString()}
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
