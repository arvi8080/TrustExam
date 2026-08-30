import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  Award, 
  CheckCircle2, 
  Zap, 
  Users, 
  FileText, 
  Globe, 
  ArrowRight, 
  Sparkles, 
  Activity, 
  BarChart3, 
  Clock, 
  UserCheck, 
  Check, 
  Play, 
  Server, 
  Database, 
  Layers, 
  Code2, 
  Boxes, 
  Mail, 
  ChevronRight, 
  CheckCircle, 
  Key, 
  ShieldAlert, 
  HardDrive, 
  Cloud, 
  X
} from 'lucide-react';

// Custom SVG Icons
const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const LandingPage = () => {
  const navigate = useNavigate();

  // Laptop Screen Tab Switcher
  const [activeMockupTab, setActiveMockupTab] = useState('admin');

  // Interactive Live Demo Modal State
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoSelectedAnswer, setDemoSelectedAnswer] = useState(null);
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  // Smooth scroll handler
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-700 overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-soft-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => scrollToSection('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Trust<span className="text-blue-600">Exam</span>
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button onClick={() => scrollToSection('home')} className="hover:text-blue-600 transition-colors">Home</button>
            <button onClick={() => scrollToSection('features')} className="hover:text-blue-600 transition-colors">Features</button>
            <button onClick={() => scrollToSection('about')} className="hover:text-blue-600 transition-colors">About</button>
            <button onClick={() => scrollToSection('security')} className="hover:text-blue-600 transition-colors">Security</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-blue-600 transition-colors">Contact</button>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="home" className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-blue-50/70 via-sky-50/30 to-white overflow-hidden">
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-200/40 via-sky-200/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-40 right-10 w-24 h-24 rounded-full bg-blue-400/10 animate-float-slow pointer-events-none"></div>
        <div className="absolute top-20 left-10 w-16 h-16 rounded-2xl bg-sky-400/10 rotate-12 animate-float-slow pointer-events-none" style={{ animationDelay: '1.5s' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-semibold shadow-soft-sm">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Secure • Reliable • AI Powered</span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Secure Online <br />
                <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 bg-clip-text text-transparent">
                  Examination Platform
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                Conduct, monitor and evaluate online examinations securely with AI-powered proctoring, role-based access control, and real-time monitoring.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setIsDemoModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Live Demo
                </button>

                <button
                  onClick={() => scrollToSection('features')}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-7 py-3.5 rounded-xl font-semibold text-sm shadow-soft-sm hover:shadow-soft-md transition-all"
                >
                  Learn More
                </button>
              </div>

              {/* Highlight Stats Pill */}
              <div className="pt-6 flex items-center gap-6 text-xs font-medium text-slate-500 border-t border-slate-200/60">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Role-Based Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Real-time Anti-Cheat</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Auto-Submit Guard</span>
                </div>
              </div>

            </div>

            {/* Right Column: Modern Laptop Mockup */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-xl">
                
                {/* Laptop Body Outer Shadow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-sky-400 rounded-3xl opacity-15 blur-xl"></div>
                
                {/* Laptop Screen Frame */}
                <div className="relative rounded-2xl bg-slate-900 p-2 shadow-soft-xl border border-slate-800">
                  
                  {/* Laptop Top Camera Dot */}
                  <div className="flex items-center justify-center gap-1.5 pb-2 pt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                  </div>

                  {/* Screen Content Wrapper */}
                  <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
                    
                    {/* Mockup Top Navigation Bar */}
                    <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                        <span className="text-[11px] font-medium text-slate-400 ml-2">trustexam.app/dashboard</span>
                      </div>

                      {/* Mockup Tabs */}
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-[11px] font-medium">
                        <button
                          onClick={() => setActiveMockupTab('admin')}
                          className={`px-2.5 py-1 rounded-md transition-all ${
                            activeMockupTab === 'admin' ? 'bg-white text-blue-600 shadow-soft-sm font-semibold' : 'text-slate-500'
                          }`}
                        >
                          Admin
                        </button>
                        <button
                          onClick={() => setActiveMockupTab('student')}
                          className={`px-2.5 py-1 rounded-md transition-all ${
                            activeMockupTab === 'student' ? 'bg-white text-blue-600 shadow-soft-sm font-semibold' : 'text-slate-500'
                          }`}
                        >
                          Student
                        </button>
                        <button
                          onClick={() => setActiveMockupTab('analytics')}
                          className={`px-2.5 py-1 rounded-md transition-all ${
                            activeMockupTab === 'analytics' ? 'bg-white text-blue-600 shadow-soft-sm font-semibold' : 'text-slate-500'
                          }`}
                        >
                          Analytics
                        </button>
                      </div>
                    </div>

                    {/* Mockup Tab Views */}
                    <div className="p-5 text-left min-h-[280px] bg-slate-50">
                      
                      {activeMockupTab === 'admin' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-bold text-slate-800">Admin Control Center</h4>
                              <p className="text-[11px] text-slate-500">Live active exam monitoring & student management</p>
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                              System Online
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-soft-sm">
                              <div className="text-[10px] text-slate-400">Total Exams</div>
                              <div className="text-lg font-bold text-slate-800">124</div>
                            </div>
                            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-soft-sm">
                              <div className="text-[10px] text-slate-400 font-medium">Active Students</div>
                              <div className="text-lg font-bold text-blue-600">1,248</div>
                            </div>
                            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-soft-sm">
                              <div className="text-[10px] text-slate-400">Trust Index</div>
                              <div className="text-lg font-bold text-emerald-600">99.8%</div>
                            </div>
                          </div>

                          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                            <div className="flex items-center justify-between text-slate-700 font-medium">
                              <span>CS301: Algorithms Final Exam</span>
                              <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-semibold">Active Now</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-blue-600 h-full w-[78%]"></div>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span>184 Test Takers</span>
                              <span>Time Left: 45 mins</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeMockupTab === 'student' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-bold text-slate-800">Student Exam Portal</h4>
                              <p className="text-[11px] text-slate-500">Clean, distraction-free examination view</p>
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-semibold">
                              Q12 of 35
                            </span>
                          </div>

                          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                            <p className="text-xs font-medium text-slate-800">
                              What is the time complexity of searching in a Balanced Binary Search Tree (AVL)?
                            </p>
                            <div className="space-y-1.5 text-xs">
                              <div className="p-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg font-medium">
                                A. O(log N) - Logarithmic Time
                              </div>
                              <div className="p-2 bg-slate-50 border border-slate-100 text-slate-600 rounded-lg">
                                B. O(N) - Linear Time
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span className="flex items-center gap-1 text-emerald-600 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Progress Auto-Saved
                            </span>
                            <span className="font-mono text-slate-700 font-semibold">Timer: 00:34:12</span>
                          </div>
                        </div>
                      )}

                      {activeMockupTab === 'analytics' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-bold text-slate-800">Results & Analytics</h4>
                              <p className="text-[11px] text-slate-500">Performance reports & grade distribution</p>
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 text-[10px] font-semibold">
                              Batch 2026
                            </span>
                          </div>

                          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-3">
                            <div className="text-xs font-semibold text-slate-700">Class Performance Score Distribution</div>
                            <div className="flex items-end gap-2 h-24 pt-2 px-2">
                              <div className="flex-1 bg-blue-200 rounded-t h-[40%] text-[9px] text-center text-slate-600 pt-1">C</div>
                              <div className="flex-1 bg-blue-400 rounded-t h-[70%] text-[9px] text-center text-white pt-1">B</div>
                              <div className="flex-1 bg-blue-600 rounded-t h-[95%] text-[9px] text-center text-white pt-1 font-bold">A</div>
                              <div className="flex-1 bg-sky-400 rounded-t h-[60%] text-[9px] text-center text-white pt-1">A+</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs text-slate-600">
                            <span>Average Score: <strong className="text-blue-600">88.4%</strong></span>
                            <span>Pass Rate: <strong className="text-emerald-600">96.2%</strong></span>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                </div>

                {/* Laptop Base */}
                <div className="h-3.5 bg-slate-800 rounded-b-xl border-t border-slate-700 relative flex items-center justify-center">
                  <div className="w-16 h-1 bg-slate-600 rounded-full"></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 bg-slate-50/60 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">FEATURES</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why Choose TrustExam?
            </h2>
            <p className="text-slate-600 text-base">
              Everything you need to conduct, monitor, and evaluate online examinations with maximum security and ease.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature Card 1 */}
            <div className="p-7 bg-white rounded-2xl border border-slate-200/80 shadow-soft-md hover:shadow-soft-lg hover:-translate-y-1 transition-all space-y-4 text-left group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Secure Authentication</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> JWT Authentication
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> Role Based Access
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> Encrypted APIs
                </li>
              </ul>
            </div>

            {/* Feature Card 2 */}
            <div className="p-7 bg-white rounded-2xl border border-slate-200/80 shadow-soft-md hover:shadow-soft-lg hover:-translate-y-1 transition-all space-y-4 text-left group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Online Examinations</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> Create Exams & Tests
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> MCQs & Objective Questions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> Coding Tests & Auto Submission
                </li>
              </ul>
            </div>

            {/* Feature Card 3 */}
            <div className="p-7 bg-white rounded-2xl border border-slate-200/80 shadow-soft-md hover:shadow-soft-lg hover:-translate-y-1 transition-all space-y-4 text-left group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Real-Time Monitoring</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> Exam Countdown Timer
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> Anti-Tamper Auto Save
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> Student Activity Tracking
                </li>
              </ul>
            </div>

            {/* Feature Card 4 */}
            <div className="p-7 bg-white rounded-2xl border border-slate-200/80 shadow-soft-md hover:shadow-soft-lg hover:-translate-y-1 transition-all space-y-4 text-left group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Result & Analytics</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> Instant Results Generation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> Performance Reports
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> Student Leaderboard & Rank
                </li>
              </ul>
            </div>

            {/* Feature Card 5 */}
            <div className="p-7 bg-white rounded-2xl border border-slate-200/80 shadow-soft-md hover:shadow-soft-lg hover:-translate-y-1 transition-all space-y-4 text-left group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Role-Based Dashboard</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> Admin Control Console
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> Faculty Management Portal
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> Student Exam Interface
                </li>
              </ul>
            </div>

            {/* Feature Card 6 */}
            <div className="p-7 bg-white rounded-2xl border border-slate-200/80 shadow-soft-md hover:shadow-soft-lg hover:-translate-y-1 transition-all space-y-4 text-left group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Cloud className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Cloud Deployment</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> Docker Ready Containerization
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> Vercel & Render Integration
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> MongoDB Atlas Cloud DB
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* ABOUT / USE CASE SECTION */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 text-left space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">ABOUT TRUSTEXAM</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Designed for Academic & Enterprise Excellence
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                TrustExam is a full-stack online examination platform designed for universities, colleges, and training institutes. It addresses equitable access to quality education (UN SDG Goal 4) by enabling tamper-evident, automated exam proctoring anywhere in the world.
              </p>
              <div className="space-y-3 pt-2 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 font-bold" />
                  </div>
                  <div>
                    <strong>For Academics & College Projects:</strong> Demonstrates full-stack architecture (React, Node, Express, Mongo) with production-ready security patterns.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 font-bold" />
                  </div>
                  <div>
                    <strong>For Software Engineering Interviews:</strong> Clean REST APIs, stateful anti-cheat tracking, JWT authentication middleware, and Docker container support.
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-8 bg-gradient-to-br from-blue-50 via-sky-50 to-white rounded-3xl border border-blue-100 shadow-soft-lg space-y-6 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">SDG Goal 4 Quality Education</h4>
                    <p className="text-xs text-slate-500">Equitable, remote-certified online testing</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-soft-sm">
                    <div className="text-2xl font-extrabold text-blue-600">100%</div>
                    <div className="text-xs text-slate-500 mt-1">Browser Native Access</div>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-soft-sm">
                    <div className="text-2xl font-extrabold text-emerald-600">Zero</div>
                    <div className="text-xs text-slate-500 mt-1">Software Downloads Needed</div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-soft-sm flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Tamper-Evident Audit Logs</span>
                  <span className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">Verified</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECURITY & INTEGRITY SECTION */}
      <section id="security" className="py-20 bg-slate-50/60 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">SECURITY & INTEGRITY ENGINE</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Enterprise Anti-Cheating & Exam Protection
            </h2>
            <p className="text-slate-600 text-base">
              TrustExam is engineered with multi-layered proctoring, real-time event tracking, and dynamic integrity scoring to guarantee exam credibility.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {[
              {
                title: 'Tab & Window Switch Tracking',
                desc: 'Detects visibility loss and window focus shifts with automated threshold warnings and automatic exam submission.',
                icon: Eye,
                color: 'text-blue-600 bg-blue-50 border-blue-200'
              },
              {
                title: 'IP & Session Restriction',
                desc: 'Enforces single-session IP binding and prevents concurrent attempts or unauthorized proxy access.',
                icon: Lock,
                color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
              },
              {
                title: 'Dynamic Trust Score Index',
                desc: 'Computes student integrity scores (0-100) dynamically based on violation logs and historical compliance.',
                icon: ShieldCheck,
                color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
              },
              {
                title: 'Shortcut & Copy Protection',
                desc: 'Disables right-click context menus, clipboard copy/paste, and developer tool shortcuts during active exams.',
                icon: ShieldAlert,
                color: 'text-amber-600 bg-amber-50 border-amber-200'
              },
              {
                title: 'Targeted Student Whitelisting',
                desc: 'Restricts exam eligibility to whitelisted institutional email lists with role-based JWT authorization.',
                icon: UserCheck,
                color: 'text-purple-600 bg-purple-50 border-purple-200'
              },
              {
                title: 'Automated Unload Auto-Submit',
                desc: 'Background beacon auto-submission ensures answers are safely locked if browser tab is unexpectedly closed.',
                icon: Clock,
                color: 'text-sky-600 bg-sky-50 border-sky-200'
              }
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-soft-sm hover:shadow-soft-md hover:-translate-y-1 transition-all space-y-3 group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${feature.color} group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* EXAM WORKFLOW SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">END-TO-END WORKFLOW</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Complete Examination Lifecycle
            </h2>
            <p className="text-slate-600 text-base">
              From automated AI question generation to real-time proctoring and verified certification, TrustExam streamlines every stage of online assessment.
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Top Row: Steps 1 to 3 */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
              
              {/* Step 1 */}
              <div className="p-5 bg-blue-50/80 rounded-2xl border border-blue-200 text-center space-y-2 relative shadow-soft-sm hover:shadow-soft-md transition-all">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mx-auto">
                  1
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Exam Authoring</h4>
                <p className="text-xs text-blue-700 font-medium">AI Generation & CSV Bulk Upload</p>
              </div>

              {/* Arrow */}
              <div className="hidden lg:flex items-center justify-center text-blue-400">
                <ChevronRight className="w-6 h-6" />
              </div>

              {/* Step 2 */}
              <div className="p-5 bg-sky-50/80 rounded-2xl border border-sky-200 text-center space-y-2 shadow-soft-sm hover:shadow-soft-md transition-all">
                <div className="w-8 h-8 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center mx-auto">
                  2
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Student Onboarding</h4>
                <p className="text-xs text-sky-700 font-medium">Email Invites & Domain Whitelisting</p>
              </div>

              {/* Arrow */}
              <div className="hidden lg:flex items-center justify-center text-sky-400">
                <ChevronRight className="w-6 h-6" />
              </div>

              {/* Step 3 */}
              <div className="p-5 bg-indigo-50/80 rounded-2xl border border-indigo-200 text-center space-y-2 shadow-soft-sm hover:shadow-soft-md transition-all">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mx-auto">
                  3
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Live Proctoring</h4>
                <p className="text-xs text-indigo-700 font-medium">Tab Monitoring & Anti-Cheat Shield</p>
              </div>

            </div>

            {/* Bottom Row: Steps 4 and 5 */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-center max-w-3xl mx-auto">
              
              {/* Step 4 */}
              <div className="p-5 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-center space-y-2 shadow-soft-sm hover:shadow-soft-md transition-all">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mx-auto">
                  4
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Automated Grading</h4>
                <p className="text-xs text-emerald-700 font-medium">Negative Marking & Class Ranks</p>
              </div>

              {/* Arrow */}
              <div className="hidden lg:flex items-center justify-center text-emerald-400">
                <ChevronRight className="w-6 h-6" />
              </div>

              {/* Step 5 */}
              <div className="p-5 bg-purple-50/80 rounded-2xl border border-purple-200 text-center space-y-2 shadow-soft-sm hover:shadow-soft-md transition-all">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center mx-auto">
                  5
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Certificates & Badges</h4>
                <p className="text-xs text-purple-700 font-medium">PDF Reports & Integrity Index</p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* STATISTICS SECTION */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono">500+</div>
              <div className="text-xs sm:text-sm font-medium text-blue-100">Exams Conducted</div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono">1000+</div>
              <div className="text-xs sm:text-sm font-medium text-blue-100">Students</div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono">99.9%</div>
              <div className="text-xs sm:text-sm font-medium text-blue-100">System Uptime</div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono">15+</div>
              <div className="text-xs sm:text-sm font-medium text-blue-100">REST APIs</div>
            </div>

            <div className="col-span-2 md:col-span-1 space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono">100%</div>
              <div className="text-xs sm:text-sm font-medium text-blue-100">Responsive</div>
            </div>

          </div>
        </div>
      </section>

      {/* SECURITY SECTION */}
      <section className="py-20 bg-slate-50/60 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">ENTERPRISE SECURITY</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Multi-Layer Protection
            </h2>
            <p className="text-slate-600 text-base">
              Engineered with modern security protocols to ensure complete data protection and exam integrity.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            
            <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-soft-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Key className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-base">JWT Authentication</h4>
                <p className="text-xs text-slate-600">Stateless, encrypted session token authorization across endpoints.</p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-soft-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-base">Role Based Access</h4>
                <p className="text-xs text-slate-600">Strict permission checks isolating Student, Faculty, and Admin controls.</p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-soft-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-base">Input Validation</h4>
                <p className="text-xs text-slate-600">Sanitized user payloads preventing injection vulnerabilities.</p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-soft-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-base">Protected APIs</h4>
                <p className="text-xs text-slate-600">Middleware guards blocking unauthenticated API access.</p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-soft-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-base">MongoDB Atlas</h4>
                <p className="text-xs text-slate-600">Encrypted cloud database storage with automated backups.</p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-soft-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Boxes className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-base">Docker Containers</h4>
                <p className="text-xs text-slate-600">Isolated execution environment ensuring repeatable deployments.</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-b from-white via-blue-50/50 to-blue-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-10 sm:p-14 bg-white rounded-3xl border border-blue-100 shadow-soft-xl space-y-6">
            
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Ready to Experience Secure Online Exams?
            </h2>

            <p className="text-slate-600 text-base max-w-xl mx-auto">
              Join thousands of students and faculty members conducting exams with 100% integrity, real-time monitoring, and instant reporting.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setIsDemoModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                Launch Demo
              </button>

              <a
                href="https://github.com/arvi8080/TrustExam"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-semibold text-sm shadow-soft-md hover:shadow-soft-lg transition-all flex items-center gap-2"
              >
                <GithubIcon className="w-4 h-4" />
                GitHub Repository
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* CONTACT & FOOTER */}
      <footer id="contact" className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-10 pb-12 border-b border-slate-800 text-left">
            
            {/* Column 1: Brand */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                  Trust<span className="text-blue-500">Exam</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Full-stack secure online examination platform with AI proctoring, role-based controls, and real-time monitoring. Built for universities, colleges, and software engineering portfolios.
              </p>
              
              <div className="flex items-center gap-3 pt-2">
                <a 
                  href="https://github.com/arvi8080/TrustExam" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
                <a 
                  href="mailto:support@trustexam.com" 
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('security')} className="hover:text-white transition-colors">Security Engine</button></li>
                <li><button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">About Platform</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">Contact Support</button></li>
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contact Us</h4>
              <div className="space-y-2 text-xs text-slate-400">
                <p>Email: <a href="mailto:support@trustexam.com" className="text-blue-400 hover:underline">support@trustexam.com</a></p>
                <p>Status: <span className="text-emerald-400 font-semibold">All Systems Operational</span></p>
                <p>Version: <span className="font-mono text-slate-300">v2.0 Enterprise Ready</span></p>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>© 2026 TrustExam. Built for Quality Education (UN SDG Goal 4).</div>
            <div className="flex gap-6">
              <button onClick={() => navigate('/login')} className="hover:text-slate-300">Sign In</button>
              <button onClick={() => scrollToSection('security')} className="hover:text-slate-300">Security Specs</button>
            </div>
          </div>
        </div>
      </footer>

      {/* LIVE DEMO INTERACTIVE MODAL */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-soft-xl max-w-lg w-full p-6 space-y-6 text-left relative">
            
            <button
              onClick={() => setIsDemoModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                <Play className="w-3 h-3 fill-current" /> Live Exam Sample Demo
              </div>
              <h3 className="text-lg font-bold text-slate-900">Try TrustExam Question Interface</h3>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Subject: CS301 Algorithms</span>
                <span className="text-emerald-600 font-semibold font-mono">Timer: 00:04:59</span>
              </div>
              
              <p className="font-semibold text-slate-800 text-sm">
                Which data structure best guarantees O(1) average time complexity for key lookup operations?
              </p>

              <div className="space-y-2 pt-1">
                {[
                  'A. Hash Table with Uniform Hashing',
                  'B. Binary Search Tree',
                  'C. Doubly Linked List',
                  'D. Min-Heap'
                ].map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => setDemoSelectedAnswer(idx)}
                    className={`w-full p-3 rounded-lg border text-left font-medium transition-all ${
                      demoSelectedAnswer === idx
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {demoSubmitted ? (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center justify-between">
                <span>✓ Exam submitted successfully! Integrity Score: 100%</span>
                <button 
                  onClick={() => {
                    setIsDemoModalOpen(false);
                    navigate('/login');
                  }}
                  className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-emerald-700"
                >
                  Go to Login
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsDemoModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Close
                </button>
                <button
                  onClick={() => setDemoSubmitted(true)}
                  disabled={demoSelectedAnswer === null}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-md shadow-blue-600/20"
                >
                  Submit Sample Exam
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default LandingPage;
