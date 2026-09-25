import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Shield, User, Phone, School, Calendar, CheckCircle2, ArrowRight, Printer } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useLive } from '../../context/LiveContext';

export const SecurityAssistedRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { triggerRefresh } = useLive();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredVisitor, setRegisteredVisitor] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    studentName: '',
    studentId: '',
    studentDepartment: 'Computer Science & Engineering',
    relationship: 'Father',
    purpose: 'Urgent meeting with Department HOD regarding student health/attendance',
    hostName: 'Prof. Rajesh Sharma',
    visitDate: new Date().toISOString().split('T')[0],
    remarks: 'Parent arrived at campus gate without smartphone; registered by Gate Security.',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.registerParent({
        ...formData,
        securityAssisted: true,
        securityStaffId: user?.badgeId || user?.name || 'SEC-GATE-01',
      });
      setRegisteredVisitor(res.visitor);
      triggerRefresh();
    } catch (err: any) {
      setError(err.message || 'Assisted registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (registeredVisitor) {
    return (
      <div className="max-w-2xl mx-auto py-10 space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 size={36} />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
              Assisted Registration Completed
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">
              Parent Registered by Security Staff
            </h2>
            <p className="text-xs text-slate-500">
              Registered by Security Staff: <strong>{user?.name} ({user?.badgeId || 'SEC-GATE-01'})</strong>
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-slate-400 font-medium">Visitor ID</p>
              <p className="text-base font-bold text-indigo-700">{registeredVisitor.visitorId}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Approval Status</p>
              <p className="font-semibold text-amber-700">{registeredVisitor.status}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Parent Name</p>
              <p className="font-medium text-slate-800">{registeredVisitor.name} ({registeredVisitor.phone})</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Student</p>
              <p className="font-medium text-slate-800">{registeredVisitor.studentName} ({registeredVisitor.studentId})</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Target Host</p>
              <p className="font-medium text-slate-800">{registeredVisitor.hostName}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Registration Time</p>
              <p className="font-medium text-slate-800">{new Date(registeredVisitor.createdAt).toLocaleTimeString()}</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate(`/visitor/pass?id=${registeredVisitor.visitorId}`)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View & Print Gate Slip</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => {
                setRegisteredVisitor(null);
                setFormData({
                  name: '',
                  phone: '',
                  email: '',
                  studentName: '',
                  studentId: '',
                  studentDepartment: 'Computer Science & Engineering',
                  relationship: 'Father',
                  purpose: 'Urgent meeting with Department HOD regarding student health/attendance',
                  hostName: 'Prof. Rajesh Sharma',
                  visitDate: new Date().toISOString().split('T')[0],
                  remarks: 'Parent arrived at campus gate without smartphone; registered by Gate Security.',
                });
              }}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
            >
              Register Another Parent
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <UserPlus size={14} />
          <span>Gate Security Assistance</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900">
          Security Assisted Parent Registration
        </h1>
        <p className="text-xs text-slate-500">
          Assist parents who do not have a smartphone, cannot access the website, or require immediate gate registration.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
        
        {/* Security Officer Tag */}
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-emerald-600" />
            <span>
              Officer on Duty: <strong>{user?.name}</strong> | Badge: <strong>{user?.badgeId || 'SEC-GATE-01'}</strong>
            </span>
          </div>
          <span className="font-bold text-[10px] uppercase bg-emerald-200/80 px-2 py-0.5 rounded">
            Security Mode
          </span>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Parent Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <User size={15} className="text-emerald-600" />
              1. Parent Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Parent Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Babu"
                  value={formData.name}
                  onChange={handleChange}
                  name="name"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Parent Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 99401 22334"
                  value={formData.phone}
                  onChange={handleChange}
                  name="phone"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Relationship with Student
                </label>
                <select
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                >
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Other Relative">Other Relative</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email (Optional / Offline Default)
                </label>
                <input
                  type="email"
                  placeholder="parent-offline@gate.campus.edu"
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Student Details */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <School size={15} className="text-emerald-600" />
              2. Student & Host Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sneha R"
                  value={formData.studentName}
                  onChange={handleChange}
                  name="studentName"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Roll / College ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. ECE-2024-18"
                  value={formData.studentId}
                  onChange={handleChange}
                  name="studentId"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Faculty / Staff to Meet <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prof. Rajesh Sharma"
                  value={formData.hostName}
                  onChange={handleChange}
                  name="hostName"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Visit Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.visitDate}
                  onChange={handleChange}
                  name="visitDate"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Purpose of Visit <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.purpose}
                  onChange={handleChange}
                  name="purpose"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none resize-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Record flagged with: <code className="bg-slate-100 px-1 py-0.5 rounded">securityAssisted = true</code>
            </span>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>{loading ? 'Submitting Registration...' : 'Complete Assisted Registration'}</span>
              <ArrowRight size={15} />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
