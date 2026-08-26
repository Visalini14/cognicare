import { isFirebaseConfigured, db, storage } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import type { UserProfile, GameResult, FamilyMember } from '../types';

const STORAGE_KEYS = {
  USERS: 'cognicare_demo_users',
  RESULTS: 'cognicare_demo_results',
  FAMILY: 'cognicare_demo_family',
};

export function seedDemoData() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const demoUsers: Record<string, UserProfile> = {
      'patient-1': {
        uid: 'patient-1',
        name: 'Aarav Sharma',
        email: 'patient@cognicare.demo',
        role: 'patient',
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      },
      'patient-2': {
        uid: 'patient-2',
        name: 'Ramesh Patel',
        email: 'ramesh@cognicare.demo',
        role: 'patient',
        createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
      },
      'patient-3': {
        uid: 'patient-3',
        name: 'Saraswati Devi',
        email: 'saraswati@cognicare.demo',
        role: 'patient',
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      },
      'caregiver-1': {
        uid: 'caregiver-1',
        name: 'Dr. Sunita Sharma',
        email: 'caregiver@cognicare.demo',
        role: 'caregiver',
        patientId: 'patient-1',
        patientName: 'Aarav Sharma',
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      },
    };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(demoUsers));
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
    await setDoc(doc(db, 'users', user.uid), user);
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

export async function uploadFamilyPhoto(fileOrDataUrl: File | string): Promise<string> {
  if (typeof fileOrDataUrl === 'string') {
    if (isFirebaseConfigured && storage) {
      try {
        const fileRef = ref(storage, `family_photos/${Date.now()}.jpg`);
        await uploadString(fileRef, fileOrDataUrl, 'data_url');
        return await getDownloadURL(fileRef);
      } catch (e) {
        console.warn('Firebase storage upload failed', e);
      }
    }
    return fileOrDataUrl;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      if (isFirebaseConfigured && storage) {
        try {
          const fileRef = ref(storage, `family_photos/${Date.now()}_${fileOrDataUrl.name}`);
          await uploadString(fileRef, dataUrl, 'data_url');
          const downloadUrl = await getDownloadURL(fileRef);
          resolve(downloadUrl);
          return;
        } catch (e) {
          console.warn('Firebase storage upload failed', e);
        }
      }
      resolve(dataUrl);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(fileOrDataUrl);
  });
}
