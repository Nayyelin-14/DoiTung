import React, { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/Slices/UserSlice";
import { CheckUser } from "../EndPoints/auth";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { SpinLoader } from "@/lib/utils";

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
      handleAuthError("Unauthorized");
    }
  }, [token]);

  function handleAuthError(message) {
    toast.error(message);
    localStorage.removeItem("token");
    dispatch(setUser(null));
    navigate("/auth/login");
  }

  if (isLoading) return <SpinLoader />;
  if (isError)
    return (
      <div className="flex items-center justify-center h-screen">
        Error checking user authentication.
        <Link to={"/auth/login"} replace>
          <p className="p-4 border border-gray-400 my-5 text-black hover:bg-gray-300 hover:text-black/70 rounded-md">
            Login again
          </p>
        </Link>
      </div>
    );

  return <Outlet />;
};

export default AuthProvider;
