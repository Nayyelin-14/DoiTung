import { MoreHorizontal, Pencil, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
export const columns = [
  {
    accessorKey: "courses",
    header: () => <div>Courses</div>,
    cell: ({ row }) => {
      const Courses = row.getValue("courses");

      return <div className=" font-medium">{Courses}</div>;
    },
  },
  {
    accessorKey: "thumbnails",
    header: () => <div className="text-start">Thumbnails</div>,
    cell: ({ row }) => {
      const thumbnails = row.getValue("thumbnails");

      return (
        <div className="text-start font-medium">
          <img src={thumbnails} className=" rounded-md w-12 h-12 " />
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: () => <div className="text-start">Category</div>,
    cell: ({ row }) => {
      const category = row.getValue("category");

      return <div className="text-start font-medium">{category}</div>;
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-start">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("status");

      return (
        <div className="text-start font-medium p-1 bg-black text-white w-fit rounded-lg px-2">
          {status}
        </div>
      );
    },
  },

  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const navigate = useNavigate();

      const course_data = row.original;
      const editCourse = (courseId) => {
        console.log(courseId);
        navigate(`/admin/course_management/createcourse/?editID=${courseId}`);
      };
      const deleteCourse = (courseId) => {
        console.log(courseId);
      };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem className="cursor-pointer focus:bg-customGreen/30 duration-300 font-medium">
              <div
                onClick={() => {
                  editCourse(course_data.id);
                }}
                className="flex gap-2 items-center"
              >
                <Pencil /> Edit course
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer focus:bg-red-300 duration-300 font-medium">
              <div
                onClick={() => {
                  deleteCourse(course_data.id);
                }}
                className="flex gap-2 items-center"
              >
                <TrashIcon /> Delete course
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
