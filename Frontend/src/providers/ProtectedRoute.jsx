import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  // Not logged in
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Logged in but not allowed
  const hasAccess = allowedRoles.includes(user.role);
  if (!hasAccess) {
    let redirectTo = "/";
    if (user.role === "superadmin") {
      redirectTo = `/admin/dashboard/${user.user_id}`;
    } else if (user.role === "admin") {
      redirectTo = `/admin/enrollment`;
    } else if (user.role === "user") {
      redirectTo = "/";
    }

    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Allowed
  return children || <Outlet />;
};

export default ProtectedRoute;
