import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { 
  ShieldCheck, 
  Printer, 
  Download, 
  Clock, 
  Calendar, 
  User, 
  Building, 
  ArrowLeft, 
  CheckCircle2, 
  LogIn, 
  LogOut, 
  AlertTriangle,
  RefreshCw,
  Share2
} from 'lucide-react';
import { api } from '../services/api';
import { Visitor } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { useLive } from '../context/LiveContext';

export const VisitorPass: React.FC = () => {
  const [searchParams] = useSearchParams();
  const visitorIdParam = searchParams.get('id') || 'EXT-1001';
  const { refreshTrigger } = useLive();

  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPass = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getVisitorById(visitorIdParam);
      setVisitor(data);
    } catch (err: any) {
      setError(err.message || 'Unable to locate visitor pass for ID: ' + visitorIdParam);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPass();
  }, [visitorIdParam, refreshTrigger]);

  const handlePrint = () => {
    window.print();
  };

  const formatDateTime = (isoString?: string | null) => {
    if (!isoString) return 'Not Recorded Yet';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + 
      ' (' + date.toLocaleDateString() + ')';
  };

  if (loading && !visitor) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <RefreshCw size={36} className="text-indigo-600 animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-700">Loading Smart QR Visitor Pass...</p>
      </div>
    );
  }

  if (error || !visitor) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <AlertTriangle size={28} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Pass Not Found</h2>
        <p className="text-xs text-slate-500">
          {error || 'No visitor was found matching the requested identifier.'}
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            to="/visitor/status"
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700"
          >
            Search Another ID
          </Link>
          <Link
            to="/"
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const isApproved = visitor.status === 'APPROVED' || visitor.status === 'INSIDE_CAMPUS' || visitor.status === 'CHECKED_OUT';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Top action bar (hidden during print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <Link
          to="/visitor/status"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          <span>Lookup Another Visitor</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchPass()}
            title="Refresh Status"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer"
          >
            <RefreshCw size={15} />
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs cursor-pointer transition-colors"
          >
            <Printer size={15} />
            <span>Print Pass</span>
          </button>
        </div>
      </div>

      {/* Main Printable Visitor Pass Card */}
      <div className="print-card bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Pass Top Branding */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b-4 border-indigo-500">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shrink-0">
              <ShieldCheck size={28} />
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase text-indigo-300">
                WEB-BASED SMART VISITOR MANAGEMENT SYSTEM
              </p>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
                OFFICIAL VISITOR PASS
              </h1>
              <p className="text-xs text-slate-300">
                Gate Entry & Exit Authorization Token
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right shrink-0">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Visitor Pass ID</span>
            <span className="text-lg sm:text-xl font-mono font-black text-indigo-300 bg-white/10 px-3 py-1 rounded-lg border border-white/20 inline-block mt-0.5">
              {visitor.visitorId}
            </span>
          </div>
        </div>

        {/* Pass Content Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* Left Column: QR Code & Immediate Status */}
          <div className="md:col-span-1 flex flex-col items-center text-center p-6 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-4">
            
            {isApproved ? (
              <div className="p-3 bg-white rounded-2xl border-2 border-indigo-200 shadow-sm">
                <QRCodeSVG
                  value={visitor.qrToken}
                  size={190}
                  level="H"
                  includeMargin={true}
                />
              </div>
            ) : (
              <div className="w-48 h-48 rounded-2xl bg-amber-50 border-2 border-dashed border-amber-300 flex flex-col items-center justify-center p-4 text-amber-700">
                <Clock size={36} className="mb-2" />
                <p className="font-bold text-xs">QR Code Locked</p>
                <p className="text-[11px] text-amber-600 mt-1">
                  Generated automatically upon Faculty approval.
                </p>
              </div>
            )}

            <div className="space-y-1">
              <StatusBadge status={visitor.status} size="lg" />
              <p className="text-[11px] text-slate-500 font-medium pt-1">
                {visitor.status === 'APPROVED' && 'Approved - Not Checked In'}
                {visitor.status === 'INSIDE_CAMPUS' && 'Currently Inside Campus'}
                {visitor.status === 'CHECKED_OUT' && 'Visit Completed'}
                {visitor.status === 'PENDING_APPROVAL' && 'Awaiting Faculty Verification'}
                {visitor.status === 'REJECTED' && 'Visit Request Denied'}
              </p>
            </div>

            <div className="w-full bg-indigo-50/80 border border-indigo-100 rounded-xl p-3 text-[11px] text-indigo-900 leading-snug">
              <p className="font-bold mb-0.5">Campus Gate Instruction:</p>
              <p className="text-indigo-700">"Show this QR code to Security at the campus gate."</p>
              <p className="text-[10px] text-slate-500 mt-1 italic">
                * Same QR code is scanned for both entry and exit.
              </p>
            </div>
          </div>

          {/* Right Column: Detailed Visitor Specifications */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Identity & Category */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Visitor Name</p>
                <p className="text-lg font-bold text-slate-900 mt-0.5">{visitor.name}</p>
                <p className="text-xs text-slate-500">{visitor.phone}</p>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Visitor Category</p>
                <span className={`inline-block mt-1 text-xs font-bold px-2.5 py-1 rounded-md ${
                  visitor.visitorType === 'EXTERNAL_STUDENT'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {visitor.visitorType === 'EXTERNAL_STUDENT' ? 'External Student' : 'Parent / Guardian'}
                </span>
                {visitor.securityAssisted && (
                  <span className="block text-[10px] text-amber-600 font-semibold mt-0.5">
                    (Registered by Security Staff)
                  </span>
                )}
              </div>
            </div>

            {/* Context Details (Student or Parent Specifics) */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100 text-xs">
              {visitor.visitorType === 'EXTERNAL_STUDENT' ? (
                <>
                  <div>
                    <p className="text-slate-400 font-semibold">College / University</p>
                    <p className="text-slate-800 font-medium mt-0.5">{visitor.collegeName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-semibold">Student ID / Roll No</p>
                    <p className="text-slate-800 font-medium mt-0.5">{visitor.studentId || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-slate-400 font-semibold">Event Name</p>
                    <p className="text-slate-800 font-medium mt-0.5">{visitor.eventName || 'Campus Visit'}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-slate-400 font-semibold">Student Name & ID</p>
                    <p className="text-slate-800 font-medium mt-0.5">
                      {visitor.studentName} ({visitor.studentId || 'N/A'})
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-semibold">Relationship</p>
                    <p className="text-slate-800 font-medium mt-0.5">{visitor.relationship || 'Parent'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-slate-400 font-semibold">Student Department</p>
                    <p className="text-slate-800 font-medium mt-0.5">{visitor.department || 'N/A'}</p>
                  </div>
                </>
              )}

              <div>
                <p className="text-slate-400 font-semibold">Host / Faculty</p>
                <p className="text-slate-800 font-medium mt-0.5">{visitor.hostName || 'Campus Administration'}</p>
              </div>

              <div>
                <p className="text-slate-400 font-semibold">Visit Date</p>
                <p className="text-slate-800 font-medium mt-0.5">{visitor.visitDate}</p>
              </div>

              <div className="col-span-2">
                <p className="text-slate-400 font-semibold">Purpose of Visit</p>
                <p className="text-slate-800 font-medium mt-0.5">{visitor.purpose}</p>
              </div>
            </div>

            {/* Entry & Exit Logs (Crucial Requirement) */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl shrink-0 ${visitor.entryTime ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-400'}`}>
                  <LogIn size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Campus Entry Time</p>
                  <p className="text-xs font-semibold text-slate-900 mt-0.5">
                    {formatDateTime(visitor.entryTime)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl shrink-0 ${visitor.exitTime ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-400'}`}>
                  <LogOut size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Campus Exit Time</p>
                  <p className="text-xs font-semibold text-slate-900 mt-0.5">
                    {formatDateTime(visitor.exitTime)}
                  </p>
                </div>
              </div>
            </div>

            {/* Cryptographic QR Token Verification Hash */}
            <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between border-t border-slate-100 pt-2">
              <span>Token: {visitor.qrToken}</span>
              <span>Updated: {new Date(visitor.updatedAt).toLocaleTimeString()}</span>
            </div>

          </div>

        </div>

        {/* Card Footer */}
        <div className="bg-slate-100 px-8 py-3 text-center text-[11px] text-slate-500 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>This digital pass is generated by Smart Campus VMS. Unauthorized duplication is prohibited.</span>
          <span className="font-semibold text-indigo-700">Official Campus Security Record</span>
        </div>

      </div>

    </div>
  );
};
