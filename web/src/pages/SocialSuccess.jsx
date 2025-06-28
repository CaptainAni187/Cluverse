import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SocialSuccess() {
  const nav = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      nav('/'); // or wherever you want to send the user
    }
  }, [nav]);
  return <div className="text-center mt-24 text-lg text-blue-800">Logging you in…</div>;
}
