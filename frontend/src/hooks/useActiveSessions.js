import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export const useActiveSessions = (selectedExam) => {
  const [activeSessions, setActiveSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchActiveSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!selectedExam) {
        setActiveSessions([]);
        return;
      }
      const response = await fetch(`${API_BASE_URL}/api/admin/exams/${selectedExam}/active-sessions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      setActiveSessions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching active sessions:', error);
      setError(error.message);
      setActiveSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveSessions();
  }, [selectedExam]);

  return { activeSessions, loading, error, refetch: fetchActiveSessions };
};