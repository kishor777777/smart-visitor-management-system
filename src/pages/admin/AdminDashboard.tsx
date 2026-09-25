import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  LogIn, 
  LogOut, 
  Clock, 
  CheckCircle2, 
  GraduationCap, 
  School, 
  ShieldAlert, 
  ArrowRight, 
  RefreshCw, 
  BarChart3, 
  Radio
} from 'lucide-react';
import { api } from '../../services/api';
import { SystemStats, Visitor } from '../../types';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import { useLive } from '../../context/LiveContext';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { refreshTrigger } = useLive();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, visitorsData] = await Promise.all([
        api.getStats(),
        api.getVisitors(),
      ]);
      setStats(statsData);
      setVisitors(visitorsData.visitors);
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const currentlyInsideList = visitors.filter((v) => v.status === 'INSIDE_CAMPUS');
  const pendingApprovalsList = visitors.filter((v) => v.status === 'PENDING_APPROVAL');
  const recentEntriesList = visitors.filter((v) => v.entryTime).slice(0, 5);
  const recentExitsList = visitors.filter((v) => v.exitTime).slice(0, 5);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Campus Visitor Oversight Dashboard</h1>
          <p className="text-xs text-slate-500">
            Real-time campus occupancy, digital authorization, and gate throughput analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Real-time Metrics</span>
          </button>
        </div>
      </div>

      {/* KPI Cards: Section 16 Strict Specifications */}
      {/* 8 Specific Required Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Visitors"
          value={stats ? stats.totalVisitors : '...'}
          subtitle="Cumulative registrations"
          icon={Users}
          color="indigo"
          onClick={() => navigate('/admin/visitors')}
        />
        <StatCard
          title="Today's Visitors"
          value={stats ? stats.todayVisitors : '...'}
          subtitle="Scheduled for today"
          icon={Clock}
          color="blue"
          onClick={() => navigate('/admin/visitors')}
        />
        <StatCard
          title="Pending Approvals"
          value={stats ? stats.pendingApprovals : '...'}
          subtitle="Awaiting Faculty review"
          icon={Clock}
          color="amber"
          onClick={() => navigate('/admin/visitors?status=PENDING_APPROVAL')}
        />
        <StatCard
          title="Approved Visitors"
          value={stats ? stats.approvedVisitors : '...'}
          subtitle="QR Pass Issued"
          icon={CheckCircle2}
          color="emerald"
          onClick={() => navigate('/admin/visitors?status=APPROVED')}
        />
        <StatCard
          title="Currently Inside Campus"
          value={stats ? stats.currentlyInside : '...'}
          subtitle="Active on grounds"
          icon={LogIn}
          color="purple"
          onClick={() => navigate('/admin/visitors?status=INSIDE_CAMPUS')}
        />
        <StatCard
          title="Checked Out"
          value={stats ? stats.checkedOut : '...'}
          subtitle="Exited campus"
          icon={LogOut}
          color="slate"
          onClick={() => navigate('/admin/history')}
        />
        <StatCard
          title="External Students"
          value={stats ? stats.externalStudents : '...'}
          subtitle="Events & Symposiums"
          icon={GraduationCap}
          color="blue"
          onClick={() => navigate('/admin/visitors?type=EXTERNAL_STUDENT')}
        />
        <StatCard
          title="Parents Visiting"
          value={stats ? stats.parents : '...'}
          subtitle="Meetings & Guardians"
          icon={School}
          color="amber"
          onClick={() => navigate('/admin/visitors?type=PARENT')}
        />
      </div>

      {/* Grid: Currently Inside Campus & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Currently Inside Campus */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                Currently Inside Campus ({currentlyInsideList.length})
              </h3>
            </div>
            <Link to="/admin/visitors?status=INSIDE_CAMPUS" className="text-xs text-indigo-600 font-bold hover:underline">
              View All
            </Link>
          </div>

          {currentlyInsideList.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No visitors currently registered inside the campus.
            </div>
          ) : (
            <div className="space-y-2.5">
              {currentlyInsideList.map((v) => (
                <div
                  key={v.visitorId}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{v.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">({v.visitorId})</span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Host: {v.hostName} • {v.visitorType === 'EXTERNAL_STUDENT' ? v.collegeName : `Parent of ${v.studentName}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-700 font-bold flex items-center gap-1 justify-end">
                      <LogIn size={12} />
                      {v.entryTime ? new Date(v.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Inside'}
                    </span>
                    <span className="text-[10px] text-slate-400">Entry time</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-amber-500" />
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                Pending Approvals ({pendingApprovalsList.length})
              </h3>
            </div>
            <Link to="/faculty/requests" className="text-xs text-indigo-600 font-bold hover:underline">
              Review
            </Link>
          </div>

          {pendingApprovalsList.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No pending visitor requests awaiting approval.
            </div>
          ) : (
            <div className="space-y-2.5">
              {pendingApprovalsList.map((v) => (
                <div
                  key={v.visitorId}
                  className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/70 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{v.name}</span>
                      <span className="text-[10px] text-amber-800 font-mono">({v.visitorId})</span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Student: {v.studentName} ({v.department})
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      Awaiting Host
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Date: {v.visitDate}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Grid: Recent Entries and Recent Exits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Gate Entries */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <LogIn size={16} className="text-emerald-600" />
            Recent Gate Entries
          </h3>

          <div className="space-y-2 text-xs">
            {recentEntriesList.length === 0 ? (
              <p className="text-slate-400 py-4 text-center">No entry records yet.</p>
            ) : (
              recentEntriesList.map((v) => (
                <div key={v.visitorId} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="font-bold text-slate-800">{v.name}</p>
                    <p className="text-[11px] text-slate-400">{v.visitorType === 'EXTERNAL_STUDENT' ? v.collegeName : 'Parent'} • {v.visitorId}</p>
                  </div>
                  <span className="text-emerald-700 font-semibold">
                    {new Date(v.entryTime!).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Gate Exits */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <LogOut size={16} className="text-blue-600" />
            Recent Gate Exits
          </h3>

          <div className="space-y-2 text-xs">
            {recentExitsList.length === 0 ? (
              <p className="text-slate-400 py-4 text-center">No exit records yet.</p>
            ) : (
              recentExitsList.map((v) => (
                <div key={v.visitorId} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="font-bold text-slate-800">{v.name}</p>
                    <p className="text-[11px] text-slate-400">{v.visitorType === 'EXTERNAL_STUDENT' ? v.collegeName : 'Parent'} • {v.visitorId}</p>
                  </div>
                  <span className="text-blue-700 font-semibold">
                    {new Date(v.exitTime!).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
