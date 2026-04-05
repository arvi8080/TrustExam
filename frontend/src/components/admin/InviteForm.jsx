import React from 'react';

const InviteForm = ({ showInviteForm, inviteFormData, setInviteFormData, exams, onSubmit, onCancel }) => {
  if (!showInviteForm) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Send Invitations</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Exam</label>
          <select
            value={inviteFormData.examId}
            onChange={(e) => setInviteFormData({...inviteFormData, examId: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">Select an exam...</option>
            {exams.map(exam => (
              <option key={exam._id} value={exam._id}>
                {exam.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Addresses (one per line or comma-separated)</label>
          <textarea
            value={inviteFormData.emails}
            onChange={(e) => setInviteFormData({...inviteFormData, emails: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            rows="5"
            placeholder="student1@example.com&#10;student2@example.com"
            required
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-200"
          >
            Send Invitations
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

export default InviteForm;