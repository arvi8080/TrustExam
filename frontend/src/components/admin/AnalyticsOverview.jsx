import React from 'react';

const AnalyticsOverview = ({ exams = [], students = [], loading, error }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Exam Analytics</h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Exam Analytics</h2>
        <div className="text-red-600 text-center py-4">
          Error loading analytics: {error}
        </div>
      </div>
    );
  }

  const activeExams = exams.filter(exam => {
    const now = new Date();
    const startTime = new Date(exam.startTime);
    const endTime = new Date(exam.endTime);
    return now >= startTime && now <= endTime;
  }).length;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Exam Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900">Total Exams</h3>
          <p className="text-2xl font-bold text-blue-600">{exams.length || 0}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900">Active Exams</h3>
          <p className="text-2xl font-bold text-green-600">{activeExams}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-900">Total Students</h3>
          <p className="text-2xl font-bold text-purple-600">{students.length || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;