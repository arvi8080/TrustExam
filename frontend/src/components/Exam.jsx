import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Exam = () => {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [adaptiveQuestions, setAdaptiveQuestions] = useState([]);
  const [currentAdaptiveIndex, setCurrentAdaptiveIndex] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [resultId, setResultId] = useState(null);
  const [tabWarningMessage, setTabWarningMessage] = useState('');
  const [showTabWarningModal, setShowTabWarningModal] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const TAB_SWITCH_WARNING_LIMIT = 1; // Any tab/window switch auto-submits exam

  useEffect(() => {
    fetchExam();
  }, [examId]);

  // Load existing progress if resuming
  useEffect(() => {
    if (exam && exam.isResuming && examStarted) {
      loadProgress();
    }
  }, [exam, examStarted]);

  // Fullscreen enforcement
  useEffect(() => {
    if (!examStarted) return;

    const handleFullscreenChange = () => {
      const inFullscreen = !!document.fullscreenElement;
      setIsFullscreen(inFullscreen);
      if (!inFullscreen && !isSubmitted && tabSwitchCount < TAB_SWITCH_WARNING_LIMIT) {
        recordViolation(1, ['fullscreen_exit']);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [examStarted, isSubmitted, tabSwitchCount]);


  useEffect(() => {
    if (exam && exam.duration && examStarted) {
      setTimeLeft(exam.duration * 60); // Convert minutes to seconds
    }
  }, [exam, examStarted]);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted && examStarted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted && examStarted) {
      handleAutoSubmit('time_ended');
    }
  }, [timeLeft, isSubmitted, examStarted]);

  // Auto-submit on browser close
  useEffect(() => {
    if (!examStarted) return;
    
    const handleBeforeUnload = (e) => {
      if (!isSubmitted) {
        // Send a synchronous request to auto-submit before page unloads
        const payload = JSON.stringify({
          answers: Object.entries(answers).map(([question, selectedAnswer]) => ({
            question,
            selectedAnswer
          })),
          reason: 'browser_closed'
        });
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon(`http://localhost:5001/api/student/exams/${examId}/auto-submit`, blob);
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isSubmitted, answers, examId, examStarted]);

  useEffect(() => {
    if (!examStarted) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !isSubmitted && tabSwitchCount < TAB_SWITCH_WARNING_LIMIT) {
        recordViolation(1, ['tab_switch']);
      }

      if (document.visibilityState === 'visible' && !isSubmitted && tabSwitchCount > 0) {
        setShowTabWarningModal(true);
      }
    };

    const handleWindowBlur = () => {
      if (!isSubmitted && tabSwitchCount < TAB_SWITCH_WARNING_LIMIT) {
        recordViolation(1, ['window_blur']);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [examStarted, isSubmitted, tabSwitchCount]);

  const reportViolation = async (count, activities = ['tab_switch']) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5001/api/student/exams/${examId}/anti-cheating`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tabSwitches: count,
          violationCount: count,
          suspiciousActivities: activities
        })
      });
    } catch (error) {
      console.error('Failed to report violation:', error);
    }
  };

  const recordViolation = (count, activities = ['tab_switch']) => {
    setTabSwitchCount(count);

    const warningText = `⚠️ Warning: Exam security violation detected. Your exam will be auto-submitted because switching tabs/windows is not allowed.`;

    setTabWarningMessage(warningText);
    setShowTabWarningModal(true);

    if (count >= TAB_SWITCH_WARNING_LIMIT) {
      reportViolation(count, activities);
      handleAutoSubmit('tab_switch_violations_exceeded');
    }
  };

  // Auto-submit on internet disconnect after threshold
  useEffect(() => {
    let offlineTimer;

    const handleOffline = () => {
      offlineTimer = setTimeout(() => {
        if (!isSubmitted) {
          handleAutoSubmit('internet_disconnect');
        }
      }, 30000); // 30 seconds threshold
    };

    const handleOnline = () => {
      if (offlineTimer) clearTimeout(offlineTimer);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      if (offlineTimer) clearTimeout(offlineTimer);
    };
  }, [isSubmitted]);

  // Auto-submit function
  const handleAutoSubmit = async (reason) => {
    try {
      const token = localStorage.getItem('token');
      const answersArray = Object.entries(answers).map(([question, selectedAnswer]) => ({
        question,
        selectedAnswer
      }));

      const response = await fetch(`http://localhost:5001/api/student/exams/${examId}/auto-submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answers: answersArray, reason }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          window.location.href = '/student-dashboard';
        }, 3000);
      }
    } catch (error) {
      console.error('Error auto-submitting exam:', error);
    }
  };

  const fetchExam = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch exam details only (not questions yet)
      const examResponse = await fetch(`http://localhost:5001/api/student/exams/${examId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const examData = await examResponse.json();
      setExam(examData);
    } catch (error) {
      console.error('Error fetching exam:', error);
    }
  };

  const requestFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  const startExam = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5001/api/student/exams/${examId}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('🚀 Start exam response:', data);
        console.log('📝 Raw questions data:', data.exam.questions);
        setExam(data.exam);
        setQuestions(data.exam.questions || []);
        console.log('✅ Questions loaded:', data.exam.questions?.length || 0, data.exam.questions);
        setResultId(data.resultId);
        setExamStarted(true);
        
        if (!data.exam.questions || data.exam.questions.length === 0) {
          alert('⚠️ No questions available for this exam. Contact administrator.');
        }
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to start exam');
      }
    } catch (error) {
      console.error('Error starting exam:', error);
      alert('Failed to start exam. Please try again.');
    }
  };


  const handleAnswerChange = (questionId, answer) => {
    const newAnswers = {
      ...answers,
      [questionId]: answer
    };
    setAnswers(newAnswers);

    // Save progress every time answer changes
    saveProgress(newAnswers, currentQuestionIndex);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionNavigation = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmitExam = async () => {
    try {
      const token = localStorage.getItem('token');
      // Transform answers object to array format expected by backend
      const answersArray = Object.entries(answers).map(([question, selectedAnswer]) => ({
        question,
        selectedAnswer
      }));

      const response = await fetch(`http://localhost:5001/api/student/exams/${examId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answers: answersArray }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setShowSubmitModal(false);
        // Redirect to results or dashboard
        setTimeout(() => {
          window.location.href = '/student-dashboard';
        }, 3000);
      } else {
        console.error('Submit failed:', response.status, await response.text());
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionStatus = (index) => {
    const question = questions[index];
    if (answers[question?._id] !== undefined) return 'answered';
    return 'not-answered';
  };

  const loadProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/student/exams/${examId}/progress`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const progress = await response.json();
        if (progress.answers) {
          setAnswers(progress.answers);
        }
        if (progress.currentQuestionIndex !== undefined) {
          setCurrentQuestionIndex(progress.currentQuestionIndex);
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const saveProgress = async (currentAnswers, currentIndex) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5001/api/student/exams/${examId}/save-progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          answers: currentAnswers,
          currentQuestionIndex: currentIndex
        })
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{exam.title}</h1>
            <p className="text-gray-600">{exam.description}</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">Exam Instructions</h2>
            <ul className="text-blue-800 space-y-2">
              <li>• Duration: {exam.duration} minutes</li>
              <li>• Total Questions: {exam.questions?.length || 0}</li>
              <li>• Passing Score: {exam.passingScore}%</li>
              {exam.isRandomized && <li>• Questions will be randomized</li>}
              {exam.isOptionsRandomized && <li>• Answer options will be randomized</li>}
              <li>• Your progress will be automatically saved</li>
              <li>• Do not switch tabs or windows during the exam</li>
            </ul>
          </div>

          <div className="text-center">
            <button
              onClick={startExam}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-200"
            >
              Start Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Exam Submitted!</h2>
          <p className="text-gray-600 mb-4">Your answers have been successfully submitted.</p>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tab switch warning modal */}
      {showTabWarningModal && !isSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-red-200 shadow-2xl p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-1.414 1.414L12 11.999 7.05 7.05 5.636 5.636 12 0l6.364 5.636zM12 12v6m0 4h.01" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Exam Tab Warning</h2>
            <p className="text-gray-700 mb-6">{tabWarningMessage}</p>
            <p className="text-sm text-gray-600 mb-6">
              Please stay on this tab until your exam is finished. Switching away repeatedly will submit your exam automatically.
            </p>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => setShowTabWarningModal(false)}
                className="px-6 py-3 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                I am back on the exam tab
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">TrustExam</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-lg font-semibold">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-red-600">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{exam.title}</h1>
            <p className="mt-2 text-gray-600">Answer all questions carefully. Your progress is automatically saved.</p>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Progress</h2>
              <span className="text-sm text-gray-500">
                {questions.length > 0 
                  ? `Question ${currentQuestionIndex + 1} of ${questions.length}` 
                  : 'No questions loaded'
                }
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question Container */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            {!currentQuestion ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Questions Available</h3>
                <p className="text-gray-600 mb-4 max-w-md mx-auto">
                  This exam has no questions configured or all questions are inactive.
                </p>
                <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                  Questions: {questions.length} | Check browser console (F12) for details
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Question {currentQuestionIndex + 1}
                </h3>
                <p className="text-gray-700 mb-6 text-lg">{currentQuestion.questionText}</p>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <label key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${currentQuestion._id}`}
                        value={index}
                        checked={answers[currentQuestion._id] === index}
                        onChange={() => handleAnswerChange(currentQuestion._id, index)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              <span>Previous</span>
            </button>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowSubmitModal(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Submit Exam</span>
              </button>

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                >
                  <span>Next</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
                >
                  <span>Finish Exam</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Question Navigation */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Navigation</h3>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-4">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionNavigation(index)}
                  className={`w-10 h-10 rounded-md text-sm font-medium transition duration-200 ${
                    index === currentQuestionIndex
                      ? 'bg-blue-600 text-white'
                      : getQuestionStatus(index) === 'answered'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <span>Not Answered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span>Current</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">Submit Exam?</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to submit your exam? This action cannot be undone.
                </p>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Questions answered: {Object.keys(answers).length} / {questions.length}</p>
                  <p>Time remaining: {formatTime(timeLeft)}</p>
                </div>
              </div>
              <div className="flex items-center px-4 py-3 space-x-4">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitExam}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
                >
                  Submit Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exam;
