import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card, Button, Input } from '../../components/common/UIComponents';
import { Brain, LogIn, Sparkles, HeartHandshake, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginAsDemo } = useAuth();
  const { ui } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/patient/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoPatient = () => {
    loginAsDemo('patient');
    navigate('/patient/dashboard');
  };

  const handleDemoCaregiver = () => {
    loginAsDemo('caregiver');
    navigate('/caregiver/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center mx-auto mb-3 shadow-xl shadow-teal-600/20">
            <Brain className="w-9 h-9" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{ui.loginTitle}</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">{ui.loginSubtitle}</p>
        </div>

        <Card className="p-6 border-2 border-teal-200 bg-gradient-to-b from-teal-50/60 to-white">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <h3 className="text-sm font-extrabold text-teal-900 uppercase tracking-wider">{ui.demoModeTitle}</h3>
          </div>
          <p className="text-xs text-slate-600 font-medium mb-4 leading-relaxed">
            {ui.demoModeDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="primary" size="md" icon={User} onClick={handleDemoPatient} fullWidth>
              {ui.patientDemoBtn}
            </Button>
            <Button variant="secondary" size="md" icon={HeartHandshake} onClick={handleDemoCaregiver} fullWidth>
              {ui.caregiverDemoBtn}
            </Button>
          </div>
        </Card>

        <Card className="p-8 border border-slate-200 shadow-xl">
          <h2 className="text-xl font-bold text-slate-800 mb-6">{ui.accountLoginTitle}</h2>

          {error && <div className="p-3 mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-bold">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <Button type="submit" variant="primary" size="lg" icon={LogIn} disabled={loading} fullWidth>
              {loading ? ui.authenticating : ui.signInBtn}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-sm text-slate-500 font-medium">
            {ui.noAccount}{' '}
            <Link to="/signup" className="font-bold text-teal-600 hover:text-teal-700">
              {ui.createAccountLink}
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
