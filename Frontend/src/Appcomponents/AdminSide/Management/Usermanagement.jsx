import React, { useEffect, useState } from "react";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Report from "./Report";


const Usermanagement = ({ users, setUsers }) => {
  const { t } = useTranslation();
  const { Text, Header, Buttons, Role, Description } = t("UserTab", {
    returnObjects: true,
  });



  const [dataperpage, setDataperpage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
  }

  const indexofLastUser = currentPage * dataperpage;
  const fistIndexUser = indexofLastUser - dataperpage;

  const DisplayUser = users?.slice(fistIndexUser, indexofLastUser);

  const totalpages = Math.ceil(users.length / dataperpage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalpages) {
      setCurrentPage(pageNumber);
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
          {DisplayUser && DisplayUser.length > 0 ? (
            DisplayUser.map((u) => (
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
                  <div className="flex flex-row gap-2">
                  {/* Restrict Unrestrict User */}
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
                  {/* User Report */}
                  <Report reportUser={u.user_id}>
                    <Button variant="secondary">Send Report</Button>
                  </Report>
                  </div>

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

      {users.length > 8 && (
        <div className="flex justify-between items-center my-3 float-right mr-10">
          <Pagination className="flex items-center justify-center space-x-2">
            <PaginationContent>
              <PaginationPrevious
                className={`hover:bg-gray-400 cursor-pointer ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                label="Previous"
                disabled={currentPage === 1} // This will still disable the button
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                } // Only trigger page change if not at the first page
              />

              {[...Array(totalpages)].map((_, i) => (
                <PaginationItem key={i} onClick={() => handlePageChange(i + 1)}>
                  <PaginationLink
                    className={
                      currentPage === i + 1
                        ? "bg-black text-white mr-2 cursor-pointer hover:bg-gray-400"
                        : "bg-pale cursor-pointer hover:bg-gray-400"
                    }
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationNext
                label="Next"
                className={`hover:bg-gray-400 cursor-pointer ${
                  currentPage === totalpages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={currentPage === totalpages} // Disable if on the last page
                onClick={() =>
                  currentPage < totalpages && handlePageChange(currentPage + 1)
                } // Only trigger page change if not on the last page
              />
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default Usermanagement;
