import AdminSide from "@/Appcomponents/AdminSide/Admin";
import ExploreCourses from "@/Appcomponents/Courses/ExploreCourses";
import { getAllCourses } from "@/EndPoints/courses";
import { File, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Createcourse = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const fetchCourses = async () => {
    try {
      const response = await getAllCourses();
      console.log(response);
      if (response.isSuccess) {
        setCourses(response.courses);
      } else {
        toast.error(response.message);
        setErrMsg(response.message);
      }
    } catch (error) {
      toast.error(error.message);
      setErrMsg(response.message);
    }
  };
  useEffect(() => {
    fetchCourses();
  }, []);
  return (
    <AdminSide>
      <div className="my-5 ml-5">
        <h1 className="my-5 font-semibold text-xl">Course management</h1>
        <div className="flex gap-10">
          <div
            className="flex flex-col items-center justify-center  gap-4 w-56 h-32 bg-pale rounded-xl cursor-pointer"
            onClick={() => navigate("/admin/course_management/createcourse")}
          >
            <Plus />
            <h1>Create New Courses</h1>
          </div>
          <div className="flex flex-col items-center justify-center  gap-4 w-56 h-32 bg-pale rounded-xl">
            <File />
            <h1>Draft Courses</h1>
          </div>
        </div>
        <div>
          <ExploreCourses courses={courses} createMode={true} />
        </div>
      </div>
    </AdminSide>
  );
};

export default Createcourse;
