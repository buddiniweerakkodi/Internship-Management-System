import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Bell, Calendar, X, Loader2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ProfileModal from '../components/ProfileModal';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [submitForm, setSubmitForm] = useState({ repoUrl: '', docUrl: '', notes: '' });

  // Profile Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);

  const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
    fetchTasks(user);
  }, []);

  const fetchTasks = async (user) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/tasks`, getAuthHeaders());
      const allTasks = Array.isArray(response.data) ? response.data : [];

      const userId = user.id || user._id;
      const userName = user.fullName || user.name || '';
      const userEmail = user.email || localStorage.getItem('email') || '';

      const myTasks = allTasks.filter(t => {
        const matchesId = 
          t.assigneeId === userId || 
          t.assignedTo?.id === userId || 
          t.assignedTo?._id === userId || 
          t.assignedTo === userId || 
          t.internId === userId ||
          t.assignedInternId === userId;

        const matchesName = 
          (t.assignedInternName && t.assignedInternName.toLowerCase() === userName.toLowerCase()) ||
          (t.assignedToName && t.assignedToName.toLowerCase() === userName.toLowerCase()) ||
          (t.assignee && t.assignee.toLowerCase() === userName.toLowerCase()) ||
          (t.assignedTo && typeof t.assignedTo === 'string' && t.assignedTo.toLowerCase() === userName.toLowerCase());

        const matchesEmail = 
          t.assignedTo?.email === userEmail || 
          t.assignedInternEmail === userEmail;

        return matchesId || matchesName || matchesEmail;
      });

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
      const userId = currentUser.id || currentUser._id;
      const userName = currentUser.fullName || currentUser.name || 'Intern User';
      const userEmail = currentUser.email || localStorage.getItem('email') || '';

      const payload = {
        taskId: selectedTask.id || selectedTask._id,
        taskTitle: selectedTask.title,
        projectId: selectedTask.projectId || selectedTask.project?.id || selectedTask.project?._id,
        projectTitle: selectedTask.projectTitle || selectedTask.projectName || selectedTask.project?.title || 'Internship System Project',
        
        // Intern Details
        internId: userId,
        internName: userName,
        internEmail: userEmail,
        intern: {
          id: userId,
          _id: userId,
          fullName: userName,
          name: userName,
          email: userEmail
        },

        // URLs & Notes
        repoUrl: submitForm.repoUrl,
        githubUrl: submitForm.repoUrl,
        docUrl: submitForm.docUrl,
        demoUrl: submitForm.docUrl,
        notes: submitForm.notes,
        completionNotes: submitForm.notes,

        status: 'PENDING'
      };

      await axios.post(`${API_BASE_URL}/api/v1/submissions`, payload, getAuthHeaders());
      await handleStatusChange(selectedTask.id || selectedTask._id, 'SUBMITTED');
      
      alert("Work submitted successfully!");
      setSelectedTask(null);
      setSubmitForm({ repoUrl: '', docUrl: '', notes: '' });
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit work.");
    }
  };

  const filteredTasks = tasks.filter(t => t.title?.toLowerCase().includes(searchTerm.toLowerCase()));
  
  const activeTasksCount = tasks.filter(t => {
    const s = (t.status || '').toUpperCase();
    return s !== 'COMPLETED' && s !== 'SUBMITTED' && s !== 'DONE';
  }).length;

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
      <Sidebar role="intern" activePage="tasks" />

      {/* Changed overflow-y-auto to overflow-hidden here */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header - Removed sticky top-0 as it's no longer needed */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-800">My Assigned Tasks</h1>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{activeTasksCount} Active Tasks</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search by task name..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div 
              className="flex items-center gap-3 border-l pl-6 border-slate-200 cursor-pointer hover:opacity-80 transition group"
              onClick={() => setShowProfileModal(true)}
            >
              <img 
                src={currentUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.fullName || 'User'}`} 
                alt="User Profile" 
                className="w-8 h-8 rounded-full bg-blue-100 border border-slate-200 object-cover" 
              />
              <div>
                <p className="text-sm font-bold text-slate-800">{currentUser?.fullName || 'Intern User'}</p>
                <p className="text-[11px] text-blue-600 font-semibold">Intern · Profile</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area - Added flex-1 and overflow-hidden */}
        <main className="p-8 flex gap-6 flex-1 overflow-hidden">
          
          {/* Tasks List - Only this part will scroll now */}
          <div className="flex-1 overflow-y-auto pr-2 pb-8">
            {isLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-20 text-slate-500">No tasks found.</div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredTasks.map(task => {
                  const isHighPriority = (task.priority || '').toUpperCase() === 'HIGH';
                  const taskStatus = (task.status || 'TO_DO').toUpperCase();

                  return (
                    <div key={task.id || task._id} className={`bg-white p-6 rounded-2xl border shadow-sm flex flex-col justify-between ${selectedTask?.id === (task.id || task._id) ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200'}`}>
                      <div>
                        <div className="flex gap-2 mb-3">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${isHighPriority ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                            {task.priority || 'MEDIUM'}
                          </span>
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                            {task.status?.replace('_', ' ') || 'TO DO'}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">{task.title}</h3>
                        
                        <span className="inline-block bg-blue-50 text-blue-600 text-[10px] font-semibold px-2 py-0.5 rounded mb-3">
                          {task.projectTitle || task.projectName || 'Internship System Project'}
                        </span>
                        
                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{task.description}</p>
                        
                        {taskStatus === 'REVISION_REQUIRED' && (
                          <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg mb-4">
                            <p className="text-xs font-bold text-orange-800 mb-1">Supervisor Comment:</p>
                            <p className="text-xs text-orange-700">Please review feedback and resubmit.</p>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                        <div className="text-xs font-medium text-red-500 flex items-center gap-1">
                          <Calendar size={14} /> Due: {task.deadline || task.dueDate || 'No Deadline'}
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
                            {taskStatus === 'REVISION_REQUIRED' ? 'Resubmit Work' : 'Submit Work'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Side Panel for Submission */}
          {selectedTask && (
            <div className="w-96 bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col shrink-0 h-fit max-h-full overflow-y-auto pb-4">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 className="font-bold text-slate-800">Submit Work</h3>
                <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-slate-700"><X size={20}/></button>
              </div>
              <div className="p-5">
                <h4 className="text-sm font-bold text-slate-800 mb-4">{selectedTask.title}</h4>
                <form onSubmit={handleSubmitTask} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">GitHub Repository URL</label>
                    <input 
                      type="url" 
                      required 
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500" 
                      value={submitForm.repoUrl} 
                      onChange={(e) => setSubmitForm({ ...submitForm, repoUrl: e.target.value })} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Documentation / Demo Link</label>
                    <input 
                      type="url" 
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500" 
                      value={submitForm.docUrl} 
                      onChange={(e) => setSubmitForm({ ...submitForm, docUrl: e.target.value })} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Completion Notes</label>
                    <textarea 
                      required 
                      rows="4" 
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500" 
                      value={submitForm.notes} 
                      onChange={(e) => setSubmitForm({ ...submitForm, notes: e.target.value })}
                    ></textarea>
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

      {showProfileModal && (
        <ProfileModal 
          isOpen={showProfileModal} 
          onClose={() => setShowProfileModal(false)} 
          user={currentUser} 
          onUpdate={setCurrentUser} 
        />
      )}
    </div>
  );
};

export default MyTasks;