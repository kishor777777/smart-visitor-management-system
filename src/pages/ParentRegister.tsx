import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Users, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle,
  School,
  Heart,
  Send,
  ShieldAlert
} from 'lucide-react';
import { api } from '../services/api';

export const ParentRegister: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedVisitor, setSubmittedVisitor] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    studentName: '',
    studentId: '',
    studentDepartment: 'Computer Science & Engineering',
    relationship: 'Mother',
    purpose: 'Parent-Teacher Meeting regarding semester progress',
    hostName: 'Prof. Rajesh Sharma',
    visitDate: new Date().toISOString().split('T')[0],
    remarks: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.registerParent(formData);
      setSubmittedVisitor(res.visitor);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check the entered details.');
    } finally {
      setLoading(false);
    }
  };

  // If already submitted in this session, show pending approval notice
  if (submittedVisitor) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 border border-amber-200 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Clock size={36} />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Request Submitted - Awaiting Faculty Approval
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Thank You, {submittedVisitor.name}!
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your visit request for student <strong>{submittedVisitor.studentName}</strong> has been routed to <strong>{submittedVisitor.hostName}</strong> for approval.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-slate-400 font-medium">Visitor ID</p>
              <p className="text-base font-bold text-indigo-700">{submittedVisitor.visitorId}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Current Status</p>
              <p className="font-semibold text-amber-700">PENDING_APPROVAL</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Student Name</p>
              <p className="font-medium text-slate-800">{submittedVisitor.studentName} ({submittedVisitor.studentId})</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Visit Date</p>
              <p className="font-medium text-slate-800">{submittedVisitor.visitDate}</p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 text-left">
            <p className="font-semibold">Next Step:</p>
            <p className="mt-1">
              Once Faculty approves your visit, your <strong>QR Visitor Pass</strong> will be unlocked. You can check the approval status anytime using your Visitor ID ({submittedVisitor.visitorId}) or phone number.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate(`/visitor/pass?id=${submittedVisitor.visitorId}`)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Track Approval & Pass</span>
              <ArrowRight size={16} />
            </button>
            <Link
              to="/"
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs text-center"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <Users size={14} />
          <span>Parent & Guardian Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Parent Campus Visit Registration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Please fill in the parent and student details below. Requests are verified and approved by the department faculty coordinator.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Parent Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <User size={16} className="text-indigo-600" />
              1. Parent / Guardian Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Parent Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Meena Devi"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Parent Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="e.g. +91 97890 23456"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="e.g. meena.parent@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Relationship with Student <span className="text-rose-500">*</span>
                </label>
                <select
                  name="relationship"
                  required
                  value={formData.relationship}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none cursor-pointer"
                >
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Other Relative">Other Relative</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Student Details */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <School size={16} className="text-indigo-600" />
              2. Student Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="studentName"
                  required
                  placeholder="e.g. Kavin"
                  value={formData.studentName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Roll / College ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="studentId"
                  required
                  placeholder="e.g. CS-2023-42"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Department
                </label>
                <input
                  type="text"
                  name="studentDepartment"
                  placeholder="e.g. Computer Science & Engineering"
                  value={formData.studentDepartment}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Visit Purpose & Host */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <Calendar size={16} className="text-indigo-600" />
              3. Purpose & Visit Schedule
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date of Visit <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="visitDate"
                  required
                  value={formData.visitDate}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Faculty / Staff Member to Meet
                </label>
                <input
                  type="text"
                  name="hostName"
                  placeholder="e.g. Prof. Rajesh Sharma"
                  value={formData.hostName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detailed Purpose of Visit <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  name="purpose"
                  required
                  placeholder="e.g. Semester academic progress review, attendance discussion, or hostel query"
                  value={formData.purpose}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none resize-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Optional Remarks
                </label>
                <input
                  type="text"
                  name="remarks"
                  placeholder="e.g. Arriving around 10:30 AM"
                  value={formData.remarks}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldAlert size={14} className="text-amber-500 shrink-0" />
              <span>Parent visits require Faculty / HOD confirmation before gate pass unlocks.</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {loading ? (
                <span>Submitting Request...</span>
              ) : (
                <>
                  <Send size={15} />
                  <span>Submit Visit Request</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
