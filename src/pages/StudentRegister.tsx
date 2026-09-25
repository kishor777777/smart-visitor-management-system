import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  UserPlus, 
  Building, 
  Calendar, 
  Mail, 
  Phone, 
  User, 
  Award, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  BookOpen,
  Send
} from 'lucide-react';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

export const StudentRegister: React.FC = () => {
  const navigate = useNavigate();
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
    purpose: 'Technical Symposium - Paper Presentation & Project Expo',
    hostName: 'Prof. Rajesh Sharma (Faculty Coordinator)',
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
      const res = await api.registerStudent(formData);
      setRegisteredVisitor(res.visitor);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check the form fields.');
    } finally {
      setLoading(false);
    }
  };

  // If already registered in this session, show instant confirmation and QR pass CTA
  if (registeredVisitor) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 size={36} />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Registration Successful & Approved
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Welcome, {registeredVisitor.name}!
            </h2>
            <p className="text-sm text-slate-500">
              Your external student pass has been issued and approved for campus entry.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-slate-400 font-medium">Visitor ID</p>
              <p className="text-base font-bold text-indigo-700">{registeredVisitor.visitorId}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Status</p>
              <p className="font-semibold text-emerald-700">{registeredVisitor.status}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">College</p>
              <p className="font-medium text-slate-800">{registeredVisitor.collegeName}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Event</p>
              <p className="font-medium text-slate-800">{registeredVisitor.eventName}</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate(`/visitor/pass?id=${registeredVisitor.visitorId}`)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View & Download QR Pass</span>
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
                  purpose: 'Technical Symposium - Paper Presentation & Project Expo',
                  hostName: 'Prof. Rajesh Sharma (Faculty Coordinator)',
                  remarks: '',
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
          <Award size={14} />
          <span>External Student Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Campus Event & Symposium Registration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Students visiting for Symposiums, Workshops, Hackathons, or Competitions can register below to get an instant digital QR Visitor Pass.
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
          
          {/* Section: Personal & College Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <User size={16} className="text-indigo-600" />
              1. Student Identity & Contact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Arun Kumar"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="e.g. +91 98450 12345"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="e.g. arun.kumar@abc.edu"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  College / University Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="collegeName"
                  required
                  placeholder="e.g. ABC Engineering College"
                  value={formData.collegeName}
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
                  placeholder="e.g. EXT1001 or 2022CS104"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department / Branch
                </label>
                <input
                  type="text"
                  name="department"
                  placeholder="e.g. Computer Science / IT / ECE"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Event & Visit Purpose */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <Calendar size={16} className="text-indigo-600" />
              2. Event & Visit Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Event Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="eventName"
                  required
                  placeholder="e.g. National Hackathon / Symposium"
                  value={formData.eventName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Event / Visit Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="eventDate"
                  required
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Purpose of Visit <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="purpose"
                  required
                  placeholder="e.g. Paper Presentation & Project Expo Participant"
                  value={formData.purpose}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Host / Faculty Coordinator Name
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Optional Remarks / Notes
                </label>
                <input
                  type="text"
                  name="remarks"
                  placeholder="e.g. Bringing laptop and project kit"
                  value={formData.remarks}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-slate-400">
              * By submitting, you agree to comply with campus visitor regulations.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {loading ? (
                <span>Generating QR Pass...</span>
              ) : (
                <>
                  <Send size={15} />
                  <span>Submit & Generate QR Pass</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
