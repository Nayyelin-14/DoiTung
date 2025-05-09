import AdminSide from "@/Appcomponents/AdminSide/Admin";
import { motion } from "framer-motion";
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

import { CourseDetails, RemoveEnrolleduser } from "@/EndPoints/courses";
import { cn, SpinLoader } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { toast } from "sonner";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Trash2Icon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const CourseDetail = () => {
  const params = useParams();

  const [rowperpage, setRowperpage] = useState(5);
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["course-details", params.courseid],
    queryFn: () => CourseDetails(params.courseid),
  });
  const courseDetails = data?.details;
  const enrolledusers = data?.enrolledUsers;

  const { mutate: RemoveConfirm } = useMutation({
    mutationFn: (userid) => RemoveEnrolleduser(userid, params.courseid),
    onSuccess: (response) => {
      if (response.isSuccess) {
        toast.info(response.message);
        queryClient.invalidateQueries(["course_details", params.courseid]);
      } else {
        toast.error("Failed to remove a user");
      }
    },
    onError: (error) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const indexoflastRow = currentPage * rowperpage;

  const indexoffirstRow = indexoflastRow - rowperpage;

  const userRows = enrolledusers?.slice(indexoffirstRow, indexoflastRow);

  const totalPages = Math.ceil(enrolledusers?.length / rowperpage);

  const handlePageChange = (pgNum) => {
    if (pgNum >= 1 && pgNum <= totalPages) {
      setCurrentPage(pgNum);
    }
  };

  const totalLessons = courseDetails?.modules?.reduce(
    (total, module) => total + module.lessons.length,
    0
  );

  return (
    <AdminSide>
      {isLoading ? (
        <SpinLoader />
      ) : (
        <div className="p-3 bg-gray-100 h-[86%] mt-5">
          <motion.div
            className="bg-white p-4 rounded-lg shadow-md max-w-4xl "
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Course Header Section */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Course Image */}
              <motion.img
                src={courseDetails.course_image_url}
                alt={courseDetails.course_name}
                className="w-20 h-20 object-cover rounded-lg shadow-md transition-transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
              />

              {/* Course Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-xl font-bold text-gray-900">
                  {courseDetails.course_name}
                </h2>
                <p className="text-gray-600 mt-1 text-sm line-clamp-2 max-w-md">
                  {courseDetails.course_description}
                </p>

                {/* Category & Module Count */}
                <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                  <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                    {courseDetails.category}
                  </span>
                  <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded-full">
                    {courseDetails.modules?.length || 0} Modules
                  </span>
                  <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded-full">
                    {totalLessons || 0} Lessons
                  </span>
                </div>
              </div>
            </div>

            {/* Instructor Details */}
            <div className="mt-3 flex items-center gap-3 p-3 border-t">
              <img
                src={courseDetails.instructor_image}
                alt={courseDetails.instructor_name}
                className="w-12 h-12 rounded-full border shadow-sm object-cover"
              />
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  {courseDetails.instructor_name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {courseDetails.about_instructor}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Enrolled Users Table */}
          <motion.div
            className="mt-6 bg-white p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-xl font-semibold mb-4">Enrolled Users</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3 text-left">User</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-center">Enrollment Date</th>
                    <th className="p-3 text-center">Progress</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userRows?.map((user, index) => (
                    <motion.tr
                      key={user.user_id}
                      className="border-b transition hover:bg-gray-100"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <td className="p-3">{user.username}</td>

                      <td className="p-3">
                        <span
                          className={cn(
                            "p-1 px-2 rounded-lg w-fit text-sm text-white",
                            user.role === "admin"
                              ? " bg-customGreen "
                              : "bg-black "
                          )}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="p-3  text-center">
                        {format(new Date(user.enrolled_at), "dd MMM yyyy")}
                      </td>
                      <td className="p-3  sm:flex sm:items-center sm:justify-center">
                        <div className="w-32 bg-gray-300 flex items-center  ">
                          <div
                            className="bg-black text-xs font-bold text-white text-center p-1 "
                            style={{ width: `${user.progress}%` }}
                          >
                            {user.progress}%
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center">
                          <p
                            className={cn(
                              `${
                                user.is_completed
                                  ? "bg-green-500"
                                  : "bg-yellow-500"
                              } w-fit p-1 text-md text-white text-sm text-center rounded-lg`
                            )}
                          >
                            {user.is_completed ? "Completed" : "Ongoing"}
                          </p>
                        </div>
                      </td>

                      <AlertDialog>
                        <td className="p-3 text-center">
                          <AlertDialogTrigger>
                            <p className=" text-red-700 px-3 py-1 rounded hover:text-red-400">
                              <Trash2Icon />
                            </p>
                          </AlertDialogTrigger>
                        </td>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently remove user account and remove user
                              data from this course.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => RemoveConfirm(user.user_id)}
                            >
                              Confirm
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {enrolledusers?.length === 0 && (
                <div className="my-16 flex items-center justify-center text-2xl text-red-700 font-semibold">
                  Users not found in this course!!!
                </div>
              )}
            </div>
          </motion.div>
          {window.innerWidth < 1280 && enrolledusers?.length > 5 && (
            <div className="flex justify-between items-center my-14">
              <Pagination className="flex items-center justify-center space-x-2">
                <PaginationContent>
                  <PaginationPrevious
                    className={`hover:bg-gray-400 cursor-pointer ${
                      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    label="Previous"
                    disabled={currentPage === 1} // This will still disable the button
                    onClick={() =>
                      currentPage > 1 && handlePageChange(currentPage - 1)
                    } // Only trigger page change if not at the first page
                  />

                  {totalPages &&
                    totalPages > 0 &&
                    [...Array(totalPages)].map((_, i) => (
                      <PaginationItem
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                      >
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
                    disabled={currentPage === totalPages} // Disable if on the last page
                    onClick={() =>
                      currentPage < totalPages &&
                      handlePageChange(currentPage + 1)
                    } // Only trigger page change if not on the last page
                  />
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}
    </AdminSide>
  );
};

export default CourseDetail;
