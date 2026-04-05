import { useState, useEffect } from 'react';

export const useExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExams = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/admin/exams', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        console.error('Fetch exams failed:', response.status, await response.text());
        setExams([]);
        return;
      }
      const data = await response.json();
      setExams(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching exams:', error);
      setError(error.message);
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  const createExam = async (examData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/admin/exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(examData)
      });
      if (!response.ok) {
        throw new Error('Failed to create exam');
      }
      return true;
    } catch (error) {
      console.error('Error creating exam:', error);
      return false;
    }
  };

  const updateExam = async (examId, examData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/admin/exams/${examId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(examData)
      });
      if (!response.ok) {
        throw new Error('Failed to update exam');
      }
      return true;
    } catch (error) {
      console.error('Error updating exam:', error);
      return false;
    }
  };

  const deleteExam = async (examId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/admin/exams/${examId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to delete exam');
      }
      return true;
    } catch (error) {
      console.error('Error deleting exam:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  return { exams, loading, error, refetch: fetchExams, createExam, updateExam, deleteExam };
};