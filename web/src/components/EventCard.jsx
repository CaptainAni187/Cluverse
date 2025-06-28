export default function EventCard({ e, status, onClick }) {
  return (
    <div
      className="bg-[var(--bg-card)] rounded-xl shadow-card overflow-hidden flex flex-col cursor-pointer hover:scale-[1.02] transition"
      onClick={onClick}
    >
      <div className="h-32 bg-[#2d3649] flex items-center justify-center">
        {e.imageUrl ? (
          <img src={e.imageUrl} className="h-full w-full object-cover" alt={e.title}/>
        ) : (
          <span className="text-gray-500 text-sm">No Image</span>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold mb-1">{e.title}</h3>
        <p className="text-xs text-gray-400 mb-2">
          {new Date(e.date).toLocaleString()}
        </p>
        {status && (
          <span className={`inline-block text-xs px-2 py-1 rounded-full mb-2
            ${status === "Checked-in" ? "bg-green-600 text-white" : "bg-blue-600 text-white"}`}>
            {status}
          </span>
        )}
        <button
          className="mt-auto w-full border border-[var(--accent)] text-[var(--accent)] rounded py-1
                     hover:bg-[var(--accent)] hover:text-[var(--bg-card)] transition"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
