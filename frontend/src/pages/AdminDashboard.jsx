import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, FolderKanban, ClipboardList, 
  Search, Bell, AlertTriangle, CheckCircle2, Upload, Edit3, ArrowRight, FileCheck, Clock,
  Code, Smartphone, Globe, BarChart3
} from 'lucide-react';
import Sidebar from '../components/Sidebar'; 

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const [interns, setInterns] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // Helper function to safely extract arrays from API responses
  const extractArray = (res) => {
    if (!res || !res.data) return [];
    if (Array.isArray(res.data)) return res.data;
    if (res.data.content && Array.isArray(res.data.content)) return res.data.content;
    if (res.data.data && Array.isArray(res.data.data)) return res.data.data;
    return [];
  };

  useEffect(() => {
    fetchAllDashboardData();
  }, []);

  const fetchAllDashboardData = async () => {
    try {
      setLoading(true);
      const [internsRes, projectsRes, tasksRes] = await Promise.all([
        axios.get('http://localhost:8080/api/v1/interns', { headers }).catch(() => ({ data: [] })),
        axios.get('http://localhost:8080/api/v1/projects', { headers }).catch(() => ({ data: [] })),
        axios.get('http://localhost:8080/api/v1/tasks', { headers }).catch(() => ({ data: [] }))
      ]);

      setInterns(extractArray(internsRes));
      setProjects(extractArray(projectsRes));
      setTasks(extractArray(tasksRes));
    } catch (error) {
      console.error("Failed to load admin dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- SMART DATA EXTRACTORS ---

  const getTaskTitle = (task) => {
    if (!task) return 'Untitled Task';
    return task.title || task.taskTitle || task.taskName || task.name || 'Untitled Task';
  };

  const getProjectTitle = (task) => {
    if (!task) return 'Unassigned Project';

    if (typeof task.project === 'object' && task.project !== null) {
      const pName = task.project.name || task.project.title || task.project.projectName;
      if (pName) return pName;
    }

    if (task.projectName) return task.projectName;
    if (task.projectTitle) return task.projectTitle;

    const projId = task.projectId || (typeof task.project === 'object' ? (task.project?.id || task.project?._id) : task.project);
    if (projId && projects.length > 0) {
      const found = projects.find(p => String(p.id || p._id || p.projectId) === String(projId));
      if (found) return found.name || found.title || found.projectName || 'Unassigned Project';
    }

    return 'Unassigned Project';
  };

  const getInternName = (task) => {
    if (!task) return 'Unassigned Intern';

    if (typeof task.assignee === 'object' && task.assignee !== null) {
      const name = task.assignee.fullName || task.assignee.name || `${task.assignee.firstName || ''} ${task.assignee.lastName || ''}`.trim();
      if (name) return name;
    }
    if (typeof task.intern === 'object' && task.intern !== null) {
      const name = task.intern.fullName || task.intern.name || `${task.intern.firstName || ''} ${task.intern.lastName || ''}`.trim();
      if (name) return name;
    }

    if (task.assignedInternName) return task.assignedInternName;
    if (task.internName) return task.internName;
    if (task.assigneeName) return task.assigneeName;

    const assigneeId = task.assigneeId || task.internId || task.userId || 
      (typeof task.assignee === 'object' ? (task.assignee?.id || task.assignee?._id) : (typeof task.assignee !== 'object' ? task.assignee : null)) ||
      (typeof task.intern === 'object' ? (task.intern?.id || task.intern?._id) : (typeof task.intern !== 'object' ? task.intern : null));

    if (assigneeId && interns.length > 0) {
      const found = interns.find(i => String(i.id || i._id || i.userId || i.internId) === String(assigneeId));
      if (found) {
        return found.fullName || found.name || `${found.firstName || ''} ${found.lastName || ''}`.trim() || found.user?.fullName || 'Unassigned Intern';
      }
    }

    return 'Unassigned Intern';
  };

  const getTaskDate = (task) => {
    if (!task) return null;
    return task.deadline || task.dueDate || task.targetDate || null;
  };

  // --- Dynamic Calculations ---
  const activeInternsCount = interns.filter(i => i.active !== false).length;
  const activeProjectsCount = projects.filter(p => {
    const s = String(p.status || '').toUpperCase();
    return s !== 'COMPLETED';
  }).length;
  
  const isStatus = (t, statusKey) => {
    const s = String(t.status || '').toUpperCase().replace(/[\s_]/g, '');
    const target = statusKey.toUpperCase().replace(/[\s_]/g, '');
    if (target === 'TODO' && (s === 'TODO' || s === '2DO')) return true;
    return s === target;
  };

  const todoTasks = tasks.filter(t => isStatus(t, 'TO_DO')).length;
  const inProgressTasks = tasks.filter(t => isStatus(t, 'IN_PROGRESS')).length;
  const submittedTasks = tasks.filter(t => isStatus(t, 'SUBMITTED')).length;
  const revisionTasks = tasks.filter(t => isStatus(t, 'REVISION_REQUIRED')).length;
  const completedTasks = tasks.filter(t => isStatus(t, 'COMPLETED')).length;
  
  const totalTasks = tasks.length;
  const pendingSubmissions = submittedTasks;
  const today = new Date().toISOString().split('T')[0];
  const overdueTasks = tasks.filter(t => {
    const taskDeadline = getTaskDate(t);
    return taskDeadline && taskDeadline.toString().split('T')[0] < today && !isStatus(t, 'COMPLETED');
  }).length;

  const getPercent = (val) => totalTasks > 0 ? ((val / totalTasks) * 100).toFixed(1) : '0.0';
  const progressColors = ['bg-blue-600', 'bg-emerald-500', 'bg-amber-500', 'bg-indigo-600', 'bg-teal-500'];

  const projectIcons = [
    <Code size={16} className="text-purple-600" />,
    <Smartphone size={16} className="text-emerald-600" />,
    <Globe size={16} className="text-amber-600" />,
    <BarChart3 size={16} className="text-blue-600" />
  ];
  const projectBgColors = ['bg-purple-100', 'bg-emerald-100', 'bg-amber-100', 'bg-blue-100'];

  const getProjectProgress = (project) => {
    if (!project) return 0;
    const projId = project.id || project._id || project.projectId;
    const pName = project.name || project.title || project.projectName;

    const projectTasks = tasks.filter(t => {
      const tProjId = t.projectId || (typeof t.project === 'object' ? (t.project?.id || t.project?._id) : t.project);
      const tProjName = typeof t.project === 'object' ? t.project?.name : (t.projectName || t.projectTitle);

      const matchId = projId && tProjId && String(projId) === String(tProjId);
      const matchName = pName && tProjName && pName.trim().toLowerCase() === tProjName.trim().toLowerCase();

      return matchId || matchName;
    });

    if (projectTasks.length === 0) return project.progress || 0;

    // Calculates progress using both SUBMITTED and COMPLETED tasks
    const completedCount = projectTasks.filter(t => isStatus(t, 'COMPLETED') || isStatus(t, 'SUBMITTED')).length;
    return Math.round((completedCount / projectTasks.length) * 100);
  };

  const generateRecentActivities = () => {
    if (tasks.length === 0) return [];

    return tasks.slice(-8).reverse().map((task) => {
      const internName = getInternName(task);
      const taskTitle = getTaskTitle(task);
      const projectTitle = getProjectTitle(task);
      const statusLower = (task.status || '').toLowerCase().replace(/[\s_]/g, '');

      let actionText = `assigned task "${taskTitle}"`;
      let badgeBg = 'bg-blue-100 text-blue-600';
      let icon = <Upload size={14} />;

      if (statusLower.includes('submit')) {
        actionText = `submitted task "${taskTitle}"`;
        badgeBg = 'bg-amber-100 text-amber-600';
        icon = <FileCheck size={14} />;
      } else if (statusLower.includes('complete')) {
        actionText = `completed task "${taskTitle}"`;
        badgeBg = 'bg-emerald-100 text-emerald-600';
        icon = <CheckCircle2 size={14} />;
      } else if (statusLower.includes('progress')) {
        actionText = `started task "${taskTitle}"`;
        badgeBg = 'bg-indigo-100 text-indigo-600';
        icon = <Edit3 size={14} />;
      }

      const taskDate = getTaskDate(task);

      return {
        id: task.id || task._id || Math.random(),
        user: internName,
        action: actionText,
        project: `Project: ${projectTitle}`,
        time: taskDate ? `Due: ${taskDate.toString().split('T')[0]}` : 'Recently',
        bg: badgeBg,
        icon: icon
      };
    });
  };

  const recentActivities = generateRecentActivities();

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar role="admin" activePage="dashboard" />

      <div className="flex-1 flex flex-col overflow-y-auto">
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
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {pendingSubmissions + overdueTasks}
              </span>
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

        <main className="p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Users size={20} />
              </div>
              <p className="text-xs text-slate-500 font-medium">Active Interns</p>
              <h3 className="text-2xl font-bold text-slate-800 my-1">{activeInternsCount}</h3>
              <span className="text-[10px] text-slate-400">Currently active</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <FolderKanban size={20} />
              </div>
              <p className="text-xs text-slate-500 font-medium">Active Projects</p>
              <h3 className="text-2xl font-bold text-slate-800 my-1">{activeProjectsCount}</h3>
              <span className="text-[10px] text-slate-400">In progress</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <ClipboardList size={20} />
              </div>
              <p className="text-xs text-slate-500 font-medium">Pending Submissions</p>
              <h3 className="text-2xl font-bold text-slate-800 my-1">{pendingSubmissions}</h3>
              <span className="text-[10px] text-amber-600 font-medium flex items-center gap-1">
                <AlertTriangle size={10} /> Require attention
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3">
                <AlertTriangle size={20} />
              </div>
              <p className="text-xs text-slate-500 font-medium">Overdue Tasks</p>
              <h3 className="text-2xl font-bold text-slate-800 my-1">{overdueTasks}</h3>
              <span className="text-[10px] text-red-500 font-medium flex items-center gap-1">
                <AlertTriangle size={10} /> Action needed
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                <CheckCircle2 size={20} />
              </div>
              <p className="text-xs text-slate-500 font-medium">Completed Tasks</p>
              <h3 className="text-2xl font-bold text-slate-800 my-1">{completedTasks}</h3>
              <span className="text-[10px] text-slate-400">Successfully completed</span>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-6 space-y-6">
              
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
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> To Do: {todoTasks} ({getPercent(todoTasks)}%)</div>
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> In Progress: {inProgressTasks} ({getPercent(inProgressTasks)}%)</div>
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Submitted: {submittedTasks} ({getPercent(submittedTasks)}%)</div>
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Revision Required: {revisionTasks} ({getPercent(revisionTasks)}%)</div>
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Completed: {completedTasks} ({getPercent(completedTasks)}%)</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-slate-800">Active Projects Progress</h3>
                  </div>
                  <div className="space-y-4">
                    {projects.length > 0 ? (
                      projects.map((p, i) => {
                        const calculatedProgress = getProjectProgress(p);
                        return (
                          <div key={p.id || p._id || i} className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg shrink-0 ${projectBgColors[i % projectBgColors.length]}`}>
                              {projectIcons[i % projectIcons.length]}
                            </div>
                            
                            <div className="flex-1 space-y-1">
                              <div className="flex justify-between text-xs text-slate-700 font-semibold">
                                <span>{p.name || p.title || p.projectName}</span>
                                <span className="text-slate-500">{calculatedProgress}%</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2">
                                <div 
                                  className={`${progressColors[i % progressColors.length]} h-2 rounded-full transition-all duration-300`} 
                                  style={{ width: `${calculatedProgress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-400">No active projects found.</p>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/admin-projects')}
                  className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline mt-6"
                >
                  View all projects <ArrowRight size={12} />
                </button>
              </div>

            </div>

            <div className="col-span-12 lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-bold text-slate-800">Recent Activity</h3>
                  <button onClick={() => navigate('/admin-tasks')} className="text-xs text-blue-600 font-semibold hover:underline">
                    View all
                  </button>
                </div>

                <div className="space-y-6 text-xs">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((act) => (
                      <div key={act.id} className="flex gap-4 items-start">
                        <div className={`p-2 rounded-full ${act.bg} shrink-0 mt-0.5`}>
                          {act.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-800 text-xs">
                            <span className="font-bold text-slate-900">{act.user}</span> {act.action}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{act.project}</p>
                        </div>
                        <span className="ml-auto text-[10px] text-slate-400 shrink-0 font-medium">{act.time}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-slate-400">
                      <Clock size={24} className="mx-auto mb-2 text-slate-300" />
                      <p className="text-xs">No recent activity recorded yet.</p>
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={() => navigate('/admin-tasks')}
                className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline mt-6"
              >
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