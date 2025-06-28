import { useEffect, useState } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import { FiCheckCircle, FiUser, FiMail, FiUsers, FiLayers } from 'react-icons/fi';

export default function PendingClubs() {
  const [pending, setPending] = useState([]);
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/admin/pending-clubs').then(r => setPending(r.data));
  }, []);

  const approve = async (id) => {
    setBusy(id);
    setMsg('');
    try {
      await api.post(`/admin/approve-user/${id}`);
      setPending(pending.filter(u => u._id !== id));
      setMsg('Club approved!');
    } catch (e) {
      setMsg(e.response?.data?.msg || 'Approval failed');
    } finally {
      setBusy('');
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto mt-10 px-4">
        <h1 className="text-3xl font-extrabold text-blue-900 text-center mb-8 drop-shadow">
          Pending Club Admin Approvals
        </h1>
        {msg && (
          <div className="text-center mb-4 text-green-500 font-semibold animate-fade-in">{msg}</div>
        )}
        {pending.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center text-blue-400 text-lg">
            No pending club admin requests.
          </div>
        ) : (
          <div className="grid gap-6">
            {pending.map(u => (
              <div
                key={u._id}
                className="bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row items-center gap-6 border border-blue-100"
              >
                <div className="flex-1 flex flex-col items-center sm:items-start">
                  <div className="flex items-center gap-2 mb-2">
                    <FiUser className="text-blue-700" size={22} />
                    <span className="font-bold text-blue-900 text-lg">{u.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <FiMail className="text-blue-400" size={18} />
                    <span className="text-blue-600">{u.email}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <FiUsers className="text-blue-500" size={18} />
                    <span className="font-semibold text-blue-800">{u.clubName || <span className="text-blue-300">No club name</span>}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <FiLayers className="text-blue-400" size={18} />
                    <span className="text-blue-700">{u.category}</span>
                  </div>
                  <div className="text-xs text-blue-400 mt-1">
                    Requested on: {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                <button
                  className={`px-6 py-2 rounded-full font-bold text-lg shadow transition-all
                    ${busy === u._id
                      ? 'bg-blue-200 text-blue-400 cursor-not-allowed'
                      : 'bg-blue-700 text-white hover:bg-blue-800 hover:scale-105 hover:shadow-lg'}
                  `}
                  onClick={() => approve(u._id)}
                  disabled={busy === u._id}
                >
                  {busy === u._id ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Approving…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <FiCheckCircle size={20} /> Approve
                    </span>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>
        {`
        .animate-fade-in { animation: fadeIn 0.7s; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px);} to { opacity: 1; transform: none; } }
        `}
      </style>
    </>
  );
}
