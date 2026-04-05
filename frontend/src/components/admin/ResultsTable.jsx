import React from 'react';

const ResultsTable = ({ results = [], loading, error, view = "results" }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{view === "achievements" ? "Student Achievements" : "Exam Results"}</h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{view === "achievements" ? "Student Achievements" : "Exam Results"}</h2>
        <div className="text-red-600 text-center py-4">
          Error loading results: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{view === "achievements" ? "Student Achievements" : "Exam Results"}</h2>
      {results.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          {view === "achievements" ? "No achievements recorded yet." : "No results found yet."}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                {view === "achievements" && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.map(result => (
                <tr key={result._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{view === "achievements" ? (result.user?.username || result.student?.username || 'N/A') : (result.user?.email || result.student?.email || 'N/A')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.exam?.title || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.score || 0}%</td>
                  {view === "achievements" && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        result.status === 'pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {result.status || 'N/A'}
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {result.completedAt ? new Date(result.completedAt).toLocaleDateString() : new Date(result.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResultsTable;