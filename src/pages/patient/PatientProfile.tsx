import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, Button } from '../../components/common/UIComponents';
import { Mail, Shield, Calendar, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PatientProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Patient Profile</h1>
        <p className="text-slate-500 font-medium text-base">Your registered user account and role details</p>
      </div>

      <Card className="p-8 border-2 border-teal-100">
        <div className="flex items-center gap-6 mb-8 pb-6 border-b border-slate-100">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center text-3xl font-black shadow-lg">
            {user?.name.charAt(0) || 'P'}
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">{user?.name}</h2>
            <span className="inline-block px-3 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded-full uppercase mt-1">
              {user?.role} Role
            </span>
          </div>
        </div>

        <div className="space-y-4 text-slate-700">
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <Mail className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Email Address</p>
              <p className="text-base font-semibold text-slate-900">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <Shield className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Account Status</p>
              <p className="text-base font-semibold text-emerald-600">Active Patient Account</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <Calendar className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Registered Date</p>
              <p className="text-base font-semibold text-slate-900">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
          <Button variant="danger" size="md" icon={LogOut} onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
};
