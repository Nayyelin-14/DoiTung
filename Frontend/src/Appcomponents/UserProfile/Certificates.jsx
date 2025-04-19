import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Certificates = ({ certificate }) => {
  const { t } = useTranslation();

  const { certificates, view, nothing } = t("navigation", {
    returnObjects: true,
  });
  return (
    <>
      <h1 className="text-[18px] text-center pt-8 font-bold">{certificates}</h1>
      <div className="bg-pale rounded-xl h-[300px] w-full my-7 overflow-y-auto">
        {certificate.length > 0 ? (
          <>
            <Table className="mt-4">
              <TableHeader className="text-base">
                <TableRow>
                  <TableHead className="text-center">Course Name</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              {certificate ? (
                certificate.map((item, index) => (
                  <TableBody key={index}>
                    <TableRow>
                      <TableCell className="text-center">
                        {item.course_name}
                      </TableCell>
                      <TableCell className="flex justify-center items-center">
                        <a
                          href={item.certificate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex justify-center"
                        >
                          <Button className="w-full max-w-xs px-4 py-2 flex justify-center items-center text-sm text-center break-words">
                            {view}
                          </Button>
                        </a>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ))
              ) : (
                <div>
                  <p>No Certificates to show.</p>
                </div>
              )}
            </Table>
          </>
        ) : (
          <div className="text-center py-12 text-gray-400">{nothing}</div>
        )}
      </div>
    </>
  );
};

export default Certificates;

{
  /* <div className="grid grid-cols-3 gap-4 p-4">
{certificate.map((item, index) => (
  <div
    key={index}
    className="w-full flex flex-col items-center justify-center text-center gap-4 h-[200px] rounded-xl bg-white p-4"
  >
    <div className="h-[180px] flex items-center text-center">
      <p className="font-semibold text-base">
        {item.course_name || "Course Name Missing"}
      </p>
    </div>

    <a
      href={item.certificate_url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-white w-full"
    >
      <Button className="w-full">{view}</Button>
    </a>
  </div>
))}
</div> */
}
