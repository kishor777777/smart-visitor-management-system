import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { School, Clock, CheckCircle2, Users, ArrowRight, FileCheck, Calendar, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { Visitor, SystemStats } from '../../types';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useLive } from '../../context/LiveContext';

export const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { refreshTrigger } = useLive();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [pendingRequests, setPendingRequests] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, visitorsData] = await Promise.all([
        api.getStats(),
        api.getVisitors(),
      ]);
      setStats(statsData);
      setPendingRequests(visitorsData.visitors.filter((v) => v.status === 'PENDING_APPROVAL'));
    } catch (err) {
      console.error('Failed to load faculty dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-500/30">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <School size={14} />
            <span>Faculty & Host Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome, {user?.name || 'Professor'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {user?.department || 'Department of Computer Science & Engineering'} • Manage visitor authorizations, appointments, and review parent visit applications.
          </p>
        </div>

        <Link
          to="/faculty/requests"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-600/30 shrink-0 transition-transform hover:scale-105"
        >
          <FileCheck size={18} />
          <span>REVIEW PENDING REQUESTS ({pendingRequests.length})</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Approvals"
          value={stats ? stats.pendingApprovals : '...'}
          subtitle="Awaiting your review"
          icon={Clock}
          color="amber"
          onClick={() => navigate('/faculty/requests')}
        />
        <StatCard
          title="Approved Visitors"
          value={stats ? stats.approvedVisitors : '...'}
          subtitle="QR Passes unlocked"
          icon={CheckCircle2}
          color="emerald"
          onClick={() => navigate('/faculty/requests')}
        />
        <StatCard
          title="Total Campus Visits"
          value={stats ? stats.totalVisitors : '...'}
          subtitle="Overall registered"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Parents Visiting"
          value={stats ? stats.parents : '...'}
          subtitle="Registered parents"
          icon={School}
          color="purple"
        />
      </div>

      {/* Immediate Attention List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Pending Requests Requiring Approval</h3>
            <p className="text-xs text-slate-500">Unapproved visitors cannot enter campus through the gate</p>
          </div>
          <Link
            to="/faculty/requests"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All ({pendingRequests.length})</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="py-8 text-center text-slate-400 space-y-2">
            <CheckCircle2 size={32} className="mx-auto text-emerald-500" />
            <p className="text-xs font-semibold text-slate-700">No pending visit requests at this moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.slice(0, 4).map((req) => (
              <div
                key={req.visitorId}
                className="p-5 rounded-2xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50/70 transition-colors flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-700">{req.visitorId}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        req.visitorType === 'EXTERNAL_STUDENT'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {req.visitorType === 'EXTERNAL_STUDENT' ? 'Student' : 'Parent'}
                      </span>
                    </div>
                    <StatusBadge status={req.status} size="sm" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{req.name}</h4>
                  <p className="text-xs text-slate-600">
                    {req.visitorType === 'EXTERNAL_STUDENT'
                      ? `${req.collegeName} • ${req.eventName}`
                      : `Student: ${req.studentName} (${req.department})`}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{req.purpose}</p>
                </div>

                <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Date: {req.visitDate}</span>
                  <Link
                    to="/faculty/requests"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-2xs"
                  >
                    Review & Approve
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
