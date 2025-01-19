import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import elearning from "../../assets/elearning1.jpg";
import learningPic from "../../assets/elearning2.avif";
import { Button } from "@/components/ui/button"

const AboutUs = () => {
  return (
    <>
        <div className="bg-pale h-[250px] flex items-center justify-center">
          <div className="text-center">
              <h1 className="text-[25px] font-bold text-heading animate__animated animate__fadeInDown">About Us</h1>
              <div className='flex flex-row gap-2'>
                  <Link to="/">Home</Link>
                  <p>/</p>
                  <p>About Us</p>
              </div>
          </div>
        </div>

        <div className="w-full h-[400px]">
          <div className="w-[90%] mx-auto h-full flex flex-col-reverse lg:flex-row justify-between items-center gap-8">
            {/* Text Section */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center text-center lg:text-left animate__animated animate__fadeInLeft">
              <h1 className="text-xl md:text-xl font-bold mb-4 text-black">
                Unlock Your Potential: Learn, Build, and Grow
              </h1>
              <p className="text-base w-[90%] lg:w-3/4 mx-auto lg:mx-0 mb-6 text-gray-700">
                Empower yourself with the skills and knowledge you need to succeed. Dive into hands-on learning experiences and achieve your personal and professional goals with confidence.
              </p>
            </div>

            {/* Image Section */}
            <div className="lg:w-1/2 flex justify-center items-center animate__animated animate__bounceInRight">
              <img 
                src={elearning} 
                alt="E-learning Illustration" 
                className="w-64 md:w-80 lg:w-[400px] rounded-xl shadow-xl"
              />
            </div>
          </div>
        </div>

        <div className="w-full h-[400px]">
          <div className="w-[90%] mx-auto h-full flex flex-col lg:flex-row justify-between items-center gap-8">
            {/* Image Section */}
            <div className="lg:w-1/2 flex justify-center items-center animate__animated animate__bounceInLeft">
              <img 
                src={learningPic} 
                alt="E-learning Illustration" 
                className="w-64 md:w-80 lg:w-[400px] rounded-xl shadow-xl"
              />
            </div>

            {/* Text Section */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center text-center lg:text-left animate__animated animate__fadeInRight">
              <h1 className="text-xl font-bold mb-4 text-black">
                Our Mission
              </h1>
              <p className="text-base w-[90%] lg:w-3/4 mx-auto lg:mx-0 mb-6 text-gray-700">
                Empower yourself with the skills and knowledge you need to succeed. Dive into hands-on learning experiences and achieve your personal and professional goals with confidence.
              </p>
            </div>
          </div>
        </div>

        <div className="h-[250px] flex items-center justify-center">
          <div className="text-center">
              <h1 className="text-xl font-bold pb-8 text-heading animate__animated animate__fadeInUp">"Your journey to growth begins here. Let's build the future, together."</h1>
              <Link to="/explore_courses">
                <Button className="bg-customGreen text-md">Start Learning Now!</Button>
              </Link>
          </div>
        </div>

    </>
  )
}

export default AboutUs;