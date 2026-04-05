import React from 'react';

const PerformanceAnalytics = ({ exams = [], results = [], loading, error }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Overview</h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Overview</h2>
        <div className="text-red-600 text-center py-4">
          Error loading performance data: {error}
        </div>
      </div>
    );
  }

  if (!Array.isArray(exams) || exams.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Overview</h2>
        <div className="text-gray-500 text-center py-8">
          No exams available to display performance data.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Overview</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Students</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pass Rate</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {exams.map(exam => {
              const examResults = results.filter(result => result.exam && result.exam._id === exam._id);
              const totalStudents = examResults.length;
              const averageScore = totalStudents > 0 ? examResults.reduce((sum, r) => sum + (r.score || 0), 0) / totalStudents : 0;
              const passRate = totalStudents > 0 ? (examResults.filter(r => r.status === 'pass').length / totalStudents * 100) : 0;

              return (
                <tr key={exam._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{exam.title || 'Unnamed Exam'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{totalStudents}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{averageScore.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{passRate.toFixed(1)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;