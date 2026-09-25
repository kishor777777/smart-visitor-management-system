import fs from 'fs';
import path from 'path';
import { Visitor, User, SystemStats, ScanResult } from './types';

interface DatabaseSchema {
  visitors: Visitor[];
  users: User[];
  counters: {
    visitor: number;
    student: number;
    parent: number;
  };
}

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getInitialData(): DatabaseSchema {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
  const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
  const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString();

  return {
    counters: {
      visitor: 1006,
      student: 1004,
      parent: 1003,
    },
    users: [
      {
        id: 'USR-ADMIN-01',
        username: 'admin',
        password: 'admin123',
        name: 'Dr. Sarah Jenkins',
        role: 'ADMIN',
        department: 'Campus Administration',
        email: 'admin@campus.edu',
        phone: '+91 98765 43210',
        createdAt: now.toISOString(),
      },
      {
        id: 'USR-FACULTY-01',
        username: 'faculty',
        password: 'faculty123',
        name: 'Prof. Rajesh Sharma',
        role: 'FACULTY',
        department: 'Computer Science & Engineering',
        email: 'r.sharma@campus.edu',
        phone: '+91 98765 43211',
        createdAt: now.toISOString(),
      },
      {
        id: 'USR-FACULTY-02',
        username: 'faculty2',
        password: 'faculty123',
        name: 'Dr. Ananya Iyer',
        role: 'FACULTY',
        department: 'Electronics & Communication',
        email: 'a.iyer@campus.edu',
        phone: '+91 98765 43212',
        createdAt: now.toISOString(),
      },
      {
        id: 'USR-SECURITY-01',
        username: 'security',
        password: 'security123',
        name: 'Officer Vikram Singh',
        role: 'SECURITY',
        badgeId: 'SEC-GATE-01',
        email: 'security.gate1@campus.edu',
        phone: '+91 98765 43213',
        createdAt: now.toISOString(),
      },
    ],
    visitors: [
      // 1. External Student: Arun Kumar (Approved, Not yet checked in - ready for entry scan)
      {
        visitorId: 'EXT-1001',
        name: 'Arun Kumar',
        phone: '+91 98450 12345',
        email: 'arun.kumar@abc.edu',
        visitorType: 'EXTERNAL_STUDENT',
        collegeName: 'ABC Engineering College',
        studentId: 'EXT1001',
        department: 'Information Technology',
        eventName: 'Technical Symposium - TechVista 2026',
        eventDate: todayStr,
        purpose: 'Technical Symposium - Paper Presentation & Project Expo',
        hostName: 'Prof. Rajesh Sharma',
        visitDate: todayStr,
        status: 'APPROVED',
        approvalStatus: 'APPROVED',
        qrToken: 'QR-EXT-1001-ARUN-KUMAR',
        entryTime: null,
        exitTime: null,
        createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        registeredBy: 'SELF',
        approvedBy: 'Auto-Approval (Event Delegate)',
        approvalRemarks: 'Verified symposium registrant',
        securityAssisted: false,
      },
      // 2. Parent: Meena Devi (Pending Approval - ready for faculty review)
      {
        visitorId: 'PAR-1001',
        name: 'Meena Devi',
        phone: '+91 97890 23456',
        email: 'meenadevi.parent@gmail.com',
        visitorType: 'PARENT',
        studentName: 'Kavin',
        studentId: 'CS-2023-42',
        department: 'Computer Science & Engineering',
        relationship: 'Mother',
        purpose: 'Parent Meeting with HOD regarding semester academic progress',
        hostName: 'Prof. Rajesh Sharma',
        visitDate: todayStr,
        status: 'PENDING_APPROVAL',
        approvalStatus: 'PENDING',
        qrToken: 'QR-PAR-1001-MEENA-DEVI',
        entryTime: null,
        exitTime: null,
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        registeredBy: 'SELF',
        approvedBy: null,
        approvalRemarks: null,
        securityAssisted: false,
      },
      // 3. External Student: Priya Sundaram (Inside campus - ready for exit scan)
      {
        visitorId: 'EXT-1002',
        name: 'Priya Sundaram',
        phone: '+91 94433 87654',
        email: 'priya.s@psgtech.ac.in',
        visitorType: 'EXTERNAL_STUDENT',
        collegeName: 'PSG College of Technology',
        studentId: 'EXT1002',
        department: 'Computer Science',
        eventName: '24-Hour AI Hackathon',
        eventDate: todayStr,
        purpose: 'National Hackathon Participant',
        hostName: 'Prof. Rajesh Sharma',
        visitDate: todayStr,
        status: 'INSIDE_CAMPUS',
        approvalStatus: 'APPROVED',
        qrToken: 'QR-EXT-1002-PRIYA-SUNDARAM',
        entryTime: oneHourAgo,
        exitTime: null,
        createdAt: fourHoursAgo,
        updatedAt: oneHourAgo,
        registeredBy: 'SELF',
        approvedBy: 'Symposium Committee',
        approvalRemarks: 'Delegate ID verified',
        securityAssisted: false,
      },
      // 4. External Student: Karthik Raja (Checked out - ready to verify "Already Checked Out")
      {
        visitorId: 'EXT-1003',
        name: 'Karthik Raja',
        phone: '+91 98844 55667',
        email: 'karthik.r@annauniv.edu',
        visitorType: 'EXTERNAL_STUDENT',
        collegeName: 'Anna University',
        studentId: 'EXT1003',
        department: 'Electronics',
        eventName: 'IoT & Robotics Workshop',
        eventDate: todayStr,
        purpose: 'Hands-on Embedded Systems Workshop',
        hostName: 'Dr. Ananya Iyer',
        visitDate: todayStr,
        status: 'CHECKED_OUT',
        approvalStatus: 'APPROVED',
        qrToken: 'QR-EXT-1003-KARTHIK-RAJA',
        entryTime: fourHoursAgo,
        exitTime: oneHourAgo,
        createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
        updatedAt: oneHourAgo,
        registeredBy: 'SELF',
        approvedBy: 'Workshop Coordinator',
        approvalRemarks: 'Workshop attendee',
        securityAssisted: false,
      },
      // 5. Parent: Ramesh Babu (Assisted by Security - Approved)
      {
        visitorId: 'PAR-1002',
        name: 'Ramesh Babu',
        phone: '+91 99401 22334',
        email: 'ramesh.babu@outlook.com',
        visitorType: 'PARENT',
        studentName: 'Sneha R',
        studentId: 'ECE-2024-18',
        department: 'Electronics & Communication',
        relationship: 'Father',
        purpose: 'Fee payment receipt submission & Hostel Warden consultation',
        hostName: 'Dr. Ananya Iyer',
        visitDate: todayStr,
        status: 'APPROVED',
        approvalStatus: 'APPROVED',
        qrToken: 'QR-PAR-1002-RAMESH-BABU',
        entryTime: null,
        exitTime: null,
        createdAt: twoHoursAgo,
        updatedAt: oneHourAgo,
        registeredBy: 'SEC-GATE-01',
        approvedBy: 'Dr. Ananya Iyer',
        approvalRemarks: 'Verified student guardian',
        securityAssisted: true,
      },
      // 6. External Student: David Miller (Rejected)
      {
        visitorId: 'EXT-1004',
        name: 'David Miller',
        phone: '+91 91234 56789',
        email: 'david.m@unknown.com',
        visitorType: 'EXTERNAL_STUDENT',
        collegeName: 'City Polytechnic',
        studentId: 'EXT1004',
        department: 'Civil Engineering',
        eventName: 'Technical Symposium',
        eventDate: todayStr,
        purpose: 'Unregistered visitor',
        hostName: 'Prof. Rajesh Sharma',
        visitDate: todayStr,
        status: 'REJECTED',
        approvalStatus: 'REJECTED',
        qrToken: 'QR-EXT-1004-DAVID-MILLER',
        entryTime: null,
        exitTime: null,
        createdAt: fourHoursAgo,
        updatedAt: threeHoursAgo,
        registeredBy: 'SELF',
        approvedBy: 'Prof. Rajesh Sharma',
        approvalRemarks: 'College ID could not be verified; not registered for symposium',
        securityAssisted: false,
      },
    ],
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error loading db.json, generating fresh defaults:', e);
    }
    const initial = getInitialData();
    this.saveDirect(initial);
    return initial;
  }

  private saveDirect(data: DatabaseSchema): void {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving db.json:', err);
    }
  }

  public save(): void {
    this.saveDirect(this.data);
  }

  public resetToDefaults(): DatabaseSchema {
    this.data = getInitialData();
    this.save();
    return this.data;
  }

  // --- Users ---
  public getUsers(): User[] {
    return this.data.users;
  }

  public findUserByUsername(username: string): User | undefined {
    return this.data.users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );
  }

  // --- Visitors ---
  public getAllVisitors(): Visitor[] {
    return [...this.data.visitors].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public findVisitorById(visitorId: string): Visitor | undefined {
    const clean = visitorId.trim().toUpperCase();
    return this.data.visitors.find(
      (v) => v.visitorId.toUpperCase() === clean
    );
  }

  public findVisitorByQrToken(token: string): Visitor | undefined {
    const clean = token.trim();
    // Allow lookup either by direct qrToken or by visitorId
    return this.data.visitors.find(
      (v) => v.qrToken === clean || v.visitorId.toUpperCase() === clean.toUpperCase()
    );
  }

  public createVisitor(
    payload: Omit<Visitor, 'visitorId' | 'qrToken' | 'createdAt' | 'updatedAt' | 'entryTime' | 'exitTime'>
  ): Visitor {
    const now = new Date().toISOString();
    let prefix = 'VIS';
    if (payload.visitorType === 'EXTERNAL_STUDENT') {
      this.data.counters.student += 1;
      prefix = 'EXT';
    } else {
      this.data.counters.parent += 1;
      prefix = 'PAR';
    }
    this.data.counters.visitor += 1;

    const counterNum = payload.visitorType === 'EXTERNAL_STUDENT'
      ? this.data.counters.student
      : this.data.counters.parent;

    const visitorId = `${prefix}-${counterNum}`;
    
    // Generate secure unique QR token
    const safeName = payload.name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 10);
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const qrToken = `QR-${visitorId}-${safeName}-${randomSuffix}`;

    const newVisitor: Visitor = {
      ...payload,
      visitorId,
      qrToken,
      entryTime: null,
      exitTime: null,
      createdAt: now,
      updatedAt: now,
    };

    this.data.visitors.push(newVisitor);
    this.save();
    return newVisitor;
  }

  public updateVisitor(visitorId: string, updates: Partial<Visitor>): Visitor | null {
    const index = this.data.visitors.findIndex(
      (v) => v.visitorId.toUpperCase() === visitorId.trim().toUpperCase()
    );
    if (index === -1) return null;

    const current = this.data.visitors[index];
    const updated: Visitor = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.data.visitors[index] = updated;
    this.save();
    return updated;
  }

  public updateApproval(
    visitorId: string,
    approvalStatus: 'APPROVED' | 'REJECTED',
    approvedBy: string,
    remarks?: string
  ): Visitor | null {
    const visitor = this.findVisitorById(visitorId);
    if (!visitor) return null;

    const status = approvalStatus === 'APPROVED' ? 'APPROVED' : 'REJECTED';

    return this.updateVisitor(visitorId, {
      approvalStatus,
      status,
      approvedBy,
      approvalRemarks: remarks || (approvalStatus === 'APPROVED' ? 'Approved by Faculty' : 'Rejected by Faculty'),
    });
  }

  /**
   * CRITICAL CORE QR SCANNING LOGIC (Section 4 & 5):
   *
   * The SAME QR is used for both ENTRY and EXIT.
   *
   * Rules:
   * CASE 1: Status = APPROVED
   * -> Record entry time
   * -> Change status to INSIDE_CAMPUS
   * -> Display "Entry Successful"
   *
   * CASE 2: Status = INSIDE_CAMPUS
   * -> Record exit time
   * -> Change status to CHECKED_OUT
   * -> Display "Exit Successful", "Visit Completed"
   *
   * CASE 3: Status = CHECKED_OUT
   * -> Do not update database
   * -> Do not create another exit record
   * -> Display "Already Checked Out"
   *
   * CASE 4: Status = PENDING_APPROVAL
   * -> Do not allow entry
   * -> Display "Visitor is awaiting approval"
   *
   * CASE 5: Status = REJECTED
   * -> Do not allow entry
   * -> Display "Visitor is not approved"
   *
   * CASE 6: Invalid QR
   * -> Display "Invalid Visitor QR"
   *
   * CASE 7: Visitor does not exist
   * -> Display "Visitor Not Found"
   */
  public processQrScan(scannedPayload: string, scannedBy: string): ScanResult {
    const token = scannedPayload.trim();
    if (!token) {
      return {
        success: false,
        action: 'NONE',
        message: 'Invalid Visitor QR: Empty scan payload',
        status: 'REGISTERED',
        errorCode: 'INVALID_QR',
      };
    }

    const visitor = this.findVisitorByQrToken(token);
    if (!visitor) {
      return {
        success: false,
        action: 'NONE',
        message: 'Visitor Not Found. Unrecognized QR Code or Visitor ID.',
        status: 'REGISTERED',
        errorCode: 'NOT_FOUND',
      };
    }

    const nowIso = new Date().toISOString();

    // CASE 3: Status = CHECKED_OUT
    if (visitor.status === 'CHECKED_OUT') {
      return {
        success: false,
        action: 'NONE',
        message: 'Already Checked Out. This visitor has already exited campus.',
        status: 'CHECKED_OUT',
        visitor,
        errorCode: 'ALREADY_CHECKED_OUT',
      };
    }

    // CASE 4: Status = PENDING_APPROVAL
    if (visitor.status === 'PENDING_APPROVAL') {
      return {
        success: false,
        action: 'NONE',
        message: 'Visitor is awaiting approval. Entry cannot be permitted until Faculty approves the request.',
        status: 'PENDING_APPROVAL',
        visitor,
        errorCode: 'PENDING_APPROVAL',
      };
    }

    // CASE 5: Status = REJECTED
    if (visitor.status === 'REJECTED') {
      return {
        success: false,
        action: 'NONE',
        message: 'Visitor is not approved. Registration request was rejected.',
        status: 'REJECTED',
        visitor,
        errorCode: 'REJECTED',
      };
    }

    // CASE 1: Status = APPROVED (First scan -> ENTRY)
    if (visitor.status === 'APPROVED') {
      const updated = this.updateVisitor(visitor.visitorId, {
        status: 'INSIDE_CAMPUS',
        entryTime: nowIso,
      });

      return {
        success: true,
        action: 'ENTRY',
        message: 'Entry Successful. Welcome to campus!',
        status: 'INSIDE_CAMPUS',
        visitor: updated || visitor,
      };
    }

    // CASE 2: Status = INSIDE_CAMPUS (Second scan using SAME QR -> EXIT)
    if (visitor.status === 'INSIDE_CAMPUS') {
      const updated = this.updateVisitor(visitor.visitorId, {
        status: 'CHECKED_OUT',
        exitTime: nowIso,
      });

      return {
        success: true,
        action: 'EXIT',
        message: 'Exit Successful. Visit Completed.',
        status: 'CHECKED_OUT',
        visitor: updated || visitor,
      };
    }

    // Other cases (e.g. raw REGISTERED without approval)
    return {
      success: false,
      action: 'NONE',
      message: 'Visitor is awaiting approval',
      status: visitor.status,
      visitor,
      errorCode: 'PENDING_APPROVAL',
    };
  }

  // --- Statistics calculation ---
  public getStats(): SystemStats {
    const visitors = this.data.visitors;
    const today = new Date().toISOString().split('T')[0];

    const todayVisitors = visitors.filter((v) => {
      const vDate = (v.visitDate || v.createdAt || '').slice(0, 10);
      return vDate === today;
    }).length;

    const pendingApprovals = visitors.filter((v) => v.status === 'PENDING_APPROVAL').length;
    const approvedVisitors = visitors.filter((v) => v.approvalStatus === 'APPROVED').length;
    const currentlyInside = visitors.filter((v) => v.status === 'INSIDE_CAMPUS').length;
    const checkedOut = visitors.filter((v) => v.status === 'CHECKED_OUT').length;
    const externalStudents = visitors.filter((v) => v.visitorType === 'EXTERNAL_STUDENT').length;
    const parents = visitors.filter((v) => v.visitorType === 'PARENT').length;
    const rejectedVisitors = visitors.filter((v) => v.status === 'REJECTED').length;

    return {
      totalVisitors: visitors.length,
      todayVisitors,
      pendingApprovals,
      approvedVisitors,
      currentlyInside,
      checkedOut,
      externalStudents,
      parents,
      rejectedVisitors,
    };
  }
}

export const db = new Database();
