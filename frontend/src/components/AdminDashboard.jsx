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


import ResultsTable from './admin/ResultsTable';
import { useExams } from '../hooks/useExams';
import { useResults } from '../hooks/useResults';
import { useStudents } from '../hooks/useStudents';
import { useBadges } from '../hooks/useBadges';
import { useActiveSessions } from '../hooks/useActiveSessions';
import { useQuestions } from '../hooks/useQuestions';

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

  useEffect(() => {
    fetchExams();
    fetchStudents();
    fetchBadges();
    fetchActiveSessions();
    // Don't fetch questions initially - only when an exam is selected
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
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Question Management</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Exam</label>
                  <select
                    value={selectedExamForQuestions || ''}
                    onChange={(e) => setSelectedExamForQuestions(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select an exam to manage questions...</option>
                    {exams.map(exam => (
                      <option key={exam._id} value={exam._id}>
                        {exam.title}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-gray-600 text-sm">
                  Select an exam above to view, add, or generate questions for that specific exam.
                </p>
              </div>
            ) : (
              <div>
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Questions for: {exams.find(exam => exam._id === selectedExamForQuestions)?.title}
                    </h2>
                    <button
                      onClick={() => setSelectedExamForQuestions(null)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Change Exam
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
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Audit Logs</h2>
            <div className="text-gray-500 text-center py-8">
              Audit logs feature temporarily disabled (backend 500 error).
            </div>
          </div>
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
    <div className="min-h-screen bg-gray-100">
      <AdminHeader onLogout={handleLogout} />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <NavigationTabs activeTab={activeTab} onTabChange={handleTabChange} />
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
