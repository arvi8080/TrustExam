import React from 'react';

const BadgesList = ({ badges = [], loading, error }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Existing Badges</h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Existing Badges</h2>
        <div className="text-red-600 text-center py-4">
          Error loading badges: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Existing Badges</h2>
      {badges.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          No badges available yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map(badge => (
            <div key={badge._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition duration-200">
              <div className="flex items-center mb-4">
                <div className="text-4xl mr-4">{badge.icon || '🏆'}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{badge.name || 'Unnamed Badge'}</h3>
                  <p className="text-sm text-gray-500 capitalize">{badge.category || 'N/A'}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">{badge.description || 'No description'}</p>
              <div className="text-sm text-gray-500">
                <p>Criteria: {(badge.criteria?.type || 'N/A').replace('_', ' ')} {badge.criteria?.operator === 'gte' ? '≥' : badge.criteria?.operator === 'lte' ? '≤' : '='} {badge.criteria?.value || 0}</p>
                <p>Points: {badge.points || 0}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BadgesList;