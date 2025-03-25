import StartLessons from "@/Appcomponents/Learning/StartLessons";
import { CourseToLearn } from "@/EndPoints/user";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";
const Learning = () => {
  const { userID, courseID } = useParams();
  const [courseTitle, setCourseTitle] = useState("");
  const [lectures, setLectures] = useState([]);
  const [finalTest, setFinalTest] = useState({});
  const fetchCourseToLearn = async (userID, courseID) => {
    try {
      const response = await CourseToLearn(userID, courseID);
      if (response.isSuccess) {
        console.log(response);
        setCourseTitle(response.CourseTitle);
        setLectures(response.lessonsundermodule);
        setFinalTest(response.finalTest[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCourseToLearn(userID, courseID);
  }, []);
  const memoizedLectures = useMemo(() => lectures, [lectures]);

  console.log("Learning got rendered1");

  return (
    <div>
      <StartLessons
        coursetitle={courseTitle}
        lectures={memoizedLectures}
        finalTest={finalTest}
        userID={userID}
        courseID={courseID}
      />
    </div>
  );
};

export default Learning;
