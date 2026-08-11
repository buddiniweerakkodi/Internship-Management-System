import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import InternDashboard from './pages/InternDashboard';
import InternManagement from './pages/InternManagement';
import ProjectManagement from './pages/ProjectManagement';
import TaskManagement from './pages/TaskManagement';
import ProtectedRoute from './components/ProtectedRoute'; 
import SubmissionsAndLogs from './pages/SubmissionsAndLogs';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin-interns" 
          element={
            <ProtectedRoute>
              <InternManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin-projects" 
          element={
            <ProtectedRoute>
              <ProjectManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin-tasks" 
          element={
            <ProtectedRoute>
              <TaskManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/intern-dashboard" 
          element={
            <ProtectedRoute>
              <InternDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin-logs" 
          element={
            <ProtectedRoute>
              <SubmissionsAndLogs />
            </ProtectedRoute> 
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;