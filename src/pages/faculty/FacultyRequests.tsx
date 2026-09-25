import React, { useEffect, useState } from 'react';
import { 
  FileCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Phone, 
  School, 
  Calendar, 
  QrCode, 
  RefreshCw,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';
import { Visitor } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useLive } from '../../context/LiveContext';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';

export const FacultyRequests: React.FC = () => {
  const { user } = useAuth();
  const { refreshTrigger, triggerRefresh } = useLive();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'PROCESSED'>('PENDING');

  // Remarks state for modal / inline approval
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [remarks, setRemarks] = useState('');
  const [actionType, setActionType] = useState<'APPROVED' | 'REJECTED' | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await api.getVisitors();
      setVisitors(data.visitors);
    } catch (err) {
      console.error('Failed to fetch faculty requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [refreshTrigger]);

  const handleOpenActionModal = (visitor: Visitor, type: 'APPROVED' | 'REJECTED') => {
    setSelectedVisitor(visitor);
    setActionType(type);
    setRemarks(type === 'APPROVED' ? 'Approved by Department Faculty' : 'Rejected: Schedule conflict');
  };

  const handleConfirmDecision = async () => {
    if (!selectedVisitor || !actionType) return;
    setProcessingId(selectedVisitor.visitorId);

    try {
      await api.updateApproval(
        selectedVisitor.visitorId,
        actionType,
        user?.name || 'Department Faculty',
        remarks
      );
      triggerRefresh();
      if (actionType === 'APPROVED') {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      }
      setSelectedVisitor(null);
      setActionType(null);
      setRemarks('');
    } catch (err: any) {
      alert('Error updating approval: ' + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const pendingRequests = visitors.filter((v) => v.status === 'PENDING_APPROVAL');
  const processedRequests = visitors.filter((v) => v.status !== 'PENDING_APPROVAL' && v.visitorType === 'PARENT');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <FileCheck size={14} />
            <span>Faculty Verification Desk</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Parent Visit Authorization & Approvals
          </h1>
          <p className="text-xs text-slate-500">
            Review parent visit requests for your department students. Once approved, a unique QR pass is unlocked for the visitor.
          </p>
        </div>

        <button
          onClick={fetchRequests}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Requests</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('PENDING')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'PENDING'
              ? 'bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Clock size={15} />
          <span>Pending Approvals ({pendingRequests.length})</span>
          {pendingRequests.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('PROCESSED')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'PROCESSED'
              ? 'bg-blue-50 text-blue-900 border border-blue-300 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 size={15} />
          <span>Approved / Processed Visits ({processedRequests.length})</span>
        </button>
      </div>

      {/* Pending Requests List */}
      {activeTab === 'PENDING' && (
        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 size={30} />
              </div>
              <h3 className="font-bold text-slate-900 text-base">All Caught Up!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No pending parent requests currently require faculty approval. New parent registrations will appear here in real time.
              </p>
            </div>
          ) : (
            pendingRequests.map((req) => (
              <div
                key={req.visitorId}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-amber-200 shadow-md hover:border-amber-300 transition-all space-y-5"
              >
                {/* Request Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                      {req.visitorId}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{req.name}</span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {req.relationship || 'Parent'}
                    </span>
                    {req.securityAssisted && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Gate Assisted
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock size={13} />
                    <span>Submitted: {new Date(req.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                  </div>
                </div>

                {/* Details Grid (All Section 11 Requirements) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold uppercase text-[10px] block">Student Name</span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">{req.studentName}</span>
                    <span className="text-slate-500 text-[11px]">ID: {req.studentId || 'N/A'}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold uppercase text-[10px] block">Department</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">{req.department || 'General'}</span>
                    <span className="text-slate-500 text-[11px]">Contact: {req.phone}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold uppercase text-[10px] block">Target Host</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">{req.hostName}</span>
                    <span className="text-slate-500 text-[11px]">Visit Date: {req.visitDate}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold uppercase text-[10px] block">Current Status</span>
                    <div className="mt-1">
                      <StatusBadge status={req.status} size="sm" />
                    </div>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-semibold uppercase text-[10px] block">Purpose of Visit</span>
                    <p className="text-slate-800 text-xs font-medium leading-relaxed">{req.purpose}</p>
                    {req.approvalRemarks && (
                      <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                        Notes: {req.approvalRemarks}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons (APPROVE / REJECT) */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenActionModal(req, 'REJECTED')}
                    disabled={processingId === req.visitorId}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <XCircle size={15} />
                    <span>REJECT REQUEST</span>
                  </button>

                  <button
                    onClick={() => handleOpenActionModal(req, 'APPROVED')}
                    disabled={processingId === req.visitorId}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 size={15} />
                    <span>APPROVE & GENERATE QR PASS</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Processed Visits Tab */}
      {activeTab === 'PROCESSED' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Visitor ID</th>
                  <th className="py-3 px-4">Parent Name</th>
                  <th className="py-3 px-4">Student & Roll</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Approved By</th>
                  <th className="py-3 px-4">Remarks</th>
                  <th className="py-3 px-4 text-right">Pass</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {processedRequests.map((v) => (
                  <tr key={v.visitorId} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-700">{v.visitorId}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{v.name}</td>
                    <td className="py-3 px-4 text-slate-700">{v.studentName} ({v.studentId})</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={v.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-slate-600">{v.approvedBy || 'Faculty'}</td>
                    <td className="py-3 px-4 text-slate-500 italic max-w-xs truncate">{v.approvalRemarks || '—'}</td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/visitor/pass?id=${v.visitorId}`}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold"
                      >
                        View QR
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action / Remarks Modal */}
      {selectedVisitor && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-2xl ${actionType === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {actionType === 'APPROVED' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {actionType === 'APPROVED' ? 'Confirm Parent Visit Approval' : 'Confirm Rejection'}
                </h3>
                <p className="text-xs text-slate-500">
                  Visitor: <strong>{selectedVisitor.name}</strong> (Student: {selectedVisitor.studentName})
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Approval / Rejection Remarks (Optional)
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter remarks for the visitor..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedVisitor(null);
                  setActionType(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDecision}
                disabled={processingId !== null}
                className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-xs cursor-pointer ${
                  actionType === 'APPROVED'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {processingId !== null ? 'Processing...' : `Confirm ${actionType}`}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
