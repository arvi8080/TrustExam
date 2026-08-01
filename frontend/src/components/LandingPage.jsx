import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Users, 
  FileText, 
  Globe2, 
  ArrowRight, 
  Sparkles, 
  Activity, 
  BarChart3, 
  Shield,
  Clock,
  UserCheck,
  Check,
  Play,
  RotateCcw,
  Camera,
  Monitor,
  Cpu,
  FileCheck2,
  ChevronDown,
  HelpCircle,
  TrendingUp,
  Sliders,
  Maximize2,
  RefreshCw,
  XCircle,
  UserX,
  Building2,
  GraduationCap
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeRoleTab, setActiveRoleTab] = useState('student');
  
  // Interactive Live Sandbox States
  const [sandboxTrustScore, setSandboxTrustScore] = useState(98);
  const [activeViolationType, setActiveViolationType] = useState('none');
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [faceDetected, setFaceDetected] = useState(true);
  const [secondMonitorDetected, setSecondMonitorDetected] = useState(false);
  const [isAutoSubmitted, setIsAutoSubmitted] = useState(false);
  const [sandboxLogs, setSandboxLogs] = useState([
    { id: 1, type: 'success', text: 'Biometric webcam verification passed. (Confidence: 99.4%)', time: '10:00:02 AM' },
    { id: 2, type: 'info', text: 'Secure session locked. Browser tab monitoring initialized.', time: '10:00:00 AM' }
  ]);

  // Live Proctor Grid State (Interactive Admin Room)
  const [proctorStudents, setProctorStudents] = useState([
    { id: 'ST-8091', name: 'Alex Chen', exam: 'CS301: Algorithms', trustScore: 98, status: 'Active', violations: 0, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    { id: 'ST-4412', name: 'Sarah Jenkins', exam: 'CS301: Algorithms', trustScore: 62, status: 'Warning', violations: 2, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
    { id: 'ST-9923', name: 'Marcus Vance', exam: 'CS301: Algorithms', trustScore: 100, status: 'Active', violations: 0, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
    { id: 'ST-1104', name: 'Elena Rostova', exam: 'CS301: Algorithms', trustScore: 25, status: 'Suspended', violations: 4, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' }
  ]);

  // ROI Calculator State
  const [studentCount, setStudentCount] = useState(250);
  const [examsPerMonth, setExamsPerMonth] = useState(4);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  // Trigger Sandbox Violations
  const triggerViolation = (type) => {
    if (isAutoSubmitted) return;
    const timeStr = new Date().toLocaleTimeString();

    if (type === 'tab') {
      const count = tabSwitchCount + 1;
      setTabSwitchCount(count);
      const newScore = Math.max(0, sandboxTrustScore - 18);
      setSandboxTrustScore(newScore);
      setActiveViolationType('tab');

      setSandboxLogs((prev) => [
        { id: Date.now(), type: 'warning', text: `[SECURITY ALERT] Browser tab lost focus! (Violation #${count})`, time: timeStr },
        ...prev
      ]);

      if (newScore <= 40 || count >= 3) {
        triggerAutoSubmit();
      }
    } else if (type === 'face') {
      setFaceDetected(false);
      const newScore = Math.max(0, sandboxTrustScore - 25);
      setSandboxTrustScore(newScore);
      setActiveViolationType('face');

      setSandboxLogs((prev) => [
        { id: Date.now(), type: 'warning', text: `[BIOMETRIC ALERT] User face out of frame / Secondary face detected!`, time: timeStr },
        ...prev
      ]);

      setTimeout(() => setFaceDetected(true), 3500);

      if (newScore <= 40) {
        triggerAutoSubmit();
      }
    } else if (type === 'monitor') {
      setSecondMonitorDetected(true);
      const newScore = Math.max(0, sandboxTrustScore - 35);
      setSandboxTrustScore(newScore);
      setActiveViolationType('monitor');

      setSandboxLogs((prev) => [
        { id: Date.now(), type: 'danger', text: `[HARDWARE ALERT] Secondary display device / screen sharing detected!`, time: timeStr },
        ...prev
      ]);

      if (newScore <= 40) {
        triggerAutoSubmit();
      }
    }
  };

  const triggerAutoSubmit = () => {
    setIsAutoSubmitted(true);
    setSandboxLogs((prev) => [
      { id: Date.now() + 1, type: 'critical', text: '🚨 [CRITICAL BREACH] Exam forcibly terminated & auto-submitted to Admin.', time: new Date().toLocaleTimeString() },
      ...prev
    ]);
  };

  const resetSandbox = () => {
    setSandboxTrustScore(98);
    setTabSwitchCount(0);
    setFaceDetected(true);
    setSecondMonitorDetected(false);
    setIsAutoSubmitted(false);
    setActiveViolationType('none');
    setSandboxLogs([
      { id: Date.now(), type: 'success', text: 'Biometric webcam verification passed. (Confidence: 99.4%)', time: new Date().toLocaleTimeString() },
      { id: Date.now() + 1, type: 'info', text: 'Secure session re-initialized. All security guards active.', time: new Date().toLocaleTimeString() }
    ]);
  };

  // Toggle Proctor Student Action
  const toggleStudentStatus = (id) => {
    setProctorStudents((prev) =>
      prev.map((student) => {
        if (student.id === id) {
          const isSuspended = student.status === 'Suspended';
          return {
            ...student,
            status: isSuspended ? 'Active' : 'Suspended',
            trustScore: isSuspended ? 95 : 0
          };
        }
        return student;
      })
    );
  };

  const faqs = [
    {
      q: "How does TrustExam prevent cheating without requiring invasive software downloads?",
      a: "TrustExam operates 100% inside modern web browsers using HTML5 Fullscreen APIs, Page Visibility Telemetry, biometrics via WebRTC, and dynamic network IP tracking. Zero plugins or heavy background software installations are required."
    },
    {
      q: "What happens if a student accidentally loses internet connection during an exam?",
      a: "TrustExam includes an Anti-Tamper Auto-Saver. Answers are encrypted and stored in local encrypted session storage. Once the network reconnects, progress automatically syncs seamlessly without losing a single response."
    },
    {
      q: "How is the Dynamic Trust Score calculated?",
      a: "The Trust Score starts at 100 and uses real-time event analytics. Points are deducted based on weighted severity: minor tab switches (-15 to -18 pts), missing biometric presence (-25 pts), or hardware screen duplication (-35 pts). Scores below threshold automatically trigger auto-submission."
    },
    {
      q: "Is TrustExam compliant with global education and privacy standards (GDPR, FERPA)?",
      a: "Yes. All video feeds and audit logs are encrypted in-transit (TLS 1.3) and at-rest (AES-256). We strictly adhere to FERPA and GDPR standards—student biometric data is analyzed client-side and never sold or misused."
    }
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] animate-pulse-glow"></div>
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-25"></div>
      </div>

      {/* Top Banner Alert */}
      <div className="bg-gradient-to-r from-blue-900/60 via-slate-900 to-cyan-900/60 border-b border-cyan-500/20 py-2.5 px-4 text-center text-xs font-medium text-slate-300 relative z-50 flex items-center justify-center gap-2">
        <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-extrabold uppercase tracking-wider">
          NEW RELEASE v2.4
        </span>
        <span>AI Biometric Proctoring & Dynamic Trust Score Engine live.</span>
        <a href="#sandbox" className="text-cyan-400 font-bold hover:underline flex items-center gap-1">
          Try Sandbox <ArrowRight className="w-3 h-3" />
        </a>
      </div>

      {/* Navigation Header */}
      <nav className="sticky top-0 z-40 backdrop-blur-2xl bg-[#030712]/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-400 to-emerald-400 p-[1.5px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                TrustExam
              </span>
              <span className="ml-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                PROCTOR AI
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#sandbox" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Live Anti-Cheat Demo</span>
            </a>
            <a href="#proctor-room" className="hover:text-cyan-400 transition-colors">Educator Room</a>
            <a href="#features" className="hover:text-cyan-400 transition-colors">Security Features</a>
            <a href="#sdg" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-emerald-400" />
              <span>SDG 4 Education</span>
            </a>
            <a href="#roi" className="hover:text-cyan-400 transition-colors">ROI Calculator</a>
            <a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-xl transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/login')}
              className="relative inline-flex items-center justify-center p-0.5 font-bold text-sm rounded-xl overflow-hidden shadow-xl shadow-cyan-500/20 group"
            >
              <span className="w-full h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 absolute group-hover:opacity-90 transition-opacity"></span>
              <span className="relative px-5 py-2.5 bg-[#030712] rounded-[10px] text-white flex items-center gap-2 group-hover:bg-opacity-0 transition-all duration-300">
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-bold text-cyan-300 shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Zero Plugins Required • HTML5 Browser Native Proctoring</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">
              Next-Gen Exams.<br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                Uncompromising Academic Integrity.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Empower universities, certification bodies, and educators with real-time biometric tracking, automated trust scores, anti-tab switch locks, and live student proctoring.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="#sandbox"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 text-slate-950 font-black shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-base"
              >
                <Play className="w-5 h-5 fill-current" />
                Launch Live Anti-Cheat Demo
              </a>
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 font-bold hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-2 text-base"
              >
                <UserCheck className="w-5 h-5 text-cyan-400" />
                Access Educator Portal
              </button>
            </div>

            {/* Trusted By Badges */}
            <div className="pt-10 space-y-3">
              <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
                TRUSTED & VERIFIED FOR ACCREDITED EXAMINATION BOARDS
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 opacity-70 text-slate-400 font-extrabold text-sm">
                <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-cyan-400" /> Global EdTech Alliance</div>
                <div className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-blue-400" /> National Skill Certifications</div>
                <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> UN SDG 4 Education Standard</div>
              </div>
            </div>

          </div>

          {/* REALISTIC HERO MONITORING DISPLAY */}
          <div className="mt-14 relative max-w-5xl mx-auto">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 opacity-25 blur-2xl"></div>
            <div className="relative rounded-3xl bg-slate-950/95 border border-slate-800/90 shadow-2xl overflow-hidden backdrop-blur-xl">
              
              {/* Window Header */}
              <div className="px-5 py-3.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-500/80"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-500/80"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/80"></div>
                  <span className="ml-2 text-xs font-mono text-slate-400 font-semibold">
                    proctor.trustexam.app/live-session/CS301-FINAL
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono text-emerald-400">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    PROCTOR TELEMETRY STREAMING
                  </span>
                </div>
              </div>

              {/* Realistic Dashboard Grid */}
              <div className="p-6 grid lg:grid-cols-12 gap-6 text-left">
                
                {/* Exam Question View */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Final Examination</div>
                      <div className="text-lg font-extrabold text-white">CS301: Advanced Data Structures & Algorithms</div>
                    </div>
                    <div className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      54:12 REMAINING
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300">QUESTION 14 OF 30</span>
                      <span className="text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-mono">
                        ✓ ENCRYPTED STATE AUTO-SAVED
                      </span>
                    </div>

                    <p className="text-slate-100 text-sm font-semibold leading-relaxed">
                      Given a Directed Acyclic Graph (DAG) with N nodes, what is the tightest time complexity to compute the topological ordering using Kahn's BFS Algorithm?
                    </p>

                    <div className="grid sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3.5 rounded-xl bg-cyan-500/15 border-2 border-cyan-500 text-cyan-200 text-xs font-bold flex items-center justify-between">
                        <span>A. O(V + E) using In-Degree Array</span>
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs font-medium">
                        B. O(V · E) using Matrix Multiplication
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs font-medium">
                        C. O(V²) using Dijkstra relaxation
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs font-medium">
                        D. O(2ⁿ) Backtracking Search
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Biometrics & Live Telemetry Panel */}
                <div className="lg:col-span-4 space-y-4">
                  
                  {/* Webcam Biometric Simulation Box */}
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-bold flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-cyan-400" />
                        WEBCAM BIOMETRIC
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        MATCH 99.4%
                      </span>
                    </div>

                    <div className="relative h-32 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center group">
                      <img 
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80" 
                        alt="Student Feed"
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-4 border-2 border-cyan-400/80 rounded-lg pointer-events-none flex items-start justify-between p-1">
                        <span className="text-[9px] font-mono bg-cyan-500/90 text-slate-950 px-1 font-black rounded">
                          FACE LOCKED
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Trust Score Gauge */}
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-bold">TRUST SCORE RATING</span>
                      <span className="text-emerald-400 font-black">HIGH INTEGRITY</span>
                    </div>
                    <div className="text-3xl font-black text-white flex items-baseline gap-1 font-mono">
                      98 <span className="text-slate-500 text-xs font-normal">/ 100</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                      <div className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 h-full w-[98%]"></div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* INTERACTIVE ANTI-CHEAT SANDBOX DEMO */}
      <section id="sandbox" className="py-20 relative z-10 border-t border-slate-800/80 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-3xl mx-auto space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
              <Activity className="w-4 h-4" />
              HANDS-ON SIMULATOR
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              Try the Anti-Cheat Engine Live
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Test how TrustExam responds to unauthorized tab switches, biometric face loss, and secondary display monitors in real time.
            </p>
          </div>

          <div className="max-w-5xl mx-auto rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden grid lg:grid-cols-12 text-left">
            
            {/* Left Control Panel */}
            <div className="lg:col-span-5 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-slate-800 space-y-6 bg-slate-950/60">
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-cyan-400" />
                  Security Violation Triggers
                </h3>
                <p className="text-xs text-slate-400">Click any trigger below to simulate student behavior:</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => triggerViolation('tab')}
                  disabled={isAutoSubmitted}
                  className="w-full p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center justify-between hover:bg-amber-500/20 transition-all disabled:opacity-40"
                >
                  <span className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-amber-400" />
                    Simulate Tab Switch
                  </span>
                  <span className="px-2 py-0.5 bg-amber-500/20 rounded font-mono text-[10px]">
                    Switches: {tabSwitchCount}
                  </span>
                </button>

                <button
                  onClick={() => triggerViolation('face')}
                  disabled={isAutoSubmitted}
                  className="w-full p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center justify-between hover:bg-rose-500/20 transition-all disabled:opacity-40"
                >
                  <span className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-rose-400" />
                    Simulate Face Out of Frame
                  </span>
                  <span className="text-[10px] font-mono text-rose-400">
                    Biometric
                  </span>
                </button>

                <button
                  onClick={() => triggerViolation('monitor')}
                  disabled={isAutoSubmitted}
                  className="w-full p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold text-xs flex items-center justify-between hover:bg-indigo-500/20 transition-all disabled:opacity-40"
                >
                  <span className="flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-indigo-400" />
                    Simulate 2nd Monitor Screen
                  </span>
                  <span className="text-[10px] font-mono text-indigo-400">
                    Hardware
                  </span>
                </button>

                <button
                  onClick={resetSandbox}
                  className="w-full py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-4 h-4 text-slate-400" />
                  Reset Session Simulator
                </button>
              </div>

              {/* Dynamic Trust Meter */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold">TRUST SCORE TELEMETRY</span>
                  <span className={`font-extrabold ${sandboxTrustScore > 75 ? 'text-emerald-400' : sandboxTrustScore > 40 ? 'text-amber-400' : 'text-red-400'}`}>
                    {sandboxTrustScore > 75 ? 'PASSED' : sandboxTrustScore > 40 ? 'WARNING' : 'AUTO-TERMINATED'}
                  </span>
                </div>
                <div className="text-4xl font-black text-white font-mono">
                  {sandboxTrustScore}<span className="text-slate-500 text-sm font-normal"> / 100</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      sandboxTrustScore > 75 ? 'bg-gradient-to-r from-blue-500 to-emerald-400' : sandboxTrustScore > 40 ? 'bg-amber-400' : 'bg-red-500'
                    }`}
                    style={{ width: `${sandboxTrustScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Right Live Security Telemetry Feed */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2 font-mono">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  LIVE AUDIT LOG STREAM
                </h4>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  STREAMING LOGS
                </span>
              </div>

              {/* Feed Console */}
              <div className="h-64 overflow-y-auto space-y-2.5 pr-2 font-mono text-xs">
                {sandboxLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      log.type === 'critical'
                        ? 'bg-red-500/20 border-red-500/50 text-red-200 shadow-lg'
                        : log.type === 'danger'
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                        : log.type === 'warning'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        : log.type === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span>TIME: {log.time}</span>
                      <span className="uppercase font-extrabold">{log.type}</span>
                    </div>
                    <div>{log.text}</div>
                  </div>
                ))}
              </div>

              {isAutoSubmitted && (
                <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-bold text-center flex items-center justify-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400 animate-bounce" />
                  Security Threshold Reached: Exam Auto-Submitted to Admin Dashboard!
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* EDUCATOR CONTROL ROOM (INTERACTIVE ADMIN MONITOR) */}
      <section id="proctor-room" className="py-20 relative z-10 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold">
              <Users className="w-4 h-4" />
              EDUCATOR COMMAND CENTER
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              Live Student Proctoring Grid
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Monitor active test-takers simultaneously. Click any student card to suspend or reinstate session access instantly.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto text-left">
            {proctorStudents.map((student) => (
              <div
                key={student.id}
                className={`p-5 rounded-2xl border transition-all ${
                  student.status === 'Suspended'
                    ? 'bg-red-950/20 border-red-500/40 opacity-75'
                    : student.status === 'Warning'
                    ? 'bg-amber-950/20 border-amber-500/40'
                    : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                  />
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      student.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : student.status === 'Warning'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/40'
                    }`}
                  >
                    {student.status}
                  </span>
                </div>

                <div className="space-y-1 mb-4">
                  <h4 className="text-base font-bold text-white">{student.name}</h4>
                  <div className="text-xs text-slate-400 font-mono">{student.id} • {student.exam}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Trust Score</span>
                    <span className="font-mono font-bold text-white">{student.trustScore}/100</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        student.trustScore > 75 ? 'bg-emerald-400' : student.trustScore > 40 ? 'bg-amber-400' : 'bg-red-500'
                      }`}
                      style={{ width: `${student.trustScore}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={() => toggleStudentStatus(student.id)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                    student.status === 'Suspended'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-slate-800 hover:bg-red-600/80 hover:text-white text-slate-300'
                  }`}
                >
                  {student.status === 'Suspended' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Reinstate Student
                    </>
                  ) : (
                    <>
                      <UserX className="w-3.5 h-3.5" /> Suspend Student
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CORE FEATURES MATRIX */}
      <section id="features" className="py-20 relative z-10 border-t border-slate-800/80 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Complete Security Architecture
            </h2>
            <h3 className="text-3xl sm:text-5xl font-black text-white">
              6 Layer Academic Defense Matrix
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Eye className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Tab & Focus Telemetry</h4>
              <p className="text-sm text-slate-400">
                Detects loss of window focus instantly, recording timestamped violation logs for academic review.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Dynamic Trust Score Engine</h4>
              <p className="text-sm text-slate-400">
                Calculates weighted student integrity metrics in real-time, auto-terminating compromised sessions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Anti-Tamper Auto-Save</h4>
              <p className="text-sm text-slate-400">
                Encrypted answer persistence ensures zero progress loss even during temporary network drops.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Gamified Badge System</h4>
              <p className="text-sm text-slate-400">
                Rewards students for honest test completion with certified integrity badges and public rank unlocks.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Verified PDF Certificates</h4>
              <p className="text-sm text-slate-400">
                Generates tamper-verified PDF transcripts with embedded trust score metrics for official records.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/50 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Role-Based JWT Auth</h4>
              <p className="text-sm text-slate-400">
                Military-grade JWT authentication and role middleware preventing unauthorized access to exam data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* UN SDG GOAL 4 BANNER */}
      <section id="sdg" className="py-16 relative z-10 bg-gradient-to-b from-blue-950/40 via-slate-950 to-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 text-left">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <Globe2 className="w-4 h-4" />
                UNITED NATIONS SDG GOAL 4 COMMITMENT
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                Empowering Remote Learners with Equitable Certification
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                TrustExam provides accessible, bandwidth-optimized exam proctoring for students in remote and underserved regions—ensuring quality education and verified skill certification for all.
              </p>
            </div>

            <div className="flex-shrink-0">
              <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2 shadow-xl">
                <div className="text-5xl font-black text-emerald-400 font-mono">SDG 4</div>
                <div className="text-xs text-slate-300 font-bold">Quality Education Standard</div>
                <div className="text-[11px] text-slate-500">Accessible • Transparent • Secure</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI CALCULATOR */}
      <section id="roi" className="py-20 relative z-10 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-3xl mx-auto space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
              <TrendingUp className="w-4 h-4" />
              INSTITUTIONAL SAVINGS
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              Calculate Your Proctoring ROI
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              See how many proctoring hours and dollars TrustExam saves your institution every month.
            </p>
          </div>

          <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl text-left space-y-8">
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>ACTIVE STUDENTS</span>
                  <span className="font-mono text-cyan-400 text-base">{studentCount} Students</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={studentCount}
                  onChange={(e) => setStudentCount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>EXAMS PER MONTH</span>
                  <span className="font-mono text-cyan-400 text-base">{examsPerMonth} Exams</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={examsPerMonth}
                  onChange={(e) => setExamsPerMonth(Number(e.target.value))}
                  className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400 font-bold">ESTIMATED PROCTOR HOURS SAVED</div>
                <div className="text-3xl font-black text-emerald-400 font-mono">
                  {(studentCount * examsPerMonth * 1.5).toLocaleString()} hrs / mo
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400 font-bold">ESTIMATED COST REDUCTION</div>
                <div className="text-3xl font-black text-cyan-400 font-mono">
                  ${(studentCount * examsPerMonth * 12).toLocaleString()} / yr
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* PRICING TIERS */}
      <section id="pricing" className="py-20 relative z-10 border-t border-slate-800/80 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Transparent Pricing
            </h2>
            <h3 className="text-3xl sm:text-5xl font-black text-white">
              Scalable Plans for Tutors & Academies
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
            
            {/* Free Tier */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-white">Community Tutor</h4>
                <p className="text-xs text-slate-400">For individual teachers & small study cohorts.</p>
                <div className="text-4xl font-black text-white">Free</div>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Up to 50 active students
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Core tab switch monitoring
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Standard Trust Scores
                  </li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 transition-colors"
              >
                Get Started Free
              </button>
            </div>

            {/* School Pro Tier */}
            <div className="p-8 rounded-3xl bg-slate-900 border-2 border-cyan-400 shadow-2xl shadow-cyan-500/10 space-y-6 flex flex-col justify-between relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-black tracking-widest uppercase">
                MOST POPULAR
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-white">Academy Pro</h4>
                <p className="text-xs text-slate-400">For secondary schools & training institutes.</p>
                <div className="text-4xl font-black text-white">$49 <span className="text-xs text-slate-400 font-normal">/ month</span></div>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Unlimited active students & exams
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Live Admin Proctor Room
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Automated PDF Result Transcripts
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Student Blocking & Audit Logs
                  </li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 text-slate-950 text-xs font-black shadow-lg hover:brightness-110 transition-all"
              >
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Campus Enterprise */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-white">University Campus</h4>
                <p className="text-xs text-slate-400">For large universities & national testing boards.</p>
                <div className="text-4xl font-black text-white">Custom</div>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Docker On-Premise Deployment
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Custom Branding & Domain
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Dedicated MongoDB & Audit Logs
                  </li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 transition-colors"
              >
                Contact Campus Sales
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 relative z-10 border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          
          <div className="text-center space-y-4 mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Got Questions?
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-white">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-white text-sm sm:text-base hover:text-cyan-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-cyan-400' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/40">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-800/80 bg-[#030712] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-white">TrustExam Platform</span>
            <span>© 2026 TrustExam. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>All Anti-Cheat Systems Operational</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
