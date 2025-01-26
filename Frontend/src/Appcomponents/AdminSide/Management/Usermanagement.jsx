import React from "react";
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
const Usermanagement = ({ users }) => {
  return (
    <div className=" p-3 ">
      <Table>
        <TableCaption>A list of users</TableCaption>
        <TableHeader className="bg-pale">
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Profile</TableHead>
            <TableHead>Enrolled courses</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        {users && users.length > 0 ? (
          users.map((user) => (
            <TableBody>
              <TableRow className="bg-pale/10">
                <TableCell>{user.user_name}</TableCell>
                <TableCell>{user.user_email}</TableCell>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={user.user_profileImage} />
                    <AvatarFallback className="font-bold">
                      {user &&
                        user.user_name &&
                        user.user_name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Ellipsis />
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      user.role === "admin"
                        ? " p-1 px-2  rounded-lg text-center w-fit bg-customGreen text-white font-bold"
                        : "font-bold underline"
                    )}
                  >
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 justify-between w-[50%]">
                    <Button>Restrict</Button>
                    <Trash className="cursor-pointer text-red-600 hover:text-red-300 " />
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          ))
        ) : (
          <div></div>
        )}
      </Table>
    </div>
  );
};

export default Usermanagement;
