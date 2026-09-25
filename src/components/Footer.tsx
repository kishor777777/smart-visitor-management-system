import React from 'react';
import { ShieldCheck, QrCode, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-600 text-white">
                <ShieldCheck size={22} />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Web-Based Smart Visitor Management System
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Secure, simple, and smart visitor registration and campus entry management with Single-QR Entry & Exit Authentication. Designed for College Final-Year Project Demonstration & Real-Time Campus Gate Security.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                <CheckCircle2 size={13} className="text-emerald-400" /> 1 Visitor = 1 Unique QR
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                <CheckCircle2 size={13} className="text-indigo-400" /> Real-time Gate Sync
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                <Sparkles size={13} className="text-amber-400" /> Zero Duplicate Exits
              </span>
            </div>
          </div>

          {/* Visitor Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Visitor Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/student/register" className="hover:text-indigo-400 transition-colors">
                  External Student Registration
                </Link>
              </li>
              <li>
                <Link to="/parent/register" className="hover:text-indigo-400 transition-colors">
                  Parent Visit Registration
                </Link>
              </li>
              <li>
                <Link to="/visitor/status" className="hover:text-indigo-400 transition-colors">
                  Check Visitor Status & Pass
                </Link>
              </li>
              <li>
                <Link to="/visitor/pass?id=EXT-1001" className="hover:text-indigo-400 transition-colors">
                  Sample Student Pass (Arun Kumar)
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Staff Portals</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/security/login" className="hover:text-emerald-400 transition-colors">
                  Security Gate Scanner & Logs
                </Link>
              </li>
              <li>
                <Link to="/faculty/login" className="hover:text-blue-400 transition-colors">
                  Faculty Approval Desk
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-purple-400 transition-colors">
                  Admin Master Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/reports" className="hover:text-purple-400 transition-colors">
                  Campus Traffic Reports & Analytics
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Smart Visitor Management System with QR Authentication. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <QrCode size={13} className="text-indigo-400" /> React + TypeScript + Express + Vite
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
