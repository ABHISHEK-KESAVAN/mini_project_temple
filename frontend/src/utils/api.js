import axios from 'axios';
import { clearSession, getStoredToken } from './session';

// Support both CRA (process.env) and Vite (import.meta.env) for environment variables
// This makes the frontend production-ready and deployment-flexible.
const getApiUrl = () => {
  let url = null;

  // 1) Try Vite
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
      url = import.meta.env.VITE_API_URL;
    }
  } catch (e) {}

  // 2) Try CRA (wrapped because process can be unavailable under Vite)
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
    'Content-Type': 'application/json'
  }
});

export const getUploadUrl = (url) => {
  const raw = typeof url === 'string' ? url.trim() : '';
  if (!raw) return raw;

  // Already-resolved inline/object URLs.
  if (raw.startsWith('data:') || raw.startsWith('blob:')) return raw;

  // Normalize path separators to handle pasted Windows paths.
  const normalized = raw.replace(/\\/g, '/');

  // Relative upload paths.
  if (normalized.startsWith('/uploads/')) return `${API_ORIGIN}${normalized}`;
  if (normalized.startsWith('uploads/')) return `${API_ORIGIN}/${normalized}`;

  // Bare filename, assume uploads folder.
  if (/^[^/]+\.(jpg|jpeg|png|gif|webp)$/i.test(normalized)) {
    return `${API_ORIGIN}/uploads/${normalized}`;
  }

  // Absolute URL/path containing "/uploads/".
  const uploadSegmentIndex = normalized.indexOf('/uploads/');
  if (uploadSegmentIndex !== -1) {
    return `${API_ORIGIN}${normalized.slice(uploadSegmentIndex)}`;
  }

  // External URL or any other path: keep as-is.
  return raw;
};

// Request interceptor
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url ?? '';

    // 1) Network/CORS errors
    if (!error.response && error.message === 'Network Error') {
      console.error(`[API Network/CORS Error] Cannot reach backend API.
      - Is backend running?
      - Is CORS allowing your frontend URL?
      - URL Attempted: ${url}`);
      return Promise.reject(new Error('Network or CORS error. Please check backend connection.'));
    }

    // 2) Not found
    if (status === 404) {
      console.error(`[API 404] Endpoint not found: ${url}`);
    }

    // 3) Unauthorized
    else if (status === 401) {
      console.error(`[API 401] Unauthorized - token expired or invalid. URL: ${url}`);

      const isLoginRequest = url.includes('/auth/login') || url.includes('/auth/register');
      if (!isLoginRequest) {
        console.warn('[API] Clearing expired session and redirecting to login...');
        clearSession();
        window.location.href = '/admin/login';
      }
    }

    // 4) Payload too large
    else if (status === 413) {
      console.error(`[API 413] Payload too large - file exceeds server limits. URL: ${url}`);
    }

    // 5) Generic errors
    else {
      console.error(`[API ${status ?? 'ERR'}] ${error.response?.data?.message || error.message}. URL: ${url}`);
    }

    return Promise.reject(error);
  }
);

export default api;
