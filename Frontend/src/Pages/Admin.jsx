import AdminSide from "@/Appcomponents/AdminSide/Admin";
import React from "react";
import { useSelector } from "react-redux";

const Admin = () => {
  const { user } = useSelector((state) => state.user);

  return <div>{user.role === "admin" && <AdminSide />}</div>;
};

export default Admin;
