import React, { useEffect } from "react";

import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/Slices/UserSlice";
import { CheckUser } from "../EndPoints/auth";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const AuthProvider = () => {
  // console.log(hii);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data } = useQuery({
    queryKey: ["checkUser"],
    queryFn: CheckUser,
    onSuccess: () => {
      if (data.isSuccess) {
        dispatch(setUser(data.LoginUser));
      } else {
        handleAuthError(data.message);
      }
      console.log("suucess", data);
    },
    onError: (err) => {
      handleAuthError("Something went wrong");
    },
  });
  console.log(data);
  function handleAuthError(message) {
    toast.error(message);
    localStorage.removeItem("token");
    dispatch(setUser(null));
    setTimeout(() => navigate("/auth/login"), 100);
  }

  return <Outlet />;
};

export default AuthProvider;
