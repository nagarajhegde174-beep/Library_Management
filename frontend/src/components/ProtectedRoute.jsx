import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem("authToken");
  const location = useLocation();

  if (!token) {
    const isAdminPath = location.pathname.startsWith("/admin");
    return <Navigate to={isAdminPath ? "/login-portal" : "/login"} state={{ from: location }} replace />;
  }

  let role = null;
  let isTokenValid = true;

  try {
    const decoded = jwtDecode(token);
    role = decoded.role;
  } catch {
    isTokenValid = false;
  }

  if (!isTokenValid) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    const isAdminPath = location.pathname.startsWith("/admin");
    return <Navigate to={isAdminPath ? "/login-portal" : "/login"} state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
}
