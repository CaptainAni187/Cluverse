import Navbar from '../components/Navbar';
import { FiAward, FiBookmark } from 'react-icons/fi';

export default function DashboardStudent({ user }) {
  const regList = Array.isArray(user.registrations) ? user.registrations : [];
  const badges = Array.isArray(user.badges) ? user.badges : [];
  const points = typeof user.points === 'number' ? user.points : 0;

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto mt-10 px-4">
        <h1 className="text-3xl font-extrabold text-blue-900 text-center mb-6 animate-fade-in">
          Welcome, <span className="text-blue-700">{user.name}</span>!
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 justify-center mb-10">
          <StatCard icon={<FiBookmark />} label="Events Registered" value={regList.length} color="text-blue-500" />
          <StatCard icon={<FiAward />} label="Badges" value={badges.length} color="text-blue-700" />
          <StatCard icon={<FiAward />} label="Points" value={points} color="text-blue-600" />
        </div>
        <div className="bg-white rounded-2xl shadow p-6 mt-6 animate-fade-in">
          <h2 className="text-xl font-bold text-blue-900 mb-4">Your Registered Events</h2>
          {regList.length === 0 ? (
            <div className="text-blue-400 text-center">No registrations yet.</div>
          ) : (
            <ul className="divide-y divide-blue-50">
              {regList.map((reg, idx) => (
                <li
                  key={reg._id || reg.event?._id || idx}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between animate-fade-in"
                >
                  <div>
                    <span className="font-bold text-blue-900">{reg.event?.title || 'Event'}</span>
                    <span className="ml-2 text-blue-500">
                      {reg.event?.dateTime
                        ? new Date(reg.event.dateTime).toLocaleDateString()
                        : reg.event?.date
                          ? new Date(reg.event.date).toLocaleDateString()
                          : ''
                      }
                    </span>
                  </div>
                  <span className={`mt-2 sm:mt-0 inline-block px-3 py-1 rounded-full text-xs font-bold
                    ${reg.checkedIn
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                    }`}>
                    {reg.checkedIn ? 'Checked-in' : 'Registered'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 justify-center animate-fade-in">
            {badges.map((badge, i) => (
              <span key={badge + i} className="bg-blue-50 text-blue-900 px-3 py-1 rounded-full flex items-center gap-1 border border-blue-200 shadow-sm">
                <FiAward /> {badge}
              </span>
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

function StatCard({ icon, label, value, color }) {
  return (
    <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-6 min-w-[140px] animate-fade-in">
      <span className={`text-3xl mb-2 ${color}`}>{icon}</span>
      <span className="text-3xl font-extrabold text-blue-900">{value}</span>
      <span className="text-blue-500 font-semibold mt-1">{label}</span>
    </div>
  );
}
