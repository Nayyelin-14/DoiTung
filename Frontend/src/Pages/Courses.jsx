import ExploreCourses from "@/Appcomponents/Courses/ExploreCourses";
import { getAllCourses } from "@/EndPoints/courses";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [errMsg, setErrMsg] = useState("");
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
    <div>
      <ExploreCourses courses={courses} />
    </div>
  );
};

export default Courses;
