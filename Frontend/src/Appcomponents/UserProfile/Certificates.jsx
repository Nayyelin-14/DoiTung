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
