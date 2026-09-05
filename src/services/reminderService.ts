import type { Reminder, DeviceMode, UserRole } from '../types';

export function requestBrowserNotificationPermission() {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }
}

export function sendNativeBrowserNotification(title: string, body: string) {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/favicon.svg',
        tag: 'cognicare-reminder-' + Date.now(),
      });
    } catch (e) {
      console.warn('Native notification failed:', e);
    }
  }
}

/**
 * Dynamic Phrasing Template Engine
 * Swaps phrase structure based on Device Mode ('shared' vs 'separate') and recipient role
 */
export function getReminderPhrasing(
  reminder: Reminder,
  patientName: string,
  recipientRole: UserRole = 'patient',
  isEscalated = false
): { title: string; voiceLine: string; categoryLabel: string } {
  const mode: DeviceMode = reminder.deviceMode || 'shared';
  const pName = patientName || reminder.patientName || 'Aarav';
  const note = reminder.note ? reminder.note.trim() : '';

  let categoryLabel = 'Reminder';
  if (reminder.type === 'medicine') categoryLabel = 'Medicine';
  if (reminder.type === 'hydration') categoryLabel = 'Hydration';
  if (reminder.type === 'activity') categoryLabel = 'Daily Activity';
  if (reminder.type === 'appointment') categoryLabel = 'Medical Appointment';

  // ESCALATION PHRASING (Triggered if pending > 30 minutes)
  if (isEscalated) {
    if (mode === 'shared' || recipientRole === 'caregiver') {
      return {
        title: `⚠️ Urgent: ${categoryLabel} Pending`,
        voiceLine: `Urgent alert: Please check on ${pName}. Their ${categoryLabel.toLowerCase()} reminder at ${reminder.time} is still pending confirmation!`,
        categoryLabel,
      };
    } else {
      return {
        title: `🚨 Escalated to Caregiver: ${categoryLabel}`,
        voiceLine: `Alert: ${pName} hasn't responded to their ${categoryLabel.toLowerCase()} reminder yet. Caregiver notification sent.`,
        categoryLabel,
      };
    }
  }

  // SHARED DEVICE MODE (Default: Phrased for Caregiver)
  if (mode === 'shared') {
    if (reminder.type === 'medicine') {
      return {
        title: `Medicine Reminder: ${pName}`,
        voiceLine: `Please give ${pName} their medicine now. ${note ? `Note: ${note}` : ''}`,
        categoryLabel,
      };
    }

    if (reminder.type === 'activity') {
      return {
        title: `Activity Time: ${pName}`,
        voiceLine: `Time to hand the phone to ${pName} for today's cognitive activity.`,
        categoryLabel,
      };
    }

    if (reminder.type === 'hydration') {
      return {
        title: `Hydration Alert: ${pName}`,
        voiceLine: `Please offer ${pName} a glass of water now.`,
        categoryLabel,
      };
    }

    if (reminder.type === 'appointment') {
      return {
        title: `Medical Appointment: ${pName}`,
        voiceLine: `Medical appointment alert for ${pName}: ${note || reminder.title}.`,
        categoryLabel,
      };
    }
  }

  // SEPARATE DEVICE MODE (Phrased directly for Patient)
  if (reminder.type === 'medicine') {
    return {
      title: `It's Time to Take Your Medicine`,
      voiceLine: `It's time to take your medicine, ${pName}. ${note ? `Note: ${note}` : ''}`,
      categoryLabel,
    };
  }

  if (reminder.type === 'activity') {
    return {
      title: `Daily Cognitive Activity Time`,
      voiceLine: `It's time for your daily cognitive activity, ${pName}!`,
      categoryLabel,
    };
  }

  if (reminder.type === 'hydration') {
    return {
      title: `Hydration Time`,
      voiceLine: `It's time to drink a glass of water, ${pName}.`,
      categoryLabel,
    };
  }

  if (reminder.type === 'appointment') {
    return {
      title: `Medical Appointment Scheduled`,
      voiceLine: `You have a medical appointment scheduled today: ${note || reminder.title}.`,
      categoryLabel,
    };
  }

  return {
    title: reminder.title,
    voiceLine: `Reminder for ${pName}: ${reminder.title}. ${note}`,
    categoryLabel,
  };
}
