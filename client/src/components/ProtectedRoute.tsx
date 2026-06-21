import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-brand-600" />
        <p className="text-sm text-slate-500 font-semibold">Verifying credentials...</p>
      </div>
    );
  }

  // If not logged in
  if (!token || !user) {
    return <Navigate to="/" state={{ from: location, openLogin: true }} replace />;
  }

  // If role is restricted
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    }
    if (user.role === 'OWNER') {
      return <Navigate to="/dealersuser" replace />;
    }
    if (user.role === 'CUSTOMER') {
      return <Navigate to="/user" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
