import { useEffect, useState } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import { FiBookmark, FiShare2, FiCalendar, FiMessageCircle, FiAward } from 'react-icons/fi';
import { FaBookmark } from 'react-icons/fa';

const categories = [
  { label: 'All', value: '' },
  { label: 'Workshops', value: 'workshop' },
  { label: 'Competitions', value: 'competition' },
  { label: 'Socials', value: 'social' },
];

const statusTabs = [
  { label: 'Live', value: 'live' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Past', value: 'past' },
];

export default function HomePage() {
  const [status, setStatus] = useState('live');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState([]); // Always an array!
  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem('bookmarks') || '[]'));
  const [announcement, setAnnouncement] = useState("Welcome to Cluverse! Check out the latest events and announcements here.");
  const [faqEvent, setFaqEvent] = useState(null);
  const [poll, setPoll] = useState({
    question: "Which type of event do you want next?",
    options: ["Workshop", "Competition", "Social"],
    votes: [0, 0, 0]
  });
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api.get('/events', { params: { status, category, search } })
      .then(r => {
        // Defensive: ensure we always set an array
        setEvents(Array.isArray(r.data) ? r.data : []);
        setError('');
      })
      .catch(e => {
        setEvents([]);
        setError('Failed to load events');
      })
      .finally(() => setLoading(false));
  }, [status, category, search]);

  const toggleBookmark = (id) => {
    let updated;
    if (bookmarks.includes(id)) {
      updated = bookmarks.filter(b => b !== id);
    } else {
      updated = [...bookmarks, id];
    }
    setBookmarks(updated);
    localStorage.setItem('bookmarks', JSON.stringify(updated));
  };

  const shareEvent = (e) => {
    if (navigator.share) {
      navigator.share({
        title: e.title,
        text: `Check out this event: ${e.title}`,
        url: window.location.origin + `/events/${e._id}`,
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/events/${e._id}`);
      alert('Event link copied!');
    }
  };

  const addToCalendar = (e) => {
    const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${e.title}
DTSTART:${e.date.replace(/[-:]/g, '').slice(0, 15)}
DTEND:${e.date.replace(/[-:]/g, '').slice(0, 15)}
DESCRIPTION:${e.description || ''}
LOCATION:${e.location || ''}
END:VEVENT
END:VCALENDAR`;
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${e.title}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const votePoll = (idx) => {
    if (voted) return;
    const updated = { ...poll, votes: poll.votes.map((v, i) => i === idx ? v + 1 : v) };
    setPoll(updated);
    setVoted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-blue-900 drop-shadow-lg tracking-tight mb-2">Cluverse</h1>
          <p className="text-2xl italic text-blue-600 font-light tracking-wide mb-4">
            Weaving club constellations into one campus galaxy. <span role="img" aria-label="galaxy">🌌</span>
          </p>
        </div>

        {/* Announcement */}
        {announcement && (
          <div className="mb-8 p-5 rounded-2xl bg-blue-100 text-blue-900 shadow-lg font-semibold text-center animate-fade-in">
            {announcement}
          </div>
        )}

        {/* Poll Section (centered) */}
        <div className="mb-10 p-6 rounded-2xl bg-white shadow flex flex-col items-center animate-fade-in">
          <div className="font-semibold mb-4 text-blue-900 text-lg text-center">
            {poll.question}
          </div>
          <div className="flex gap-8 justify-center">
            {poll.options.map((opt, idx) => (
              <button
                key={opt}
                onClick={() => votePoll(idx)}
                disabled={voted}
                className={`px-8 py-2 rounded-full font-semibold text-lg shadow transition
                  ${voted
                    ? 'bg-blue-200 text-blue-800'
                    : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'}
                  focus:outline-none focus:ring-2 focus:ring-blue-400`}
              >
                {opt} {voted ? `(${poll.votes[idx]})` : ""}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Category Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <input
            className="flex-1 px-5 py-3 rounded-xl bg-blue-50 text-blue-900 placeholder:text-blue-300 shadow border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Search events or enter event code…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="flex gap-2">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-5 py-2 rounded-full text-base font-semibold transition
                  ${category === cat.value
                    ? 'bg-blue-100 text-blue-700 scale-105 shadow-lg'
                    : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 hover:scale-105 hover:shadow-lg'}
                  duration-200 ease-in-out`}
                style={{
                  boxShadow: category === cat.value
                    ? '0 4px 16px 0 rgba(59,130,246,0.10)'
                    : undefined,
                  transition: 'all 0.18s cubic-bezier(.4,1.2,.5,1)'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-4 mb-10 justify-center">
          {statusTabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setStatus(tab.value)}
              className={`px-7 py-2 rounded-full font-bold transition
                ${status === tab.value
                  ? 'bg-blue-100 text-blue-700 scale-110 shadow-lg'
                  : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 hover:scale-105 hover:shadow-lg'}
                duration-200 ease-in-out`}
                style={{
                  boxShadow: status === tab.value
                    ? '0 4px 16px 0 rgba(59,130,246,0.10)'
                    : undefined,
                  transition: 'all 0.18s cubic-bezier(.4,1.2,.5,1)'
                }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Event Cards */}
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          {loading && (
            <div className="col-span-full flex justify-center items-center">
              <div className="bg-white text-blue-800 px-10 py-8 rounded-2xl shadow-lg text-xl font-semibold text-center animate-fade-in">
                Loading events…
              </div>
            </div>
          )}
          {error && (
            <div className="col-span-full flex justify-center items-center">
              <div className="bg-white text-red-600 px-10 py-8 rounded-2xl shadow-lg text-xl font-semibold text-center animate-fade-in">
                {error}
              </div>
            </div>
          )}
          {!loading && !error && events.length === 0 && (
            <div className="col-span-full flex justify-center items-center">
              <div className="bg-white text-blue-800 px-10 py-8 rounded-2xl shadow-lg text-xl font-semibold text-center animate-fade-in">
                No events found.
              </div>
            </div>
          )}
          {Array.isArray(events) && events.map(e => (
            <div
              key={e._id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden relative flex flex-col animate-fade-in hover:scale-[1.025] transition-transform duration-300"
              style={{ minHeight: 340 }}
            >
              {/* Event Code */}
              <span className="absolute top-3 right-4 text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded shadow">
                {e.code || e._id.slice(-5).toUpperCase()}
              </span>
              {/* Event Image */}
              <div className="h-36 bg-blue-100 flex items-center justify-center overflow-hidden">
                {e.imageUrl
                  ? <img src={e.imageUrl} alt={e.title} className="h-full w-full object-cover" />
                  : <span className="text-blue-300 text-sm">No Image</span>
                }
              </div>
              {/* Event Details */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-1 text-blue-900 text-center">{e.title}</h3>
                <div className="flex flex-wrap gap-2 mb-2 justify-center">
                  {e.tags && e.tags.map(tag => (
                    <span key={tag} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-200">
                      {tag}
                    </span>
                  ))}
                  {/* Achievement badge */}
                  {e.attended && (
                    <span className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <FiAward className="inline" /> Attended
                    </span>
                  )}
                </div>
                <p className="text-xs text-blue-700 mb-1 text-center">{new Date(e.date).toLocaleString()}</p>
                <p className="text-xs text-blue-400 mb-3 text-center">{e.location}</p>
                <div className="flex gap-2 mt-auto justify-center">
                  {/* Bookmark */}
                  <button
                    onClick={() => toggleBookmark(e._id)}
                    title="Bookmark"
                    className="rounded-full p-2 hover:bg-blue-100 transition"
                  >
                    {bookmarks.includes(e._id)
                      ? <FaBookmark className="text-blue-700" />
                      : <FiBookmark className="text-blue-400" />}
                  </button>
                  {/* Share */}
                  <button
                    onClick={() => shareEvent(e)}
                    title="Share"
                    className="rounded-full p-2 hover:bg-blue-100 transition"
                  >
                    <FiShare2 className="text-blue-400" />
                  </button>
                  {/* Add to Calendar */}
                  <button
                    onClick={() => addToCalendar(e)}
                    title="Add to Calendar"
                    className="rounded-full p-2 hover:bg-blue-100 transition"
                  >
                    <FiCalendar className="text-blue-400" />
                  </button>
                  {/* Contact/FAQ */}
                  <button
                    title="Contact/FAQ"
                    className="rounded-full p-2 hover:bg-blue-100 transition"
                    onClick={() => setFaqEvent(e)}
                  >
                    <FiMessageCircle className="text-blue-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ/Support Modal */}
      {faqEvent && (
        <div className="fixed inset-0 bg-blue-900/80 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl relative">
            <button
              className="absolute top-3 right-3 text-2xl text-blue-700 hover:bg-blue-100 rounded-full px-2"
              onClick={() => setFaqEvent(null)}
            >×</button>
            <h2 className="text-2xl font-bold mb-4 text-blue-900">{faqEvent.title} — Support</h2>
            <div className="mb-3 text-blue-800">
              <b>Contact:</b> {faqEvent.contact || faqEvent.adminEmail || "Not available"}
            </div>
            <div className="mb-2 text-blue-800">
              <b>FAQs:</b>
              <ul className="list-disc ml-6">
                {(faqEvent.faqs || ["Contact the admin for more info."]).map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      {/* Custom style for seamless button transitions */}
      <style>
        {`
        button.scale-105, button.scale-110 {
          transition: all 0.18s cubic-bezier(.4,1.2,.5,1);
        }
        `}
      </style>
    </div>
  );
}
