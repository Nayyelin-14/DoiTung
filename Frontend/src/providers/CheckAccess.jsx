import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CheckAccess = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin/enrollment", { replace: true });
      } else if (user.role === "superadmin") {
        navigate(`/admin/dashboard/${user.user_id}`, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user]);

  return <>{!user && children}</>;
};

export default CheckAccess;
