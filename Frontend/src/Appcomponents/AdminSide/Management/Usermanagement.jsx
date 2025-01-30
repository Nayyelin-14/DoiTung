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
import { Ellipsis, Trash } from "lucide-react";
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

const Usermanagement = ({ users, setUsers }) => {
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
      <Table>
        <TableCaption>A list of users</TableCaption>
        <TableHeader className="bg-pale">
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Profile</TableHead>
            <TableHead className="text-center">Role</TableHead>
            <TableHead className="text-center w-[10px]">Action</TableHead>
            <TableHead className="text-center w-[10px]">Remove</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users && users.length > 0 ? (
            users.map((u) => (
              <TableRow key={u.user_id} className="bg-pale/10">
                <TableCell>{u.user_name}</TableCell>
                <TableCell>{u.user_email}</TableCell>
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
                <TableCell className="text-center">
                  <span
                    className={cn(
                      u.role === "admin"
                        ? "p-1 px-2 rounded-lg w-fit bg-customGreen text-white font-bold"
                        : "font-bold underline"
                    )}
                  >
                    {u.role}
                  </span>
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <p className="flex items-center gap-4 justify-center">
                        <Button>
                          {u.status === "active" && "Restrict"}
                          {u.status === "restricted" && "Unrestrict"}
                        </Button>
                      </p>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will prevent the user from accessing
                          certain features. You will be able to undo this action
                          with further administrative intervention.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        {u.status === "active" && (
                          <AlertDialogAction
                            onClick={() => restrictUser(u.user_id)}
                          >
                            Confirm
                          </AlertDialogAction>
                        )}
                        {u.status === "restricted" && (
                          <AlertDialogAction
                            onClick={() => unrestrictUser(u.user_id)}
                          >
                            Confirm
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
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will prevent the user from accessing
                          certain features. You will be able to undo this action
                          with further administrative intervention.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => removeUser(u.user_id)}
                        >
                          Confirm
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
