import { useEffect, useState } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import { FiUsers, FiSearch } from 'react-icons/fi';

export default function AllUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/admin/users')
      .then(res => {
        setUsers(res.data);
        setFilteredUsers(res.data);
        setError('');
      })
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredUsers(users);
    } else {
      const lowerSearch = search.toLowerCase();
      setFilteredUsers(users.filter(u =>
        u.name.toLowerCase().includes(lowerSearch) ||
        u.email.toLowerCase().includes(lowerSearch) ||
        (u.role && u.role.toLowerCase().includes(lowerSearch)) ||
        (u.clubName && u.clubName.toLowerCase().includes(lowerSearch))
      ));
    }
  }, [search, users]);

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto mt-10 px-4">
        <h1 className="text-3xl font-extrabold text-blue-900 mb-6 flex items-center gap-2">
          <FiUsers className="text-blue-400" /> All Users
        </h1>

        <div className="mb-6">
          <label htmlFor="search" className="block text-blue-800 font-semibold mb-2">Search Users</label>
          <div className="relative max-w-md">
            <input
              id="search"
              type="text"
              placeholder="Search by name, email, role, or club"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full p-3 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
          </div>
        </div>

        {loading ? (
          <div className="text-center text-blue-400">Loading users...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center text-blue-400">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-blue-200 rounded-lg shadow-sm">
              <thead className="bg-blue-100 text-blue-900">
                <tr>
                  <th className="p-3 text-left border-b border-blue-200">Name</th>
                  <th className="p-3 text-left border-b border-blue-200">Email</th>
                  <th className="p-3 text-left border-b border-blue-200">Role</th>
                  <th className="p-3 text-left border-b border-blue-200">Club</th>
                  <th className="p-3 text-left border-b border-blue-200">Approved</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user._id} className="hover:bg-blue-50 transition">
                    <td className="p-3 border-b border-blue-100 font-semibold text-blue-800">{user.name}</td>
                    <td className="p-3 border-b border-blue-100 text-blue-700">{user.email}</td>
                    <td className="p-3 border-b border-blue-100 capitalize text-blue-700">{user.role}</td>
                    <td className="p-3 border-b border-blue-100 text-blue-700">{user.clubName || '-'}</td>
                    <td className="p-3 border-b border-blue-100 text-center">
                      {user.approved ? (
                        <span className="text-green-600 font-semibold">Yes</span>
                      ) : (
                        <span className="text-red-600 font-semibold">No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
