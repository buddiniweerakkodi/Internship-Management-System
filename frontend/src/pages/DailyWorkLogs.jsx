import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Bell, Clock, Calendar, MessageSquare, AlertCircle, X, Loader2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ProfileModal from '../components/ProfileModal';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const DailyWorkLogs = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogForm, setShowLogForm] = useState(false);
  const [selectedLogForDetails, setSelectedLogForDetails] = useState(null);

  // Search Filter State
  const [searchTerm, setSearchTerm] = useState('');

  // Profile Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Form State
  const [logForm, setLogForm] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    hoursWorked: 8, 
    completedWork: '', 
    challenges: '', 
    nextDayPlan: '' 
  });

  const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

  // --------------------------------------------------------------------------
  // Helper functions
  // --------------------------------------------------------------------------
  const getTasksText = (log) => {
    if (!log) return '';
    if (Array.isArray(log.tasksCompleted)) return log.tasksCompleted.join(', ');
    return log.tasksCompleted || log.completedWork || '';
  };

  const getChallengesText = (log) => {
    if (!log) return '';
    if (Array.isArray(log.challenges)) return log.challenges.join(', ');
    return log.challenges || '';
  };

  const getPlanText = (log) => {
    if (!log) return '';
    if (Array.isArray(log.nextDayPlan)) return log.nextDayPlan.join(', ');
    return log.nextDayPlan || '';
  };

  // Helper function to check if log is reviewed (via status or feedback)
  const isLogReviewed = (log) => {
    if (!log) return false;
    const statusLower = (log.status || '').toLowerCase();
    const hasFeedback = log.feedback && log.feedback.trim() !== '';
    return hasFeedback || statusLower.includes('reviewed') || statusLower.includes('approved');
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
    fetchLogs(user);
  }, []);

  const fetchLogs = async (user) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/daily-logs`, getAuthHeaders());
      const myLogs = response.data.filter(l => l.internId === user.id || l.intern?.id === user.id || l.intern?._id === user.id);
      
      // Sort by date descending
      myLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
      setLogs(myLogs);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitLog = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...logForm, internId: currentUser.id || currentUser._id };
      await axios.post(`${API_BASE_URL}/api/v1/daily-logs`, payload, getAuthHeaders());
      alert("Log submitted successfully!");
      setShowLogForm(false);
      setLogForm({ ...logForm, completedWork: '', challenges: '', nextDayPlan: '' });
      fetchLogs(currentUser);
    } catch (error) {
      console.error("Error submitting log:", error);
      alert("Failed to submit log.");
    }
  };

  // Calculations
  const totalHours = logs.reduce((sum, log) => sum + Number(log.hoursWorked || 0), 0);
  const totalLogs = logs.length;
  const feedbacksReceived = logs.filter(isLogReviewed).length;
  
  const todayStr = new Date().toISOString().split('T')[0];
  const isTodayLogged = logs.some(l => (l.date || '').split('T')[0] === todayStr);

  // Filter logs based on search term
  const filteredLogs = logs.filter(log => 
    (log.date || '').includes(searchTerm) ||
    getTasksText(log).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getChallengesText(log).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getPlanText(log).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
      <Sidebar role="intern" activePage="daily-logs" />

      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-800">Daily Work Logs</h1>
          <div className="flex items-center gap-6">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search logs by date, task..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 transition" 
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

        <main className="p-8 space-y-6">
          {/* Top Stat Cards */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-blue-100 text-blue-600 rounded-xl"><Clock size={24} /></div>
              <div>
                <p className="text-xs font-bold text-slate-500">Total Hours Logged</p>
                <p className="text-2xl font-bold text-slate-800">{totalHours} <span className="text-sm font-medium text-slate-500">Hours</span></p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-emerald-100 text-emerald-600 rounded-xl"><Calendar size={24} /></div>
              <div>
                <p className="text-xs font-bold text-slate-500">Logs Submitted</p>
                <p className="text-2xl font-bold text-slate-800">{totalLogs} <span className="text-sm font-medium text-slate-500">Days</span></p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-4 bg-purple-100 text-purple-600 rounded-xl"><MessageSquare size={24} /></div>
              <div>
                <p className="text-xs font-bold text-slate-500">Supervisor Feedbacks / Reviews</p>
                <p className="text-2xl font-bold text-slate-800">{feedbacksReceived} <span className="text-sm font-medium text-slate-500">Reviewed</span></p>
              </div>
            </div>
          </div>

          {/* Pending Log Banner */}
          {!isTodayLogged && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-600 shrink-0" size={24} />
                <div>
                  <h3 className="text-sm font-bold text-red-800">Today's Work Log is Pending ({todayStr}).</h3>
                  <p className="text-xs text-red-600 mt-0.5">Please record your completed tasks, challenges, and hours worked before 06:00 PM.</p>
                </div>
              </div>
              <button 
                onClick={() => { setSelectedLogForDetails(null); setShowLogForm(true); }} 
                className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-2 rounded-lg transition shadow-sm shrink-0"
              >
                Fill Today's Log Now
              </button>
            </div>
          )}

          {/* Logs Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">My Daily Work Logs History</h3>
              {!showLogForm && (
                <button 
                  onClick={() => { setSelectedLogForDetails(null); setShowLogForm(true); }} 
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
                >
                  + New Log
                </button>
              )}
            </div>
            {isLoading ? (
               <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={30} /></div>
            ) : filteredLogs.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-sm">No work logs found.</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-xs text-slate-500 font-bold border-b border-slate-200">
                    <th className="p-4">Log Date</th>
                    <th className="p-4">Hours</th>
                    <th className="p-4 w-1/3">Tasks Completed</th>
                    <th className="p-4 w-1/3">Challenges / Plan</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {filteredLogs.map(log => (
                    <tr key={log.id || log._id} className="hover:bg-slate-50 transition">
                      <td className="p-4 font-semibold text-slate-800 whitespace-nowrap">{(log.date || '').split('T')[0]}</td>
                      <td className="p-4 text-blue-600 font-bold bg-blue-50/50">{log.hoursWorked}h</td>
                      <td className="p-4 text-slate-600 text-xs truncate max-w-xs">{getTasksText(log)}</td>
                      <td className="p-4 text-slate-600 text-xs truncate max-w-xs">
                        <span className="font-bold text-slate-800">Challenge: </span>{getChallengesText(log) || 'None'}
                      </td>
                      <td className="p-4 text-center">
                        {isLogReviewed(log) ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-1 rounded-full">Reviewed</span>
                        ) : (
                          <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-1 rounded-full">Pending</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => { setShowLogForm(false); setSelectedLogForDetails(log); }} 
                          className="text-xs text-blue-600 font-bold hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      {/* Modern Compact Floating Modal with Custom Scrollbar */}
      {(showLogForm || selectedLogForDetails) && (
        <div 
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex justify-end p-4 md:p-6 transition-all"
          onClick={() => { setShowLogForm(false); setSelectedLogForDetails(null); }}
        >
          <div 
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden max-h-[80vh] my-auto mr-2 animate-in slide-in-from-right"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 px-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/90 sticky top-0 z-10 backdrop-blur-md">
              <h3 className="font-bold text-slate-800 text-base">{showLogForm ? 'Submit Daily Work Log' : 'Log Details'}</h3>
              <button 
                onClick={() => { setShowLogForm(false); setSelectedLogForDetails(null); }} 
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition"
              >
                <X size={18}/>
              </button>
            </div>
            
            {/* Scrollable Content Body */}
            <div className="p-6 flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400">
              {showLogForm ? (
                <form onSubmit={handleSubmitLog} className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                      <input 
                        type="date" 
                        required 
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-500" 
                        value={logForm.date} 
                        onChange={e => setLogForm({ ...logForm, date: e.target.value })} 
                      />
                    </div>
                    <div className="w-1/3">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Hours</label>
                      <input 
                        type="number" 
                        required 
                        min="1" 
                        max="12" 
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-500" 
                        value={logForm.hoursWorked} 
                        onChange={e => setLogForm({ ...logForm, hoursWorked: e.target.value })} 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tasks Completed Today</label>
                    <textarea 
                      required 
                      rows="3" 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-500" 
                      placeholder="Describe tasks..." 
                      value={logForm.completedWork} 
                      onChange={e => setLogForm({ ...logForm, completedWork: e.target.value })}
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Challenges / Blockers</label>
                    <textarea 
                      rows="2" 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-500" 
                      placeholder="Any blockers?..." 
                      value={logForm.challenges} 
                      onChange={e => setLogForm({ ...logForm, challenges: e.target.value })}
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Next Day Plan</label>
                    <textarea 
                      rows="2" 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-blue-500" 
                      placeholder="Outline tomorrow's plan..." 
                      value={logForm.nextDayPlan} 
                      onChange={e => setLogForm({ ...logForm, nextDayPlan: e.target.value })}
                    ></textarea>
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm mt-2 hover:bg-blue-700 transition shadow-sm">Submit Work Log</button>
                </form>
              ) : (
                <div className="space-y-4 text-sm">
                  <div className="flex gap-4">
                     <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex-1">
                        <span className="text-xs text-slate-500 block mb-1">Date</span>
                        <span className="font-bold text-slate-800">{(selectedLogForDetails.date || '').split('T')[0]}</span>
                     </div>
                     <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex-1">
                        <span className="text-xs text-slate-500 block mb-1">Hours</span>
                        <span className="font-bold text-blue-600">{selectedLogForDetails.hoursWorked}h</span>
                     </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 mb-1">Completed Work</h4>
                    <p className="text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed text-xs">{getTasksText(selectedLogForDetails)}</p>
                  </div>
                  {getChallengesText(selectedLogForDetails) && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 mb-1">Challenges / Blockers</h4>
                      <p className="text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed text-xs">{getChallengesText(selectedLogForDetails)}</p>
                    </div>
                  )}
                  {getPlanText(selectedLogForDetails) && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 mb-1">Next Day Plan</h4>
                      <p className="text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed text-xs">{getPlanText(selectedLogForDetails)}</p>
                    </div>
                  )}
                  
                  {/* Supervisor Status/Feedback Section */}
                  {selectedLogForDetails.feedback ? (
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl mt-4">
                      <h4 className="text-xs font-bold text-emerald-800 mb-2 flex items-center gap-2"><MessageSquare size={14}/> Supervisor Feedback</h4>
                      <p className="text-emerald-900 text-xs leading-relaxed">{selectedLogForDetails.feedback}</p>
                    </div>
                  ) : isLogReviewed(selectedLogForDetails) ? (
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-center mt-4">
                      <p className="text-xs text-emerald-700 font-bold">✓ Log Reviewed by Supervisor</p>
                    </div>
                  ) : (
                     <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100 text-center font-bold mt-4">Waiting for supervisor feedback.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profile Edit Modal Integration */}
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

export default DailyWorkLogs;