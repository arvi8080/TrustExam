import React from 'react';

const ActionButtons = ({
  activeTab,
  onCreate,
  showCreateForm,
  setShowCreateForm,
  showEditForm,
  setShowEditForm,
  setEditingExamId,
  showInviteForm,
  setShowInviteForm,
  showBadgeForm,
  setShowBadgeForm
}) => {
  return (
    <div className="flex items-center space-x-3 mb-6">
      {activeTab === 'exams' && (
        <button
          onClick={() => {
            if (onCreate) {
              onCreate();
            } else {
              setShowCreateForm(!showCreateForm);
              if (showCreateForm) {
                setShowEditForm(false);
                setEditingExamId(null);
              }
            }
          }}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 flex items-center space-x-2 shadow-md ${
            showCreateForm || showEditForm
              ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
          }`}
        >
          <span>{showCreateForm || showEditForm ? '✕ Cancel' : '➕ Create New Exam'}</span>
        </button>
      )}

      {activeTab === 'badges' && (
        <button
          onClick={() => setShowBadgeForm(!showBadgeForm)}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 flex items-center space-x-2 shadow-md ${
            showBadgeForm
              ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
              : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
          }`}
        >
          <span>{showBadgeForm ? '✕ Cancel' : '🏆 Create New Badge'}</span>
        </button>
      )}
    </div>
  );
};

export default ActionButtons;