import AdminSide from "@/Appcomponents/AdminSide/Admin";
import CourseManagement from "@/Appcomponents/AdminSide/CourseManagement/CourseManagement";
import { Button } from "@/components/ui/button";
import { getAllCourses } from "@/EndPoints/drafts";

import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Createcourse = () => {
  const { t } = useTranslation();

  const { Text, Buttons } = t("Courses", {
    returnObjects: true,
  });
  //   "": {
  //     "Course_management": "Course management",
  //     "Courses": "Courses"

  //  },
  //  "": {
  //    "Create_New_Courses": "Create New Courses",
  //    "Total_courses": "Total courses",
  //    "All_courses": "All courses",
  //    "Completed": "Completed",
  //    "Draft": "Draft",
  //    "Previous": "Previous",
  //    "Next": "Next"
  //  }

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
      <div className=" max-w-6xl mx-auto my-5 ml-10 xl:max-w-[1400px]  ">
        <h1 className="my-5 font-semibold text-xl">Course management</h1>

        <Button
          className="w-fit"
          onClick={() => navigate("/admin/course_management/createcourse")}
        >
          <Plus />
          <h1 className="font-bold ">{Buttons.Create_New_Courses}</h1>
        </Button>
      </div>
      <CourseManagement courses={courses} />
    </AdminSide>
  );
};

export default Createcourse;
