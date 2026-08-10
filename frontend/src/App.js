import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import InternDashboard from './pages/InternDashboard';
import InternManagement from './pages/InternManagement';
import ProjectManagement from './pages/ProjectManagement';
import TaskManagement from './pages/TaskManagement'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-interns" element={<InternManagement />} />
        <Route path="/admin-projects" element={<ProjectManagement />} />
        <Route path="/admin-tasks" element={<TaskManagement />} /> 
        <Route path="/intern-dashboard" element={<InternDashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;