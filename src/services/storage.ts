import { isFirebaseConfigured, db, storage } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import type { UserProfile, GameResult, FamilyMember, Reminder, ActivityLogEntry, DeviceMode, ReminderStatus } from '../types';

const STORAGE_KEYS = {
  USERS: 'cognicare_demo_users',
  RESULTS: 'cognicare_demo_results',
  FAMILY: 'cognicare_demo_family',
  REMINDERS: 'cognicare_demo_reminders',
  ACTIVITY_LOGS: 'cognicare_demo_activity_logs',
};

export function seedDemoData() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const demoUsers: Record<string, UserProfile> = {
      'patient-1': {
        uid: 'patient-1',
        name: 'Aarav Sharma',
        email: 'patient@cognicare.demo',
        role: 'patient',
        deviceMode: 'shared',
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      },
      'patient-2': {
        uid: 'patient-2',
        name: 'Ramesh Patel',
        email: 'ramesh@cognicare.demo',
        role: 'patient',
        deviceMode: 'shared',
        createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
      },
      'patient-3': {
        uid: 'patient-3',
        name: 'Saraswati Devi',
        email: 'saraswati@cognicare.demo',
        role: 'patient',
        deviceMode: 'shared',
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      },
      'caregiver-1': {
        uid: 'caregiver-1',
        name: 'Dr. Sunita Sharma',
        email: 'caregiver@cognicare.demo',
        role: 'caregiver',
        patientId: 'patient-1',
        patientName: 'Aarav Sharma',
        deviceMode: 'shared',
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      },
    };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(demoUsers));
  }

  if (!localStorage.getItem(STORAGE_KEYS.REMINDERS)) {
    const demoReminders: Reminder[] = [
      {
        id: 'rem-1',
        caregiverId: 'caregiver-1',
        patientId: 'patient-1',
        patientName: 'Aarav Sharma',
        type: 'medicine',
        title: 'Morning Blood Pressure Medication',
        time: '09:00 AM',
        note: 'Take 1 tablet after breakfast with warm water',
        frequency: 'daily',
        deviceMode: 'shared',
        status: 'pending',
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
      {
        id: 'rem-2',
        caregiverId: 'caregiver-1',
        patientId: 'patient-1',
        patientName: 'Aarav Sharma',
        type: 'hydration',
        title: 'Mid-Day Glass of Water',
        time: '02:00 PM',
        note: 'Fresh electrolyte water drink',
        frequency: 'daily',
        deviceMode: 'shared',
        status: 'pending',
        createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
      {
        id: 'rem-3',
        caregiverId: 'caregiver-1',
        patientId: 'patient-1',
        patientName: 'Aarav Sharma',
        type: 'activity',
        title: 'Memory Match Activity Session',
        time: '05:00 PM',
        note: 'Cognitive brain exercise session',
        frequency: 'daily',
        deviceMode: 'shared',
        status: 'pending',
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        id: 'rem-4',
        caregiverId: 'caregiver-1',
        patientId: 'patient-1',
        patientName: 'Aarav Sharma',
        type: 'appointment',
        title: 'Monthly Neurologist Checkup',
        time: '11:00 AM',
        note: 'City Hospital OPD Room 204 with Dr. Verma',
        frequency: 'once',
        deviceMode: 'shared',
        status: 'pending',
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(demoReminders));
  }

  if (!localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS)) {
    const demoLogs: ActivityLogEntry[] = [
      {
        id: 'act-1',
        patientId: 'patient-1',
        patientName: 'Aarav Sharma',
        eventType: 'reminder_created',
        title: 'Reminder Schedule Created',
        details: 'Caregiver set up daily Morning Blood Pressure Medication reminder for 09:00 AM.',
        timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        id: 'act-2',
        patientId: 'patient-1',
        patientName: 'Aarav Sharma',
        eventType: 'reminder_completed',
        title: 'Medicine Reminder Completed',
        details: 'Caregiver confirmed Aarav Sharma took Morning Blood Pressure Medication.',
        timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(demoLogs));
  }

  // CLEANUP DUMMY / SAMPLE FAMILY MEMBERS (Anand, Priya, Meena)
  cleanupDummyFamilyMembers();

  if (!localStorage.getItem(STORAGE_KEYS.RESULTS)) {
    const now = Date.now();
    const day = 86400000;
    const demoResults: GameResult[] = [
      {
        id: 'res-1',
        userId: 'patient-1',
        userName: 'Aarav Sharma',
        gameType: 'memory-match',
        score: 85,
        accuracy: 80,
        correctAnswers: 4,
        totalQuestions: 5,
        responseTime: 4.2,
        difficultyLevel: 1,
        createdAt: new Date(now - 6 * day).toISOString(),
      },
      {
        id: 'res-2',
        userId: 'patient-1',
        userName: 'Aarav Sharma',
        gameType: 'pattern-recall',
        score: 90,
        accuracy: 85,
        correctAnswers: 3,
        totalQuestions: 4,
        responseTime: 3.8,
        difficultyLevel: 1,
        createdAt: new Date(now - 5 * day).toISOString(),
      },
      {
        id: 'res-3',
        userId: 'patient-1',
        userName: 'Aarav Sharma',
        gameType: 'recognition-quiz',
        score: 100,
        accuracy: 100,
        correctAnswers: 5,
        totalQuestions: 5,
        responseTime: 3.1,
        difficultyLevel: 2,
        createdAt: new Date(now - 4 * day).toISOString(),
      },
      {
        id: 'res-4',
        userId: 'patient-1',
        userName: 'Aarav Sharma',
        gameType: 'family-recognition',
        score: 95,
        accuracy: 90,
        correctAnswers: 3,
        totalQuestions: 3,
        responseTime: 2.9,
        difficultyLevel: 2,
        createdAt: new Date(now - 3 * day).toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(demoResults));
  }
}

/**
 * Clean up dummy/seeded sample family member records (Anand, Priya, Meena)
 * Preserves ONLY user-registered family members (e.g. Salu).
 */
export function cleanupDummyFamilyMembers(): void {
  const existingJson = localStorage.getItem(STORAGE_KEYS.FAMILY);
  if (!existingJson) return;

  try {
    const list: FamilyMember[] = JSON.parse(existingJson);
    const dummyNames = ['Anand', 'Priya', 'Meena'];
    const dummyIds = ['fam-1', 'fam-2', 'fam-3'];

    // Filter out dummy/sample family records
    const cleaned = list.filter((m) => !dummyNames.includes(m.name) && !dummyIds.includes(m.id));

    localStorage.setItem(STORAGE_KEYS.FAMILY, JSON.stringify(cleaned));
  } catch (e) {
    console.warn('Error cleaning dummy family members', e);
  }
}

seedDemoData();

export async function saveUserProfile(user: UserProfile): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'users', user.uid), user);
    } catch (e) {
      console.error('Firestore user profile save failed:', e);
    }
  }
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '{}');
  users[user.uid] = user;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
    } catch (e) {
      console.warn('Firestore user fetch failed', e);
    }
  }
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '{}');
  return users[uid] || null;
}

export async function getAllPatients(): Promise<UserProfile[]> {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'patient'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((doc) => doc.data() as UserProfile);
      }
    } catch (e) {
      console.warn('Firestore get all patients failed', e);
    }
  }
  const usersObj: Record<string, UserProfile> = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '{}');
  return Object.values(usersObj).filter((u) => u.role === 'patient');
}

export async function updateUserPatientLink(caregiverUid: string, patientId: string, patientName: string): Promise<UserProfile | null> {
  const profile = await getUserProfile(caregiverUid);
  if (!profile) return null;

  const updated: UserProfile = {
    ...profile,
    patientId,
    patientName,
  };

  await saveUserProfile(updated);
  return updated;
}

export async function saveGameResult(result: Omit<GameResult, 'id'>): Promise<GameResult> {
  const newId = 'res-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
  const fullResult: GameResult = { ...result, id: newId };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'gameResults', newId), fullResult);
    } catch (e) {
      console.warn('Firestore game result save failed', e);
    }
  }

  const results: GameResult[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESULTS) || '[]');
  results.unshift(fullResult);
  localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));

  return fullResult;
}

export async function getGameResults(userId?: string): Promise<GameResult[]> {
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'gameResults');
      const q = userId ? query(colRef, where('userId', '==', userId), orderBy('createdAt', 'desc')) : query(colRef, orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((doc) => doc.data() as GameResult);
      }
    } catch (e) {
      console.warn('Firestore game results fetch failed', e);
    }
  }

  const results: GameResult[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESULTS) || '[]');
  if (userId) {
    return results.filter((r) => r.userId === userId);
  }
  return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * STRICT PATIENT DATA ISOLATION:
 * Retrieves family members belonging ONLY to the specified patient or caregiver account.
 */
export async function getFamilyMembers(targetPatientId?: string): Promise<FamilyMember[]> {
  const patientIdToQuery = targetPatientId || 'patient-1';

  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'familyMembers');
      const q = query(colRef, where('patientId', '==', patientIdToQuery));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((doc) => doc.data() as FamilyMember);
      }
    } catch (e) {
      console.warn('Firestore family members fetch failed', e);
    }
  }

  const list: FamilyMember[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAMILY) || '[]');
  return list.filter((m) => m.patientId === patientIdToQuery || m.caregiverId === patientIdToQuery);
}

export async function saveFamilyMember(member: Omit<FamilyMember, 'id' | 'createdAt'> & { id?: string }): Promise<FamilyMember> {
  const isEdit = Boolean(member.id);
  const id = member.id || 'fam-' + Date.now();
  const fullMember: FamilyMember = {
    id,
    caregiverId: member.caregiverId,
    patientId: member.patientId || 'patient-1',
    name: member.name,
    relationship: member.relationship,
    photoUrl: member.photoUrl,
    photos: member.photos && member.photos.length > 0 ? member.photos : [member.photoUrl],
    embeddings: member.embeddings || [],
    notes: member.notes || '',
    createdAt: isEdit ? (member as FamilyMember).createdAt || new Date().toISOString() : new Date().toISOString(),
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'familyMembers', id), fullMember);
    } catch (e) {
      console.warn('Firestore family member save failed', e);
    }
  }

  const list: FamilyMember[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAMILY) || '[]');
  const idx = list.findIndex((m) => m.id === id);
  if (idx >= 0) {
    list[idx] = fullMember;
  } else {
    list.unshift(fullMember);
  }
  localStorage.setItem(STORAGE_KEYS.FAMILY, JSON.stringify(list));

  return fullMember;
}

export async function deleteFamilyMember(id: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'familyMembers', id));
    } catch (e) {
      console.warn('Firestore delete family member failed', e);
    }
  }

  const list: FamilyMember[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAMILY) || '[]');
  const filtered = list.filter((m) => m.id !== id);
  localStorage.setItem(STORAGE_KEYS.FAMILY, JSON.stringify(filtered));
}

export function compressImage(dataUrl: string, maxWidth = 600, quality = 0.75): Promise<string> {
  return new Promise((resolve) => {
    if (!dataUrl || !dataUrl.startsWith('data:image')) {
      resolve(dataUrl);
      return;
    }
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(dataUrl);
        }
      } catch (e) {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export async function uploadFamilyPhoto(fileOrDataUrl: File | string): Promise<string> {
  let dataUrl = typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '';
  if (typeof fileOrDataUrl !== 'string') {
    dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(fileOrDataUrl);
    });
  }

  // Compress photo before uploading/saving to stay well below Firestore's 1MB limit
  const compressed = await compressImage(dataUrl, 600, 0.75);

  if (isFirebaseConfigured && storage) {
    try {
      const fileRef = ref(storage, `family_photos/${Date.now()}_${Math.random().toString(36).substring(2, 6)}.jpg`);
      const uploadPromise = uploadString(fileRef, compressed, 'data_url').then(() => getDownloadURL(fileRef));
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Firebase Storage timeout')), 3500)
      );

      return await Promise.race([uploadPromise, timeoutPromise]);
    } catch (e) {
      console.warn('Firebase storage upload fallback to compressed image:', e);
    }
  }

  return compressed;
}

/* REMINDERS STORAGE API */
export async function getReminders(patientId?: string): Promise<Reminder[]> {
  const targetId = patientId || 'patient-1';
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'reminders');
      const q = query(colRef, where('patientId', '==', targetId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((doc) => doc.data() as Reminder);
      }
    } catch (e) {
      console.warn('Firestore reminders fetch failed', e);
    }
  }

  const list: Reminder[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.REMINDERS) || '[]');
  return list.filter((r) => r.patientId === targetId || r.caregiverId === targetId);
}

export async function saveReminder(reminder: Omit<Reminder, 'id' | 'createdAt'> & { id?: string }): Promise<Reminder> {
  const isEdit = Boolean(reminder.id);
  const id = reminder.id || 'rem-' + Date.now();
  const fullReminder: Reminder = {
    id,
    caregiverId: reminder.caregiverId,
    patientId: reminder.patientId || 'patient-1',
    patientName: reminder.patientName || 'Aarav Sharma',
    type: reminder.type,
    title: reminder.title,
    time: reminder.time,
    note: reminder.note || '',
    frequency: reminder.frequency || 'daily',
    deviceMode: reminder.deviceMode || 'shared',
    status: reminder.status || 'pending',
    lastTriggeredAt: reminder.lastTriggeredAt,
    completedAt: reminder.completedAt,
    createdAt: isEdit ? (reminder as Reminder).createdAt || new Date().toISOString() : new Date().toISOString(),
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'reminders', id), fullReminder);
    } catch (e) {
      console.warn('Firestore reminder save failed', e);
    }
  }

  const list: Reminder[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.REMINDERS) || '[]');
  const idx = list.findIndex((r) => r.id === id);
  if (idx >= 0) {
    list[idx] = fullReminder;
  } else {
    list.unshift(fullReminder);
  }
  localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(list));

  return fullReminder;
}

export async function deleteReminder(id: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'reminders', id));
    } catch (e) {
      console.warn('Firestore delete reminder failed', e);
    }
  }

  const list: Reminder[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.REMINDERS) || '[]');
  const filtered = list.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(filtered));
}

export async function updateReminderStatus(id: string, status: ReminderStatus, completedAt?: string): Promise<Reminder | null> {
  const reminders = await getReminders();
  const found = reminders.find((r) => r.id === id);
  if (!found) return null;

  const updated: Reminder = {
    ...found,
    status,
    completedAt: completedAt || (status === 'completed' ? new Date().toISOString() : found.completedAt),
  };

  return await saveReminder(updated);
}

/* ACTIVITY LOGS STORAGE API */
export async function getActivityLogs(patientId?: string): Promise<ActivityLogEntry[]> {
  const targetId = patientId || 'patient-1';
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'activityLogs');
      const q = query(colRef, where('patientId', '==', targetId), orderBy('timestamp', 'desc'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((doc) => doc.data() as ActivityLogEntry);
      }
    } catch (e) {
      console.warn('Firestore activity logs fetch failed', e);
    }
  }

  const list: ActivityLogEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS) || '[]');
  return list
    .filter((log) => log.patientId === targetId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function saveActivityLogEntry(entry: Omit<ActivityLogEntry, 'id' | 'timestamp'> & { timestamp?: string }): Promise<ActivityLogEntry> {
  const id = 'act-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
  const fullEntry: ActivityLogEntry = {
    id,
    patientId: entry.patientId || 'patient-1',
    patientName: entry.patientName || 'Aarav Sharma',
    eventType: entry.eventType,
    title: entry.title,
    details: entry.details,
    timestamp: entry.timestamp || new Date().toISOString(),
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'activityLogs', id), fullEntry);
    } catch (e) {
      console.warn('Firestore activity log save failed', e);
    }
  }

  const list: ActivityLogEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS) || '[]');
  list.unshift(fullEntry);
  localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(list));

  return fullEntry;
}

export async function updatePatientDeviceMode(patientId: string, deviceMode: DeviceMode): Promise<UserProfile | null> {
  const profile = await getUserProfile(patientId);
  if (!profile) return null;

  const updated: UserProfile = {
    ...profile,
    deviceMode,
  };

  await saveUserProfile(updated);
  return updated;
}
