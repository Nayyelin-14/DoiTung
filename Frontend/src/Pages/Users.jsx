import AdminSide from "@/Appcomponents/AdminSide/Admin";
import Usermanagement from "@/Appcomponents/AdminSide/Management/Usermanagement";
import { getallusers } from "@/EndPoints/user";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Users = () => {
  const [users, setUsers] = useState([]);
  const fetchUser = async () => {
    try {
      const response = await getallusers();
      if (response.isSuccess) {
        setUsers(response.allusers);
        toast.success(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  console.log(users);
  return (
    <AdminSide>
      <Usermanagement users={users} />
    </AdminSide>
  );
};

export default Users;
