import { useEffect, useState } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import DashboardBoss from './DashboardBoss';
import DashboardAdmin from './DashboardAdmin';
import DashboardStudent from './DashboardStudent';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/profile')
      .then(r => {
        setUser(r.data);
        setError('');
      })
      .catch(() => {
        setError('Failed to load user profile');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <>
      <Navbar />
      <div className="text-center text-blue-400 mt-20">Loading…</div>
    </>
  );

  if (error) return (
    <>
      <Navbar />
      <div className="text-center text-red-500 mt-20">{error}</div>
    </>
  );

  if (!user) return (
    <>
      <Navbar />
      <div className="text-center text-blue-400 mt-20">No user data available.</div>
    </>
  );

  if (user.role === 'boss') return <DashboardBoss user={user} />;
  if (user.role === 'admin') return <DashboardAdmin user={user} />;
  return <DashboardStudent user={user} />;
}
