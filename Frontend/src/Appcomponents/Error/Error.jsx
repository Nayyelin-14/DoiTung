import React from "react";
import { Button } from "@/components/ui/button";
import { IoIosReturnLeft } from "react-icons/io";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Error = () => {
  const { user } = useSelector((state) => state.user);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const goback = () => {
    if (user && token) {
      if (user.role === "admin") {
        navigate("/admin/enrollment");
      } else if (user.role === "superadmin") {
        navigate(`/admin/dashboard/${user.user_id}`);
      } else {
        navigate("/");
      }
    } else {
      navigate("/auth/login");
    }
  };
  return (
    <div>
      <h1 className="text-3xl">404 | Page Not Found!!!</h1>

      <div className="my-7 text-right">
        <Button className="text-black text-md p-2 hover:underline font-bold border bg-white hover:bg-black/30 border-black">
          <div className="flex items-center gap-2" onClick={() => goback()}>
            Go back <IoIosReturnLeft className="font-bold " size={24} />
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Error;
