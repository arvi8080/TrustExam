import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

// Enhanced Results Modal Component
const ResultsModal = ({ result, onClose }) => {
  const [rank, setRank] = useState(null);

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
        console.error('Invalid result ID:', result?._id);
        alert('Invalid result. Please refresh and try again.');
        return;
      }

      console.log('Downloading PDF for result ID:', result._id);
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
        a.download = `exam-result-${result.exam?.title?.replace(/\s+/g, '-').toLowerCase() || 'exam'}.html`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to download PDF');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF');
    }
  };

  if (!result) return null;

  const correctAnswers = result.answers ? result.answers.filter(a => a.isCorrect).length : 0;
  const totalQuestions = result.answers ? result.answers.length : 0;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">📊 Exam Results</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {/* Exam Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border border-blue-200">
            <h4 className="text-xl font-semibold text-gray-900 mb-4">{result.exam?.title || 'Exam'}</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Score</p>
                <p className="text-3xl font-bold text-blue-600">{result.percentage}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Correct Answers</p>
                <p className="text-3xl font-bold text-green-600">{correctAnswers}/{totalQuestions}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Status</p>
                <p className={`text-xl font-bold ${result.status === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
                  {result.status === 'pass' ? '✅ Passed' : '❌ Failed'}
                </p>
              </div>
              {rank && (
                <div className="text-center">
                  <p className="text-sm text-gray-600">Your Rank</p>
                  <p className="text-2xl font-bold text-purple-600">#{rank}</p>
                </div>
              )}
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">Completed On</p>
              <p className="text-lg text-gray-900">{new Date(result.submittedAt).toLocaleString()}</p>
            </div>
            {result.autoSubmitted && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Auto-submitted:</strong> {result.autoSubmitReason.replace('_', ' ')}
                </p>
              </div>
            )}
          </div>

          {/* Detailed Answers */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">📝 Detailed Answers</h4>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {(result.answers || []).map((answer, index) => (
                <div key={index} className={`p-4 rounded-lg border ${answer.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-2">Question {index + 1}</p>
                      <p className="text-gray-700 mb-2">{answer.question?.questionText}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Your Answer:</p>
                          <p className={`font-medium ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                            {answer.selectedAnswer !== undefined ? `Option ${answer.selectedAnswer + 1}` : 'Not answered'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Correct Answer:</p>
                          <p className="font-medium text-green-600">Option {answer.correctAnswer + 1}</p>
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${answer.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {answer.isCorrect ? '✅ Correct' : '❌ Incorrect'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={downloadPDF}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition duration-200"
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
  const [countdowns, setCountdowns] = useState({}); // Store countdown for each exam
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
  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailableExams();
    fetchResults();
    fetchAchievements();
    fetchProfile();
  }, []);

  // Countdown timer effect for upcoming exams
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newCountdowns = {};
      
      upcomingExams.forEach(exam => {
        const startTime = new Date(exam.startTime);
        const diff = startTime - now;
        
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          
          newCountdowns[exam._id] = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
          newCountdowns[exam._id] = 'Starting Soon';
        }
      });
      
      setCountdowns(newCountdowns);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [upcomingExams]);

  const fetchAvailableExams = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("No token found!");
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
        console.error(`Failed to fetch exams: ${response.status} - ${errorMsg}`);
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
        console.error('Failed to fetch results:', response.status);
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
        console.error('Failed to fetch achievements:', response.status);
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
      } else {
        console.error('Failed to fetch profile:', response.status);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Header */}
      <header className="bg-white shadow-lg border-b border-gray-200 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TrustExam
              </h1>
            </div>
            <nav className="flex items-center space-x-3">
              <button
                onClick={() => setShowResultsModal(true)}
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 flex items-center space-x-2 shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <span>View Results</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center space-x-2 shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="mb-12">
            <div className="text-center">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                Welcome back, {profile?.username || 'Student'}! 🎓
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Ready to ace your next exam? Choose from available exams below and showcase your knowledge!
              </p>
            </div>
          </div>

          {/* Quick Stats Dashboard */}
          {profile && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Trust Score</p>
                    <p className="text-3xl font-bold">{profile.trustScore}/100</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-blue-400 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full" style={{ width: `${profile.trustScore}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Exams Completed</p>
                    <p className="text-3xl font-bold">{results.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Average Score</p>
                    <p className="text-3xl font-bold">
                      {results.length > 0
                        ? `${Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)}%`
                        : '0%'
                      }
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm font-medium">Achievements</p>
                    <p className="text-3xl font-bold">{achievements.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile Section */}
          {profile && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-12">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
                    <p className="text-gray-600">Manage your account information</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (editingProfile) {
                      setEditingProfile(false);
                    } else {
                      setProfileForm({ 
                        username: profile.username, 
                        email: profile.email,
                        studentId: profile.studentId || '',
                        department: profile.department || '',
                        year: profile.year || ''
                      });
                      setEditingProfile(true);
                    }
                  }}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                >
                  {editingProfile ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">👤 Username</label>
                    {editingProfile ? (
                      <input
                        type="text"
                        value={profileForm.username}
                        onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    ) : (
                      <p className="text-lg text-gray-900 font-medium">{profile.username}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">📧 Email</label>
                    {editingProfile ? (
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    ) : (
                      <p className="text-lg text-gray-900 font-medium">{profile.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">🛡️ Trust Score</label>
                    <div className="flex items-center space-x-4">
                      <div className={`text-3xl font-bold ${
                        profile.trustScore >= 80 ? 'text-green-600' :
                        profile.trustScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {profile.trustScore}/100
                      </div>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-500 ${
                              profile.trustScore >= 80 ? 'bg-green-500' :
                              profile.trustScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${profile.trustScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">📚 Exams Attempted</label>
                    <p className="text-3xl font-bold text-blue-600">{results.length}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">📊 Average Score</label>
                    <p className="text-3xl font-bold text-purple-600">
                      {results.length > 0
                        ? `${Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)}%`
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">🏆 Achievements Earned</label>
                    <p className="text-3xl font-bold text-yellow-600">{achievements.length}</p>
                  </div>
                </div>
              </div>

              {editingProfile && (
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    onClick={() => setEditingProfile(false)}
                    className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-all duration-200 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateProfile}
                    disabled={updatingProfile}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    {updatingProfile ? 'Updating...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Upcoming Exams */}
          {upcomingExams.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Upcoming Exams</h2>
                  <p className="text-gray-600 mt-1">Get ready for these scheduled assessments</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingExams.map(exam => (
                  <div key={exam._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <span className="px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full">
                          Scheduled
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mt-4 mb-2">{exam.title}</h3>
                      <p className="text-purple-100 text-sm line-clamp-2">{exam.description}</p>
                    </div>

                    <div className="p-6">
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span className="text-sm">Duration: {exam.duration} minutes</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span className="text-sm">Questions: {exam.questions?.length || 0}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span className="text-sm">Starts: {new Date(exam.startTime).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Countdown Timer */}
                      <div className="bg-purple-50 rounded-xl p-4 mb-6 border border-purple-200">
                        <div className="text-center">
                          <p className="text-sm text-purple-600 font-medium mb-2">⏰ Time Until Start</p>
                          <p className="text-2xl font-bold text-purple-700 font-mono">
                            {countdowns[exam._id] || 'Calculating...'}
                          </p>
                        </div>
                      </div>

                      <div className="text-center text-gray-500">
                        <p className="text-sm">Exam will be available soon</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Exams */}
          {exams.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Available Exams</h2>
                  <p className="text-gray-600 mt-1">Choose an exam to start your assessment</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {exams.map(exam => (
                  <div key={exam._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                        </div>
                        <span className="px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full">
                          Active
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mt-4 mb-2">{exam.title}</h3>
                      <p className="text-green-100 text-sm line-clamp-2">{exam.description}</p>
                    </div>

                    <div className="p-6">
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span className="text-sm">Duration: {exam.duration} minutes</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span className="text-sm">Questions: {exam.questions?.length || 0}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span className="text-sm">Ends: {new Date(exam.endTime).toLocaleString()}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleTakeExam(exam._id)}
                        disabled={!isExamAvailable(exam)}
                        className={`w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                          !isExamAvailable(exam) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isExamAvailable(exam) ? 'Start Exam 🚀' : 'Not Available'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Results */}
          {results.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Results</h2>
              <div className="space-y-4">
                {results.slice(0, 5).map(result => (
                  <div key={result._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div>
                      <h3 className="font-medium text-gray-900">{result.exam?.title}</h3>
                      <p className="text-sm text-gray-500">Completed on {formatDate(result.submittedAt)}</p>
                    </div>
                    <div className="text-right flex items-center space-x-4">
                      <div>
                        <div className={`text-lg font-semibold ${
                          result.percentage >= 70 ? 'text-green-600' :
                          result.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {result.percentage}%
                        </div>
                        <div className="text-sm text-gray-500">
                          {result.status === 'pass' ? 'Pass' :
                           result.status === 'fail' ? 'Fail' : 'Pending'}
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewResults(result)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements Section */}
          {achievements.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Your Achievements</h2>
                  <p className="text-gray-600 mt-1">Celebrate your academic milestones</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {achievements.map(achievement => (
                  <div key={achievement._id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🏆</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{achievement.badge.name}</h3>
                      <p className="text-gray-600 text-sm">{achievement.badge.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Earned on {new Date(achievement.earnedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Profile Settings</h2>
                <p className="text-gray-600 mt-1">Manage your account information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile?.username || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
                  <input
                    type="text"
                    value={profile?.studentId || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, studentId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your student ID"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <input
                    type="text"
                    value={profile?.department || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your department"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <select
                    value={profile?.year || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, year: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={handleUpdateProfile}
                    disabled={updatingProfile}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Results Modal */}
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
