import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, QrCode, RefreshCw, LogIn, LogOut, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { Visitor, VisitorStatus } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { useLive } from '../../context/LiveContext';

export const SecurityVisitors: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'ALL';
  const initialSearch = searchParams.get('search') || '';
  const { refreshTrigger } = useLive();

  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const data = await api.getVisitors({
        status: statusFilter,
        search: searchQuery,
      });
      setVisitors(data.visitors);
    } catch (err) {
      console.error('Failed to fetch security visitors list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [statusFilter, refreshTrigger]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVisitors();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Campus Gate Visitors Directory</h1>
          <p className="text-xs text-slate-500">
            Real-time status of all registered campus visitors with gate entry/exit logs.
          </p>
        </div>

        <button
          onClick={fetchVisitors}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search by Visitor Name, ID, Phone, College, Event..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
          />
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={15} className="text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setSearchParams({ status: e.target.value, search: searchQuery });
            }}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none font-medium text-slate-700 cursor-pointer w-full md:w-48"
          >
            <option value="ALL">All Statuses</option>
            <option value="APPROVED">Approved (Ready at Gate)</option>
            <option value="INSIDE_CAMPUS">Currently Inside Campus</option>
            <option value="CHECKED_OUT">Checked Out (Completed)</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Visitors Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Visitor ID</th>
                <th className="py-3.5 px-4">Name & Contact</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">College / Student Info</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Gate Timestamps</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visitors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 text-xs">
                    No visitor records found matching your filters.
                  </td>
                </tr>
              ) : (
                visitors.map((v) => (
                  <tr key={v.visitorId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                      {v.visitorId}
                      {v.securityAssisted && (
                        <span className="block text-[9px] text-amber-600 font-sans font-semibold">
                          Security Assisted
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{v.name}</p>
                      <p className="text-[11px] text-slate-400">{v.phone}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        v.visitorType === 'EXTERNAL_STUDENT'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {v.visitorType === 'EXTERNAL_STUDENT' ? 'Student' : 'Parent'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {v.visitorType === 'EXTERNAL_STUDENT' ? (
                        <div>
                          <p className="font-medium text-slate-800">{v.collegeName}</p>
                          <p className="text-[11px] text-slate-400">{v.eventName}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium text-slate-800">Student: {v.studentName} ({v.studentId})</p>
                          <p className="text-[11px] text-slate-400">Host: {v.hostName}</p>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={v.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-slate-600 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <LogIn size={11} className={v.entryTime ? 'text-emerald-600' : 'text-slate-300'} />
                        <span className="text-[11px]">
                          {v.entryTime ? new Date(v.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Not Entered'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <LogOut size={11} className={v.exitTime ? 'text-blue-600' : 'text-slate-300'} />
                        <span className="text-[11px]">
                          {v.exitTime ? new Date(v.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Not Exited'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/visitor/pass?id=${v.visitorId}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
                      >
                        <QrCode size={13} />
                        <span>Pass</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
          <span>Showing {visitors.length} visitors</span>
          <span>Live gate synchronization active</span>
        </div>
      </div>

    </div>
  );
};
