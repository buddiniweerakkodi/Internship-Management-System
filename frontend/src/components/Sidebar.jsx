import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, FolderKanban, ClipboardList, FileCheck, LogOut 
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
    { id: 'tasks', name: 'Tasks (Kanban Board)', path: '/admin-tasks', icon: ClipboardList },
    { id: 'logs', name: 'Submissions & Daily Logs', path: '/admin-logs', icon: FileCheck }
  ];

  const internLinks = [
    { id: 'dashboard', name: 'Dashboard', path: '/intern-dashboard', icon: LayoutDashboard },
    { id: 'projects', name: 'My Projects', path: '/intern-projects', icon: FolderKanban },
    { id: 'tasks', name: 'My Tasks', path: '/intern-tasks', icon: ClipboardList },
    { id: 'logs', name: 'My Submissions & Logs', path: '/intern-logs', icon: FileCheck }
  ];

  const navLinks = role === 'admin' ? adminLinks : internLinks;

  return (
    <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col justify-between p-4 shrink-0 h-screen">
      <div>
        <div className="flex items-center gap-3 px-3 py-4 mb-6">
          <div className="bg-blue-600 text-white p-2 rounded-xl">
            <LayoutDashboard size={20} />
          </div>
          <span className="text-xl font-bold text-white tracking-wide">InternTrack</span>
        </div>

        <nav className="space-y-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button 
                key={link.id}
                onClick={() => navigate(link.path)} 
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  activePage === link.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon size={18} /> {link.name}
              </button>
            );
          })}
        </nav>
      </div>
      
      <button 
        onClick={handleLogout} 
        className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-red-400 hover:bg-slate-800/60 rounded-xl text-sm font-medium transition"
      >
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
};

export default Sidebar;