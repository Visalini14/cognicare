import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/common/Navbar';
import { LoadingState } from '../components/common/UIComponents';
import { VoiceGuidanceBar } from '../components/common/VoiceGuidanceBar';
import { GlobalVoiceController } from '../components/common/GlobalVoiceController';
import { LanguageSelector } from '../components/common/LanguageSelector';
import { Sun, Moon, Brain } from 'lucide-react';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { SignupPage } from '../pages/auth/SignupPage';

// Patient Pages
import { PatientDashboard } from '../pages/patient/PatientDashboard';
import { PatientProgress } from '../pages/patient/PatientProgress';
import { PatientProfile } from '../pages/patient/PatientProfile';
import { MemoryMatchGame } from '../games/memory-match/MemoryMatchGame';
import { PatternRecallGame } from '../games/pattern-recall/PatternRecallGame';
import { RecognitionQuizGame } from '../games/recognition/RecognitionQuizGame';
import { FamilyRecognitionGame } from '../games/family-recognition/FamilyRecognitionGame';

// Caregiver Pages
import { CaregiverDashboard } from '../pages/caregiver/CaregiverDashboard';
import { FamilyMembersManager } from '../pages/caregiver/FamilyMembersManager';
import { PatientProgressDetail } from '../pages/caregiver/PatientProgressDetail';
import { ActivityLog } from '../pages/caregiver/ActivityLog';
import { CaregiverProfile } from '../pages/caregiver/CaregiverProfile';

const AppLayout: React.FC = () => {
  const { highContrastMode } = useAuth();
  return (
    <div className={`min-h-screen flex flex-col ${highContrastMode ? 'high-contrast' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar />
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs font-semibold text-slate-400">
        CogniCare Platform • SIH 2026 Problem Statement PS 26003 Demo Application
      </footer>
      <VoiceGuidanceBar />
      <GlobalVoiceController />
    </div>
  );
};

const PublicLayout: React.FC = () => {
  const { highContrastMode, toggleHighContrast } = useAuth();
  return (
    <div className={`min-h-screen flex flex-col ${highContrastMode ? 'high-contrast' : 'bg-slate-50 text-slate-900'}`}>
      <header className="sticky top-0 z-40 bg-white border-b-2 border-slate-200 shadow-sm px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-md">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">CogniCare</span>
              <span className="block text-[10px] uppercase font-bold text-teal-700">Cognitive Support</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector />
            <button
              onClick={toggleHighContrast}
              title="Toggle High Contrast Mode"
              className="p-2.5 rounded-2xl border-2 border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              {highContrastMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <VoiceGuidanceBar />
      <GlobalVoiceController />
    </div>
  );
};

const ProtectedRoute: React.FC<{ allowedRole?: 'patient' | 'caregiver' }> = ({ allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState message="Verifying session credentials..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'patient' ? '/patient/dashboard' : '/caregiver/dashboard'} replace />;
  }

  return <Outlet />;
};

export const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* PUBLIC AUTH ROUTES */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* PROTECTED PATIENT ROUTES */}
      <Route element={<ProtectedRoute allowedRole="patient" />}>
        <Route element={<AppLayout />}>
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/games" element={<PatientDashboard />} />
          <Route path="/patient/memory-match" element={<MemoryMatchGame onBackToDashboard={() => window.history.back()} />} />
          <Route path="/patient/pattern-recall" element={<PatternRecallGame onBackToDashboard={() => window.history.back()} />} />
          <Route path="/patient/recognition-quiz" element={<RecognitionQuizGame onBackToDashboard={() => window.history.back()} />} />
          <Route path="/patient/family-recognition" element={<FamilyRecognitionGame onBackToDashboard={() => window.history.back()} />} />
          <Route path="/patient/progress" element={<PatientProgress />} />
          <Route path="/patient/profile" element={<PatientProfile />} />
        </Route>
      </Route>

      {/* PROTECTED CAREGIVER ROUTES */}
      <Route element={<ProtectedRoute allowedRole="caregiver" />}>
        <Route element={<AppLayout />}>
          <Route path="/caregiver/dashboard" element={<CaregiverDashboard />} />
          <Route path="/caregiver/progress" element={<PatientProgressDetail />} />
          <Route path="/caregiver/family-members" element={<FamilyMembersManager />} />
          <Route path="/caregiver/activity" element={<ActivityLog />} />
          <Route path="/caregiver/profile" element={<CaregiverProfile />} />
        </Route>
      </Route>

      {/* FALLBACK ROOT ROUTE */}
      <Route
        path="*"
        element={
          user ? (
            <Navigate to={user.role === 'patient' ? '/patient/dashboard' : '/caregiver/dashboard'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};
