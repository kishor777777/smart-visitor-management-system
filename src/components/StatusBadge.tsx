import React from 'react';
import { VisitorStatus } from '../types';
import { CheckCircle2, Clock, LogIn, LogOut, XCircle, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: VisitorStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  switch (status) {
    case 'APPROVED':
      return (
        <span className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 ${sizeClasses[size]}`}>
          <CheckCircle2 size={iconSizes[size]} className="text-emerald-600" />
          Approved - Not Checked In
        </span>
      );
    case 'INSIDE_CAMPUS':
      return (
        <span className={`inline-flex items-center rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-600/30 animate-pulse-subtle ${sizeClasses[size]}`}>
          <LogIn size={iconSizes[size]} className="text-blue-600" />
          Inside Campus
        </span>
      );
    case 'CHECKED_OUT':
      return (
        <span className={`inline-flex items-center rounded-full bg-slate-100 text-slate-700 ring-1 ring-slate-600/20 ${sizeClasses[size]}`}>
          <LogOut size={iconSizes[size]} className="text-slate-500" />
          Visit Completed
        </span>
      );
    case 'PENDING_APPROVAL':
      return (
        <span className={`inline-flex items-center rounded-full bg-amber-50 text-amber-800 ring-1 ring-amber-600/20 ${sizeClasses[size]}`}>
          <Clock size={iconSizes[size]} className="text-amber-600" />
          Pending Approval
        </span>
      );
    case 'REJECTED':
      return (
        <span className={`inline-flex items-center rounded-full bg-rose-50 text-rose-700 ring-1 ring-rose-600/20 ${sizeClasses[size]}`}>
          <XCircle size={iconSizes[size]} className="text-rose-600" />
          Rejected
        </span>
      );
    case 'REGISTERED':
    default:
      return (
        <span className={`inline-flex items-center rounded-full bg-gray-100 text-gray-700 ring-1 ring-gray-600/20 ${sizeClasses[size]}`}>
          <AlertCircle size={iconSizes[size]} className="text-gray-500" />
          Registered
        </span>
      );
  }
};
