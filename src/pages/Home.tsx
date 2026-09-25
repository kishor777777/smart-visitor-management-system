import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  QrCode, 
  UserPlus, 
  Users, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  School, 
  UserCheck, 
  LayoutDashboard, 
  Clock, 
  LogIn, 
  LogOut, 
  Sparkles,
  HelpCircle,
  FileCheck2,
  CalendarCheck,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { SystemStats } from '../types';
import { useLive } from '../context/LiveContext';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { refreshTrigger } = useLive();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    api.getStats()
      .then(setStats)
      .catch((err) => console.error('Failed to load stats:', err));
  }, [refreshTrigger]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    navigate(`/visitor/pass?id=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-900 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Subtle decorative background grids */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold backdrop-blur-xs">
            <Sparkles size={14} className="text-amber-400" />
            <span>Campus Digital Transformation Project</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Web-Based Smart Visitor Management System <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              with QR Authentication
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            "Secure, simple and smart visitor registration and campus entry management."
          </p>

          {/* Quick Pass Search Box */}
          <div className="max-w-xl mx-auto pt-2">
            <form onSubmit={handleSearch} className="flex items-center bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-xl">
              <div className="pl-3 text-slate-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Enter Visitor ID (e.g. EXT-1001 or Phone)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shrink-0 shadow-md cursor-pointer"
              >
                <span>Find Pass</span>
                <ArrowRight size={14} />
              </button>
            </form>
            <p className="text-xs text-slate-400 mt-2 text-center">
              Quickly view or print your digital pass before arriving at the campus gate.
            </p>
          </div>

          {/* Main Action CTAs */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/student/register"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
            >
              <UserPlus size={18} />
              Student Registration
            </Link>

            <Link
              to="/parent/register"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <Users size={18} className="text-indigo-600" />
              Parent Registration
            </Link>

            <Link
              to="/security/login"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white font-semibold text-sm border border-emerald-400/30 shadow-lg transition-all"
            >
              <UserCheck size={18} />
              Security Login
            </Link>

            <Link
              to="/faculty/login"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-blue-600/90 hover:bg-blue-600 text-white font-semibold text-sm border border-blue-400/30 shadow-lg transition-all"
            >
              <School size={18} />
              Faculty Login
            </Link>

            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-purple-600/90 hover:bg-purple-600 text-white font-semibold text-sm border border-purple-400/30 shadow-lg transition-all"
            >
              <LayoutDashboard size={18} />
              Admin Login
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          {stats && (
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xs">
                <p className="text-2xl font-extrabold text-white">{stats.totalVisitors}</p>
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Total Visitors</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xs">
                <p className="text-2xl font-extrabold text-emerald-400">{stats.currentlyInside}</p>
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Inside Campus Now</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xs">
                <p className="text-2xl font-extrabold text-blue-400">{stats.checkedOut}</p>
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Visits Completed</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xs">
                <p className="text-2xl font-extrabold text-amber-400">{stats.pendingApprovals}</p>
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Pending Approvals</p>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Simple 5-Step Workflow</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">How It Works</h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            From pre-arrival registration to seamless entry and exit with a single cryptographic QR visitor pass.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 font-extrabold flex items-center justify-center text-lg mb-4">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Register</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              External students register online before events. Parents register directly or via Security assistance.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 font-extrabold flex items-center justify-center text-lg mb-4">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Get QR Pass</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upon approval, the system generates a unique QR Visitor Pass accessible on phone or printable.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 font-extrabold flex items-center justify-center text-lg mb-4">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Scan at Entry</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Security scans the QR at the gate. Entry timestamp is recorded; status becomes <strong>Inside Campus</strong>.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 font-extrabold flex items-center justify-center text-lg mb-4">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Visit Campus</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Visitor attends symposiums, workshops, meets faculty, or participates in competitions safely.
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 font-extrabold flex items-center justify-center text-lg mb-4">
              5
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Scan Same QR at Exit</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Security scans the <strong>exact same QR</strong>. Exit timestamp is recorded; status updates to <strong>Checked Out</strong>.
            </p>
          </div>

        </div>
      </section>

      {/* Main Visitor Categories & Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* External Student Card */}
          <div className="bg-gradient-to-br from-indigo-50/70 to-white rounded-2xl p-8 border border-indigo-100 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                <UserPlus size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">External Students</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Visiting for Symposiums, Workshops, Seminars, Hackathons, Technical & Cultural events, and Competitions.
              </p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  Pre-event online registration before arrival
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  Instant verified QR Visitor Pass generation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  Fast-track gate entry in under 5 seconds
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <Link
                to="/student/register"
                className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 group"
              >
                <span>Register as External Student</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Parents Card */}
          <div className="bg-gradient-to-br from-blue-50/70 to-white rounded-2xl p-8 border border-blue-100 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Parents & Guardians</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Visiting campus to meet Faculty, Academic Mentors, HODs, or Hostel Wardens with assisted gate options.
              </p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  Register online from home or smartphone
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <strong>Security Assisted Registration</strong> at gate if parent has no phone
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  Faculty approval workflow with status tracking
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <Link
                to="/parent/register"
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 group"
              >
                <span>Register as Parent</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Core QR Logic Highlight Box (Section 4 & 5) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-3xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-400/30">
              Core Technical Architecture
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              One Visitor = One Unique QR Code for Both Entry and Exit
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Unlike legacy badge printers that waste paper or require secondary exit tokens, our system uses intelligent state machine logic on the backend:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <LogIn size={16} /> 1st Gate Scan
                </div>
                <p className="text-sm font-semibold mt-1">APPROVED → INSIDE</p>
                <p className="text-[11px] text-slate-400 mt-1">Records entry timestamp; allows gate passage.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                  <LogOut size={16} /> 2nd Scan (Same QR)
                </div>
                <p className="text-sm font-semibold mt-1">INSIDE → CHECKED OUT</p>
                <p className="text-[11px] text-slate-400 mt-1">Records exit timestamp; marks visit complete.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                  <ShieldCheck size={16} /> 3rd Scan (Duplicate)
                </div>
                <p className="text-sm font-semibold mt-1">ALREADY CHECKED OUT</p>
                <p className="text-[11px] text-slate-400 mt-1">Prevents duplicate exit logs & unauthorized reuse.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Staff Portals Access Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Role-Based Access</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Campus Staff Portals</h2>
          <p className="text-sm text-slate-500">
            Dedicated secure panels for Campus Security, Faculty members, and System Administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Security Staff */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <UserCheck size={20} />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Security Staff</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Equipped with live device camera QR scanner, assisted parent registration, search, and real-time gate entry/exit management.
            </p>
            <Link
              to="/security/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              <span>Security Portal</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Faculty */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <School size={20} />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Faculty / Host</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              View pending parent requests, approve or reject visits with custom remarks, and monitor upcoming visitor appointments.
            </p>
            <Link
              to="/faculty/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              <span>Faculty Portal</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Admin */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
              <LayoutDashboard size={20} />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Campus Admin</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Master control panel with real-time statistics, search and multi-parameter filters, comprehensive history, and analytical reports.
            </p>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700"
            >
              <span>Admin Portal</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};
