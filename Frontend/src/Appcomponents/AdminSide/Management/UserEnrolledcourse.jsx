import React, { useEffect, useState } from "react";
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
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const UserEnrolledcourse = () => {
  const [enrollments, setEnrollments] = useState([]);
  const fetchEnrollments = async () => {
    try {
      const response = await getEnrollments();
      if (response.isSuccess) {
        setEnrollments(response.enrollments);
      }
      console.log(response);
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    fetchEnrollments();
  }, []);
  const { t } = useTranslation();
    
      const { User_course_enrollments,username,course,Category,Thumbnail,Enrolled_at,Status,Progress,List_of_enrollments } = t("Users", { returnObjects: true });
  return (
    <AdminSide>
      <div className="p-10">
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
          {enrollments ? (
            enrollments.map((enroll) => (
              <TableBody key={enroll.username}>
                <TableRow>
                  <TableCell className="font-medium">
                    {enroll.username}
                  </TableCell>
                  <TableCell>{enroll.courseName}</TableCell>
                  <TableCell>{enroll.category}</TableCell>
                  <TableCell>
                    {" "}
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
                          enroll.status
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
      </div>
    </AdminSide>
  );
};

export default UserEnrolledcourse;
