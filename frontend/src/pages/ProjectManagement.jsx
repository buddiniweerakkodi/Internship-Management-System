import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Search, Bell, Plus, X, Edit3, Eye, Calendar, Save, Folder,
  ChevronLeft, ChevronRight, Code2
} from 'lucide-react';
import Sidebar from '../components/Sidebar'; 

const ProjectManagement = () => {
  const navigate = useNavigate();

  // States
  const [projects, setProjects] = useState([]);
  const [internsList, setInternsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [techFilter, setTechFilter] = useState('All Technologies');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    description: '',
    techStack: [],
    deadline: '',
    assignedInterns: [],
    status: 'In Progress'
  });

  const [techInput, setTechInput] = useState('');

  // Helper function to attach JWT Bearer token
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  // Initial Data Fetching
  useEffect(() => {
    fetchProjects();
    fetchInterns();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/projects', getAuthHeader());
      setProjects(response.data);
    } catch (error) {
      console.error("Projects load failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInterns = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/interns', getAuthHeader());
      setInternsList(response.data);
    } catch (error) {
      console.error("Interns load failed:", error);
    }
  };

  // Tech Stack Handlers
  const handleAddTech = (e) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      if (!formData.techStack.includes(techInput.trim())) {
        setFormData({ ...formData, techStack: [...formData.techStack, techInput.trim()] });
      }
      setTechInput('');
    }
  };

  const handleRemoveTech = (techToRemove) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter(t => t !== techToRemove)
    });
  };

  // Assigned Interns Handlers
  const handleAddIntern = (e) => {
    const selectedId = e.target.value;
    if (selectedId && !formData.assignedInterns.includes(selectedId)) {
      setFormData({
        ...formData,
        assignedInterns: [...formData.assignedInterns, selectedId]
      });
    }
  };

  const handleRemoveIntern = (internId) => {
    setFormData({
      ...formData,
      assignedInterns: formData.assignedInterns.filter(id => id !== internId)
    });
  };

  // Open Modal (Create / Edit)
  const openModal = (project = null) => {
    if (project) {
      setEditingId(project.id || project._id);
      setFormData({
        title: project.title || project.name || '',
        name: project.name || project.title || '',
        description: project.description || '',
        techStack: project.techStack || project.technologies || [],
        deadline: project.deadline || '',
        assignedInterns: project.assignedInterns 
          ? project.assignedInterns.map(i => (typeof i === 'object' ? (i.id || i._id) : i)) 
          : [],
        status: project.status || 'In Progress'
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        name: '',
        description: '',
        techStack: ['Spring Boot', 'React'],
        deadline: '',
        assignedInterns: [],
        status: 'In Progress'
      });
    }
    setIsModalOpen(true);
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      name: formData.title // Compatibility සඳහා name field එකටත් title දානවා
    };

    try {
      if (editingId) {
        await axios.put(`http://localhost:8080/api/v1/projects/${editingId}`, payload, getAuthHeader());
        alert('Project Updated Successfully!');
      } else {
        await axios.post('http://localhost:8080/api/v1/projects', payload, getAuthHeader());
        alert('New Project Saved successfully!');
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (error) {
      console.error("Project save failed:", error);
      alert('Project save failed!');
    }
  };

  // Filter Logic
  const filteredProjects = projects.filter(p => {
    const projectTitle = p.title || p.name || '';
    const matchesSearch = projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Statuses' || p.status === statusFilter;
    const matchesTech = techFilter === 'All Technologies' || p.techStack?.includes(techFilter);
    return matchesSearch && matchesStatus && matchesTech;
  });

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      <Sidebar role="admin" activePage="projects" />

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-y-auto relative">
        {/* Header */}
        <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-800">Projects</h1>
          
          <div className="flex items-center gap-6">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search interns, projects, tasks..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
              />
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

        {/* Content Body */}
        <main className="p-8 space-y-6">
          {/* Controls Bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects by title or keyword..." 
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 focus:outline-none"
              >
                <option>All Statuses</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>On Hold</option>
              </select>
              <select 
                value={techFilter}
                onChange={(e) => setTechFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 focus:outline-none"
              >
                <option>All Technologies</option>
                <option>Spring Boot</option>
                <option>React</option>
                <option>MongoDB</option>
                <option>MySQL</option>
                <option>Flutter</option>
              </select>
            </div>

            <button 
              onClick={() => openModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition shadow-sm"
            >
              <Plus size={16} /> Create New Project
            </button>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <div key={project.id || project._id || index} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                        <Code2 size={20} />
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm leading-tight">{project.title || project.name}</h3>
                    </div>
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                      project.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                      project.status === 'On Hold' ? 'bg-amber-50 text-amber-600' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {project.status || 'In Progress'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">{project.description}</p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(project.techStack || project.technologies || []).map((tech, idx) => (
                      <span key={idx} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Assigned Interns Avatars Dynamically Rendered */}
                  <div className="mb-4">
                    <p className="text-[10px] font-semibold text-slate-400 mb-1.5">Assigned Interns</p>
                    <div className="flex items-center -space-x-2">
                      {project.assignedInterns && project.assignedInterns.length > 0 ? (
                        project.assignedInterns.slice(0, 3).map((intern, i) => {
                          const internObj = typeof intern === 'object' ? intern : internsList.find(item => item.id === intern || item._id === intern);
                          const name = internObj ? internObj.fullName : intern;
                          return (
                            <img 
                              key={i} 
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name || i}`} 
                              title={name || 'Intern'}
                              alt="Avatar" 
                              className="w-7 h-7 rounded-full border-2 border-white bg-slate-100" 
                            />
                          );
                        })
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">No interns assigned</span>
                      )}
                      {project.assignedInterns && project.assignedInterns.length > 3 && (
                        <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold border-2 border-white flex items-center justify-center">
                          +{project.assignedInterns.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Deadline & Progress */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar size={14} />
                      <span>Deadline: {project.deadline || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${project.progress || 0}%` }}></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-600">{project.progress || 0}%</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <button 
                    onClick={() => openModal(project)}
                    className="flex-1 py-1.5 px-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs text-slate-700 font-medium flex items-center justify-center gap-1.5 transition"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => navigate('/admin-tasks')}
                    className="flex-1 py-1.5 px-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs text-blue-600 font-medium flex items-center justify-center gap-1.5 transition"
                  >
                    <Eye size={14} /> View Tasks
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4">
            <p className="text-xs text-slate-500">Showing 1 to {filteredProjects.length} of {filteredProjects.length} projects</p>
            <div className="flex items-center gap-1">
              <button className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50"><ChevronLeft size={16} /></button>
              <button className="w-8 h-8 bg-blue-600 text-white rounded-lg text-xs font-bold">1</button>
              <button className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50"><ChevronRight size={16} /></button>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Popup (Create / Edit Project) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">
                {editingId ? 'Edit Project' : 'Create New Project'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Title</label>
                <div className="relative">
                  <Folder className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    required
                    placeholder="Enter project title" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value, name: e.target.value})}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea 
                  rows={3}
                  placeholder="Enter project description..." 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tech Stack (Press Enter to add)</label>
                <div className="flex flex-wrap gap-1.5 p-2 border border-slate-200 rounded-xl bg-slate-50 focus-within:bg-white focus-within:border-blue-500">
                  {formData.techStack.map((tech, i) => (
                    <span key={i} className="inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-700 text-[11px] px-2 py-0.5 rounded-md font-medium">
                      {tech}
                      <X size={12} className="cursor-pointer text-slate-400 hover:text-red-500" onClick={() => handleRemoveTech(tech)} />
                    </span>
                  ))}
                  <input 
                    type="text" 
                    placeholder="Add tech..." 
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleAddTech}
                    className="bg-transparent text-xs focus:outline-none flex-1 min-w-[80px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Deadline</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="date" 
                      value={formData.deadline}
                      onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 text-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 text-slate-600"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assign Interns</label>
                <select 
                  onChange={handleAddIntern}
                  value=""
                  className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 text-slate-600"
                >
                  <option value="">Select intern to add</option>
                  {internsList.map(intern => (
                    <option key={intern.id || intern._id} value={intern.id || intern._id}>
                      {intern.fullName || intern.name} ({intern.email})
                    </option>
                  ))}
                </select>

                {/* Selected Interns Badges List */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {formData.assignedInterns.map(internId => {
                    const intern = internsList.find(i => (i.id || i._id) === internId);
                    return (
                      <span key={internId} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[11px] px-2 py-0.5 rounded-md font-medium border border-blue-100">
                        {intern ? (intern.fullName || intern.name) : internId}
                        <X size={12} className="cursor-pointer text-blue-400 hover:text-red-500" onClick={() => handleRemoveIntern(internId)} />
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium text-xs rounded-xl transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl flex items-center gap-1.5 transition shadow-sm"
                >
                  <Save size={14} /> Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;