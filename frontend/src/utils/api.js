import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor ──────────────────────────────────────────────────────
// 1. Always attach the Bearer token from localStorage.
// 2. When the body is FormData, delete Content-Type so axios auto-generates
//    the correct multipart boundary (manual setting breaks multipart uploads).
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      // Let the browser/axios set the correct Content-Type with boundary
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ─────────────────────────────────────────────────────
// • 401 → token expired/invalid: clear storage and redirect to login.
//   Skip the redirect if the failing request IS the login endpoint itself
//   (prevents infinite redirect loops).
// • 413 → payload too large: log clearly.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url    = error.config?.url ?? '';

    if (status === 401) {
      console.error(`[API 401] Unauthorized – token expired or invalid. URL: ${url}`);

      // Don't redirect if this was the login request itself
      const isLoginRequest = url.includes('/auth/login') || url.includes('/auth/register');
      if (!isLoginRequest) {
        console.warn('[API] Clearing expired session and redirecting to login…');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Use window.location so it works outside React Router context
        window.location.href = '/admin/login';
      }
    } else if (status === 413) {
      console.error(`[API 413] Payload too large – file exceeds the 10 MB limit. URL: ${url}`);
    } else {
      console.error(`[API ${status ?? 'ERR'}] ${error.response?.data?.message || error.message}. URL: ${url}`);
    }

    return Promise.reject(error);
  }
);

export default api;

