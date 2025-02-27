import { Course_overview } from "@/EndPoints/courses";
import React, { useEffect, useState } from "react";
import { redirect, useParams } from "react-router-dom";
import { toast } from "sonner";
// import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import OverviewCourse from "@/Appcomponents/Courses/OverviewCourse";
import { useSelector } from "react-redux";
import { OrbitProgress } from "react-loading-indicators";

const CourseOverview = () => {
  const { user } = useSelector((state) => state.user);
  const { courseID } = useParams();
  const [overview, setOverview] = useState([]);
  const [lessonCount, setLessonCount] = useState(0);
  const [quizzesCount, setQuizzesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  // Call checkEnroll once when the component first renders
  const OverView = async () => {
    setIsLoading(true);
    try {
      const response = await Course_overview(courseID);

      if (response.isSuccess) {
        setOverview(response.courseDetails);
        setLessonCount(response.totalLessonsCount);
        setQuizzesCount(response.totalQuizzesCount);
      }
    } catch (error) {
      toast.error(error.message);
      redirect("/expore_courses");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    OverView();
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <OrbitProgress color="#32cd32" size="large" text="" textColor="" />;
        </div>
      ) : (
        <OverviewCourse
          overview={overview[0]}
          userID={user.user_id}
          courseID={courseID}
          lessonCount={lessonCount}
          quizzesCount={quizzesCount}
        />
      )}
    </div>
  );
};

export default CourseOverview;
