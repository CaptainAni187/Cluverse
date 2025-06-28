import { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Navbar from '../components/Navbar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Demo events; replace with API data if available
const events = [
  {
    id: 1,
    title: 'Workshop on AI',
    start: new Date(2025, 5, 10, 10, 0),
    end: new Date(2025, 5, 10, 12, 0),
    category: 'Workshop',
  },
  {
    id: 2,
    title: 'Coding Competition',
    start: new Date(2025, 5, 15, 14, 0),
    end: new Date(2025, 5, 15, 17, 0),
    category: 'Competition',
  },
  {
    id: 3,
    title: 'Social Gathering',
    start: new Date(2025, 5, 20, 18, 0),
    end: new Date(2025, 5, 20, 21, 0),
    category: 'Social',
  },
];

const categoryColors = {
  Workshop: '#3b82f6',      // blue-500
  Competition: '#2563eb',   // blue-700
  Social: '#60a5fa',        // blue-400
};

const localizer = momentLocalizer(moment);

export default function CalendarPage() {
  const [allEvents] = useState(events);

  // Color code events by category
  const eventStyleGetter = (event) => {
    const backgroundColor = categoryColors[event.category] || '#3b82f6';
    const style = {
      backgroundColor,
      borderRadius: '8px',
      opacity: 0.95,
      color: 'white',
      border: 'none',
      paddingLeft: '10px',
      paddingRight: '10px',
      fontWeight: '600',
      boxShadow: '0 2px 8px 0 rgba(59,130,246,0.08)',
      transition: 'transform 0.2s',
    };
    return { style };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-white">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-6 text-center drop-shadow-lg">
          Event Calendar
        </h1>
        <div className="flex justify-center gap-4 mb-6">
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full inline-block" style={{ background: categoryColors.Workshop }} /> 
            <span className="text-blue-700 font-semibold">Workshop</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full inline-block" style={{ background: categoryColors.Competition }} /> 
            <span className="text-blue-700 font-semibold">Competition</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full inline-block" style={{ background: categoryColors.Social }} /> 
            <span className="text-blue-700 font-semibold">Social</span>
          </span>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-4">
          <Calendar
            localizer={localizer}
            events={allEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600, borderRadius: '1rem' }}
            eventPropGetter={eventStyleGetter}
            popup
            showMultiDayTimes
          />
        </div>
      </div>
      {/* Fade-in animation */}
      <style>
        {`
        .rbc-event {
          transition: transform 0.2s;
        }
        .rbc-event:hover {
          transform: scale(1.03);
          z-index: 2;
          box-shadow: 0 4px 16px 0 rgba(59,130,246,0.15);
        }
        `}
      </style>
    </div>
  );
}
