import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, Role } from '../context/AuthContext';

export default function PrivateRoute({
  children,
  allow
}: {
  children: React.ReactElement;
  allow?: Role[];
}) {
  const { user, loading } = useAuth();

  if (loading) return <div className="page-loading">Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allow && !allow.includes(user.role)) return <Navigate to="/" replace />;

  return children;
}
