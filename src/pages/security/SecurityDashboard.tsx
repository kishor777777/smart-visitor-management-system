import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ScanLine, 
  UserPlus, 
  Users, 
  History, 
  Search, 
  LogIn, 
  LogOut, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Radio,
  RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';
import { SystemStats, Visitor } from '../../types';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import { useLive } from '../../context/LiveContext';

export const SecurityDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { refreshTrigger } = useLive();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [recentVisitors, setRecentVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickSearch, setQuickSearch] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, visitorsData] = await Promise.all([
        api.getStats(),
        api.getVisitors(),
      ]);
      setStats(statsData);
      setRecentVisitors(visitorsData.visitors.slice(0, 6));
    } catch (err) {
      console.error('Failed to load security dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/security/visitors?search=${encodeURIComponent(quickSearch.trim())}`);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Banner with Primary Action */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6 border border-emerald-500/30">
        <div className="space-y-2 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
            <ShieldCheck size={14} />
            <span>Gate 1 • Live Campus Checkpoint</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Security Gate Management Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Scan visitor QR passes for rapid single-token Entry & Exit, register walk-in parents, and monitor active campus occupants in real-time.
          </p>
        </div>

        {/* PRIMARY ACTION: Scan QR (Prominent Large Button) */}
        <Link
          to="/security/scanner"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-emerald-500/30 transition-all transform hover:scale-105 shrink-0"
        >
          <ScanLine size={24} className="stroke-[2.5]" />
          <span>LAUNCH QR SCANNER</span>
          <ArrowRight size={18} />
        </Link>
      </div>

      {/* Main KPI Dashboard Cards (Section 15 Requirements) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Today's Visitors"
          value={stats ? stats.todayVisitors : '...'}
          subtitle="Registered for today"
          icon={Users}
          color="blue"
          onClick={() => navigate('/security/visitors')}
        />
        <StatCard
          title="Approved Visitors"
          value={stats ? stats.approvedVisitors : '...'}
          subtitle="Ready at Gate"
          icon={CheckCircle2}
          color="emerald"
          onClick={() => navigate('/security/visitors?status=APPROVED')}
        />
        <StatCard
          title="Currently Inside"
          value={stats ? stats.currentlyInside : '...'}
          subtitle="Active on campus"
          icon={LogIn}
          color="purple"
          onClick={() => navigate('/security/visitors?status=INSIDE_CAMPUS')}
        />
        <StatCard
          title="Checked Out"
          value={stats ? stats.checkedOut : '...'}
          subtitle="Completed visits"
          icon={LogOut}
          color="slate"
          onClick={() => navigate('/security/history')}
        />
        <StatCard
          title="Pending Requests"
          value={stats ? stats.pendingApprovals : '...'}
          subtitle="Awaiting Faculty"
          icon={Clock}
          color="amber"
          onClick={() => navigate('/security/visitors?status=PENDING_APPROVAL')}
        />
      </div>

      {/* Quick Security Gate Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Assisted Student Registration */}
        <Link
          to="/security/assisted-student-registration"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all flex items-start gap-4 group"
        >
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <UserPlus size={22} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Assisted Student Register</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Register walk-in external students for symposiums and events.
            </p>
          </div>
        </Link>

        {/* Assisted Parent Registration */}
        <Link
          to="/security/assisted-registration"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex items-start gap-4 group"
        >
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <Users size={22} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Assisted Parent Register</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Register parents without smartphones or those needing gate help.
            </p>
          </div>
        </Link>

        {/* Current Visitors */}
        <Link
          to="/security/visitors"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 shadow-xs hover:shadow-md transition-all flex items-start gap-4 group"
        >
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Users size={22} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Search & View Visitors</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant search by Name, Phone, Visitor ID, or College.
            </p>
          </div>
        </Link>

        {/* Visitor History */}
        <Link
          to="/security/history"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 shadow-xs hover:shadow-md transition-all flex items-start gap-4 group"
        >
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <History size={22} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Gate Access History</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Complete chronological entry and exit gate timestamps.
            </p>
          </div>
        </Link>

      </div>

      {/* Recent Gate Activity Feed */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Campus Gate Records</h3>
            <p className="text-xs text-slate-500">Live stream of incoming and outgoing visitors</p>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search visitor ID/phone..."
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-y border-slate-100">
              <tr>
                <th className="py-3 px-3">Visitor ID</th>
                <th className="py-3 px-3">Visitor Name</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Purpose / Event</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Entry Time</th>
                <th className="py-3 px-3">Exit Time</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentVisitors.map((v) => (
                <tr key={v.visitorId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-indigo-700">
                    {v.visitorId}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-900">
                    <div>{v.name}</div>
                    <div className="text-[11px] text-slate-400">{v.phone}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {v.visitorType === 'EXTERNAL_STUDENT' ? 'Student' : 'Parent'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 max-w-[200px] truncate">
                    {v.purpose}
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={v.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {v.entryTime ? new Date(v.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {v.exitTime ? new Date(v.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      to={`/visitor/pass?id=${v.visitorId}`}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      View Pass
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-2 flex justify-between items-center text-xs text-slate-400">
          <span>Showing latest visitors</span>
          <Link to="/security/visitors" className="font-semibold text-emerald-600 hover:text-emerald-700">
            View All Gate Visitors →
          </Link>
        </div>
      </div>

    </div>
  );
};
