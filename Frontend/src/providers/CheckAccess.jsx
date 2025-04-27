import { SpinLoader } from "@/lib/utils";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

const CheckAccess = () => {
  const { user, isLoading } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    // If the user is already logged in, navigate them based on their role
    if (!isLoading && user) {
      if (user.role === "admin") {
        navigate("/admin/enrollment", { replace: true });
      } else if (user.role === "superadmin") {
        navigate(`/admin/dashboard/${user.user_id}`, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, isLoading, navigate]); // Add isLoading to ensure we wait for user to be loaded

  // While the user data is loading, show the spinner
  if (isLoading) {
    return <SpinLoader />;
  }

  // Only show the outlet (login/register) if the user is not logged in
  return <>{user === null && <Outlet />}</>;
};

export default CheckAccess;
