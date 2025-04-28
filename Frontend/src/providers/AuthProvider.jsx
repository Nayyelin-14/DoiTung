import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/Slices/UserSlice";
import { CheckUser } from "../EndPoints/auth";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const AuthProvider = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token"); // Get the token from localStorage

  // Query to check the user on each navigation
  const { data, isLoading, isError } = useQuery({
    queryKey: ["checkUser", token], // Include token as a dependency
    queryFn: CheckUser,
    enabled: !!token, // Only run the query if token exists
    onSuccess: (data) => {
      console.log("success", data);
      if (data.isSuccess) {
        dispatch(setUser(data.LoginUser));
      } else {
        handleAuthError(data.message);
      }
    },
    onError: () => {
      handleAuthError("Something went wrong");
    },
  });

  useEffect(() => {
    if (!token) {
      handleAuthError("No token found");
    }
  }, [token]);

  function handleAuthError(message) {
    toast.error(message);
    localStorage.removeItem("token");
    dispatch(setUser(null));
    setTimeout(() => navigate("/auth/login"), 100);
  }

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error checking user authentication.</div>;

  return <Outlet />;
};

export default AuthProvider;
