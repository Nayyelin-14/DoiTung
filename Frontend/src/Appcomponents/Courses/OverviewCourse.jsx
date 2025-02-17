import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";

import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "animate.css";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Facebook, LinkedIn, Reviews, YouTube } from "@mui/icons-material";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";
import { Progress } from "@/components/ui/progress";
import { Video } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CheckEnrollment,
  CheckReview,
  CourseEnrollment,
} from "@/EndPoints/user";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { SparklesText } from "@/components/ui/sparkles-text";
import CourseReview from "./CourseReview";
import AllReviews from "./AllReviews";
import { GetReviews } from "@/EndPoints/user";

const OverviewCourse = ({ overview, userID, courseID, lessonCount }) => {
  const [completedLessons, setCompletedLessons] = useState(0); // Example: Lessons completed
  const [enrolledcourse, setEnrolledcourse] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviewedCourse, setReviewedCourse] = useState(false);
  const totalLessons = 15; // Example: Total lessons in the course
  const [reviews, setReviews] = useState([]);

  // Calculate progress value as a percentage
  const progressValue = (completedLessons / lessonCount) * 100;

  const navigate = useNavigate();

  const fetchReviews = async () => {
    try {
      const response = await GetReviews(courseID);
      if (response?.reviews) {
        setReviews(response.reviews);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    }
  };

  const submitenrollment = async (userID, courseID) => {
    try {
      setLoading(true); // Set loading before calling API
      const response = await CourseEnrollment(userID, courseID);

      if (response.isSuccess) {
        toast.success(response.message);

        setEnrolledcourse(true); // Update enrollment status
        setTimeout(() => {
          navigate(`/user/course/${userID}/${courseID}`);
        }, 1000);
        toast.info("Redirecting to your course...", {
          autoClose: 1000, // Disappears after 3s
          position: "top-center",
        });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false); // Ensure loading is stopped
    }
  };

  const checkEnroll = async (userID, courseID) => {
    try {
      // setLoading(true); // Set loading before calling API
      const response = await CheckEnrollment(userID, courseID);

      if (response.isSuccess) {
        setEnrolledcourse(true); // Update the state if enrolled
        setCompletedLessons(response.completedLessonsCount);
      } else {
        setEnrolledcourse(false); // Ensure it's false if not enrolled
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false); // Ensure loading is stopped
    }
  };

  const checkReview = async (userID, courseID) => {
    try {
      const response = await CheckReview(userID, courseID);

      if (response.isSuccess) {
        setReviewedCourse(response.hasReviewed);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    checkEnroll(userID, courseID); // Ensure this runs only on initial render
    fetchReviews();
    checkReview(userID, courseID);
    console.log(reviewedCourse);
  }, [userID, courseID]);

  return (
    <div>
      {overview && (
        <div>
          <div className="bg-pale py-12 rounded-lg shadow-lg w-full flex flex-col items-center justify-center">
            <div className="w-[70%] ">
              {/* Course Details */}

              <div className="flex flex-row justify-between items-center gap-4">
                <h2 className="text-2xl font-semibold text-heading text-center sm:text-left">
                  {overview.course_name}
                </h2>
                {enrolledcourse && (
                  // <SparklesText text="Enrolled course" className="text-lg animate-bounce" />
                  <CourseReview
                    userID={userID}
                    courseID={courseID}
                    isReviewed={reviewedCourse}
                    fetchReviews={fetchReviews}
                  >
                    <div className="cursor-pointer">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Star
                              fill={`${reviewedCourse ? "yellow" : "none"}`}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Rate this Course</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CourseReview>
                )}
              </div>

              <p className="my-3 text-base text-gray-700 font-semibold">
                {overview.course_description}
              </p>

              {/* Instructor Info */}
              <div className="flex lg:flex-row items-center lg:items-start gap-7 my-3">
                <div className="flex items-center gap-4">
                  <Avatar className="cursor-pointer font-bold">
                    <AvatarImage
                      src={overview.instructor_name}
                      alt="Instructor"
                    />
                    <AvatarFallback>
                      {overview.instructor_name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="text-sm text-light-blue font-semibold">
                      Instructor
                    </span>
                    <p className="font-medium text-base">
                      {overview.instructor_name}
                    </p>
                  </div>
                </div>
                {/* Social Media */}
                <div className="flex gap-4 mt-4 lg:mt-0">
                  <a
                    href="#"
                    aria-label="Facebook"
                    className="hover:text-blue-600"
                  >
                    <Facebook />
                  </a>
                  <a
                    href="#"
                    aria-label="YouTube"
                    className="hover:text-red-600"
                  >
                    <YouTube />
                  </a>
                  <a
                    href="#"
                    aria-label="LinkedIn"
                    className="hover:text-blue-900"
                  >
                    <LinkedIn />
                  </a>
                </div>
              </div>

              {/* Course Info */}
              {/* <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 mx-auto gap-4 mt-6">
                <div>
                  <span className="font-semibold">Training Period:</span>
                  <p>{overview.training_period || "2 months"}</p>
                </div>
                <div>
                  <span className="font-semibold">Course Duration:</span>
                  <p>{overview.course_duration || "3h 43 minutes"}</p>
                </div>
                <div>
                  <span className="font-semibold">Learning Students:</span>
                  <p>{overview.learning_students || "100+"}</p>
                </div>
              </div> */}
              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-4 items-center w-full mt-8">
                {!enrolledcourse ? (
                  <>
                    <AlertDialog>
                      <AlertDialogTrigger className="w-full">
                        <button
                          className="bg-customGreen px-4 py-2 rounded-lg text-white font-bold hover:bg-customGreen/70 w-full animate-bounce"
                          disabled={loading}
                        >
                          {loading ? "Enrolling..." : "Enroll now"}
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This enrollment will
                            be permanently saved to your account.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => submitenrollment(userID, courseID)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <button className="bg-transparent text-black border border-black hover:bg-gray-300 w-full py-2 rounded-lg">
                      Save to watch later
                    </button>
                  </>
                ) : (
                  <button
                    className="bg-customGreen text-white hover:bg-green-900 w-full py-2 rounded-lg"
                    onClick={() =>
                      navigate(`/user/course/${userID}/${courseID}`)
                    }
                  >
                    Continue learning
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="my-20 w-[80%] mx-auto ">
            <div className="flex flex-col  lg:flex lg:flex-row justify-between items-center gap-4">
              <div className="flex-1 flex-col gap-5  bg-pale flex  p-4 rounded-xl w-full lg:h-[250px] xl:h-[340px] overflow-y-auto">
                <p className="text-2xl font-bold">What you'll learn</p>
                <div
                  dangerouslySetInnerHTML={{
                    __html: overview?.overview,
                  }}
                />
              </div>
              <div className="flex-1">
                <HeroVideoDialog
                  className="dark:hidden block"
                  animationStyle="fade"
                  videoSrc={overview?.demo_URL}
                  thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
                  thumbnailAlt="Hero Video"
                />
                <HeroVideoDialog
                  className="hidden dark:block"
                  animationStyle="from-center"
                  videoSrc={overview?.demo_URL}
                  thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
                  thumbnailAlt="Hero Video"
                />
              </div>
            </div>
          </div>
          {/* //// */}
          {enrolledcourse && (
            <div className="w-[95%] sm:max-w-[80%] mx-auto ">
              <h2 className="text-xl font-bold">Learning progress</h2>
              <p className="mt-2 text-sm text-gray-600">
                {completedLessons} of {lessonCount} lessons completed
              </p>

              <div className="flex gap-3">
                <Progress value={progressValue} className="mt-3" />
                <p className="font-bold text-md">{`${progressValue}`}%</p>
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row w-[95%] sm:max-w-[80%] mx-auto justify-between gap-4 my-10">
            <div className="w-full lg:w-[55%] p-4 bg-pale rounded-lg border border-gray-300 shadow-lg h-[550px]">
              <h2 className="text-xl font-semibold my-5">
                Reviews And Ratings
              </h2>
              <AllReviews AllReviews={reviews} />
            </div>
            <div className=" lg:h-[600px]  flex-col gap-2 w-full lg:w-[45%]  ">
              <div className="flex items-center justify-between mb-5">
                <h1 className="text-xl font-semibold">Course outline</h1>
                <p className="font-semibold text-heading text-xs lg:text-lg">
                  Total modules - {overview.modules.length}
                </p>
              </div>
              {overview.modules.map((module) => {
                return (
                  <Accordion
                    style={{ borderRadius: "17px", marginBottom: "10px" }}
                    key={module.module_id}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                      style={{
                        backgroundColor: "#F5F0E6",
                        borderRadius: "17px",
                      }}
                    >
                      <Typography component="span">
                        {module.module_title}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className="flex flex-col gap-1">
                        {module.lessons.map((lesson) => (
                          <span
                            className="flex gap-4 items-center"
                            key={lesson.lesson_id}
                          >
                            <Video />
                            {lesson ? (
                              <p>{lesson.lesson_title}</p>
                            ) : (
                              <p>No lesson founds</p>
                            )}
                          </span>
                        ))}
                      </div>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewCourse;

{
  /*  */
}
