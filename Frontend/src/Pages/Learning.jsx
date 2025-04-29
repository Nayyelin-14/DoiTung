import StartLessons from "@/Appcomponents/Learning/StartLessons";
import { CourseToLearn } from "@/EndPoints/user";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { toast } from "sonner";
const Learning = () => {
  const navigate = useNavigate();
  const { userID, courseID } = useParams();
  const [courseTitle, setCourseTitle] = useState("");
  const [lectures, setLectures] = useState([]);
  const [finalTest, setFinalTest] = useState({});
  const fetchCourseToLearn = async (userID, courseID) => {
    try {
      const response = await CourseToLearn(userID, courseID);

      if (response.isSuccess) {
        setCourseTitle(response.CourseTitle);
        setLectures(response.lessonsundermodule);
        setFinalTest(response.finalTest[0]);
      } else if (response.isSuccess === false) {
        toast.error(response.message);
        navigate("/user/explore_courses");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    fetchCourseToLearn(userID, courseID);
  }, []);
  const memoizedLectures = useMemo(() => lectures, [lectures]);

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
