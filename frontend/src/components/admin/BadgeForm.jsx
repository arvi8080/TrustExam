import React, { useState, useEffect } from 'react';

const BadgeForm = ({ badge, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    description: '',
    category: 'achievement',
    criteria: {
      type: 'score_threshold',
      value: 0,
      operator: 'gte'
    },
    points: 0
  });

  useEffect(() => {
    if (badge) {
      setFormData({
        name: badge.name || '',
        icon: badge.icon || '',
        description: badge.description || '',
        category: badge.category || 'achievement',
        criteria: badge.criteria || { type: 'score_threshold', value: 0, operator: 'gte' },
        points: badge.points || 0
      });
    }
  }, [badge]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {badge ? 'Edit Badge' : 'Create New Badge'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Badge Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Icon (Emoji)</label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({...formData, icon: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="🏆"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            rows="3"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="achievement">Achievement</option>
              <option value="performance">Performance</option>
              <option value="trust">Trust</option>
              <option value="participation">Participation</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Criteria Type</label>
            <select
              value={formData.criteria.type}
              onChange={(e) => setFormData({
                ...formData,
                criteria: {...formData.criteria, type: e.target.value}
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="score_threshold">Score Threshold</option>
              <option value="trust_score">Trust Score</option>
              <option value="exam_count">Exam Count</option>
              <option value="perfect_exam">Perfect Exam</option>
              <option value="no_cheating">No Cheating</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
            <input
              type="number"
              value={formData.criteria.value}
              onChange={(e) => setFormData({
                ...formData,
                criteria: {...formData.criteria, value: parseInt(e.target.value)}
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              min="0"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Operator</label>
            <select
              value={formData.criteria.operator}
              onChange={(e) => setFormData({
                ...formData,
                criteria: {...formData.criteria, operator: e.target.value}
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="gte">Greater than or equal (≥)</option>
              <option value="lte">Less than or equal (≤)</option>
              <option value="eq">Equal (=)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
            <input
              type="number"
              value={formData.points}
              onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              min="0"
              required
            />
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700 transition duration-200"
          >
            {badge ? 'Update Badge' : 'Create Badge'}
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

export default BadgeForm;