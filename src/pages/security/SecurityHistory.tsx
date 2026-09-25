import React, { useEffect, useState } from 'react';
import { History, Search, LogIn, LogOut, Clock, Calendar } from 'lucide-react';
import { api } from '../../services/api';
import { Visitor } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { useLive } from '../../context/LiveContext';

export const SecurityHistory: React.FC = () => {
  const { refreshTrigger } = useLive();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await api.getVisitors({ search });
      setVisitors(data.visitors);
    } catch (err) {
      console.error('Failed to fetch security history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistory();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <History size={24} className="text-purple-600" />
          Campus Gate Access History & Entry/Exit Logs
        </h1>
        <p className="text-xs text-slate-500">
          Complete historical register tracking every arrival, entry scan, and exit scan timestamp at the gate.
        </p>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Search gate logs by name, phone, visitor ID, or host..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
          />
          <Search size={15} className="absolute left-3 top-3 text-slate-400" />
        </form>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Visitor ID</th>
                <th className="py-3.5 px-4">Visitor Name</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Registration Time</th>
                <th className="py-3.5 px-4">Gate Entry Time</th>
                <th className="py-3.5 px-4">Gate Exit Time</th>
                <th className="py-3.5 px-4">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visitors.map((v) => (
                <tr key={v.visitorId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                    {v.visitorId}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {v.name}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {v.visitorType === 'EXTERNAL_STUDENT' ? 'Student' : 'Parent'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    <span className="text-[10px] text-slate-400 block">{new Date(v.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">
                    {v.entryTime ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <LogIn size={12} />
                        {new Date(v.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    ) : (
                      <span className="text-slate-400">Not Entered</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">
                    {v.exitTime ? (
                      <span className="text-blue-700 font-semibold flex items-center gap-1">
                        <LogOut size={12} />
                        {new Date(v.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    ) : (
                      <span className="text-slate-400">{v.status === 'INSIDE_CAMPUS' ? 'Still Inside' : 'Not Exited'}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={v.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
