import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, FolderKanban, ClipboardList, FileCheck, LogOut,
  BarChart2, ClipboardCheck, Edit3, FileText, Hexagon, GraduationCap
} from 'lucide-react';

const Sidebar = ({ role, activePage }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const adminLinks = [
    { id: 'dashboard', name: 'Dashboard', path: '/admin-dashboard', icon: LayoutDashboard },
    { id: 'interns', name: 'Interns', path: '/admin-interns', icon: Users },
    { id: 'projects', name: 'Projects', path: '/admin-projects', icon: FolderKanban },
    { id: 'tasks', name: 'Tasks (Kanban)', path: '/admin-tasks', icon: ClipboardList },
    { id: 'logs', name: 'Submissions & Logs', path: '/admin-logs', icon: FileCheck }
  ];

  const internLinks = [
    { id: 'dashboard', name: 'Dashboard', path: '/intern-dashboard', icon: BarChart2 },
    { id: 'tasks', name: 'My Tasks', path: '/intern-tasks', icon: ClipboardCheck },
    { id: 'daily-logs', name: 'Daily Work Logs', path: '/intern-daily-logs', icon: Edit3 },
    { id: 'submissions', name: 'My Submissions', path: '/intern-submissions', icon: FileText }
  ];

  const navLinks = role === 'admin' ? adminLinks : internLinks;

  return (
    <aside className="w-64 bg-[#0a1128] text-slate-300 flex flex-col justify-between p-4 shrink-0 h-screen border-r border-slate-800">
      <div>
        {/* Brand Logo & Name Section */}
        <div className="flex items-center gap-3 px-2 py-4 mb-8">
          <div className="relative flex items-center justify-center">
            <Hexagon size={40} className="text-blue-600 fill-blue-600 drop-shadow-md" />
            <GraduationCap size={22} className="absolute text-white" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight">
            <span className="text-white">Intern</span>
            <span className="text-blue-500">Track</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activePage === link.id;
            return (
              <button 
                key={link.id}
                onClick={() => navigate(link.path)} 
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon size={18} className={isActive ? "text-white" : "text-slate-400"} /> 
                {link.name}
              </button>
            );
          })}
        </nav>
      </div>
      
      {/* Logout Button */}
      <button 
        onClick={handleLogout} 
        className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-slate-800/60 rounded-xl text-sm font-medium transition"
      >
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
};

export default Sidebar;