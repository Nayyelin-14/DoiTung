import React, { lazy } from "react";
import image1 from "../../assets/HeroImages/student1.jpg";
import image2 from "../../assets/HeroImages/student2.jpg";
import image3 from "../../assets/HeroImages/student 3.jpg";
import image4 from "../../assets/HeroImages/student4.jpg";
const PopularCourses = lazy(() => import("../Courses/PopularCourses"));
import "animate.css";
const Review = lazy(() => import("../Review/Review"));
const Content = lazy(() => import("@/layouts/Content"));
import { useTranslation } from "react-i18next";
import HeroSection from "./HeroSection";
import { motion } from "framer-motion";
const Homepage = () => {
  const { t } = useTranslation();

  const { Hero } = t("Home", { returnObjects: true });
  return (
    <section className="w-[100%]">
      {/* Hero Section */}
      <div className="w-full h-auto sm:h-[818px] lg:h-auto bg-pale  ">
        <div className="w-[90%] sm:w-[85%] mx-auto sm:h-[90%] md:h-full flex flex-col lg:flex-row justify-between items-center lg:gap-30 animate animate__fadeIn">
          <HeroSection />
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
          <div className="relative w-80 h-80 md:w-96 md:h-96 bg-pale rounded-2xl border border-gray-300 shadow-xl flex flex-wrap overflow-hidden">
            {[image1, image2, image3, image4].map((img, index) => (
              <motion.div
                key={index}
                className={`w-1/2 h-1/2 ${
                  index % 2 === 0 ? "bg-purple-200" : "bg-orange-300"
                } flex items-center justify-center`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <img
                  src={img}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>

          {/* Benefits Section */}
          <div className="ml-8 text-left  ">
            <h2 className="text-2xl font-bold text-gray-900">
              <span className="text-red-700">{Hero.Benefits}</span>
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
          <p className="text-red-800 font-bold">{Hero.Reviews}</p>
          {Hero.From_Clients}
        </h1>
        <Review />
      </div>
    </section>
  );
};

export default Homepage;
