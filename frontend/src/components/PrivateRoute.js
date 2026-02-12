import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Protects admin routes. Only users with role 'admin' and a valid token can access.
 * Guests/devotees never see admin links; they use public pages only.
 * Admin must use the direct URL: /admin/login
 */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  let user = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch (_) {}

  const isAdmin = token && user?.role === 'admin';

  if (!isAdmin) {
    if (token && user && user.role !== 'admin') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default PrivateRoute;

