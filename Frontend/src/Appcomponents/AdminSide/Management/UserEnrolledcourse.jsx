import { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AdminSide from "../Admin";
import { Label } from "@/components/ui/label";
import { getEnrollments } from "@/EndPoints/user";

import { cn, SpinLoader } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const UserEnrolledcourse = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const [dataperpage, setDataperpage] = useState(8);

  const {
    data: enrollments = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: getEnrollments,
    queryKey: ["enrollments"],
    staleTime: Infinity,
  });

  const { t } = useTranslation();

  const indexOfLastData = currentPage * dataperpage;
  const indexOfFirstData = indexOfLastData - dataperpage;

  const DisplayData = enrollments.slice(indexOfFirstData, indexOfLastData);
  const totalPages = Math.ceil(enrollments.length / dataperpage);

  const handlePageChange = (pgNum) => {
    if (pgNum >= 1 && pgNum <= totalPages) {
      setCurrentPage(pgNum);
    }
  };

  const {
    User_course_enrollments,
    username,
    course,
    Category,
    Thumbnail,
    Enrolled_at,
    Status,
    Progress,
    List_of_enrollments,
  } = t("Users", { returnObjects: true });
  if (isError) {
    toast.error(error.message);
  }
  if (isLoading) {
    return (
      <AdminSide>
        <SpinLoader />
      </AdminSide>
    );
  }
  return (
    <AdminSide>
      <section className="p-10">
        <Label className="text-2xl font-bold ">{User_course_enrollments}</Label>
        <Table className="mt-10">
          <TableCaption>{List_of_enrollments}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>{username}</TableHead>
              <TableHead>{course}</TableHead>
              <TableHead>{Category}</TableHead>
              <TableHead>{Thumbnail}</TableHead>
              <TableHead>{Enrolled_at}</TableHead>
              <TableHead className="text-center">{Status}</TableHead>
              <TableHead className="text-center">{Progress}</TableHead>
            </TableRow>
          </TableHeader>
          {DisplayData ? (
            DisplayData.map((enroll, index) => (
              <TableBody key={`${enroll.username}+${index}`}>
                <TableRow>
                  <TableCell className="font-medium">
                    {enroll.username}
                  </TableCell>
                  <TableCell>{enroll.courseName}</TableCell>
                  <TableCell>{enroll.category}</TableCell>
                  <TableCell>
                    <img
                      src={enroll.thumbnail}
                      className=" rounded-md w-12 h-12 "
                    />
                  </TableCell>
                  <TableCell>
                    {format(new Date(enroll.enrolledAt), "dd MMM yyyy")}
                  </TableCell>

                  <TableCell className="text-center">
                    <p
                      className={cn(
                        `${
                          enroll.status === true
                            ? "bg-green-500 "
                            : "bg-yellow-500"
                        } p-1 text-md text-white font-bold rounded-lg `
                      )}
                    >
                      {enroll.status ? "Completed" : "Ongoing"}
                    </p>
                  </TableCell>
                  <TableCell className="text-center">
                    <p className="font-bold"> {enroll.progress} %</p>
                  </TableCell>
                </TableRow>
              </TableBody>
            ))
          ) : (
            <div>
              <p>No enrollments found here.</p>
            </div>
          )}
        </Table>
      </section>
      {enrollments.length > 8 && (
        <div className="flex  items-center mb-7 float-right  mr-10">
          <Pagination className={`flex items-center justify-center space-x-3`}>
            <PaginationContent>
              <PaginationPrevious
                className={`hover:bg-gray-400 cursour-pointer ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed " : ""
                }`}
                label="Previous"
                disabled={currentPage === 1} // This will still disable the button
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
              />

              {[...Array(totalPages)].map((_, i) => (
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
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={currentPage === totalPages}
                onClick={() =>
                  currentPage < totalPages && handlePageChange(currentPage + 1)
                }
              />
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </AdminSide>
  );
};

export default UserEnrolledcourse;
