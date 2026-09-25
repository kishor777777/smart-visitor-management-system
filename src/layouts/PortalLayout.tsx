import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLive } from '../context/LiveContext';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Users, 
  History, 
  BarChart3, 
  QrCode, 
  UserPlus, 
  FileCheck, 
  LogOut, 
  Menu, 
  X, 
  Radio, 
  RefreshCw,
  Home,
  CheckCircle2,
  ScanLine
} from 'lucide-react';
import { api } from '../services/api';

interface PortalLayoutProps {
  portalRole: 'ADMIN' | 'FACULTY' | 'SECURITY';
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({ portalRole }) => {
  const { user, logout } = useAuth();
  const { isConnected, triggerRefresh } = useLive();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    if (window.confirm('Reset database back to initial sample demo data (Arun Kumar, Meena Devi, Priya Sundaram, etc.)?')) {
      try {
        setIsResetting(true);
        await api.resetDatabase();
        triggerRefresh();
        alert('Database reset successfully!');
      } catch (err: any) {
        alert('Reset failed: ' + err.message);
      } finally {
        setIsResetting(false);
      }
    }
  };

  const getNavLinks = () => {
    if (portalRole === 'SECURITY') {
      return [
        { label: 'Security Dashboard', path: '/security/dashboard', icon: LayoutDashboard },
        { label: 'QR Entry/Exit Scanner', path: '/security/scanner', icon: ScanLine, highlight: true },
        { label: 'Assisted Student Register', path: '/security/assisted-student-registration', icon: UserPlus },
        { label: 'Assisted Parent Register', path: '/security/assisted-registration', icon: Users },
        { label: 'Current Campus Visitors', path: '/security/visitors', icon: Users },
        { label: 'Gate Access History', path: '/security/history', icon: History },
      ];
    }
    if (portalRole === 'FACULTY') {
      return [
        { label: 'Faculty Dashboard', path: '/faculty/dashboard', icon: LayoutDashboard },
        { label: 'Pending Approvals', path: '/faculty/requests', icon: FileCheck, highlight: true },
      ];
    }
    // ADMIN
    return [
      { label: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'All Campus Visitors', path: '/admin/visitors', icon: Users },
      { label: 'Visitor Logs & History', path: '/admin/history', icon: History },
      { label: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
    ];
  };

  const navLinks = getNavLinks();

  const getPortalInfo = () => {
    switch (portalRole) {
      case 'SECURITY':
        return {
          title: 'Gate Security Operations',
          badge: 'Security Staff',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        };
      case 'FACULTY':
        return {
          title: 'Faculty Approval Desk',
          badge: 'Faculty Member',
          badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        };
      case 'ADMIN':
      default:
        return {
          title: 'Admin Control Center',
          badge: 'Campus Admin',
          badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
        };
    }
  };

  const portalInfo = getPortalInfo();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 text-white sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <ShieldCheck size={22} className="text-indigo-400" />
          <span className="font-bold text-sm tracking-tight">{portalInfo.title}</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-slate-900 text-slate-200 flex flex-col z-50 transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30">
              <ShieldCheck size={20} />
            </div>
            <div>
              <span className="font-bold text-sm text-white block leading-tight">Smart Campus VMS</span>
              <span className="text-[10px] text-slate-400 tracking-wider uppercase">Portal Suite</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Identity Card */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${portalInfo.badgeColor}`}>
              {portalInfo.badge}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400">
              <Radio size={10} className="animate-pulse" />
              <span>{isConnected ? 'Online' : 'Offline'}</span>
            </div>
          </div>
          <p className="font-semibold text-white text-sm mt-2 truncate">{user?.name || 'Staff User'}</p>
          <p className="text-xs text-slate-400 truncate">{user?.department || user?.badgeId || user?.username}</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : item.highlight
                    ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 hover:bg-emerald-900/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={17} className={isActive ? 'text-white' : item.highlight ? 'text-emerald-400' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </div>
                {item.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Utility Actions */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          {/* Public Home link */}
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Home size={15} />
            <span>Public Website</span>
          </Link>

          {/* Reset Demo Data Button */}
          <button
            onClick={handleReset}
            disabled={isResetting}
            title="Reset sample data for viva demo"
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-amber-300 bg-amber-950/30 border border-amber-800/40 hover:bg-amber-900/40 transition-colors cursor-pointer"
          >
            <RefreshCw size={14} className={isResetting ? 'animate-spin' : ''} />
            <span>Reset Demo Records</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <LogOut size={15} />
              <span>Sign Out</span>
            </div>
            <span className="text-[10px] text-slate-500 uppercase">{user?.username}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shadow-2xs">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{portalInfo.title}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Smart QR Campus Visitor Management System • Real-Time Synchronization
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>SSE Real-time Active</span>
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                <p className="text-[11px] text-slate-500">{user?.role} • {user?.username}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold flex items-center justify-center text-xs">
                {user?.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Portal Page Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
