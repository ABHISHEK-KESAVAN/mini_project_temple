import axios from 'axios';
import { clearSession, getStoredToken } from './session';

// Support both CRA (process.env) and Vite (import.meta.env) for environment variables
// This makes the frontend fully production-ready and deployment flexible (Vercel/Netlify)
const getApiUrl = () => {
  let url = null;
  // 1. Try Vite
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
      url = import.meta.env.VITE_API_URL;
    }
  } catch (e) {}

  // 2. Try CRA (needs try-catch because if Vite is used, process is undefined and will throw)
  // We don't use 'typeof process' because Webpack statically replaces the exact string 'process.env.REACT_APP_API_URL'
  try {
    const craUrl = process.env.REACT_APP_API_URL;
    if (craUrl) {
      url = craUrl;
    }
  } catch (e) {}

  return url || 'http://localhost:5000/api';
};

export const API_URL = getApiUrl();
const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getUploadUrl = (url) => {
  if (!url) return url;
  return url.startsWith('/uploads') ? `${API_ORIGIN}${url}` : url;
};

// ── Request interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url    = error.config?.url ?? '';

    // 1. Handle Network Errors & CORS Errors (Backend unreachable or rejected CORS)
    if (!error.response && error.message === 'Network Error') {
      console.error(`[API Network/CORS Error] Cannot reach backend API.
      - Are you sure backend is running?
      - Is CORS configured nicely to allow your frontend URL?
      - URL Attempted: ${url}`);
      return Promise.reject(new Error('Network or CORS error. Please check your backend connection.'));
    }

    // 2. Handle 404 Endpoint Not Found
    if (status === 404) {
      console.error(`[API 404] Endpoint not found: ${url}`);
    }

    // 3. Handle 401 Unauthorized
    else if (status === 401) {
      console.error(`[API 401] Unauthorized – token expired or invalid. URL: ${url}`);

      const isLoginRequest = url.includes('/auth/login') || url.includes('/auth/register');
      if (!isLoginRequest) {
        console.warn('[API] Clearing expired session and redirecting to login…');
        clearSession();
        window.location.href = '/admin/login';
      }
    } 
    
    // 4. Handle 413 Payload Too Large
    else if (status === 413) {
      console.error(`[API 413] Payload too large – file exceeds the 10 MB limit. URL: ${url}`);
    } 
    
    // 5. Generic errors
    else {
      console.error(`[API ${status ?? 'ERR'}] ${error.response?.data?.message || error.message}. URL: ${url}`);
    }

    return Promise.reject(error);
  }
);

export default api;
