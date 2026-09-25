import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { db } from './db';
import { Visitor, VisitorType, VisitorStatus } from './types';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory SSE connections for live push notifications
interface SseClient {
  id: number;
  res: Response;
}

let sseClients: SseClient[] = [];
let nextClientId = 1;

export function broadcastEvent(event: string, data: any) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.res.write(payload);
    } catch (e) {
      // client may have disconnected
    }
  });
}

// Real-time SSE endpoint
app.get('/api/events', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders?.();

  const clientId = nextClientId++;
  const newClient: SseClient = { id: clientId, res };
  sseClients.push(newClient);

  // Send initial ping
  res.write(`event: connected\ndata: ${JSON.stringify({ clientId, timestamp: new Date().toISOString() })}\n\n`);

  req.on('close', () => {
    sseClients = sseClients.filter((c) => c.id !== clientId);
  });
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    system: 'Web-Based Smart Visitor Management System with QR Authentication',
    database: 'Neon PostgreSQL',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Auth Login
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await db.findUserByUsername(username);

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    if (role && user.role !== role) {
      return res.status(403).json({ error: `Access denied. User does not have ${role} role permissions.` });
    }

    const { password: _, ...userWithoutPassword } = user;
    return res.json({
      success: true,
      user: userWithoutPassword,
      token: `token-${user.id}-${Date.now()}`,
    });
  } catch (err: any) {
    console.error('Error in /api/auth/login:', err.message);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
});

// Get all visitors with filtering & search
app.get('/api/visitors', async (req: Request, res: Response) => {
  try {
    let list = await db.getAllVisitors();
    const { search, type, status, approvalStatus, date } = req.query;

    if (search && typeof search === 'string') {
      const q = search.trim().toLowerCase();
      list = list.filter((v) =>
        v.name.toLowerCase().includes(q) ||
        v.visitorId.toLowerCase().includes(q) ||
        v.phone.toLowerCase().includes(q) ||
        v.email.toLowerCase().includes(q) ||
        (v.collegeName && v.collegeName.toLowerCase().includes(q)) ||
        (v.studentId && v.studentId.toLowerCase().includes(q)) ||
        (v.eventName && v.eventName.toLowerCase().includes(q)) ||
        (v.studentName && v.studentName.toLowerCase().includes(q)) ||
        (v.hostName && v.hostName.toLowerCase().includes(q))
      );
    }

    if (type && typeof type === 'string' && type !== 'ALL') {
      list = list.filter((v) => v.visitorType === type);
    }

    if (status && typeof status === 'string' && status !== 'ALL') {
      list = list.filter((v) => v.status === status);
    }

    if (approvalStatus && typeof approvalStatus === 'string' && approvalStatus !== 'ALL') {
      list = list.filter((v) => v.approvalStatus === approvalStatus);
    }

    if (date && typeof date === 'string') {
      list = list.filter((v) => {
        const vDate = (v.visitDate || v.createdAt || '').slice(0, 10);
        return vDate === date;
      });
    }

    return res.json({
      visitors: list,
      total: list.length,
    });
  } catch (err: any) {
    console.error('Error in GET /api/visitors:', err.message);
    return res.status(500).json({ error: 'Failed to fetch visitors' });
  }
});

// Get visitor by ID or QR Token
app.get('/api/visitors/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let visitor = await db.findVisitorById(id);
    if (!visitor) {
      visitor = await db.findVisitorByQrToken(id);
    }

    if (!visitor) {
      return res.status(404).json({ error: 'Visitor not found' });
    }

    return res.json({ visitor });
  } catch (err: any) {
    console.error('Error in GET /api/visitors/:id:', err.message);
    return res.status(500).json({ error: 'Failed to fetch visitor' });
  }
});

// External Student Registration
app.post('/api/visitors/student-register', async (req: Request, res: Response) => {
  try {
    const {
      name,
      phone,
      email,
      collegeName,
      studentId,
      department,
      eventName,
      eventDate,
      purpose,
      hostName,
      remarks,
    } = req.body;

    // Basic validation
    if (!name || !phone || !email || !collegeName || !studentId || !eventName || !purpose) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const visitDate = eventDate || new Date().toISOString().split('T')[0];

    // For planned college events, registrations can be auto-approved
    const visitor = await db.createVisitor({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      visitorType: 'EXTERNAL_STUDENT',
      collegeName: collegeName.trim(),
      studentId: studentId.trim().toUpperCase(),
      department: department ? department.trim() : 'General',
      eventName: eventName.trim(),
      eventDate: visitDate,
      purpose: purpose.trim(),
      hostName: hostName ? hostName.trim() : 'Event Coordinator',
      visitDate,
      status: 'PENDING_APPROVAL',
      approvalStatus: 'PENDING',
      registeredBy: 'SELF',
      approvedBy: null,
      approvalRemarks: remarks || null,
      securityAssisted: false,
    });

    const stats = await db.getStats();
    broadcastEvent('visitor_registered', { visitor });
    broadcastEvent('stats_updated', stats);

    return res.status(201).json({
      success: true,
      message: 'Student registration submitted successfully! Awaiting faculty approval.',
      visitor,
    });
  } catch (err: any) {
    console.error('Error in student-register:', err.message);
    return res.status(500).json({ error: 'Failed to register student visitor' });
  }
});

// Parent Registration (Direct or Security-Assisted)
app.post('/api/visitors/parent-register', async (req: Request, res: Response) => {
  try {
    const {
      name,
      phone,
      email,
      studentName,
      studentId,
      studentDepartment,
      relationship,
      purpose,
      hostName,
      visitDate,
      remarks,
      securityAssisted,
      securityStaffId,
    } = req.body;

    // Basic validation
    if (!name || !phone || !studentName || !purpose) {
      return res.status(400).json({ error: 'Parent Name, Phone, Student Name, and Purpose are required' });
    }

    const targetVisitDate = visitDate || new Date().toISOString().split('T')[0];
    const isAssisted = Boolean(securityAssisted);

    const visitor = await db.createVisitor({
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim().toLowerCase() : (isAssisted ? 'parent-offline@gate.campus.edu' : ''),
      visitorType: 'PARENT',
      studentName: studentName.trim(),
      studentId: studentId ? studentId.trim().toUpperCase() : 'N/A',
      department: studentDepartment ? studentDepartment.trim() : 'Unspecified',
      relationship: relationship ? relationship.trim() : 'Parent / Guardian',
      purpose: purpose.trim(),
      hostName: hostName ? hostName.trim() : 'Department Faculty',
      visitDate: targetVisitDate,
      status: 'PENDING_APPROVAL',
      approvalStatus: 'PENDING',
      registeredBy: isAssisted ? (securityStaffId || 'SEC-ASSIST') : 'SELF',
      approvedBy: null,
      approvalRemarks: remarks || null,
      securityAssisted: isAssisted,
    });

    const stats = await db.getStats();
    broadcastEvent('visitor_registered', { visitor });
    broadcastEvent('stats_updated', stats);

    return res.status(201).json({
      success: true,
      message: isAssisted
        ? 'Security assisted registration recorded. Request submitted for Faculty approval.'
        : 'Parent registration submitted successfully! Awaiting faculty approval.',
      visitor,
    });
  } catch (err: any) {
    console.error('Error in parent-register:', err.message);
    return res.status(500).json({ error: 'Failed to register parent visitor' });
  }
});

// Faculty Approval / Rejection
app.put('/api/visitors/:id/approval', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { approvalStatus, approvedBy, remarks } = req.body;

    if (approvalStatus !== 'APPROVED' && approvalStatus !== 'REJECTED') {
      return res.status(400).json({ error: 'approvalStatus must be APPROVED or REJECTED' });
    }

    const updated = await db.updateApproval(id, approvalStatus, approvedBy || 'Faculty', remarks);

    if (!updated) {
      return res.status(404).json({ error: 'Visitor not found' });
    }

    const stats = await db.getStats();
    broadcastEvent('visitor_approved', { visitor: updated });
    broadcastEvent('stats_updated', stats);

    return res.json({
      success: true,
      message: `Visitor request ${approvalStatus.toLowerCase()} successfully`,
      visitor: updated,
    });
  } catch (err: any) {
    console.error('Error in /api/visitors/:id/approval:', err.message);
    return res.status(500).json({ error: 'Failed to update approval status' });
  }
});

// Security QR Code Scanner Processing (Core Logic)
app.post('/api/visitors/scan', async (req: Request, res: Response) => {
  try {
    const { qrPayload, scannedBy } = req.body;

    if (!qrPayload) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Visitor QR: Payload cannot be empty',
        errorCode: 'INVALID_QR',
      });
    }

    const result = await db.processQrScan(qrPayload, scannedBy || 'SEC-GATE');

    // If scan altered state (ENTRY or EXIT), broadcast real-time event!
    if (result.success) {
      const stats = await db.getStats();
      broadcastEvent('scan_completed', {
        action: result.action,
        visitor: result.visitor,
        timestamp: new Date().toISOString(),
      });
      broadcastEvent('stats_updated', stats);
    }

    // Choose appropriate HTTP status code
    if (!result.success) {
      if (result.errorCode === 'NOT_FOUND') {
        return res.status(404).json(result);
      }
      return res.status(400).json(result);
    }

    return res.json(result);
  } catch (err: any) {
    console.error('Error in /api/visitors/scan:', err.message);
    return res.status(500).json({
      success: false,
      action: 'NONE',
      message: 'Server error processing QR scan',
      status: 'REGISTERED',
      errorCode: 'INTERNAL_ERROR',
    });
  }
});

// System Stats
app.get('/api/stats', async (_req: Request, res: Response) => {
  try {
    const stats = await db.getStats();
    return res.json({
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Error in /api/stats:', err.message);
    return res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Admin Reset to Demo Defaults
app.post('/api/admin/reset', async (_req: Request, res: Response) => {
  try {
    await db.resetToDefaults();
    const stats = await db.getStats();
    broadcastEvent('system_reset', {});
    broadcastEvent('stats_updated', stats);
    return res.json({ success: true, message: 'System database reset to initial demo state' });
  } catch (err: any) {
    console.error('Error in /api/admin/reset:', err.message);
    return res.status(500).json({ error: 'Failed to reset database' });
  }
});

// Serve frontend dist if available
const DIST_DIR = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.use((req: Request, res: Response) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(DIST_DIR, 'index.html'));
    } else {
      res.status(404).json({ error: 'API route not found' });
    }
  });
}

// Initialize database and start server
async function startServer() {
  await db.init();

  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`Smart Visitor Management System API Server`);
    console.log(`Running on http://localhost:${PORT}`);
    console.log(`Database engine: Neon PostgreSQL`);
    console.log(`==================================================`);
  });
}

startServer();
