import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function ResponseInterceptor() {
  const navigate = useNavigate();
  const interceptorId = useRef(null);

  useEffect(() => {
    interceptorId.current = api.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );
    return () => {
      api.interceptors.response.eject(interceptorId.current);
    };
  }, [navigate]);

  return null;
}
