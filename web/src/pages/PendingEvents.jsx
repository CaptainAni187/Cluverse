import { useEffect, useState } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import { FiCheck, FiX, FiEdit3 } from 'react-icons/fi';

export default function PendingEvents() {
  const [events, setEvents] = useState([]);
  const [busyId, setBusyId] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPending();
    // eslint-disable-next-line
  }, []);

  const fetchPending = async () => {
    setError('');
    try {
      const res = await api.get('/admin/pending-events');
      setEvents(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Failed to load pending events');
    }
  };

  const handleAction = async (id, action, feedback = '') => {
    setBusyId(id);
    setMsg('');
    try {
      await api.post(`/admin/event-action/${id}`, { action, feedback });
      setEvents(events.filter(ev => ev._id !== id));
      setMsg(`Event ${action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'sent for changes'}!`);
    } catch (e) {
      setMsg(e.response?.data?.msg || 'Action failed');
    } finally {
      setBusyId('');
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto mt-10 px-4">
        <h1 className="text-3xl font-extrabold text-blue-900 text-center mb-8 drop-shadow">
          Pending Event Requests
        </h1>
        {msg && <div className="text-center mb-4 text-green-600 font-semibold animate-fade-in">{msg}</div>}
        {error && <div className="text-center mb-4 text-red-600 font-semibold">{error}</div>}
        {events.length === 0 && !error ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center text-blue-400 text-lg">
            No pending event requests.
          </div>
        ) : (
          <div className="space-y-8">
            {events.map(ev => (
              <EventCard
                key={ev._id}
                event={ev}
                busy={busyId === ev._id}
                onApprove={() => handleAction(ev._id, 'approve')}
                onReject={() => handleAction(ev._id, 'reject')}
                onRequestChanges={() => {
                  const feedback = prompt('Enter feedback or required changes for this event:');
                  if (feedback !== null) handleAction(ev._id, 'changes', feedback);
                }}
              />
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

function EventCard({ event, busy, onApprove, onReject, onRequestChanges }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-2xl shadow-lg p-6 border border-blue-100 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
        <div>
          <div className="font-bold text-blue-900 text-lg">{event.title}</div>
          <div className="text-blue-500 text-sm mb-2">{event.category}</div>
        </div>
        <div className="flex gap-2 mt-2 sm:mt-0">
          <span className={`px-3 py-1 rounded-full text-xs font-bold 
            ${event.status === 'pending_approval'
              ? 'bg-yellow-100 text-yellow-700'
              : event.status === 'approved'
                ? 'bg-green-100 text-green-700'
                : event.status === 'rejected'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-blue-100 text-blue-700'
            }`}>
            {event.status?.replace('_', ' ') || 'pending'}
          </span>
        </div>
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-4">
        <Info label="Mode" value={event.mode?.charAt(0).toUpperCase() + event.mode?.slice(1)} />
        <Info label="Room Needed" value={event.roomNeeded ? 'Yes' : 'No'} />
        {event.roomNeeded && <Info label="Room Type" value={event.roomType} />}
        <Info label="Date & Time" value={event.dateTime ? new Date(event.dateTime).toLocaleString() : ''} />
        <Info label="Participants" value={event.participants || 'N/A'} />
        <Info label="Funding Needed" value={event.fundingNeeded ? `Yes (${event.fundingAmount})` : 'No'} />
        <Info label="Mentor Approved" value={event.mentorApproved ? 'Yes' : 'No'} />
        <Info label="Sub-events" value={event.subEvents || '0'} />
        <Info label="Contact Name" value={event.contactName} />
        <Info label="Contact Phone" value={event.contactPhone} />
        <Info label="Team Strength" value={event.teamStrength} />
        <Info label="Requested By" value={event.adminName || event.createdBy?.name || ''} />
      </dl>
      <div className="flex flex-wrap gap-3 mt-4">
        <button
          onClick={onApprove}
          disabled={busy}
          className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-base shadow transition-all
            ${busy ? 'bg-blue-200 text-blue-400 cursor-not-allowed'
              : 'bg-green-700 text-white hover:bg-green-800 hover:scale-105 hover:shadow-lg'}
          `}
        >
          <FiCheck /> Approve
        </button>
        <button
          onClick={onReject}
          disabled={busy}
          className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-base shadow transition-all
            ${busy ? 'bg-blue-200 text-blue-400 cursor-not-allowed'
              : 'bg-red-700 text-white hover:bg-red-800 hover:scale-105 hover:shadow-lg'}
          `}
        >
          <FiX /> Reject
        </button>
        <button
          onClick={onRequestChanges}
          disabled={busy}
          className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-base shadow transition-all
            ${busy ? 'bg-blue-200 text-blue-400 cursor-not-allowed'
              : 'bg-yellow-600 text-white hover:bg-yellow-700 hover:scale-105 hover:shadow-lg'}
          `}
        >
          <FiEdit3 /> Request Changes
        </button>
      </div>
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
