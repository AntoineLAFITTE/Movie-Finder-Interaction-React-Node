import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { user, isLoading } = useAuth();
  const loc = useLocation();

  if (isLoading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;

  return children;
}
