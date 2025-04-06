import React, { useEffect } from "react";

import { Navigate, redirect, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/Slices/UserSlice";
import { CheckUser } from "../EndPoints/auth";
import { toast } from "sonner";

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = async () => {
    try {
      const response = await CheckUser();
      console.log(response);
      if (!response.isSuccess) {
        handleAuthError(response.message);
      }
    } catch (err) {
      handleAuthError("Something went wrong");
    }

    // Helper function
    function handleAuthError(message) {
      toast.error(message);
      localStorage.removeItem("token");
      dispatch(setUser(null));
      setTimeout(() => navigate("/auth/login"), 100);
    }
  };

  useEffect(() => {
    currentUser();
  }, []);
  return <section>{children}</section>;
};

export default AuthProvider;
