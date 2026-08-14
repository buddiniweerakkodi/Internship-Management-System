import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Calendar, Code2, Users, CheckCircle2, 
  Clock, Shield, User as UserIcon, AlertCircle 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const ProjectDetails = () => {
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchAssignedProject();
  }, []);

  const fetchAssignedProject = async () => {
    try {
      setLoading(true);
      
      const internRes = await axios.get('http://localhost:8080/api/v1/interns', { headers });
      const projectsRes = await axios.get('http://localhost:8080/api/v1/projects', { headers });

      const allInterns = internRes.data;
      const allProjects = projectsRes.data;

      const loggedUser = JSON.parse(localStorage.getItem('user')) || {};
      const currentIntern = allInterns.find(i => 
        i.email === loggedUser.email || i.id === loggedUser.id || i._id === loggedUser.id
      ) || allInterns[0]; 

      if (!currentIntern) {
        setError('Intern profile not found.');
        setLoading(false);
        return;
      }

      const assignedProj = allProjects.find(p => 
        (currentIntern.assignedProjectId && (p.id === currentIntern.assignedProjectId || p._id === currentIntern.assignedProjectId)) ||
        (p.assignedInterns && p.assignedInterns.some(i => (typeof i === 'object' ? (i.id === currentIntern.id || i._id === currentIntern.id) : i === currentIntern.id)))
      );

      if (assignedProj) {
        setProject(assignedProj);

        const projectInterns = allInterns.filter(i => 
          (assignedProj.assignedInterns && assignedProj.assignedInterns.some(pIntern => 
            (typeof pIntern === 'object' ? (pIntern.id === i.id || pIntern._id === i.id) : pIntern === i.id)
          )) || i.assignedProjectId === assignedProj.id || i.assignedProjectId === assignedProj._id
        );
        setTeamMembers(projectInterns);
      } else {
        setError('No project assigned to your account yet.');
      }
    } catch (err) {
      console.error("Failed to fetch project details", err);
      setError('Failed to load project details.');
    } finally {
      setLoading(false);
    }
  };

  const loggedUser = JSON.parse(localStorage.getItem('user')) || { fullName: 'Kasun Perera' };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar for Intern */}
      <Sidebar role="intern" activePage="dashboard" />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/intern-dashboard')}
              className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-500 hover:text-slate-800 flex items-center gap-2 text-sm font-medium"
            >
              <ArrowLeft size={18} />
              <span>Project Overview</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-xs">
              {loggedUser.fullName ? loggedUser.fullName.substring(0, 2).toUpperCase() : 'IN'}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">{loggedUser.fullName || 'Kasun Perera'}</p>
              <p className="text-[10px] text-slate-400">View Profile</p>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-8 max-w-6xl mx-auto space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
              Loading project details...
            </div>
          ) : error || !project ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center text-amber-700">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-amber-500" />
              <p className="font-semibold text-sm">{error || "No active project assigned."}</p>
              <button 
                onClick={() => navigate('/intern-dashboard')}
                className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-medium"
              >
                Return to Dashboard
              </button>
            </div>
          ) : (
            <>
              {/* Project Main Banner Card */}
              <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 font-bold text-[10px] rounded-full uppercase tracking-wider">
                    {project.status || 'Active Project'}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar size={14} /> Deadline: {project.deadline || 'N/A'}
                  </span>
                </div>

                <h1 className="text-2xl font-bold text-slate-800 mb-2">
                  {project.title || project.name}
                </h1>

                <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                  {project.description || 'No description provided for this project.'}
                </p>
              </div>

              {/* Grid Layout for Tech Stack & Team */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Tech Stack & Progress (2 Columns) */}
                <div className="md:col-span-2 space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Code2 size={16} className="text-blue-600" />
                      Project Requirements & Tech Stack
                    </h3>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {(project.techStack || project.technologies || ['Spring Boot', 'React', 'MongoDB']).map((tech, idx) => (
                        <span 
                          key={idx} 
                          className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                      <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
                        <span>Overall Progress</span>
                        <span>{project.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assigned Team Members (1 Column) */}
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Users size={16} className="text-blue-600" />
                      Assigned Team
                    </h3>

                    <div className="space-y-3">
                      {/* Supervisor */}
                      <div className="flex items-center gap-3 p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                          AU
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">Admin User</p>
                          <p className="text-[10px] text-emerald-600 font-medium">Project Supervisor</p>
                        </div>
                      </div>

                      {/* Interns List */}
                      {teamMembers.length > 0 ? (
                        teamMembers.map((member) => (
                          <div key={member.id || member._id} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                              {member.fullName ? member.fullName.substring(0, 2).toUpperCase() : 'IN'}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800">{member.fullName}</p>
                              <p className="text-[10px] text-slate-500">Intern Developer</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                            {loggedUser.fullName ? loggedUser.fullName.substring(0, 2).toUpperCase() : 'KP'}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{loggedUser.fullName || 'Kasun Perera'}</p>
                            <p className="text-[10px] text-slate-500">Intern Developer</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;