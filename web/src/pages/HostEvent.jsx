import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';

const EVENT_CATEGORIES = [
  'Workshop',
  'Competition',
  'Social',
  'Seminar',
  'Other',
];

const ROOM_TYPES = [
  'Auditorium (MV Seminar Hall)',
  'Auditorium (KF Center Hall)',
  'AB3 Labs',
  'AB4 Labs',
  'AB5 Classrooms',
];

export default function HostEvent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    mode: 'online',
    roomNeeded: false,
    roomType: '',
    participants: '',
    fundingNeeded: false,
    fundingAmount: '',
    mentorApproved: false,
    date: '',
    time: '',
    subEvents: 0,
    category: '',
    contactName: '',
    contactPhone: '',
    teamStrength: '',
  });
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const update = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const validate = () => {
    if (!form.title.trim()) return 'Event title is required';
    if (!form.category) return 'Event category is required';
    if (!form.date) return 'Event date is required';
    if (!form.time) return 'Event time is required';
    if (form.mode === 'offline' && form.roomNeeded && !form.roomType) return 'Room type is required';
    if (!form.contactName.trim()) return 'Contact name is required';
    if (!form.contactPhone.trim()) return 'Contact phone is required';
    if (!form.teamStrength.trim()) return 'Team strength is required';
    if (form.fundingNeeded && (!form.fundingAmount || isNaN(Number(form.fundingAmount)) || Number(form.fundingAmount) < 0)) return 'Valid funding amount is required';
    if (form.participants && (isNaN(Number(form.participants)) || Number(form.participants) < 0)) return 'Valid number of participants is required';
    if (form.subEvents < 0) return 'Sub-events cannot be negative';
    return '';
  };

  const submit = async () => {
    setMsg('');
    const err = validate();
    if (err) {
      setMsg(err);
      return;
    }
    setBusy(true);
    try {
      const payload = {
        title: form.title.trim(),
        mode: form.mode,
        roomNeeded: form.mode === 'offline' ? form.roomNeeded : false,
        roomType: form.mode === 'offline' && form.roomNeeded ? form.roomType : '',
        participants: form.participants ? Number(form.participants) : 0,
        fundingNeeded: form.fundingNeeded,
        fundingAmount: form.fundingNeeded ? Number(form.fundingAmount) : 0,
        mentorApproved: form.mentorApproved,
        dateTime: form.date && form.time ? new Date(form.date + 'T' + form.time) : null,
        subEvents: Number(form.subEvents),
        category: form.category,
        contactName: form.contactName.trim(),
        contactPhone: form.contactPhone.trim(),
        teamStrength: form.teamStrength.trim(),
        status: 'pending_approval',
      };
      await api.post('/events', payload);
      setMsg('Event request submitted successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (e) {
      setMsg(e.response?.data?.msg || 'Failed to submit event request');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg animate-fade-in">
        <h1 className="text-3xl font-extrabold text-blue-900 mb-6">Host New Event</h1>
        {msg && <div className={`mb-4 text-center font-semibold ${msg.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{msg}</div>}
        <div className="flex flex-col gap-4">
          <label className="flex flex-col">
            <span className="font-semibold text-blue-800 mb-1">Event Title *</span>
            <input
              type="text"
              className="p-3 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-900 placeholder:text-blue-400"
              placeholder="Enter event title"
              value={form.title}
              onChange={e => update('title', e.target.value)}
              disabled={busy}
            />
          </label>

          <label className="flex flex-col">
            <span className="font-semibold text-blue-800 mb-1">Category *</span>
            <select
              className="p-3 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-900"
              value={form.category}
              onChange={e => update('category', e.target.value)}
              disabled={busy}
            >
              <option value="">Select category</option>
              {EVENT_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col">
            <span className="font-semibold text-blue-800 mb-1">Event Mode *</span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-blue-900">
                <input
                  type="radio"
                  name="mode"
                  value="online"
                  checked={form.mode === 'online'}
                  onChange={() => update('mode', 'online')}
                  disabled={busy}
                />
                Online
              </label>
              <label className="flex items-center gap-2 text-blue-900">
                <input
                  type="radio"
                  name="mode"
                  value="offline"
                  checked={form.mode === 'offline'}
                  onChange={() => update('mode', 'offline')}
                  disabled={busy}
                />
                Offline
              </label>
            </div>
          </label>

          {form.mode === 'offline' && (
            <>
              <label className="flex items-center gap-2 text-blue-900">
                <input
                  type="checkbox"
                  checked={form.roomNeeded}
                  onChange={e => update('roomNeeded', e.target.checked)}
                  disabled={busy}
                />
                Room needed?
              </label>

              {form.roomNeeded && (
                <label className="flex flex-col">
                  <span className="font-semibold text-blue-800 mb-1">Room Type *</span>
                  <select
                    className="p-3 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-900"
                    value={form.roomType}
                    onChange={e => update('roomType', e.target.value)}
                    disabled={busy}
                  >
                    <option value="">Select room type</option>
                    {ROOM_TYPES.map(room => (
                      <option key={room} value={room}>{room}</option>
                    ))}
                  </select>
                </label>
              )}
            </>
          )}

          <label className="flex flex-col">
            <span className="font-semibold text-blue-800 mb-1">Expected Participants</span>
            <input
              type="number"
              min="0"
              className="p-3 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-900 placeholder:text-blue-400"
              placeholder="How many participants?"
              value={form.participants}
              onChange={e => update('participants', e.target.value)}
              disabled={busy}
            />
          </label>

          <label className="flex items-center gap-2 text-blue-900">
            <input
              type="checkbox"
              checked={form.fundingNeeded}
              onChange={e => update('fundingNeeded', e.target.checked)}
              disabled={busy}
            />
            Funding needed?
          </label>

          {form.fundingNeeded && (
            <label className="flex flex-col">
              <span className="font-semibold text-blue-800 mb-1">Funding Amount</span>
              <input
                type="number"
                min="0"
                className="p-3 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-900 placeholder:text-blue-400"
                placeholder="Enter amount (₹)"
                value={form.fundingAmount}
                onChange={e => update('fundingAmount', e.target.value)}
                disabled={busy}
              />
            </label>
          )}

          <label className="flex items-center gap-2 text-blue-900">
            <input
              type="checkbox"
              checked={form.mentorApproved}
              onChange={e => update('mentorApproved', e.target.checked)}
              disabled={busy}
            />
            Approved by club mentor
          </label>

          <label className="flex flex-col">
            <span className="font-semibold text-blue-800 mb-1">Event Date *</span>
            <input
              type="date"
              className="p-3 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-900"
              value={form.date}
              onChange={e => update('date', e.target.value)}
              disabled={busy}
            />
          </label>

          <label className="flex flex-col">
            <span className="font-semibold text-blue-800 mb-1">Event Time *</span>
            <input
              type="time"
              className="p-3 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-900"
              value={form.time}
              onChange={e => update('time', e.target.value)}
              disabled={busy}
            />
          </label>

          <label className="flex flex-col">
            <span className="font-semibold text-blue-800 mb-1">Number of Sub-events</span>
            <input
              type="number"
              min="0"
              className="p-3 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-900 placeholder:text-blue-400"
              placeholder="e.g. 0, 1, 2..."
              value={form.subEvents}
              onChange={e => update('subEvents', e.target.value)}
              disabled={busy}
            />
          </label>

          <label className="flex flex-col">
            <span className="font-semibold text-blue-800 mb-1">Contact Name *</span>
            <input
              type="text"
              className="p-3 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-900 placeholder:text-blue-400"
              placeholder="Full Name"
              value={form.contactName}
              onChange={e => update('contactName', e.target.value)}
              disabled={busy}
            />
          </label>

          <label className="flex flex-col">
            <span className="font-semibold text-blue-800 mb-1">Contact Phone *</span>
            <input
              type="tel"
              className="p-3 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-900 placeholder:text-blue-400"
              placeholder="Phone number"
              value={form.contactPhone}
              onChange={e => update('contactPhone', e.target.value)}
              disabled={busy}
            />
          </label>

          <label className="flex flex-col">
            <span className="font-semibold text-blue-800 mb-1">Team Strength *</span>
            <input
              type="text"
              className="p-3 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-900 placeholder:text-blue-400"
              placeholder="e.g. 5, 10, etc."
              value={form.teamStrength}
              onChange={e => update('teamStrength', e.target.value)}
              disabled={busy}
            />
          </label>

          <button
            onClick={submit}
            disabled={busy}
            className={`w-full py-3 rounded-lg font-bold text-lg transition-all duration-200 mt-4 shadow
              ${busy
                ? 'bg-blue-900 text-blue-400 cursor-not-allowed'
                : 'bg-blue-700 text-white hover:bg-blue-800 hover:scale-105 hover:shadow-lg'}`}
          >
            {busy ? 'Submitting…' : 'Submit Event Request'}
          </button>
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
