import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getGameResults, getActivityLogs } from '../../services/storage';
import { Card, DifficultyBadge, EmptyState } from '../../components/common/UIComponents';
import { ShieldCheck, Calendar, Search, UserCheck, Bell, Gamepad2 } from 'lucide-react';

interface UnifiedLogItem {
  id: string;
  timestamp: string;
  patientName: string;
  type: 'game' | 'reminder';
  title: string;
  details: string;
  badgeColor?: string;
  score?: number;
  accuracy?: number;
  difficultyLevel?: number;
  responseTime?: number;
}

export const ActivityLog: React.FC = () => {
  const { user } = useAuth();
  const targetPatientId = user?.patientId || 'patient-1';
  const targetPatientName = user?.patientName || 'Aarav Sharma';

  const [logs, setLogs] = useState<UnifiedLogItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const gameData = await getGameResults(targetPatientId);
      const reminderLogs = await getActivityLogs(targetPatientId);

      const unifiedGameItems: UnifiedLogItem[] = gameData.map((g) => ({
        id: g.id,
        timestamp: g.createdAt,
        patientName: g.userName || targetPatientName,
        type: 'game',
        title: `Game: ${g.gameType.replace('-', ' ')}`,
        details: `Score: ${g.score} | Accuracy: ${g.accuracy}% | Time: ${g.responseTime}s | Level ${g.difficultyLevel}`,
        score: g.score,
        accuracy: g.accuracy,
        difficultyLevel: g.difficultyLevel,
        responseTime: g.responseTime,
      }));

      const unifiedReminderItems: UnifiedLogItem[] = reminderLogs.map((r) => ({
        id: r.id,
        timestamp: r.timestamp,
        patientName: r.patientName || targetPatientName,
        type: 'reminder',
        title: r.title,
        details: r.details,
      }));

      const combined = [...unifiedGameItems, ...unifiedReminderItems].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setLogs(combined);
      setLoading(false);
    }
    loadData();
  }, [targetPatientId, targetPatientName]);

  const filtered = logs.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
          <UserCheck className="w-4 h-4" /> Ward Audit & Reminder Logs
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Patient Activity Logs ({targetPatientName})</h1>
        <p className="text-slate-500 font-medium text-base">Complete audit record of game exercises, reminder triggers, and completion logs for {targetPatientName}.</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search exercise or reminder logs..."
            className="w-full bg-transparent focus:outline-none text-sm font-semibold text-slate-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400 font-bold">Loading activity logs...</div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No Activity Logs" description={`No logged activities recorded for ${targetPatientName} yet.`} icon={ShieldCheck} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-400">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Activity Event</th>
                  <th className="py-3 px-4">Details & Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-600 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{item.patientName}</td>
                    <td className="py-3 px-4 font-extrabold text-slate-900 capitalize">
                      <div className="flex items-center gap-2">
                        {item.type === 'game' ? (
                          <span className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                            <Gamepad2 className="w-4 h-4" />
                          </span>
                        ) : (
                          <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0">
                            <Bell className="w-4 h-4" />
                          </span>
                        )}
                        <span>{item.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-600">
                      {item.type === 'game' && item.accuracy !== undefined ? (
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-teal-700">Score: {item.score}</span>
                          <span className="font-bold text-emerald-600">Acc: {item.accuracy}%</span>
                          {item.difficultyLevel && <DifficultyBadge level={item.difficultyLevel} />}
                          <span className="text-xs text-slate-400">{item.responseTime}s</span>
                        </div>
                      ) : (
                        <span className="text-slate-700">{item.details}</span>
                      )}
                    </td>
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
