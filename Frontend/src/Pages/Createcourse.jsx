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

  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

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
        <h1 className="my-5 font-semibold text-xl">{Text.Course_management}</h1>

        <Button
          className="w-fit"
          onClick={() => navigate("/admin/course_management/createcourse")}
        >
          <Plus />
          <h1 className="font-bold ">{Buttons.Create_New_Courses}</h1>
        </Button>
      </div>
      <CourseManagement courses={courses} fetchCourses={fetchCourses} />
    </AdminSide>
  );
};

export default Createcourse;
