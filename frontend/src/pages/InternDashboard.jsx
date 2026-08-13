import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ClipboardList, Search, AlertCircle, Plus, Calendar, MessageSquare, CheckCircle2, Loader2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; 

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const InternDashboard = () => {
  const navigate = useNavigate();
  
  // States
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [assignedProject, setAssignedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  // Auth Header Setup
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    fetchInternDashboardData();
  }, []);

  const fetchInternDashboardData = async () => {
    setIsLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = storedUser.id || storedUser._id;

      const [tasksRes, submissionsRes, logsRes, projectsRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/api/v1/tasks`, getAuthHeaders()),
        axios.get(`${API_BASE_URL}/api/v1/submissions`, getAuthHeaders()),
        axios.get(`${API_BASE_URL}/api/v1/daily-logs`, getAuthHeaders()),
        axios.get(`${API_BASE_URL}/api/v1/projects`, getAuthHeaders())
      ]);

      const allTasks = tasksRes.status === 'fulfilled' ? tasksRes.value.data || [] : [];
      const internTasks = allTasks.filter(t => t.assignedTo?.id === userId || t.assignedTo === userId || t.internId === userId);
      setTasks(internTasks);

      const allSubmissions = submissionsRes.status === 'fulfilled' ? submissionsRes.value.data || [] : [];
      const internSubmissions = allSubmissions.filter(s => s.intern?.id === userId || s.intern?._id === userId || s.internId === userId);
      setSubmissions(internSubmissions);

      const allLogs = logsRes.status === 'fulfilled' ? logsRes.value.data || [] : [];
      const internLogs = allLogs.filter(l => l.intern?.id === userId || l.intern?._id === userId || l.internId === userId);
      setDailyLogs(internLogs);

      const allProjects = projectsRes.status === 'fulfilled' ? projectsRes.value.data || [] : [];
      const userProject = allProjects.find(p => 
        p.id === storedUser.projectId || 
        p.interns?.some(i => i.id === userId || i._id === userId) ||
        p.members?.some(m => m.id === userId || m._id === userId)
      ) || allProjects[0] || null;
      
      setAssignedProject(userProject);

    } catch (error) {
      console.error("Error fetching Intern Dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculated Stats
  const activeTasksCount = tasks.filter(t => (t.status || '').toLowerCase() !== 'completed' && (t.status || '').toLowerCase() !== 'done').length;
  const highPriorityTasksCount = tasks.filter(t => (t.priority || '').toLowerCase() === 'high' && (t.status || '').toLowerCase() !== 'done').length;
  const pendingSubmissionsCount = submissions.filter(s => (s.status || '').toLowerCase().includes('pending')).length;

  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayLog = dailyLogs.find(log => {
    const logDate = new Date(log.date || log.createdAt).toISOString().split('T')[0];
    return logDate === todayDateStr;
  });
  const isTodayLogSubmitted = !!todayLog;

  const latestFeedback = submissions.find(s => s.feedback && s.feedback.trim() !== '') || null;

  // Filter tasks based on Search Term
  const filteredTasks = tasks.filter(task => 
    (task.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.priority || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.status || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar role="intern" activePage="dashboard" />

      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-end gap-6 sticky top-0 z-10">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks, logs, or updates..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
            <img 
              src={currentUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.fullName || 'Intern'}`} 
              alt="User" 
              className="w-9 h-9 rounded-full bg-blue-100 object-cover" 
            />
            <div>
              <p className="text-xs font-bold text-slate-800">{currentUser?.fullName || 'Intern User'}</p>
              <p className="text-[10px] text-slate-500">{currentUser?.role || 'Intern'} · {assignedProject?.name || 'Assigned Project'}</p>
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-sm font-medium text-slate-600">Loading your dashboard...</span>
          </div>
        ) : (
          <main className="p-8 space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-100 via-indigo-50 to-blue-50 p-6 rounded-2xl border border-blue-100 flex justify-between items-center relative overflow-hidden">
              <div className="space-y-1 z-10">
                <h2 className="text-2xl font-extrabold text-slate-800">Welcome back, {currentUser?.fullName || 'Intern'}! 👋</h2>
                <p className="text-xs text-slate-600 font-medium">
                  Here is your daily overview. You have {pendingSubmissionsCount} pending submissions and today's work log is {isTodayLogSubmitted ? 'completed' : 'pending'}.
                </p>
              </div>
              <div className="w-32 h-20 bg-blue-200/50 rounded-full blur-2xl absolute right-10 top-0"></div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-blue-600 text-white rounded-xl"><ClipboardList size={20} /></div>
                <div>
                  <p className="text-xs text-slate-500">My Active Tasks</p>
                  <h3 className="text-xl font-bold text-slate-800">{activeTasksCount}</h3>
                  <span className="text-[10px] text-blue-600 font-semibold">{highPriorityTasksCount} High Priority</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition" onClick={() => navigate('/intern-submissions')}>
                <div className="p-3 bg-indigo-600 text-white rounded-xl"><AlertCircle size={20} /></div>
                <div>
                  <p className="text-xs text-slate-500">Pending Submissions</p>
                  <h3 className="text-xl font-bold text-slate-800">{pendingSubmissionsCount}</h3>
                  <span className="text-[10px] text-slate-400">Requires review</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition" onClick={() => navigate('/intern-daily-logs')}>
                <div className={`p-3 rounded-xl ${isTodayLogSubmitted ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                  {isTodayLogSubmitted ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                </div>
                <div>
                  <p className="text-xs text-slate-500">Today's Log Status</p>
                  <h3 className={`text-xl font-bold ${isTodayLogSubmitted ? 'text-emerald-600' : 'text-red-600'}`}>
                    {isTodayLogSubmitted ? 'Submitted' : 'Pending'}
                  </h3>
                  <span className={`text-[10px] ${isTodayLogSubmitted ? 'text-emerald-500' : 'text-red-400'}`}>
                    {isTodayLogSubmitted ? 'Logged for today' : 'Not submitted yet'}
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><ClipboardList size={20} /></div>
                <div>
                  <p className="text-xs text-slate-500">Assigned Project</p>
                  <h3 className="text-sm font-bold text-slate-800 truncate max-w-[120px]">{assignedProject?.name || 'No Project'}</h3>
                  <span className="text-[10px] text-emerald-600 font-semibold">{assignedProject?.progress || 0}% Overall Progress</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => navigate('/intern-daily-logs')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-blue-200 transition"
              >
                <Plus size={16} /> Submit Today's Work Log
              </button>
              <button 
                type="button"
                onClick={() => navigate('/intern-tasks')}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition"
              >
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
                    <button type="button" onClick={() => navigate('/intern-tasks')} className="text-xs text-blue-600 font-semibold hover:underline">View all tasks →</button>
                  </div>

                  <div className="space-y-3">
                    {filteredTasks.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">No matching tasks found.</p>
                    ) : (
                      filteredTasks.slice(0, 4).map((task, i) => {
                        const priorityColor = 
                          (task.priority || '').toLowerCase() === 'high' ? 'bg-red-50 text-red-600' : 
                          (task.priority || '').toLowerCase() === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600';

                        return (
                          <div key={task.id || task._id || i} className="flex items-center justify-between p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-bold text-slate-800">{task.title}</p>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priorityColor}`}>
                                  {task.priority || 'Normal'}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Calendar size={10} /> Due: {task.dueDate || 'No Deadline'}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                                {task.status || 'To Do'}
                              </span>
                              <button 
                                type="button"
                                onClick={() => navigate('/intern-tasks')}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                              >
                                Submit Work
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Feedback Section */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-slate-800">Recent Supervisor Feedback</h3>
                  </div>
                  {latestFeedback ? (
                    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition" onClick={() => navigate('/intern-submissions')}>
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" className="w-10 h-10 rounded-full bg-blue-100 shrink-0" />
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-slate-800">Supervisor / Admin</h4>
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                            {latestFeedback.status || 'Reviewed'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">{latestFeedback.feedback}</p>
                        <span className="text-[10px] text-slate-400 block pt-1">
                          Task: {latestFeedback.taskTitle || latestFeedback.task?.title || 'Submission Feedback'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                      <p className="text-xs text-slate-400">No supervisor feedback received yet.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="col-span-4 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-800">Today's Daily Log</h3>
                  
                  {isTodayLogSubmitted ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                        <CheckCircle2 size={16} /> Submitted for Today
                      </div>
                      <p className="text-[11px] text-slate-600">Great job! You have already submitted your daily work log for today ({todayDateStr}).</p>
                    </div>
                  ) : (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-red-600 font-bold text-xs">
                        <AlertCircle size={16} /> Not Submitted Yet
                      </div>
                      <p className="text-[11px] text-slate-500">Don't forget to record your completed tasks, challenges, and hours worked before 06:00 PM.</p>
                    </div>
                  )}

                  <button 
                    type="button"
                    onClick={() => navigate('/intern-daily-logs')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-xl transition shadow-md shadow-blue-200"
                  >
                    {isTodayLogSubmitted ? 'View / Edit Daily Logs' : 'Fill Daily Log Now'}
                  </button>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-800">Assigned Project Overview</h3>
                  {assignedProject ? (
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-800">{assignedProject.name || 'Project Name'}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{assignedProject.description || 'No project description available.'}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(assignedProject.technologies || ['React', 'Spring Boot', 'MongoDB']).map((tech, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-md">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No project assigned yet.</p>
                  )}
                  
                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Supervisor" className="w-7 h-7 rounded-full bg-blue-100" />
                      <div>
                        <p className="text-[11px] font-bold text-slate-800">Admin User</p>
                        <p className="text-[9px] text-slate-400">Supervisor</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default InternDashboard;