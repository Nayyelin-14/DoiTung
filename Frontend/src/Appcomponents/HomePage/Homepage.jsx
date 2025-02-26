import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GetEnrolledCourses } from "@/EndPoints/user";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import PopularCourses from "../Courses/PopularCourses";
import IconCloud from "@/components/ui/icon-cloud";
import SimpleImageSlider from "react-simple-image-slider";
import { useSelector } from "react-redux";
import "animate.css";
import { Review } from "../Review/Review";
import { Link } from "react-router-dom";
import EnrolledCourses from "../Courses/EnrolledCourses";
const Homepage = ({ courses }) => {
  const slugs = [
    "microsoftteams", // For team collaboration
    "slack", // Workplace communication
    "zoom", // Video conferencing
    "asana", // Task management
    "trello", // Project organization
    "notion", // Note-taking and planning
    "github", // Version control and collaboration
    "gitlab", // Collaboration and productivity
    "figma", // Creative collaboration
    "googlemeet", // Video meetings
    "microsoftoutlook", // Email and organization
    "linkedin", // Professional networking
    "medium", // Knowledge sharing
    "edx", // Education and courses
    "coursera", // Online learning
    "khanacademy", // Skill building
    "udemy", // Learning new skills
    "microsoftpowerpoint", // Presentations
    "microsoftword", // Documentation
    "microsoftexcel", // Data and organization
    "stackoverflow", // Knowledge sharing and troubleshooting
    "youtube", // Video learning
    "firebase", // Development tools
    "react", // Technology stack
    "javascript", // Development tools
    "python", // Coding and automation
  ];
  const images = [
    "https://next-images.123rf.com/index/_next/image/?url=https://assets-cdn.123rf.com/index/static/assets/top-section-bg.jpeg&w=3840&q=75",
    "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    "https://fps.cdnpk.net/images/home/subhome-ai.webp?w=649&h=649",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [randomCourses, setRandomCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const { user } = useSelector((state) => state.user);
  const DisplayCourses = async () => {
    try {
      const response = await GetEnrolledCourses(user.user_id); //todo: Change to Enrolled courses

      if (response.isSuccess) {
        setEnrolledCourses(response.enrolledCourses);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(response.message);
    }
  };

    useEffect(() => {
      DisplayCourses();
    }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };
  useEffect(() => {
    const getRandomCourses = (courses, minCount = 4) => {
      if (!Array.isArray(courses) || courses.length === 0) return [];
      return [...courses]
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(minCount, courses.length));
    };

    setRandomCourses(getRandomCourses(courses));
  }, [courses]); // Re-run when courses change

  // Example usage
  console.log(randomCourses);
  return (
    <div className="w-[100%]">
      {/* Hero Section */}
      <div className="w-full h-auto sm:h-[818px] lg:h-auto bg-pale  ">
        <div className="w-[90%] sm:w-[85%] mx-auto sm:h-[90%] md:h-full flex flex-col lg:flex-row justify-between items-center lg:gap-30">
          <div className="w-full sm:w-[60%] lg:w-1/2 flex justify-center items-center animate__animated animate__fadeInLeft">
            <motion.div
              className="flex size-full max-w-xs sm:max-w-sm lg:max-w-lg items-center justify-center mb-10 sm:mb-0"
              animate={{ x: 0 }}
              transition={{ duration: 0.3, ease: "linear" }}
            >
              <IconCloud iconSlugs={slugs} />
            </motion.div>
          </div>
          <div className="w-full lg:w-1/2 py-8 text-center lg:text-left animate__animated animate__bounceInRight">
            <div className="flex flex-col text-3xl font-bold mb-4 text-heading">
              <h1>Unlock Your Potential: </h1>
              <span className="text-red-700">Learn, Build And Grow</span>
            </div>
            <p className=" mx-auto lg:mx-0 mb-6 py-4">
              Empower yourself with the skills and knowledge you need to
              succeed. Dive into hands-on learning experiences, and achieve your
              personal and professional goals with confidence.
            </p>

            <Link to={"/user/explore_courses"}>
              <button className="rounded-2xl border-2  border-black bg-white px-6 py-3 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none">
                <div className="flex gap-2 items-center">
                  Explore Courses <ArrowRight />
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Image Slider */}
      <div className="relative w-full sm:w-[80%] lg:w-[85%] md:h-[400px] mx-auto overflow-hidden my-10 rounded-3xl">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-[90%] sm:w-full md:w-full h-[260px] md:h-[90%] object-cover rounded-3xl mx-auto"
          />
        </AnimatePresence>

        <div className="">
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute top-1/2 left-2 transform   -translate-y-1/2 text-white  "
          >
            <ChevronLeft className="w-20 h-20" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute top-1/2 right-2 transform -translate-y-1/2  text-white  "
          >
            <ChevronRight className="w-20 h-20" />
          </button>
        </div>

        <div className="flex justify-center space-x-2 mt-4 ">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-black" : "bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>

      {enrolledCourses.length > 0 && (
        <div className="w-full sm:w-[80%] lg:w-[85%] mx-auto mb-8">
          <EnrolledCourses enrolledCourses={enrolledCourses}/>
      </div>
      )}
        

      {/* popular courses */}

      <div className="w-full sm:w-[80%] lg:w-[85%] mx-auto">
        <PopularCourses />
      </div>

      <div className="mt-14 w-[85%] mx-auto">
        <h1 className="text-center text-2xl font-bold">
          <span className=" text-red-800">Reviews</span> that we got from our
          clients
        </h1>
        <Review />
      </div>
    </div>
  );
};

export default Homepage;
