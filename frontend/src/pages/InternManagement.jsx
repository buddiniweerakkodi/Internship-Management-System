import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, Plus, Edit2, ToggleLeft, ToggleRight, MoreVertical, X, Lock, Mail, User as UserIcon, 
  ChevronLeft, ChevronRight, Eye, EyeOff, Bell 
} from 'lucide-react';
import Sidebar from '../components/Sidebar'; 

const InternManagement = () => {
  const [interns, setInterns] = useState([]);
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIntern, setEditingIntern] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    projectId: ''
  });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchInterns();
    fetchProjects();
  }, []);

  const fetchInterns = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/v1/interns', { headers });
      setInterns(res.data);
    } catch (err) {
      console.error("Failed to fetch interns", err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/v1/projects', { headers });
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  const handleOpenModal = (intern = null) => {
    if (intern) {
      setEditingIntern(intern);
      setFormData({
        fullName: intern.fullName || '',
        email: intern.email || '',
        password: '',
        projectId: intern.assignedProjectId || ''
      });
    } else {
      setEditingIntern(null);
      setFormData({ fullName: '', email: '', password: '', projectId: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingIntern) {
        await axios.put(`http://localhost:8080/api/v1/interns/${editingIntern.id}`, formData, { headers });
      } else {
        await axios.post('http://localhost:8080/api/v1/interns', formData, { headers });
      }
      setIsModalOpen(false);
      fetchInterns();
    } catch (err) {
      alert(err.response?.data || "Operation failed!");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await axios.patch(`http://localhost:8080/api/v1/interns/${id}/status`, {}, { headers });
      fetchInterns();
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  // Filtering Logic
  const filteredInterns = interns.filter(intern => {
    const matchesSearch = intern.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          intern.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' ? true : 
                          statusFilter === 'ACTIVE' ? intern.active : !intern.active;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      <Sidebar role="admin" activePage="interns" />

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Intern Management</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search interns, projects, tasks..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
              />
            </div>

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

        {/* Filter Bar & Add Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by intern name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition-all shadow-md shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" /> Add New Intern
          </button>
        </div>

        {/* Table List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Intern Name</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Assigned Project</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredInterns.map((intern) => {
                  const assignedProj = projects.find(p => 
                    (intern.assignedProjectId && (p.id === intern.assignedProjectId || p._id === intern.assignedProjectId)) ||
                    (p.assignedInterns && p.assignedInterns.some(i => (typeof i === 'object' ? (i.id === intern.id || i._id === intern.id) : i === intern.id)))
                  );

                  return (
                    <tr key={intern.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-800 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-xs">
                          {intern.fullName ? intern.fullName.substring(0, 2).toUpperCase() : 'IN'}
                        </div>
                        <span>{intern.fullName}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-500">{intern.email}</td>
                      <td className="py-4 px-6 text-slate-600 font-medium">
                        {assignedProj ? (assignedProj.title || assignedProj.name) : 'Unassigned'}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          intern.active ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
                        }`}>
                          {intern.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-3 text-slate-400">
                          <button onClick={() => handleOpenModal(intern)} className="hover:text-blue-600 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleToggleStatus(intern.id)} className="transition-colors">
                            {intern.active ? (
                              <ToggleRight className="w-6 h-6 text-blue-600" />
                            ) : (
                              <ToggleLeft className="w-6 h-6 text-slate-300" />
                            )}
                          </button>
                          <button className="hover:text-slate-600">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 text-sm text-slate-500">
            <span>Showing 1 to {filteredInterns.length} of {interns.length} interns</span>
            <div className="flex items-center gap-1">
              <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400"><ChevronLeft className="w-4 h-4" /></button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg font-medium text-xs">1</button>
              <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Modal Dialog */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800 text-base">
                  {editingIntern ? 'Edit Intern' : 'Add / Edit Intern'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Enter full name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    {editingIntern ? 'New Password (Optional)' : 'Temporary Password'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required={!editingIntern}
                      placeholder="Enter temporary password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-9 pr-10 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Assign Project</label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700"
                  >
                    <option value="">Select a project</option>
                    {projects.map((p) => (
                      <option key={p.id || p._id} value={p.id || p._id}>
                        {p.title || p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Save Intern
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

export default InternManagement;