import AdminSide from "@/Appcomponents/AdminSide/Admin";
import Usermanagement from "@/Appcomponents/AdminSide/Management/Usermanagement";
import { getallusers } from "@/EndPoints/user";
import { useManageUser } from "@/hooks/useManageUser";
import React, { useEffect, useState } from "react";
import { OrbitProgress } from "react-loading-indicators";
import { toast } from "sonner";

const Users = () => {
  const { users, isLoading } = useManageUser();

  if (isLoading) {
    <AdminSide>
      <div className="flex items-center justify-center h-screen">
        <OrbitProgress color="#32cd32" size="medium" text="" textColor="" />;
      </div>
    </AdminSide>;
  }
  return (
    <AdminSide>
      <Usermanagement />
    </AdminSide>
  );
};

export default Users;
