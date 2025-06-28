import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { FiAward, FiStar, FiCheckCircle } from "react-icons/fi";

const demoAchievements = [
  {
    title: "Event Explorer",
    description: "Attended 5 different events",
    icon: <FiAward />,
    date: "2025-06-10",
    color: "bg-blue-100 text-blue-800",
  },
  {
    title: "Early Bird",
    description: "Registered for an event within 24 hours of announcement",
    icon: <FiStar />,
    date: "2025-05-28",
    color: "bg-blue-50 text-blue-700",
  },
  {
    title: "Team Player",
    description: "Participated in a team event",
    icon: <FiCheckCircle />,
    date: "2025-04-18",
    color: "bg-blue-200 text-blue-900",
  },
  // Add more demo achievements as needed
];

export default function AchievementsPage() {
  // Replace demoAchievements with real API data if available
  const [achievements, setAchievements] = useState(demoAchievements);
  const [points, setPoints] = useState(120); // Replace with real points if available

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto mt-10 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-blue-900 mb-2">Your Achievements</h1>
          <p className="text-blue-500 mb-4">Celebrate your journey and milestones in Cluverse!</p>
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="bg-blue-100 text-blue-900 px-4 py-2 rounded-full font-semibold flex items-center gap-2 text-lg shadow">
              <FiAward className="inline" /> Points: {points}
            </span>
            <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-semibold flex items-center gap-2 text-lg shadow">
              <FiStar className="inline" /> Badges: {achievements.length}
            </span>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {achievements.length === 0 ? (
            <div className="col-span-full text-center text-blue-400 text-lg">
              No achievements yet. Attend events to earn badges!
            </div>
          ) : (
            achievements.map((ach, i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 flex flex-col items-center shadow-lg border border-blue-100 animate-fade-in ${ach.color}`}
                style={{ minHeight: 180 }}
              >
                <div className="text-4xl mb-3">{ach.icon}</div>
                <h3 className="text-xl font-bold mb-1">{ach.title}</h3>
                <p className="text-blue-500 mb-2 text-center">{ach.description}</p>
                <span className="text-xs text-blue-400 mt-auto">Earned on {new Date(ach.date).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Simple fade-in animation */}
      <style>
        {`
        .animate-fade-in { animation: fadeIn 0.6s; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: none; } }
        `}
      </style>
    </>
  );
}
