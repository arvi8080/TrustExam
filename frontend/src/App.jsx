import React, { useState, useEffect, Suspense, lazy } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';

const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const StudentDashboard = lazy(() => import('./components/StudentDashboard'));
const Exam = lazy(() => import('./components/Exam'));

function App() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isAdmin: false,
    isLoading: true
  });

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          const user = JSON.parse(userStr);
          setAuthState({
            isAuthenticated: true,
            isAdmin: user.role === 'admin',
            isLoading: false
          });
        } else {
          const role = localStorage.getItem('role');
          if (token && role) {
            setAuthState({
              isAuthenticated: true,
              isAdmin: role === 'admin',
              isLoading: false
            });
          } else {
            setAuthState({
              isAuthenticated: false,
              isAdmin: false,
              isLoading: false
            });
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setAuthState({
          isAuthenticated: false,
          isAdmin: false,
          isLoading: false
        });
      }
    };

    checkAuth();
  }, []);

  if (authState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const { isAuthenticated, isAdmin } = authState;

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
<Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <ErrorBoundary>
          <div className="App">
            <Routes>
              <Route
                path="/login"
                element={isAuthenticated ? <Navigate to={isAdmin ? '/admin-dashboard' : '/student-dashboard'} replace /> : <Login />}
              />
              <Route
                path="/admin-dashboard"
                element={
                  isAuthenticated && isAdmin ? (
                    <ErrorBoundary>
                      <AdminDashboard />
                    </ErrorBoundary>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/student-dashboard"
                element={
                  isAuthenticated && !isAdmin ? (
                    <ErrorBoundary>
                      <StudentDashboard />
                    </ErrorBoundary>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/exam/:examId"
                element={
                  isAuthenticated && !isAdmin ? (
                    <ErrorBoundary>
                      <Exam />
                    </ErrorBoundary>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="*"
                element={<Login />}
              />
            </Routes>
          </div>
        </ErrorBoundary>
      </Suspense>
    </Router>
  );
}

export default App;
