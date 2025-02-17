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

const UserEnrolledcourse = () => {
  const [enrollments, setEnrollments] = useState([]);
  const fetchEnrollments = async () => {
    try {
      const response = await getEnrollments();
      if (response.isSuccess) {
        setEnrollments(response.enrollments);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    fetchEnrollments();
  }, []);

  return (
    <AdminSide>
      <div className="p-10">
        <Label className="text-2xl font-bold ">Users' course enrollments</Label>
        <Table className="mt-10">
          <TableCaption>A list of all users' enrollments</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Thumbnail</TableHead>
              <TableHead>Enrolled at</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Progress</TableHead>
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
                          enroll.status === "true"
                            ? "bg-green-500 "
                            : "bg-yellow-500"
                        } p-1 text-md text-white font-bold rounded-lg `
                      )}
                    >
                      {enroll.status === "true" ? "Finished" : "Ongoing"}
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
