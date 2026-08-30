import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export const useBadges = () => {
  const [badges, setBadges] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/badges`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setBadges(data);
    } catch (error) {
      console.error('Error fetching badges:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAchievements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/achievements`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setAchievements(data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const createBadge = async (badgeData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/badges`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(badgeData),
      });

      if (response.ok) {
        fetchBadges();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating badge:', error);
      return false;
    }
  };

  const updateBadge = async (badgeId, badgeData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/badges/${badgeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(badgeData)
      });
      if (!response.ok) {
        throw new Error('Failed to update badge');
      }
      return true;
    } catch (error) {
      console.error('Error updating badge:', error);
      return false;
    }
  };

  const deleteBadge = async (badgeId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/badges/${badgeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to delete badge');
      }
      return true;
    } catch (error) {
      console.error('Error deleting badge:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchBadges();
    fetchAchievements();
  }, []);

  return {
    badges,
    achievements,
    loading,
    error,
    refetchBadges: fetchBadges,
    refetchAchievements: fetchAchievements,
    createBadge,
    updateBadge,
    deleteBadge
  };
};