import React from 'react';

const NavigationTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'exams', label: '📝 Exams' },
    { id: 'questions', label: '❓ Questions' },
    { id: 'students', label: '👥 Students' },
    { id: 'monitoring', label: '👀 Live Monitoring' },
    { id: 'analytics', label: '📊 Analytics' },
    { id: 'badges', label: '🏆 Badges' },

    { id: 'audit', label: '📋 Audit Logs' },

    { id: 'results', label: '📈 Results' }
  ];

  return (
    <div className="mb-6">
      <nav className="flex flex-wrap gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 rounded-md font-medium ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default NavigationTabs;