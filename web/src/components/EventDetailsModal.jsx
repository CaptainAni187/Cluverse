export default function EventDetailsModal({ reg, onClose }) {
  const e = reg.event;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[var(--bg-card)] rounded-xl shadow-card max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-white"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-2">{e.title}</h2>
        <div className="mb-2 text-gray-400">{new Date(e.date).toLocaleString()}</div>
        <div className="h-40 bg-[#2d3649] rounded mb-4 flex items-center justify-center">
          {e.imageUrl ? (
            <img src={e.imageUrl} className="h-full w-full object-cover rounded" alt={e.title}/>
          ) : (
            <span className="text-gray-500">No Image</span>
          )}
        </div>
        <p className="mb-4 whitespace-pre-line">{e.description}</p>
        <div className="mb-4">
          <span className="font-semibold">Status:</span>{" "}
          <span className={reg.checkedIn ? "text-green-400" : "text-blue-400"}>
            {reg.checkedIn ? "Checked-in" : "Registered"}
          </span>
        </div>
        {reg.qr && (
          <div className="mb-4 flex flex-col items-center">
            <span className="text-xs text-gray-400 mb-1">Your QR for check-in:</span>
            <img src={reg.qr} alt="QR code" className="w-32 h-32" />
          </div>
        )}
        {reg.members && reg.members.length > 0 && (
          <div className="mb-2">
            <span className="font-semibold">Team:</span>
            <ul className="text-sm ml-4 mt-1 list-disc">
              {reg.members.map((m, i) => (
                <li key={i}>{m.name} ({m.collegeId})</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
