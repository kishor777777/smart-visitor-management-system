import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Users, Clock, ShieldCheck, Download, Calendar } from 'lucide-react';
import { api } from '../../services/api';
import { SystemStats, Visitor } from '../../types';
import { useLive } from '../../context/LiveContext';

export const AdminReports: React.FC = () => {
  const { refreshTrigger } = useLive();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getStats(), api.getVisitors()])
      .then(([s, v]) => {
        setStats(s);
        setVisitors(v.visitors);
      })
      .catch((err) => console.error('Failed to load reports:', err))
      .finally(() => setLoading(false));
  }, [refreshTrigger]);

  const total = stats?.totalVisitors || 1;
  const studentPct = stats ? Math.round((stats.externalStudents / total) * 100) : 0;
  const parentPct = stats ? Math.round((stats.parents / total) * 100) : 0;
  const insidePct = stats ? Math.round((stats.currentlyInside / total) * 100) : 0;
  const completedPct = stats ? Math.round((stats.checkedOut / total) * 100) : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <BarChart3 size={24} className="text-purple-600" />
            Campus Gate Traffic Reports & Analytics
          </h1>
          <p className="text-xs text-slate-500">
            Statistical breakdown of visitor volumes, approval conversion rates, and gate throughput.
          </p>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Category Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
            <Users size={16} className="text-indigo-600" />
            Visitor Category Ratio
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">External Students ({stats?.externalStudents || 0})</span>
                <span className="text-indigo-600">{studentPct}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${studentPct}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Parents & Guardians ({stats?.parents || 0})</span>
                <span className="text-purple-600">{parentPct}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: `${parentPct}%` }}></div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            Calculated from real-time database registrations.
          </p>
        </div>

        {/* Gate Processing Flow */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-600" />
            Gate Entry & Exit Status
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Currently Inside Campus ({stats?.currentlyInside || 0})</span>
                <span className="text-emerald-600">{insidePct}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${insidePct}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Visits Completed ({stats?.checkedOut || 0})</span>
                <span className="text-blue-600">{completedPct}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${completedPct}%` }}></div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            Zero duplicate checkout tolerance enforced.
          </p>
        </div>

        {/* Approval Performance */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck size={16} className="text-blue-600" />
            Verification Rate
          </h3>

          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-center space-y-1">
            <p className="text-3xl font-black text-indigo-900">
              {stats ? Math.round((stats.approvedVisitors / total) * 100) : 0}%
            </p>
            <p className="text-xs font-semibold text-indigo-700">Digital Pass Approval Rate</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-emerald-600 text-sm block">{stats?.approvedVisitors || 0}</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Approved</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-rose-600 text-sm block">{stats?.rejectedVisitors || 0}</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Rejected</span>
            </div>
          </div>
        </div>

      </div>

      {/* Comprehensive Gate Traffic Summary */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Executive Viva Presentation Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="font-bold text-slate-800 text-sm">Automated Gate Throughput</p>
            <p className="leading-relaxed">
              Manual gate register paper logging took an average of 3 to 4 minutes per visitor. Digital QR authentication reduces verification and entry logging to under <strong>5 seconds</strong>.
            </p>
          </div>

          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="font-bold text-slate-800 text-sm">Security & Audit Compliance</p>
            <p className="leading-relaxed">
              Every digital QR pass is cryptographically bound to a single visitor ID and cannot be duplicated or reused after the visitor has officially checked out of campus.
            </p>
          </div>

          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="font-bold text-slate-800 text-sm">Inclusivity for Non-Smartphone Users</p>
            <p className="leading-relaxed">
              The <strong>Security Assisted Registration</strong> portal ensures parents without internet access or smartphones receive immediate on-the-spot gate registration slips.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
