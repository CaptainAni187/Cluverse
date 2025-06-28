import { useNavigate } from 'react-router-dom';

export default function Fab({ show }) {
  const nav = useNavigate();
  if (!show) return null;

  return (
    <button
      onClick={() => nav('/admin/new')}
      className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-skin-accent text-skin-header
                 text-3xl leading-none shadow-card hover:scale-105 transition"
    >+</button>
  );
}
