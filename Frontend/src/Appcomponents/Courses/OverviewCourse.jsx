import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import logo from "../Images/Logo2.png";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "animate.css";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Facebook, LinkedIn, Reviews, YouTube } from "@mui/icons-material";
import { Book, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";
import { Progress } from "@/components/ui/progress";

import { Badge } from "@/components/ui/badge";

import { Video, BookCheck } from "lucide-react";

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

const OverviewCourse = ({
  overview,
  userID,
  courseID,
  lessonCount,
  quizzesCount,
}) => {
  const [completedLessons, setCompletedLessons] = useState(0); // Example: Lessons completed
  const [enrolledcourse, setEnrolledcourse] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviewedCourse, setReviewedCourse] = useState(false);
  // const totalLessons = 15; // Example: Total lessons in the course
  const [reviews, setReviews] = useState([]);

  // Calculate progress value as a percentage
  const totalItems = lessonCount + quizzesCount;
  const progressValue = parseFloat(
    (completedLessons / totalItems) * 100
  ).toFixed(2);

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
        <div className="">
          <div className="flex flex-row bg-pale py-12 px-4 mx-auto rounded-lg shadow-lg w-full items-center justify-between">
            <div className="w-full lg:w-[60%] mx-auto">
              {/* Course Details */}

              <div className="flex flex-row justify-between items-center mx-auto gap-4 py-2">
                <h2 className="text-3xl font-semibold text-heading text-center sm:text-left">
                  {overview.course_name}
                </h2>
                {enrolledcourse && (
                  // <SparklesText text="Enrolled course" className="text-lg animate-bounce" />
                  <div className="flex flex-row gap-3 items-center">
                    <div>
                      {" "}
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
                    </div>
                    <div>
                      <SparklesText text={<Badge>Enrolled</Badge>} />
                    </div>
                  </div>
                )}
              </div>

              <p className="my-3 text-base text-gray-700 font-semibold mx-auto w-full py-2">
                {overview.course_description}
              </p>

              {/* Instructor Info */}
              <div className="flex lg:flex-row items-center mx-auto gap-7 my-3 py-2">
                <div className="flex items-center justify-center sm:justify-start gap-4">
                  <Avatar className="cursor-pointer font-bold">
                    <AvatarImage
                      src={overview.instructor_image}
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

              <div className="flex flex-col md:flex-row gap-4 items-center w-full mx-auto mt-8">
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
            {/* <div className="hidden lg:block sm:w-1/2">
              <div className="w-[80%] mx-auto opacity-[7%]">
                <img src={logo} alt="doitung logo" />
              </div>
            </div> */}
          </div>

          <div className="w-full md:w-[90%] lg:w-[80%] mx-auto">
            <div className="flex flex-col lg:flex-row  mx-auto mt-8 p-6 bg-white rounded-lg lg:shadow-lg space-y-6 lg:space-y-0  border border-gray-300 w-[95%]  md:w-full  shadow-xl">
              <div className="flex-1 text-center lg:text-left">
                <div className="font-bold text-xl mb-2">
                  {overview.modules.length} Module Series
                </div>
                <p className="text-gray-700 text-base">
                  Earn a career credential that demonstrates your expertise
                </p>
              </div>

              <div className="hidden lg:block h-16 w-px bg-gray-300 mx-4"></div>

              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start">
                  <span className="text-yellow-400 text-xl">★</span>
                  <span className="text-gray-700 ml-1">{overview.rating}</span>
                  <span className="text-gray-500 ml-2">Rating</span>
                </div>
                <div>
                  <span className="text-gray-500 ml-2">
                    ({reviews.length} reviews)
                  </span>
                </div>
              </div>

              <div className="hidden lg:block h-16 w-px bg-gray-300 mx-4"></div>

              <div className="flex flex-col lg:flex-1 items-center text-center lg:text-left">
                <div className="flex flex-row gap-4 mt-2">
                  <span>
                    <Video />
                  </span>
                  <span className="text-gray-700 font-semibold">
                    {lessonCount} Lecture Videos
                  </span>
                </div>
                <div className="flex flex-row gap-4 mt-2">
                  <span>
                    <BookCheck />
                  </span>
                  <span className="text-gray-700 font-semibold">
                    {quizzesCount} Quizzes
                  </span>
                </div>
              </div>

              <div className="hidden lg:block h-16 w-px bg-gray-300 mx-4"></div>

              <div className="flex-1 text-center lg:text-left">
                <div className="mt-4">
                  <span className="text-gray-700 font-semibold">
                    Flexible schedule
                  </span>
                  <p className="text-gray-600">Learn at your own pace</p>
                </div>
              </div>
            </div>

            {enrolledcourse && (
              <div className="w-[95%] md:w-full  mx-auto mt-10">
                <h2 className="text-xl font-bold">Learning progress</h2>
                <p className="mt-2 text-sm text-gray-600">
                  {completedLessons} of {totalItems} activities completed
                </p>

                <div className="flex gap-3">
                  <Progress value={progressValue} className="mt-3" />
                  <p className="font-bold text-md">{`${progressValue}`}%</p>
                </div>
              </div>
            )}

            <div className="my-10 w-[95%] md:w-full  mx-auto ">
              <div className="flex flex-col lg:flex lg:flex-row justify-between items-center gap-4">
                <div className="w-full lg:w-1/2 gap-2 flex flex-col h-auto lg:h-[300px] mx-auto order-2 sm:order-1">
                  <p className="text-xl font-semibold mb-4">
                    What you'll learn
                  </p>
                  <div className="flex-1 flex-col gap-5 items-center justify-center bg-pale flex  p-4 rounded-xl w-[100%] overflow-y-auto text-sm sm:text-base border border-gray-300 shadow-xl ">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: overview?.overview,
                      }}
                    />
                  </div>
                </div>
                <div className="order-1 sm:order-2 w-full lg:w-1/2   gap-2 flex flex-col   h-auto lg:h-[300px] mx-auto">
                  <p className="text-xl font-semibold mb-4">Course demo :</p>
                  <div className="h-[250px] flex items-center justify-center ">
                    <HeroVideoDialog
                      className="dark:hidden block w-full "
                      animationStyle="fade"
                      videoSrc={overview?.demo_URL}
                      thumbnailSrc={overview?.course_image_url}
                      thumbnailAlt="Hero Video"
                    />
                    <HeroVideoDialog
                      className="hidden dark:block w-full h-full"
                      animationStyle="from-center"
                      videoSrc={overview?.demo_URL}
                      thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
                      thumbnailAlt="Hero Video"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* //// */}

            <div className="flex flex-col lg:flex-row w-[95%] md:max-w-full mx-auto justify-between gap-4 my-10">
              <div className=" lg:h-auto flex-col gap-2 w-full lg:w-1/2 overflow-y-auto">
                <div className="flex items-center justify-between mb-5">
                  <h1 className="text-lg font-semibold">Course outline</h1>
                  <p className="text-heading text-s lg:text-medium">
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
                        <div className="flex flex-col gap-4">
                          {module.lessons.map((lesson) => (
                            <span
                              className="flex gap-4 items-center"
                              key={lesson.lesson_id}
                            >
                              <Video />
                              <p>
                                <span className="font-bold">Video: </span>
                                {lesson.lesson_title || "No lesson founds"}
                              </p>
                            </span>
                          ))}
                          {module.quizzes.map((quiz) => (
                            <span
                              className="flex gap-4 items-center"
                              key={quiz.quiz_id}
                            >
                              <BookCheck />
                              <p>
                                <span className="font-bold">Quiz: </span>
                                {quiz.title || "No lesson founds"}
                              </p>
                            </span>
                          ))}
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
                <div className="flex items-center text-center justify-center bg-gray-800 text-white rounded-2xl p-3">
                  {overview?.tests[0]?.title}
                </div>
              </div>
              <div className="flex flex-col w-full lg:w-1/2">
                <h2 className="text-lg font-semibold mb-5 text-center justify-center">
                  Reviews And Ratings
                </h2>
                <div className="w-full p-4 bg-white rounded-lg border border-gray-300 shadow-xl h-[400px]">
                  <AllReviews AllReviews={reviews} />
                </div>
              </div>
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
