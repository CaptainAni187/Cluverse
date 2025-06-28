import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const categories = [
  'Workshop',
  'Competition',
  'Social',
  'Seminar',
  'Sports',
  'Other',
];

export default function AddEventPage() {
  const [f, setF] = useState({});
  const [msg, setMsg] = useState('');
  const [imgPreview, setImgPreview] = useState('');
  const nav = useNavigate();

  const handleImg = e => {
    const file = e.target.files[0];
    if (!file) return;
    setF(f => ({ ...f, image: file }));
    const reader = new FileReader();
    reader.onload = ev => setImgPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    for (const k in f) formData.append(k, f[k]);
    try {
      await api.post('/events', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMsg('Event created!');
      setTimeout(() => nav('/'), 1200);
    } catch (err) {
      setMsg('Error: ' + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full flex flex-col gap-6 animate-fade-in"
        style={{ marginTop: 40, marginBottom: 40 }}
      >
        <h1 className="text-3xl font-extrabold text-blue-900 text-center mb-2">Create New Event</h1>
        <p className="text-blue-500 text-center mb-2">Fill in the details and make your event shine!</p>

        {/* Title */}
        <div className="relative">
          <input
            required
            className="peer w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-blue-900 font-semibold placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Event Title"
            onChange={e => setF({ ...f, title: e.target.value })}
          />
          <label className="absolute left-4 top-1.5 text-blue-400 text-sm pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1.5 peer-focus:text-sm">
            Event Title
          </label>
        </div>

        {/* Description */}
        <div className="relative">
          <textarea
            required
            rows={3}
            className="peer w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-blue-900 font-medium placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
            placeholder="Event Description"
            onChange={e => setF({ ...f, description: e.target.value })}
          />
          <label className="absolute left-4 top-1.5 text-blue-400 text-sm pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1.5 peer-focus:text-sm">
            Description
          </label>
        </div>

        {/* Date & Time */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <input
              required
              type="datetime-local"
              className="peer w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-blue-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              onChange={e => setF({ ...f, date: e.target.value })}
            />
            <label className="absolute left-4 top-1.5 text-blue-400 text-sm pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1.5 peer-focus:text-sm">
              Date & Time
            </label>
          </div>
        </div>

        {/* Venue */}
        <div className="relative">
          <input
            required
            className="peer w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-blue-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Venue"
            onChange={e => setF({ ...f, venue: e.target.value })}
          />
          <label className="absolute left-4 top-1.5 text-blue-400 text-sm pointer-events-none transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1.5 peer-focus:text-sm">
            Venue
          </label>
        </div>

        {/* Categories/Tags */}
        <div>
          <div className="mb-2 text-blue-700 font-semibold">Category/Tags</div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                type="button"
                key={cat}
                onClick={() =>
                  setF(f => ({
                    ...f,
                    tags: f.tags?.includes(cat)
                      ? f.tags.filter(t => t !== cat)
                      : [...(f.tags || []), cat],
                  }))
                }
                className={`px-4 py-1 rounded-full border transition font-semibold
                  ${f.tags?.includes(cat)
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'}
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <div className="mb-2 text-blue-700 font-semibold">Event Banner (optional)</div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImg}
            className="block w-full text-blue-700"
          />
          {imgPreview && (
            <img
              src={imgPreview}
              alt="Preview"
              className="mt-2 rounded-lg shadow w-full max-h-40 object-cover"
            />
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-700 text-white font-bold py-3 rounded-lg shadow hover:bg-blue-800 transition text-lg"
        >
          Create Event
        </button>
        {msg && (
          <div className={`text-center mt-2 font-semibold ${msg.startsWith('Error') ? 'text-red-500' : 'text-green-600'}`}>
            {msg}
          </div>
        )}
      </form>
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
