import React, { useEffect } from "react";

import { redirect, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/Slices/UserSlice";
import { CheckUser } from "../EndPoints/auth";
import { toast } from "sonner";

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = async () => {
    try {
      const token = localStorage.getItem("token");

      // if (!token) {
      //   throw new Error("Something went wrong!!!");
      // }
      const response = await CheckUser();

      if (!response.isSuccess) {
        toast.error(response.message);
        localStorage.removeItem("token");
        dispatch(setUser(null));
        setTimeout(() => navigate("/auth/login"), 100);
      }
    } catch (err) {
      console.log(err);
      toast.error(err);
      setTimeout(() => navigate("/auth/login"), 100);
    }
  };

  useEffect(() => {
    currentUser();
  }, []);
  return <section>{children}</section>;
};

export default AuthProvider;
