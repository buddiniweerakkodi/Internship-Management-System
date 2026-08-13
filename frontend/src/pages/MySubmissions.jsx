import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Bell, FileText, CheckCircle, Clock, AlertTriangle, Code2, FileCode, X, Loader2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const MySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);

  const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
    fetchSubmissions(user);
  }, []);

  const fetchSubmissions = async (user) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/submissions`, getAuthHeaders());
      const mySubs = response.data.filter(s => s.internId === user.id || s.intern?.id === user.id);
      
      mySubs.sort((a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id));
      setSubmissions(mySubs);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalSubs = submissions.length;
  const approvedSubs = submissions.filter(s => s.status === 'APPROVED').length;
  const pendingSubs = submissions.filter(s => s.status === 'PENDING').length;
  const revisionSubs = submissions.filter(s => s.status === 'REVISION_REQUIRED').length;

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
      <Sidebar role="intern" activePage="submissions" />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-800">My Submissions & History</h1>
          <div className="flex items-center gap-6">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Search submissions..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" />
            </div>
            <Bell className="text-slate-500" size={20} />
            <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.fullName}`} alt="User" className="w-8 h-8 rounded-full bg-blue-100" />
              <div><p className="text-sm font-bold text-slate-800">{currentUser?.fullName}</p></div>
            </div>
          </div>
        </header>

        <main className="p-8 flex gap-6">
          <div className="flex-1 space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><FileText size={20}/></div>
                <div><p className="text-[11px] font-bold text-slate-500 uppercase">Total Submissions</p><p className="text-xl font-bold text-slate-800">{totalSubs}</p></div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><CheckCircle size={20}/></div>
                <div><p className="text-[11px] font-bold text-slate-500 uppercase">Approved</p><p className="text-xl font-bold text-slate-800">{approvedSubs}</p></div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-lg"><Clock size={20}/></div>
                <div><p className="text-[11px] font-bold text-slate-500 uppercase">Pending Review</p><p className="text-xl font-bold text-slate-800">{pendingSubs}</p></div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-red-100 text-red-600 rounded-lg"><AlertTriangle size={20}/></div>
                <div><p className="text-[11px] font-bold text-slate-500 uppercase">Revision Needed</p><p className="text-xl font-bold text-slate-800">{revisionSubs}</p></div>
              </div>
            </div>

            {/* Submissions Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {isLoading ? (
                 <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={30} /></div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-xs text-slate-500 font-bold border-b border-slate-200">
                      <th className="p-4">Task & Project</th>
                      <th className="p-4">Links</th>
                      <th className="p-4">Review Status</th>
                      <th className="p-4 w-1/3">Supervisor Feedback</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-100">
                    {submissions.map(sub => (
                      <tr key={sub.id || sub._id} className="hover:bg-slate-50 transition">
                        <td className="p-4">
                          <p className="font-bold text-slate-800">{sub.taskTitle || sub.task?.title || 'Unknown Task'}</p>
                          <span className="text-[10px] bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded mt-1 inline-block">Waste2Worth Platform</span>
                        </td>
                        <td className="p-4 flex gap-2">
                          {sub.repoUrl && <a href={sub.repoUrl} target="_blank" rel="noreferrer" className="p-1.5 bg-slate-100 rounded text-slate-600 hover:text-black"><Code2 size={16}/></a>}
                          {sub.docUrl && <a href={sub.docUrl} target="_blank" rel="noreferrer" className="p-1.5 bg-blue-50 rounded text-blue-600 hover:text-blue-800"><FileCode size={16}/></a>}
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            sub.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 
                            sub.status === 'REVISION_REQUIRED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {sub.status?.replace('_', ' ') || 'PENDING'}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-slate-600 truncate max-w-xs">{sub.feedback || 'Waiting for review...'}</td>
                        <td className="p-4 text-center">
                          <button onClick={() => setSelectedSub(sub)} className="text-xs border border-blue-200 text-blue-600 font-bold px-3 py-1.5 rounded-lg hover:bg-blue-50">View Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Right Panel: Submission Details */}
          {selectedSub && (
            <div className="w-96 bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col shrink-0 h-fit">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
                <h3 className="font-bold text-slate-800 text-sm truncate pr-4">Details: {selectedSub.taskTitle || 'Task'}</h3>
                <button onClick={() => setSelectedSub(null)} className="text-slate-400 hover:text-slate-700"><X size={20}/></button>
              </div>
              <div className="p-5 space-y-5 text-sm">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 mb-1">GitHub Repository</h4>
                  <a href={selectedSub.repoUrl} target="_blank" rel="noreferrer" className="text-blue-600 text-xs break-all hover:underline">{selectedSub.repoUrl}</a>
                </div>
                {selectedSub.docUrl && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 mb-1">Documentation Link</h4>
                    <a href={selectedSub.docUrl} target="_blank" rel="noreferrer" className="text-blue-600 text-xs break-all hover:underline">{selectedSub.docUrl}</a>
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-slate-500 mb-1">Completion Notes</h4>
                  <p className="text-slate-700 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">{selectedSub.notes}</p>
                </div>

                <div className={`mt-6 p-4 rounded-xl border ${selectedSub.status === 'APPROVED' ? 'bg-emerald-50 border-emerald-200' : selectedSub.status === 'REVISION_REQUIRED' ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                  <h4 className="text-xs font-bold mb-3 flex items-center justify-between">
                    <span className="text-slate-800">Supervisor Review</span>
                    <span className="bg-white px-2 py-0.5 rounded shadow-sm">{selectedSub.status || 'PENDING'}</span>
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">{selectedSub.feedback || 'The supervisor has not reviewed this submission yet. You will be notified once feedback is provided.'}</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MySubmissions;