import React from 'react';

const ExamSelector = ({ selectedExam, onExamSelect, exams }) => {
  // Organize exams by status
  const activeExams = exams.filter(exam => exam.isActive || exam.status === 'active');
  const scheduledExams = exams.filter(exam => exam.status === 'scheduled');
  const completedExams = exams.filter(exam => exam.status === 'completed');
  const draftExams = exams.filter(exam => exam.status === 'draft');

  const getStatusBadge = (exam) => {
    if (exam.isActive || exam.status === 'active') return '🔴 Active';
    if (exam.status === 'scheduled') return '🟡 Scheduled';
    if (exam.status === 'completed') return '🟢 Completed';
    return '⚪ Draft';
  };

  const getStatusColor = (exam) => {
    if (exam.isActive || exam.status === 'active') return 'text-red-600';
    if (exam.status === 'scheduled') return 'text-yellow-600';
    if (exam.status === 'completed') return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Live Exam Monitoring</h2>
      
      {exams.length === 0 ? (
        <div className="p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-blue-800">No exams available. Create an exam first to monitor.</p>
        </div>
      ) : (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Exam to Monitor
          </label>
          <select
            value={selectedExam || ''}
            onChange={(e) => onExamSelect(e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          >
            <option value="">-- Select an exam --</option>
            
            {/* Active Exams */}
            {activeExams.length > 0 && (
              <>
                <optgroup label="🔴 ACTIVE (Now)">
                  {activeExams.map(exam => (
                    <option key={exam._id} value={exam._id}>
                      {exam.title} - {new Date(exam.startTime).toLocaleString()}
                    </option>
                  ))}
                </optgroup>
              </>
            )}

            {/* Scheduled Exams */}
            {scheduledExams.length > 0 && (
              <>
                <optgroup label="🟡 SCHEDULED (Upcoming)">
                  {scheduledExams.map(exam => (
                    <option key={exam._id} value={exam._id}>
                      {exam.title} - {new Date(exam.startTime).toLocaleString()}
                    </option>
                  ))}
                </optgroup>
              </>
            )}

            {/* Completed Exams */}
            {completedExams.length > 0 && (
              <>
                <optgroup label="🟢 COMPLETED (Review)">
                  {completedExams.map(exam => (
                    <option key={exam._id} value={exam._id}>
                      {exam.title} - {new Date(exam.startTime).toLocaleString()}
                    </option>
                  ))}
                </optgroup>
              </>
            )}

            {/* Draft Exams */}
            {draftExams.length > 0 && (
              <>
                <optgroup label="⚪ DRAFT (Not Published)">
                  {draftExams.map(exam => (
                    <option key={exam._id} value={exam._id}>
                      {exam.title} - {new Date(exam.startTime).toLocaleString()}
                    </option>
                  ))}
                </optgroup>
              </>
            )}
          </select>

          {/* Show selected exam details */}
          {selectedExam && exams.find(e => e._id === selectedExam) && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              {(() => {
                const exam = exams.find(e => e._id === selectedExam);
                return (
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg text-gray-900">{exam.title}</h3>
                      <span className={`text-sm font-medium ${getStatusColor(exam)}`}>
                        {getStatusBadge(exam)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{exam.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                      <div>
                        <span className="font-medium">Start:</span> {new Date(exam.startTime).toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">End:</span> {new Date(exam.endTime).toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span> {exam.duration} mins
                      </div>
                      <div>
                        <span className="font-medium">Questions:</span> {exam.questions?.length || 0}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExamSelector;