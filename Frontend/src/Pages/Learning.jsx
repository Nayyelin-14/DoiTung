import StartLessons from "@/Appcomponents/Learning/StartLessons";
import { CourseToLearn } from "@/EndPoints/user";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
const Learning = () => {
  const { userID, courseID } = useParams();
  const [courseTitle, setCourseTitle] = useState("");
  const [lectures, setLectures] = useState([]);
  const fetchCourseToLearn = async (userID, courseID) => {
    try {
      const response = await CourseToLearn(userID, courseID);
      if (response.isSuccess) {
        setCourseTitle(response.CourseTitle);
        setLectures(response.lessonsundermodule);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCourseToLearn(userID, courseID);
  }, []);

  return (
    <div>
      <StartLessons coursetitle={courseTitle} lectures={lectures} />
    </div>
  );
};

export default Learning;
