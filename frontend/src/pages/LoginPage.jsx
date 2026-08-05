import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Temporary logic to demonstrate routing before Backend integration
    if (email.includes('admin')) {
      navigate('/admin/dashboard');
    } else {
      navigate('/intern/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      
      {/* Top Header */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center">
        <div className="flex items-center gap-2 text-2xl font-bold text-blue-700">
          <GraduationCap size={32} />
          InternTrack
        </div>
        <Link to="/" className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800">
          <ArrowLeft size={20} /> Back to Home
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 flex flex-col md:flex-row overflow-hidden border border-gray-100">
          
          {/* Left Side - Welcome Banner */}
          <div className="md:w-1/2 bg-indigo-50 p-8 rounded-xl flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome Back!</h2>
            <p className="text-gray-600 mb-8">
              Manage your internships, assign tasks, and track daily progress seamlessly.
            </p>
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg text-sm font-medium text-blue-700 shadow-sm w-max">
              <Users size={16} /> Single portal for both Supervisors & Interns
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="md:w-1/2 p-8 pt-10 md:pt-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Login to Your Account</h2>
            <p className="text-sm text-gray-500 text-center mb-8">Please enter your email and password to continue.</p>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="alex@interntrack.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember Me</label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Forgot Password?</a>
                </div>
              </div>

              <div>
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">
                  Sign In →
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;