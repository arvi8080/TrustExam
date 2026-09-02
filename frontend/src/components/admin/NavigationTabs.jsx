import React from 'react';

const NavigationTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'exams', label: 'Exams', icon: '📝' },
    { id: 'questions', label: 'Questions & AI', icon: '❓' },
    { id: 'students', label: 'Students', icon: '👥' },
    { id: 'monitoring', label: 'Live Monitoring', icon: '👀' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'results', label: 'Results', icon: '📈' },
    { id: 'badges', label: 'Badges', icon: '🏆' },
    { id: 'audit', label: 'Audit Logs', icon: '📋' },
  ];

  return (
    <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-xs mb-8">
      <nav className="flex flex-wrap gap-1.5">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center space-x-2 ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <span className="text-sm">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default NavigationTabs;