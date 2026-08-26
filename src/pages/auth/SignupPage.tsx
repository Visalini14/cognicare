import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getAllPatients } from '../../services/storage';
import { Card, Button, Input, Select } from '../../components/common/UIComponents';
import { Brain, UserPlus, User, HeartHandshake, ShieldCheck } from 'lucide-react';
import type { UserRole, UserProfile } from '../../types';

export const SignupPage: React.FC = () => {
  const { signup } = useAuth();
  const { ui } = useLanguage();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('patient');

  // Patient Ward selection for Caregivers
  const [patients, setPatients] = useState<UserProfile[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadPatients() {
      const list = await getAllPatients();
      setPatients(list);
      if (list.length > 0) {
        setSelectedPatientId(list[0].uid);
      }
    }
    loadPatients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (role === 'caregiver' && !selectedPatientId) {
      setError('Caregivers must assign a registered Patient Ward to manage.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const selectedPatientObj = patients.find(p => p.uid === selectedPatientId);
      const patientName = selectedPatientObj ? selectedPatientObj.name : 'Aarav Sharma';

      await signup(name, email, password, role, selectedPatientId, patientName);

      if (role === 'patient') {
        navigate('/patient/dashboard');
      } else {
        navigate('/caregiver/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const patientOptions = patients.map(p => ({
    value: p.uid,
    label: `${p.name} (${p.email})`,
  }));

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center mx-auto mb-3 shadow-xl shadow-teal-600/20">
            <Brain className="w-9 h-9" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{ui.signupTitle}</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">{ui.loginSubtitle}</p>
        </div>

        <Card className="p-8 border border-slate-200 shadow-xl">
          {error && <div className="p-3 mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-bold">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={ui.nameLabel}
              placeholder={ui.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label={ui.emailLabel}
              type="email"
              placeholder={ui.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label={ui.passwordLabel}
              type="password"
              placeholder={ui.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* ROLE SELECTION */}
            <div className="w-full mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">{ui.roleLabel}</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('patient')}
                  className={`p-4 rounded-2xl border-2 font-bold text-sm flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    role === 'patient'
                      ? 'border-teal-500 bg-teal-50 text-teal-900 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <User className="w-6 h-6 text-teal-600" />
                  {ui.patientRole}
                </button>

                <button
                  type="button"
                  onClick={() => setRole('caregiver')}
                  className={`p-4 rounded-2xl border-2 font-bold text-sm flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    role === 'caregiver'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-900 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <HeartHandshake className="w-6 h-6 text-indigo-600" />
                  {ui.caregiverRole}
                </button>
              </div>
            </div>

            {/* CAREGIVER PATIENT WARD SELECTION */}
            {role === 'caregiver' && (
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wide">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" /> {ui.linkedPatientLabel}
                </div>
                <p className="text-xs text-slate-600">
                  Select which registered patient you will be supervising.
                </p>
                {patients.length > 0 ? (
                  <Select
                    label={ui.linkedPatientLabel}
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    options={patientOptions}
                  />
                ) : (
                  <div className="p-3 bg-amber-50 text-amber-900 rounded-xl text-xs font-bold border border-amber-200">
                    Defaulting to demo patient account: Aarav Sharma
                  </div>
                )}
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" icon={UserPlus} disabled={loading} fullWidth>
              {loading ? ui.authenticating : ui.signUpBtn}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-sm text-slate-500 font-medium">
            {ui.alreadyAccount}{' '}
            <Link to="/login" className="font-bold text-teal-600 hover:text-teal-700">
              {ui.loginLink}
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
