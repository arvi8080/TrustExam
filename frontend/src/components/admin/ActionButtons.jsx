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
    <div className="mb-6 flex space-x-4">
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
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200"
        >
          {showCreateForm || showEditForm ? 'Cancel' : 'Create New Exam'}
        </button>
      )}

      {activeTab === 'badges' && (
        <button
          onClick={() => setShowBadgeForm(!showBadgeForm)}
          className="bg-yellow-600 text-white px-6 py-3 rounded-md hover:bg-yellow-700 transition duration-200"
        >
          {showBadgeForm ? 'Cancel' : 'Create New Badge'}
        </button>
      )}
    </div>
  );
};

export default ActionButtons;