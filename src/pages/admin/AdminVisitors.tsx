import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, QrCode, RefreshCw, ChevronLeft, ChevronRight, ArrowUpDown, Download, Printer } from 'lucide-react';
import { api } from '../../services/api';
import { Visitor, VisitorType, VisitorStatus, ApprovalStatus } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { useLive } from '../../context/LiveContext';

export const AdminVisitors: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { refreshTrigger } = useLive();

  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [typeFilter, setTypeFilter] = useState<string>(searchParams.get('type') || 'ALL');
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'ALL');
  const [approvalFilter, setApprovalFilter] = useState<string>(searchParams.get('approvalStatus') || 'ALL');
  const [dateFilter, setDateFilter] = useState<string>(searchParams.get('date') || '');

  // Sorting
  const [sortField, setSortField] = useState<keyof Visitor>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const data = await api.getVisitors({
        search,
        type: typeFilter,
        status: statusFilter,
        approvalStatus: approvalFilter,
        date: dateFilter,
      });
      setVisitors(data.visitors);
      setCurrentPage(1);
    } catch (err) {
      console.error('Failed to load admin visitors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [typeFilter, statusFilter, approvalFilter, dateFilter, refreshTrigger]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVisitors();
  };

  const handleSort = (field: keyof Visitor) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedVisitors = [...visitors].sort((a, b) => {
    const valA = (a[sortField] || '').toString().toLowerCase();
    const valB = (b[sortField] || '').toString().toLowerCase();
    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedVisitors.length / pageSize) || 1;
  const paginatedVisitors = sortedVisitors.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Campus Visitor Management</h1>
          <p className="text-xs text-slate-500">
            Comprehensive visitor master registry with multi-parameter filtering, sorting, and export capabilities.
          </p>
        </div>

        <button
          onClick={fetchVisitors}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* Filter and Search Box (Section 17 Requirements) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Search by Name, Phone, Visitor ID, Student ID, College, Event..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-24 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
          />
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <button
            type="submit"
            className="absolute right-2 top-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-2xs cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Filter Row: Type, Status, Approval, Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Visitor Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none cursor-pointer"
            >
              <option value="ALL">All Visitor Types</option>
              <option value="EXTERNAL_STUDENT">External Students</option>
              <option value="PARENT">Parents / Guardians</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Current Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="APPROVED">Approved (Pending Gate)</option>
              <option value="INSIDE_CAMPUS">Inside Campus</option>
              <option value="CHECKED_OUT">Checked Out</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Approval Status</label>
            <select
              value={approvalFilter}
              onChange={(e) => setApprovalFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none cursor-pointer"
            >
              <option value="ALL">All Approvals</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Filter by Date</label>
            <div className="flex gap-1.5">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
              />
              {dateFilter && (
                <button
                  onClick={() => setDateFilter('')}
                  className="px-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Main Table (All 11 Column Requirements from Section 17) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th onClick={() => handleSort('visitorId')} className="py-3.5 px-3 cursor-pointer hover:text-slate-900">
                  <div className="flex items-center gap-1">
                    <span>Visitor ID</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th onClick={() => handleSort('name')} className="py-3.5 px-3 cursor-pointer hover:text-slate-900">
                  <div className="flex items-center gap-1">
                    <span>Name</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="py-3.5 px-3">Visitor Type</th>
                <th className="py-3.5 px-3">Phone</th>
                <th className="py-3.5 px-3">Purpose</th>
                <th className="py-3.5 px-3">Host</th>
                <th onClick={() => handleSort('createdAt')} className="py-3.5 px-3 cursor-pointer hover:text-slate-900">
                  <div className="flex items-center gap-1">
                    <span>Reg Date</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="py-3.5 px-3">Approval Status</th>
                <th className="py-3.5 px-3">Entry Time</th>
                <th className="py-3.5 px-3">Exit Time</th>
                <th className="py-3.5 px-3">Current Status</th>
                <th className="py-3.5 px-3 text-right">Pass</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedVisitors.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-400 text-xs">
                    No visitor records match the specified filters.
                  </td>
                </tr>
              ) : (
                paginatedVisitors.map((v) => (
                  <tr key={v.visitorId} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Visitor ID */}
                    <td className="py-3 px-3 font-mono font-bold text-indigo-700 whitespace-nowrap">
                      {v.visitorId}
                      {v.securityAssisted && (
                        <span className="block text-[9px] text-amber-600 font-sans font-semibold">
                          Assisted
                        </span>
                      )}
                    </td>

                    {/* Name */}
                    <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                      {v.name}
                    </td>

                    {/* Type */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        v.visitorType === 'EXTERNAL_STUDENT'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {v.visitorType === 'EXTERNAL_STUDENT' ? 'Student' : 'Parent'}
                      </span>
                    </td>

                    {/* Phone */}
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {v.phone}
                    </td>

                    {/* Purpose */}
                    <td className="py-3 px-3 text-slate-700 max-w-[180px] truncate" title={v.purpose}>
                      {v.purpose}
                    </td>

                    {/* Host */}
                    <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                      {v.hostName}
                    </td>

                    {/* Registration Date */}
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                      {new Date(v.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </td>

                    {/* Approval Status */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        v.approvalStatus === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : v.approvalStatus === 'REJECTED'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {v.approvalStatus}
                      </span>
                    </td>

                    {/* Entry Time */}
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {v.entryTime ? new Date(v.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>

                    {/* Exit Time */}
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {v.exitTime ? new Date(v.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>

                    {/* Current Status */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <StatusBadge status={v.status} size="sm" />
                    </td>

                    {/* Pass Link */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <Link
                        to={`/visitor/pass?id=${v.visitorId}`}
                        className="text-indigo-600 hover:text-indigo-800 font-bold"
                      >
                        Pass
                      </Link>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, sortedVisitors.length)} of {sortedVisitors.length} total records
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-semibold text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
