import { useState } from 'react';

export const useQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuestions = async (examId) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/admin/exams/${examId}/questions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createQuestion = async (examId, questionData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/admin/exams/${examId}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(questionData),
      });

      if (response.ok) {
        // Refetch questions for this exam
        if (examId) fetchQuestions(examId);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating question:', error);
      return false;
    }
  };

  const deleteQuestion = async (questionId, examId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/admin/questions/${questionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchQuestions(examId);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting question:', error);
      return false;
    }
  };

  const bulkUpload = async (examId, file) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`http://localhost:5001/api/admin/exams/${examId}/questions/bulk-upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        fetchQuestions(examId);
        return result;
      }
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const generateQuestions = async (examId, topic, numQuestions = 10) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/admin/ai/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ topic, numQuestions, examId }),
      });

      if (response.ok) {
        const result = await response.json();
        fetchQuestions(examId);
        return result;
      }
      const error = await response.json();
      throw new Error(error.error || 'Generation failed');
    } catch (error) {
      console.error('AI generation error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = async (questionId, questionData, examId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/admin/questions/${questionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(questionData)
      });

      if (response.ok) {
        if (examId) fetchQuestions(examId);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating question:', error);
      return false;
    }
  };

  return {
    questions,
    loading,
    error,
    fetchQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    bulkUpload,
    generateQuestions
  };
};