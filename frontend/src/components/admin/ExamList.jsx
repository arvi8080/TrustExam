import React, { useState } from 'react';
import QuestionForm from './QuestionForm';

const ExamList = ({ exams, loading, error, onEdit, onDelete, questions = [], onQuestionSubmit, onQuestionDelete, questionsLoading, questionsError }) => {
  const [expandedExamId, setExpandedExamId] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [permissionEmails, setPermissionEmails] = useState('');
  const [inviteEmails, setInviteEmails] = useState('');
  const [expandedPermissions, setExpandedPermissions] = useState(null);
  const [expandedInvite, setExpandedInvite] = useState(null);
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Existing Exams</h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Existing Exams</h2>
        <div className="text-red-600 text-center py-4">
          Error loading exams: {error}
        </div>
      </div>
    );
  }

  const handleDelete = (examId, examTitle) => {
    if (window.confirm(`Are you sure you want to delete the exam "${examTitle}"? This action cannot be undone.`)) {
      onDelete(examId);
    }
  };

  const handleStartExam = async (examId, examTitle) => {
    if (window.confirm(`Are you sure you want to start the exam "${examTitle}"? Students will be able to access it immediately.`)) {
      try {
        const response = await fetch(`/api/admin/exams/${examId}/start`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          alert('Exam started successfully!');
          window.location.reload(); // Refresh to show updated status
        } else {
          alert('Failed to start exam');
        }
      } catch (error) {
        console.error('Error starting exam:', error);
        alert('Failed to start exam');
      }
    }
  };

  const handleStopExam = async (examId, examTitle) => {
    if (window.confirm(`Are you sure you want to stop the exam "${examTitle}"? All active submissions will be completed automatically.`)) {
      try {
        const response = await fetch(`/api/admin/exams/${examId}/stop`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          alert('Exam stopped successfully!');
          window.location.reload(); // Refresh to show updated status
        } else {
          alert('Failed to stop exam');
        }
      } catch (error) {
        console.error('Error stopping exam:', error);
        alert('Failed to stop exam');
      }
    }
  };

  const handleQuestionEdit = (question) => {
    setEditingQuestion(question);
    setShowQuestionForm(true);
  };

  const handleQuestionDelete = (questionId, questionText) => {
    if (window.confirm(`Are you sure you want to delete this question: "${questionText.substring(0, 50)}..."?`)) {
      onQuestionDelete(questionId);
    }
  };

  const handleQuestionSubmit = async (questionData) => {
    await onQuestionSubmit(questionData, editingQuestion?._id);
    setEditingQuestion(null);
    setShowQuestionForm(false);
  };

  const handlePermissionSubmit = async (examId) => {
    try {
      const response = await fetch(`/api/admin/exams/${examId}/permissions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ allowedEmails: permissionEmails.split(/[,\n]+/).map(e => e.trim()).filter(e => e) })
      });
      if (response.ok) {
        alert('Permissions updated successfully');
        setPermissionEmails('');
        setExpandedPermissions(null);
      } else {
        alert('Failed to update permissions');
      }
    } catch (error) {
      console.error('Error updating permissions:', error);
    }
  };

  const handleInviteSubmit = async (examId) => {
    try {
      const response = await fetch(`/api/admin/exams/${examId}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ emails: inviteEmails.split(/[,\n]+/).map(e => e.trim()).filter(e => e) })
      });
      if (response.ok) {
        alert('Invitations sent successfully');
        setInviteEmails('');
        setExpandedInvite(null);
      } else {
        alert('Failed to send invitations');
      }
    } catch (error) {
      console.error('Error sending invitations:', error);
    }
  };

  const examQuestions = questions.filter(q => q.examId === expandedExamId);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Existing Exams</h2>
      {exams.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          No exams found. Create your first exam to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {exams.map(exam => (
            <div key={exam._id} className="border border-gray-300 rounded-lg p-6 hover:shadow-lg transition duration-200">
              {/* Exam Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{exam.title}</h3>
                  <p className="text-gray-600 mb-2">{exam.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                    <p><span className="font-medium">Duration:</span> {exam.duration} min</p>
                    <p><span className="font-medium">Start:</span> {new Date(exam.startTime).toLocaleDateString()}</p>
                    <p><span className="font-medium">End:</span> {new Date(exam.endTime).toLocaleDateString()}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-2 font-medium ${
                        exam.isActive 
                          ? 'text-green-600' 
                          : new Date() > new Date(exam.endTime) 
                            ? 'text-red-600' 
                            : new Date() >= new Date(exam.startTime) 
                              ? 'text-blue-600' 
                              : 'text-gray-600'
                      }`}>
                        {exam.isActive 
                          ? 'Active' 
                          : new Date() > new Date(exam.endTime) 
                            ? 'Completed' 
                            : new Date() >= new Date(exam.startTime) 
                              ? 'Scheduled (Not Started)' 
                              : 'Scheduled'
                        }
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-gray-200">
                {exam.isActive ? (
                  <button
                    onClick={() => handleStopExam(exam._id, exam.title)}
                    className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition duration-200 text-sm"
                  >
                    Stop Exam
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartExam(exam._id, exam.title)}
                    className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition duration-200 text-sm"
                  >
                    Start Exam
                  </button>
                )}
                <button
                  onClick={() => onEdit(exam)}
                  className="bg-yellow-600 text-white px-3 py-2 rounded-md hover:bg-yellow-700 transition duration-200 text-sm"
                >
                  Edit Exam
                </button>
                <button
                  onClick={() => setExpandedExamId(expandedExamId === exam._id ? null : exam._id)}
                  className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition duration-200 text-sm"
                >
                  {expandedExamId === exam._id ? 'Hide Details' : 'Manage Permissions'}
                </button>
                <button
                  onClick={() => handleDelete(exam._id, exam.title)}
                  className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition duration-200 text-sm"
                >
                  Delete
                </button>
              </div>

              {/* Expanded Section */}
              {expandedExamId === exam._id && (
                <div className="space-y-6 mt-6 pt-6 border-t border-gray-200">
                  
                  {/* Permissions Section */}
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Permissions &amp; Invites
                    </h4>
                    
                    {/* Edit Permissions */}
                    <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                      <button
                        onClick={() => setExpandedPermissions(expandedPermissions === exam._id ? null : exam._id)}
                        className="mb-3 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium transition duration-200 inline-flex items-center"
                      >
                        {expandedPermissions === exam._id ? '− Hide Permissions' : '+ Edit Allowed Emails'}
                      </button>
                      {expandedPermissions === exam._id && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Allowed Emails (one per line or comma separated)
                          </label>
                          <textarea
                            value={permissionEmails}
                            onChange={(e) => setPermissionEmails(e.target.value)}
                            rows="4"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-vertical"
                            placeholder='user1@example.com&#10;user2@example.com&#10;Enter emails who can access this exam...'
                          />
                          <button
                            onClick={() => handlePermissionSubmit(exam._id)}
                            className="mt-3 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 text-sm font-medium transition duration-200"
                          >
                            Update Permissions
                          </button>
                          <p className="mt-2 text-xs text-gray-500">
                            Updates exam.allowedEmails array in backend
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Send Invites */}
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <button
                        onClick={() => setExpandedInvite(expandedInvite === exam._id ? null : exam._id)}
                        className="mb-3 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 text-sm font-medium transition duration-200 inline-flex items-center"
                      >
                        {expandedInvite === exam._id ? '− Hide Invites' : '+ Send Exam Invites'}
                      </button>
                      {expandedInvite === exam._id && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Invite Emails (one per line or comma separated)
                          </label>
                          <textarea
                            value={inviteEmails}
                            onChange={(e) => setInviteEmails(e.target.value)}
                            rows="4"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-vertical"
                            placeholder='student@example.com&#10;teacher@example.com&#10;Sends email + adds to permissions'
                          />
                          <button
                            onClick={() => handleInviteSubmit(exam._id)}
                            className="mt-3 bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 text-sm font-medium transition duration-200"
                          >
                            Send Invitations
                          </button>
                          <p className="mt-2 text-xs text-gray-500">
                            Sends emails via backend + auto-adds to allowedEmails
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Questions Management Section */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-gray-900">📋 Questions ({examQuestions.length})</h4>

                      <button
                        onClick={() => {
                          setEditingQuestion(null);
                          setShowQuestionForm(!showQuestionForm);
                        }}
                        className="bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700 text-sm transition duration-200"
                      >
                        {showQuestionForm ? 'Cancel' : '+ Add Question'}
                      </button>
                    </div>

                    {showQuestionForm && (
                      <div className="mb-4">
                        <QuestionForm
                          question={editingQuestion}
                          onSubmit={(questionData) => {
                            questionData.examId = exam._id;
                            handleQuestionSubmit(questionData);
                          }}
                          onCancel={() => {
                            setShowQuestionForm(false);
                            setEditingQuestion(null);
                          }}
                        />
                      </div>
                    )}

                    {questionsLoading ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                      </div>
                    ) : questionsError ? (
                      <div className="text-red-600 text-sm py-2">{questionsError}</div>
                    ) : examQuestions.length === 0 ? (
                      <p className="text-gray-500 text-sm">No questions yet. Add your first question.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm bg-white rounded">
                          <thead className="bg-gray-200">
                            <tr>
                              <th className="px-4 py-2 text-left">Question</th>
                              <th className="px-4 py-2 text-left">Difficulty</th>
                              <th className="px-4 py-2 text-left">Marks</th>
                              <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {examQuestions.map(question => (
                              <tr key={question._id} className="border-t border-gray-200">
                                <td className="px-4 py-2 truncate max-w-xs">{question.questionText}</td>
                                <td className="px-4 py-2">
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                    question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {question.difficulty}
                                  </span>
                                </td>
                                <td className="px-4 py-2">{question.marks}</td>
                                <td className="px-4 py-2 flex gap-2">
                                  <button
                                    onClick={() => handleQuestionEdit(question)}
                                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleQuestionDelete(question._id, question.questionText)}
                                    className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExamList;
