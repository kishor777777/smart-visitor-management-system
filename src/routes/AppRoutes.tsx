import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { PortalLayout } from '../layouts/PortalLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Public Visitor Pages
import { Home } from '../pages/Home';
import { StudentRegister } from '../pages/StudentRegister';
import { ParentRegister } from '../pages/ParentRegister';
import { VisitorStatus } from '../pages/VisitorStatus';
import { VisitorPass } from '../pages/VisitorPass';

// Security Portal Pages
import { SecurityLogin } from '../pages/security/SecurityLogin';
import { SecurityDashboard } from '../pages/security/SecurityDashboard';
import { SecurityScanner } from '../pages/security/SecurityScanner';
import { SecurityAssistedRegistration } from '../pages/security/SecurityAssistedRegistration';
import { SecurityAssistedStudentRegistration } from '../pages/security/SecurityAssistedStudentRegistration';
import { SecurityVisitors } from '../pages/security/SecurityVisitors';
import { SecurityHistory } from '../pages/security/SecurityHistory';

// Faculty Portal Pages
import { FacultyLogin } from '../pages/faculty/FacultyLogin';
import { FacultyDashboard } from '../pages/faculty/FacultyDashboard';
import { FacultyRequests } from '../pages/faculty/FacultyRequests';

// Admin Portal Pages
import { AdminLogin } from '../pages/admin/AdminLogin';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminVisitors } from '../pages/admin/AdminVisitors';
import { AdminHistory } from '../pages/admin/AdminHistory';
import { AdminReports } from '../pages/admin/AdminReports';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/student/register" element={<StudentRegister />} />
        <Route path="/parent/register" element={<ParentRegister />} />
        <Route path="/visitor/status" element={<VisitorStatus />} />
        <Route path="/visitor/pass" element={<VisitorPass />} />

        {/* Public Login Pages */}
        <Route path="/security/login" element={<SecurityLogin />} />
        <Route path="/faculty/login" element={<FacultyLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Route>

      {/* Security Staff Portal (Protected) */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['SECURITY', 'ADMIN']}>
            <PortalLayout portalRole="SECURITY" />
          </ProtectedRoute>
        }
      >
        <Route path="/security/dashboard" element={<SecurityDashboard />} />
        <Route path="/security/scanner" element={<SecurityScanner />} />
        <Route path="/security/assisted-student-registration" element={<SecurityAssistedStudentRegistration />} />
        <Route path="/security/assisted-registration" element={<SecurityAssistedRegistration />} />
        <Route path="/security/visitors" element={<SecurityVisitors />} />
        <Route path="/security/history" element={<SecurityHistory />} />
      </Route>

      {/* Faculty Portal (Protected) */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
            <PortalLayout portalRole="FACULTY" />
          </ProtectedRoute>
        }
      >
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        <Route path="/faculty/requests" element={<FacultyRequests />} />
      </Route>

      {/* Admin Portal (Protected) */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <PortalLayout portalRole="ADMIN" />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/visitors" element={<AdminVisitors />} />
        <Route path="/admin/history" element={<AdminHistory />} />
        <Route path="/admin/reports" element={<AdminReports />} />
      </Route>

      {/* Fallback Catch-all Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
