import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, ClipboardList, FileText, Send, LogOut, 
  Search, Bell, AlertCircle, Plus, Calendar, ArrowUpRight, MessageSquare 
} from 'lucide-react';

const InternDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col justify-between p-4 shrink-0">
        <div>
          <div className="flex items-center gap-3 px-3 py-4 mb-6">
            <div className="bg-blue-600 text-white p-2 rounded-xl">
              <LayoutDashboard size={20} />
            </div>
            <span className="text-xl font-bold text-white tracking-wide">InternTrack</span>
          </div>

          <nav className="space-y-1.5">
            <a href="#dashboard" className="flex items-center gap-3 px-3 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium shadow-md">
              <LayoutDashboard size={18} /> Dashboard
            </a>
            <a href="#tasks" className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-medium transition">
              <ClipboardList size={18} /> My Tasks
            </a>
            <a href="#logs" className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-medium transition">
              <FileText size={18} /> Daily Work Logs
            </a>
            <a href="#submissions" className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-medium transition">
              <Send size={18} /> My Submissions
            </a>
          </nav>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-red-400 hover:bg-slate-800/60 rounded-xl text-sm font-medium transition">
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-end gap-6 sticky top-0 z-10">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search tasks, logs, or updates..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Bell size={20} className="text-slate-600 cursor-pointer" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">3</span>
          </div>
          <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="User" className="w-9 h-9 rounded-full bg-blue-100" />
            <div>
              <p className="text-xs font-bold text-slate-800">John Doe</p>
              <p className="text-[10px] text-slate-500">Intern · Waste2Worth Platform</p>
            </div>
          </div>
        </header>

        <main className="p-8 space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-100 via-indigo-50 to-blue-50 p-6 rounded-2xl border border-blue-100 flex justify-between items-center relative overflow-hidden">
            <div className="space-y-1 z-10">
              <h2 className="text-2xl font-extrabold text-slate-800">Welcome back, John Doe! 👋</h2>
              <p className="text-xs text-slate-600 font-medium">Here is your daily overview. You have 2 pending submissions and today's work log is pending.</p>
            </div>
            <div className="w-32 h-20 bg-blue-200/50 rounded-full blur-2xl absolute right-10 top-0"></div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-600 text-white rounded-xl"><ClipboardList size={20} /></div>
              <div>
                <p className="text-xs text-slate-500">My Active Tasks</p>
                <h3 className="text-xl font-bold text-slate-800">5</h3>
                <span className="text-[10px] text-blue-600 font-semibold">2 High Priority</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-indigo-600 text-white rounded-xl"><Send size={20} /></div>
              <div>
                <p className="text-xs text-slate-500">Pending Submissions</p>
                <h3 className="text-xl font-bold text-slate-800">2</h3>
                <span className="text-[10px] text-slate-400">Requires review</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-red-100 text-red-600 rounded-xl"><AlertCircle size={20} /></div>
              <div>
                <p className="text-xs text-slate-500">Today's Log Status</p>
                <h3 className="text-xl font-bold text-red-600">Pending</h3>
                <span className="text-[10px] text-red-400">Not submitted yet</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><FileText size={20} /></div>
              <div>
                <p className="text-xs text-slate-500">Assigned Project</p>
                <h3 className="text-sm font-bold text-slate-800">Waste2Worth</h3>
                <span className="text-[10px] text-emerald-600 font-semibold">75% Overall Progress</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-blue-200 transition">
              <Plus size={16} /> Submit Today's Work Log
            </button>
            <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition">
              <ClipboardList size={16} /> View Assigned Tasks
            </button>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column */}
            <div className="col-span-8 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-slate-800">Upcoming Task Deadlines</h3>
                  <button className="text-xs text-blue-600 font-semibold hover:underline">View all tasks →</button>
                </div>

                <div className="space-y-3">
                  {[
                    { title: 'API Integration for Waste Collectors', tag: 'High', date: 'Due: Aug 06, 2026', status: 'In Progress', tagBg: 'bg-red-50 text-red-600' },
                    { title: 'Database Schema Optimization', tag: 'Medium', date: 'Due: Aug 08, 2026', status: 'In Progress', tagBg: 'bg-amber-50 text-amber-600' },
                    { title: 'Mobile App UI Improvements', tag: 'Low', date: 'Due: Aug 12, 2026', status: 'In Progress', tagBg: 'bg-blue-50 text-blue-600' },
                    { title: 'Unit & API Testing', tag: 'Medium', date: 'Due: Aug 14, 2026', status: 'To Do', tagBg: 'bg-amber-50 text-amber-600' },
                  ].map((task, i) => (
                    <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-800">{task.title}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${task.tagBg}`}>{task.tag}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Calendar size={10} /> {task.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">{task.status}</span>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition">Submit Work</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback Section */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-slate-800">Recent Supervisor Feedback</h3>
                  <button className="text-xs text-blue-600 font-semibold hover:underline">View all feedback →</button>
                </div>
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" className="w-10 h-10 rounded-full bg-blue-100 shrink-0" />
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-slate-800">Admin User</h4>
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">Approved</span>
                    </div>
                    <p className="text-xs text-slate-600">Great work on the Database Schema! Please update the API documentation as requested and add more test cases for user validation.</p>
                    <span className="text-[10px] text-slate-400 block pt-1">Aug 03, 2026 - 04:25 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-800">Today's Daily Log</h3>
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-red-600 font-bold text-xs">
                    <AlertCircle size={16} /> Not Submitted Yet
                  </div>
                  <p className="text-[11px] text-slate-500">Don't forget to record your completed tasks, challenges, and hours worked before 06:00 PM.</p>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-xl transition shadow-md shadow-blue-200">
                  Fill Daily Log Now
                </button>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-800">Assigned Project Overview</h3>
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-800">Waste2Worth Platform</p>
                  <p className="text-[11px] text-slate-500">A sustainability-focused platform to connect waste collectors and recyclers efficiently.</p>
                  <div className="flex gap-2">
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-1 rounded-md">Spring Boot</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-1 rounded-md">React</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-1 rounded-md">MongoDB</span>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Supervisor" className="w-7 h-7 rounded-full bg-blue-100" />
                    <div>
                      <p className="text-[11px] font-bold text-slate-800">Admin User</p>
                      <p className="text-[9px] text-slate-400">Administrator</p>
                    </div>
                  </div>
                  <button className="text-xs border border-slate-200 hover:bg-slate-50 px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium text-slate-600">
                    <MessageSquare size={12} /> Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InternDashboard;