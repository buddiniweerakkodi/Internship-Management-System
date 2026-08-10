import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, FolderKanban, CheckSquare, FileText, LogOut, Search, 
  Plus, Edit2, Trash2, X, Bell, Calendar, User as UserIcon, CheckCircle2, 
  Clock, AlertCircle, ChevronRight, Filter
} from 'lucide-react';

const TaskManagement = () => {
  const navigate = useNavigate();
  
  // States
  const [tasks, setTasks] = useState([]);
  const [interns, setInterns] = useState([]);
  const [projects, setProjects] = useState([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('ALL');
  const [selectedAssignee, setSelectedAssignee] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'TO_DO',
    priority: 'MEDIUM',
    dueDate: '',
    projectId: '',
    assigneeId: ''
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Initial Data Fetch
  useEffect(() => {
    fetchTasks();
    fetchInterns();
    fetchProjects();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/v1/tasks', { headers: getAuthHeaders() });
      setTasks(res.data || []);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  const fetchInterns = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/v1/interns', { headers: getAuthHeaders() });
      setInterns(res.data || []);
    } catch (err) {
      console.error("Failed to fetch interns", err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/v1/projects', { headers: getAuthHeaders() });
      setProjects(res.data || []);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  // Open Modal for Create / Edit
  const handleOpenModal = (task = null, defaultStatus = 'TO_DO') => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'TO_DO',
        priority: task.priority || 'MEDIUM',
        dueDate: task.dueDate || task.deadline || '',
        projectId: task.projectId || task.project?.id || '',
        assigneeId: task.assigneeId || task.assignee?.id || ''
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        status: defaultStatus,
        priority: 'MEDIUM',
        dueDate: '',
        projectId: projects[0]?.id || projects[0]?._id || '',
        assigneeId: interns[0]?.id || interns[0]?._id || ''
      });
    }
    setIsModalOpen(true);
  };

  // Submit Handler (Create or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = getAuthHeaders();
      const taskId = editingTask ? (editingTask.id || editingTask._id) : null;

      if (editingTask) {
        await axios.put(`http://localhost:8080/api/v1/tasks/${taskId}`, formData, { headers });
      } else {
        await axios.post('http://localhost:8080/api/v1/tasks', formData, { headers });
      }
      setIsModalOpen(false);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data || "Task saving failed!");
    }
  };

  // Quick Status Update
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const headers = getAuthHeaders();
      await axios.patch(`http://localhost:8080/api/v1/tasks/${taskId}/status`, { status: newStatus }, { headers });
      fetchTasks();
    } catch (err) {
      try {
        const headers = getAuthHeaders();
        const existingTask = tasks.find(t => (t.id || t._id) === taskId);
        await axios.put(`http://localhost:8080/api/v1/tasks/${taskId}`, { ...existingTask, status: newStatus }, { headers });
        fetchTasks();
      } catch (error) {
        console.error("Failed to update status", error);
      }
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`http://localhost:8080/api/v1/tasks/${taskId}`, { headers: getAuthHeaders() });
        fetchTasks();
      } catch (err) {
        console.error("Failed to delete task", err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Filter Tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const taskProjId = String(task.projectId || task.project?.id || task.project?._id || '');
    const matchesProject = selectedProject === 'ALL' ? true : taskProjId === String(selectedProject);
    
    const taskAssigneeId = String(task.assigneeId || task.assignee?.id || task.assignee?._id || '');
    const matchesAssignee = selectedAssignee === 'ALL' ? true : taskAssigneeId === String(selectedAssignee);
    
    const matchesPriority = selectedPriority === 'ALL' ? true : task.priority === selectedPriority;

    return matchesSearch && matchesProject && matchesAssignee && matchesPriority;
  });

  // Kanban Columns Definition
  const columns = [
    { key: 'TO_DO', title: 'To Do', color: 'bg-slate-400', textColor: 'text-slate-600' },
    { key: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-500', textColor: 'text-blue-600' },
    { key: 'SUBMITTED', title: 'Submitted', color: 'bg-purple-500', textColor: 'text-purple-600' },
    { key: 'REVISION_REQUIRED', title: 'Revision Required', color: 'bg-amber-500', textColor: 'text-amber-600' },
    { key: 'COMPLETED', title: 'Completed', color: 'bg-emerald-500', textColor: 'text-emerald-600' }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Left Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30">
              IT
            </div>
            <span className="font-bold text-xl tracking-wide">InternTrack</span>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => navigate('/admin-dashboard')}
              className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl text-sm font-medium transition-all"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </button>

            <button 
              onClick={() => navigate('/admin-interns')}
              className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl text-sm font-medium transition-all"
            >
              <Users className="w-5 h-5" />
              <span>Interns</span>
            </button>

            <button 
              onClick={() => navigate('/admin-projects')}
              className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl text-sm font-medium transition-all"
            >
              <FolderKanban className="w-5 h-5" />
              <span>Projects</span>
            </button>

            <button 
              onClick={() => navigate('/admin-tasks')}
              className="flex items-center gap-3 w-full px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium transition-all shadow-md shadow-blue-600/20"
            >
              <CheckSquare className="w-5 h-5" />
              <span>Tasks (Kanban Board)</span>
            </button>

            <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl text-sm font-medium transition-all opacity-60 cursor-not-allowed">
              <FileText className="w-5 h-5" />
              <span>Submissions & Daily Logs</span>
            </button>
          </nav>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-slate-800/50 rounded-xl text-sm font-medium transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-x-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Tasks Board</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search interns, projects, tasks..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
              />
            </div>

            <button className="relative p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-slate-600">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
            </button>

            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-sm">
                AU
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 leading-tight">Admin User</p>
                <p className="text-xs text-slate-400">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and New Task Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks by title or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
              />
            </div>

            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none shadow-sm"
            >
              <option value="ALL">All Projects</option>
              {projects.map(p => (
                <option key={p.id || p._id} value={p.id || p._id}>{p.name}</option>
              ))}
            </select>

            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none shadow-sm"
            >
              <option value="ALL">All Assignees</option>
              {interns.map(i => (
                <option key={i.id || i._id} value={i.id || i._id}>{i.fullName}</option>
              ))}
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none shadow-sm"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition-all shadow-md shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" /> Create New Task
          </button>
        </div>

        {/* Kanban Board Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 min-w-[1000px]">
          {columns.map((col) => {
            const columnTasks = filteredTasks.filter(t => t.status === col.key);

            return (
              <div key={col.key} className="bg-slate-100/70 p-3 rounded-2xl flex flex-col min-h-[500px]">
                <div className="flex items-center justify-between px-2 py-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.color}`}></span>
                    <h3 className="font-semibold text-slate-700 text-sm">{col.title}</h3>
                    <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>
                  <button onClick={() => handleOpenModal(null, col.key)} className="text-slate-400 hover:text-slate-600">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto max-h-[650px] pr-1">
                  {columnTasks.map((task) => {
                    const taskId = task.id || task._id;
                    const assignedIntern = interns.find(i => String(i.id || i._id) === String(task.assigneeId || task.assignee?.id || task.assignee?._id));
                    const assignedProj = projects.find(p => String(p.id || p._id) === String(task.projectId || task.project?.id || task.project?._id));

                    return (
                      <div key={taskId} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all group relative">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-slate-800 text-sm leading-snug">{task.title}</h4>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            <button onClick={() => handleOpenModal(task)} className="p-1 hover:text-blue-600 text-slate-400">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDeleteTask(taskId)} className="p-1 hover:text-rose-600 text-slate-400">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {task.description && (
                          <p className="text-xs text-slate-500 mb-3 line-clamp-2">{task.description}</p>
                        )}

                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            task.priority === 'HIGH' ? 'bg-rose-100 text-rose-600' :
                            task.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {task.priority || 'MEDIUM'}
                          </span>

                          {assignedProj && (
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[10px] font-medium truncate max-w-[120px]">
                              {assignedProj.name}
                            </span>
                          )}
                        </div>

                        <div className="mb-3">
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(taskId, e.target.value)}
                            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            {columns.map(c => (
                              <option key={c.key} value={c.key}>Move to: {c.title}</option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span className="text-[11px]">{task.dueDate || task.deadline || 'No Due Date'}</span>
                          </div>

                          {assignedIntern && (
                            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]" title={assignedIntern.fullName}>
                              {assignedIntern.fullName.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => handleOpenModal(null, col.key)}
                  className="mt-3 w-full py-2 border border-dashed border-slate-300 rounded-xl text-slate-500 text-xs font-medium hover:bg-slate-200/50 hover:border-slate-400 transition-all flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Task
                </button>
              </div>
            );
          })}
        </div>

        {/* Create / Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800 text-base">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Task Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter task title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
                  <textarea
                    rows="3"
                    placeholder="Enter task description details..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none"
                    >
                      {columns.map(c => (
                        <option key={c.key} value={c.key}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Assign Project</label>
                    <select
                      value={formData.projectId}
                      onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none"
                    >
                      <option value="">Select Project</option>
                      {projects.map(p => (
                        <option key={p.id || p._id} value={p.id || p._id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Assign Intern</label>
                    <select
                      value={formData.assigneeId}
                      onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none"
                    >
                      <option value="">Select Intern</option>
                      {interns.map(i => (
                        <option key={i.id || i._id} value={i.id || i._id}>{i.fullName}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm"
                  >
                    {editingTask ? 'Update Task' : 'Save Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TaskManagement;