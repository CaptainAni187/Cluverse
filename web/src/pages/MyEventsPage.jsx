import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import { FiCalendar, FiMapPin, FiCheckCircle, FiX, FiEdit3 } from 'react-icons/fi';

export default function MyEventsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    api.get('/profile').then(r => setUser(r.data));
  }, []);

  useEffect(() => {
    if (!user) return;
    if (user.role === 'admin') {
      api.get('/events', { params: { admin: user._id } }).then(r => setMyEvents(Array.isArray(r.data) ? r.data : []));
    } else {
      api.get('/registrations/mine').then(r => setRegistrations(Array.isArray(r.data) ? r.data : []));
    }
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10 min-h-[60vh]">
        <h1 className="text-3xl font-extrabold text-blue-900 text-center mb-8">
          My Events
        </h1>
        {user?.role === 'admin' ? (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {myEvents.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center mt-16 animate-fade-in">
                <FiCalendar size={48} className="text-blue-100 mb-4" />
                <div className="text-xl text-blue-400 font-semibold mb-2">No Events Created</div>
                <div className="text-blue-300">Click "Host Event" to create one!</div>
              </div>
            )}
            {myEvents.map(ev => (
              <div
                key={ev._id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col animate-fade-in hover:scale-[1.025] transition-transform duration-300 cursor-pointer relative"
                onClick={() => setSelected(ev)}
              >
                <div className="h-32 bg-blue-100 flex items-center justify-center overflow-hidden">
                  {ev.imageUrl
                    ? <img src={ev.imageUrl} alt={ev.title} className="h-full w-full object-cover" />
                    : <span className="text-blue-300 text-sm">No Image</span>
                  }
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold mb-1 text-blue-900 text-center">{ev.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-2 justify-center">
                    {ev.tags && ev.tags.map(tag => (
                      <span key={tag} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-blue-700 mb-1 text-center flex items-center justify-center gap-1">
                    <FiCalendar /> {ev.dateTime ? new Date(ev.dateTime).toLocaleString() : ""}
                  </p>
                  <p className="text-xs text-blue-400 mb-3 text-center flex items-center justify-center gap-1">
                    <FiMapPin /> {ev.location || ev.venue}
                  </p>
                  <div className="flex justify-center mb-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                      ${ev.status === 'approved'
                        ? "bg-green-100 text-green-700"
                        : ev.status === 'pending_approval'
                          ? "bg-yellow-100 text-yellow-700"
                          : ev.status === 'rejected'
                            ? "bg-red-100 text-red-700"
                            : ev.status === 'changes_requested'
                              ? "bg-yellow-200 text-yellow-800"
                              : "bg-blue-100 text-blue-700"}
                    `}>
                      {ev.status?.replace('_', ' ') || 'pending'}
                    </span>
                  </div>
                  {/* Edit button for admins */}
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      nav(`/admin/edit/${ev._id}`);
                    }}
                    title="Edit Event"
                    className="absolute top-4 right-4 bg-blue-50 hover:bg-blue-200 text-blue-700 rounded-full p-2 shadow transition"
                  >
                    <FiEdit3 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {/* Modal for event details (optional for admin, can show event preview) */}
            {selected && (
              <Modal onClose={() => setSelected(null)}>
                <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 relative animate-fade-in">
                  <button
                    onClick={() => setSelected(null)}
                    className="absolute top-4 right-4 text-blue-400 hover:text-blue-700 text-2xl"
                    aria-label="Close"
                  >
                    <FiX />
                  </button>
                  <h2 className="text-2xl font-bold text-blue-900 mb-2 text-center">
                    {selected.title}
                  </h2>
                  <div className="mb-2 text-blue-700 text-sm flex items-center gap-2 justify-center">
                    <FiCalendar /> {selected.dateTime ? new Date(selected.dateTime).toLocaleString() : ""}
                  </div>
                  <div className="mb-4 text-blue-400 text-xs flex items-center gap-2 justify-center">
                    <FiMapPin /> {selected.location || selected.venue}
                  </div>
                  <div className="mb-4 text-blue-900 text-center whitespace-pre-line">
                    {selected.description}
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {selected.tags && selected.tags.map(tag => (
                      <span key={tag} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-center mt-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                      ${selected.status === 'approved'
                        ? "bg-green-100 text-green-700"
                        : selected.status === 'pending_approval'
                          ? "bg-yellow-100 text-yellow-700"
                          : selected.status === 'rejected'
                            ? "bg-red-100 text-red-700"
                            : selected.status === 'changes_requested'
                              ? "bg-yellow-200 text-yellow-800"
                              : "bg-blue-100 text-blue-700"}
                    `}>
                      {selected.status?.replace('_', ' ') || 'pending'}
                    </span>
                  </div>
                </div>
              </Modal>
            )}
          </div>
        ) : (
          // Student view (registrations)
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {registrations.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center mt-16 animate-fade-in">
                <FiCalendar size={48} className="text-blue-100 mb-4" />
                <div className="text-xl text-blue-400 font-semibold mb-2">No Registered Events</div>
                <div className="text-blue-300">Register for events to see them here!</div>
              </div>
            )}
            {registrations.map(reg => (
              <div
                key={reg._id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col animate-fade-in hover:scale-[1.025] transition-transform duration-300 cursor-pointer"
                onClick={() => setSelected(reg)}
              >
                <div className="h-32 bg-blue-100 flex items-center justify-center overflow-hidden">
                  {reg.event?.imageUrl
                    ? <img src={reg.event.imageUrl} alt={reg.event.title} className="h-full w-full object-cover" />
                    : <span className="text-blue-300 text-sm">No Image</span>
                  }
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold mb-1 text-blue-900 text-center">{reg.event?.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-2 justify-center">
                    {reg.event?.tags && reg.event.tags.map(tag => (
                      <span key={tag} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-blue-700 mb-1 text-center flex items-center justify-center gap-1">
                    <FiCalendar /> {reg.event?.dateTime ? new Date(reg.event.dateTime).toLocaleString() : reg.event?.date ? new Date(reg.event.date).toLocaleString() : ""}
                  </p>
                  <p className="text-xs text-blue-400 mb-3 text-center flex items-center justify-center gap-1">
                    <FiMapPin /> {reg.event?.location}
                  </p>
                  <div className="flex justify-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                      ${reg.checkedIn
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"}
                    `}>
                      {reg.checkedIn ? "Checked-in" : "Registered"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {/* Modal for event details and QR */}
            {selected && (
              <Modal onClose={() => setSelected(null)}>
                <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 relative animate-fade-in">
                  <button
                    onClick={() => setSelected(null)}
                    className="absolute top-4 right-4 text-blue-400 hover:text-blue-700 text-2xl"
                    aria-label="Close"
                  >
                    <FiX />
                  </button>
                  <h2 className="text-2xl font-bold text-blue-900 mb-2 text-center">
                    {selected.event?.title}
                  </h2>
                  <div className="flex flex-col items-center mb-4">
                    {selected.qr ? (
                      <img src={selected.qr} alt="QR" className="w-32 h-32 rounded-xl shadow mb-2" />
                    ) : (
                      <div className="w-32 h-32 bg-blue-100 rounded-xl flex items-center justify-center text-blue-300 mb-2">
                        No QR
                      </div>
                    )}
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                      ${selected.checkedIn
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"}
                    `}>
                      {selected.checkedIn ? (
                        <span className="flex items-center gap-1"><FiCheckCircle /> Checked-in</span>
                      ) : "Registered"}
                    </span>
                  </div>
                  <div className="mb-2 text-blue-700 text-sm flex items-center gap-2 justify-center">
                    <FiCalendar /> {selected.event?.dateTime ? new Date(selected.event.dateTime).toLocaleString() : selected.event?.date ? new Date(selected.event.date).toLocaleString() : ""}
                  </div>
                  <div className="mb-4 text-blue-400 text-xs flex items-center gap-2 justify-center">
                    <FiMapPin /> {selected.event?.location}
                  </div>
                  <div className="mb-4 text-blue-900 text-center whitespace-pre-line">
                    {selected.event?.description}
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {selected.event?.tags && selected.event.tags.map(tag => (
                      <span key={tag} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Modal>
            )}
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

// Modal overlay component
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
