import AdminSide from "@/Appcomponents/AdminSide/Admin";
import CourseManagement from "@/Appcomponents/Courses/Management/CourseManagement";
import { getAllCourses } from "@/EndPoints/drafts";

import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Createcourse = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const filteredCourses = courses.filter((course) => {
    // Check if the course matches the search query and if it matches the selected category
    const matchesSearch = course.course_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesSearch;
  });
  const fetchCourses = async () => {
    try {
      const response = await getAllCourses();

      if (response.isSuccess) {
        setCourses(response.courses);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <AdminSide>
      <div className="ml-10">
        <h1 className="my-5 font-semibold text-xl">Course management</h1>
        <div className="flex flex-col gap-6 mb-5">
          <div
            className="flex  items-center  p-2 gap-4  w-fit md:mx-0 border border-gray-300 shadow-md   md:w-56 bg-pale rounded-xl cursor-pointer"
            onClick={() => navigate("/admin/course_management/createcourse")}
          >
            <Plus />
            <h1 className="font-bold ">Create New Courses</h1>
          </div>
        </div>
      </div>
      <CourseManagement courses={courses} />
    </AdminSide>
  );
};

export default Createcourse;
