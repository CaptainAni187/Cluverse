import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { FiUsers, FiUserPlus, FiArrowLeft } from 'react-icons/fi';

export default function TeamPage() {
  const { id } = useParams();   // registration id
  const nav = useNavigate();
  const [reg, setReg] = useState(null);

  useEffect(() => {
    api.get(`/registrations/${id}`).then(r => setReg(r.data));
  }, [id]);

  if (!reg) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="text-blue-400 text-xl font-semibold">Loading team info…</div>
    </div>
  );

  const eventTitle = reg.event?.title || "Event";
  const teamName = reg.teamName || "My Team";
  const members = reg.members || [];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-white">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
        {/* Back button */}
        <button
          onClick={() => nav(-1)}
          className="text-blue-500 hover:text-blue-700 font-bold mb-4 flex items-center gap-1"
        >
          <FiArrowLeft /> Back
        </button>

        {/* Header */}
        <h2 className="text-2xl font-extrabold text-blue-900 text-center mb-2 flex items-center justify-center gap-2">
          <FiUsers /> {teamName}
        </h2>
        <p className="text-blue-500 text-center mb-4">{eventTitle}</p>

        {/* QR code */}
        <div className="flex justify-center mb-6">
          {reg.qr ? (
            <img src={reg.qr} className="w-36 h-36 rounded-xl shadow border border-blue-100 bg-white" alt="QR Code" />
          ) : (
            <div className="w-36 h-36 flex items-center justify-center bg-blue-100 rounded-xl text-blue-300">
              No QR
            </div>
          )}
        </div>

        {/* Members Table */}
        <div className="mb-6">
          <h3 className="text-blue-700 font-semibold mb-2">Team Members</h3>
          <div className="overflow-x-auto">
            <table className="w-full bg-blue-50 rounded-lg shadow text-blue-900">
              <thead>
                <tr className="text-blue-500 text-left">
                  <th className="p-2">Name</th>
                  <th className="p-2">ID</th>
                </tr>
              </thead>
              <tbody>
                {members.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="p-2 text-blue-300 text-center">No members yet</td>
                  </tr>
                ) : (
                  members.map((m, i) => (
                    <tr key={i} className="border-t border-blue-100">
                      <td className="p-2">{m.name}</td>
                      <td className="p-2">{m.collegeId}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Member Button */}
        <button
          className="w-full flex items-center justify-center gap-2 bg-blue-700 text-white font-semibold rounded-lg py-3 shadow hover:bg-blue-800 transition text-lg"
          // onClick={} // Add your member-adding logic here
        >
          <FiUserPlus /> Add Member
        </button>
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
