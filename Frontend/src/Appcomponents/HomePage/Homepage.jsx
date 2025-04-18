import React, { lazy, Suspense } from "react";
import { motion } from "framer-motion";

import { ArrowRight } from "lucide-react";
const PopularCourses = lazy(() => import("../Courses/PopularCourses"));
import IconCloud from "@/components/ui/icon-cloud";

import "animate.css";
const Review = lazy(() => import("../Review/Review"));

import { Link } from "react-router-dom";

const Content = lazy(() => import("@/layouts/Content"));

import { useTranslation } from "react-i18next";

// import Review from "../Review/Review";
import { OrbitProgress } from "react-loading-indicators";
const Homepage = () => {
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
  const { t } = useTranslation();

  const { Hero } = t("Home", { returnObjects: true });
  return (
    <section className="w-[100%]">
      {/* Hero Section */}
      <div className="w-full h-auto sm:h-[818px] lg:h-auto bg-pale  ">
        <div className="w-[90%] sm:w-[85%] mx-auto sm:h-[90%] md:h-full flex flex-col lg:flex-row justify-between items-center lg:gap-30">
          <div className="w-full sm:w-[60%] lg:w-1/2 flex justify-center items-center">
            <motion.div
              className="flex size-full max-w-xs sm:max-w-sm lg:max-w-lg items-center justify-center mb-10 sm:mb-0"
              animate={{ x: 0 }}
              transition={{ duration: 0.3, ease: "linear" }}
            >
              <IconCloud iconSlugs={slugs} />
            </motion.div>
          </div>
          <div className="w-full lg:w-1/2 py-8 text-center lg:text-left">
            <div className="flex flex-col text-3xl font-bold mb-4 text-heading">
              <h1>{Hero.unlock}</h1>
              <span className="text-red-700">{Hero.learn}</span>
            </div>
            <p className=" mx-auto lg:mx-0 mb-6 py-4">{Hero.empower}</p>

            <Link to={"/user/explore_courses"}>
              <button className="rounded-2xl border-2  border-black bg-white px-6 py-3 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none">
                <div className="flex gap-2 items-center">
                  {Hero.explore} <ArrowRight />
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="py-12 px-4 bg-white">
        <Content />
      </div>

      <div className="w-full sm:w-[80%]  mx-auto my-7">
        <PopularCourses />
      </div>

      <div className="w-full bg-pale mt-14">
        <div className="flex flex-col md:flex-row gap-10 items-center justify-between max-w-4xl mx-auto  p-10 w-[80%] my-10 ">
          {/* Image Section */}
          <div className="relative   w-80 h-80 md:w-96 md:h-96 bg-white rounded-2xl  border-1 border-gray-300 shadow-xl flex flex-wrap overflow-hidden">
            <div className="w-1/2 h-1/2 bg-purple-200 flex items-center justify-center ">
              <img
                src="https://discoverymood.com/wp-content/uploads/2020/10/DMA_Blog_OnlineClassBullying_Image_Opt-510x340.jpg"
                alt="Online Learning"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="w-1/2 h-1/2 bg-orange-300 ">
              <img
                src=" https://news.virginia.edu/sites/default/files/article_image/online_learning_header.jpg"
                alt="Online Learning"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="w-1/2 h-1/2 bg-orange-300 ">
              <img
                src="https://online.uark.edu/_resources/images/hero-online-student-orientation.jpg"
                alt="Online Learning"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="w-1/2 h-1/2 bg-purple-200 flex items-center justify-center ">
              <img
                src="https://pedagoo.com/wp-content/uploads/2020/06/2250x1500_czy-warto-korzystac-ze-szkolen-online-ollh.jpg"
                alt="Online Learning"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Benefits Section */}
          <div className="ml-8 text-left  ">
            <h2 className="text-2xl font-bold text-gray-900">
              <span className="text-red-700">{Hero.Benefits}</span>{" "}
              {Hero.of_Learning_Online}
            </h2>
            <ul className="mt-4 space-y-4">
              <li className="flex items-center">
                <span className="text-purple-500 text-xl mr-3">💻</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {Hero.Flexible_Learning}
                  </h3>
                  <p className="text-gray-600 text-sm">{Hero.Study_anytime}</p>
                </div>
              </li>
              <li className="flex items-center">
                <span className="text-pink-500 text-xl mr-3">⏳</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {Hero.Short_Courses}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {Hero.Focused_lessons}
                  </p>
                </div>
              </li>
              <li className="flex items-center">
                <span className="text-indigo-500 text-xl mr-3">🎓</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {Hero.Expert_Guidance}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {Hero.Learn_from_experts}
                  </p>
                </div>
              </li>
              <li className="flex items-center">
                <span className="text-red-500 text-xl mr-3">📚</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {Hero.Free_Courses}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {Hero.Access_knowledge}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-14 w-[85%] mx-auto">
        <h1 className="text-center text-xl font-semibold">
          <p className="text-red-800 font-bold">{Hero.Reviews}</p>{" "}
          {Hero.From_Clients}
        </h1>
        <Review />
      </div>
    </section>
  );
};

export default Homepage;
