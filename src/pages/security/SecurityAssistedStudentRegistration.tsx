import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Shield, User, Phone, School, Calendar, CheckCircle2, ArrowRight, Award, Clock } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useLive } from '../../context/LiveContext';

export const SecurityAssistedStudentRegistration: React.FC = () => {
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
    collegeName: '',
    studentId: '',
    department: '',
    eventName: 'Technical Symposium - TechVista 2026',
    eventDate: new Date().toISOString().split('T')[0],
    purpose: 'Technical Symposium - Paper Presentation & Project Expo Participant',
    hostName: 'Prof. Rajesh Sharma',
    remarks: 'Student arrived at campus gate without online pass; registered by Gate Security.',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.registerStudent({
        ...formData,
        securityAssisted: true,
        securityStaffId: user?.badgeId || user?.name || 'SEC-GATE-01',
      });
      setRegisteredVisitor(res.visitor);
      triggerRefresh();
    } catch (err: any) {
      setError(err.message || 'Assisted student registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (registeredVisitor) {
    return (
      <div className="max-w-2xl mx-auto py-10 space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-amber-200 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Clock size={36} />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 uppercase tracking-wider">
              Assisted Registration Completed — Awaiting Faculty Approval
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">
              External Student Registered by Gate Security
            </h2>
            <p className="text-xs text-slate-500">
              Assisted by Officer: <strong>{user?.name} ({user?.badgeId || 'SEC-GATE-01'})</strong>
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-slate-400 font-medium">Visitor ID</p>
              <p className="text-base font-bold text-indigo-700">{registeredVisitor.visitorId}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Status</p>
              <p className="font-semibold text-amber-700">{registeredVisitor.status}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Student Name</p>
              <p className="font-medium text-slate-800">{registeredVisitor.name} ({registeredVisitor.phone})</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">College</p>
              <p className="font-medium text-slate-800">{registeredVisitor.collegeName}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Event Name</p>
              <p className="font-medium text-slate-800">{registeredVisitor.eventName}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Target Host</p>
              <p className="font-medium text-slate-800">{registeredVisitor.hostName}</p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 text-left">
            <p className="font-semibold">Next Steps:</p>
            <p className="mt-1">
              This request is routed to Faculty for verification. Once approved, the student's <strong>QR Pass</strong> will become active for scanning at the gate.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate(`/visitor/pass?id=${registeredVisitor.visitorId}`)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Pass Status / Gate Slip</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => {
                setRegisteredVisitor(null);
                setFormData({
                  name: '',
                  phone: '',
                  email: '',
                  collegeName: '',
                  studentId: '',
                  department: '',
                  eventName: 'Technical Symposium - TechVista 2026',
                  eventDate: new Date().toISOString().split('T')[0],
                  purpose: 'Technical Symposium - Paper Presentation & Project Expo Participant',
                  hostName: 'Prof. Rajesh Sharma',
                  remarks: 'Student arrived at campus gate without online pass; registered by Gate Security.',
                });
              }}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
            >
              Register Another Student
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
          <Award size={14} />
          <span>Gate Security Assistance</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900">
          Security Assisted External Student Registration
        </h1>
        <p className="text-xs text-slate-500">
          Register external college students arriving at the gate who did not register online. Requests are routed to Faculty for approval before entry pass unlocks.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
        
        {/* Security Officer Tag */}
        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-indigo-600" />
            <span>
              Officer on Duty: <strong>{user?.name}</strong> | Badge: <strong>{user?.badgeId || 'SEC-GATE-01'}</strong>
            </span>
          </div>
          <span className="font-bold text-[10px] uppercase bg-indigo-200/80 px-2 py-0.5 rounded">
            Security Mode
          </span>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Student Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <User size={15} className="text-indigo-600" />
              1. External Student Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arun Kumar"
                  value={formData.name}
                  onChange={handleChange}
                  name="name"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98450 12345"
                  value={formData.phone}
                  onChange={handleChange}
                  name="phone"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (Optional / Offline Default)
                </label>
                <input
                  type="email"
                  placeholder="student-offline@gate.campus.edu"
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  College / University Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ABC Engineering College"
                  value={formData.collegeName}
                  onChange={handleChange}
                  name="collegeName"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Roll / College ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EXT1001 or 2022CS104"
                  value={formData.studentId}
                  onChange={handleChange}
                  name="studentId"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department / Branch
                </label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science / IT / ECE"
                  value={formData.department}
                  onChange={handleChange}
                  name="department"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Event & Visit Details */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <Calendar size={15} className="text-indigo-600" />
              2. Event & Visit Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Event Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. National Hackathon / Symposium"
                  value={formData.eventName}
                  onChange={handleChange}
                  name="eventName"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Event / Visit Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.eventDate}
                  onChange={handleChange}
                  name="eventDate"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Faculty Coordinator / Host
                </label>
                <input
                  type="text"
                  placeholder="e.g. Prof. Rajesh Sharma"
                  value={formData.hostName}
                  onChange={handleChange}
                  name="hostName"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Remarks / Gate Notes
                </label>
                <input
                  type="text"
                  value={formData.remarks}
                  onChange={handleChange}
                  name="remarks"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
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
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none resize-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[11px] text-slate-400">
              * Requires Faculty Coordinator approval before QR gate pass becomes active.
            </span>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>{loading ? 'Submitting Registration...' : 'Complete Assisted Student Registration'}</span>
              <ArrowRight size={15} />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
