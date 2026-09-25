import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    // Redirect to the corresponding login page based on target role
    let redirectPath = '/admin/login';
    if (allowedRoles.includes('SECURITY')) redirectPath = '/security/login';
    else if (allowedRoles.includes('FACULTY')) redirectPath = '/faculty/login';

    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl max-w-md">
          <h2 className="text-lg font-bold text-rose-800">403 - Unauthorized Access</h2>
          <p className="text-sm text-rose-600 mt-2">
            Your account ({user.role}) does not have permission to view this section.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Go Back
            </button>
            <a
              href="/"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Go to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
