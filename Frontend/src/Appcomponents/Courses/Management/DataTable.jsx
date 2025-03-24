"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DataTable({
  columns,
  data,
  completedCourseCount,
  DraftCourseCount,
  totalCourses,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    pageCount: Math.ceil(data.length / pageSize),
    initialState: { pagination: { pageSize } },
  });

  return (
    <Card className="w-full sm:w-[80%] md:w-full lg:w-[97%] bg-gray-100 shadow-md rounded-none mx-auto">
      <CardHeader>
        <CardTitle>Courses</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mb-5 lg:justify-between w-full">
          {/* Search Input */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Search className="text-primary" />
            <Input
              className="border border-gray-400 w-full lg:w-[300px] px-3 py-2 rounded-md"
              placeholder="Search courses..."
              value={table.getColumn("courses")?.getFilterValue() ?? ""}
              onChange={(event) =>
                table.getColumn("courses")?.setFilterValue(event.target.value)
              }
            />
          </div>

          {/* Select Filter */}
          <div className="w-full md:w-fit">
            <Select
              className="border border-red-900 w-full md:w-[180px]"
              onValueChange={(value) => {
                table
                  .getColumn("status")
                  ?.setFilterValue(value === "all" ? "" : value);
              }}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder={`Total courses - ${totalCourses}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">
                    All courses - {totalCourses}
                  </SelectItem>
                  <SelectItem value="completed">
                    Completed - {completedCourseCount}
                  </SelectItem>
                  <SelectItem value="draft">
                    Draft - {DraftCourseCount}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        style={{ border: "1px solid gray", color: "black" }}
                        key={header.id}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody style={{ border: "1px solid gray" }}>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            className="bg-customGreen"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            className="bg-customGreen"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
