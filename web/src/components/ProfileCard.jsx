import { FiAward, FiEdit2 } from 'react-icons/fi';

export default function ProfileCard({
  profile,
  onEdit = null, // optional edit handler
  editable = false,
}) {
  if (!profile) return null;

  const badges = profile.badges || [];
  const points = profile.points || 0;

  return (
    <div className="w-full max-w-lg mx-auto bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-2xl shadow-xl p-8 flex flex-col items-center relative animate-fade-in">
      {/* Edit button */}
      {editable && onEdit && (
        <button
          className="absolute top-5 right-5 p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 shadow transition"
          onClick={onEdit}
          title="Edit Profile"
        >
          <FiEdit2 size={20} />
        </button>
      )}

      {/* Profile picture */}
      <div className="mb-4 animate-pop-in">
        <img
          src={profile.profilePic || '/default-avatar.png'}
          alt="profile"
          className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 shadow"
        />
      </div>

      {/* Name and role */}
      <h2 className="text-3xl font-extrabold text-blue-900 mb-1 text-center">
        {profile.name}
      </h2>
      <div className="text-base text-blue-400 mb-2 text-center capitalize font-semibold">
        ({profile.role})
      </div>
      <div className="text-blue-600 text-sm mb-4 text-center">{profile.email}</div>

      {/* Role-specific details */}
      <div className="flex flex-wrap gap-4 justify-center text-sm mb-3">
        {profile.role === 'student' && (
          <>
            <span>
              <span className="font-semibold text-blue-900">Branch:</span>{' '}
              <span className="text-blue-800">{profile.branch || <span className="text-blue-400">Not set</span>}</span>
            </span>
            <span>
              <span className="font-semibold text-blue-900">Year:</span>{' '}
              <span className="text-blue-800">{profile.yearOfJoin || <span className="text-blue-400">Not set</span>}</span>
            </span>
            <span>
              <span className="font-semibold text-blue-900">Study:</span>{' '}
              <span className="text-blue-800">{profile.yearOfStudy || <span className="text-blue-400">Not set</span>}</span>
            </span>
          </>
        )}
        {profile.role === 'admin' && (
          <>
            <span>
              <span className="font-semibold text-blue-900">Club:</span>{' '}
              <span className="text-blue-800">{profile.clubName || <span className="text-blue-400">Not set</span>}</span>
            </span>
            <span>
              <span className="font-semibold text-blue-900">Category:</span>{' '}
              <span className="text-blue-800">{profile.category || <span className="text-blue-400">Not set</span>}</span>
            </span>
          </>
        )}
        {profile.role === 'boss' && (
          <span className="text-blue-700 font-semibold">SWO Boss</span>
        )}
      </div>

      {/* Phone and Bio */}
      <div className="w-full flex flex-col sm:flex-row gap-4 justify-center text-sm mb-2">
        <span>
          <span className="font-semibold text-blue-900">Phone:</span>{' '}
          <span className="text-blue-800">{profile.phone || <span className="text-blue-400">Not set</span>}</span>
        </span>
        <span>
          <span className="font-semibold text-blue-900">Bio:</span>{' '}
          <span className="text-blue-800">{profile.bio || <span className="text-blue-400">No bio</span>}</span>
        </span>
      </div>

      {/* Points and Badges */}
      <div className="flex gap-6 mt-4 items-center flex-wrap justify-center">
        <span className="bg-blue-100 text-blue-900 px-4 py-1 rounded-full font-semibold flex items-center gap-1 shadow animate-fade-in">
          <FiAward className="inline" /> Points: {points}
        </span>
        {badges.length > 0 && (
          <span className="bg-blue-100 text-blue-900 px-4 py-1 rounded-full font-semibold flex items-center gap-1 shadow animate-fade-in">
            <FiAward className="inline" /> Badges: {badges.length}
          </span>
        )}
      </div>

      {/* Individual Badges */}
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 justify-center">
          {badges.map((badge, i) => (
            <span key={i} className="bg-blue-50 text-blue-900 px-3 py-1 rounded-full flex items-center gap-1 border border-blue-200 shadow-sm animate-fade-in">
              <FiAward /> {badge}
            </span>
          ))}
        </div>
      )}

      <style>
        {`
        .animate-fade-in { animation: fadeIn 0.7s; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px);} to { opacity: 1; transform: none; } }
        .animate-pop-in { animation: popIn 0.5s; }
        @keyframes popIn { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        `}
      </style>
    </div>
  );
}
