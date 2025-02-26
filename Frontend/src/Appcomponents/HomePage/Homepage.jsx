import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import PopularCourses from "../Courses/PopularCourses";
import IconCloud from "@/components/ui/icon-cloud";
import SimpleImageSlider from "react-simple-image-slider";
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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [randomCourses, setRandomCourses] = useState([]);
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };
  useEffect(() => {
    const getRandomCourses = (courses, minCount = 3) => {
      if (!Array.isArray(courses) || courses.length === 0) return [];
      return [...courses]
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(minCount, courses.length));
    };

    setRandomCourses(getRandomCourses(courses));
  }, [courses]); // Re-run when courses change

  // Example usage
  console.log(randomCourses);
  const images =
    "https://pedagoo.com/wp-content/uploads/2020/06/2250x1500_czy-warto-korzystac-ze-szkolen-online-ollh.jpg";
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
      <div className="flex flex-col md:flex-row gap-10 items-center justify-center bg-[#FAF5FF] p-10 rounded-3xl shadow-lg max-w-5xl mx-auto">
        {/* Image Section */}
        <div className="relative w-80 h-80 md:w-96 md:h-96 bg-white rounded-3xl flex flex-wrap overflow-hidden border-4 border-dashed border-purple-300">
          <div className="w-1/2 h-1/2 bg-purple-200 flex items-center justify-center">
            <img
              src="https://pedagoo.com/wp-content/uploads/2020/06/2250x1500_czy-warto-korzystac-ze-szkolen-online-ollh.jpg"
              alt="Online Learning"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-1/2 h-1/2 bg-orange-300"></div>
          <div className="w-1/2 h-1/2 bg-orange-300"></div>
          <div className="w-1/2 h-1/2 bg-purple-200 flex items-center justify-center">
            <img
              src="https://pedagoo.com/wp-content/uploads/2020/06/2250x1500_czy-warto-korzystac-ze-szkolen-online-ollh.jpg"
              alt="Online Learning"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Benefits Section */}
        <div className="ml-8 text-left">
          <h2 className="text-2xl font-bold text-gray-900">
            <span className="text-purple-500">Benefits</span> of Learning Online
          </h2>
          <ul className="mt-4 space-y-4">
            <li className="flex items-center">
              <span className="text-purple-500 text-xl mr-3">💻</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Flexible Learning
                </h3>
                <p className="text-gray-600 text-sm">
                  Study anytime, anywhere at your own pace.
                </p>
              </div>
            </li>
            <li className="flex items-center">
              <span className="text-pink-500 text-xl mr-3">⏳</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Short Courses
                </h3>
                <p className="text-gray-600 text-sm">
                  Focused lessons that make learning efficient.
                </p>
              </div>
            </li>
            <li className="flex items-center">
              <span className="text-indigo-500 text-xl mr-3">🎓</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Expert Guidance
                </h3>
                <p className="text-gray-600 text-sm">
                  Learn from industry leaders and professionals.
                </p>
              </div>
            </li>
            <li className="flex items-center">
              <span className="text-red-500 text-xl mr-3">📚</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  150+ Free Courses
                </h3>
                <p className="text-gray-600 text-sm">
                  Access a vast library of knowledge anytime.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      );
      {/* <div className="w-full sm:w-[80%] lg:w-[85%] mx-auto">
        <EnrolledCourses />
      </div> */}
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
