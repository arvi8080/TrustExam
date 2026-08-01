import React, { useState } from 'react';
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
  RotateCcw
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeRoleTab, setActiveRoleTab] = useState('student');
  
  // Interactive Sandbox State
  const [sandboxTrustScore, setSandboxTrustScore] = useState(100);
  const [sandboxLogs, setSandboxLogs] = useState([
    { id: 1, type: 'info', text: 'Exam session initialized. Anti-cheat monitoring active.', time: '12:00:00 PM' }
  ]);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);

  // Handle Tab Switch Simulation
  const handleSimulateTabSwitch = () => {
    if (isExamSubmitted) return;
    const newCount = tabSwitchCount + 1;
    setTabSwitchCount(newCount);
    
    const timeString = new Date().toLocaleTimeString();
    let scoreDeduction = 15;
    let newScore = Math.max(0, sandboxTrustScore - scoreDeduction);
    setSandboxTrustScore(newScore);

    const newLog = {
      id: Date.now(),
      type: 'warning',
      text: `[ALERT] Tab switch detected! (Violation #${newCount}) - Trust score updated.`,
      time: timeString
    };

    setSandboxLogs((prev) => [newLog, ...prev]);

    if (newScore <= 40 || newCount >= 3) {
      setTimeout(() => {
        setIsExamSubmitted(true);
        setSandboxLogs((prev) => [
          {
            id: Date.now() + 1,
            type: 'danger',
            text: '🚨 [CRITICAL] Security threshold breached! Exam auto-submitted by TrustExam Security.',
            time: new Date().toLocaleTimeString()
          },
          ...prev
        ]);
      }, 500);
    }
  };

  const handleResetSandbox = () => {
    setSandboxTrustScore(100);
    setTabSwitchCount(0);
    setIsExamSubmitted(false);
    setSandboxLogs([
      { id: Date.now(), type: 'info', text: 'Exam session reset. Anti-cheat monitoring active.', time: new Date().toLocaleTimeString() }
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">
      
      {/* Background Glow Accents */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-[128px]"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                TrustExam
              </span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                v2.0
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
            <a href="#sandbox" className="hover:text-cyan-400 transition-colors">Live Sandbox</a>
            <a href="#portals" className="hover:text-cyan-400 transition-colors">Portals</a>
            <a href="#sdg" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-emerald-400" />
              <span>SDG 4 Impact</span>
            </a>
            <a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/login')}
              className="group relative inline-flex items-center justify-center p-0.5 font-medium text-sm rounded-xl overflow-hidden shadow-lg shadow-blue-500/25"
            >
              <span className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-500 absolute group-hover:opacity-90 transition-opacity"></span>
              <span className="relative px-5 py-2.5 bg-slate-950 rounded-[10px] text-white flex items-center gap-2 group-hover:bg-opacity-0 transition-all duration-300">
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-cyan-400 shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>UN SDG Goal 4 Quality Education Aligned</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15]">
              Exams You Can <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Trust</span>.<br />
              Integrity You Can <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Verify</span>.
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              The tamper-evident online examination platform engineered with real-time browser monitoring, dynamic trust scores, anti-cheat auto-submit, and live proctoring.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="#sandbox"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-cyan-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                Try Interactive Sandbox
              </a>
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-semibold hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <UserCheck className="w-5 h-5 text-slate-400" />
                Access Demo Account
              </button>
            </div>

            {/* Trust Metrics */}
            <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-slate-800/80">
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/50">
                <div className="text-3xl font-extrabold text-white">99.8%</div>
                <div className="text-xs text-slate-400 mt-1">Cheat Prevention Accuracy</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/50">
                <div className="text-3xl font-extrabold text-cyan-400">&lt; 50ms</div>
                <div className="text-xs text-slate-400 mt-1">Tab-Switch Log Latency</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/50">
                <div className="text-3xl font-extrabold text-emerald-400">100%</div>
                <div className="text-xs text-slate-400 mt-1">Automated Audit Trail</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/50">
                <div className="text-3xl font-extrabold text-indigo-400">SDG 4</div>
                <div className="text-xs text-slate-400 mt-1">Global Education Reach</div>
              </div>
            </div>

          </div>

          {/* Hero Visual Mockup */}
          <div className="mt-16 relative max-w-5xl mx-auto">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 opacity-20 blur-xl"></div>
            <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden">
              {/* Window Bar */}
              <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  <span className="ml-2 text-xs font-mono text-slate-400">trustexam.app/exam/live-proctoring-dashboard</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  LIVE MONITORING ACTIVE
                </div>
              </div>

              {/* Mock Dashboard Layout */}
              <div className="p-6 grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Active Examination</div>
                      <div className="text-base font-semibold text-white">Advanced Data Structures & Algorithms</div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
                      Time Remaining: 42:15
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-300">Question 8 of 25</span>
                      <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Progress Auto-Saved
                      </span>
                    </div>
                    <p className="text-slate-200 text-sm font-medium">
                      What is the worst-case time complexity of quicksort algorithm, and how does randomized pivot selection mitigate it?
                    </p>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500 text-blue-300 text-xs font-medium">
                        O(n²) - Mitigated by picking random pivots
                      </div>
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-xs">
                        O(n log n) - Fixed pivot selection
                      </div>
                    </div>
                  </div>
                </div>

                {/* Side Status Widget */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400">STUDENT TRUST SCORE</span>
                      <span className="text-xs font-bold text-emerald-400">EXCELLENT</span>
                    </div>
                    <div className="text-3xl font-extrabold text-white flex items-baseline gap-1">
                      98<span className="text-sm font-normal text-slate-400">/100</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full w-[98%]"></div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-blue-400" />
                      SECURITY GUARDS ACTIVE
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Tab Focus Monitor</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span>IP Address Tracking</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Session Lock</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Anti-Cheat Sandbox */}
      <section id="sandbox" className="py-20 relative z-10 border-t border-slate-800/80 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Interactive Protection Demo
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              Try the Anti-Cheat Engine Live
            </h3>
            <p className="text-slate-400 text-sm sm:text-base">
              Click the simulation buttons below to test how TrustExam responds to tab-switching and cheating attempts in real-time.
            </p>
          </div>

          <div className="max-w-4xl mx-auto rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden grid md:grid-cols-12 gap-0">
            {/* Left Control Panel */}
            <div className="md:col-span-5 p-6 border-b md:border-b-0 md:border-r border-slate-800 space-y-6 bg-slate-950/50">
              <div className="space-y-2">
                <h4 className="text-base font-semibold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Simulation Controls
                </h4>
                <p className="text-xs text-slate-400">
                  Simulate student actions during an ongoing exam session.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleSimulateTabSwitch}
                  disabled={isExamSubmitted}
                  className="w-full px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold text-xs flex items-center justify-between hover:bg-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Simulate Tab Switch
                  </span>
                  <span className="px-2 py-0.5 bg-amber-500/20 rounded font-mono text-[10px]">
                    Count: {tabSwitchCount}
                  </span>
                </button>

                <button
                  onClick={handleResetSandbox}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Session Simulator
                </button>
              </div>

              {/* Trust Gauge */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">DYNAMIC TRUST SCORE</span>
                  <span className={`font-bold ${sandboxTrustScore > 70 ? 'text-emerald-400' : sandboxTrustScore > 40 ? 'text-amber-400' : 'text-red-400'}`}>
                    {sandboxTrustScore > 70 ? 'HIGH' : sandboxTrustScore > 40 ? 'WARNING' : 'CHEATING SUSPECTED'}
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-white">
                  {sandboxTrustScore}<span className="text-slate-500 text-base font-normal"> / 100</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      sandboxTrustScore > 70 ? 'bg-emerald-400' : sandboxTrustScore > 40 ? 'bg-amber-400' : 'bg-red-500'
                    }`}
                    style={{ width: `${sandboxTrustScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Right Live Security Log Feed */}
            <div className="md:col-span-7 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2 font-mono">
                  <Eye className="w-4 h-4 text-blue-400" />
                  SECURITY AUDIT LOG FEED
                </h4>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  STREAMING
                </span>
              </div>

              <div className="h-60 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
                {sandboxLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      log.type === 'danger'
                        ? 'bg-red-500/10 border-red-500/30 text-red-300 animate-bounce'
                        : log.type === 'warning'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span>TIMESTAMP: {log.time}</span>
                      <span className="uppercase font-bold">{log.type}</span>
                    </div>
                    <div>{log.text}</div>
                  </div>
                ))}
              </div>

              {isExamSubmitted && (
                <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-semibold text-center flex items-center justify-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Auto-Submit Action Triggered by Security Middleware
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Dual Role Showcase (Student vs Admin) */}
      <section id="portals" className="py-20 relative z-10 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Dual Portal Ecosystem
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              Tailored Workflows for Students & Administrators
            </h3>
          </div>

          {/* Role Tab Buttons */}
          <div className="flex justify-center mb-10">
            <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 flex gap-2">
              <button
                onClick={() => setActiveRoleTab('student')}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeRoleTab === 'student'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Student Portal
              </button>
              <button
                onClick={() => setActiveRoleTab('admin')}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeRoleTab === 'admin'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Command Center
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            {activeRoleTab === 'student' ? (
              <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
                <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                  <div>
                    <h4 className="text-xl font-bold text-white">Student Exam Experience</h4>
                    <p className="text-xs text-slate-400">Distraction-free environment with instant results & badge rewards</p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                    Anti-Cheat Guard Active
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <Clock className="w-5 h-5 text-cyan-400" />
                    <h5 className="text-sm font-semibold text-white">Focus Time Counter</h5>
                    <p className="text-xs text-slate-400">Real-time timer with automatic state saves preventing data loss.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <h5 className="text-sm font-semibold text-white">Achievement Badges</h5>
                    <p className="text-xs text-slate-400">Unlock integrity and excellence badges upon successful submission.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    <h5 className="text-sm font-semibold text-white">Instant PDF Certificates</h5>
                    <p className="text-xs text-slate-400">Download verified exam transcripts with score break-down.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
                <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                  <div>
                    <h4 className="text-xl font-bold text-white">Admin Command & Proctoring Suite</h4>
                    <p className="text-xs text-slate-400">Complete control over exams, live session monitoring, and user permissions</p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
                    Live Proctor Grid
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <h5 className="text-sm font-semibold text-white">Live Student Monitor</h5>
                    <p className="text-xs text-slate-400">Track active test takers, real-time trust scores, and tab switch warnings.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <Lock className="w-5 h-5 text-red-400" />
                    <h5 className="text-sm font-semibold text-white">One-Click Account Blocking</h5>
                    <p className="text-xs text-slate-400">Instantly suspend accounts identified in cheating audit logs.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <BarChart3 className="w-5 h-5 text-emerald-400" />
                    <h5 className="text-sm font-semibold text-white">Audit Log Exports</h5>
                    <p className="text-xs text-slate-400">Inspect full timeline logs of student actions for academic integrity compliance.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 relative z-10 border-t border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Platform Features
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              Built for Security, Scalability, and Speed
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Eye className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Browser Tab Switch Tracking</h4>
              <p className="text-sm text-slate-400">
                Detects when students leave the exam window, recording violation counts and timestamped logs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Dynamic Trust Score Engine</h4>
              <p className="text-sm text-slate-400">
                Calculates student integrity ratings in real-time based on test behavior and session parameters.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Auto-Submit Guard</h4>
              <p className="text-sm text-slate-400">
                Automatically submits answer payloads when time expires or critical security limits are breached.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Badges & Gamification</h4>
              <p className="text-sm text-slate-400">
                Incentivize honest achievements with unlockable badges, ranks, and certified trust scores.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">PDF Result Certificates</h4>
              <p className="text-sm text-slate-400">
                Generates downloadable, tamper-verified PDF score transcripts for institutional record keeping.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/50 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Role-Based JWT Security</h4>
              <p className="text-sm text-slate-400">
                Strict route protection and authorization middleware preventing unauthorized test access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* UN SDG Goal 4 Banner */}
      <section id="sdg" className="py-16 relative z-10 bg-gradient-to-b from-blue-950/40 to-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-blue-500/30 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <Globe2 className="w-4 h-4" />
                United Nations SDG 4 Commitment
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Promoting Quality Education & Equitable Access
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                TrustExam breaks down geographic barriers by empowering remote learners in underserved areas with accessible, certified online examinations—ensuring educational integrity worldwide.
              </p>
            </div>

            <div className="flex-shrink-0">
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
                <div className="text-4xl font-extrabold text-emerald-400">SDG 4</div>
                <div className="text-xs text-slate-400 font-medium">Quality Education Standard</div>
                <div className="text-[10px] text-slate-500">Accessible • Transparent • Secure</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section id="pricing" className="py-20 relative z-10 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Flexible Deployment Tiers
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              Scalable Plans for Educators and Academies
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Community Tier */}
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-white">Community Tutors</h4>
                <p className="text-xs text-slate-400">For individual teachers & small study groups.</p>
                <div className="text-3xl font-extrabold text-white">Free</div>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Up to 50 active students
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Core tab switch tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Standard Trust Scores
                  </li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                Get Started Free
              </button>
            </div>

            {/* School Pro Tier */}
            <div className="p-8 rounded-2xl bg-slate-900 border-2 border-blue-500/80 shadow-xl shadow-blue-500/10 space-y-6 flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-bold tracking-wider uppercase">
                MOST POPULAR
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-white">School / Academy Pro</h4>
                <p className="text-xs text-slate-400">For secondary schools & training centers.</p>
                <div className="text-3xl font-extrabold text-white">$49 <span className="text-xs text-slate-400 font-normal">/ month</span></div>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Unlimited active students & exams
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Live Admin Proctor Grid
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Automated PDF Certificates
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Student Blocking & Audit Logs
                  </li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold shadow-lg hover:brightness-110 transition-all"
              >
                Start 14-Day Trial
              </button>
            </div>

            {/* Campus Enterprise Tier */}
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-white">University Campus</h4>
                <p className="text-xs text-slate-400">For universities & large certification bodies.</p>
                <div className="text-3xl font-extrabold text-white">Custom</div>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Docker On-Premise Deployment
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Custom Domain & Branding
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Dedicated MongoDB Instance
                  </li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                Contact Sales
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800/80 bg-slate-950 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-white">TrustExam Platform</span>
            <span>© 2026 TrustExam. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono text-slate-300">All Security Guards Operational</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
