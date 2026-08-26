import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, UserRole } from '../types';
import { isFirebaseConfigured, auth } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { saveUserProfile, getUserProfile, updateUserPatientLink } from '../services/storage';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string, role: UserRole, patientId?: string, patientName?: string) => Promise<void>;
  loginAsDemo: (role: UserRole) => void;
  logout: () => Promise<void>;
  linkPatient: (patientId: string, patientName: string) => Promise<void>;
  highContrastMode: boolean;
  toggleHighContrast: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [highContrastMode, setHighContrastMode] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('cognicare_active_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing stored user', e);
      }
    }

    let unsubscribe: () => void = () => {};
    if (isFirebaseConfigured && auth) {
      const currentAuth = auth;
      unsubscribe = onAuthStateChanged(currentAuth, async (firebaseUser) => {
        if (firebaseUser) {
          const profile = await getUserProfile(firebaseUser.uid);
          if (profile) {
            setUser(profile);
            localStorage.setItem('cognicare_active_user', JSON.stringify(profile));
          }
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const credential = await signInWithEmailAndPassword(auth, email, pass);
        let profile = await getUserProfile(credential.user.uid);
        if (!profile) {
          profile = {
            uid: credential.user.uid,
            name: credential.user.displayName || email.split('@')[0],
            email: credential.user.email || email,
            role: 'patient',
            createdAt: new Date().toISOString(),
          };
          await saveUserProfile(profile);
        }
        setUser(profile);
        localStorage.setItem('cognicare_active_user', JSON.stringify(profile));
      } else {
        const demoUsers = JSON.parse(localStorage.getItem('cognicare_demo_users') || '{}');
        const found = Object.values(demoUsers).find((u: any) => u.email.toLowerCase() === email.toLowerCase()) as UserProfile | undefined;
        if (found) {
          setUser(found);
          localStorage.setItem('cognicare_active_user', JSON.stringify(found));
        } else {
          throw new Error('User not found. Use Demo Login buttons for instant access or create a new account.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, pass: string, role: UserRole, patientId?: string, patientName?: string) => {
    setLoading(true);
    try {
      let uid = 'user-' + Date.now();
      if (isFirebaseConfigured && auth) {
        const credential = await createUserWithEmailAndPassword(auth, email, pass);
        uid = credential.user.uid;
      }

      const newProfile: UserProfile = {
        uid,
        name,
        email,
        role,
        patientId: role === 'caregiver' ? patientId || 'patient-1' : undefined,
        patientName: role === 'caregiver' ? patientName || 'Aarav Sharma' : undefined,
        createdAt: new Date().toISOString(),
      };

      await saveUserProfile(newProfile);
      setUser(newProfile);
      localStorage.setItem('cognicare_active_user', JSON.stringify(newProfile));
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = (role: UserRole) => {
    const demoProfile: UserProfile = role === 'patient'
      ? {
          uid: 'patient-1',
          name: 'Aarav Sharma',
          email: 'patient@cognicare.demo',
          role: 'patient',
          createdAt: new Date().toISOString(),
        }
      : {
          uid: 'caregiver-1',
          name: 'Dr. Sunita Sharma',
          email: 'caregiver@cognicare.demo',
          role: 'caregiver',
          patientId: 'patient-1',
          patientName: 'Aarav Sharma',
          createdAt: new Date().toISOString(),
        };

    setUser(demoProfile);
    localStorage.setItem('cognicare_active_user', JSON.stringify(demoProfile));
  };

  const linkPatient = async (patientId: string, patientName: string) => {
    if (!user || user.role !== 'caregiver') return;
    const updated = await updateUserPatientLink(user.uid, patientId, patientName);
    if (updated) {
      setUser(updated);
      localStorage.setItem('cognicare_active_user', JSON.stringify(updated));
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.error('Firebase sign out error', e);
      }
    }
    setUser(null);
    localStorage.removeItem('cognicare_active_user');
  };

  const toggleHighContrast = () => {
    setHighContrastMode(prev => !prev);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginAsDemo, logout, linkPatient, highContrastMode, toggleHighContrast }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
