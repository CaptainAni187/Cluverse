import { useEffect, useState } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import { FiUsers, FiCalendar, FiBookmark, FiAward, FiCheck, FiX, FiEdit3 } from 'react-icons/fi';

export default function DashboardBoss({ user }) {
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/stats')
      .then(r => setStats(r.data))
      .catch(() => setError('Failed to load stats'));
    api.get('/admin/pending-clubs')
      .then(r => setPending(Array.isArray(r.data) ? r.data : []))
      .catch(() => setError('Failed to load pending clubs'));
    api.get('/admin/pending-events')
      .then(r => setPendingEvents(Array.isArray(r.data) ? r.data : []))
      .catch(() => setError('Failed to load pending events'));
  }, []);

  const approveClub = async (id) => {
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

  const handleEventAction = async (id, action, feedback = '') => {
    setBusy(id);
    setMsg('');
    try {
      await api.post(`/admin/event-action/${id}`, { action, feedback });
      setPendingEvents(pendingEvents.filter(ev => ev._id !== id));
      setMsg(`Event ${action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'sent for changes'}!`);
    } catch (e) {
      setMsg(e.response?.data?.msg || 'Event action failed');
    } finally {
      setBusy('');
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto mt-10 px-4">
        <h1 className="text-4xl font-extrabold text-blue-900 text-center mb-8 drop-shadow">
          CWO Analytics Dashboard
        </h1>
        {error && (
          <div className="text-center text-red-500 mb-4">{error}</div>
        )}
        {stats ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-center mb-10">
            <StatCard icon={<FiCalendar />} label="Events" value={stats.events} color="text-blue-500" />
            <StatCard icon={<FiUsers />} label="Registrations" value={stats.registrations} color="text-blue-700" />
            <StatCard icon={<FiBookmark />} label="Users" value={stats.users} color="text-blue-400" />
            <StatCard icon={<FiAward />} label="Badges" value={stats.badges || 0} color="text-blue-600" />
          </div>
        ) : !error && (
          <div className="flex justify-center items-center h-48">
            <p className="text-blue-400 text-lg">Loading…</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow p-6 mt-6 animate-fade-in">
          <h2 className="text-xl font-bold text-blue-900 mb-4">Pending Club Admin Approvals</h2>
          {msg && (
            <div className="text-center mb-4 text-green-500 font-semibold animate-fade-in">{msg}</div>
          )}
          {pending.length === 0 ? (
            <div className="text-blue-400">No pending requests.</div>
          ) : (
            <ul className="space-y-4">
              {pending.map(u => (
                <li
                  key={u._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-3 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-xl border border-blue-100 shadow-sm animate-fade-in"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="font-bold text-blue-900">{u.name}</span>
                    <span className="text-blue-600">{u.email}</span>
                    <span className="text-blue-700">{u.clubName}</span>
                    <span className="text-blue-500">{u.category}</span>
                  </div>
                  <button
                    className={`mt-2 sm:mt-0 px-4 py-2 rounded-full font-bold text-base shadow transition-all flex items-center gap-2
                      ${busy === u._id
                        ? 'bg-blue-200 text-blue-400 cursor-not-allowed'
                        : 'bg-blue-700 text-white hover:bg-blue-800 hover:scale-105 hover:shadow-lg'}
                    `}
                    onClick={() => approveClub(u._id)}
                    disabled={busy === u._id}
                  >
                    {busy === u._id ? (
                      <>
                        <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Approving…
                      </>
                    ) : (
                      <>
                        <FiCheck size={20} /> Approve
                      </>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow p-6 mt-10 animate-fade-in">
          <h2 className="text-xl font-bold text-blue-900 mb-4">Pending Event Requests</h2>
          {pendingEvents.length === 0 ? (
            <div className="text-blue-400">No pending event requests.</div>
          ) : (
            <ul className="space-y-8">
              {pendingEvents.map(ev => (
                <li key={ev._id} className="bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-xl border border-blue-100 shadow-sm p-5 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <div>
                      <span className="font-bold text-blue-900 text-lg">{ev.title}</span>
                      <span className="ml-3 text-blue-500">{ev.category}</span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                      {ev.status?.replace('_', ' ') || 'pending'}
                    </span>
                  </div>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-4">
                    <Info label="Mode" value={ev.mode?.charAt(0).toUpperCase() + ev.mode?.slice(1)} />
                    <Info label="Room Needed" value={ev.roomNeeded ? 'Yes' : 'No'} />
                    {ev.roomNeeded && <Info label="Room Type" value={ev.roomType} />}
                    <Info label="Date & Time" value={ev.dateTime ? new Date(ev.dateTime).toLocaleString() : ''} />
                    <Info label="Participants" value={ev.participants || 'N/A'} />
                    <Info label="Funding Needed" value={ev.fundingNeeded ? `Yes (${ev.fundingAmount})` : 'No'} />
                    <Info label="Mentor Approved" value={ev.mentorApproved ? 'Yes' : 'No'} />
                    <Info label="Sub-events" value={ev.subEvents || '0'} />
                    <Info label="Contact Name" value={ev.contactName} />
                    <Info label="Contact Phone" value={ev.contactPhone} />
                    <Info label="Team Strength" value={ev.teamStrength} />
                    <Info label="Requested By" value={ev.adminName || ev.createdBy?.name || ''} />
                  </dl>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <button
                      onClick={() => handleEventAction(ev._id, 'approve')}
                      disabled={busy === ev._id}
                      className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-base shadow transition-all
                        ${busy === ev._id ? 'bg-blue-200 text-blue-400 cursor-not-allowed'
                          : 'bg-green-700 text-white hover:bg-green-800 hover:scale-105 hover:shadow-lg'}
                      `}
                    >
                      <FiCheck /> Approve
                    </button>
                    <button
                      onClick={() => handleEventAction(ev._id, 'reject')}
                      disabled={busy === ev._id}
                      className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-base shadow transition-all
                        ${busy === ev._id ? 'bg-blue-200 text-blue-400 cursor-not-allowed'
                          : 'bg-red-700 text-white hover:bg-red-800 hover:scale-105 hover:shadow-lg'}
                      `}
                    >
                      <FiX /> Reject
                    </button>
                    <button
                      onClick={() => {
                        const feedback = prompt('Enter feedback or required changes for this event:');
                        if (feedback !== null) handleEventAction(ev._id, 'changes', feedback);
                      }}
                      disabled={busy === ev._id}
                      className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-base shadow transition-all
                        ${busy === ev._id ? 'bg-blue-200 text-blue-400 cursor-not-allowed'
                          : 'bg-yellow-600 text-white hover:bg-yellow-700 hover:scale-105 hover:shadow-lg'}
                      `}
                    >
                      <FiEdit3 /> Request Changes
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
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

function StatCard({ icon, label, value, color }) {
  return (
    <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-6 min-w-[140px] animate-fade-in">
      <span className={`text-3xl mb-2 ${color}`}>{icon}</span>
      <span className="text-3xl font-extrabold text-blue-900">{value}</span>
      <span className="text-blue-500 font-semibold mt-1">{label}</span>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <dt className="font-semibold text-blue-900">{label}:</dt>
      <dd className="ml-2 text-blue-800">{value || <span className="text-blue-300">N/A</span>}</dd>
    </div>
  );
}
