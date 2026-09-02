import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

// Enhanced Results & Analysis Modal Component
const ResultsModal = ({ result, onClose }) => {
  const [rank, setRank] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    if (result) {
      fetchRank();
    }
  }, [result]);

  const fetchRank = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!result?.exam?._id) return;
      const response = await fetch(`${API_BASE_URL}/api/student/exams/${result.exam._id}/rank`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const rankData = await response.json();
        setRank(rankData.rank);
      }
    } catch (error) {
      console.error('Error fetching rank:', error);
    }
  };

  const downloadPDF = async () => {
    try {
      if (!result?._id) {
        alert('Invalid result ID. Please refresh and try again.');
        return;
      }
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/student/results/${result._id}/pdf`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `exam-result-${result.exam?.title?.replace(/\s+/g, '-').toLowerCase() || 'result'}.html`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to download PDF report');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF report');
    }
  };

  if (!result) return null;

  const correctAnswersCount = result.answers ? result.answers.filter(a => a.isCorrect).length : 0;
  const totalQuestions = result.answers ? result.answers.length : 0;
  const incorrectAnswersCount = totalQuestions - correctAnswersCount;

  const filteredAnswers = (result.answers || []).filter(answer => {
    if (activeFilter === 'correct') return answer.isCorrect;
    if (activeFilter === 'incorrect') return !answer.isCorrect;
    return true;
  });

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider rounded-full border border-indigo-500/30">
              Exam Performance Audit
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {result.exam?.title || 'Examination Result'}
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Completed on {new Date(result.submittedAt).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-8">
          
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 bg-gradient-to-br from-indigo-50 to-blue-50/50 rounded-2xl border border-indigo-100 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">Final Score</p>
              <p className="text-3xl sm:text-4xl font-extrabold text-indigo-950">{result.percentage}%</p>
            </div>

            <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-2xl border border-emerald-100 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-1">Accuracy</p>
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-950">{correctAnswersCount}/{totalQuestions}</p>
            </div>

            <div className="p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Outcome</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                result.status === 'pass' 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}>
                {result.status === 'pass' ? '✓ Passed' : '✕ Needs Review'}
              </span>
            </div>

            <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50/50 rounded-2xl border border-purple-100 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-purple-600 mb-1">Class Rank</p>
              <p className="text-3xl sm:text-4xl font-extrabold text-purple-950">{rank ? `#${rank}` : 'N/A'}</p>
            </div>
          </div>

          {/* Auto-Submit Notice if applicable */}
          {result.autoSubmitted && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3 text-amber-900 text-sm">
              <span className="text-lg">⚠️</span>
              <div>
                <p className="font-semibold">Auto-submitted by System Guard</p>
                <p className="text-amber-700 text-xs mt-0.5">
                  Reason: {result.autoSubmitReason ? result.autoSubmitReason.replace(/_/g, ' ') : 'Session ended'}
                </p>
              </div>
            </div>
          )}

          {/* Detailed Question Review */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
              <div>
                <h4 className="text-lg font-bold text-slate-900">Question Performance Breakdown</h4>
                <p className="text-xs text-slate-500">Review option selections and correct answers</p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${activeFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  All ({totalQuestions})
                </button>
                <button
                  onClick={() => setActiveFilter('correct')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${activeFilter === 'correct' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-emerald-700'}`}
                >
                  Correct ({correctAnswersCount})
                </button>
                <button
                  onClick={() => setActiveFilter('incorrect')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${activeFilter === 'incorrect' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:text-rose-700'}`}
                >
                  Incorrect ({incorrectAnswersCount})
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredAnswers.length > 0 ? (
                filteredAnswers.map((answer, index) => (
                  <div
                    key={index}
                    className={`p-5 rounded-2xl border transition-all ${
                      answer.isCorrect 
                        ? 'bg-emerald-50/40 border-emerald-200/80 hover:border-emerald-300' 
                        : 'bg-rose-50/40 border-rose-200/80 hover:border-rose-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 bg-slate-900 text-white text-xs font-bold rounded-md">
                          Q{index + 1}
                        </span>
                        <h5 className="font-semibold text-slate-900 text-sm">
                          {answer.question?.questionText || `Question ${index + 1}`}
                        </h5>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
                        answer.isCorrect 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}>
                        {answer.isCorrect ? '✓ Correct' : '✕ Incorrect'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200/60">
                      <div className="p-3 rounded-xl bg-white/80 border border-slate-200/60">
                        <span className="text-slate-500 block font-medium mb-1">Your Selection:</span>
                        <span className={`font-bold ${answer.isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {answer.selectedAnswer !== undefined 
                            ? (answer.question?.options?.[answer.selectedAnswer] || `Option ${answer.selectedAnswer + 1}`) 
                            : 'Not answered'}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/80 border border-slate-200/60">
                        <span className="text-slate-500 block font-medium mb-1">Correct Solution:</span>
                        <span className="font-bold text-emerald-700">
                          {answer.correctAnswer !== undefined 
                            ? (answer.question?.options?.[answer.correctAnswer] || `Option ${answer.correctAnswer + 1}`) 
                            : 'Option 1'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-500 text-sm font-medium">No questions match the selected filter.</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center text-xs text-slate-500 space-x-1">
            <span>Verified System Report</span>
            <span>•</span>
            <span className="font-mono">{result._id}</span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={downloadPDF}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-indigo-600/20 hover:shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download Official Report</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-sm rounded-xl transition-all"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

const StudentDashboard = () => {
  const [exams, setExams] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [countdowns, setCountdowns] = useState({});
  const [results, setResults] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ username: '', email: '', studentId: '', department: '', year: '' });
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'exams' | 'results' | 'achievements' | 'profile'
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailableExams();
    fetchResults();
    fetchAchievements();
    fetchProfile();
  }, []);

  // Update countdown timers for upcoming exams
  useEffect(() => {
    const updateCountdowns = () => {
      const newCountdowns = {};
      upcomingExams.forEach(exam => {
        const now = new Date().getTime();
        const startTime = new Date(exam.startTime).getTime();
        const difference = startTime - now;

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);

          if (days > 0) {
            newCountdowns[exam._id] = `${days}d ${hours}h ${minutes}m`;
          } else if (hours > 0) {
            newCountdowns[exam._id] = `${hours}h ${minutes}m ${seconds}s`;
          } else {
            newCountdowns[exam._id] = `${minutes}m ${seconds}s`;
          }
        } else {
          newCountdowns[exam._id] = 'Available Now';
        }
      });
      setCountdowns(newCountdowns);
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [upcomingExams]);

  const fetchAvailableExams = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await fetch(`${API_BASE_URL}/api/student/exams`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setExams(Array.isArray(data.active) ? data.active : []);
        setUpcomingExams(Array.isArray(data.upcoming) ? data.upcoming : []);
        setFetchError(null);
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text();
        }
        const errorMsg = errorData.error || errorData || `HTTP ${response.status}`;
        setFetchError(errorMsg);
        setExams([]);
        setUpcomingExams([]);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
      setFetchError(error.message || 'Network error');
      setExams([]);
      setUpcomingExams([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch(`${API_BASE_URL}/api/student/results`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setResults(Array.isArray(data) ? data : []);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      setResults([]);
    }
  };

  const fetchAchievements = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch(`${API_BASE_URL}/api/student/achievements`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAchievements(Array.isArray(data) ? data : []);
      } else {
        setAchievements([]);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
      setAchievements([]);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch(`${API_BASE_URL}/api/student/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setProfileForm({
          username: data.username || '',
          email: data.email || '',
          studentId: data.studentId || '',
          department: data.department || '',
          year: data.year || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleTakeExam = (examId) => {
    navigate(`/exam/${examId}`);
  };

  const handleViewResults = (result) => {
    setSelectedResult(result);
    setShowResultsModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleUpdateProfile = async () => {
    setUpdatingProfile(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/student/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });
      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setEditingProfile(false);
        alert('Profile updated successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExamAvailable = (exam) => {
    const now = new Date();
    const startTime = new Date(exam.startTime);
    const endTime = new Date(exam.endTime);
    return now >= startTime && now <= endTime;
  };

  const averageScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + (r.percentage || 0), 0) / results.length)
    : 0;

  const filteredActiveExams = exams.filter(exam =>
    exam.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exam.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping"></div>
          <div className="w-16 h-16 rounded-full border-4 border-t-indigo-500 border-r-indigo-500 border-b-transparent border-l-transparent animate-spin"></div>
        </div>
        <p className="text-slate-400 font-medium text-sm tracking-wide">Loading Secure Student Workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Sticky Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
              <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/20">
                <span className="text-white font-extrabold text-lg tracking-wider">T</span>
              </div>
              <div>
                <span className="text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                  TrustExam
                </span>
                <span className="hidden sm:inline-block ml-2 px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded-md border border-indigo-100">
                  Student Portal
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-1">
              {[
                { id: 'overview', label: 'Dashboard', icon: '🏠' },
                { id: 'exams', label: `Exams (${exams.length})`, icon: '📚' },
                { id: 'results', label: `Results (${results.length})`, icon: '📊' },
                { id: 'achievements', label: `Badges (${achievements.length})`, icon: '🏆' },
                { id: 'profile', label: 'Profile', icon: '👤' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* Right User Bar */}
            <div className="flex items-center space-x-3">
              {profile && (
                <div 
                  onClick={() => setActiveTab('profile')}
                  className="hidden sm:flex items-center space-x-2.5 p-1.5 pl-3 pr-3 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all cursor-pointer border border-slate-200/60"
                >
                  <div className="w-7 h-7 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-xs">
                    {profile.username ? profile.username.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800 leading-tight">{profile.username || 'Student'}</p>
                    <p className="text-[10px] font-semibold text-emerald-600 leading-tight">
                      Trust Index: {profile.trustScore || 100}/100
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-all border border-rose-200/60 flex items-center space-x-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Subnav */}
        <div className="flex md:hidden overflow-x-auto px-4 py-2 bg-slate-50 border-t border-slate-200/60 space-x-2">
          {[
            { id: 'overview', label: 'Dashboard' },
            { id: 'exams', label: 'Exams' },
            { id: 'results', label: 'Results' },
            { id: 'achievements', label: 'Badges' },
            { id: 'profile', label: 'Profile' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                activeTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* Welcome Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 mb-8 shadow-xl">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-indigo-300 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Proctored Student Dashboard</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Welcome back, {profile?.username || 'Student'}! 🎓
            </h1>
            
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Track your scheduled proctored assessments, review exam score analytics, and maintain your integrity index.
            </p>
          </div>
        </div>

        {/* 4 Stat Overview Cards */}
        {profile && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
            
            {/* Trust Score */}
            <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Trust Score</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                  🛡️
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{profile.trustScore || 100}<span className="text-xs text-slate-400 font-normal">/100</span></p>
              <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    (profile.trustScore || 100) >= 80 ? 'bg-emerald-500' :
                    (profile.trustScore || 100) >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${profile.trustScore || 100}%` }}
                ></div>
              </div>
            </div>

            {/* Exams Completed */}
            <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Completed</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                  📝
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{results.length}</p>
              <p className="text-xs text-slate-500 mt-2 font-medium">Recorded Submissions</p>
            </div>

            {/* Average Score */}
            <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Average Score</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                  📈
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{averageScore}%</p>
              <p className="text-xs text-slate-500 mt-2 font-medium">Overall Performance</p>
            </div>

            {/* Badges Earned */}
            <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Badges</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                  🏆
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{achievements.length}</p>
              <p className="text-xs text-slate-500 mt-2 font-medium">Milestone Rewards</p>
            </div>

          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            
            {/* Live Active Exams Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>Live & Active Exams</span>
                  </h2>
                  <p className="text-xs text-slate-500">Exams currently open for completion</p>
                </div>
                <button
                  onClick={() => setActiveTab('exams')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  View All ({exams.length}) →
                </button>
              </div>

              {exams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {exams.slice(0, 3).map(exam => (
                    <div key={exam._id} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-md">
                            ● Live Now
                          </span>
                          <span className="text-xs font-semibold text-slate-500">{exam.duration} mins</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg mb-1">{exam.title}</h3>
                        <p className="text-slate-600 text-xs line-clamp-2 mb-4">{exam.description || 'Proctored assessment session.'}</p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-slate-100">
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>Questions: {exam.questions?.length || 0}</span>
                          <span>Ends: {formatDate(exam.endTime)}</span>
                        </div>
                        <button
                          onClick={() => handleTakeExam(exam._id)}
                          disabled={!isExamAvailable(exam)}
                          className={`w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all ${
                            !isExamAvailable(exam) ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          Start Exam 🚀
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center">
                  <p className="text-slate-500 text-sm font-medium">No live exams open right now. Check upcoming schedules below.</p>
                </div>
              )}
            </div>

            {/* Upcoming Scheduled Exams */}
            {upcomingExams.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">⏰ Scheduled Upcoming Exams</h2>
                    <p className="text-xs text-slate-500">Assessments scheduled to launch soon</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingExams.map(exam => (
                    <div key={exam._id} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold rounded-md">
                          Scheduled
                        </span>
                        <span className="text-xs font-semibold text-slate-500">{exam.duration} mins</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg mb-1">{exam.title}</h3>
                      <p className="text-slate-600 text-xs line-clamp-2 mb-4">{exam.description || 'Upcoming proctored assessment.'}</p>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center mb-4">
                        <p className="text-[10px] font-bold uppercase text-slate-500">Launches In</p>
                        <p className="text-lg font-mono font-bold text-indigo-700">{countdowns[exam._id] || 'Calculating...'}</p>
                      </div>

                      <p className="text-xs text-slate-500 text-center">Starts: {formatDate(exam.startTime)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Results Snapshot */}
            {results.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">📊 Recent Results</h2>
                    <p className="text-xs text-slate-500">Latest completed proctored submissions</p>
                  </div>
                  <button onClick={() => setActiveTab('results')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
                    View All ({results.length}) →
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {results.slice(0, 4).map(result => (
                    <div key={result._id} className="py-3.5 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{result.exam?.title || 'Exam Result'}</h4>
                        <p className="text-xs text-slate-500">Completed: {formatDate(result.submittedAt)}</p>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          result.status === 'pass' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {result.percentage}% ({result.status === 'pass' ? 'Pass' : 'Fail'})
                        </span>
                        <button
                          onClick={() => handleViewResults(result)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-all"
                        >
                          View Report
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: AVAILABLE EXAMS */}
        {activeTab === 'exams' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Available Examinations</h2>
                <p className="text-xs text-slate-500">Select an assessment to launch the secure proctored environment</p>
              </div>

              <div className="w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search exams by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {filteredActiveExams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredActiveExams.map(exam => (
                  <div key={exam._id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-md">
                          ● Active Now
                        </span>
                        <span className="text-xs font-semibold text-slate-500">{exam.duration} Minutes</span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-lg mb-2">{exam.title}</h3>
                      <p className="text-slate-600 text-xs line-clamp-3 mb-4">{exam.description || 'Proctored assessment session.'}</p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                        <div>Questions: <span className="font-bold text-slate-800">{exam.questions?.length || 0}</span></div>
                        <div>Passing: <span className="font-bold text-slate-800">{exam.passingScore || 50}%</span></div>
                      </div>
                      <button
                        onClick={() => handleTakeExam(exam._id)}
                        disabled={!isExamAvailable(exam)}
                        className={`w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all ${
                          !isExamAvailable(exam) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        Start Proctored Exam 🚀
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center">
                <p className="text-slate-500 font-semibold text-sm">No available exams match your criteria.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: RESULTS */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Completed Results</h2>
              <p className="text-xs text-slate-500">Full audit trail of your completed assessments</p>
            </div>

            {results.length > 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="divide-y divide-slate-100">
                  {results.map(result => (
                    <div key={result._id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-all">
                      <div>
                        <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider mb-1 ${
                          result.status === 'pass' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {result.status === 'pass' ? 'PASSED' : 'FAILED'}
                        </span>
                        <h3 className="font-bold text-slate-900 text-base">{result.exam?.title || 'Examination Result'}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Submitted: {formatDate(result.submittedAt)}</p>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="text-2xl font-black text-slate-900">{result.percentage}%</p>
                          <p className="text-[10px] font-semibold text-slate-400">Total Accuracy</p>
                        </div>

                        <button
                          onClick={() => handleViewResults(result)}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                        >
                          View Analysis & PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center">
                <p className="text-slate-500 font-semibold text-sm">No exam attempts recorded yet.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ACHIEVEMENTS */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Milestone Badges & Rewards</h2>
              <p className="text-xs text-slate-500">Badges awarded for academic integrity and exam performance</p>
            </div>

            {achievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map(achievement => (
                  <div key={achievement._id} className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-xs">
                    <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-orange-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-md shadow-amber-500/20">
                      🏆
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">{achievement.badge?.name || 'Achievement Badge'}</h3>
                    <p className="text-slate-600 text-xs mb-3">{achievement.badge?.description || 'Earned through performance.'}</p>
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-semibold rounded-full">
                      Earned on {new Date(achievement.earnedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center">
                <p className="text-slate-500 font-semibold text-sm">No badges earned yet. Complete proctored exams to unlock rewards!</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PROFILE */}
        {activeTab === 'profile' && profile && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Student Profile Settings</h2>
              <p className="text-xs text-slate-500">Manage your institutional student profile information</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-slate-100">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-600/20">
                  {profile.username ? profile.username.charAt(0).toUpperCase() : 'S'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{profile.username}</h3>
                  <p className="text-xs text-slate-500">{profile.email}</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-md">
                    Trust Score: {profile.trustScore || 100}/100
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Username</label>
                  <input
                    type="text"
                    value={profileForm.username}
                    onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Student ID</label>
                  <input
                    type="text"
                    placeholder="e.g. STU-2026-88"
                    value={profileForm.studentId}
                    onChange={(e) => setProfileForm({ ...profileForm, studentId: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Department</label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science"
                    value={profileForm.department}
                    onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Academic Year</label>
                  <select
                    value={profileForm.year}
                    onChange={(e) => setProfileForm({ ...profileForm, year: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">Select Academic Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  onClick={handleUpdateProfile}
                  disabled={updatingProfile}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
                >
                  {updatingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Student Workspace Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            
            {/* Brand Column */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-extrabold text-sm">
                  T
                </div>
                <span className="text-lg font-black text-white tracking-tight">TrustExam</span>
                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase rounded border border-indigo-500/30">
                  Proctored Workspace
                </span>
              </div>
              <p className="text-slate-400 text-xs max-w-md leading-relaxed">
                TrustExam provides real-time proctored online examinations, AI-generated questions, tab-switch monitoring, and automated candidate integrity verification.
              </p>
              <div className="flex items-center space-x-2 text-[11px] text-emerald-400 font-semibold pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Proctor Engine Active & Monitored</span>
              </div>
            </div>

            {/* Navigation Column */}
            <div className="space-y-2">
              <p className="text-slate-200 font-bold uppercase tracking-wider text-[11px]">Quick Navigation</p>
              <ul className="space-y-1.5 text-slate-400 font-medium">
                <li><button onClick={() => setActiveTab('overview')} className="hover:text-white transition-colors">Dashboard Overview</button></li>
                <li><button onClick={() => setActiveTab('exams')} className="hover:text-white transition-colors">Available Examinations</button></li>
                <li><button onClick={() => setActiveTab('results')} className="hover:text-white transition-colors">Results & Transcripts</button></li>
                <li><button onClick={() => setActiveTab('achievements')} className="hover:text-white transition-colors">Badges & Milestones</button></li>
                <li><button onClick={() => setActiveTab('profile')} className="hover:text-white transition-colors">Student Profile Settings</button></li>
              </ul>
            </div>

            {/* Security & Compliance */}
            <div className="space-y-2">
              <p className="text-slate-200 font-bold uppercase tracking-wider text-[11px]">Security & Compliance</p>
              <ul className="space-y-1.5 text-slate-400 font-medium">
                <li className="flex items-center space-x-1.5"><span>🛡️</span><span>Tab Switch Monitoring</span></li>
                <li className="flex items-center space-x-1.5"><span>🔒</span><span>Single-Session IP Binding</span></li>
                <li className="flex items-center space-x-1.5"><span>📊</span><span>Automated Accuracy Grading</span></li>
                <li className="flex items-center space-x-1.5"><span>📜</span><span>PDF Certificate Export</span></li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
            <p>© 2026 TrustExam Platform. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <span>System Status: <strong className="text-emerald-400">Operational 100%</strong></span>
              <span>•</span>
              <span>Encrypted Session</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Results & Analysis Modal */}
      {showResultsModal && (
        <ResultsModal
          result={selectedResult}
          onClose={() => {
            setShowResultsModal(false);
            setSelectedResult(null);
          }}
        />
      )}

    </div>
  );
};

export default StudentDashboard;
