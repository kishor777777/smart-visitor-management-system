import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, QrCode, ArrowRight, UserCheck, AlertCircle, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { Visitor } from '../types';
import { StatusBadge } from '../components/StatusBadge';

export const VisitorStatus: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Visitor[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      // First try exact visitor lookup
      try {
        const single = await api.getVisitorById(searchTerm.trim());
        if (single) {
          setResults([single]);
          setLoading(false);
          return;
        }
      } catch (e) {
        // Fallback to general search query
      }

      const res = await api.getVisitors({ search: searchTerm.trim() });
      setResults(res.visitors);
      if (res.visitors.length === 0) {
        setError('No visitor records found matching: ' + searchTerm.trim());
      }
    } catch (err: any) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const sampleLookups = [
    { label: 'Arun Kumar (Approved Student)', id: 'EXT-1001' },
    { label: 'Meena Devi (Pending Parent)', id: 'PAR-1001' },
    { label: 'Priya Sundaram (Inside Campus)', id: 'EXT-1002' },
    { label: 'Karthik Raja (Checked Out)', id: 'EXT-1003' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
          <QrCode size={14} />
          <span>Status Verification Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Visitor Pass & Approval Status
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Enter your Visitor ID, registered mobile number, or student roll number to view current status and access your QR pass.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              required
              placeholder="e.g. EXT-1001, PAR-1001, or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
            />
            <Search size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <span>{loading ? 'Searching...' : 'Check Status'}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        {/* Demo Fast Clicks */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold">Quick Demo Lookups:</span>
          {sampleLookups.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSearchTerm(s.id);
                navigate(`/visitor/pass?id=${s.id}`);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-[11px] font-medium transition-colors border border-slate-200 cursor-pointer"
            >
              {s.label} ({s.id})
            </button>
          ))}
        </div>
      </div>

      {/* Results List */}
      {hasSearched && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Search Results ({results.length})
          </h2>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700">
              {error}
            </div>
          )}

          {results.map((v) => (
            <div
              key={v.visitorId}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-indigo-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {v.visitorId}
                  </span>
                  <StatusBadge status={v.status} size="sm" />
                  <span className="text-[11px] text-slate-400 font-medium">
                    {v.visitorType === 'EXTERNAL_STUDENT' ? 'Student' : 'Parent'}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{v.name}</h3>
                <p className="text-xs text-slate-500">
                  {v.visitorType === 'EXTERNAL_STUDENT'
                    ? `${v.collegeName} • ${v.eventName}`
                    : `Parent of ${v.studentName} (${v.department})`}
                </p>
                <p className="text-[11px] text-slate-400">
                  Host: {v.hostName} | Visit Date: {v.visitDate}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={`/visitor/pass?id=${v.visitorId}`}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5"
                >
                  <QrCode size={14} />
                  <span>Open Visitor Pass</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
