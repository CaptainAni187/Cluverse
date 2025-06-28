import { Link, useLocation } from "react-router-dom";
import { FiHome, FiBookmark, FiUser, FiCalendar } from "react-icons/fi";

const navItems = [
  { to: "/", icon: <FiHome />, label: "Home" },
  { to: "/myevents", icon: <FiCalendar />, label: "My Events" },
  { to: "/profile", icon: <FiUser />, label: "Profile" },
  { to: "/bookmarks", icon: <FiBookmark />, label: "Bookmarks" },
];

export default function StickyNav() {
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-blue-100 flex justify-around py-2 md:hidden">
      {navItems.map(item => (
        <Link
          key={item.to}
          to={item.to}
          className={`flex flex-col items-center text-xs font-semibold transition
            ${location.pathname === item.to
              ? "text-blue-700"
              : "text-blue-400 hover:text-blue-800"}`}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
