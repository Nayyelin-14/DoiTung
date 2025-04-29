import React from "react";
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
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DataTable = ({ data }) => {
  const { t } = useTranslation();

  const {
    username,
    course,
    Category,
    Thumbnail,
    Enrolled_at,
    Status,
    Progress,
    List_of_enrollments,
  } = t("Users", { returnObjects: true });
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex justify-between items-center  p-4">
        <Label className="text-xl font-bold ">Latest 5 enrollments</Label>
        <Button
          className="bg-transparent text-black border border-gray-500 hover:bg-gray-300"
          onClick={() => navigate("/admin/enrollment", { replace: true })}
        >
          See all <ArrowRight />
        </Button>
      </div>

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
        {data &&
          data.map((enroll, index) => (
            <TableBody key={`${enroll.username}+${index}`}>
              <TableRow>
                <TableCell className="font-medium">{enroll.username}</TableCell>
                <TableCell>{enroll.title}</TableCell>
                <TableCell>{enroll.category}</TableCell>
                <TableCell>
                  <img
                    src={enroll.thumbnail}
                    className=" rounded-md w-12 h-12 "
                  />
                </TableCell>
                <TableCell>
                  {format(new Date(enroll.enrolledDate), "dd MMM yyyy")}
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
          ))}
      </Table>
    </div>
  );
};

export default DataTable;
