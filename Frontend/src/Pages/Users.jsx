import AdminSide from "@/Appcomponents/AdminSide/Admin";
import Usermanagement from "@/Appcomponents/AdminSide/Management/Usermanagement";

import { useManageUser } from "@/hooks/useManageUser";
import { SpinLoader } from "@/lib/utils";

const Users = () => {
  const { isLoading } = useManageUser();

  if (isLoading) {
    <AdminSide>
      <SpinLoader />/
    </AdminSide>;
  }
  return (
    <AdminSide>
      <Usermanagement />
    </AdminSide>
  );
};

export default Users;
