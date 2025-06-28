import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { getPayload } from '../utils/jwt';
import { FiBookmark, FiShare2, FiEdit2, FiCalendar, FiMapPin, FiAward, FiInfo } from 'react-icons/fi';
import { FaBookmark } from 'react-icons/fa';

export default function EventPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [evt, setEvt] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [bookmarked, setBookmarked] = useState(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    return bookmarks.includes(id);
  });

  // Role from JWT
  let role = '';
  try {
    role = getPayload(localStorage.getItem('token')).role;
  } catch {}
  const isAdmin = role === 'admin' || role === 'boss';

  // Fetch event
  useEffect(() => {
    api.get(`/events/${id}`).then(r => setEvt(r.data)).catch(() => setEvt(null));
  }, [id]);

  // Register for event
  const register = async () => {
    setBusy(true);
    setMsg('');
    try {
      const { data } = await api.post(`/registrations/${id}`, {});
      nav(`/team/${data._id}`);
    } catch (e) {
      setMsg(e.response?.data?.msg || 'Registration failed');
    }
    setBusy(false);
  };

  // Bookmark toggle
  const toggleBookmark = () => {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    if (bookmarks.includes(id)) {
      bookmarks = bookmarks.filter(b => b !== id);
      setBookmarked(false);
    } else {
      bookmarks.push(id);
      setBookmarked(true);
    }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  };

  // Share event
  const shareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: evt.title,
        text: `Check out this event: ${evt.title}`,
        url: window.location.origin + `/events/${evt._id}`,
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/events/${evt._id}`);
      setMsg('Event link copied!');
      setTimeout(() => setMsg(''), 1200);
    }
  };

  if (!evt) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="text-blue-400 text-xl font-semibold">Event not found.</div>
    </div>
  );

  // Determine event status for badge
  const status = evt.status || 'approved';
  const showRegister = status === 'approved' || isAdmin;

  // Use dateTime if available, else fallback to date
  const eventDate = evt.dateTime
    ? new Date(evt.dateTime)
    : evt.date
      ? new Date(evt.date)
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-2xl mt-10 p-7 animate-fade-in">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => nav(-1)}
            className="text-blue-500 hover:text-blue-700 text-xl font-bold"
          >
            &larr;
          </button>
          <div className="flex gap-2">
            {/* Bookmark */}
            <button
              onClick={toggleBookmark}
              title={bookmarked ? "Remove Bookmark" : "Bookmark"}
              className="rounded-full p-2 hover:bg-blue-100 transition"
            >
              {bookmarked
                ? <FaBookmark className="text-blue-700" />
                : <FiBookmark className="text-blue-400" />}
            </button>
            {/* Share */}
            <button
              onClick={shareEvent}
              title="Share"
              className="rounded-full p-2 hover:bg-blue-100 transition"
            >
              <FiShare2 className="text-blue-400" />
            </button>
            {/* Edit (admin only) */}
            {isAdmin && (
              <button
                onClick={() => nav(`/admin/edit/${id}`)}
                className="rounded-full p-2 hover:bg-blue-100 transition"
                title="Edit Event"
              >
                <FiEdit2 className="text-blue-400" />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold mb-3 text-center text-blue-900">{evt.title}</h1>

        {/* Status badge if not approved */}
        {status !== 'approved' && (
          <div className="flex justify-center mb-2">
            <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold
              ${status === 'pending_approval'
                ? 'bg-yellow-100 text-yellow-700'
                : status === 'rejected'
                  ? 'bg-red-100 text-red-700'
                  : status === 'changes_requested'
                    ? 'bg-yellow-200 text-yellow-800'
                    : 'bg-blue-100 text-blue-700'
              }`}>
              <FiInfo /> {status.replace('_', ' ')}
            </span>
            {evt.feedback && (
              <span className="ml-2 text-xs text-red-500">{evt.feedback}</span>
            )}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-2 justify-center">
          {evt.tags && evt.tags.map(tag => (
            <span key={tag} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-200">
              {tag}
            </span>
          ))}
          {evt.attended && (
            <span className="bg-blue-100 text-blue-900 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <FiAward className="inline" /> Attended
            </span>
          )}
        </div>

        {/* Cover photo */}
        <div className="h-48 bg-blue-100 rounded-xl mb-5 flex items-center justify-center overflow-hidden">
          {evt.imageUrl ? (
            <img src={evt.imageUrl} className="h-full w-full object-cover rounded-xl" alt={evt.title} />
          ) : (
            <span className="text-blue-300">No Image</span>
          )}
        </div>

        {/* Date, Location, Price */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4 justify-center">
          <div className="flex-1 bg-blue-50 rounded-xl text-center p-3">
            <div className="flex items-center justify-center gap-1 text-blue-700 text-sm mb-1">
              <FiCalendar /> {eventDate ? eventDate.toLocaleString() : "TBA"}
            </div>
            <div className="flex items-center justify-center gap-1 text-blue-400 text-xs">
              <FiMapPin /> {evt.location || evt.venue || "Venue TBA"}
            </div>
          </div>
          <div className="flex-1 bg-blue-50 rounded-xl text-center p-3">
            <span className="block text-xs text-blue-400">Price</span>
            <span className="block text-lg font-bold text-blue-800">
              {evt.price ? `₹${evt.price}` : 'Free'}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="whitespace-pre-line mb-6 text-blue-900 text-base text-center">{evt.description}</p>

        {/* Register button */}
        {showRegister && (
          <button
            onClick={register}
            disabled={busy || status !== 'approved'}
            className={`w-full bg-blue-700 text-white font-bold py-3 rounded-lg shadow hover:bg-blue-800 transition text-lg ${busy || status !== 'approved' ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {busy ? "Registering..." : "Register"}
          </button>
        )}
        {msg && (
          <div className={`text-center mt-3 font-semibold ${msg.startsWith('Event link') ? 'text-blue-500' : 'text-red-500'}`}>
            {msg}
          </div>
        )}
      </div>
      {/* Fade-in animation */}
      <style>
        {`
        .animate-fade-in { animation: fadeIn 0.7s; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px);} to { opacity: 1; transform: none; } }
        `}
      </style>
    </div>
  );
}
