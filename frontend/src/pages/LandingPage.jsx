import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, BarChart3, GraduationCap } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2 text-2xl font-bold text-blue-700">
          <GraduationCap size={32} />
          InternTrack
        </div>
        <div className="hidden md:flex gap-8 text-gray-600 font-medium">
          <a href="#" className="hover:text-blue-600">Home</a>
          <a href="#" className="hover:text-blue-600">Features</a>
          <a href="#" className="hover:text-blue-600">About Us</a>
        </div>
        <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
          Login
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
            Streamline Your <br/>
            <span className="text-blue-600">Internship Management &</span> <br/>
            <span className="text-blue-600">Task Tracking.</span>
          </h1>
          <p className="text-lg text-gray-600">
            The all-in-one platform for supervisors and interns to collaborate, track progress, and achieve goals together.
          </p>
          <div className="pt-4">
            <Link to="/login" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 shadow-lg transition flex w-max items-center gap-2">
              🚀 Get Started / Login
            </Link>
          </div>
          <div className="flex gap-6 pt-6 text-gray-500 font-medium">
            <span className="flex items-center gap-2"><ShieldCheck className="text-blue-600"/> Secure</span>
            <span className="flex items-center gap-2"><Users className="text-blue-600"/> Collaborative</span>
            <span className="flex items-center gap-2"><BarChart3 className="text-blue-600"/> Insightful</span>
          </div>
        </div>
        
        {/* Mockup / Illustration Area */}
        <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Built for Both Roles</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-left">
                <h4 className="font-bold text-blue-800">Supervisor Portal</h4>
                <p className="text-sm text-gray-600 mt-1">Manage interns, create projects, assign tasks, review submissions.</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-100 text-left">
                <h4 className="font-bold text-green-800">Intern Portal</h4>
                <p className="text-sm text-gray-600 mt-1">View assigned tasks, update progress, submit daily logs.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;