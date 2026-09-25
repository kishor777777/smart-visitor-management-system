import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  QrCode, 
  UserPlus, 
  Users, 
  Search, 
  KeyRound, 
  LogOut, 
  Menu, 
  X, 
  Radio, 
  ChevronDown,
  LayoutDashboard,
  Building2,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLive } from '../context/LiveContext';
import { DemoAccountsModal } from './DemoAccountsModal';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isConnected } = useLive();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [quickSearchId, setQuickSearchId] = useState('');
  const [showPortalDropdown, setShowPortalDropdown] = useState(false);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearchId.trim()) {
      navigate(`/visitor/pass?id=${encodeURIComponent(quickSearchId.trim())}`);
      setQuickSearchId('');
      setMobileMenuOpen(false);
    }
  };

  const getPortalLink = () => {
    if (!user) return '/admin/login';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'FACULTY') return '/faculty/requests';
    if (user.role === 'SECURITY') return '/security/dashboard';
    return '/';
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Project Title */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck size={24} className="stroke-[2.2]" />
              </div>
              <div>
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 block leading-tight">
                  Smart Campus VMS
                </span>
                <span className="text-[11px] font-medium text-indigo-600 tracking-wide uppercase flex items-center gap-1">
                  <QrCode size={11} /> QR Authentication System
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/' 
                    ? 'text-indigo-600 bg-indigo-50/70' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Home
              </Link>

              <Link
                to="/student/register"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/student')
                    ? 'text-indigo-600 bg-indigo-50/70'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <UserPlus size={16} />
                Student Registration
              </Link>

              <Link
                to="/parent/register"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/parent')
                    ? 'text-indigo-600 bg-indigo-50/70'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Users size={16} />
                Parent Registration
              </Link>

              <Link
                to="/visitor/status"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/visitor')
                    ? 'text-indigo-600 bg-indigo-50/70'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <QrCode size={16} />
                QR Pass Lookup
              </Link>

              {/* Portals Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowPortalDropdown(!showPortalDropdown)}
                  onBlur={() => setTimeout(() => setShowPortalDropdown(false), 200)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-colors cursor-pointer"
                >
                  <Building2 size={16} />
                  Staff Portals
                  <ChevronDown size={14} className={`transition-transform ${showPortalDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showPortalDropdown && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <Link
                      to="/security/dashboard"
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      <ShieldCheck size={16} className="text-emerald-600" />
                      Security Gate Portal
                    </Link>
                    <Link
                      to="/faculty/requests"
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <FileCheck size={16} className="text-blue-600" />
                      Faculty Approval Portal
                    </Link>
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700"
                    >
                      <LayoutDashboard size={16} className="text-purple-600" />
                      Admin Control Center
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            {/* Right Tools & Auth */}
            <div className="hidden sm:flex items-center gap-2.5">
              
              {/* Quick ID Search */}
              <form onSubmit={handleQuickSearch} className="relative">
                <input
                  type="text"
                  placeholder="Visitor ID / Phone..."
                  value={quickSearchId}
                  onChange={(e) => setQuickSearchId(e.target.value)}
                  className="w-36 lg:w-44 pl-8 pr-3 py-1.5 text-xs bg-slate-100 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-lg outline-none transition-all"
                />
                <Search size={14} className="absolute left-2.5 top-2 text-slate-400" />
              </form>

              {/* Real-time Status Indicator */}
              <div 
                title={isConnected ? "Real-time updates active via SSE" : "Connecting to live event feed..."}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full bg-slate-100 border border-slate-200 text-slate-600"
              >
                <Radio size={12} className={isConnected ? "text-emerald-500 animate-pulse" : "text-amber-500"} />
                <span className="hidden xl:inline">{isConnected ? 'Live Sync' : 'Reconnecting'}</span>
              </div>

              {/* Demo Accounts Button */}
              <button
                onClick={() => setShowDemoModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
              >
                <KeyRound size={13} />
                <span>Demo Logins</span>
              </button>

              {/* Logged in User Badge OR Login CTA */}
              {isAuthenticated && user ? (
                <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
                  <Link
                    to={getPortalLink()}
                    className="flex items-center gap-2 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-800 transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>{user.name.split(' ')[0]}</span>
                    <span className="text-[10px] uppercase font-bold text-indigo-600 bg-white px-1.5 py-0.5 rounded shadow-2xs">
                      {user.role}
                    </span>
                  </Link>
                  <button
                    onClick={logout}
                    title="Log Out"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/admin/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs shadow-indigo-600/30 transition-all"
                >
                  Staff Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setShowDemoModal(true)}
                className="p-1.5 text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg"
                title="Demo Accounts"
              >
                <KeyRound size={16} />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3">
            <form onSubmit={handleQuickSearch} className="relative">
              <input
                type="text"
                placeholder="Search Visitor ID / Pass..."
                value={quickSearchId}
                onChange={(e) => setQuickSearchId(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 rounded-lg outline-none border border-slate-200 focus:border-indigo-500"
              />
              <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            </form>

            <div className="grid grid-cols-1 gap-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Home
              </Link>
              <Link
                to="/student/register"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
              >
                <UserPlus size={16} className="text-indigo-600" /> Student Registration
              </Link>
              <Link
                to="/parent/register"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
              >
                <Users size={16} className="text-indigo-600" /> Parent Registration
              </Link>
              <Link
                to="/visitor/status"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
              >
                <QrCode size={16} className="text-indigo-600" /> Visitor QR Pass Lookup
              </Link>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1">
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Staff Portals</p>
              <Link
                to="/security/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-emerald-700 hover:bg-emerald-50 flex items-center gap-2"
              >
                <ShieldCheck size={16} /> Security Gate Portal & Scanner
              </Link>
              <Link
                to="/faculty/requests"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-blue-700 hover:bg-blue-50 flex items-center gap-2"
              >
                <FileCheck size={16} /> Faculty Approvals
              </Link>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-purple-700 hover:bg-purple-50 flex items-center gap-2"
              >
                <LayoutDashboard size={16} /> Admin Dashboard
              </Link>
            </div>

            {isAuthenticated && user ? (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                  <p className="text-xs text-indigo-600 font-medium">{user.role}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-100">
                <Link
                  to="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full block text-center py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg"
                >
                  Staff Login
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Demo Accounts Modal */}
      <DemoAccountsModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
    </>
  );
};
