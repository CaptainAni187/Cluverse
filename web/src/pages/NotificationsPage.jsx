import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { FiBell, FiCalendar, FiCheckCircle, FiInfo } from "react-icons/fi";

// Demo notifications; replace with real API data if available
const demoNotifications = [
  {
    id: 1,
    type: "event",
    title: "New Event: AI Workshop",
    message: "Registration is now open for the AI Workshop.",
    time: "2025-06-28T10:00:00Z",
    icon: <FiCalendar />,
    color: "bg-blue-50 text-blue-700",
  },
  {
    id: 2,
    type: "reminder",
    title: "Event Reminder",
    message: "Don't forget: Coding Competition starts in 2 hours.",
    time: "2025-06-27T16:00:00Z",
    icon: <FiBell />,
    color: "bg-blue-100 text-blue-900",
  },
  {
    id: 3,
    type: "success",
    title: "Registration Successful",
    message: "You have successfully registered for Social Gathering.",
    time: "2025-06-25T12:00:00Z",
    icon: <FiCheckCircle />,
    color: "bg-blue-200 text-blue-900",
  },
  {
    id: 4,
    type: "info",
    title: "New Badge Earned!",
    message: "You earned the 'Early Bird' badge.",
    time: "2025-06-20T09:30:00Z",
    icon: <FiInfo />,
    color: "bg-blue-50 text-blue-700",
  },
];

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export default function NotificationsPage() {
  // Replace demoNotifications with real API data if available
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Replace with: api.get("/notifications").then(r => setNotifications(r.data));
    setTimeout(() => setNotifications(demoNotifications), 500);
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto mt-10 px-4">
        <h1 className="text-3xl font-extrabold text-blue-900 mb-8 text-center flex items-center justify-center gap-2">
          <FiBell className="text-blue-400" size={32} /> Notifications
        </h1>
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-24 animate-fade-in">
            <FiBell size={48} className="text-blue-100 mb-4" />
            <div className="text-xl text-blue-400 font-semibold mb-2">No Notifications</div>
            <div className="text-blue-300">You’re all caught up!</div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {notifications.map(n => (
              <div
                key={n.id}
                className={`flex items-start gap-4 rounded-xl shadow-md p-5 ${n.color} animate-fade-in`}
              >
                <div className="text-2xl mt-1">{n.icon}</div>
                <div className="flex-1">
                  <div className="font-bold text-blue-900">{n.title}</div>
                  <div className="text-blue-600 mb-1">{n.message}</div>
                  <div className="text-xs text-blue-400">{formatTime(n.time)}</div>
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
