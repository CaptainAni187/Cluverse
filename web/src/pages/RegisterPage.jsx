import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const STUDENT_MAIL = /^[\w.+-]+@learner\.manipal\.edu$/i;
const CLUB_CATEGORIES = [
  'Technical',
  'Cultural',
  'Sports',
  'Literary',
  'Other'
];

export default function RegisterPage() {
  const [step, setStep] = useState(1); // 1-email → 2-OTP → 99-done
  const [form, setForm] = useState({ role: 'student' });
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const update = (k, v) => setForm({ ...form, [k]: v });
  const clear = () => { setMsg(''); setBusy(false); };

  // Step 1: Send OTP
  const sendOtp = async () => {
    clear();
    const mail = (form.email || '').trim();
    if (!mail) { setMsg('Email is required'); return; }
    if (form.role === 'student' && !STUDENT_MAIL.test(mail)) {
      setMsg('Student email must be @learner.manipal.edu'); return;
    }
    try {
      setBusy(true);
      await api.post('/auth/request-otp', { email: mail, role: form.role });
      setStep(2);
    } catch (e) {
      setMsg(e.response?.data?.msg || 'Error sending OTP');
    } finally { setBusy(false); }
  };

  // Step 2: Verify OTP & Signup
  const signup = async () => {
    clear();
    if (!form.name) { setMsg('Name is required'); return; }
    if (!form.otp || !form.password) { setMsg('OTP and password required'); return; }
    if (form.password.length < 8) { setMsg('Password must be 8+ chars'); return; }
    if (form.role === 'student' && !form.branch) { setMsg('Branch is required'); return; }
    if (form.role === 'admin' && !form.category) { setMsg('Category is required'); return; }

    // derive extras for students
    const extras = {};
    if (form.role === 'student') {
      const email = form.email.trim();
      const yMatch = email.match(/(\d{4})@learner\.manipal\.edu$/i);
      if (yMatch) {
        const yJoin = Number(yMatch[1]);
        const now = new Date();
        const acadY = now.getFullYear() + (now.getMonth() >= 6 ? 1 : 0);
        extras.yearOfJoin = yJoin;
        extras.yearOfStudy = Math.max(1, acadY - yJoin);
      }
    }

    try {
      setBusy(true);
      await api.post('/auth/signup', { ...form, ...extras });
      setMsg('Account created.');
      setStep(99);
    } catch (e) {
      setMsg(e.response?.data?.msg || 'Signup failed');
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#151a22] via-[#222b3a] to-[#10141a]">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-blue-900 animate-fade-in">
        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h2 className="text-3xl font-extrabold text-center text-white mb-8 drop-shadow">Create Account</h2>
            <select
              className="w-full mb-4 bg-[#1a2130] rounded-lg p-3 text-white border border-blue-800 focus:ring-2 focus:ring-blue-500 transition"
              value={form.role}
              onChange={e => update('role', e.target.value)}
              disabled={busy}
            >
              <option value="student">Student</option>
              <option value="admin">Club Admin</option>
              <option value="boss">SWO Boss</option>
            </select>
            <input
              className="w-full mb-4 bg-[#1a2130] rounded-lg p-3 text-sm text-white placeholder:text-blue-300 border border-blue-800 focus:ring-2 focus:ring-blue-500 transition"
              placeholder={
                form.role === 'student'
                  ? 'example@learner.manipal.edu'
                  : 'official@email'
              }
              value={form.email || ''}
              onChange={e => update('email', e.target.value)}
              autoComplete="off"
              disabled={busy}
            />
            <button
              onClick={sendOtp}
              disabled={busy}
              className={`w-full py-3 rounded-lg font-bold text-lg transition-all duration-200 mb-2 shadow
                ${busy
                  ? 'bg-blue-900 text-blue-400 cursor-not-allowed'
                  : 'bg-blue-700 text-white hover:bg-blue-800 hover:scale-105 hover:shadow-lg'}`}
            >
              {busy ? 'Sending…' : 'Send OTP'}
            </button>
            {msg && <div className="mt-3 text-center text-sm font-semibold text-red-400 animate-shake">{msg}</div>}
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h2 className="text-3xl font-extrabold text-center text-white mb-8 drop-shadow">Verify OTP</h2>
            {/* Name (required for all) */}
            <input
              className="w-full mb-4 bg-[#1a2130] rounded-lg p-3 text-white placeholder:text-blue-300 border border-blue-800 focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Full Name"
              value={form.name || ''}
              onChange={e => update('name', e.target.value)}
              autoComplete="name"
              required
              disabled={busy}
            />
            <input
              className="w-full mb-4 bg-[#1a2130] rounded-lg p-3 text-white placeholder:text-blue-300 border border-blue-800 focus:ring-2 focus:ring-blue-500 transition"
              placeholder="6-digit OTP code"
              value={form.otp || ''}
              onChange={e => update('otp', e.target.value)}
              autoComplete="off"
              disabled={busy}
            />
            <input
              type="password"
              className="w-full mb-4 bg-[#1a2130] rounded-lg p-3 text-white placeholder:text-blue-300 border border-blue-800 focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Password (8+ chars)"
              value={form.password || ''}
              onChange={e => update('password', e.target.value)}
              autoComplete="new-password"
              disabled={busy}
            />

            {/* Student extra: Branch */}
            {form.role === 'student' && (
              <>
                <input
                  className="w-full mb-4 bg-[#1a2130] rounded-lg p-3 text-white placeholder:text-blue-300 border border-blue-800 focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Branch (e.g. CSE, ME, ECE)"
                  value={form.branch || ''}
                  onChange={e => update('branch', e.target.value)}
                  autoComplete="off"
                  required
                  disabled={busy}
                />
                <input
                  className="w-full mb-3 bg-[#1a2130] rounded-lg p-3 text-white placeholder:text-blue-300 border border-blue-800"
                  placeholder="Phone (WhatsApp)"
                  value={form.phone || ''}
                  onChange={e => update('phone', e.target.value)}
                  autoComplete="off"
                  required
                  disabled={busy}
                />
              </>
            )}

            {/* Admin extras */}
            {form.role === 'admin' && (
              <>
                <input
                  className="w-full mb-3 bg-[#1a2130] rounded-lg p-3 text-white placeholder:text-blue-300 border border-blue-800"
                  placeholder="Club name"
                  value={form.clubName || ''}
                  onChange={e => update('clubName', e.target.value)}
                  autoComplete="off"
                  required
                  disabled={busy}
                />
                <select
                  className="w-full mb-3 bg-[#1a2130] rounded-lg p-3 text-white border border-blue-800"
                  value={form.category || ''}
                  onChange={e => update('category', e.target.value)}
                  required
                  disabled={busy}
                >
                  <option value="">Select club category</option>
                  {CLUB_CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <input
                  className="w-full mb-3 bg-[#1a2130] rounded-lg p-3 text-white placeholder:text-blue-300 border border-blue-800"
                  placeholder="President WhatsApp"
                  value={form.contacts?.president || ''}
                  onChange={e =>
                    update('contacts', { ...(form.contacts || {}), president: e.target.value })
                  }
                  autoComplete="off"
                  required
                  disabled={busy}
                />
                <input
                  className="w-full mb-3 bg-[#1a2130] rounded-lg p-3 text-white placeholder:text-blue-300 border border-blue-800"
                  placeholder="Vice-president WhatsApp"
                  value={form.contacts?.vice || ''}
                  onChange={e =>
                    update('contacts', { ...(form.contacts || {}), vice: e.target.value })
                  }
                  autoComplete="off"
                  required
                  disabled={busy}
                />
              </>
            )}

            <button
              onClick={signup}
              disabled={busy}
              className={`w-full py-3 rounded-lg font-bold text-lg transition-all duration-200 mb-2 shadow
                ${busy
                  ? 'bg-blue-900 text-blue-400 cursor-not-allowed'
                  : 'bg-blue-700 text-white hover:bg-blue-800 hover:scale-105 hover:shadow-lg'}`}
            >
              {busy ? 'Creating…' : 'Create account'}
            </button>
            {msg && <div className="mt-3 text-center text-sm font-semibold text-red-400 animate-shake">{msg}</div>}
          </>
        )}

        {/* DONE */}
        {step === 99 && (
          <div className="text-center text-green-400 font-bold text-xl animate-fade-in">
            Account created.<br />
            {form.role === 'admin'
              ? <>Please wait for admin approval before logging in.<br /></>
              : <>You can now log in.<br /></>
            }
            <Link to="/login" className="text-blue-300 underline block mt-2">Go to Login</Link>
          </div>
        )}
      </div>
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
