export type VisitorType = 'EXTERNAL_STUDENT' | 'PARENT';

export type VisitorStatus =
  | 'REGISTERED'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'INSIDE_CAMPUS'
  | 'CHECKED_OUT'
  | 'REJECTED';

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type UserRole = 'ADMIN' | 'FACULTY' | 'SECURITY';

export interface Visitor {
  visitorId: string;
  name: string;
  phone: string;
  email: string;
  visitorType: VisitorType;
  
  // External Student Fields
  collegeName?: string;
  studentId?: string;
  department?: string;
  eventName?: string;
  eventDate?: string;
  
  // Parent Fields
  studentName?: string;
  relationship?: string;
  
  // Common fields
  purpose: string;
  hostName: string;
  visitDate: string;
  status: VisitorStatus;
  approvalStatus: ApprovalStatus;
  qrToken: string;
  entryTime: string | null;
  exitTime: string | null;
  createdAt: string;
  updatedAt: string;
  registeredBy?: string;
  approvedBy?: string | null;
  approvalRemarks?: string | null;
  securityAssisted: boolean;
}

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  department?: string;
  email?: string;
  phone?: string;
  badgeId?: string;
  createdAt: string;
}

export interface SystemStats {
  totalVisitors: number;
  todayVisitors: number;
  pendingApprovals: number;
  approvedVisitors: number;
  currentlyInside: number;
  checkedOut: number;
  externalStudents: number;
  parents: number;
  rejectedVisitors: number;
}

export interface ScanResult {
  success: boolean;
  action: 'ENTRY' | 'EXIT' | 'NONE';
  message: string;
  status: VisitorStatus;
  visitor?: Visitor;
  errorCode?: 'INVALID_QR' | 'NOT_FOUND' | 'PENDING_APPROVAL' | 'REJECTED' | 'ALREADY_CHECKED_OUT' | 'INTERNAL_ERROR';
}
