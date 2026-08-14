import React from 'react';
import { Link } from 'react-router-dom';
import dashboardImg from '../assets/dashboard-preview.png';
import { 
  GraduationCap, 
  ShieldCheck, 
  Users, 
  BarChart3, 
  ArrowRight,
  Folder,
  ClipboardList,
  UserCheck,
  Settings,
  Bell,
  Layout,
  MessageSquare,
  Rocket,
  CheckSquare,
  Clock,
  Send,
  MessageCircle,
  TrendingUp
} from 'lucide-react';

// Brand & Custom SVGs
const FacebookIcon = ({ size = 16 }) => (
  <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);
const TwitterIcon = ({ size = 16 }) => (
  <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z"/></svg>
);
const LinkedinIcon = ({ size = 16 }) => (
  <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
);
const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#f8faff] font-sans text-gray-800 selection:bg-blue-200">
      
      {/* 1. Header / Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-2.5 text-2xl font-bold text-blue-700">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-sm">
            <GraduationCap size={22} />
          </div>
          <span className="tracking-tight text-blue-800">InternTrack</span>
        </div>
        
        <div className="hidden md:flex gap-10 text-sm font-semibold text-gray-600">
          <a href="#home" className="text-blue-600 border-b-2 border-blue-600 pb-1">Home</a>
          <a href="#features" className="hover:text-blue-600 transition">Features</a>
        </div>

        <Link 
          to="/login" 
          className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-md shadow-blue-200 flex items-center gap-2 text-sm"
        >
          <ArrowRight size={16} /> Login
        </Link>
      </nav>

      {/* 2. Hero Section */}
      <section id="home" className="max-w-[1400px] mx-auto px-6 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
        
        {/* Hero Left Text */}
        <div className="lg:col-span-5 space-y-6 z-10">
          <h1 className="text-4xl md:text-5xl lg:text-[54px] font-extrabold text-[#0f172a] leading-[1.15] tracking-tight">
            Streamline Your <br />
            Internship Management & <br />
            <span className="text-blue-600">Task Tracking.</span>
          </h1>

          <p className="text-base text-gray-600 max-w-md leading-relaxed">
            The all-in-one platform for supervisors and interns to collaborate, track progress, and achieve goals together.
          </p>

          <div className="pt-2">
            <Link 
              to="/login" 
              className="bg-blue-600 text-white px-7 py-3.5 rounded-xl text-base font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition flex items-center gap-2.5 w-max hover:-translate-y-0.5"
            >
              <Rocket size={18} /> Get Started / Login
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-8 pt-4 text-sm font-semibold text-gray-600">
            <span className="flex items-center gap-2"><ShieldCheck className="text-blue-600" size={18}/> Secure</span>
            <span className="flex items-center gap-2"><Users className="text-blue-600" size={18}/> Collaborative</span>
            <span className="flex items-center gap-2"><BarChart3 className="text-blue-600" size={18}/> Insightful</span>
          </div>
        </div>

        {/* Hero Right Image */}
        <div className="lg:col-span-7 relative z-10 w-full flex justify-center items-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-blue-100/60 rounded-full blur-3xl opacity-60 -z-10"></div>
          
          <img 
            src={dashboardImg} 
            alt="InternTrack Dashboard Preview" 
            className="rounded-2xl shadow-2xl border border-gray-200/80 w-full max-w-3xl object-cover hover:scale-[1.01] transition duration-300"
          />
        </div>
      </section>

      {/* 3. Built for Both Roles Section */}
      <section className="py-8 max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px bg-gray-200 w-16"></div>
          <span className="text-xs font-bold text-gray-700 tracking-wider uppercase">Built for Both Roles</span>
          <div className="h-px bg-gray-200 w-16"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center">
          {/* Supervisor Card */}
          <div className="bg-white border border-blue-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300 rounded-2xl md:rounded-full p-4 px-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0 border border-blue-100">
              <UserCheck size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-sm">Supervisor Portal</h3>
              <p className="text-[11px] text-gray-500 leading-tight mt-0.5">Manage interns, create projects, assign tasks, review submissions, and provide feedback.</p>
            </div>
            <Link 
              to="/login"
              className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition shrink-0"
              title="Go to Login"
            >
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Intern Card */}
          <div className="bg-white border border-emerald-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300 rounded-2xl md:rounded-full p-4 px-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100">
              <GraduationCap size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-sm">Intern Portal</h3>
              <p className="text-[11px] text-gray-500 leading-tight mt-0.5">View assigned tasks, update progress, submit daily logs, and track growth.</p>
            </div>
            <Link 
              to="/login"
              className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition shrink-0"
              title="Go to Login"
            >
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full tracking-wider border border-blue-100 uppercase">KEY FEATURES</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">Everything You Need to Manage Internships</h2>
            <p className="text-gray-500 mt-1.5 text-xs max-w-xl mx-auto">Powerful features designed to simplify internship management, task workflow, and productivity.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1: Centralized Dashboards (Blue Tint) */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-xl flex items-center justify-center mb-5 shadow-sm">
                <Layout size={24} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2 group-hover:text-blue-600 transition-colors">1. Centralized Dashboards</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Dedicated Admin and Intern dashboards designed to control, monitor, and streamline the entire internship program from a single unified workspace.
              </p>
            </div>

            {/* Feature 2: Intern Management & Onboarding (Indigo Tint) */}
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
              <div className="w-12 h-12 bg-indigo-500 text-white rounded-xl flex items-center justify-center mb-5 shadow-sm">
                <Users size={24} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2 group-hover:text-indigo-600 transition-colors">2. Intern Management & Onboarding</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Effortlessly onboard new interns, manage account statuses (Active/Inactive), and assign team members to relevant projects with ease.
              </p>
            </div>

            {/* Feature 3: Project & Task Management (Purple Tint) */}
            <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
              <div className="w-12 h-12 bg-purple-500 text-white rounded-xl flex items-center justify-center mb-5 shadow-sm">
                <Folder size={24} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2 group-hover:text-purple-600 transition-colors">3. Project & Task Management</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Create projects and tasks, set priorities (High/Medium/Low) and due dates, and track task progress seamlessly from To Do to Completed.
              </p>
            </div>

            {/* Feature 4: Daily Work Logging (Amber Tint) */}
            <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
              <div className="w-12 h-12 bg-amber-500 text-white rounded-xl flex items-center justify-center mb-5 shadow-sm">
                <Clock size={24} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2 group-hover:text-amber-600 transition-colors">4. Daily Work Logging</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Enable interns to log daily working hours, completed tasks, current blockers, and next-day plans for complete workflow transparency.
              </p>
            </div>

            {/* Feature 5: Seamless Work Submission (Emerald Tint) */}
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center mb-5 shadow-sm">
                <Send size={24} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2 group-hover:text-emerald-600 transition-colors">5. Seamless Work Submission</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Direct submission of finished work complete with GitHub repository links, documentation/demo links, and detailed completion notes.
              </p>
            </div>

            {/* Feature 6: Supervisor Review & Feedback Loop (Rose Tint) */}
            <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
              <div className="w-12 h-12 bg-rose-500 text-white rounded-xl flex items-center justify-center mb-5 shadow-sm">
                <MessageCircle size={24} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2 group-hover:text-rose-600 transition-colors">6. Supervisor Review & Feedback Loop</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Streamlined review process for supervisors to evaluate submissions and daily logs—easily approving work or requesting necessary revisions with instant feedback.
              </p>
            </div>

            {/* Feature 7: Real-Time Progress & Analytics (Teal Tint) */}
            <div className="bg-teal-50/50 border border-teal-100 rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-teal-500 text-white rounded-xl flex items-center justify-center mb-5 shadow-sm">
                <TrendingUp size={24} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2 group-hover:text-teal-600 transition-colors">7. Real-Time Progress & Analytics</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Monitor overall project completion rates, track overdue tasks, and analyze team activity through real-time visual charts and key metrics.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="bg-[#0b132b] text-white pt-12 pb-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 border-b border-slate-800 pb-10 mb-6">
          
          <div className="lg:col-span-1 space-y-3">
            <div className="flex items-center gap-2 text-xl font-bold">
              <div className="bg-blue-600 text-white p-1 rounded-lg">
                <GraduationCap size={20} />
              </div>
              InternTrack
            </div>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Streamline internship management and task tracking with ease.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-3">Product</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#features" className="hover:text-white transition">Features</a></li>
              <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition">Roadmap</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-3">Resources</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#" className="hover:text-white transition">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition">Support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-2">Stay Connected</h4>
            <div className="flex gap-2.5 mt-3">
              <a href="#" className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white transition"><FacebookIcon size={12}/></a>
              <a href="#" className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-blue-400 hover:text-white transition"><TwitterIcon size={12}/></a>
              <a href="#" className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-blue-700 hover:text-white transition"><LinkedinIcon size={12}/></a>
              <a href="#" className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white transition"><GithubIcon size={12}/></a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-[11px] text-slate-500">
          <p>© 2026 InternTrack. All rights reserved.</p>
          <div className="flex gap-4 mt-3 md:mt-0">
            <a href="#" className="hover:text-slate-300 transition">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-slate-300 transition">Terms of Service</a>
            <span>|</span>
            <a href="#" className="hover:text-slate-300 transition">Contact Us</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;