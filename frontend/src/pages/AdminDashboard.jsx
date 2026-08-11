import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, FolderKanban, ClipboardList, 
  Search, Bell, AlertTriangle, CheckCircle2, Upload, Edit3, ArrowRight, FileCheck
} from 'lucide-react';
import Sidebar from '../components/Sidebar'; 

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardSummary();
  }, []);

  const fetchDashboardSummary = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/v1/admin/dashboard-summary', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error("Dashboard data fetching failed", error);
    } finally {
      setLoading(false);
    }
  };

  
  const taskOverview = dashboardData?.taskOverview || {};
  const todo = taskOverview.todo || 0;
  const inProgress = taskOverview.inProgress || 0;
  const submitted = taskOverview.submitted || 0;
  const revisionRequired = taskOverview.revisionRequired || 0;
  const completed = taskOverview.completed || 0;
  const totalTasks = todo + inProgress + submitted + revisionRequired + completed;

  const getPercent = (val) => totalTasks > 0 ? ((val / totalTasks) * 100).toFixed(1) : 0;

  const progressColors = ['bg-blue-600', 'bg-emerald-500', 'bg-amber-500', 'bg-indigo-600', 'bg-teal-500'];

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      <Sidebar role="admin" activePage="dashboard" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
          
          <div className="flex items-center gap-6">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search interns, projects, tasks..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <Bell size={20} className="text-slate-600 cursor-pointer" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">5</span>
            </div>
            <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" className="w-9 h-9 rounded-full bg-blue-100" />
              <div>
                <p className="text-xs font-bold text-slate-800">Admin User</p>
                <p className="text-[10px] text-slate-500">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-8 space-y-6">
          {/* Top Stat Cards */}
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Users size={20} />
              </div>
              <p className="text-xs text-slate-500 font-medium">Active Interns</p>
              <h3 className="text-2xl font-bold text-slate-800 my-1">{dashboardData?.activeInterns || 0}</h3>
              <span className="text-[10px] text-slate-400">Currently active</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <FolderKanban size={20} />
              </div>
              <p className="text-xs text-slate-500 font-medium">Active Projects</p>
              <h3 className="text-2xl font-bold text-slate-800 my-1">{dashboardData?.activeProjects || 0}</h3>
              <span className="text-[10px] text-slate-400">In progress</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <ClipboardList size={20} />
              </div>
              <p className="text-xs text-slate-500 font-medium">Pending Submissions</p>
              <h3 className="text-2xl font-bold text-slate-800 my-1">{dashboardData?.pendingSubmissions || 0}</h3>
              <span className="text-[10px] text-red-500 font-medium flex items-center gap-1">
                <AlertTriangle size={10} /> Require attention
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3">
                <AlertTriangle size={20} />
              </div>
              <p className="text-xs text-slate-500 font-medium">Overdue Tasks</p>
              <h3 className="text-2xl font-bold text-slate-800 my-1">{dashboardData?.overdueTasks || 0}</h3>
              <span className="text-[10px] text-red-500 font-medium flex items-center gap-1">
                <AlertTriangle size={10} /> Action needed
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                <CheckCircle2 size={20} />
              </div>
              <p className="text-xs text-slate-500 font-medium">Completed Tasks</p>
              <h3 className="text-2xl font-bold text-slate-800 my-1">{dashboardData?.completedTasks || 0}</h3>
              <span className="text-[10px] text-slate-400">Successfully completed</span>
            </div>
          </div>

          {/* Middle Section */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Progress Overview */}
            <div className="col-span-6 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-4">Task Overview</h3>
                <div className="flex items-center justify-around my-4">
                  <div className="relative w-36 h-36 rounded-full border-[12px] border-blue-500 border-t-emerald-500 border-r-amber-400 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-[10px] text-slate-400 block">Total Tasks</span>
                      <span className="text-2xl font-bold text-slate-800">{totalTasks}</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> To Do: {todo} ({getPercent(todo)}%)</div>
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> In Progress: {inProgress} ({getPercent(inProgress)}%)</div>
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Submitted: {submitted} ({getPercent(submitted)}%)</div>
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Revision Required: {revisionRequired} ({getPercent(revisionRequired)}%)</div>
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Completed: {completed} ({getPercent(completed)}%)</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-slate-800">Active Projects Progress</h3>
                </div>
                <div className="space-y-4">
                  {dashboardData?.activeProjectsProgress?.length > 0 ? (
                    dashboardData.activeProjectsProgress.map((p, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-700 font-medium">
                          <span>{p.name}</span>
                          <span>{p.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className={`${progressColors[i % progressColors.length]} h-2 rounded-full`} style={{ width: `${p.progress}%` }}></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">No active projects found.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Recent Activity */}
            <div className="col-span-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-bold text-slate-800">Recent Activity</h3>
                  <button className="text-xs text-blue-600 font-semibold hover:underline">View all</button>
                </div>

                <div className="space-y-6 text-xs">
                  {[
                    { user: 'Kamal Perera', action: 'submitted API Integration task', project: 'Intern Management System', time: '2h ago', icon: <Upload size={14} className="text-blue-600" />, bg: 'bg-blue-50' },
                    { user: 'Nimali Dias', action: 'submitted daily work log', project: 'Mobile App Development', time: '3h ago', icon: <FileCheck size={14} className="text-emerald-600" />, bg: 'bg-emerald-50' },
                    { user: 'Nadisha Buddini', action: 'updated task status to In Progress', project: 'Dashboard UI Implementation', time: '5h ago', icon: <Edit3 size={14} className="text-amber-600" />, bg: 'bg-amber-50' },
                    { user: 'Deadline reminder:', action: 'Database Integration task is overdue', project: 'Intern Management System', time: '7h ago', icon: <AlertTriangle size={14} className="text-red-600" />, bg: 'bg-red-50' },
                    { user: 'Nimali Perera', action: 'completed Authentication Module', project: 'Mobile App Development', time: '9h ago', icon: <CheckCircle2 size={14} className="text-teal-600" />, bg: 'bg-teal-50' },
                  ].map((act, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className={`p-2 rounded-full ${act.bg} shrink-0`}>{act.icon}</div>
                      <div>
                        <p className="text-slate-800"><span className="font-semibold">{act.user}</span> {act.action}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{act.project}</p>
                      </div>
                      <span className="ml-auto text-[10px] text-slate-400 shrink-0">{act.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline mt-6">
                View all activity <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;