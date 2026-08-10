import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Mail, Lock, Users, UserCheck } from 'lucide-react';

const LoginPage = () => {
  const [role, setRole] = useState('intern');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); 

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setError(errorText); 
        return;
      }

      const data = await response.json();
      
      // Token එක සහ User Data Save කිරීම (Role එක අනිවාර්යයෙන් Capital කර Save කරමු)
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role.toUpperCase());
      localStorage.setItem('email', data.email);

      // Role එක අනුව Redirect කිරීම (Frontend එකේදීත් Capital අකුරු වලින් Check කිරීම)
      if (data.role.toUpperCase() === 'SUPERVISOR') {
        navigate('/admin-dashboard');
      } else {
        navigate('/intern-dashboard');
      }

    } catch (err) {
      setError('An error occurred. Please try again.');
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
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition"
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold text-sm transition shadow-md shadow-blue-200 mt-2">
            Log In as {role === 'intern' ? 'Intern' : 'Supervisor'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;