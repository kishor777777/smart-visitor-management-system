import 'dotenv/config';
import pg from 'pg';
import { Visitor, User, SystemStats, ScanResult } from './types';

const { Pool } = pg;

function mapVisitor(row: any): Visitor {
  return {
    visitorId: row.visitor_id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    visitorType: row.visitor_type,
    collegeName: row.college_name || undefined,
    studentId: row.student_id || undefined,
    department: row.department || undefined,
    eventName: row.event_name || undefined,
    eventDate: row.event_date || undefined,
    studentName: row.student_name || undefined,
    relationship: row.relationship || undefined,
    purpose: row.purpose,
    hostName: row.host_name,
    visitDate: row.visit_date,
    status: row.status,
    approvalStatus: row.approval_status,
    qrToken: row.qr_token,
    entryTime: row.entry_time || null,
    exitTime: row.exit_time || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    registeredBy: row.registered_by || undefined,
    approvedBy: row.approved_by || null,
    approvalRemarks: row.approval_remarks || null,
    securityAssisted: Boolean(row.security_assisted),
  };
}

function mapUser(row: any): User {
  return {
    id: row.id,
    username: row.username,
    password: row.password || undefined,
    name: row.name,
    role: row.role,
    department: row.department || undefined,
    email: row.email || undefined,
    phone: row.phone || undefined,
    badgeId: row.badge_id || undefined,
    createdAt: row.created_at,
  };
}

function getSeedUsers(): User[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'USR-ADMIN-01',
      username: 'admin',
      password: 'admin123',
      name: 'Dr. Sarah Jenkins',
      role: 'ADMIN',
      department: 'Campus Administration',
      email: 'admin@campus.edu',
      phone: '+91 98765 43210',
      createdAt: now,
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
      createdAt: now,
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
      createdAt: now,
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
      createdAt: now,
    },
  ];
}

function getSeedVisitors(): Visitor[] {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
  const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
  const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString();

  return [
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
      createdAt: threeHoursAgo,
      updatedAt: threeHoursAgo,
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
      createdAt: twoHoursAgo,
      updatedAt: twoHoursAgo,
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
  ];
}

class Database {
  private pool: pg.Pool;
  private initialized: boolean = false;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const isLocalhost = connectionString ? connectionString.includes('localhost') || connectionString.includes('127.0.0.1') : false;

    this.pool = new Pool({
      connectionString,
      ssl: isLocalhost ? false : { rejectUnauthorized: false },
    });

    this.pool.on('error', (err) => {
      console.error('[Database Pool Error]:', err.message);
    });
  }

  public async init(): Promise<void> {
    if (this.initialized) return;

    if (!process.env.DATABASE_URL) {
      console.warn('[Database] WARNING: DATABASE_URL environment variable is not defined.');
      console.warn('[Database] Please provide DATABASE_URL in your .env file or environment settings.');
      return;
    }

    try {
      console.log('[Database] Connecting to PostgreSQL database...');
      const client = await this.pool.connect();
      try {
        await client.query(`
          CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            password TEXT,
            name TEXT NOT NULL,
            role TEXT NOT NULL,
            department TEXT,
            email TEXT,
            phone TEXT,
            badge_id TEXT,
            created_at TEXT NOT NULL
          );

          CREATE TABLE IF NOT EXISTS visitors (
            visitor_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT NOT NULL,
            visitor_type TEXT NOT NULL,
            college_name TEXT,
            student_id TEXT,
            department TEXT,
            event_name TEXT,
            event_date TEXT,
            student_name TEXT,
            relationship TEXT,
            purpose TEXT NOT NULL,
            host_name TEXT NOT NULL,
            visit_date TEXT NOT NULL,
            status TEXT NOT NULL,
            approval_status TEXT NOT NULL,
            qr_token TEXT NOT NULL UNIQUE,
            entry_time TEXT,
            exit_time TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            registered_by TEXT,
            approved_by TEXT,
            approval_remarks TEXT,
            security_assisted BOOLEAN NOT NULL DEFAULT false
          );

          CREATE TABLE IF NOT EXISTS counters (
            name TEXT PRIMARY KEY,
            value INTEGER NOT NULL
          );
        `);

        // Check if seeding is required
        const usersCountRes = await client.query('SELECT COUNT(*)::int AS count FROM users;');
        if (usersCountRes.rows[0].count === 0) {
          console.log('[Database] Seeding initial users...');
          for (const u of getSeedUsers()) {
            await client.query(
              `INSERT INTO users (id, username, password, name, role, department, email, phone, badge_id, created_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
               ON CONFLICT (id) DO NOTHING;`,
              [u.id, u.username, u.password || null, u.name, u.role, u.department || null, u.email || null, u.phone || null, u.badgeId || null, u.createdAt]
            );
          }
        }

        const visitorsCountRes = await client.query('SELECT COUNT(*)::int AS count FROM visitors;');
        if (visitorsCountRes.rows[0].count === 0) {
          console.log('[Database] Seeding initial visitors...');
          for (const v of getSeedVisitors()) {
            await client.query(
              `INSERT INTO visitors (
                visitor_id, name, phone, email, visitor_type,
                college_name, student_id, department, event_name, event_date,
                student_name, relationship, purpose, host_name, visit_date,
                status, approval_status, qr_token, entry_time, exit_time,
                created_at, updated_at, registered_by, approved_by, approval_remarks,
                security_assisted
              ) VALUES (
                $1, $2, $3, $4, $5,
                $6, $7, $8, $9, $10,
                $11, $12, $13, $14, $15,
                $16, $17, $18, $19, $20,
                $21, $22, $23, $24, $25,
                $26
              ) ON CONFLICT (visitor_id) DO NOTHING;`,
              [
                v.visitorId, v.name, v.phone, v.email, v.visitorType,
                v.collegeName || null, v.studentId || null, v.department || null, v.eventName || null, v.eventDate || null,
                v.studentName || null, v.relationship || null, v.purpose, v.hostName, v.visitDate,
                v.status, v.approvalStatus, v.qrToken, v.entryTime || null, v.exitTime || null,
                v.createdAt, v.updatedAt, v.registeredBy || null, v.approvedBy || null, v.approvalRemarks || null,
                v.securityAssisted
              ]
            );
          }
        }

        // Initialize counters if not set
        await client.query(`
          INSERT INTO counters (name, value) VALUES
            ('visitor', 1006),
            ('student', 1004),
            ('parent', 1003)
          ON CONFLICT (name) DO NOTHING;
        `);

        this.initialized = true;
        console.log('[Database] Connected to PostgreSQL and tables initialized successfully.');
      } finally {
        client.release();
      }
    } catch (err: any) {
      console.error('[Database] Failed to initialize PostgreSQL:', err.message);
    }
  }

  public async resetToDefaults(): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM visitors;');
      await client.query('DELETE FROM users;');
      await client.query('DELETE FROM counters;');

      for (const u of getSeedUsers()) {
        await client.query(
          `INSERT INTO users (id, username, password, name, role, department, email, phone, badge_id, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
          [u.id, u.username, u.password || null, u.name, u.role, u.department || null, u.email || null, u.phone || null, u.badgeId || null, u.createdAt]
        );
      }

      for (const v of getSeedVisitors()) {
        await client.query(
          `INSERT INTO visitors (
            visitor_id, name, phone, email, visitor_type,
            college_name, student_id, department, event_name, event_date,
            student_name, relationship, purpose, host_name, visit_date,
            status, approval_status, qr_token, entry_time, exit_time,
            created_at, updated_at, registered_by, approved_by, approval_remarks,
            security_assisted
          ) VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15,
            $16, $17, $18, $19, $20,
            $21, $22, $23, $24, $25,
            $26
          );`,
          [
            v.visitorId, v.name, v.phone, v.email, v.visitorType,
            v.collegeName || null, v.studentId || null, v.department || null, v.eventName || null, v.eventDate || null,
            v.studentName || null, v.relationship || null, v.purpose, v.hostName, v.visitDate,
            v.status, v.approvalStatus, v.qrToken, v.entryTime || null, v.exitTime || null,
            v.createdAt, v.updatedAt, v.registeredBy || null, v.approvedBy || null, v.approvalRemarks || null,
            v.securityAssisted
          ]
        );
      }

      await client.query(`
        INSERT INTO counters (name, value) VALUES
          ('visitor', 1006),
          ('student', 1004),
          ('parent', 1003);
      `);

      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  // --- Users ---
  public async getUsers(): Promise<User[]> {
    const res = await this.pool.query('SELECT * FROM users ORDER BY created_at ASC;');
    return res.rows.map(mapUser);
  }

  public async findUserByUsername(username: string): Promise<User | undefined> {
    const clean = username.trim().toLowerCase();
    const res = await this.pool.query(
      'SELECT * FROM users WHERE LOWER(username) = $1 LIMIT 1;',
      [clean]
    );
    if (res.rows.length === 0) return undefined;
    return mapUser(res.rows[0]);
  }

  // --- Visitors ---
  public async getAllVisitors(): Promise<Visitor[]> {
    const res = await this.pool.query('SELECT * FROM visitors ORDER BY created_at DESC;');
    return res.rows.map(mapVisitor);
  }

  public async findVisitorById(visitorId: string): Promise<Visitor | undefined> {
    const clean = visitorId.trim().toUpperCase();
    const res = await this.pool.query(
      'SELECT * FROM visitors WHERE UPPER(visitor_id) = $1 LIMIT 1;',
      [clean]
    );
    if (res.rows.length === 0) return undefined;
    return mapVisitor(res.rows[0]);
  }

  public async findVisitorByQrToken(token: string): Promise<Visitor | undefined> {
    const clean = token.trim();
    const res = await this.pool.query(
      'SELECT * FROM visitors WHERE qr_token = $1 OR UPPER(visitor_id) = UPPER($1) LIMIT 1;',
      [clean]
    );
    if (res.rows.length === 0) return undefined;
    return mapVisitor(res.rows[0]);
  }

  public async createVisitor(
    payload: Omit<Visitor, 'visitorId' | 'qrToken' | 'createdAt' | 'updatedAt' | 'entryTime' | 'exitTime'>
  ): Promise<Visitor> {
    const now = new Date().toISOString();
    let prefix = 'VIS';
    let counterKey = 'visitor';

    if (payload.visitorType === 'EXTERNAL_STUDENT') {
      prefix = 'EXT';
      counterKey = 'student';
    } else {
      prefix = 'PAR';
      counterKey = 'parent';
    }

    // Atomically increment specific counter and general visitor counter
    const counterRes = await this.pool.query(
      `INSERT INTO counters (name, value) VALUES ($1, 1001)
       ON CONFLICT (name) DO UPDATE SET value = counters.value + 1
       RETURNING value;`,
      [counterKey]
    );
    await this.pool.query(
      `INSERT INTO counters (name, value) VALUES ('visitor', 1001)
       ON CONFLICT (name) DO UPDATE SET value = counters.value + 1;`
    );

    const counterNum = counterRes.rows[0].value;
    const visitorId = `${prefix}-${counterNum}`;

    const safeName = payload.name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 10);
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const qrToken = `QR-${visitorId}-${safeName}-${randomSuffix}`;

    const insertSql = `
      INSERT INTO visitors (
        visitor_id, name, phone, email, visitor_type,
        college_name, student_id, department, event_name, event_date,
        student_name, relationship, purpose, host_name, visit_date,
        status, approval_status, qr_token, entry_time, exit_time,
        created_at, updated_at, registered_by, approved_by, approval_remarks,
        security_assisted
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20,
        $21, $22, $23, $24, $25,
        $26
      ) RETURNING *;
    `;

    const values = [
      visitorId,
      payload.name,
      payload.phone,
      payload.email,
      payload.visitorType,
      payload.collegeName || null,
      payload.studentId || null,
      payload.department || null,
      payload.eventName || null,
      payload.eventDate || null,
      payload.studentName || null,
      payload.relationship || null,
      payload.purpose,
      payload.hostName,
      payload.visitDate,
      payload.status,
      payload.approvalStatus,
      qrToken,
      null,
      null,
      now,
      now,
      payload.registeredBy || null,
      payload.approvedBy || null,
      payload.approvalRemarks || null,
      Boolean(payload.securityAssisted),
    ];

    const res = await this.pool.query(insertSql, values);
    return mapVisitor(res.rows[0]);
  }

  public async updateVisitor(visitorId: string, updates: Partial<Visitor>): Promise<Visitor | null> {
    const existing = await this.findVisitorById(visitorId);
    if (!existing) return null;

    const merged: Visitor = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updateSql = `
      UPDATE visitors SET
        name = $1,
        phone = $2,
        email = $3,
        visitor_type = $4,
        college_name = $5,
        student_id = $6,
        department = $7,
        event_name = $8,
        event_date = $9,
        student_name = $10,
        relationship = $11,
        purpose = $12,
        host_name = $13,
        visit_date = $14,
        status = $15,
        approval_status = $16,
        qr_token = $17,
        entry_time = $18,
        exit_time = $19,
        updated_at = $20,
        registered_by = $21,
        approved_by = $22,
        approval_remarks = $23,
        security_assisted = $24
      WHERE UPPER(visitor_id) = UPPER($25)
      RETURNING *;
    `;

    const values = [
      merged.name,
      merged.phone,
      merged.email,
      merged.visitorType,
      merged.collegeName || null,
      merged.studentId || null,
      merged.department || null,
      merged.eventName || null,
      merged.eventDate || null,
      merged.studentName || null,
      merged.relationship || null,
      merged.purpose,
      merged.hostName,
      merged.visitDate,
      merged.status,
      merged.approvalStatus,
      merged.qrToken,
      merged.entryTime || null,
      merged.exitTime || null,
      merged.updatedAt,
      merged.registeredBy || null,
      merged.approvedBy || null,
      merged.approvalRemarks || null,
      merged.securityAssisted,
      visitorId.trim(),
    ];

    const res = await this.pool.query(updateSql, values);
    if (res.rows.length === 0) return null;
    return mapVisitor(res.rows[0]);
  }

  public async updateApproval(
    visitorId: string,
    approvalStatus: 'APPROVED' | 'REJECTED',
    approvedBy: string,
    remarks?: string
  ): Promise<Visitor | null> {
    const visitor = await this.findVisitorById(visitorId);
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
   */
  public async processQrScan(scannedPayload: string, scannedBy: string): Promise<ScanResult> {
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

    const visitor = await this.findVisitorByQrToken(token);
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
      const updated = await this.updateVisitor(visitor.visitorId, {
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
      const updated = await this.updateVisitor(visitor.visitorId, {
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

    // Other cases
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
  public async getStats(): Promise<SystemStats> {
    const today = new Date().toISOString().split('T')[0];

    const res = await this.pool.query(
      `SELECT
        COUNT(*)::int AS "totalVisitors",
        COUNT(*) FILTER (WHERE substring(visit_date from 1 for 10) = $1 OR substring(created_at from 1 for 10) = $1)::int AS "todayVisitors",
        COUNT(*) FILTER (WHERE status = 'PENDING_APPROVAL')::int AS "pendingApprovals",
        COUNT(*) FILTER (WHERE approval_status = 'APPROVED')::int AS "approvedVisitors",
        COUNT(*) FILTER (WHERE status = 'INSIDE_CAMPUS')::int AS "currentlyInside",
        COUNT(*) FILTER (WHERE status = 'CHECKED_OUT')::int AS "checkedOut",
        COUNT(*) FILTER (WHERE visitor_type = 'EXTERNAL_STUDENT')::int AS "externalStudents",
        COUNT(*) FILTER (WHERE visitor_type = 'PARENT')::int AS "parents",
        COUNT(*) FILTER (WHERE status = 'REJECTED')::int AS "rejectedVisitors"
      FROM visitors;`,
      [today]
    );

    const row = res.rows[0] || {};
    return {
      totalVisitors: row.totalVisitors || 0,
      todayVisitors: row.todayVisitors || 0,
      pendingApprovals: row.pendingApprovals || 0,
      approvedVisitors: row.approvedVisitors || 0,
      currentlyInside: row.currentlyInside || 0,
      checkedOut: row.checkedOut || 0,
      externalStudents: row.externalStudents || 0,
      parents: row.parents || 0,
      rejectedVisitors: row.rejectedVisitors || 0,
    };
  }
}

export const db = new Database();
