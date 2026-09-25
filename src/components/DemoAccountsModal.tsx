import React from 'react';
import { X, Shield, KeyRound, UserCheck, School, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface DemoAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoAccountsModal: React.FC<DemoAccountsModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const accounts = [
    {
      role: 'ADMIN' as const,
      title: 'Administrator',
      name: 'Dr. Sarah Jenkins',
      badge: 'Campus Admin',
      username: 'admin',
      pass: 'admin123',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      btnColor: 'bg-purple-600 hover:bg-purple-700 text-white',
      icon: Shield,
      targetPath: '/admin/dashboard',
      description: 'Full oversight: view all visitors, analytics, entry/exit logs, reports & user management.',
    },
    {
      role: 'FACULTY' as const,
      title: 'Faculty / Host',
      name: 'Prof. Rajesh Sharma',
      badge: 'Dept of CSE',
      username: 'faculty',
      pass: 'faculty123',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      btnColor: 'bg-blue-600 hover:bg-blue-700 text-white',
      icon: School,
      targetPath: '/faculty/requests',
      description: 'Review pending parent visits, approve/reject requests with remarks, view visitors.',
    },
    {
      role: 'SECURITY' as const,
      title: 'Security Staff',
      name: 'Officer Vikram Singh',
      badge: 'Gate 1 Main Entry',
      username: 'security',
      pass: 'security123',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      icon: UserCheck,
      targetPath: '/security/dashboard',
      description: 'Campus gate operations: Live QR scanning for entry/exit, assisted registration, active campus search.',
    },
  ];

  const handleQuickLogin = async (acc: (typeof accounts)[0]) => {
    try {
      const res = await api.login(acc.username, acc.pass, acc.role);
      login(res.user, res.token);
      onClose();
      navigate(acc.targetPath);
    } catch (err: any) {
      alert(err.message || 'Login failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
              <KeyRound size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-lg">College Viva & Demo Accounts</h3>
              <p className="text-xs text-slate-500">Click any role to auto-authenticate and test workflows</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {accounts.map((acc) => {
            const Icon = acc.icon;
            return (
              <div
                key={acc.role}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl border ${acc.color} shrink-0`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{acc.title}</span>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${acc.color}`}>
                        {acc.badge}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-700 mt-0.5">{acc.name}</p>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm">{acc.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-600 bg-slate-100/80 px-2.5 py-1 rounded-md w-fit">
                      <span>User: <strong className="text-slate-800">{acc.username}</strong></span>
                      <span>Pass: <strong className="text-slate-800">{acc.pass}</strong></span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleQuickLogin(acc)}
                  className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg shadow-xs transition-all shrink-0 cursor-pointer ${acc.btnColor}`}
                >
                  <span>1-Click Login</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            );
          })}

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
            <Lock size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Project Demonstration Note:</p>
              <p className="mt-0.5">
                External Students and Parents do not require a permanent college login to register or download their QR pass. They can use the public portals at <code className="bg-amber-100/70 px-1 rounded">/student/register</code> and <code className="bg-amber-100/70 px-1 rounded">/parent/register</code>, or check their pass anytime with their Visitor ID.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
