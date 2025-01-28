import StartLessons from "@/Appcomponents/Learning/StartLessons";
import { CourseToLearn } from "@/EndPoints/user";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const Learning = () => {
  const { userID, courseID } = useParams();
  const fetchCourseToLearn = async (userID, courseID) => {
    try {
      const response = await CourseToLearn(userID, courseID);
      console.log(response);
    } catch (error) {}
  };
  useEffect(() => {
    fetchCourseToLearn(userID, courseID);
  }, []);
  return (
    <div>
      <StartLessons />
    </div>
  );
};

export default Learning;
