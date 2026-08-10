import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Mail, Lock, Users, UserCheck, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const LoginPage = () => {
  const [role, setRole] = useState('intern');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || errorData?.error || await response.text();
        setError(errorMessage || 'Invalid credentials.');
        return;
      }

      const data = await response.json();

      // Flexible token extraction to match various backend responses
      const authToken = data.token || data.accessToken || data.jwtToken || data.jwt;

      if (!authToken) {
        setError('Token not received from server. Please check backend authentication.');
        return;
      }

      localStorage.setItem('token', authToken);
      localStorage.setItem('role', data.role ? data.role.toUpperCase() : role.toUpperCase());
      localStorage.setItem('email', data.email || email);

      const userRole = data.role ? data.role.toUpperCase() : role.toUpperCase();

      if (userRole === 'SUPERVISOR' || userRole === 'ADMIN') {
        navigate('/admin-dashboard');
      } else {
        navigate('/intern-dashboard');
      }
    } catch (err) {
      setError('Unable to connect to the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faff] flex flex-col justify-center items-center p-4">
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition">
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-md">
            <GraduationCap size={28} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900 mb-1">Welcome Back</h2>
        <p className="text-xs text-center text-gray-500 mb-6">Log in to your InternTrack account</p>

        {/* Role Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button 
            type="button" onClick={() => { setRole('intern'); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition ${role === 'intern' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <Users size={14} /> Intern Login
          </button>
          <button 
            type="button" onClick={() => { setRole('supervisor'); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition ${role === 'supervisor' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <UserCheck size={14} /> Supervisor
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 text-xs font-semibold p-3 rounded-lg mb-4 border border-red-100 text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com" disabled={isLoading}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition disabled:bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" disabled={isLoading}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition disabled:bg-gray-50"
              />
            </div>
          </div>

          <button 
            type="submit" disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold text-sm transition shadow-md shadow-blue-200 mt-2 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : `Log In as ${role === 'intern' ? 'Intern' : 'Supervisor'}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;