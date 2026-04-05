import React from 'react';

const QuestionsTable = ({ questions, loading, error, onEdit, onDelete, onToggleActive }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-4">
        Error loading questions: {error}
      </div>
    );
  }

  const handleDelete = (questionId, questionText) => {
    if (window.confirm(`Are you sure you want to delete the question: "${questionText.substring(0, 50)}..."?`)) {
      onDelete(questionId);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Options</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correct Answer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {questions.map(question => (
            <tr key={question._id}>
              <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
              <div className="truncate" title={question.questionText}>
                  {question.questionText}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 truncate" title={question.topic || 'N/A'}>
                {question.topic || 'N/A'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <ol className="list-decimal list-inside space-y-1">
                  {question.options.map((option, index) => (
                    <li key={index} className="truncate max-w-xs" title={option}>
                      {option}
                    </li>
                  ))}
                </ol>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                Option {question.correctAnswer + 1}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {question.difficulty}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {question.marks}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <button
                  onClick={() => onToggleActive(question._id, !question.isActive)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    question.isActive ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                  title={question.isActive ? 'Click to deactivate' : 'Click to activate'}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      question.isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(question)}
                    className="bg-yellow-600 text-white px-3 py-1 rounded text-xs hover:bg-yellow-700"
                    title="Edit question"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(question._id, question.questionText)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                    title="Delete question"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {questions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No questions found. Click "Add New Question" to get started.
        </div>
      )}
    </div>
  );
};

export default QuestionsTable;