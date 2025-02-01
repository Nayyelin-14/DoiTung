import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";

import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "animate.css";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Facebook, LinkedIn, YouTube } from "@mui/icons-material";

import { Button } from "@/components/ui/button";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";
import { Progress } from "@/components/ui/progress";
import { Video } from "lucide-react";

import { CheckEnrollment, CourseEnrollment } from "@/EndPoints/user";
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

const OverviewCourse = ({ overview, reviews, userID, courseID }) => {
  const [completedLessons, setCompletedLessons] = useState(1); // Example: Lessons completed
  const [enrolledcourse, setEnrolledcourse] = useState(false);
  const [loading, setLoading] = useState(false);
  const totalLessons = 15; // Example: Total lessons in the course

  // Calculate progress value as a percentage
  const progressValue = (completedLessons / totalLessons) * 100;

  const navigate = useNavigate();

  const submitenrollment = async (userID, courseID) => {
    try {
      setLoading(true); // Set loading before calling API
      const response = await CourseEnrollment(userID, courseID);

      if (response.isSuccess) {
        toast.success(response.message);

        setEnrolledcourse(true); // Update enrollment status
        setTimeout(() => {
          navigate(`/course/${userID}/${courseID}`);
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
      } else {
        setEnrolledcourse(false); // Ensure it's false if not enrolled
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false); // Ensure loading is stopped
    }
  };

  // Call checkEnroll once when the component first renders
  useEffect(() => {
    checkEnroll(userID, courseID); // Ensure this runs only on initial render
  }, [userID, courseID]);
  return (
    <div>
      {overview && (
        <div>

          <div className="bg-pale py-12 rounded-lg shadow-lg w-full flex flex-col items-center justify-center">
                <div className="w-full sm:max-w-[80%] grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Course Details */}
                  <div className="p-4 order-2 sm:order-1">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                      <h2 className="text-2xl font-semibold text-heading text-center sm:text-left">
                        {overview.course_name}
                      </h2>
                      {enrolledcourse && (
                        <SparklesText text="Enrolled course" className="text-lg animate-bounce" />
                      )}
                    </div>

                    <p className="my-3 text-base text-gray-700 font-semibold">{overview.course_description}</p>

                    {/* Instructor Info */}
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 my-3">
                      <div className="flex items-center gap-4">
                        <Avatar className="cursor-pointer font-bold">
                          <AvatarImage src={overview.instructor_name} alt="Instructor" />
                          <AvatarFallback>
                            {overview.instructor_name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="text-sm text-light-blue font-semibold">Instructor</span>
                          <p className="font-medium text-base">{overview.instructor_name}</p>
                        </div>
                      </div>
                      {/* Social Media */}
                      <div className="flex gap-4 mt-4 lg:mt-0">
                        <a href="#" aria-label="Facebook" className="hover:text-blue-600">
                          <Facebook />
                        </a>
                        <a href="#" aria-label="YouTube" className="hover:text-red-600">
                          <YouTube />
                        </a>
                        <a href="#" aria-label="LinkedIn" className="hover:text-blue-900">
                          <LinkedIn />
                        </a>
                      </div>
                    </div>

                    {/* Course Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
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
                    </div>
                    {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-4 items-center w-full mt-8">
                  {!enrolledcourse ? (
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
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This enrollment will be permanently saved to your account.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => submitenrollment(userID, courseID)}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <button
                      className="bg-customGreen text-white hover:bg-green-900 w-full py-2 rounded-lg"
                      onClick={() => navigate(`/user/course/${userID}/${courseID}`)}
                    >
                      Continue learning
                    </button>
                  )}
                  <button className="bg-transparent text-black border border-black hover:bg-gray-300 w-full py-2 rounded-lg">
                    Save to watch later
                  </button>
                </div>

                  </div>

                  {/* Video Section */}
                  <div className="order-1 sm:order-2 sm:p-4 flex justify-center">
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

          {/* <div className="my-20 w-[80%] mx-auto ">
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
          </div> */}
          {/* //// */}
          <div className="w-[80%] mx-auto my-10 ">
            <h2 className="text-xl font-bold">Learning progress</h2>
            <p className="mt-2 text-sm text-gray-600">
              {completedLessons} of {totalLessons} lessons completed
            </p>
            <Progress value={progressValue} />
          </div>
          <div className="flex flex-col lg:flex lg:flex-row w-[80%] mx-auto justify-between my-10 gap-4">
            <div className="flex-1 overflow-y-auto bg-pale p-4 rounded-lg flex flex-col gap-3">
              <h1 className="text-xl font-semibold">What You'll Learn</h1>
              <div
                  dangerouslySetInnerHTML={{
                    __html: overview?.overview,
                  }}
                />
            </div>

            <div className="flex-1 flex-col gap-2 w-full lg:w-[40%] mx-auto ">
              <div className="flex items-center justify-between mb-5">
                <h1 className="text-xl  font-semibold">Course outline</h1>
                <p className="font-bold text-xs lg:text-lg">
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

      <h1 className="max-w-[80%] mx-auto mb-6 text-2xl font-bold">Reviews</h1>
      <div className="w-[80%] mx-auto overflow-auto h-[400px] my-10">
        {reviews &&
          reviews.map((review) => (
            <div className="mb-6" key={review.name}>
              <div className="flex  gap-5 items-center">
                <Avatar className="cursor-pointer font-bold">
                  <AvatarImage src={review.img} />
                  <AvatarFallback>
                    {review.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <h1>{review.name}</h1>
              </div>
              <div className="lg:ml-[60px]">
                <p className="text-gray-500 text-base leading-8">
                  {review.body}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default OverviewCourse;
