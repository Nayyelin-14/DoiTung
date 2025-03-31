import { Eye, Pencil, TrashIcon } from "lucide-react";
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

import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { removeCourse } from "@/EndPoints/courses";
import { toast } from "sonner";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export const CourseTable = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  console.log(user);
  const { t } = useTranslation();

  const { Columns } = t("Courses", { returnObjects: true });

  const columns = [
    {
      accessorKey: "courses",
      header: () => <div>{Columns.Courses}</div>,
      cell: ({ row }) => {
        const Courses = row.getValue("courses");
        return (
          <div className="font-medium w-[150px] truncate overflow-hidden text-ellipsis whitespace-nowrap">
            {Courses}
          </div>
        );
      },
    },
    {
      accessorKey: "thumbnails",
      header: () => <div className="text-start">{Columns.Thumbnails}</div>,
      cell: ({ row }) => {
        const thumbnails = row.getValue("thumbnails");
        return (
          <div className="text-start font-medium">
            <img src={thumbnails} className="rounded-md w-12 h-12" />
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: () => <div className="text-start">{Columns.Category}</div>,
      cell: ({ row }) => {
        const category = row.getValue("category");
        return (
          <div className="text-start font-medium w-[70px] truncate overflow-hidden text-ellipsis whitespace-nowrap">
            {category}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="text-start w-[90px]">{Columns.Status}</div>,
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <div
            className={cn(
              `${
                status === "completed" ? "bg-black" : "bg-yellow-500"
              } text-start font-medium p-1 w-fit rounded-lg px-2 text-white`
            )}
          >
            {status}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div>{Columns.Action}</div>,

      cell: ({ row }) => {
        const [isOpen, setIsOpen] = useState(false);
        const course_data = row.original;

        const editCourse = (courseId) => {
          navigate(`/admin/course_management/createcourse/?editID=${courseId}`);
        };

        const deleteCourse = async (courseId) => {
          try {
            const response = await removeCourse(courseId);
            if (response.isSuccess) {
              toast.info(response.message);
              window.location.reload();
            }
          } catch (error) {
            toast.error(error.message);
          }
        };

        return (
          <>
            <div className="flex gap-3">
              <Pencil
                size={20}
                className="hover:text-blue-800 cursor-pointer"
                onClick={() => editCourse(course_data.id)}
              />

              <TrashIcon
                size={20}
                className="hover:text-red-800 cursor-pointer"
                onClick={() => setIsOpen(true)}
              />

              {/* {user.role === "superadmin" && ( */}
                <Eye
                  size={20}
                  className="hover:text-gray-400 cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/admin/course_management/coursedetail/${course_data.id}`
                    )
                  }
                />
              {/* )} */}
              {/* <Eye
                size={20}
                className="hover:text-gray-400 cursor-pointer"
                onClick={() =>
                  navigate(
                    `/admin/course_management/coursedetail/${course_data.id}`
                  )
                }
              /> */}
            </div>

            {/* Alert Dialog */}
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. The selected course will
                    permanently delete data from servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setIsOpen(false)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      deleteCourse(course_data.id);
                      setIsOpen(false);
                    }}
                  >
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        );
      },
    },
  ];

  return columns;
};
