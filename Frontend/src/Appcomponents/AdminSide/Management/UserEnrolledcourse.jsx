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
import AdminSide from "../Admin";
import { Label } from "@/components/ui/label";

const UserEnrolledcourse = () => {
  return (
    <AdminSide>
      <div className="p-10">
        <Label className="text-2xl font-bold ">Users' course enrollments</Label>
        <Table className="mt-10">
          <TableCaption>A list of your enrollments</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Thumbnail</TableHead>
              <TableHead>Enrolled at</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell>$250.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </AdminSide>
  );
};

export default UserEnrolledcourse;
