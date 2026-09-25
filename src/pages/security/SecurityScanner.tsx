import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  ScanLine, 
  Camera, 
  CameraOff, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  LogIn, 
  LogOut, 
  RefreshCw, 
  Keyboard, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { api } from '../../services/api';
import { ScanResult, Visitor } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useLive } from '../../context/LiveContext';
import confetti from 'canvas-confetti';

export const SecurityScanner: React.FC = () => {
  const { user } = useAuth();
  const { triggerRefresh } = useLive();
  const [isScanning, setIsScanning] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastScanResult, setLastScanResult] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<{ result: ScanResult; timestamp: string }[]>([]);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'qr-reader-container';

  // Start Camera
  const startCamera = async () => {
    setScannerError(null);
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(scannerContainerId);
      }

      await html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleProcessScan(decodedText);
        },
        (_errorMessage) => {
          // Frame by frame scan errors (normal when no QR is in view)
        }
      );
      setIsScanning(true);
    } catch (err: any) {
      console.warn('Camera start error:', err);
      setScannerError(
        'Unable to access camera. Please verify permissions or use the Manual Input / Quick Demo Test buttons below.'
      );
      setIsScanning(false);
    }
  };

  // Stop Camera
  const stopCamera = async () => {
    if (html5QrCodeRef.current && isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error('Failed to stop camera:', err);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  // Main scan execution logic
  const handleProcessScan = async (qrPayload: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const res = await api.scanQr(qrPayload, user?.name || 'Gate 1 Security Officer');
      setLastScanResult(res);
      setScanHistory((prev) => [{ result: res, timestamp: new Date().toLocaleTimeString() }, ...prev.slice(0, 9)]);
      triggerRefresh();

      if (res.success) {
        if (res.action === 'ENTRY') {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        }
      }
    } catch (err: any) {
      const failResult: ScanResult = {
        success: false,
        action: 'NONE',
        message: err.message || 'QR Scan failed',
        status: 'REGISTERED',
        errorCode: 'INVALID_QR',
      };
      setLastScanResult(failResult);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    handleProcessScan(manualInput.trim());
    setManualInput('');
  };

  // Quick Demo Buttons for Examiner / Viva Evaluation
  const demoScenarios = [
    {
      title: 'Case 1: Approved Entry Scan',
      desc: 'Arun Kumar (Status: APPROVED) → ENTRY Successful',
      token: 'QR-EXT-1001-ARUN-KUMAR',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      title: 'Case 2: Same QR Exit Scan',
      desc: 'Priya Sundaram (Status: INSIDE_CAMPUS) → EXIT Successful',
      token: 'QR-EXT-1002-PRIYA-SUNDARAM',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    {
      title: 'Case 3: Duplicate Checkout Scan',
      desc: 'Karthik Raja (Status: CHECKED_OUT) → "Already Checked Out"',
      token: 'QR-EXT-1003-KARTHIK-RAJA',
      badgeColor: 'bg-slate-200 text-slate-800 border-slate-300',
    },
    {
      title: 'Case 4: Pending Approval Scan',
      desc: 'Meena Devi (Status: PENDING_APPROVAL) → "Awaiting approval"',
      token: 'QR-PAR-1001-MEENA-DEVI',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      title: 'Case 5: Rejected Visitor Scan',
      desc: 'David Miller (Status: REJECTED) → "Visitor is not approved"',
      token: 'QR-EXT-1004-DAVID-MILLER',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    },
    {
      title: 'Case 6: Invalid QR Code',
      desc: 'Unformatted / corrupted string → "Invalid Visitor QR"',
      token: 'RANDOM_CORRUPTED_QR_STRING_9999',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    },
    {
      title: 'Case 7: Visitor Not Found',
      desc: 'Non-existent ID → "Visitor Not Found"',
      token: 'QR-EXT-9999-NONEXISTENT',
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <ScanLine size={14} />
            <span>Single-Token Gate Scanner</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Campus Entry & Exit QR Authentication
          </h1>
          <p className="text-xs text-slate-500">
            The SAME QR is scanned for Entry (1st scan) and Exit (2nd scan). Duplicate scans are automatically blocked.
          </p>
        </div>

        {/* Camera Start / Stop Toggle */}
        <div className="flex items-center gap-3">
          {isScanning ? (
            <button
              onClick={stopCamera}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              <CameraOff size={16} />
              <span>Turn Off Camera</span>
            </button>
          ) : (
            <button
              onClick={startCamera}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-colors cursor-pointer"
            >
              <Camera size={16} />
              <span>Start Camera Scanner</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Scanner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Live Camera Video & Manual Fallback Input */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Camera Viewport Container */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl border border-slate-800 relative overflow-hidden flex flex-col items-center">
            
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isScanning ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`}></span>
                {isScanning ? 'Camera Scanner Active' : 'Camera Standby'}
              </span>
              <span>10 FPS Optical Recognition</span>
            </div>

            {/* html5-qrcode reader div */}
            <div className="w-full my-4 flex flex-col items-center justify-center min-h-[260px] bg-slate-950/60 rounded-2xl border border-slate-800 relative">
              <div id={scannerContainerId} className="w-full max-w-sm rounded-xl overflow-hidden"></div>

              {!isScanning && (
                <div className="p-8 text-center space-y-3">
                  <div className="w-14 h-14 bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
                    <Camera size={28} />
                  </div>
                  <p className="text-xs text-slate-300 font-semibold">Camera is in standby</p>
                  <p className="text-[11px] text-slate-500 max-w-xs">
                    Click "Start Camera Scanner" to scan from smartphone/laptop camera, or use the instant demo triggers below.
                  </p>
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                  >
                    Enable Camera
                  </button>
                </div>
              )}
            </div>

            {scannerError && (
              <div className="w-full p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-rose-300 text-xs">
                {scannerError}
              </div>
            )}

            <p className="text-[11px] text-slate-400 text-center">
              Align visitor's printed or mobile QR code within the scanning frame.
            </p>
          </div>

          {/* Manual Input Fallback */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Keyboard size={16} className="text-indigo-600" />
              Manual QR Token or Visitor ID Fallback
            </h3>
            <p className="text-xs text-slate-500">
              If camera is unavailable, type or paste the QR token or Visitor ID (e.g. EXT-1001) below:
            </p>

            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Paste QR Token or Visitor ID (e.g. EXT-1001)..."
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none font-mono"
              />
              <button
                type="submit"
                disabled={isProcessing}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 cursor-pointer"
              >
                {isProcessing ? 'Processing...' : 'Process Scan'}
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Scan Result Card & Case Testing Suite */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Active Scan Result Card (Section 14 & 5 Requirements) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-600" />
                Latest Scan Decision & Result
              </h3>
              {lastScanResult && (
                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date().toLocaleTimeString()}
                </span>
              )}
            </div>

            {lastScanResult ? (
              <div className="space-y-4 animate-in fade-in zoom-in-95">
                
                {/* Result Notification Banner */}
                <div
                  className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                    lastScanResult.success
                      ? lastScanResult.action === 'ENTRY'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-blue-50 border-blue-300 text-blue-900'
                      : lastScanResult.errorCode === 'ALREADY_CHECKED_OUT'
                      ? 'bg-slate-100 border-slate-300 text-slate-800'
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {lastScanResult.success ? (
                      lastScanResult.action === 'ENTRY' ? (
                        <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-sm">
                          <LogIn size={20} />
                        </div>
                      ) : (
                        <div className="p-2 bg-blue-600 text-white rounded-xl shadow-sm">
                          <LogOut size={20} />
                        </div>
                      )
                    ) : lastScanResult.errorCode === 'ALREADY_CHECKED_OUT' ? (
                      <div className="p-2 bg-slate-600 text-white rounded-xl shadow-sm">
                        <CheckCircle2 size={20} />
                      </div>
                    ) : (
                      <div className="p-2 bg-rose-600 text-white rounded-xl shadow-sm">
                        <XCircle size={20} />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm uppercase tracking-wide">
                        {lastScanResult.action === 'ENTRY' && 'GATE ENTRY ALLOWED'}
                        {lastScanResult.action === 'EXIT' && 'GATE EXIT RECORDED'}
                        {lastScanResult.action === 'NONE' && (lastScanResult.errorCode || 'GATE ACCESS DENIED')}
                      </span>
                    </div>
                    <p className="text-xs font-semibold leading-relaxed">
                      {lastScanResult.message}
                    </p>
                  </div>
                </div>

                {/* Visitor Profile Details (if matched) */}
                {lastScanResult.visitor && (
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Visitor Identity</span>
                        <p className="text-base font-bold text-slate-900">{lastScanResult.visitor.name}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400">ID / Category</span>
                        <p className="font-mono font-bold text-indigo-700">{lastScanResult.visitor.visitorId}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-slate-400 font-medium">Type</p>
                        <p className="font-semibold text-slate-800">
                          {lastScanResult.visitor.visitorType === 'EXTERNAL_STUDENT' ? 'External Student' : 'Parent'}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-400 font-medium">Updated Status</p>
                        <StatusBadge status={lastScanResult.visitor.status} size="sm" />
                      </div>

                      <div>
                        <p className="text-slate-400 font-medium">Host / Faculty</p>
                        <p className="font-medium text-slate-800">{lastScanResult.visitor.hostName}</p>
                      </div>

                      <div>
                        <p className="text-slate-400 font-medium">Purpose</p>
                        <p className="font-medium text-slate-800 truncate">{lastScanResult.visitor.purpose}</p>
                      </div>

                      <div>
                        <p className="text-slate-400 font-medium">Entry Timestamp</p>
                        <p className="font-semibold text-emerald-700">
                          {lastScanResult.visitor.entryTime
                            ? new Date(lastScanResult.visitor.entryTime).toLocaleTimeString()
                            : 'Pending'}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-400 font-medium">Exit Timestamp</p>
                        <p className="font-semibold text-blue-700">
                          {lastScanResult.visitor.exitTime
                            ? new Date(lastScanResult.visitor.exitTime).toLocaleTimeString()
                            : 'Inside / Not Exited'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <ScanLine size={36} className="mx-auto text-slate-300" />
                <p className="text-xs font-medium">Awaiting first scan...</p>
                <p className="text-[11px] text-slate-400">
                  Scan a QR code from the camera or click any scenario button below to verify entry/exit logic.
                </p>
              </div>
            )}

          </div>

          {/* Quick Viva & Demonstration Testing Suite (Section 22 & 28) */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                Viva & Project Demonstration Testing Suite
              </h3>
              <span className="text-[10px] text-slate-500">1-Click Test Triggers</span>
            </div>
            <p className="text-xs text-slate-500">
              Test all 7 core QR scan authentication rules required by the specification:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {demoScenarios.map((demo, idx) => (
                <button
                  key={idx}
                  onClick={() => handleProcessScan(demo.token)}
                  disabled={isProcessing}
                  className="p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-xs transition-all text-left space-y-1 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{demo.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium border ${demo.badgeColor}`}>
                      Run Test
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{demo.desc}</p>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
