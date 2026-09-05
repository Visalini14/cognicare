import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import {
  Brain,
  LogOut,
  User as UserIcon,
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
  Bell
} from 'lucide-react';
import { getReminders } from '../../services/storage';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
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

  const [pendingRemindersCount, setPendingRemindersCount] = useState<number>(0);

  const targetPatientId = isPatient ? user?.uid || 'patient-1' : user?.patientId || 'patient-1';

  useEffect(() => {
    async function loadReminderCount() {
      const list = await getReminders(targetPatientId);
      const pending = list.filter((r) => r.status !== 'completed');
      setPendingRemindersCount(pending.length);
    }
    loadReminderCount();
    const interval = setInterval(loadReminderCount, 10000);
    return () => clearInterval(interval);
  }, [targetPatientId, isPatient]);

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-22">
          {/* BRAND LOGO */}
          <Link to={isPatient ? '/patient/dashboard' : '/caregiver/dashboard'} className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl bg-teal-700 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Brain className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900">
                CogniCare
              </span>
              <span className="block text-[9px] sm:text-xs uppercase font-bold tracking-wider text-teal-700">
                Cognitive Support
              </span>
            </div>
          </Link>

          {/* MAIN DESKTOP NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 xl:px-4 py-2.5 rounded-2xl font-bold text-sm xl:text-base transition-all ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-md'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 xl:w-5 xl:h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* SECONDARY CONTROLS (REMINDERS BELL, LANGUAGE, PROFILE & LOGOUT) */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {/* REMINDERS BELL NOTIFICATION ICON WITH BADGE COUNT */}
            <Link
              to={isPatient ? '/patient/dashboard' : '/caregiver/reminders'}
              title="Reminders & Schedules"
              className="relative p-2.5 lg:p-3 rounded-2xl border-2 border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors font-bold flex items-center justify-center cursor-pointer"
            >
              <Bell className="w-5 h-5 text-slate-700" />
              {pendingRemindersCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse border-2 border-white">
                  {pendingRemindersCount}
                </span>
              )}
            </Link>

            {/* LANGUAGE SELECTOR */}
            <LanguageSelector />

            {/* PROFILE LINK (SECONDARY) */}
            <Link
              to={isPatient ? '/patient/profile' : '/caregiver/profile'}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border-2 border-slate-200 px-3 py-2 rounded-2xl transition-colors"
            >
              {isPatient ? <Brain className="w-5 h-5 text-teal-700" /> : <HeartHandshake className="w-5 h-5 text-indigo-700" />}
              <div className="text-left hidden lg:block">
                <p className="text-xs font-extrabold text-slate-900 leading-tight">{user?.name || 'User'}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">{user?.role}</p>
              </div>
            </Link>

            {/* LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 lg:px-4 lg:py-2.5 text-xs lg:text-sm font-bold text-rose-700 hover:bg-rose-50 rounded-2xl border border-rose-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:inline">{ui.navLogout}</span>
            </button>
          </div>

          {/* MOBILE / PHONE MENU TOGGLE & HEADER ACTIONS */}
          <div className="flex md:hidden items-center gap-2">
            {/* REMINDERS BELL ON MOBILE TOP BAR */}
            <Link
              to={isPatient ? '/patient/dashboard' : '/caregiver/reminders'}
              title="Reminders"
              className="relative p-2 rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center"
            >
              <Bell className="w-5 h-5 text-slate-700" />
              {pendingRemindersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {pendingRemindersCount}
                </span>
              )}
            </Link>

            <LanguageSelector compact />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-slate-800 hover:bg-slate-100 rounded-xl border-2 border-slate-200 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b-2 border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl animate-fadeIn">
          {user && (
            <div className="p-3.5 rounded-2xl bg-slate-100 flex items-center justify-between">
              <span className="text-sm font-extrabold text-slate-900">{user.name}</span>
              <span className="text-[10px] font-black uppercase bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">
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
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-bold transition-all ${
                  isActive ? 'bg-teal-700 text-white shadow-md' : 'text-slate-800 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}

          {!isPatient && (
            <Link
              to="/caregiver/reminders"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-2xl text-base font-bold text-slate-800 bg-teal-50 border border-teal-200"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-teal-700" />
                Reminders & Schedules
              </div>
              {pendingRemindersCount > 0 && (
                <span className="bg-rose-600 text-white text-xs font-black px-2 py-0.5 rounded-full">
                  {pendingRemindersCount} pending
                </span>
              )}
            </Link>
          )}

          <Link
            to={isPatient ? '/patient/profile' : '/caregiver/profile'}
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200"
          >
            <UserIcon className="w-5 h-5 text-slate-500" />
            My Account & Profile
          </Link>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleLogout();
            }}
            className="w-full flex items-center justify-center gap-2 mt-2 px-4 py-3 text-rose-700 font-extrabold bg-rose-50 border border-rose-200 rounded-2xl text-sm cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
};
