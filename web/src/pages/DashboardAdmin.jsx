import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import { FiUsers, FiCalendar, FiAward, FiPlusCircle, FiAlertCircle } from 'react-icons/fi';

export default function DashboardAdmin({ user }) {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/events', { params: { admin: user._id } })
      .then(r => setEvents(Array.isArray(r.data) ? r.data : []));
    api.get('/registrations/mine')
      .then(r => setRegistrations(Array.isArray(r.data) ? r.data : []));
  }, [user._id]);

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-extrabold text-blue-900 text-center drop-shadow">
            {user.clubName} Admin Dashboard
          </h1>
          <button
            onClick={() => navigate('/host-event')}
            className="flex items-center gap-2 px-5 py-2 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition-all font-semibold text-lg"
            title="Host a new event"
          >
            <FiPlusCircle /> Host Event
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 justify-center mb-10">
          <StatCard icon={<FiCalendar />} label="Your Events" value={events.length} color="text-blue-500" />
          <StatCard icon={<FiUsers />} label="Your Registrations" value={registrations.length} color="text-blue-700" />
          <StatCard icon={<FiAward />} label="Badges" value={user.badges?.length || 0} color="text-blue-600" />
        </div>
        <div className="bg-white rounded-2xl shadow p-6 mt-6 animate-fade-in">
          <h2 className="text-xl font-bold text-blue-900 mb-4">Your Events</h2>
          {events.length === 0 ? (
            <div className="text-blue-400">No events created yet.</div>
          ) : (
            <ul className="divide-y divide-blue-50">
              {events.map(ev => (
                <li key={ev._id || ev.title} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between animate-fade-in">
                  <div>
                    <span className="font-bold text-blue-900">{ev.title}</span>
                    <span className="ml-2 text-blue-500">
                      {ev.dateTime
                        ? new Date(ev.dateTime).toLocaleDateString()
                        : ev.date
                          ? new Date(ev.date).toLocaleDateString()
                          : ''
                      }
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`mt-2 sm:mt-0 inline-block px-3 py-1 rounded-full text-xs font-bold
                      ${ev.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : ev.status === 'pending_approval'
                          ? 'bg-yellow-100 text-yellow-700'
                          : ev.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : ev.status === 'changes_requested'
                              ? 'bg-yellow-200 text-yellow-800'
                              : 'bg-blue-100 text-blue-700'
                      }`}>
                      {ev.status?.replace('_', ' ') || 'pending'}
                    </span>
                    {(ev.status === 'rejected' || ev.status === 'changes_requested') && ev.feedback && (
                      <span className="flex items-center gap-1 mt-1 text-xs text-red-500">
                        <FiAlertCircle /> {ev.feedback}
                      </span>
                    )}
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
