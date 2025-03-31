import React from "react";
import Logo2 from "../Appcomponents/Images/mfllogo_2.png";
import { BsTwitterX } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa6";
import { IoLogoYoutube } from "react-icons/io";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="w-full bg-pale text-black py-10">
      <div className="w-[90%] lg:w-[85%] mx-auto flex flex-col lg:flex-row lg:justify-between items-center">
        {/* Logo Section */}
        <div className="w-[40%] sm:w-[30%] md:w-[15%] lg:w-[10%] mb-6 lg:mb-0 flex justify-center lg:justify-start">
          <img src={Logo2} alt="Logo" className="w-[68%] max-w-[120px]" />
        </div>
      </div>

      {/* Footer Bottom Section */}
      <hr className="bg-gray-500 my-6 w-[90%] mx-auto" />
      <div className="w-[90%] mx-auto flex flex-wrap justify-center lg:justify-between items-center gap-4">
        <p className="text-center text-sm lg:text-base">
          © 2024 E-learning. All rights reserved.
        </p>

        {/* Social Media Icons */}
        <div className="flex gap-5 items-center">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsTwitterX size={25} />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook size={25} />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IoLogoYoutube size={25} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin size={25} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
