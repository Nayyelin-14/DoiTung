import { Course_overview } from "@/EndPoints/courses";

import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
// import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import OverviewCourse from "@/Appcomponents/Courses/OverviewCourse";
import { useSelector } from "react-redux";

import { SpinLoader } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

const CourseOverview = () => {
  const { user } = useSelector((state) => state.user);
  const { courseID } = useParams();
  const navigate = useNavigate();

  // Use useQuery to fetch course overview data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["courseOverview", courseID],
    queryFn: () => Course_overview(courseID),

    onSuccess: () => {
      if (!data.isSuccess) {
        toast.error(data.message);
      }
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
      navigate("/explore_courses"); // redirect on error
    },
    staleTime: Infinity,
  });

  // Extract values from the response if available
  const overview = data?.courseDetails || [];
  const lessonCount = data?.totalLessonsCount || 0;
  const quizzesCount = data?.totalQuizzesCount || 0;

  return (
    <div>
      {isLoading ? (
        <SpinLoader />
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
