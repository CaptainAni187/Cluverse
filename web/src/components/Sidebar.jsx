import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiHome, FiUser, FiBarChart2, FiUsers, FiBookmark, FiLogOut,
  FiCheckCircle, FiPlusCircle, FiMenu, FiX, FiClipboard, FiEdit3
} from 'react-icons/fi';
import api from '../api';

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(window.innerWidth >= 1024); // open on desktop by default
  const nav = useNavigate();

  useEffect(() => {
    api.get('/profile').then(r => setUser(r.data));
    const handleResize = () => setOpen(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const logout = () => {
    localStorage.clear();
    nav('/login');
  };

  if (!user) return null;

  // Define links per role
  const commonLinks = [
    { to: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { to: '/profile', icon: <FiUser />, label: 'Profile' },
  ];

  const studentLinks = [
    { to: '/events', icon: <FiBookmark />, label: 'Events' },
  ];

  const adminLinks = [
    { to: '/events', icon: <FiBookmark />, label: 'Events' },
    { to: '/host-event', icon: <FiPlusCircle />, label: 'Host Event' },
    { to: '/my-events', icon: <FiClipboard />, label: 'My Events' },
    { to: '/admin/edit', icon: <FiEdit3 />, label: 'Edit Event' }, // Add Edit Event for admins
    { to: '/admin/analytics', icon: <FiBarChart2 />, label: 'Analytics' },
  ];

  const bossLinks = [
    { to: '/admin/analytics', icon: <FiBarChart2 />, label: 'CWO Analytics Dashboard' },
    { to: '/event-requests', icon: <FiClipboard />, label: 'Event Requests' },
    { to: '/pending-clubs', icon: <FiCheckCircle />, label: 'Club Approvals' },
    { to: '/admin/users', icon: <FiUsers />, label: 'All Users' },
  ];

  let links = [...commonLinks];
  if (user?.role === 'student') links = [...links, ...studentLinks];
  if (user?.role === 'admin') links = [...links, ...adminLinks];
  if (user?.role === 'boss') links = [...links, ...bossLinks];

  // Remove duplicate links (if any)
  const seen = new Set();
  links = links.filter(link => {
    if (seen.has(link.to)) return false;
    seen.add(link.to);
    return true;
  });

  return (
    <>
      {/* Burger button */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-blue-800 text-white p-2 rounded-full shadow-lg focus:outline-none"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
        style={{ display: open ? 'none' : 'block' }}
      >
        <FiMenu size={28} />
      </button>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden animate-fade-in"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 shadow-2xl flex flex-col z-50
          transform transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-40`}
        style={{ minWidth: 256 }}
      >
        {/* Close button for mobile */}
        <button
          className="absolute top-4 right-4 text-blue-200 hover:text-white focus:outline-none lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        >
          <FiX size={28} />
        </button>
        <div className="flex items-center gap-3 px-6 py-6 border-b border-blue-800">
          <img
            src={user.profilePic || '/default-avatar.png'}
            alt="profile"
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-300 shadow"
          />
          <div>
            <div className="font-bold text-white text-lg">{user.name}</div>
            <div className="text-blue-200 text-xs capitalize">{user.role}</div>
          </div>
        </div>
        <nav className="flex-1 flex flex-col gap-1 mt-4 px-2">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 rounded-lg font-semibold text-base transition
                ${isActive
                  ? 'bg-blue-200 text-blue-900 shadow'
                  : 'text-blue-100 hover:bg-blue-800 hover:text-white'}`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-blue-800 mt-auto">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-800 text-blue-200 hover:bg-blue-900 hover:text-white font-semibold transition"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>
      <style>
        {`
        .animate-fade-in { animation: fadeIn 0.3s; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        `}
      </style>
    </>
  );
}
