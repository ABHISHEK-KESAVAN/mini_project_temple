import React from 'react';
import { Navigate } from 'react-router-dom';
import { clearSession, getStoredToken, getStoredUser } from '../utils/session';

/**
 * Protects admin routes. Only users with role 'admin' and a valid token can access.
 * Guests/devotees never see admin links; they use public pages only.
 * Admin must use the direct URL: /admin/login
 */
const PrivateRoute = ({ children }) => {
  const token = getStoredToken();
  const user = getStoredUser();

  const isAdmin = token && user?.role === 'admin';

  if (!isAdmin) {
    if (token && user && user.role !== 'admin') {
      clearSession();
    }
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default PrivateRoute;

