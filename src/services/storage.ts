import { isFirebaseConfigured, db } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, deleteDoc, onSnapshot, or } from 'firebase/firestore';
import type { UserProfile, GameResult, FamilyMember, Reminder, ActivityLogEntry, RecognitionLog, DeviceMode, ReminderStatus } from '../types';

const STORAGE_KEYS = {
  USERS: 'cognicare_demo_users',
  RESULTS: 'cognicare_demo_results',
  FAMILY: 'cognicare_demo_family',
  REMINDERS: 'cognicare_demo_reminders',
  ACTIVITY_LOGS: 'cognicare_demo_activity_logs',
  RECOGNITION_LOGS: 'cognicare_demo_recognition_logs',
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
        preferredLanguage: 'en-US',
        highContrastMode: false,
        voiceEnabled: true,
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      },
      'patient-2': {
        uid: 'patient-2',
        name: 'Ramesh Patel',
        email: 'ramesh@cognicare.demo',
        role: 'patient',
        deviceMode: 'shared',
        preferredLanguage: 'en-US',
        highContrastMode: false,
        voiceEnabled: true,
        createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
      },
      'patient-3': {
        uid: 'patient-3',
        name: 'Saraswati Devi',
        email: 'saraswati@cognicare.demo',
        role: 'patient',
        deviceMode: 'shared',
        preferredLanguage: 'en-US',
        highContrastMode: false,
        voiceEnabled: true,
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
        preferredLanguage: 'en-US',
        highContrastMode: false,
        voiceEnabled: true,
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

export function cleanupDummyFamilyMembers(): void {
  const existingJson = localStorage.getItem(STORAGE_KEYS.FAMILY);
  if (!existingJson) return;

  try {
    const list: FamilyMember[] = JSON.parse(existingJson);
    const dummyNames = ['Anand', 'Priya', 'Meena'];
    const dummyIds = ['fam-1', 'fam-2', 'fam-3'];
    const cleaned = list.filter((m) => !dummyNames.includes(m.name) && !dummyIds.includes(m.id));
    localStorage.setItem(STORAGE_KEYS.FAMILY, JSON.stringify(cleaned));
  } catch (e) {
    console.warn('Error cleaning dummy family members', e);
  }
}

seedDemoData();

/* USER PROFILE FIRESTORE API */
export async function saveUserProfile(user: UserProfile): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'users', user.uid), user, { merge: true });
    } catch (e) {
      console.error('Firestore user profile save failed:', e);
    }
  }
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '{}');
  users[user.uid] = user;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (isFirebaseConfigured && db && uid) {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        const rawData = snap.data();
        const isPatient = rawData.role === 'patient' || !rawData.role;
        const initialLevel = rawData.cognitiveLevel ?? (isPatient ? 1 : undefined);

        const profile: UserProfile = {
          ...(rawData as UserProfile),
          patientId: rawData.patientId || rawData.linkedPatientId,
          cognitiveLevel: initialLevel,
        };

        // If cognitiveLevel was missing on Firestore document for a patient, write cognitiveLevel: 1 immediately
        if (isPatient && rawData.cognitiveLevel === undefined) {
          try {
            await setDoc(doc(db, 'users', uid), { cognitiveLevel: 1 }, { merge: true });
            console.log(`[Firestore getUserProfile] Persisted initial cognitiveLevel: 1 to users/${uid}`);
          } catch (e) {
            console.warn('Failed to save default cognitiveLevel to Firestore', e);
          }
        }

        // Mirror locally
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '{}');
        users[uid] = profile;
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        return profile;
      }
    } catch (e) {
      console.warn('Firestore user fetch failed', e);
    }
  }
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '{}');
  const profile = users[uid] || null;
  if (profile) {
    profile.patientId = profile.patientId || (profile as any).linkedPatientId;
    if ((profile.role === 'patient' || !profile.role) && profile.cognitiveLevel === undefined) {
      profile.cognitiveLevel = 1;
    }
  }
  return profile;
}

export async function getAllPatients(): Promise<UserProfile[]> {
  const patientsMap = new Map<string, UserProfile>();

  const usersObj: Record<string, UserProfile> = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '{}');
  Object.values(usersObj).forEach((u) => {
    if (u && (u.role === 'patient' || !u.role)) {
      patientsMap.set(u.uid, u);
    }
  });

  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'users'));
      if (!snap.empty) {
        snap.docs.forEach((docSnap) => {
          const data = docSnap.data() as any;
          const uid = data.uid || docSnap.id;
          if (data.role === 'patient' || (!data.role && !uid.includes('caregiver'))) {
            patientsMap.set(uid, {
              ...data,
              uid,
              role: 'patient',
            });
          }
        });
      }
    } catch (e) {
      console.warn('Firestore get all patients failed', e);
    }
  }

  const resultList = Array.from(patientsMap.values());
  console.log(`[Firestore getAllPatients] Fetched ${resultList.length} patient profiles:`, resultList.map((p) => ({ uid: p.uid, name: p.name })));
  return resultList;
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

/* GAME RESULTS FIRESTORE API */
export async function saveGameResult(result: Omit<GameResult, 'id'>): Promise<GameResult> {
  const newId = 'res-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
  const fullResult: GameResult & { patientId?: string } = {
    ...result,
    id: newId,
    patientId: result.userId,
  };

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

  // Auto-log activity event
  await saveActivityLogEntry({
    patientId: fullResult.userId,
    patientName: fullResult.userName || 'Aarav Sharma',
    eventType: 'game_played',
    title: `Game Played: ${fullResult.gameType.replace('-', ' ')}`,
    details: `Score: ${fullResult.score} | Accuracy: ${fullResult.accuracy}% | Time: ${fullResult.responseTime}s | Level ${fullResult.difficultyLevel}`,
  });

  return fullResult;
}

export async function getGameResults(userId?: string): Promise<GameResult[]> {
  const targetId = userId || 'patient-1';
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'gameResults');
      let snap;
      try {
        const q = query(colRef, or(where('userId', '==', targetId), where('patientId', '==', targetId)));
        snap = await getDocs(q);
      } catch (e) {
        const q = query(colRef, where('userId', '==', targetId));
        snap = await getDocs(q);
      }

      if (!snap.empty) {
        const firestoreResults = snap.docs.map((doc) => doc.data() as GameResult);
        firestoreResults.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        console.log(`[Firestore getGameResults] Queried patientId/userId: "${targetId}", returned ${firestoreResults.length} documents`);
        localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(firestoreResults));
        return firestoreResults;
      } else {
        const allSnap = await getDocs(colRef);
        if (!allSnap.empty) {
          const filtered = allSnap.docs
            .map((doc) => doc.data() as GameResult)
            .filter((r) => r.userId === targetId || (r as any).patientId === targetId);
          if (filtered.length > 0) {
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            console.log(`[Firestore getGameResults Fallback] Queried patientId/userId: "${targetId}", returned ${filtered.length} documents`);
            localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(filtered));
            return filtered;
          }
        }
        console.log(`[Firestore getGameResults] Queried patientId/userId: "${targetId}", returned 0 documents`);
      }
    } catch (e) {
      console.warn('Firestore game results fetch failed', e);
    }
  }

  const results: GameResult[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESULTS) || '[]');
  const filtered = results
    .filter((r) => r.userId === targetId || (r as any).patientId === targetId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  console.log(`[LocalStorage getGameResults] Queried patientId/userId: "${targetId}", returned ${filtered.length} documents`);
  return filtered;
}

/* FAMILY MEMBERS FIRESTORE API */
export async function getFamilyMembers(targetPatientId?: string): Promise<FamilyMember[]> {
  const patientIdToQuery = targetPatientId || 'patient-1';

  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'familyMembers');
      const q = query(colRef, where('patientId', '==', patientIdToQuery));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const members = snap.docs.map((doc) => doc.data() as FamilyMember);
        localStorage.setItem(STORAGE_KEYS.FAMILY, JSON.stringify(members));
        return members;
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

export function compressImage(dataUrl: string, maxWidth = 500, quality = 0.7): Promise<string> {
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

/**
 * Compressed Base64 Photo Upload (No Firebase Storage Dependency)
 * Keeps image size well under 500KB (~35KB-50KB base64 JPEG) directly stored in Firestore document.
 */
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

  return await compressImage(dataUrl, 500, 0.7);
}

/* REMINDERS STORAGE API */
export async function getReminders(patientId?: string): Promise<Reminder[]> {
  const targetId = patientId || 'patient-1';
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'reminders');
      let snap;
      try {
        const q = query(colRef, or(where('patientId', '==', targetId), where('caregiverId', '==', targetId), where('createdBy', '==', targetId)));
        snap = await getDocs(q);
      } catch (e) {
        const q = query(colRef, where('patientId', '==', targetId));
        snap = await getDocs(q);
      }

      if (!snap.empty) {
        const reminders = snap.docs.map((doc) => doc.data() as Reminder);
        console.log(`[Firestore getReminders] Queried patientId: "${targetId}", returned ${reminders.length} documents`);
        localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
        return reminders;
      } else {
        const allSnap = await getDocs(colRef);
        if (!allSnap.empty) {
          const filtered = allSnap.docs
            .map((doc) => doc.data() as Reminder)
            .filter((r) => r.patientId === targetId || r.caregiverId === targetId || (r as any).createdBy === targetId);
          if (filtered.length > 0) {
            console.log(`[Firestore getReminders Fallback] Queried patientId: "${targetId}", returned ${filtered.length} documents`);
            localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(filtered));
            return filtered;
          }
        }
        console.log(`[Firestore getReminders] Initializing "reminders" collection in Firestore for targetId: "${targetId}"`);
        const initialReminders: Reminder[] = [
          {
            id: 'rem-' + Date.now() + '-1',
            caregiverId: 'caregiver-1',
            patientId: targetId,
            patientName: 'Aarav Sharma',
            type: 'medicine',
            title: 'Morning Medication',
            time: '09:00 AM',
            note: 'Take 1 tablet after breakfast',
            frequency: 'daily',
            deviceMode: 'shared',
            status: 'pending',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'rem-' + Date.now() + '-2',
            caregiverId: 'caregiver-1',
            patientId: targetId,
            patientName: 'Aarav Sharma',
            type: 'hydration',
            title: 'Hydration Drink',
            time: '02:00 PM',
            note: 'Drink a full glass of water',
            frequency: 'daily',
            deviceMode: 'shared',
            status: 'pending',
            createdAt: new Date().toISOString(),
          },
        ];

        for (const rem of initialReminders) {
          const fullRem = {
            ...rem,
            scheduledTime: rem.time,
            createdBy: rem.caregiverId,
            repeatFrequency: rem.frequency,
          };
          try {
            await setDoc(doc(db, 'reminders', rem.id), fullRem, { merge: true });
            console.log(`[Firestore getReminders] Seeded reminder document "${rem.id}" to "reminders" collection`);
          } catch (e) {
            console.warn('Error seeding reminder to Firestore:', e);
          }
        }
        return initialReminders;
      }
    } catch (e) {
      console.warn('Firestore reminders fetch failed', e);
    }
  }

  const list: Reminder[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.REMINDERS) || '[]');
  const filtered = list.filter((r) => r.patientId === targetId || r.caregiverId === targetId);
  console.log(`[LocalStorage getReminders] Queried patientId: "${targetId}", returned ${filtered.length} documents`);
  return filtered;
}

export async function saveReminder(reminder: Omit<Reminder, 'id' | 'createdAt'> & { id?: string }): Promise<Reminder> {
  const isEdit = Boolean(reminder.id);
  const id = reminder.id || 'rem-' + Date.now();
  const fullReminder: Reminder & { scheduledTime?: string; createdBy?: string; repeatFrequency?: string } = {
    id,
    caregiverId: reminder.caregiverId,
    createdBy: reminder.caregiverId,
    patientId: reminder.patientId || 'patient-1',
    patientName: reminder.patientName || 'Aarav Sharma',
    type: reminder.type,
    title: reminder.title,
    time: reminder.time,
    scheduledTime: reminder.time,
    note: reminder.note || '',
    frequency: reminder.frequency || 'daily',
    repeatFrequency: reminder.frequency || 'daily',
    deviceMode: reminder.deviceMode || 'shared',
    status: reminder.status || 'pending',
    lastTriggeredAt: reminder.lastTriggeredAt,
    completedAt: reminder.completedAt,
    createdAt: isEdit ? (reminder as Reminder).createdAt || new Date().toISOString() : new Date().toISOString(),
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'reminders', id), fullReminder, { merge: true });
      console.log(`[Firestore saveReminder] Successfully saved document "${id}" to "reminders" collection for patient "${fullReminder.patientId}"`);
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

export async function updateReminderStatus(id: string, status: ReminderStatus, completedAt?: string, patientId?: string): Promise<Reminder | null> {
  const list: Reminder[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.REMINDERS) || '[]');
  let found = list.find((r) => r.id === id);

  if (!found) {
    const reminders = await getReminders(patientId);
    found = reminders.find((r) => r.id === id);
  }

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
      let snap;
      try {
        const q = query(colRef, or(where('patientId', '==', targetId), where('userId', '==', targetId)));
        snap = await getDocs(q);
      } catch (e) {
        const q = query(colRef, where('patientId', '==', targetId));
        snap = await getDocs(q);
      }

      if (!snap.empty) {
        const logs = snap.docs.map((doc) => doc.data() as ActivityLogEntry);
        logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        console.log(`[Firestore getActivityLogs] Queried patientId: "${targetId}", returned ${logs.length} documents`);
        localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(logs));
        return logs;
      } else {
        const allSnap = await getDocs(colRef);
        if (!allSnap.empty) {
          const filtered = allSnap.docs
            .map((doc) => doc.data() as ActivityLogEntry)
            .filter((l) => l.patientId === targetId || (l as any).userId === targetId);
          if (filtered.length > 0) {
            filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            console.log(`[Firestore getActivityLogs Fallback] Queried patientId: "${targetId}", returned ${filtered.length} documents`);
            localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(filtered));
            return filtered;
          }
        }
        console.log(`[Firestore getActivityLogs] Queried patientId: "${targetId}", returned 0 documents`);
      }
    } catch (e) {
      console.warn('Firestore activity logs fetch failed', e);
    }
  }

  const list: ActivityLogEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS) || '[]');
  const filtered = list
    .filter((log) => log.patientId === targetId || (log as any).userId === targetId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  console.log(`[LocalStorage getActivityLogs] Queried patientId: "${targetId}", returned ${filtered.length} documents`);
  return filtered;
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

/* RECOGNITION LOGS STORAGE API */
export async function saveRecognitionLog(log: Omit<RecognitionLog, 'id' | 'timestamp'>): Promise<RecognitionLog> {
  const id = 'rec-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
  const fullLog: RecognitionLog = {
    id,
    patientId: log.patientId || 'patient-1',
    patientName: log.patientName || 'Aarav Sharma',
    matchedMemberId: log.matchedMemberId || null,
    matchedMemberName: log.matchedMemberName || 'Unknown',
    confidenceScore: log.confidenceScore,
    gameType: log.gameType,
    timestamp: new Date().toISOString(),
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'recognitionLogs', id), fullLog);
    } catch (e) {
      console.warn('Firestore recognition log save failed', e);
    }
  }

  const list: RecognitionLog[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECOGNITION_LOGS) || '[]');
  list.unshift(fullLog);
  localStorage.setItem(STORAGE_KEYS.RECOGNITION_LOGS, JSON.stringify(list));

  return fullLog;
}

export async function getRecognitionLogs(patientId?: string): Promise<RecognitionLog[]> {
  const targetId = patientId || 'patient-1';
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'recognitionLogs');
      const q = query(colRef, where('patientId', '==', targetId), orderBy('timestamp', 'desc'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((doc) => doc.data() as RecognitionLog);
      }
    } catch (e) {
      console.warn('Firestore recognition logs fetch failed', e);
    }
  }

  const list: RecognitionLog[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECOGNITION_LOGS) || '[]');
  return list.filter((r) => r.patientId === targetId);
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

/* REAL-TIME FIRESTORE SUBSCRIPTIONS (onSnapshot) */

export function subscribeToReminders(patientId: string, callback: (reminders: Reminder[]) => void): () => void {
  const targetId = patientId || 'patient-1';
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'reminders');
      let q;
      try {
        q = query(colRef, or(where('patientId', '==', targetId), where('caregiverId', '==', targetId), where('createdBy', '==', targetId)));
      } catch (e) {
        q = query(colRef, where('patientId', '==', targetId));
      }
      return onSnapshot(q, (snap) => {
        const list = snap.docs.map((doc) => doc.data() as Reminder);
        console.log(`[Firestore subscribeToReminders] Live snapshot update for patientId: "${targetId}", received ${list.length} documents from "reminders" collection`);
        localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(list));
        callback(list);
      }, (err) => {
        console.warn('Firestore reminders snapshot warning:', err);
      });
    } catch (e) {
      console.warn('Firestore reminders subscription failed:', e);
    }
  }
  return () => {};
}

export function subscribeToActivityLogs(patientId: string, callback: (logs: ActivityLogEntry[]) => void): () => void {
  const targetId = patientId || 'patient-1';
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'activityLogs');
      let q;
      try {
        q = query(colRef, or(where('patientId', '==', targetId), where('userId', '==', targetId)));
      } catch (e) {
        q = query(colRef, where('patientId', '==', targetId));
      }
      return onSnapshot(q, (snap) => {
        const list = snap.docs.map((doc) => doc.data() as ActivityLogEntry);
        list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        console.log(`[Firestore subscribeToActivityLogs] Live update for patientId: "${targetId}", received ${list.length} documents`);
        localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(list));
        callback(list);
      }, (err) => {
        console.warn('Firestore activityLogs snapshot warning:', err);
      });
    } catch (e) {
      console.warn('Firestore activityLogs subscription failed:', e);
    }
  }
  return () => {};
}

export function subscribeToGameResults(patientId: string, callback: (results: GameResult[]) => void): () => void {
  const targetId = patientId || 'patient-1';
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'gameResults');
      let q;
      try {
        q = query(colRef, or(where('userId', '==', targetId), where('patientId', '==', targetId)));
      } catch (e) {
        q = query(colRef, where('userId', '==', targetId));
      }
      return onSnapshot(q, (snap) => {
        const list = snap.docs.map((doc) => doc.data() as GameResult);
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        console.log(`[Firestore subscribeToGameResults] Live update for patientId/userId: "${targetId}", received ${list.length} documents`);
        localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(list));
        callback(list);
      }, (err) => {
        console.warn('Firestore gameResults snapshot warning:', err);
      });
    } catch (e) {
      console.warn('Firestore gameResults subscription failed:', e);
    }
  }
  return () => {};
}

export function subscribeToFamilyMembers(patientId: string, callback: (members: FamilyMember[]) => void): () => void {
  const targetId = patientId || 'patient-1';
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'familyMembers');
      const q = query(colRef, where('patientId', '==', targetId));
      return onSnapshot(q, (snap) => {
        const list = snap.docs.map((doc) => doc.data() as FamilyMember);
        localStorage.setItem(STORAGE_KEYS.FAMILY, JSON.stringify(list));
        callback(list);
      }, (err) => {
        console.warn('Firestore familyMembers snapshot warning:', err);
      });
    } catch (e) {
      console.warn('Firestore familyMembers subscription failed:', e);
    }
  }
  return () => {};
}

export function subscribeToUserProfile(uid: string, callback: (profile: UserProfile | null) => void): () => void {
  if (isFirebaseConfigured && db && uid) {
    try {
      const docRef = doc(db, 'users', uid);
      return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const profile = docSnap.data() as UserProfile;
          localStorage.setItem('cognicare_active_user', JSON.stringify(profile));
          callback(profile);
        }
      }, (err) => {
        console.warn('Firestore userProfile snapshot warning:', err);
      });
    } catch (e) {
      console.warn('Firestore userProfile subscription failed:', e);
    }
  }
  return () => {};
}
