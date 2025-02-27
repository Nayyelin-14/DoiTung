import ExploreCourses from "@/Appcomponents/Courses/ExploreCourses";
import { getCourses } from "@/EndPoints/courses";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await getCourses();

      if (response.isSuccess) {
        setCourses(response.courses);
      } else {
        toast.error(response.message);
        setErrMsg(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchCourses();
  }, []);
  return (
    <div>
      <ExploreCourses courses={courses} isLoading={isLoading} />
    </div>
  );
};

export default Courses;
