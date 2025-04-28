import AdminSide from "@/Appcomponents/AdminSide/Admin";
import Usermanagement from "@/Appcomponents/AdminSide/Management/Usermanagement";

import { useManageUser } from "@/hooks/useManageUser";

import { OrbitProgress } from "react-loading-indicators";

const Users = () => {
  const { isLoading } = useManageUser();

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
