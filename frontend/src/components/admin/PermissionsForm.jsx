import React from 'react';

const PermissionsForm = ({
  showPermissionsForm,
  permissionsFormData,
  setPermissionsFormData,
  onSubmit,
  onCancel
}) => {
  if (!showPermissionsForm) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Manage Exam Permissions</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Allowed Emails (one per line or comma-separated)</label>
          <textarea
            value={permissionsFormData.emails}
            onChange={(e) => setPermissionsFormData({...permissionsFormData, emails: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="5"
            placeholder="student1@example.com&#10;student2@example.com"
            required
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Update Permissions
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

export default PermissionsForm;