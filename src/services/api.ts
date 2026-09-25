import { Visitor, ScanResult, SystemStats, User } from '../types';

const API_BASE = '/api';

export const api = {
  // Auth
  async login(username: string, password: string, role?: string): Promise<{ success: boolean; user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Authentication failed');
    }
    return data;
  },

  // Visitors
  async getVisitors(params?: {
    search?: string;
    type?: string;
    status?: string;
    approvalStatus?: string;
    date?: string;
  }): Promise<{ visitors: Visitor[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.type && params.type !== 'ALL') query.append('type', params.type);
    if (params?.status && params.status !== 'ALL') query.append('status', params.status);
    if (params?.approvalStatus && params.approvalStatus !== 'ALL') query.append('approvalStatus', params.approvalStatus);
    if (params?.date) query.append('date', params.date);

    const res = await fetch(`${API_BASE}/visitors?${query.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch visitors');
    return data;
  },

  async getVisitorById(id: string): Promise<Visitor> {
    const res = await fetch(`${API_BASE}/visitors/${encodeURIComponent(id)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Visitor not found');
    return data.visitor;
  },

  async registerStudent(formData: {
    name: string;
    phone: string;
    email?: string;
    collegeName: string;
    studentId: string;
    department?: string;
    eventName: string;
    eventDate?: string;
    purpose: string;
    hostName?: string;
    remarks?: string;
    securityAssisted?: boolean;
    securityStaffId?: string;
  }): Promise<{ success: boolean; message: string; visitor: Visitor }> {
    const res = await fetch(`${API_BASE}/visitors/student-register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  async registerParent(formData: {
    name: string;
    phone: string;
    email?: string;
    studentName: string;
    studentId?: string;
    studentDepartment?: string;
    relationship?: string;
    purpose: string;
    hostName?: string;
    visitDate: string;
    remarks?: string;
    securityAssisted?: boolean;
    securityStaffId?: string;
  }): Promise<{ success: boolean; message: string; visitor: Visitor }> {
    const res = await fetch(`${API_BASE}/visitors/parent-register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  async updateApproval(
    id: string,
    approvalStatus: 'APPROVED' | 'REJECTED',
    approvedBy: string,
    remarks?: string
  ): Promise<{ success: boolean; message: string; visitor: Visitor }> {
    const res = await fetch(`${API_BASE}/visitors/${encodeURIComponent(id)}/approval`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approvalStatus, approvedBy, remarks }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update approval');
    return data;
  },

  async scanQr(qrPayload: string, scannedBy?: string): Promise<ScanResult> {
    const res = await fetch(`${API_BASE}/visitors/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qrPayload, scannedBy }),
    });
    const data = await res.json();
    // Return the response data even for 400/404 so caller can display specific backend message & errorCode
    return data;
  },

  async getStats(): Promise<SystemStats> {
    const res = await fetch(`${API_BASE}/stats`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch stats');
    return data.stats;
  },

  async resetDatabase(): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/admin/reset`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Reset failed');
    return data;
  },
};
