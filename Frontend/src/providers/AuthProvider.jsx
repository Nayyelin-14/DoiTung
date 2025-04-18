import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/Slices/UserSlice";
import { CheckUser } from "../EndPoints/auth";
import { toast } from "sonner";

const AuthProvider = ({ children }) => {
  // console.log(hii);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = async () => {
    try {
      const response = await CheckUser();

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
