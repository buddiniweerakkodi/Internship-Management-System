import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Bell, FileText, CheckCircle, Clock, AlertTriangle, Code2, FileCode, X, Loader2, RotateCcw } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ProfileModal from '../components/ProfileModal';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const MySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);

  // Search Filter State
  const [searchTerm, setSearchTerm] = useState('');

  // Profile Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Resubmit Modal & Form State
  const [showResubmitModal, setShowResubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resubmitFormData, setResubmitFormData] = useState({
    githubUrl: '',
    docUrl: '',
    completionNotes: ''
  });

  const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
    fetchSubmissions(user);
  }, []);

  const fetchSubmissions = async (user) => {
    try {
      const userId = user.id || user._id;
      const userName = user.fullName || user.name || '';
      const userEmail = user.email || localStorage.getItem('email') || '';

      // Parallel Requests for Submissions and Tasks
      const [subsRes, tasksRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/api/v1/submissions`, getAuthHeaders()),
        axios.get(`${API_BASE_URL}/api/v1/tasks`, getAuthHeaders())
      ]);

      const allSubs = subsRes.status === 'fulfilled' && Array.isArray(subsRes.value.data) ? subsRes.value.data : [];
      const allTasks = tasksRes.status === 'fulfilled' && Array.isArray(tasksRes.value.data) ? tasksRes.value.data : [];

      // Find user's task IDs
      const myTaskIds = new Set(
        allTasks.filter(t => {
          const matchesId = t.assigneeId === userId || t.assignedTo?.id === userId || t.assignedTo?._id === userId || t.assignedTo === userId || t.internId === userId;
          const matchesName = userName && (
            (t.assignedInternName && t.assignedInternName.toLowerCase() === userName.toLowerCase()) ||
            (t.assignedToName && t.assignedToName.toLowerCase() === userName.toLowerCase()) ||
            (t.assignee && t.assignee.toLowerCase() === userName.toLowerCase())
          );
          // If task has null assignee, keep it as fallback
          const isUnassignedTask = !t.assigneeId && !t.assignedTo && !t.internId;
          return matchesId || matchesName || isUnassignedTask;
        }).map(t => String(t.id || t._id))
      );

      // Filtering for Submissions matching ID, Name, Email, Task ID, OR null intern fallback
      const mySubs = allSubs.filter(s => {
        const subInternId = s.internId || s.intern?.id || s.intern?._id || (typeof s.intern === 'string' ? s.intern : null) || s.userId;
        const matchesId = subInternId && userId && (String(subInternId) === String(userId));

        const matchesName = userName && (
          (s.internName && s.internName.toLowerCase() === userName.toLowerCase()) ||
          (s.intern?.fullName && s.intern.fullName.toLowerCase() === userName.toLowerCase())
        );

        const matchesEmail = userEmail && (
          (s.internEmail && s.internEmail.toLowerCase() === userEmail.toLowerCase()) ||
          (s.intern?.email && s.intern.email.toLowerCase() === userEmail.toLowerCase())
        );

        const matchesTaskId = s.taskId && myTaskIds.has(String(s.taskId));

        const isNullOrUnassigned = !subInternId && !s.internName && !s.internEmail;

        return matchesId || matchesName || matchesEmail || matchesTaskId || isNullOrUnassigned;
      });
      
      mySubs.sort((a, b) => new Date(b.createdAt || b.submittedAt || b.id || 0) - new Date(a.createdAt || a.submittedAt || a.id || 0));
      setSubmissions(mySubs);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Resubmit Modal Open Handler
  const handleOpenResubmit = (sub) => {
    setSelectedSub(sub);
    setResubmitFormData({
      githubUrl: sub.githubUrl || sub.repoUrl || '',
      docUrl: sub.docUrl || sub.demoUrl || '',
      completionNotes: sub.completionNotes || sub.notes || ''
    });
    setShowResubmitModal(true);
  };

  // Submit Resubmitted Work to Backend
  const handleResubmitSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSub) return;

    setIsSubmitting(true);
    try {
      const subId = selectedSub.id || selectedSub._id;
      const payload = {
        ...selectedSub,
        githubUrl: resubmitFormData.githubUrl,
        repoUrl: resubmitFormData.githubUrl,
        docUrl: resubmitFormData.docUrl,
        demoUrl: resubmitFormData.docUrl,
        completionNotes: resubmitFormData.completionNotes,
        notes: resubmitFormData.completionNotes,
        status: 'PENDING'
      };

      await axios.put(`${API_BASE_URL}/api/v1/submissions/${subId}`, payload, getAuthHeaders());
      
      // Auto Refresh after Resubmit
      await fetchSubmissions(currentUser);
      setShowResubmitModal(false);
      setSelectedSub(null);
    } catch (error) {
      console.error("Error resubmitting work:", error);
      // Fallback try POST if PUT fails
      try {
        const subId = selectedSub.id || selectedSub._id;
        await axios.post(`${API_BASE_URL}/api/v1/submissions/${subId}/resubmit`, {
          githubUrl: resubmitFormData.githubUrl,
          docUrl: resubmitFormData.docUrl,
          completionNotes: resubmitFormData.completionNotes,
          status: 'PENDING'
        }, getAuthHeaders());

        await fetchSubmissions(currentUser);
        setShowResubmitModal(false);
        setSelectedSub(null);
      } catch (err2) {
        alert("Failed to resubmit work. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculations with normalized status strings
  const totalSubs = submissions.length;
  const approvedSubs = submissions.filter(s => {
    const st = (s.status || '').toUpperCase();
    return st === 'APPROVED' || st === 'COMPLETED';
  }).length;

  const pendingSubs = submissions.filter(s => {
    const st = (s.status || '').toUpperCase();
    return st === 'PENDING' || st.includes('PENDING') || st === 'SUBMITTED' || st === 'PENDING_REVIEW';
  }).length;

  const revisionSubs = submissions.filter(s => {
    const st = (s.status || '').toUpperCase();
    return st.includes('REVISION') || st === 'REJECTED';
  }).length;

  // Filter submissions by Search Term
  const filteredSubmissions = submissions.filter(s => 
    (s.taskTitle || s.task?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.notes || s.completionNotes || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.status || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
      <Sidebar role="intern" activePage="submissions" />

      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-800">My Submissions & History</h1>
          <div className="flex items-center gap-6">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search submissions..." 
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

        <main className="p-8 flex gap-6">
          <div className="flex-1 space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><FileText size={20}/></div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Total Submissions</p>
                  <p className="text-xl font-bold text-slate-800">{totalSubs}</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><CheckCircle size={20}/></div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Approved</p>
                  <p className="text-xl font-bold text-slate-800">{approvedSubs}</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-lg"><Clock size={20}/></div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Pending Review</p>
                  <p className="text-xl font-bold text-slate-800">{pendingSubs}</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-red-100 text-red-600 rounded-lg"><AlertTriangle size={20}/></div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Revision Needed</p>
                  <p className="text-xl font-bold text-slate-800">{revisionSubs}</p>
                </div>
              </div>
            </div>

            {/* Submissions Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {isLoading ? (
                 <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={30} /></div>
              ) : filteredSubmissions.length === 0 ? (
                <div className="p-10 text-center text-slate-400 text-sm">No submissions found.</div>
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
                    {filteredSubmissions.map(sub => {
                      const st = (sub.status || '').toUpperCase();
                      const isApproved = st === 'APPROVED' || st === 'COMPLETED';
                      const isRevision = st.includes('REVISION') || st === 'REJECTED';

                      return (
                        <tr key={sub.id || sub._id} className="hover:bg-slate-50 transition">
                          <td className="p-4">
                            <p className="font-bold text-slate-800">{sub.taskTitle || sub.task?.title || 'Unknown Task'}</p>
                            <span className="text-[10px] bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded mt-1 inline-block">
                              {sub.projectTitle || sub.project?.name || 'Internship System Project'}
                            </span>
                          </td>
                          <td className="p-4 flex gap-2">
                            {(sub.repoUrl || sub.githubUrl) && (
                              <a href={sub.repoUrl || sub.githubUrl} target="_blank" rel="noreferrer" title="Repository URL" className="p-1.5 bg-slate-100 rounded text-slate-600 hover:text-black hover:bg-slate-200 transition">
                                <Code2 size={16}/>
                              </a>
                            )}
                            {(sub.docUrl || sub.demoUrl) && (
                              <a href={sub.docUrl || sub.demoUrl} target="_blank" rel="noreferrer" title="Documentation URL" className="p-1.5 bg-blue-50 rounded text-blue-600 hover:text-blue-800 hover:bg-blue-100 transition">
                                <FileCode size={16}/>
                              </a>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                              isApproved ? 'bg-emerald-100 text-emerald-700' : 
                              isRevision ? 'bg-amber-100 text-amber-700 font-bold' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {sub.status?.replace('_', ' ') || 'PENDING'}
                            </span>
                          </td>
                          <td className="p-4 text-xs text-slate-600 truncate max-w-xs">{sub.feedback || 'Waiting for review...'}</td>
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => setSelectedSub(sub)} 
                              className="text-xs border border-blue-200 text-blue-600 font-bold px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Right Panel: Submission Details */}
          {selectedSub && (
            <div className="w-96 bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col shrink-0 h-fit sticky top-24">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
                <h3 className="font-bold text-slate-800 text-sm truncate pr-4">Details: {selectedSub.taskTitle || 'Task'}</h3>
                <button onClick={() => setSelectedSub(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200 transition"><X size={20}/></button>
              </div>
              <div className="p-5 space-y-5 text-sm">
                {(selectedSub.repoUrl || selectedSub.githubUrl) && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 mb-1">GitHub Repository</h4>
                    <a href={selectedSub.repoUrl || selectedSub.githubUrl} target="_blank" rel="noreferrer" className="text-blue-600 text-xs break-all hover:underline">{selectedSub.repoUrl || selectedSub.githubUrl}</a>
                  </div>
                )}
                {(selectedSub.docUrl || selectedSub.demoUrl) && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 mb-1">Documentation Link</h4>
                    <a href={selectedSub.docUrl || selectedSub.demoUrl} target="_blank" rel="noreferrer" className="text-blue-600 text-xs break-all hover:underline">{selectedSub.docUrl || selectedSub.demoUrl}</a>
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-slate-500 mb-1">Completion Notes</h4>
                  <p className="text-slate-700 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">{selectedSub.notes || selectedSub.completionNotes || 'No completion notes provided.'}</p>
                </div>

                <div className={`mt-6 p-4 rounded-xl border ${(selectedSub.status || '').toUpperCase() === 'APPROVED' ? 'bg-emerald-50 border-emerald-200' : (selectedSub.status || '').toUpperCase().includes('REVISION') ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
                  <h4 className="text-xs font-bold mb-3 flex items-center justify-between">
                    <span className="text-slate-800">Supervisor Review</span>
                    <span className="bg-white px-2 py-0.5 rounded shadow-sm text-[10px] font-bold">{selectedSub.status || 'PENDING'}</span>
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">{selectedSub.feedback || 'The supervisor has not reviewed this submission yet. You will be notified once feedback is provided.'}</p>
                </div>

                {/* Resubmit Work Button when Revision Requested */}
                {((selectedSub.status || '').toUpperCase().includes('REVISION') || (selectedSub.status || '').toUpperCase() === 'REJECTED') && (
                  <button
                    onClick={() => handleOpenResubmit(selectedSub)}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={14} /> Resubmit Work
                  </button>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Resubmit Work Modal */}
      {showResubmitModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">Resubmit Work</h3>
              <button onClick={() => setShowResubmitModal(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200 transition">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleResubmitSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">GitHub Repository URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/username/repo"
                  value={resubmitFormData.githubUrl}
                  onChange={(e) => setResubmitFormData({ ...resubmitFormData, githubUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Documentation / Demo Link</label>
                <input
                  type="url"
                  placeholder="https://postman.com/... or live demo link"
                  value={resubmitFormData.docUrl}
                  onChange={(e) => setResubmitFormData({ ...resubmitFormData, docUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Completion Notes</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe the changes made according to supervisor feedback..."
                  value={resubmitFormData.completionNotes}
                  onChange={(e) => setResubmitFormData({ ...resubmitFormData, completionNotes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 transition resize-none"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResubmitModal(false)}
                  className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : 'Submit Revision'}
                </button>
              </div>
            </form>
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

export default MySubmissions;