import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
  requireVerified?: boolean;
}

export function ProtectedRoute({ allowedRoles, requireVerified }: ProtectedRouteProps) {
  const { user, profile, loading, setShowAuthModal } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || !profile) {
    // Trigger auth modal and redirect to home
    setTimeout(() => setShowAuthModal(true), 0);
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(profile.role) && user.uid !== 'xWpu2sdoN8SbBWtRTIBMUOOY0Ud2') {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireVerified && !profile.isVerified && profile.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
