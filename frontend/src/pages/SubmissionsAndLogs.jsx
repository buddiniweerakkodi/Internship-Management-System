import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, RefreshCw, X, FileText, 
  CheckCircle2, AlertCircle, Loader2, Calendar, Clock, CheckSquare, HelpCircle
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const SubmissionsAndLogs = () => {
  const [activeTab, setActiveTab] = useState('submissions');
  const [submissions, setSubmissions] = useState([]);
  const [dailyLogs, setDailyLogs] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [feedback, setFeedback] = useState('');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [submissionsRes, logsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/v1/submissions`, getAuthHeaders()),
        axios.get(`${API_BASE_URL}/api/v1/daily-logs`, getAuthHeaders())
      ]);

      setSubmissions(submissionsRes.data || []);
      setDailyLogs(logsRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateSubmissionStatus = async (status) => {
    if (!selectedSubmission) return;
    const submissionId = selectedSubmission.id || selectedSubmission._id;

    try {
      await axios.patch(`${API_BASE_URL}/api/v1/submissions/${submissionId}/status`, {
        status: status,
        feedback: feedback
      }, getAuthHeaders());

      alert(`Submission marked as ${status} successfully!`);
      setSelectedSubmission(null);
      setFeedback('');
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  const handleUpdateLogStatus = async (status) => {
    if (!selectedLog) return;
    const logId = selectedLog.id || selectedLog._id;

    try {
      await axios.patch(`${API_BASE_URL}/api/v1/daily-logs/${logId}/status`, {
        status: status
      }, getAuthHeaders());

      alert(`Log marked as ${status} successfully!`);
      setSelectedLog(null);
      fetchData();
    } catch (error) {
      console.error("Error updating log status:", error);
      alert("Failed to update log status.");
    }
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('approved') || s.includes('completed') || s.includes('reviewed')) {
      return <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-emerald-200">{status}</span>;
    }
    if (s.includes('revision') || s.includes('rejected')) {
      return <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-amber-200">{status}</span>;
    }
    return <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-1 rounded-md border border-yellow-200">{status || 'Pending'}</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const filteredSubmissions = submissions.filter(sub => {
    const internName = sub.intern?.fullName || sub.internName || '';
    const matchesSearch = 
      (sub.taskTitle || sub.task?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      internName.toLowerCase().includes(searchTerm.toLowerCase());

    const subStatus = (sub.status || '').toLowerCase();
    const filterStatus = selectedStatus.toLowerCase();

    let matchesStatus = selectedStatus === 'ALL';
    if (filterStatus === 'pending review' || filterStatus === 'pending') {
      matchesStatus = subStatus.includes('pending');
    } else if (filterStatus === 'approved') {
      matchesStatus = subStatus.includes('approved');
    } else if (filterStatus === 'revision requested') {
      matchesStatus = subStatus.includes('revision');
    }

    return matchesSearch && matchesStatus;
  });

  const filteredLogs = dailyLogs.filter(log => {
    const internName = log.intern?.fullName || log.internName || '';
    const matchesSearch = internName.toLowerCase().includes(searchTerm.toLowerCase());
    const logStatus = (log.status || '').toLowerCase();
    const filterStatus = selectedStatus.toLowerCase();

    let matchesStatus = selectedStatus === 'ALL';
    if (filterStatus === 'pending review' || filterStatus === 'pending') {
      matchesStatus = logStatus.includes('pending');
    } else if (filterStatus === 'reviewed' || filterStatus === 'approved') {
      matchesStatus = logStatus.includes('reviewed') || logStatus.includes('approved');
    }

    return matchesSearch && matchesStatus;
  });

  // Calculate pending counts dynamically
  const pendingSubmissionsCount = submissions.filter(s => (s.status || '').toLowerCase().includes('pending')).length;
  const pendingLogsCount = dailyLogs.filter(l => (l.status || '').toLowerCase().includes('pending')).length;

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar role="admin" activePage="logs" />

      <div className="flex-1 bg-slate-50 min-h-screen p-6 font-sans overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Submissions & Daily Logs</h1>
          <div className="flex space-x-6 border-b border-slate-200">
            <button 
              onClick={() => { setActiveTab('submissions'); setSelectedLog(null); }}
              className={`pb-3 font-medium text-sm flex items-center space-x-2 transition-all ${
                activeTab === 'submissions' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span>Task Submissions</span>
              <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                {pendingSubmissionsCount} Pending
              </span>
            </button>
            <button 
              onClick={() => { setActiveTab('logs'); setSelectedSubmission(null); }}
              className={`pb-3 font-medium text-sm flex items-center space-x-2 transition-all ${
                activeTab === 'logs' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span>Daily Work Logs</span>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                {dailyLogs.length} Total ({pendingLogsCount} Pending)
              </span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by intern name, task, or keyword..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 shadow-sm focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Approved">Approved / Reviewed</option>
            <option value="Revision Requested">Revision Requested</option>
          </select>

          <button onClick={fetchData} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 shadow-sm">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={selectedSubmission || selectedLog ? "lg:col-span-2" : "lg:col-span-3"}>
            
            {isLoading ? (
              <div className="flex items-center justify-center p-12 bg-white rounded-xl border border-slate-200">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-3 text-slate-500">Loading data...</span>
              </div>
            ) : (
              <>
                {/* Task Submissions Table */}
                {activeTab === 'submissions' && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100">
                      <h2 className="font-semibold text-slate-800">Task Submissions</h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-xs uppercase font-medium text-slate-500 border-b border-slate-100">
                          <tr>
                            <th className="py-3 px-4">Intern Name</th>
                            <th className="py-3 px-4">Task & Project</th>
                            <th className="py-3 px-4">Submitted Links</th>
                            <th className="py-3 px-4">Submitted Date</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredSubmissions.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-6 text-slate-400">No submissions found.</td></tr>
                          ) : filteredSubmissions.map((sub) => (
                            <tr key={sub.id || sub._id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-3 px-4 flex items-center space-x-3">
                                <img src={sub.intern?.avatar || "https://ui-avatars.com/api/?name=" + (sub.intern?.fullName || sub.internName || 'Intern')} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                                <div>
                                  <p className="font-medium text-slate-800 text-xs">{sub.intern?.fullName || sub.internName || 'Kasun Perera'}</p>
                                  <p className="text-[10px] text-slate-400">{sub.intern?.role || 'Intern'}</p>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <p className="font-medium text-slate-800 text-xs truncate max-w-[150px]">{sub.taskTitle || sub.task?.title}</p>
                                <span className="text-[10px] bg-blue-50 text-blue-600 font-medium px-2 py-0.5 rounded truncate max-w-[150px] inline-block">
                                  {sub.project?.name || 'Internship Project'}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-1.5">
                                  {sub.githubUrl && (
                                    <a href={sub.githubUrl} target="_blank" rel="noreferrer" className="flex items-center space-x-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded border border-slate-200">
                                      <GithubIcon className="w-3.5 h-3.5" />
                                      <span>GitHub</span>
                                    </a>
                                  )}
                                  {sub.docUrl && (
                                    <a href={sub.docUrl} target="_blank" rel="noreferrer" className="flex items-center space-x-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded border border-slate-200">
                                      <FileText className="w-3.5 h-3.5 text-blue-500" />
                                      <span>Doc</span>
                                    </a>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-xs text-slate-500">{formatDate(sub.submittedAt || sub.createdAt)}</td>
                              <td className="py-3 px-4">{getStatusBadge(sub.status || 'Pending Review')}</td>
                              <td className="py-3 px-4">
                                <button 
                                  onClick={() => setSelectedSubmission(sub)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                                >
                                  Review
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Daily Work Logs Table */}
                {activeTab === 'logs' && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100">
                      <h2 className="font-semibold text-slate-800">Daily Work Logs</h2>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-xs uppercase font-medium text-slate-500 border-b border-slate-100">
                          <tr>
                            <th className="py-3 px-4">Intern & Date</th>
                            <th className="py-3 px-4">Hours</th>
                            <th className="py-3 px-4">Tasks Completed</th>
                            <th className="py-3 px-4">Next Day Plan</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {filteredLogs.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-6 text-slate-400">No logs found.</td></tr>
                          ) : filteredLogs.map((log) => (
                            <tr key={log.id || log._id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-2.5">
                                  <img src={log.intern?.avatar || "https://ui-avatars.com/api/?name=" + (log.intern?.fullName || log.internName || 'Intern')} alt="avatar" className="w-7 h-7 rounded-full object-cover" />
                                  <div>
                                    <p className="font-medium text-slate-800">{log.intern?.fullName || log.internName || 'Kasun Perera'}</p>
                                    <p className="text-[10px] text-slate-400">{formatDate(log.date || log.createdAt)}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="bg-blue-50 text-blue-700 font-bold px-2 py-1 rounded text-center min-w-[40px]">
                                  {log.hoursWorked || '0'}h
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                                  {(log.tasksCompleted || []).map((item, idx) => <li key={idx} className="truncate max-w-[200px]">{item}</li>)}
                                </ul>
                              </td>
                              <td className="py-3 px-4">
                                <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                                  {(log.nextDayPlan || []).map((item, idx) => <li key={idx} className="truncate max-w-[200px]">{item}</li>)}
                                </ul>
                              </td>
                              <td className="py-3 px-4">{getStatusBadge(log.status || 'Pending')}</td>
                              <td className="py-3 px-4">
                                <button 
                                  onClick={() => setSelectedLog(log)}
                                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs px-3 py-1.5 rounded-lg border border-slate-200 transition-colors whitespace-nowrap"
                                >
                                  View Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Side Drawer - Submission Review */}
          {selectedSubmission && activeTab === 'submissions' && (
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5 h-fit sticky top-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h2 className="font-bold text-slate-800 text-lg">Review Task Submission</h2>
                <button 
                  onClick={() => setSelectedSubmission(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-start space-x-3 bg-slate-50 p-3 rounded-lg mb-5 border border-slate-100">
                <img src={selectedSubmission.intern?.avatar || "https://ui-avatars.com/api/?name=" + (selectedSubmission.intern?.fullName || selectedSubmission.internName || 'Intern')} alt="intern" className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-slate-800 text-sm">{selectedSubmission.intern?.fullName || selectedSubmission.internName || "Kasun Perera"}</p>
                    <span className="text-slate-400">{selectedSubmission.intern?.role || "Intern"}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-slate-600 pt-1">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Task Title</span>
                      <p className="font-medium text-slate-700 truncate">{selectedSubmission.taskTitle || selectedSubmission.task?.title || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Project</span>
                      <p className="font-medium text-slate-700 truncate">{selectedSubmission.project?.name || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Submitted On</span>
                      <p className="font-medium text-slate-700 truncate">{formatDate(selectedSubmission.submittedAt || selectedSubmission.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-xs mb-6">
                <h3 className="font-semibold text-slate-800">Submitted Content</h3>

                <div>
                  <p className="text-slate-500 mb-1.5 font-medium">Repository / Work Links</p>
                  <div className="space-y-1.5">
                    {selectedSubmission.githubUrl ? (
                      <a href={selectedSubmission.githubUrl} target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-blue-600 hover:underline">
                        <GithubIcon className="w-4 h-4 text-slate-700" />
                        <span className="truncate">{selectedSubmission.githubUrl}</span>
                      </a>
                    ) : <span className="text-slate-400 italic">No GitHub URL provided</span>}
                    
                    {selectedSubmission.docUrl && (
                      <a href={selectedSubmission.docUrl} target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-blue-600 hover:underline">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span className="truncate">{selectedSubmission.docUrl}</span>
                      </a>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-slate-500 mb-1.5 font-medium">Completion Notes</p>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700 leading-relaxed max-h-32 overflow-y-auto">
                    {selectedSubmission.completionNotes || selectedSubmission.description || "No completion notes provided."}
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs mb-6">
                <h3 className="font-semibold text-slate-800">Supervisor Feedback</h3>
                <textarea 
                  rows="4" 
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Write feedback, approval notes, or revision instructions here..."
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-700 resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                  onClick={() => handleUpdateSubmissionStatus('Revision Requested')}
                  className="flex items-center justify-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-white font-medium py-2.5 px-3 rounded-lg text-xs shadow-sm transition-colors"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Request Revision</span>
                </button>
                <button 
                  onClick={() => handleUpdateSubmissionStatus('Approved')}
                  className="flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-3 rounded-lg text-xs shadow-sm transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Complete</span>
                </button>
              </div>
            </div>
          )}

          {/* Right Side Drawer - Daily Log Details */}
          {selectedLog && activeTab === 'logs' && (
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5 h-fit sticky top-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h2 className="font-bold text-slate-800 text-lg">Daily Work Log Details</h2>
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-lg mb-5 border border-slate-100">
                <img src={selectedLog.intern?.avatar || "https://ui-avatars.com/api/?name=" + (selectedLog.intern?.fullName || selectedLog.internName || 'Intern')} alt="intern" className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 text-xs">
                  <p className="font-semibold text-slate-800 text-sm">{selectedLog.intern?.fullName || selectedLog.internName || "Kasun Perera"}</p>
                  <p className="text-slate-400">{selectedLog.intern?.role || "Intern"}</p>
                  <div className="flex items-center space-x-3 text-slate-500 mt-1">
                    <span className="flex items-center space-x-1"><Calendar className="w-3 h-3" /> <span>{formatDate(selectedLog.date || selectedLog.createdAt)}</span></span>
                    <span className="flex items-center space-x-1 font-semibold text-blue-600"><Clock className="w-3 h-3" /> <span>{selectedLog.hoursWorked} Hours</span></span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-xs mb-6">
                <div>
                  <h4 className="font-semibold text-slate-800 flex items-center space-x-1.5 mb-2">
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                    <span>Tasks Completed</span>
                  </h4>
                  <ul className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5 text-slate-700">
                    {(selectedLog.tasksCompleted || []).map((task, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 flex items-center space-x-1.5 mb-2">
                    <HelpCircle className="w-4 h-4 text-amber-500" />
                    <span>Challenges Faced</span>
                  </h4>
                  <ul className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5 text-slate-700">
                    {(selectedLog.challenges || []).length > 0 ? (
                      selectedLog.challenges.map((challenge, i) => (
                        <li key={i} className="flex items-start space-x-1.5">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{challenge}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-400 italic">No challenges reported.</li>
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 flex items-center space-x-1.5 mb-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>Next Day Plan</span>
                  </h4>
                  <ul className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5 text-slate-700">
                    {(selectedLog.nextDayPlan || []).map((plan, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-blue-500 font-bold">•</span>
                        <span>{plan}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => handleUpdateLogStatus('Reviewed')}
                  className="w-full flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-3 rounded-lg text-xs shadow-sm transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Log as Reviewed</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SubmissionsAndLogs;