import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Prevent admins from accessing user-only pages (like Home)
  if (user.role === "admin" && allowedRoles.includes("user")) {
    return (
      <Navigate
        to={`/admin/dashboard/${user.user_id}`}
        state={{ from: location }}
        replace
      />
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
