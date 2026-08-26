import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import {
  Brain,
  LogOut,
  User as UserIcon,
  Sun,
  Moon,
  Menu,
  X,
  ShieldCheck,
  HeartHandshake,
  Activity,
  Users,
  Gamepad2,
  BarChart3,
  Award,
  Home,
  Mic,
  MicOff
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, highContrastMode, toggleHighContrast } = useAuth();
  const { ui } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isPatient = user?.role === 'patient';

  // Multilingual Patient Navigation (Home, Activities, Family, My Progress)
  const patientLinks = [
    { label: ui.navHome, path: '/patient/dashboard', icon: Home },
    { label: ui.navActivities, path: '/patient/games', icon: Gamepad2 },
    { label: ui.navFamily, path: '/patient/family-recognition', icon: Users },
    { label: ui.navProgress, path: '/patient/progress', icon: Award },
  ];

  // Multilingual Caregiver Navigation
  const caregiverLinks = [
    { label: ui.navCaregiverHub, path: '/caregiver/dashboard', icon: Activity },
    { label: ui.navPatientAnalytics, path: '/caregiver/progress', icon: BarChart3 },
    { label: ui.navFamilyMembers, path: '/caregiver/family-members', icon: Users },
    { label: ui.navActivityLogs, path: '/caregiver/activity', icon: ShieldCheck },
  ];

  const navLinks = isPatient ? patientLinks : caregiverLinks;

  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(() => {
    return localStorage.getItem('cognicare_global_voice_active') === 'true';
  });

  const toggleGlobalVoice = () => {
    const next = !isVoiceActive;
    setIsVoiceActive(next);
    localStorage.setItem('cognicare_global_voice_active', String(next));
    // Trigger custom event so GlobalVoiceController picks it up instantly
    window.dispatchEvent(new Event('cognicare_voice_toggle'));
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-22">
          {/* BRAND LOGO */}
          <Link to={isPatient ? '/patient/dashboard' : '/caregiver/dashboard'} className="flex items-center gap-3 group">
            <div className="w-14 h-14 rounded-2xl bg-teal-700 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                CogniCare
              </span>
              <span className="block text-xs uppercase font-bold tracking-wider text-teal-700">
                Cognitive Support
              </span>
            </div>
          </Link>

          {/* MAIN DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-base transition-all ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-md'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* SECONDARY CONTROLS (VOICE CONTROL, LANGUAGE, PROFILE, HIGH CONTRAST & LOGOUT) */}
          <div className="hidden md:flex items-center gap-3">
            {/* VOICE CONTROL HANDS-FREE TOGGLE */}
            <button
              onClick={toggleGlobalVoice}
              title={isVoiceActive ? 'Voice Control Active (Click to Mute)' : 'Enable Hands-Free Voice Control'}
              className={`px-3.5 py-2.5 rounded-2xl border-2 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
                isVoiceActive
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-md animate-pulse'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {isVoiceActive ? <Mic className="w-4 h-4 text-white" /> : <MicOff className="w-4 h-4 text-slate-400" />}
              <span>{isVoiceActive ? 'Voice: ON' : 'Voice: OFF'}</span>
            </button>

            {/* LANGUAGE SELECTOR */}
            <LanguageSelector />

            {/* HIGH CONTRAST TOGGLE */}
            <button
              onClick={toggleHighContrast}
              title="Toggle High Contrast Mode"
              className="p-3 rounded-2xl border-2 border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors font-bold flex items-center gap-2 cursor-pointer"
            >
              {highContrastMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
              <span className="text-xs uppercase tracking-wider font-extrabold hidden lg:inline">{ui.contrast}</span>
            </button>

            {/* PROFILE LINK (SECONDARY) */}
            <Link
              to={isPatient ? '/patient/profile' : '/caregiver/profile'}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border-2 border-slate-200 px-3.5 py-2.5 rounded-2xl transition-colors"
            >
              {isPatient ? <Brain className="w-5 h-5 text-teal-700" /> : <HeartHandshake className="w-5 h-5 text-indigo-700" />}
              <div className="text-left">
                <p className="text-sm font-extrabold text-slate-900 leading-tight">{user?.name || 'User'}</p>
                <p className="text-[11px] font-bold text-slate-500 uppercase">{user?.role}</p>
              </div>
            </Link>

            {/* LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-rose-700 hover:bg-rose-50 rounded-2xl border border-rose-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              {ui.navLogout}
            </button>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSelector compact />
            <button
              onClick={toggleHighContrast}
              className="p-2.5 rounded-xl border-2 border-slate-300 text-slate-700"
            >
              {highContrastMode ? <Sun className="w-6 h-6 text-amber-500" /> : <Moon className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-3 text-slate-800 hover:bg-slate-100 rounded-2xl border-2 border-slate-200"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b-2 border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          {user && (
            <div className="p-4 rounded-2xl bg-slate-100 flex items-center justify-between">
              <span className="text-base font-extrabold text-slate-900">{user.name}</span>
              <span className="text-xs font-black uppercase bg-teal-100 text-teal-800 px-3 py-1 rounded-full">
                {user.role}
              </span>
            </div>
          )}

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-lg font-bold ${
                  isActive ? 'bg-teal-700 text-white' : 'text-slate-800 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-6 h-6" />
                {link.label}
              </Link>
            );
          })}

          <Link
            to={isPatient ? '/patient/profile' : '/caregiver/profile'}
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-5 py-4 rounded-2xl text-base font-bold text-slate-700 bg-slate-50 border border-slate-200"
          >
            <UserIcon className="w-5 h-5 text-slate-500" />
            My Account & Profile
          </Link>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleLogout();
            }}
            className="w-full flex items-center justify-center gap-2 mt-4 px-5 py-4 text-rose-700 font-extrabold bg-rose-50 border border-rose-200 rounded-2xl text-base"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
};
