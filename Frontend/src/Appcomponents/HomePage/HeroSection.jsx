import { ArrowRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import image from "./student.png";
const HeroSection = () => {
  return (
    <section className="w-full   py-20 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 sm:gap-0">
        <div className="md:w-1/2 relative hidden md:flex ">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-[#FF3E54] opacity-100 z-100 blur-2xl"></div>
          <div className="relative z-10">
            <img src={image} alt="Student" className="w-[100%] object-cover" />
          </div>
          <div className="absolute bottom-0 right-0 w-52 h-52 bg-blue-300 rounded-full opacity-100 blur-3xl z-0"></div>
        </div>

        <div className="md:w-1/2 text-center md:text-left space-y-5">
          <p className="text-sm uppercase tracking-wider text-black">
            Learn New Skills & Popular Courses
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-snug">
            Unlock <span>New Potential</span>, <br />
            <span className="text-[#EF5350]">Everywhere.</span>
          </h1>
          <p className="text-gray-700">
            Empower yourself with the skills and knowledge you need to succeed.
            Dive into hands-on learning experiences, and achieve yourpersonal
            and professional goals with confidence.
          </p>
          <Link to={"/user/explore_courses"} replace>
            <button className="rounded-2xl border-2 mt-4 border-black bg-white px-6 py-3 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none">
              <div className="flex gap-2 items-center ">
                Explore Courses <ArrowRight />
              </div>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
