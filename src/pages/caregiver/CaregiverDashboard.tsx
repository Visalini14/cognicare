import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getGameResults, getAllPatients } from '../../services/storage';
import { getAdaptiveState } from '../../services/adaptiveDifficulty';
import { Card, StatCard, DifficultyBadge, EmptyState } from '../../components/common/UIComponents';
import {
  Activity,
  Award,
  Clock,
  Brain,
  TrendingUp,
  Calendar,
  Users,
  BarChart2,
  PieChart,
  UserCheck
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import type { GameResult, UserProfile } from '../../types';
import { Link } from 'react-router-dom';

export const CaregiverDashboard: React.FC = () => {
  const { user, linkPatient } = useAuth();
  const [results, setResults] = useState<GameResult[]>([]);
  const [patients, setPatients] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const targetPatientId = user?.patientId || 'patient-1';
  const targetPatientName = user?.patientName || 'Aarav Sharma';

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getGameResults(targetPatientId);
      const allP = await getAllPatients();
      setResults(data);
      setPatients(allP);
      setLoading(false);
    }
    loadData();
  }, [targetPatientId]);

  const handleSwitchPatient = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedObj = patients.find(p => p.uid === selectedId);
    if (selectedObj) {
      await linkPatient(selectedObj.uid, selectedObj.name);
    }
  };

  const gamesPlayed = results.length;
  const avgAccuracy = gamesPlayed > 0 ? Math.round(results.reduce((acc, r) => acc + r.accuracy, 0) / gamesPlayed) : 0;
  const avgResponseTime = gamesPlayed > 0 ? Number((results.reduce((acc, r) => acc + r.responseTime, 0) / gamesPlayed).toFixed(1)) : 0;
  const currentCognitiveLevel = getAdaptiveState(targetPatientId, 'memory-match').currentLevel;

  const timeSeriesData = React.useMemo(() => {
    return [...results]
      .reverse()
      .slice(-10)
      .map((r, i) => ({
        session: `Session ${i + 1}`,
        date: new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        accuracy: r.accuracy,
        difficulty: r.difficultyLevel,
        responseTime: r.responseTime,
      }));
  }, [results]);

  const gamePerformanceData = React.useMemo(() => {
    const categories: Record<string, { totalAcc: number; count: number }> = {
      'Memory Match': { totalAcc: 0, count: 0 },
      'Pattern Recall': { totalAcc: 0, count: 0 },
      'Recognition Quiz': { totalAcc: 0, count: 0 },
      'Family Recognition': { totalAcc: 0, count: 0 },
    };

    results.forEach((r) => {
      let key = 'Memory Match';
      if (r.gameType === 'pattern-recall') key = 'Pattern Recall';
      if (r.gameType === 'recognition-quiz') key = 'Recognition Quiz';
      if (r.gameType === 'family-recognition') key = 'Family Recognition';

      categories[key].totalAcc += r.accuracy;
      categories[key].count += 1;
    });

    return Object.keys(categories).map((key) => ({
      game: key,
      avgAccuracy: categories[key].count > 0 ? Math.round(categories[key].totalAcc / categories[key].count) : 0,
      sessions: categories[key].count,
    }));
  }, [results]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* HEADER BANNER WITH PATIENT WARD LINK */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Activity className="w-4 h-4" /> Caregiver Supervisor Portal
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Caregiver Dashboard</h1>
          <div className="flex items-center gap-2 mt-1">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <p className="text-slate-600 font-medium text-sm">
              Currently Monitoring Assigned Ward:{' '}
              <span className="font-extrabold text-teal-800 underline decoration-teal-400">{targetPatientName}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {patients.length > 0 && (
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Switch Ward:</span>
              <select
                value={targetPatientId}
                onChange={handleSwitchPatient}
                className="bg-transparent text-xs font-bold text-slate-800 cursor-pointer focus:outline-none"
              >
                {patients.map(p => (
                  <option key={p.uid} value={p.uid}>
                    {p.name} ({p.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          <Link
            to="/caregiver/family-members"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Users className="w-4 h-4" />
            Manage Family Photos
          </Link>
        </div>
      </div>

      {/* SUMMARY STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Ward Games Played"
          value={gamesPlayed}
          subtitle={`Total sessions for ${targetPatientName}`}
          icon={Award}
          color="indigo"
        />
        <StatCard
          title="Average Accuracy"
          value={`${avgAccuracy}%`}
          subtitle="Patient success rate"
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Cognitive Level"
          value={`Level ${currentCognitiveLevel}`}
          subtitle="Adaptive tier level"
          icon={Brain}
          color="teal"
        />
        <StatCard
          title="Avg Response Time"
          value={`${avgResponseTime}s`}
          subtitle="Speed per decision"
          icon={Clock}
          color="amber"
        />
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-teal-600" />
                Accuracy Over Time ({targetPatientName})
              </h3>
              <p className="text-xs font-medium text-slate-500">Session-by-session accuracy trend (%)</p>
            </div>
          </div>

          <div className="h-72 w-full">
            {timeSeriesData.length === 0 ? (
              <EmptyState title="No Ward Activity Yet" description={`Accuracy data for ${targetPatientName} will appear after game completion.`} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="accuracy" name="Accuracy (%)" stroke="#0d9488" strokeWidth={3} dot={{ r: 5, fill: '#0d9488' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-indigo-600" />
                Game Performance Comparison
              </h3>
              <p className="text-xs font-medium text-slate-500">Average accuracy across exercises for {targetPatientName}</p>
            </div>
          </div>

          <div className="h-72 w-full">
            {gamePerformanceData.length === 0 ? (
              <EmptyState title="No Chart Data" description="Performance comparison will populate as games are played." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gamePerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="game" stroke="#94a3b8" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="avgAccuracy" name="Avg Accuracy (%)" fill="#4f46e5" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Cognitive Level Progression Over Time
            </h3>
            <p className="text-xs font-medium text-slate-500">Tracking rule-based difficulty tier scaling for {targetPatientName}</p>
          </div>
        </div>

        <div className="h-64 w-full">
          {timeSeriesData.length === 0 ? (
            <EmptyState title="No Progression Data" description="Difficulty level progression will be charted here." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Line type="stepAfter" dataKey="difficulty" name="Cognitive Level" stroke="#10b981" strokeWidth={3} dot={{ r: 6, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* RECENT ACTIVITY TABLE FOR WARD */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Recent Patient Activity ({targetPatientName})</h3>
            <p className="text-xs font-medium text-slate-500">Chronological history strictly for your assigned ward</p>
          </div>
          <Link to="/caregiver/activity" className="text-xs font-bold text-teal-600 hover:text-teal-700">
            View All Activity →
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400">Loading activity table...</div>
        ) : results.length === 0 ? (
          <EmptyState title="No Activity Data" description={`No game sessions recorded for ${targetPatientName} yet.`} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-400">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Game</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Accuracy</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Response Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {results.slice(0, 5).map((r) => (
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
