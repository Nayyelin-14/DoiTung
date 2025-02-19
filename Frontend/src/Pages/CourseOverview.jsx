import { Course_overview } from "@/EndPoints/courses";
import React, { useEffect, useState } from "react";
import { redirect, useParams } from "react-router-dom";
import { toast } from "sonner";
// import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import OverviewCourse from "@/Appcomponents/Courses/OverviewCourse";
import { useSelector } from "react-redux";

const CourseOverview = () => {
  const { user } = useSelector((state) => state.user);
  const { courseID } = useParams();
  const [overview, setOverview] = useState([]);
  const [lessonCount, setLessonCount] = useState(0);
  const [quizzesCount, setQuizzesCount] = useState(0)
  // Call checkEnroll once when the component first renders

  const OverView = async () => {
    try {
      const response = await Course_overview(courseID);

      if (response.isSuccess) {
        console.log(response);
        setOverview(response.courseDetails);
        setLessonCount(response.totalLessonsCount);
        setQuizzesCount(response.totalQuizzesCount);
      }
    } catch (error) {
      toast.error(error.message);
      redirect("/expore_courses");
    }
  };
  useEffect(() => {
    OverView();
  }, []);

  // const reviews = [
  //   {
  //     name: "Jack",
  //     username: "@jack",
  //     body: "I've never seen anything like this before. It's amazing. I love it.",
  //     img: "https://avatar.vercel.sh/jack",
  //   },
  //   {
  //     name: "Jill",
  //     username: "@jill",
  //     body: "I don't know what to say. I'm speechless. This is amazing.",
  //     img: "https://avatar.vercel.sh/jill",
  //   },
  //   {
  //     name: "John",
  //     username: "@john",
  //     body: "I'm at a loss for words. This is amazing. I love it.",
  //     img: "https://avatar.vercel.sh/john",
  //   },
  //   {
  //     name: "Jane",
  //     username: "@jane",
  //     body: "I'm at a loss for words. This is amazing. I love it.",
  //     img: "https://avatar.vercel.sh/jane",
  //   },
  //   {
  //     name: "Jenny",
  //     username: "@jenny",
  //     body: "I'm at a loss for words. This is amazing. I love it.",
  //     img: "https://avatar.vercel.sh/jenny",
  //   },
  //   {
  //     name: "James",
  //     username: "@james",
  //     body: "I'm at a loss for words. This is amazing. I love it.",
  //     img: "https://avatar.vercel.sh/james",
  //   },
  // ];

  return (
    <div>
      <OverviewCourse
        overview={overview[0]}
        userID={user.user_id}
        courseID={courseID}
        lessonCount={lessonCount}
        quizzesCount={quizzesCount}
      />
    </div>
  );
};

export default CourseOverview;
