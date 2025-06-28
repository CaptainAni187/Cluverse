import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import { FiCalendar, FiMapPin, FiBookmark, FiShare2 } from "react-icons/fi";

export default function BookmarksPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get bookmarked event IDs from localStorage
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    if (!bookmarks.length) {
      setEvents([]);
      setLoading(false);
      return;
    }
    // Fetch event details for each bookmarked ID
    api.get("/events", { params: { ids: bookmarks.join(",") } })
      .then(r => setEvents(r.data))
      .finally(() => setLoading(false));
  }, []);

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

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10 min-h-[60vh]">
        <h1 className="text-3xl font-extrabold text-blue-900 text-center mb-8">
          <FiBookmark className="inline mr-2 mb-1 text-blue-400" size={30} />
          Your Bookmarked Events
        </h1>
        {loading ? (
          <div className="text-center text-blue-400 text-lg mt-16">Loading...</div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-24 animate-fade-in">
            <FiBookmark size={48} className="text-blue-100 mb-4" />
            <div className="text-xl text-blue-400 font-semibold mb-2">No Bookmarks Yet</div>
            <div className="text-blue-300">Bookmark events to quickly find them here!</div>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {events.map(e => (
              <div
                key={e._id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col animate-fade-in hover:scale-[1.025] transition-transform duration-300"
              >
                <div className="h-32 bg-blue-100 flex items-center justify-center overflow-hidden">
                  {e.imageUrl
                    ? <img src={e.imageUrl} alt={e.title} className="h-full w-full object-cover" />
                    : <span className="text-blue-300 text-sm">No Image</span>
                  }
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold mb-1 text-blue-900 text-center">{e.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-2 justify-center">
                    {e.tags && e.tags.map(tag => (
                      <span key={tag} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-blue-700 mb-1 text-center flex items-center justify-center gap-1">
                    <FiCalendar /> {new Date(e.date).toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-400 mb-3 text-center flex items-center justify-center gap-1">
                    <FiMapPin /> {e.location}
                  </p>
                  <div className="flex gap-2 mt-auto justify-center">
                    {/* Share */}
                    <button
                      onClick={() => shareEvent(e)}
                      title="Share"
                      className="rounded-full p-2 hover:bg-blue-100 transition"
                    >
                      <FiShare2 className="text-blue-400" />
                    </button>
                    <a
                      href={`/events/${e._id}`}
                      className="rounded-full p-2 hover:bg-blue-100 transition"
                      title="View Event"
                    >
                      <FiCalendar className="text-blue-400" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>
        {`
        .animate-fade-in { animation: fadeIn 0.6s; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px);} to { opacity: 1; transform: none; } }
        `}
      </style>
    </>
  );
}
