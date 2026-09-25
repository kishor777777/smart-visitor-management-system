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
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Auth Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = db.findUserByUsername(username);

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
});

// Get all visitors with filtering & search
app.get('/api/visitors', (req: Request, res: Response) => {
  let list = db.getAllVisitors();
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

  res.json({
    visitors: list,
    total: list.length,
  });
});

// Get visitor by ID or QR Token
app.get('/api/visitors/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const visitor = db.findVisitorById(id) || db.findVisitorByQrToken(id);

  if (!visitor) {
    return res.status(404).json({ error: 'Visitor not found' });
  }

  return res.json({ visitor });
});

// External Student Registration
app.post('/api/visitors/student-register', (req: Request, res: Response) => {
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
  const visitor = db.createVisitor({
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
    status: 'APPROVED',
    approvalStatus: 'APPROVED',
    registeredBy: 'SELF',
    approvedBy: 'Auto-Approval (Event Delegate)',
    approvalRemarks: remarks || 'Registered online for campus event',
    securityAssisted: false,
  });

  broadcastEvent('visitor_registered', { visitor });
  broadcastEvent('stats_updated', db.getStats());

  res.status(201).json({
    success: true,
    message: 'Student registered successfully and QR Visitor Pass generated!',
    visitor,
  });
});

// Parent Registration (Direct or Security-Assisted)
app.post('/api/visitors/parent-register', (req: Request, res: Response) => {
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

  const visitor = db.createVisitor({
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

  broadcastEvent('visitor_registered', { visitor });
  broadcastEvent('stats_updated', db.getStats());

  res.status(201).json({
    success: true,
    message: isAssisted
      ? 'Security assisted registration recorded. Request submitted for Faculty approval.'
      : 'Parent registration submitted successfully! Awaiting faculty approval.',
    visitor,
  });
});

// Faculty Approval / Rejection
app.put('/api/visitors/:id/approval', (req: Request, res: Response) => {
  const { id } = req.params;
  const { approvalStatus, approvedBy, remarks } = req.body;

  if (approvalStatus !== 'APPROVED' && approvalStatus !== 'REJECTED') {
    return res.status(400).json({ error: 'approvalStatus must be APPROVED or REJECTED' });
  }

  const updated = db.updateApproval(id, approvalStatus, approvedBy || 'Faculty', remarks);

  if (!updated) {
    return res.status(404).json({ error: 'Visitor not found' });
  }

  broadcastEvent('visitor_approved', { visitor: updated });
  broadcastEvent('stats_updated', db.getStats());

  res.json({
    success: true,
    message: `Visitor request ${approvalStatus.toLowerCase()} successfully`,
    visitor: updated,
  });
});

// Security QR Code Scanner Processing (Core Logic)
app.post('/api/visitors/scan', (req: Request, res: Response) => {
  const { qrPayload, scannedBy } = req.body;

  if (!qrPayload) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Visitor QR: Payload cannot be empty',
      errorCode: 'INVALID_QR',
    });
  }

  const result = db.processQrScan(qrPayload, scannedBy || 'SEC-GATE');

  // If scan altered state (ENTRY or EXIT), broadcast real-time event!
  if (result.success) {
    broadcastEvent('scan_completed', {
      action: result.action,
      visitor: result.visitor,
      timestamp: new Date().toISOString(),
    });
    broadcastEvent('stats_updated', db.getStats());
  }

  // Choose appropriate HTTP status code
  if (!result.success) {
    if (result.errorCode === 'NOT_FOUND') {
      return res.status(404).json(result);
    }
    return res.status(400).json(result);
  }

  return res.json(result);
});

// System Stats
app.get('/api/stats', (_req: Request, res: Response) => {
  res.json({
    stats: db.getStats(),
    timestamp: new Date().toISOString(),
  });
});

// Admin Reset to Demo Defaults
app.post('/api/admin/reset', (_req: Request, res: Response) => {
  const fresh = db.resetToDefaults();
  broadcastEvent('system_reset', {});
  broadcastEvent('stats_updated', db.getStats());
  res.json({ success: true, message: 'System database reset to initial demo state', data: fresh });
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

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`Smart Visitor Management System API Server`);
  console.log(`Running on http://localhost:${PORT}`);
  console.log(`Database persistence: server/data/db.json`);
  console.log(`==================================================`);
});
