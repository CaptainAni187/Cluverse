import { Routes, Route, Navigate } from 'react-router-dom';

import Home            from './pages/HomePage';
import Login           from './pages/LoginPage';
import Register        from './pages/RegisterPage';
import Event           from './pages/EventPage';
import Team            from './pages/TeamPage';

import AddEvent        from './pages/AddEventPage';
import EditEvent       from './pages/EditEventPage';
import Analytics       from './pages/DashboardPage';
import Checkin         from './pages/CheckinPage';
import MyEventsPage    from './pages/MyEventsPage';
import Approvals       from './pages/ApproveClubsPage';
import ProfilePage     from './pages/ProfilePage';
import SocialSuccess   from './pages/SocialSuccess';

import BookmarksPage      from './pages/BookmarksPage';
import NotificationsPage  from './pages/NotificationsPage';
import SettingsPage       from './pages/SettingsPage';
import AchievementsPage   from './pages/AchievementsPage';
import CalendarPage       from './pages/CalendarPage';

import HostEvent          from './pages/HostEvent';
import PendingEvents      from './pages/PendingEvents';

// If you have an AllUsers page for boss:
import AllUsersPage       from './pages/AllUsersPage';

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/"               element={<Home />} />
      <Route path="/login"          element={<Login />} />
      <Route path="/register"       element={<Register />} />
      <Route path="/events/:id"     element={<Event />} />
      <Route path="/team/:id"       element={<Team />} />

      {/* Social login callback */}
      <Route path="/social-success" element={<SocialSuccess />} />

      {/* User features */}
      <Route path="/profile"        element={<ProfilePage />} />
      <Route path="/my-events"      element={<MyEventsPage />} />
      <Route path="/bookmarks"      element={<BookmarksPage />} />
      <Route path="/notifications"  element={<NotificationsPage />} />
      <Route path="/settings"       element={<SettingsPage />} />
      <Route path="/achievements"   element={<AchievementsPage />} />
      <Route path="/calendar"       element={<CalendarPage />} />

      {/* Admin features */}
      <Route path="/host-event"         element={<HostEvent />} />
      <Route path="/admin/new"          element={<AddEvent />} />
      <Route path="/admin/edit/:id"     element={<EditEvent />} />
      <Route path="/my-events"          element={<MyEventsPage />} />

      {/* Boss/CWO features */}
      <Route path="/admin/analytics"    element={<Analytics />} />
      <Route path="/pending-clubs"      element={<Approvals />} />
      <Route path="/event-requests"     element={<PendingEvents />} />
      <Route path="/admin/users"        element={<AllUsersPage />} />

      {/* Checkin for admins/boss */}
      <Route path="/checkin"            element={<Checkin />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
