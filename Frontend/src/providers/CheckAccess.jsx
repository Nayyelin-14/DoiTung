import { CheckUser } from "@/EndPoints/auth";
import { setUser } from "@/store/Slices/UserSlice";
import React, { useEffect, useState } from "react";
import { OrbitProgress } from "react-loading-indicators";
import { useSelector, useDispatch } from "react-redux"; // Import useDispatch
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CheckAccess = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const [loggedUser, setLoggedUser] = useState(null);
  const [checking, setChecking] = useState(true); // Initialize to true
  const token = localStorage.getItem("token");
  const location = useLocation();
  const [redirectTo, setRedirectTo] = useState(null); // State to hold the redirect path
  const navigate = useNavigate(); // Import useNavigate
  const dispatch = useDispatch(); // Get dispatch function

  const checkIsLogged = async () => {
    setChecking(true);
    try {
      const response = await CheckUser();

      if (!response.isSuccess) {
        handleAuthError(response.message);
      } else {
        setLoggedUser(response.LoginUser);
        if (
          user ||
          (loggedUser && user?.user_id === loggedUser.user_id) ||
          token
        ) {
          if (user?.role === "admin") {
            setRedirectTo(`/admin/enrollment`);
          } else if (user?.role === "superadmin") {
            setRedirectTo(`/admin/dashboard/${user.user_id}`);
          } else {
            setRedirectTo(`/`);
          }
        }
      }
    } catch (err) {
      handleAuthError("Something went wrong");
    } finally {
      setChecking(false);
    }
  };

  // Helper function
  function handleAuthError(message) {
    toast.error(message);
    localStorage.removeItem("token");
    dispatch(setUser(null));
    setTimeout(() => navigate("/auth/login"), 100);
  }

  useEffect(() => {
    checkIsLogged();
  }, []); // Empty dependency array ensures it runs on mount

  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <OrbitProgress color="#32cd32" size="large" text="" textColor="" />
      </div>
    );
  }

  if (redirectTo) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>; // Use a fragment here
};

export default CheckAccess;
