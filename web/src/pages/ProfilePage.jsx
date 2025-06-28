import { useEffect, useState } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import { FiAward } from 'react-icons/fi';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState('');
  const [picPreview, setPicPreview] = useState('');

  useEffect(() => {
    api.get('/profile').then(r => {
      setProfile(r.data);
      setForm({
        phone: r.data.phone || '',
        bio: r.data.bio || '',
      });
      setPicPreview(r.data.profilePic || '');
    });
  }, []);

  const handlePic = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPicPreview(ev.target.result);
    reader.readAsDataURL(file);
    setForm(f => ({ ...f, profilePic: file }));
  };

  const save = async () => {
    let payload = { ...form };
    if (form.profilePic && typeof form.profilePic !== 'string') {
      const reader = new FileReader();
      reader.onload = async ev => {
        payload.profilePic = ev.target.result;
        await api.put('/profile', payload);
        setEdit(false);
        setMsg('Profile updated!');
        api.get('/profile').then(r => setProfile(r.data));
      };
      reader.readAsDataURL(form.profilePic);
      return;
    }
    await api.put('/profile', payload);
    setEdit(false);
    setMsg('Profile updated!');
    api.get('/profile').then(r => setProfile(r.data));
  };

  if (!profile) return null;

  const regList = profile.registrations || [];
  const badges = profile.badges || [];
  const points = profile.points || 0;

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto mt-10 bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
          <div className="flex flex-col items-center">
            <img
              src={picPreview || '/default-avatar.png'}
              alt="profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 shadow"
            />
            {edit && (
              <input
                type="file"
                accept="image/*"
                className="mt-3 block text-blue-900"
                onChange={handlePic}
              />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-extrabold mb-1 text-blue-900">
              {profile.name}{' '}
              <span className="text-base text-blue-400 font-semibold">({profile.role})</span>
            </h2>
            <div className="text-blue-600 text-sm mb-3">{profile.email}</div>
            <div className="flex flex-wrap gap-4 text-sm mb-2">
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
                    <span className="font-semibold text-blue-900">Year of Study:</span>{' '}
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
            </div>
            <div className="flex gap-4 mt-2 text-sm mb-2">
              <span>
                <span className="font-semibold text-blue-900">Phone:</span>{' '}
                {edit ? (
                  <input
                    className="bg-blue-50 border border-blue-200 p-1 rounded text-blue-900 placeholder:text-blue-400"
                    placeholder="Enter phone"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  />
                ) : (
                  <span className="text-blue-800">{profile.phone || <span className="text-blue-400">Not set</span>}</span>
                )}
              </span>
            </div>
            <div className="mt-2 text-sm mb-2">
              <span className="font-semibold text-blue-900">Bio:</span>{' '}
              {edit ? (
                <input
                  className="bg-blue-50 border border-blue-200 p-1 rounded w-64 text-blue-900 placeholder:text-blue-400"
                  placeholder="Enter bio"
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                />
              ) : (
                <span className="text-blue-800">{profile.bio || <span className="text-blue-400">No bio</span>}</span>
              )}
            </div>
            <div className="flex gap-6 mt-4 items-center">
              <span className="bg-blue-100 text-blue-900 px-3 py-1 rounded-full font-semibold flex items-center gap-1 shadow animate-fade-in">
                <FiAward className="inline" /> Points: {points}
              </span>
              {badges.length > 0 && (
                <span className="bg-blue-100 text-blue-900 px-3 py-1 rounded-full font-semibold flex items-center gap-1 shadow animate-fade-in">
                  <FiAward className="inline" /> Badges: {badges.length}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {badges.map((badge, i) => (
                <span key={i} className="bg-blue-50 text-blue-900 px-2 py-1 rounded-full flex items-center gap-1 border border-blue-200 shadow-sm animate-fade-in">
                  <FiAward /> {badge}
                </span>
              ))}
            </div>
            <div className="mt-6 flex gap-2">
              {edit ? (
                <>
                  <button
                    onClick={save}
                    className="px-5 py-2 bg-blue-700 text-white rounded shadow hover:bg-blue-800 transition-all duration-200"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEdit(false)}
                    className="px-5 py-2 border border-blue-200 rounded shadow hover:bg-blue-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEdit(true)}
                  className="px-5 py-2 border border-blue-200 rounded shadow hover:bg-blue-50 transition-all duration-200"
                >
                  Edit Profile
                </button>
              )}
            </div>
            {msg && <div className="text-green-500 mt-2 animate-fade-in">{msg}</div>}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-blue-900">Events Registered</h3>
          {regList.length === 0 ? (
            <div className="text-blue-400 text-center">No registrations yet.</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {regList.map(reg => (
                <div key={reg._id} className="bg-blue-50 rounded-xl p-4 flex flex-col items-center shadow animate-fade-in">
                  <div className="font-bold text-blue-900">{reg.event?.title || 'Event'}</div>
                  <div className="text-xs text-blue-500 mb-2">{reg.event?.date ? new Date(reg.event.date).toLocaleDateString() : ''}</div>
                  <div className="mb-2">
                    <span className={`inline-block text-xs px-3 py-1 rounded-full font-semibold
                      ${reg.checkedIn ? "bg-blue-700 text-white" : "bg-blue-200 text-blue-800"}`}>
                      {reg.checkedIn ? "Checked-in" : "Registered"}
                    </span>
                  </div>
                  {reg.qr && (
                    <img src={reg.qr} alt="QR" className="w-16 h-16 mx-auto mt-2 rounded shadow" />
                  )}
                </div>
              ))}
            </div>
          )}
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
