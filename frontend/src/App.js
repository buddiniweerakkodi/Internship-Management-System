import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import InternDashboard from './pages/InternDashboard';
import InternManagement from './pages/InternManagement';
import ProjectManagement from './pages/ProjectManagement';
import TaskManagement from './pages/TaskManagement';
import SubmissionsAndLogs from './pages/SubmissionsAndLogs';
import ProtectedRoute from './components/ProtectedRoute'; 
import MyTasks from './pages/MyTasks';
import DailyWorkLogs from './pages/DailyWorkLogs';
import MySubmissions from './pages/MySubmissions';
import ProjectDetails from './pages/ProjectDetails'; 

function App() {
  return (
    <Router>
      {/* Toast Notifications Provider globally available */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Admin Routes */}
        <Route 
          path="/admin-dashboard" 
          element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/admin-interns" 
          element={<ProtectedRoute allowedRole="admin"><InternManagement /></ProtectedRoute>} 
        />
        <Route 
          path="/admin-projects" 
          element={<ProtectedRoute allowedRole="admin"><ProjectManagement /></ProtectedRoute>} 
        />
        <Route 
          path="/admin-tasks" 
          element={<ProtectedRoute allowedRole="admin"><TaskManagement /></ProtectedRoute>} 
        />
        <Route 
          path="/admin-logs" 
          element={<ProtectedRoute allowedRole="admin"><SubmissionsAndLogs /></ProtectedRoute>}
        />

        {/* Protected Intern Routes */}
        <Route 
          path="/intern-dashboard" 
          element={<ProtectedRoute allowedRole="intern"><InternDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/intern-tasks" 
          element={<ProtectedRoute allowedRole="intern"><MyTasks /></ProtectedRoute>} 
        />
        <Route 
          path="/intern-daily-logs" 
          element={<ProtectedRoute allowedRole="intern"><DailyWorkLogs /></ProtectedRoute>} 
        />
        <Route 
          path="/intern-submissions" 
          element={<ProtectedRoute allowedRole="intern"><MySubmissions /></ProtectedRoute>} 
        />
        
        <Route 
          path="/intern-project" 
          element={<ProtectedRoute allowedRole="intern"><ProjectDetails /></ProtectedRoute>} 
        />

        {/* Default Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;