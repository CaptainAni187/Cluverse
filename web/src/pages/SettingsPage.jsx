import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api";

export default function SettingsPage() {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirm: "" });
  const [notif, setNotif] = useState({ email: true, sms: false, push: true });
  const [msg, setMsg] = useState("");

  const handlePassword = async e => {
    e.preventDefault();
    setMsg("");
    if (form.newPassword !== form.confirm) {
      setMsg("New passwords do not match.");
      return;
    }
    try {
      await api.post("/profile/change-password", {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });
      setMsg("Password updated!");
      setForm({ oldPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      setMsg("Error: " + (err.response?.data?.msg || err.message));
    }
  };

  const handleNotif = async n => {
    setNotif(n);
    // Optionally send to API:
    // await api.put("/profile/notifications", n);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl animate-fade-in">
        <h1 className="text-3xl font-extrabold text-blue-900 mb-6 text-center">Settings</h1>

        {/* Password Section */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-blue-700 mb-2">Change Password</h2>
          <form className="flex flex-col gap-4" onSubmit={handlePassword}>
            <input
              type="password"
              className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-blue-900 placeholder:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Current Password"
              value={form.oldPassword}
              onChange={e => setForm(f => ({ ...f, oldPassword: e.target.value }))}
              required
            />
            <input
              type="password"
              className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-blue-900 placeholder:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="New Password"
              value={form.newPassword}
              onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
              required
            />
            <input
              type="password"
              className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-blue-900 placeholder:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Confirm New Password"
              value={form.confirm}
              onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-700 text-white font-bold py-3 rounded-lg shadow hover:bg-blue-800 transition text-lg"
            >
              Update Password
            </button>
          </form>
          {msg && (
            <div className={`mt-2 text-center font-semibold ${msg.startsWith("Error") ? "text-red-500" : "text-green-600"}`}>
              {msg}
            </div>
          )}
        </div>

        {/* Notification Preferences */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-blue-700 mb-2">Notification Preferences</h2>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={notif.email}
                onChange={e => handleNotif({ ...notif, email: e.target.checked })}
                className="accent-blue-700 w-5 h-5"
              />
              <span className="text-blue-900 font-medium">Email Notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={notif.sms}
                onChange={e => handleNotif({ ...notif, sms: e.target.checked })}
                className="accent-blue-700 w-5 h-5"
              />
              <span className="text-blue-900 font-medium">SMS Notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={notif.push}
                onChange={e => handleNotif({ ...notif, push: e.target.checked })}
                className="accent-blue-700 w-5 h-5"
              />
              <span className="text-blue-900 font-medium">Push Notifications</span>
            </label>
          </div>
        </div>

        {/* Account Actions */}
        <div>
          <h2 className="text-xl font-bold text-blue-700 mb-2">Account</h2>
          <button
            className="w-full bg-red-50 text-red-600 font-bold py-3 rounded-lg border border-red-200 hover:bg-red-100 transition text-lg"
            // onClick={handleDeleteAccount}
            disabled
            title="Feature coming soon"
          >
            Delete Account
          </button>
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
