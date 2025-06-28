import { Link, useNavigate } from 'react-router-dom';
import Drawer from './Drawer';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <header className="bg-white/80 backdrop-blur sticky top-0 z-30 shadow-md border-b border-blue-100">
      <nav className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-8 py-3">
        {/* Hamburger menu (Drawer) */}
        <Drawer />

        {/* App Title or Logo */}
        <span
          onClick={() => navigate('/')}
          className="text-2xl font-extrabold text-blue-900 cursor-pointer select-none flex items-center gap-2"
        >
          <span className="relative">
            Cluverse
            <span className="absolute left-0 right-0 -bottom-1 h-1 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-300 rounded-full blur-sm opacity-60 animate-pulse" />
          </span>
          <span className="text-2xl ml-1 animate-spin-slow" role="img" aria-label="galaxy">🌌</span>
        </span>

        {/* Auth controls */}
        {token ? (
          <button
            onClick={logout}
            className="px-4 py-1 rounded-full bg-blue-700 text-white font-semibold shadow hover:bg-blue-800 transition text-sm"
            aria-label="Logout"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="px-4 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold shadow hover:bg-blue-100 transition text-sm"
            aria-label="Login"
          >
            Login
          </Link>
        )}
      </nav>
      {/* Cool animation styles */}
      <style>
        {`
        .animate-spin-slow {
          animation: spin 6s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
        `}
      </style>
    </header>
  );
}
