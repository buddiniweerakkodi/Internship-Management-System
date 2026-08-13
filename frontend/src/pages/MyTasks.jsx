import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Bell, Calendar, X, Loader2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [submitForm, setSubmitForm] = useState({ repoUrl: '', docUrl: '', notes: '' });

  const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
    fetchTasks(user);
  }, []);

  const fetchTasks = async (user) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/tasks`, getAuthHeaders());
      const myTasks = response.data.filter(t => t.assignedTo?.id === user.id || t.assignedTo === user.id || t.internId === user.id);
      setTasks(myTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/api/v1/tasks/${taskId}`, { status: newStatus }, getAuthHeaders());
      setTasks(tasks.map(t => (t.id === taskId || t._id === taskId) ? { ...t, status: newStatus } : t));
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        taskId: selectedTask.id || selectedTask._id,
        taskTitle: selectedTask.title,
        internId: currentUser.id || currentUser._id,
        ...submitForm,
        status: 'PENDING'
      };
      await axios.post(`${API_BASE_URL}/api/v1/submissions`, payload, getAuthHeaders());
      await handleStatusChange(selectedTask.id || selectedTask._id, 'SUBMITTED');
      
      alert("Work submitted successfully!");
      setSelectedTask(null);
      setSubmitForm({ repoUrl: '', docUrl: '', notes: '' });
    } catch (error) {
      alert("Failed to submit work.");
    }
  };

  const filteredTasks = tasks.filter(t => t.title?.toLowerCase().includes(searchTerm.toLowerCase()));
  const activeTasksCount = tasks.filter(t => t.status !== 'COMPLETED' && t.status !== 'SUBMITTED').length;

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
      <Sidebar role="intern" activePage="tasks" />

      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-800">My Assigned Tasks</h1>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{activeTasksCount} Active Tasks</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" placeholder="Search by task name..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Bell className="text-slate-500 cursor-pointer hover:text-blue-600" size={20} />
            <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.fullName}`} alt="User" className="w-8 h-8 rounded-full bg-blue-100" />
              <div>
                <p className="text-sm font-bold text-slate-800">{currentUser?.fullName || 'Intern User'}</p>
                <p className="text-[11px] text-slate-500">Intern</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8 flex gap-6 h-full">
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-20 text-slate-500">No tasks found.</div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredTasks.map(task => (
                  <div key={task.id || task._id} className={`bg-white p-6 rounded-2xl border shadow-sm flex flex-col justify-between ${selectedTask?.id === task.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200'}`}>
                    <div>
                      <div className="flex gap-2 mb-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${task.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                          {task.priority || 'MEDIUM'}
                        </span>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                          {task.status?.replace('_', ' ') || 'TO DO'}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">{task.title}</h3>
                      <span className="inline-block bg-blue-50 text-blue-600 text-[10px] font-semibold px-2 py-0.5 rounded mb-3">Waste2Worth Platform</span>
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{task.description}</p>
                      
                      {task.status === 'REVISION_REQUIRED' && (
                        <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg mb-4">
                          <p className="text-xs font-bold text-orange-800 mb-1">Supervisor Comment:</p>
                          <p className="text-xs text-orange-700">Please review feedback and resubmit.</p>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                      <div className="text-xs text-slate-500 flex items-center gap-1 font-medium text-red-500">
                        <Calendar size={14} /> Due: {task.dueDate || 'No Deadline'}
                      </div>
                      <div className="flex gap-3">
                        <select 
                          value={task.status || 'TO_DO'}
                          onChange={(e) => handleStatusChange(task.id || task._id, e.target.value)}
                          className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-slate-700 outline-none focus:border-blue-500"
                        >
                          <option value="TO_DO">To Do</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="SUBMITTED">Submitted</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                        <button
                          onClick={() => setSelectedTask(task)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition"
                        >
                          {task.status === 'REVISION_REQUIRED' ? 'Resubmit Work' : 'Submit Work'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Side Panel for Submission */}
          {selectedTask && (
            <div className="w-96 bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col shrink-0 h-fit">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Submit Work</h3>
                <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-slate-700"><X size={20}/></button>
              </div>
              <div className="p-5">
                <h4 className="text-sm font-bold text-slate-800 mb-4">{selectedTask.title}</h4>
                <form onSubmit={handleSubmitTask} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">GitHub Repository URL</label>
                    <input type="url" required className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500" 
                      value={submitForm.repoUrl} onChange={(e) => setSubmitForm({...submitForm, repoUrl: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Documentation / Demo Link</label>
                    <input type="url" className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500" 
                      value={submitForm.docUrl} onChange={(e) => setSubmitForm({...submitForm, docUrl: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Completion Notes</label>
                    <textarea required rows="4" className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500" 
                      value={submitForm.notes} onChange={(e) => setSubmitForm({...submitForm, notes: e.target.value})}></textarea>
                  </div>
                  <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-xs flex gap-2 items-start mt-2 border border-blue-100">
                    <span className="font-bold shrink-0">i</span>
                    <p>Submitting this form will change the task status to SUBMITTED for supervisor review.</p>
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <button type="button" onClick={() => setSelectedTask(null)} className="flex-1 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold text-sm">Cancel</button>
                    <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700">Submit Task</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyTasks;