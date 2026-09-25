import React, { useEffect, useState } from 'react';
import { History, Search, Download, Printer, Filter, LogIn, LogOut, CheckCircle2, Clock } from 'lucide-react';
import { api } from '../../services/api';
import { Visitor } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { useLive } from '../../context/LiveContext';

export const AdminHistory: React.FC = () => {
  const { refreshTrigger } = useLive();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await api.getVisitors({
        search,
        type: filterType,
      });
      setVisitors(data.visitors);
    } catch (err) {
      console.error('Failed to load admin history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [filterType, refreshTrigger]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistory();
  };

  const handleExportCSV = () => {
    const headers = ['Visitor ID', 'Name', 'Type', 'Phone', 'Registration Time', 'Entry Time', 'Exit Time', 'Status', 'Host'];
    const rows = visitors.map((v) => [
      v.visitorId,
      `"${v.name}"`,
      v.visitorType,
      v.phone,
      `"${v.createdAt}"`,
      `"${v.entryTime || ''}"`,
      `"${v.exitTime || ''}"`,
      v.status,
      `"${v.hostName}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `campus_visitor_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <History size={24} className="text-purple-600" />
            Campus Gate Access & Visitor History Archive
          </h1>
          <p className="text-xs text-slate-500">
            Audit trail of every digital pass creation, faculty verification, gate entry scan, and exit scan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs cursor-pointer transition-colors"
          >
            <Download size={14} />
            <span>Export CSV Audit Log</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <input
            type="text"
            placeholder="Search by Visitor Name, ID, or Contact..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 outline-none"
          />
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
        </form>

        <div className="flex items-center gap-2">
          <Filter size={15} className="text-slate-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none font-medium text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="EXTERNAL_STUDENT">External Students Only</option>
            <option value="PARENT">Parents Only</option>
          </select>
        </div>
      </div>

      {/* History Table (Section 18 Required Specifications) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Visitor ID</th>
                <th className="py-3.5 px-4">Visitor Name</th>
                <th className="py-3.5 px-4">Visitor Type</th>
                <th className="py-3.5 px-4">Registration Time</th>
                <th className="py-3.5 px-4">Approval Info</th>
                <th className="py-3.5 px-4">Entry Time</th>
                <th className="py-3.5 px-4">Exit Time</th>
                <th className="py-3.5 px-4">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visitors.map((v) => (
                <tr key={v.visitorId} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* Visitor ID */}
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700 whitespace-nowrap">
                    {v.visitorId}
                  </td>

                  {/* Visitor Name */}
                  <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {v.name}
                  </td>

                  {/* Visitor Type */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {v.visitorType === 'EXTERNAL_STUDENT' ? 'Student' : 'Parent'}
                    </span>
                  </td>

                  {/* Registration Time */}
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                    {new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    <span className="block text-[10px] text-slate-400">
                      {new Date(v.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>

                  {/* Approval Time / Verifier */}
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                    <p className="font-semibold text-slate-800 text-[11px]">{v.approvedBy || 'Pending'}</p>
                    <p className="text-[10px] text-slate-400">{v.approvalStatus}</p>
                  </td>

                  {/* Entry Time */}
                  <td className="py-3 px-4 text-slate-700 font-medium whitespace-nowrap">
                    {v.entryTime ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <LogIn size={12} />
                        {new Date(v.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    ) : (
                      <span className="text-slate-400">Not Entered</span>
                    )}
                  </td>

                  {/* Exit Time */}
                  <td className="py-3 px-4 text-slate-700 font-medium whitespace-nowrap">
                    {v.exitTime ? (
                      <span className="text-blue-700 font-bold flex items-center gap-1">
                        <LogOut size={12} />
                        {new Date(v.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    ) : (
                      <span className="text-slate-400">{v.status === 'INSIDE_CAMPUS' ? 'Active Inside' : 'Not Exited'}</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={v.status} size="sm" />
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
          Showing {visitors.length} total historical access logs
        </div>
      </div>

    </div>
  );
};
