import React from "react";
import { Navigate } from "react-router-dom";

// ProtectedRoute receives user info via props
const ProtectedRoute = ({ user, children }) => {
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
