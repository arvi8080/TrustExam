import React, { useState, useEffect } from 'react';

const QuestionForm = ({ question, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    difficulty: 'medium',
    marks: 1,
    tags: []
  });

  useEffect(() => {
    if (question) {
      setFormData({
        questionText: question.questionText || '',
        options: question.options || ['', '', '', ''],
        correctAnswer: question.correctAnswer || 0,
        difficulty: question.difficulty || 'medium',
        marks: question.marks || 1,
        tags: question.tags || []
      });
    } else {
      setFormData({
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        difficulty: 'medium',
        marks: 1,
        tags: []
      });
    }
  }, [question]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {question ? 'Edit Question' : 'Create New Question'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
          <textarea
            value={formData.questionText}
            onChange={(e) => setFormData({...formData, questionText: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows="3"
            required
            placeholder="Enter your question here"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
          {formData.options.map((option, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="radio"
                name="correctAnswer"
                checked={formData.correctAnswer === index}
                onChange={() => setFormData({...formData, correctAnswer: index})}
                className="mr-2"
              />
              <input
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...formData.options];
                  newOptions[index] = e.target.value;
                  setFormData({...formData, options: newOptions});
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={`Option ${index + 1}`}
                required
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Marks</label>
            <input
              type="number"
              value={formData.marks}
              onChange={(e) => setFormData({...formData, marks: parseInt(e.target.value) || 1})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              min="1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags.join(', ')}
              onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(tag => tag.trim())})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="math, algebra, geometry"
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition duration-200"
          >
            {question ? 'Update Question' : 'Create Question'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;