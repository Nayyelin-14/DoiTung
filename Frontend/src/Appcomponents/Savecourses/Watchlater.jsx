import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatDistanceToNow } from "date-fns";
import { EllipsisVertical, TrashIcon } from "lucide-react";
import React, { useState, useEffect } from "react";

const Watchlater = ({ savedCourses }) => {
  console.log(savedCourses);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage, setCoursesPerPage] = useState(1); // Set to 1 for smaller screens

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 500) {
        setCoursesPerPage(1);
      } else if (window.innerWidth <= 1000) {
        setCoursesPerPage(2);
      } else if (window.innerWidth <= 1280) {
        setCoursesPerPage(3);
      } else {
        setCoursesPerPage(4);
      }
    };

    handleResize(); // Initial call to set coursesPerPage
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = savedCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );
  const totalPages = Math.ceil(savedCourses.length / coursesPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="mt-10">
      <p className="mb-10 font-bold text-2xl ">
        Saved courses - {savedCourses.length}
      </p>
      {savedCourses.length > 0 ? (
        currentCourses.map((course, index) => (
          <div
            className="flex flex-col sm:flex-row items-center mb-3 border-2 border-gray-300 rounded-lg overflow-hidden w-full sm:w-[500px] md:w-[700px] lg:w-[1000px] mx-auto shadow-md hover:bg-gray-200"
            key={index}
          >
            <div className="relative">
              <img
                src={course.course_image_url}
                alt=""
                className="w-full h-[150px] sm:w-[300px] object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent text-white p-2">
                <div className="flex items-center justify-between">
                  {/* ... (Your tags and time here) ... */}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 p-4 w-full">
              <div className="flex-grow">
                <p className="font-semibold text-lg sm:text-md mb-1">
                  {course.course_name}
                </p>
                <p className="text-gray-400 text-sm sm:text-xs truncate w-full font-bold mb-1">
                  {course.course_description.length > 25
                    ? course.course_description.slice(0, 25) + "..."
                    : course.course_description}{" "}
                </p>
                <p className="text-gray-400 text-sm sm:text-xs truncate w-full font-bold ">
                  {course.instructor_name.length > 25
                    ? course.instructor_name.slice(0, 25) + "..."
                    : course.instructor_name}{" "}
                  •{" "}
                  {formatDistanceToNow(new Date(course.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <div className="p-3 border border-balck hover:bg-black/20">
                <TrashIcon className="text-red-800 hover:text-red-500 cursor-pointer" />
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>No saved courses found</div>
      )}

      {/* Pagination */}
      <div className="my-10">
        <div className="flex justify-between items-center my-14">
          <Pagination className="flex items-center justify-center space-x-2">
            <PaginationContent>
              <PaginationPrevious
                className={`hover:bg-gray-400 cursor-pointer ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                label="Previous"
                disabled={currentPage === 1}
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
              />
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i} onClick={() => handlePageChange(i + 1)}>
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
                disabled={currentPage === totalPages}
                onClick={() =>
                  currentPage < totalPages && handlePageChange(currentPage + 1)
                }
              />
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default Watchlater;
