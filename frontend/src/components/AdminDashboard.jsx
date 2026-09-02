import React, { useState, useEffect } from 'react';
import AdminHeader from './admin/AdminHeader';
import NavigationTabs from './admin/NavigationTabs';
import ActionButtons from './admin/ActionButtons';
import ExamForm from './admin/ExamForm';
import ExamList from './admin/ExamList';
import QuestionManagement from './admin/QuestionManagement';
import BadgeForm from './admin/BadgeForm';
import BadgesList from './admin/BadgesList';
import StudentsTable from './admin/StudentsTable';
import ExamSelector from './admin/ExamSelector';
import ActiveSessionsTable from './admin/ActiveSessionsTable';
import AnalyticsOverview from './admin/AnalyticsOverview';
import PerformanceAnalytics from './admin/PerformanceAnalytics';
import AuditLogsTable from './admin/AuditLogsTable';
import ResultsTable from './admin/ResultsTable';

import { useExams } from '../hooks/useExams';
import { useResults } from '../hooks/useResults';
import { useStudents } from '../hooks/useStudents';
import { useBadges } from '../hooks/useBadges';
import { useActiveSessions } from '../hooks/useActiveSessions';
import { useQuestions } from '../hooks/useQuestions';
import { useAuditLogs } from '../hooks/useAuditLogs';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('exams');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedExamForQuestions, setSelectedExamForQuestions] = useState(null);
  const [permissions, setPermissions] = useState({});

  const {
    exams,
    loading: examsLoading,
    error: examsError,
    createExam,
    updateExam,
    deleteExam,
    refetch: fetchExams
  } = useExams();

  const {
    students,
    loading: studentsLoading,
    error: studentsError,
    updateStudent,
    deleteStudent,
    refetch: fetchStudents
  } = useStudents();

  const {
    badges,
    loading: badgesLoading,
    error: badgesError,
    createBadge,
    updateBadge,
    deleteBadge,
    refetchBadges: fetchBadges
  } = useBadges();

  const {
    activeSessions,
    loading: activeSessionsLoading,
    error: activeSessionsError,
    refetch: fetchActiveSessions
  } = useActiveSessions(selectedExam);

  const {
    results,
    loading: resultsLoading,
    error: resultsError
  } = useResults();

  const {
    questions,
    loading: questionsLoading,
    error: questionsError,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    fetchQuestions
  } = useQuestions();

  const {
    auditLogs,
    loading: auditLogsLoading,
    error: auditLogsError,
    refetch: fetchAuditLogs
  } = useAuditLogs();

  useEffect(() => {
    fetchExams();
    fetchStudents();
    fetchBadges();
    fetchActiveSessions();
    fetchAuditLogs();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowForm(false);
    setEditingItem(null);
    setSelectedExamForQuestions(null);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleExamSubmit = async (examData) => {
    try {
      if (editingItem) {
        await updateExam(editingItem._id, examData);
      } else {
        await createExam(examData);
      }
      setShowForm(false);
      setEditingItem(null);
      fetchExams();
    } catch (error) {
      console.error('Error saving exam:', error);
    }
  };

  const handleBadgeSubmit = async (badgeData) => {
    try {
      if (editingItem) {
        await updateBadge(editingItem._id, badgeData);
      } else {
        await createBadge(badgeData);
      }
      setShowForm(false);
      setEditingItem(null);
      fetchBadges();
    } catch (error) {
      console.error('Error saving badge:', error);
    }
  };

  const handleQuestionSubmit = async (questionData) => {
    try {
      if (editingItem) {
        await updateQuestion(editingItem._id, questionData);
      } else {
        await createQuestion(questionData);
      }
      setShowForm(false);
      setEditingItem(null);
      fetchQuestions();
    } catch (error) {
      console.error('Error saving question:', error);
    }
  };

  const handleStudentUpdate = async (studentId, updates) => {
    try {
      await updateStudent(studentId, updates);
      fetchStudents();
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const handleStudentDelete = async (studentId) => {
    try {
      await deleteStudent(studentId);
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleExamDelete = async (examId) => {
    try {
      await deleteExam(examId);
      fetchExams();
    } catch (error) {
      console.error('Error deleting exam:', error);
    }
  };

  const handleBadgeDelete = async (badgeId) => {
    try {
      await deleteBadge(badgeId);
      fetchBadges();
    } catch (error) {
      console.error('Error deleting badge:', error);
    }
  };

  const handleQuestionDelete = async (questionId) => {
    try {
      await deleteQuestion(questionId);
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'exams':
        return (
          <div className="space-y-6">
            <ActionButtons 
              activeTab={activeTab}
              showCreateForm={showForm}
              setShowCreateForm={setShowForm}
              showEditForm={!!editingItem}
              setShowEditForm={setShowForm}
              setEditingExamId={setEditingItem}
            />
            {showForm && (
              <ExamForm
                exam={editingItem}
                onSubmit={handleExamSubmit}
                onCancel={handleCancel}
              />
            )}
            <ExamList
              exams={exams}
              loading={examsLoading}
              error={examsError}
              onEdit={handleEdit}
              onDelete={handleExamDelete}
              questions={questions}
              onQuestionSubmit={handleQuestionSubmit}
              onQuestionDelete={handleQuestionDelete}
              questionsLoading={questionsLoading}
              questionsError={questionsError}
            />
          </div>
        );

      case 'questions':
        return (
          <div className="space-y-6">
            {!selectedExamForQuestions ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-2">Question Management Pool</h2>
                <p className="text-slate-500 text-xs mb-6">
                  Select an exam below to view, create manually, upload CSV/Excel files, or generate questions via AI.
                </p>
                <div className="max-w-md">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Select Target Exam</label>
                  <select
                    value={selectedExamForQuestions || ''}
                    onChange={(e) => setSelectedExamForQuestions(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Choose an exam to manage questions...</option>
                    {exams.map(exam => (
                      <option key={exam._id} value={exam._id}>
                        {exam.title} ({exam.questions?.length || 0} questions)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Selected Exam</span>
                      <h2 className="text-xl font-bold text-slate-900">
                        {exams.find(exam => exam._id === selectedExamForQuestions)?.title}
                      </h2>
                    </div>
                    <button
                      onClick={() => setSelectedExamForQuestions(null)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                    >
                      ← Change Exam Selection
                    </button>
                  </div>
                </div>
                <QuestionManagement examId={selectedExamForQuestions} />
              </div>
            )}
          </div>
        );

      case 'badges':
        return (
          <div className="space-y-6">
            <ActionButtons 
              activeTab={activeTab}
              showBadgeForm={showForm}
              setShowBadgeForm={setShowForm}
            />
            {showForm && (
              <BadgeForm
                badge={editingItem}
                onSubmit={handleBadgeSubmit}
                onCancel={handleCancel}
              />
            )}
            <BadgesList
              badges={badges}
              loading={badgesLoading}
              error={badgesError}
              onEdit={handleEdit}
              onDelete={handleBadgeDelete}
            />
          </div>
        );

      case 'students':
        return (
          <StudentsTable
            students={students}
            loading={studentsLoading}
            error={studentsError}
            onUpdate={handleStudentUpdate}
            onDelete={handleStudentDelete}
          />
        );

      case 'monitoring':
        return (
          <div className="space-y-6">
            <ExamSelector
              exams={exams}
              selectedExam={selectedExam}
              onExamSelect={setSelectedExam}
            />
            <ActiveSessionsTable
              activeSessions={activeSessions}
              loading={activeSessionsLoading}
              error={activeSessionsError}
            />
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <AnalyticsOverview
              exams={exams}
              students={students}
              loading={examsLoading || studentsLoading}
              error={examsError || studentsError}
            />
            <PerformanceAnalytics
              exams={exams}
              results={results}
              loading={examsLoading || resultsLoading}
              error={examsError || resultsError}
            />
          </div>
        );

      case 'audit':
        return (
          <AuditLogsTable
            auditLogs={auditLogs}
            loading={auditLogsLoading}
            error={auditLogsError}
          />
        );

      case 'results':
      case 'achievements':
        return (
          <ResultsTable
            results={results}
            loading={resultsLoading}
            error={resultsError}
            view={activeTab === 'achievements' ? "achievements" : "results"}
          />
        );

      default:
        return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <AdminHeader onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex-1 w-full">
        <NavigationTabs activeTab={activeTab} onTabChange={handleTabChange} />
        <div className="mt-8">
          {renderTabContent()}
        </div>
      </main>

      {/* Admin Workspace Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            
            {/* Brand Column */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                  T
                </div>
                <span className="text-lg font-black text-white tracking-tight">TrustExam</span>
                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase rounded border border-indigo-500/30">
                  Admin Control Console
                </span>
              </div>
              <p className="text-slate-400 text-xs max-w-md leading-relaxed">
                Centralized examination management workspace for creating proctored assessments, managing question pools, monitoring live candidate sessions, and reviewing cheating audit trails.
              </p>
              <div className="flex items-center space-x-2 text-[11px] text-emerald-400 font-semibold pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Isolated Admin Scope Active ({exams.length} Exams Managed)</span>
              </div>
            </div>

            {/* Navigation Column */}
            <div className="space-y-2">
              <p className="text-slate-200 font-bold uppercase tracking-wider text-[11px]">Management Tabs</p>
              <ul className="space-y-1.5 text-slate-400 font-medium">
                <li><button onClick={() => handleTabChange('exams')} className="hover:text-white transition-colors">Exams Management</button></li>
                <li><button onClick={() => handleTabChange('questions')} className="hover:text-white transition-colors">Question Pools & AI</button></li>
                <li><button onClick={() => handleTabChange('students')} className="hover:text-white transition-colors">Student Directory</button></li>
                <li><button onClick={() => handleTabChange('monitoring')} className="hover:text-white transition-colors">Live Proctor Session Monitoring</button></li>
                <li><button onClick={() => handleTabChange('analytics')} className="hover:text-white transition-colors">Performance Analytics</button></li>
                <li><button onClick={() => handleTabChange('audit')} className="hover:text-white transition-colors">Security Audit Logs</button></li>
              </ul>
            </div>

            {/* Security Oversight */}
            <div className="space-y-2">
              <p className="text-slate-200 font-bold uppercase tracking-wider text-[11px]">Security & Multi-Tenancy</p>
              <ul className="space-y-1.5 text-slate-400 font-medium">
                <li className="flex items-center space-x-1.5"><span>🔒</span><span>Isolated Admin Data Scope</span></li>
                <li className="flex items-center space-x-1.5"><span>🛡️</span><span>Real-Time Tab Switch Alerts</span></li>
                <li className="flex items-center space-x-1.5"><span>📊</span><span>Automated Class Rank Calculations</span></li>
                <li className="flex items-center space-x-1.5"><span>🤖</span><span>AI Question Generator Engine</span></li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
            <p>© 2026 TrustExam Platform. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <span>Admin Engine: <strong className="text-emerald-400">Operational 100%</strong></span>
              <span>•</span>
              <span>Multi-Tenant Secured</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default AdminDashboard;
