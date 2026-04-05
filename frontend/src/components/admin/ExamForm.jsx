import React, { useState, useEffect } from 'react';

const ExamForm = ({ exam, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    passingScore: 50,
    startTime: '',
    endTime: ''
  });

  // Function to format datetime for input
  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
  };

  // Function to calculate end time based on start time and duration
  const calculateEndTime = (startTime, duration) => {
    if (!startTime || !duration) return '';
    
    // Parse datetime-local string (YYYY-MM-DDTHH:MM) as local time
    const [datePart, timePart] = startTime.split('T');
    const [year, month, day] = datePart.split('-');
    const [hours, minutes] = timePart.split(':');
    
    const start = new Date(year, month - 1, day, hours, minutes, 0);
    const durationMinutes = parseInt(duration) || 0;
    const end = new Date(start.getTime() + durationMinutes * 60000);
    
    // Format back to datetime-local
    const pad = (n) => String(n).padStart(2, '0');
    return `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}T${pad(end.getHours())}:${pad(end.getMinutes())}`;
  };

  useEffect(() => {
    if (exam) {
      setFormData({
        title: exam.title || '',
        description: exam.description || '',
        duration: exam.duration || '',
        passingScore: exam.passingScore !== undefined ? exam.passingScore : 50,
        startTime: formatDateTime(exam.startTime),
        endTime: formatDateTime(exam.endTime)
      });
    } else {
      // Reset form for new exam
      setFormData({
        title: '',
        description: '',
        duration: '',
        startTime: '',
        endTime: ''
      });
    }
  }, [exam]);

  // Auto-calculate end time when start time or duration changes
  useEffect(() => {
    const calculatedEndTime = calculateEndTime(formData.startTime, formData.duration);
    if (calculatedEndTime && formData.startTime && formData.duration) {
      setFormData(prev => ({ ...prev, endTime: calculatedEndTime }));
    }
  }, [formData.startTime, formData.duration]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {exam ? 'Edit Exam' : 'Create New Exam'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Exam Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Enter exam title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="1"
              placeholder="Enter duration in minutes"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Passing Score (%)</label>
            <input
              type="number"
              value={formData.passingScore}
              onChange={(e) => setFormData({...formData, passingScore: Number(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="0"
              max="100"
              placeholder="Enter passing score percentage"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            required
            placeholder="Enter exam description"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
            <input
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData({...formData, startTime: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Time <span className="text-xs text-gray-500">(Auto-calculated, can edit)</span></label>
            <input
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData({...formData, endTime: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-200"
          >
            {exam ? 'Update Exam' : 'Create Exam'}
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

export default ExamForm;