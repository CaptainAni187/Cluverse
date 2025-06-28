import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { getPayload } from '../utils/jwt';

export default function LoginPage() {
  const nav = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  const isStudent = form.email.endsWith('@learner.manipal.edu');
  const emailOk = !isStudent || /^[a-z0-9._%+-]+@learner\.manipal\.edu$/i.test(form.email);

  const login = async () => {
    if (busy) return;
    setErr('');
    if (!form.email || !form.password) return setErr('Fill both fields');
    if (!emailOk) return setErr('Invalid student email');
    try {
      setBusy(true);
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      const { role } = getPayload(data.token);
      // All roles go to /dashboard, fallback to /
      nav(role === 'admin' || role === 'boss' || role === 'student' ? '/dashboard' : '/');
    } catch (e) {
      setErr(e.response?.data?.msg || e.message || 'Wrong credentials');
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5001/api/auth/google';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#151a22] via-[#222b3a] to-[#10141a]">
      <form
        className="w-full max-w-xs bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 animate-fade-in border border-blue-900"
        onSubmit={e => { e.preventDefault(); login(); }}
        autoComplete="off"
      >
        <h1 className="text-3xl font-extrabold text-center text-white mb-8 drop-shadow">Login</h1>

        <label className="block mb-2 text-sm text-blue-200 font-semibold" htmlFor="email">Email</label>
        <input
          id="email"
          className="w-full mb-4 bg-[#1a2130] rounded-lg p-3 text-sm text-white placeholder:text-blue-300 border border-blue-800 focus:ring-2 focus:ring-blue-500 transition"
          type="email"
          placeholder="example@learner.manipal.edu"
          value={form.email}
          disabled={busy}
          autoComplete="username"
          onChange={e => setForm({ ...form, email: e.target.value.trim() })}
        />

        <label className="block mb-2 text-sm text-blue-200 font-semibold" htmlFor="password">Password</label>
        <div className="relative mb-4">
          <input
            id="password"
            className="w-full bg-[#1a2130] rounded-lg p-3 pr-16 text-sm text-white placeholder:text-blue-300 border border-blue-800 focus:ring-2 focus:ring-blue-500 transition"
            type={show ? 'text' : 'password'}
            placeholder="Password"
            value={form.password}
            disabled={busy}
            autoComplete="current-password"
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-400 hover:text-white transition"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? 'Hide' : 'Show'}
          </button>
        </div>

        <button
          type="submit"
          disabled={busy}
          className={`w-full py-3 rounded-lg font-bold text-lg transition-all duration-200 mb-4 shadow
            ${busy
              ? 'bg-blue-900 text-blue-400 cursor-not-allowed'
              : 'bg-blue-700 text-white hover:bg-blue-800 hover:scale-105 hover:shadow-lg'}`}
        >
          {busy ? (
            <>
              <svg className="inline animate-spin mr-2" width="20" height="20" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Checking…
            </>
          ) : 'Login'}
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={busy}
          className="w-full py-3 rounded-lg font-bold bg-white text-blue-800 hover:bg-blue-50 transition flex items-center justify-center gap-2 mb-4 shadow"
        >
          <svg width="20" height="20" viewBox="0 0 48 48" className="inline mr-2" style={{ verticalAlign: 'middle' }}>
            <g>
              <path fill="#4285F4" d="M44.5,20H24v8.5h11.7C34.7,33.3,30.1,36,24,36c-6.6,0-12-5.4-12-12s5.4-12,12-12c2.7,0,5.2,0.9,7.2,2.5l6.4-6.4C34.6,5.1,29.6,3,24,3C12.4,3,3,12.4,3,24s9.4,21,21,21c11.6,0,20.7-8.4,20.7-21C44.7,22.7,44.6,21.3,44.5,20z"/>
              <path fill="#34A853" d="M6.3,14.7l7,5.1C15.3,16.3,19.3,13,24,13c2.7,0,5.2,0.9,7.2,2.5l6.4-6.4C34.6,5.1,29.6,3,24,3C15.1,3,7.3,8.7,6.3,14.7z"/>
              <path fill="#FBBC05" d="M24,44c5.1,0,9.9-1.7,13.6-4.7l-6.3-5.2C29.6,36.9,27,37.7,24,37.7c-6.1,0-11.3-4.1-13.1-9.7l-7,5.1C7.3,39.3,15.1,44,24,44z"/>
              <path fill="#EA4335" d="M44.5,20H24v8.5h11.7c-1.1,3.1-4.2,5.2-7.7,5.2c-2.7,0-5.2-0.9-7.2-2.5l-6.4,6.4C13.4,42.9,18.4,45,24,45c11.6,0,20.7-8.4,20.7-21C44.7,22.7,44.6,21.3,44.5,20z"/>
            </g>
          </svg>
          Login with Google
        </button>

        {err && (
          <div className="mt-3 text-center text-sm font-semibold text-red-400 animate-shake">
            {err}
          </div>
        )}

        <p className="text-center mt-6 text-xs text-blue-300">
          No account?{' '}
          <Link to="/register" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
      <style>
        {`
        .animate-fade-in { animation: fadeIn 0.7s; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px);} to { opacity: 1; transform: none; } }
        .animate-shake { animation: shake 0.3s; }
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-6px); }
          100% { transform: translateX(0); }
        }
        `}
      </style>
    </div>
  );
}
