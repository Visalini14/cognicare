import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getReminders, updateReminderStatus, saveActivityLogEntry, getUserProfile } from '../../services/storage';
import { getReminderPhrasing, sendNativeBrowserNotification, requestBrowserNotificationPermission } from '../../services/reminderService';
import { VoiceInput } from './VoiceInput';
import { Bell, Pill, Droplet, Brain, Calendar, CheckCircle2, Volume2, X } from 'lucide-react';
import type { Reminder, UserProfile } from '../../types';

export const ReminderDeliveryManager: React.FC = () => {
  const { user } = useAuth();
  const { speakText } = useLanguage();

  const [currentTriggered, setCurrentTriggered] = useState<{
    reminder: Reminder;
    isEscalated: boolean;
  } | null>(null);

  const [patientProfile, setPatientProfile] = useState<UserProfile | null>(null);
  const checkedTimestampsRef = useRef<Set<string>>(new Set());

  const targetPatientId = user?.role === 'caregiver' ? user.patientId || 'patient-1' : user?.uid || 'patient-1';

  // Request browser notification permission on mount
  useEffect(() => {
    requestBrowserNotificationPermission();
  }, []);

  // Fetch patient profile for deviceMode check
  useEffect(() => {
    async function loadPatient() {
      const p = await getUserProfile(targetPatientId);
      setPatientProfile(p);
    }
    loadPatient();
  }, [targetPatientId]);

  // Main Background Interval Check (Every 10 seconds)
  useEffect(() => {
    let isMounted = true;

    async function checkScheduledReminders() {
      if (!isMounted) return;

      const reminders = await getReminders(targetPatientId);

      const now = new Date();
      const currentHHMM = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      const current12Hour = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      const todayStr = now.toISOString().split('T')[0];

      for (const r of reminders) {
        if (r.status === 'completed') continue;

        const reminderTime = (r.time || '').trim();
        const rTimeUpper = reminderTime.toUpperCase();

        // Check time match (supports both 24-hr "09:00" and 12-hr "09:00 AM")
        const isTimeMatch =
          rTimeUpper === currentHHMM.toUpperCase() ||
          rTimeUpper === current12Hour.toUpperCase() ||
          rTimeUpper.replace(/\s+/g, '') === current12Hour.replace(/\s+/g, '').toUpperCase();

        const triggerKey = `${r.id}_${todayStr}_${rTimeUpper}`;

        // 1. TRIGGER REMINDER AT SCHEDULED TIME
        if (isTimeMatch && !checkedTimestampsRef.current.has(triggerKey) && r.lastTriggeredAt !== todayStr) {
          checkedTimestampsRef.current.add(triggerKey);
          r.lastTriggeredAt = todayStr;

          const pName = user?.patientName || patientProfile?.name || 'Aarav Sharma';
          const phrasing = getReminderPhrasing(r, pName, user?.role || 'patient', false);

          // Update trigger date in storage
          await updateReminderStatus(r.id, 'pending');

          // Log Activity
          await saveActivityLogEntry({
            patientId: r.patientId,
            patientName: pName,
            eventType: 'reminder_triggered',
            title: `${phrasing.categoryLabel} Reminder Triggered`,
            details: `Scheduled ${r.title} triggered for ${pName} (${r.deviceMode === 'shared' ? 'Shared Device' : 'Separate Device'}).`,
          });

          // Fire Audio, Native Notification, and In-App Banner
          sendNativeBrowserNotification(phrasing.title, phrasing.voiceLine);
          speakText(phrasing.voiceLine);
          setCurrentTriggered({ reminder: r, isEscalated: false });
          break;
        }

        // 2. CHECK 30-MINUTE ESCALATION WINDOW FOR PENDING REMINDERS
        if (r.lastTriggeredAt === todayStr && (r.status === 'pending' || r.status === 'escalated')) {
          const createdOrTriggeredTime = new Date(r.createdAt).getTime();
          const minsElapsed = (now.getTime() - createdOrTriggeredTime) / (1000 * 60);

          if (minsElapsed >= 30 && r.status !== 'escalated') {
            r.status = 'escalated';
            await updateReminderStatus(r.id, 'escalated');

            const pName = user?.patientName || patientProfile?.name || 'Aarav Sharma';
            const phrasing = getReminderPhrasing(r, pName, user?.role || 'patient', true);

            // Log Escalation Activity
            await saveActivityLogEntry({
              patientId: r.patientId,
              patientName: pName,
              eventType: 'reminder_escalated',
              title: `⚠️ ${phrasing.categoryLabel} Reminder Escalated`,
              details: `${pName} did not confirm ${r.title} within 30 minutes. Urgent alert sent to Caregiver.`,
            });

            sendNativeBrowserNotification(phrasing.title, phrasing.voiceLine);
            speakText(phrasing.voiceLine);
            setCurrentTriggered({ reminder: r, isEscalated: true });
            break;
          }
        }
      }
    }

    checkScheduledReminders();
    const interval = setInterval(checkScheduledReminders, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [targetPatientId, user, patientProfile, speakText]);

  // Handle Mark Done (Tap or Voice Confirmation)
  const handleMarkDone = async (reminder: Reminder) => {
    const pName = user?.patientName || patientProfile?.name || 'Aarav Sharma';
    await updateReminderStatus(reminder.id, 'completed', new Date().toISOString());

    await saveActivityLogEntry({
      patientId: reminder.patientId,
      patientName: pName,
      eventType: 'reminder_completed',
      title: `${reminder.type.toUpperCase()} Reminder Confirmed`,
      details: `${user?.role === 'caregiver' ? 'Caregiver confirmed' : `${pName} confirmed`} completion of ${reminder.title}.`,
    });

    speakText(`Reminder for ${reminder.title} confirmed as completed. Good work!`);
    setCurrentTriggered(null);
  };

  const handleVoiceConfirm = (spokenText: string) => {
    if (!currentTriggered) return;
    const spoken = spokenText.toLowerCase().trim();

    if (
      spoken.includes('done') ||
      spoken.includes('taken') ||
      spoken.includes('took') ||
      spoken.includes('yes') ||
      spoken.includes('completed') ||
      spoken.includes('finish') ||
      spoken.includes('முடித்தேன்') ||
      spoken.includes('ஆகிவிட்டது') ||
      spoken.includes('हाँ') ||
      spoken.includes('ले लिया')
    ) {
      handleMarkDone(currentTriggered.reminder);
    } else {
      speakText(`I heard "${spokenText}". Please say "Done" or tap Mark Completed.`);
    }
  };

  if (!currentTriggered) return null;

  const { reminder, isEscalated } = currentTriggered;
  const pName = user?.patientName || patientProfile?.name || 'Aarav Sharma';
  const phrasing = getReminderPhrasing(reminder, pName, user?.role || 'patient', isEscalated);
  const isSharedMode = (reminder.deviceMode || 'shared') === 'shared';

  const getTypeIcon = () => {
    switch (reminder.type) {
      case 'medicine':
        return <Pill className="w-10 h-10 text-rose-600" />;
      case 'hydration':
        return <Droplet className="w-10 h-10 text-sky-600" />;
      case 'activity':
        return <Brain className="w-10 h-10 text-teal-600" />;
      case 'appointment':
        return <Calendar className="w-10 h-10 text-amber-600" />;
      default:
        return <Bell className="w-10 h-10 text-teal-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border-4 space-y-6 text-center ${
        isEscalated
          ? 'bg-rose-50 border-rose-600 text-rose-950 ring-4 ring-rose-300'
          : 'bg-white border-teal-600 text-slate-900 ring-4 ring-teal-200'
      }`}>
        {/* HEADER BADGE */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-300">
            {isSharedMode ? '📱 Shared Device Mode' : '📱📱 Separate Device Mode'}
          </div>

          <button
            onClick={() => setCurrentTriggered(null)}
            className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
            title="Dismiss Popup"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* TYPE ICON & TITLE */}
        <div className="space-y-3">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-100 flex items-center justify-center border-2 border-slate-200 shadow-md">
            {getTypeIcon()}
          </div>

          <div className="space-y-1">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
              isEscalated ? 'bg-rose-600 text-white' : 'bg-teal-700 text-white'
            }`}>
              {phrasing.categoryLabel} ALERT
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">{phrasing.title}</h2>
          </div>

          {/* SPOKEN PHRASING TEXT BOX */}
          <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 text-left space-y-2">
            <p className="text-base sm:text-lg font-extrabold text-slate-900 leading-relaxed">
              "{phrasing.voiceLine}"
            </p>
            {reminder.note && (
              <p className="text-sm font-semibold text-slate-600 italic">
                Note: {reminder.note}
              </p>
            )}
          </div>
        </div>

        {/* READ ALOUD AUDIO BUTTON */}
        <button
          onClick={() => speakText(phrasing.voiceLine)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-teal-50 text-teal-800 font-extrabold text-sm border border-teal-300 hover:bg-teal-100 cursor-pointer"
        >
          <Volume2 className="w-4 h-4 text-teal-600" /> Read Aloud Again
        </button>

        {/* CONFIRMATION ACTIONS: TAP BUTTON & VOICE INPUT */}
        <div className="pt-2 space-y-4">
          <button
            onClick={() => handleMarkDone(reminder)}
            className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xl sm:text-2xl shadow-xl flex items-center justify-center gap-3 cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            <CheckCircle2 className="w-7 h-7" />
            {isSharedMode ? 'Caregiver Confirmed (Done)' : 'I Took My Medicine / Done'}
          </button>

          <div className="pt-2">
            <p className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Or confirm by speaking below:</p>
            <VoiceInput
              onConfirmAnswer={handleVoiceConfirm}
              promptText='Say "Done" or "Taken"'
              autoSubmit={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
