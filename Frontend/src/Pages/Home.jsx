import React, { useEffect, useState } from "react";
import Homepage from "../Appcomponents/HomePage/Homepage";
import { getCourses } from "@/EndPoints/courses";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const fetchCourses = async () => {
    try {
      const response = await getCourses();
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
      <Homepage courses={courses} />
    </div>
  );
};

export default Home;
