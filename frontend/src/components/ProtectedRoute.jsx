import React from 'react';
import { Navigate } from 'react-router-dom';
import { safeParse } from '../lib/safeLocal';

/**
 * Very simple frontend-only protected route.
 * Expects user stored in localStorage as { role: 'client'|'freelancer' }
 */
export default function ProtectedRoute({ children, role }) {
  const user = safeParse('user', null);
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}
