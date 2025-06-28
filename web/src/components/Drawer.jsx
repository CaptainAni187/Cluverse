import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Drawer() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    api.get('/profile').then(r => setUser(r.data));
  }, []);

  // Role-aware menu
  const menu = [
    { label: 'Home', to: '/' },
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Profile', to: '/profile' },
    { label: 'Events', to: '/events', roles: ['student', 'admin'] },
    { label: 'Host Event', to: '/host-event', roles: ['admin'] },
    { label: 'My Events', to: '/my-events', roles: ['admin'] },
    { label: 'Edit Event', to: '/admin/edit', roles: ['admin'] }, // New: Edit Event for admins
    { label: 'CWO Analytics Dashboard', to: '/admin/analytics', roles: ['boss'] },
    { label: 'Event Requests', to: '/event-requests', roles: ['boss'] },
    { label: 'Club Approvals', to: '/pending-clubs', roles: ['boss'] },
    { label: 'All Users', to: '/admin/users', roles: ['boss'] },
    { label: 'Bookmarks', to: '/bookmarks', roles: ['student'] },
    { label: 'Notifications', to: '/notifications', roles: ['student'] },
    { label: 'Achievements', to: '/achievements', roles: ['student'] },
    { label: 'Calendar', to: '/calendar', roles: ['student'] },
    { label: 'Settings', to: '/settings' },
  ];

  const role = user?.role || 'student';

  // Filter and deduplicate menu items
  const filteredMenu = [];
  const seen = new Set();
  menu.forEach(item => {
    if ((!item.roles || item.roles.includes(role)) && !seen.has(item.to)) {
      filteredMenu.push(item);
      seen.add(item.to);
    }
  });

  return (
    <>
      {/* Hamburger icon */}
      <button
        className="fixed top-4 left-4 z-50 flex flex-col gap-1.5 p-2 rounded-full bg-white shadow-md border border-blue-100"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        tabIndex={0}
      >
        <span className="block w-8 h-1 rounded bg-blue-700"></span>
        <span className="block w-8 h-1 rounded bg-blue-700"></span>
        <span className="block w-8 h-1 rounded bg-blue-700"></span>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 animate-fade-in"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-full max-w-xs bg-gradient-to-br from-blue-50 to-blue-100 z-50 shadow-xl
                    transform transition-transform duration-300
                    ${open ? 'translate-x-0' : '-translate-x-full'}
                    flex flex-col`}
      >
        {/* Close button */}
        <div className="flex justify-end items-center p-4">
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="text-blue-700 bg-white border border-blue-100 hover:bg-blue-50 rounded-full p-2 shadow transition"
          >×</button>
        </div>

        {/* User info */}
        {user && (
          <div className="flex flex-col items-center mb-2">
            <img
              src={user.profilePic || '/default-avatar.png'}
              alt="profile"
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-300 shadow mb-2"
            />
            <div className="font-bold text-blue-900">{user.name}</div>
            <div className="text-blue-500 text-xs capitalize">{role}</div>
          </div>
        )}

        {/* Menu buttons */}
        <div className="flex flex-col gap-4 px-4 mt-2">
          {filteredMenu.map(item => (
            <Link
              key={item.label}
              to={item.to}
              className="block w-full text-center py-3 text-lg font-semibold rounded-xl border border-blue-100 bg-white text-blue-400 hover:text-blue-700 hover:shadow-lg transition-all duration-200 shadow-md"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Spacer to push logout down */}
        <div className="flex-grow" />

        {/* Logout at the bottom with gap */}
        <div className="px-4 pb-6 mt-6">
          <button
            onClick={() => {
              localStorage.clear();
              nav('/');
              setOpen(false);
            }}
            className="block w-full text-center py-3 text-lg font-bold rounded-xl border border-blue-100 bg-white text-blue-800 hover:text-red-600 hover:bg-red-50 transition-all duration-200 shadow-md"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Animations */}
      <style>
        {`
        .animate-fade-in {
          animation: fadeIn 0.2s;
        }
        @keyframes fadeIn {
          from { opacity: 0 }
          to   { opacity: 1 }
        }
        `}
      </style>
    </>
  );
}
