import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Ellipsis, PlusIcon, Trash } from "lucide-react";
import UserEnrolledcourse from "./UserEnrolledcourse";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Accountremove,
  Unrestrict_user,
  userrestriction,
} from "@/EndPoints/user";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Usermanagement = ({ users, setUsers }) => {
  const { t } = useTranslation();
  const { Text, Header, Buttons, Role, Description } = t("UserTab", {
    returnObjects: true,
  });
  // "UserTab": {
  //   "nav": {
  //     "Total": "รวม",
  //     "AddUser": "เพิ่มผู้ใช้ใหม่"
  //   },
  //   "Header": {
  //     "Username": "ชื่อผู้ใช้",
  //     "Profile": "โปรไฟล์",
  //     "Role": "บทบาท",
  //     "Action": "การดำเนินการ",
  //     "Remove": "ลบ"
  //   },
  //   "Buttons": {
  //     "Restrict": "จำกัด",
  //     "Unrestrict": "ยกเลิกการจำกัด"
  //   }
  console.log(Role);
  const navigate = useNavigate();
  const restrictUser = async (userid) => {
    try {
      const response = await userrestriction(userid);
      if (response.isSuccess) {
        toast.info(response.message);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.user_id === userid
              ? {
                  ...user,
                  status: user.status === "active" ? "restricted" : "active",
                }
              : user
          )
        );
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const removeUser = async (userid) => {
    try {
      const response = await Accountremove(userid);
      if (response.isSuccess) {
        toast.info(response.message);
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.user_id !== userid)
        );
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const unrestrictUser = async (userid) => {
    try {
      const response = await Unrestrict_user(userid);
      if (response.isSuccess) {
        toast.info(response.message);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.user_id === userid
              ? {
                  ...user,
                  status:
                    user.status === "restricted" ? "active" : "restricted",
                }
              : user
          )
        );
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {}, [users]);
  return (
    <div className="p-3 my-6">
      <div className="flex  justify-between mb-5">
        <p className="font-bold text-xl">
          {Text.Total} - {users.length}
        </p>
        <Button onClick={() => navigate(`/admin/register`)}>
          <PlusIcon />
          {Text.AddUser}
        </Button>
      </div>
      <Table>
        <TableCaption> {Description.Des4}</TableCaption>
        <TableHeader className="bg-pale">
          <TableRow>
            <TableHead className="w-[300px]">{Header.Username}</TableHead>
            <TableHead className="w-[300px]">{Header.Profile}</TableHead>
            <TableHead className="w-[300px]">{Header.Role}</TableHead>
            <TableHead className="text-center w-[10px]">
              {Header.Action}
            </TableHead>
            <TableHead className="text-center w-[10px]">
              {Header.Remove}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users && users.length > 0 ? (
            users.map((u) => (
              <TableRow key={u.user_id} className="bg-pale/10">
                <TableCell>{u.user_name}</TableCell>

                <TableCell>
                  <Avatar>
                    <AvatarImage src={u.user_profileImage} />
                    <AvatarFallback className="font-bold">
                      {u &&
                        u.user_name &&
                        u.user_name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "p-1 px-2 rounded-lg w-fit  font-bold text-white",
                      u.role === "admin" ? " bg-customGreen " : "bg-black "
                    )}
                  >
                    {u.role === "admin" && `${Role.admin}`}
                    {u.role === "user" && `${Role.user}`}
                  </span>
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <p className="flex items-center gap-4 justify-center">
                        <Button>
                          {u.status === "active" && `${Buttons.Restrict}`}
                          {u.status === "restricted" && `${Buttons.Unrestrict}`}
                        </Button>
                      </p>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{Description.Des1}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {Description.Des2}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{Buttons.Cancel}</AlertDialogCancel>
                        {u.status === "active" && (
                          <AlertDialogAction
                            onClick={() => restrictUser(u.user_id)}
                          >
                            {Buttons.Confirm}
                          </AlertDialogAction>
                        )}
                        {u.status === "restricted" && (
                          <AlertDialogAction
                            onClick={() => unrestrictUser(u.user_id)}
                          >
                            {Buttons.Confirm}
                          </AlertDialogAction>
                        )}
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <p className="flex items-center gap-4 justify-center">
                        <Trash
                          className="cursor-pointer text-red-600 hover:text-red-300"
                          size={24}
                        />
                      </p>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{Description.Des1}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {Description.Des3}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel> {Buttons.Cancel}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => removeUser(u.user_id)}
                        >
                          {Buttons.Confirm}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>No users found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Usermanagement;
