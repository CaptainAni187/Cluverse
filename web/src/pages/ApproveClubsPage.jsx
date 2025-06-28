import { useEffect, useState } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import { FiCheckCircle, FiUsers } from 'react-icons/fi';

export default function ApproveClubs() {
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/admin/pending-clubs').then(r => setRows(r.data));
  }, []);

  const approve = async id => {
    await api.post(`/admin/approve-user/${id}`);
    setRows(rows.filter(r => r._id !== id));
    setMsg('Club approved!');
    setTimeout(() => setMsg(''), 1500);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto mt-10 px-4">
        <h1 className="text-3xl font-extrabold text-blue-900 text-center mb-6">
          Pending Club Requests
        </h1>
        <p className="text-center text-blue-500 mb-8">
          Review and approve new club registrations below.
        </p>
        {msg && (
          <div className="text-green-600 text-center font-semibold mb-4 animate-fade-in">
            {msg}
          </div>
        )}
        <div className="flex flex-col gap-6">
          {rows.length ? rows.map(r => (
            <div
              key={r._id}
              className="bg-white rounded-2xl shadow-lg p-5 flex items-center justify-between gap-4 border border-blue-100 animate-fade-in"
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 text-blue-700 rounded-full p-3">
                  <FiUsers size={28} />
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-900">{r.clubName}</div>
                  <div className="text-sm text-blue-500">{r.category || 'No category'}</div>
                  <div className="text-xs text-blue-400">{r.email}</div>
                </div>
              </div>
              <button
                onClick={() => approve(r._id)}
                className="flex items-center gap-2 px-5 py-2 bg-blue-700 text-white font-semibold rounded-full shadow hover:bg-blue-800 transition"
              >
                <FiCheckCircle size={18} />
                Approve
              </button>
            </div>
          )) : (
            <div className="text-center text-blue-400 text-lg mt-12 animate-fade-in">
              No club requests pending approval.
            </div>
          )}
        </div>
      </div>
      {/* Fade-in animation */}
      <style>
        {`
        .animate-fade-in { animation: fadeIn 0.6s; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px);} to { opacity: 1; transform: none; } }
        `}
      </style>
    </>
  );
}
