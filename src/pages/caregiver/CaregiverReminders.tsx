import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getReminders, saveReminder, deleteReminder, updateReminderStatus, getUserProfile, updatePatientDeviceMode } from '../../services/storage';
import { Card, Button, EmptyState } from '../../components/common/UIComponents';
import { Bell, Plus, Pill, Droplet, Brain, Calendar, Clock, Edit2, Trash2, CheckCircle2, Smartphone, Users, AlertCircle } from 'lucide-react';
import type { Reminder, ReminderCategory, ReminderFrequency, DeviceMode } from '../../types';

export const CaregiverReminders: React.FC = () => {
  const { user } = useAuth();
  const targetPatientId = user?.patientId || 'patient-1';
  const targetPatientName = user?.patientName || 'Aarav Sharma';

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('shared');
  const [activeTab, setActiveTab] = useState<'all' | ReminderCategory>('all');
  const [loading, setLoading] = useState(true);

  // Form State for Creating / Editing Reminder
  const [showModal, setShowModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [formType, setFormType] = useState<ReminderCategory>('medicine');
  const [formTitle, setFormTitle] = useState('');
  const [formTime, setFormTime] = useState('09:00 AM');
  const [formFrequency, setFormFrequency] = useState<ReminderFrequency>('daily');
  const [formNote, setFormNote] = useState('');
  const [formError, setFormError] = useState('');

  const loadData = async () => {
    setLoading(true);
    const p = await getUserProfile(targetPatientId);
    setDeviceMode(p?.deviceMode || 'shared');

    const data = await getReminders(targetPatientId);
    setReminders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [targetPatientId]);

  const handleDeviceModeChange = async (mode: DeviceMode) => {
    setDeviceMode(mode);
    await updatePatientDeviceMode(targetPatientId, mode);
    await loadData();
  };

  const openCreateModal = () => {
    setEditingReminder(null);
    setFormType('medicine');
    setFormTitle('');
    setFormTime('09:00 AM');
    setFormFrequency('daily');
    setFormNote('');
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (rem: Reminder) => {
    setEditingReminder(rem);
    setFormType(rem.type);
    setFormTitle(rem.title);
    setFormTime(rem.time);
    setFormFrequency(rem.frequency);
    setFormNote(rem.note || '');
    setFormError('');
    setShowModal(true);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Please enter a title for the reminder.');
      return;
    }

    await saveReminder({
      id: editingReminder?.id,
      caregiverId: user?.uid || 'caregiver-1',
      patientId: targetPatientId,
      patientName: targetPatientName,
      type: formType,
      title: formTitle.trim(),
      time: formTime.trim(),
      note: formNote.trim(),
      frequency: formFrequency,
      deviceMode,
      status: editingReminder?.status || 'pending',
    });

    setShowModal(false);
    await loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this reminder?')) {
      await deleteReminder(id);
      await loadData();
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await updateReminderStatus(id, nextStatus as any);
    await loadData();
  };

  const filteredReminders = reminders.filter((r) => {
    if (activeTab === 'all') return true;
    return r.type === activeTab;
  });

  const upcomingReminders = filteredReminders.filter((r) => r.status !== 'completed');
  const pastReminders = filteredReminders.filter((r) => r.status === 'completed');

  const getTypeIcon = (type: ReminderCategory) => {
    switch (type) {
      case 'medicine':
        return <Pill className="w-5 h-5 text-rose-600" />;
      case 'hydration':
        return <Droplet className="w-5 h-5 text-sky-600" />;
      case 'activity':
        return <Brain className="w-5 h-5 text-teal-600" />;
      case 'appointment':
        return <Calendar className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
            <Bell className="w-4 h-4" /> Caregiver Reminders Portal
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Reminders & Schedules ({targetPatientName})</h1>
          <p className="text-slate-500 font-medium text-base">Schedule medicines, hydration, cognitive activities, and medical appointments.</p>
        </div>

        <Button variant="primary" size="lg" icon={Plus} onClick={openCreateModal}>
          Create Reminder
        </Button>
      </div>

      {/* PART 1 — DEVICE MODE SELECTION SETTING */}
      <Card className="p-6 border-2 border-teal-200 bg-gradient-to-br from-teal-50/50 to-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-800 text-xs font-black uppercase tracking-wider rounded-full">
              <Smartphone className="w-3.5 h-3.5" /> Part 1: Household Device Mode Setting
            </div>
            <h3 className="text-xl font-black text-slate-900">Patient Device Ownership Configuration</h3>
            <p className="text-slate-600 text-sm font-medium leading-relaxed">
              Select how {targetPatientName} accesses CogniCare. This controls whether reminder banners & voice lines are phrased for the Caregiver or directly for the Patient.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto shrink-0">
            {/* SHARED DEVICE CARD (DEFAULT) */}
            <button
              type="button"
              onClick={() => handleDeviceModeChange('shared')}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                deviceMode === 'shared'
                  ? 'bg-teal-700 text-white border-teal-800 shadow-md ring-2 ring-teal-400'
                  : 'bg-white text-slate-800 border-slate-300 hover:border-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-sm flex items-center gap-1.5">
                  <Users className="w-4 h-4" /> Shared Device
                </span>
                {deviceMode === 'shared' && <span className="text-[10px] uppercase font-black bg-white text-teal-800 px-2 py-0.5 rounded-full">Active Default</span>}
              </div>
              <p className={`text-xs ${deviceMode === 'shared' ? 'text-teal-100' : 'text-slate-500'}`}>
                Caregiver & Patient use the same phone. Alerts phrase for Caregiver to hand over phone/give medicine.
              </p>
            </button>

            {/* SEPARATE DEVICE CARD */}
            <button
              type="button"
              onClick={() => handleDeviceModeChange('separate')}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                deviceMode === 'separate'
                  ? 'bg-indigo-700 text-white border-indigo-800 shadow-md ring-2 ring-indigo-400'
                  : 'bg-white text-slate-800 border-slate-300 hover:border-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-sm flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" /> Separate Device
                </span>
                {deviceMode === 'separate' && <span className="text-[10px] uppercase font-black bg-white text-indigo-800 px-2 py-0.5 rounded-full">Active</span>}
              </div>
              <p className={`text-xs ${deviceMode === 'separate' ? 'text-indigo-100' : 'text-slate-500'}`}>
                Patient has their own phone/tablet. Alerts phrase directly for Patient. Escalates to Caregiver if unconfirmed.
              </p>
            </button>
          </div>
        </div>
      </Card>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {(['all', 'medicine', 'hydration', 'activity', 'appointment'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-2xl font-extrabold text-sm capitalize transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab === 'all' ? 'All Reminders' : tab}
          </button>
        ))}
      </div>

      {/* UPCOMING REMINDERS LIST */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-teal-700" /> Upcoming Reminders ({upcomingReminders.length})
        </h3>

        {loading ? (
          <div className="py-8 text-center text-slate-400 font-semibold">Loading reminders...</div>
        ) : upcomingReminders.length === 0 ? (
          <EmptyState
            title="No Upcoming Reminders"
            description={`No scheduled reminders pending for ${targetPatientName}. Click Create Reminder above to add one.`}
            icon={Bell}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingReminders.map((r) => (
              <Card key={r.id} className="p-5 border-2 border-slate-200 hover:border-teal-600 transition-all flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
                      {getTypeIcon(r.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-teal-700">{r.type}</span>
                        <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                          {r.frequency}
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-slate-900 leading-snug">{r.title}</h4>
                    </div>
                  </div>

                  <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full font-black text-sm border border-amber-300 shrink-0">
                    {r.time}
                  </span>
                </div>

                {r.note && (
                  <p className="text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    "{r.note}"
                  </p>
                )}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                    {r.deviceMode === 'shared' ? 'Shared Mode' : 'Separate Mode'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(r.id, r.status)}
                      className="px-3 py-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-xl font-extrabold flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Done
                    </button>

                    <button
                      onClick={() => openEditModal(r)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* COMPLETED / PAST REMINDERS */}
      {pastReminders.length > 0 && (
        <div className="space-y-4 pt-6">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Completed Reminders ({pastReminders.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-75">
            {pastReminders.map((r) => (
              <Card key={r.id} className="p-4 border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 line-through">{r.title}</h4>
                    <p className="text-xs text-slate-500 font-semibold">{r.time} • Completed {r.completedAt ? new Date(r.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(r.id, r.status)}
                    className="px-2.5 py-1 text-xs font-extrabold text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
                  >
                    Reopen
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-1 text-rose-400 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* CREATE / EDIT REMINDER MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border-2 border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-2xl font-black text-slate-900">
                {editingReminder ? 'Edit Reminder' : 'Create New Reminder'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveForm} className="space-y-4">
              {/* CATEGORY SELECTOR */}
              <div className="space-y-1">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Reminder Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['medicine', 'hydration', 'activity', 'appointment'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormType(type)}
                      className={`p-3 rounded-2xl border-2 font-extrabold text-xs capitalize flex flex-col items-center gap-1 cursor-pointer transition-all ${
                        formType === type
                          ? 'bg-teal-700 text-white border-teal-800 shadow-md'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {getTypeIcon(type)}
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* TITLE */}
              <div className="space-y-1">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Reminder Name / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Morning Blood Pressure Medication"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-teal-600 focus:outline-none font-bold text-slate-900"
                />
              </div>

              {/* TIME & FREQUENCY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Scheduled Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 09:00 AM"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-teal-600 focus:outline-none font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Repeat Frequency</label>
                  <select
                    value={formFrequency}
                    onChange={(e) => setFormFrequency(e.target.value as ReminderFrequency)}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-teal-600 focus:outline-none font-bold text-slate-900 bg-white"
                  >
                    <option value="daily">Daily Repeat</option>
                    <option value="once">One-Time Only</option>
                  </select>
                </div>
              </div>

              {/* OPTIONAL NOTE */}
              <div className="space-y-1">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Optional Instructions / Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Take 1 tablet after breakfast with warm water"
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-teal-600 focus:outline-none font-medium text-slate-900"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <Button type="button" variant="outline" size="md" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md">
                  {editingReminder ? 'Save Changes' : 'Create Reminder'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
