import React from "react";
import Logo2 from "../Appcomponents/Images/Logo2.png";
import { BsTwitterX } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa6";
import { IoLogoYoutube } from "react-icons/io";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="w-full h-auto bg-gray-800 text-white py-10">
      <div className="w-full max-w-[90%] mx-auto flex flex-col lg:flex-row lg:justify-between items-center">
        {/* Logo Section */}
        <div className="w-[50%] lg:w-[12%] mb-8 lg:mb-0">
          <img src={Logo2} alt="Logo" className="w-full" />
        </div>

        {/* Links Section */}
        <div className="flex flex-wrap justify-center gap-10 lg:gap-20 w-full lg:w-[75%]">
          <ul className="flex-1 min-w-[120px]">
            <li className="font-bold text-lg mb-2">About Doitung</li>
            <li className="hover:underline">Home Page</li>
            <li className="hover:underline">Background</li>
            <li className="hover:underline">Vision</li>
            <li className="hover:underline">Social Benefit</li>
            <li className="hover:underline">News and Activities</li>
          </ul>

          <ul className="flex-1 min-w-[120px]">
            <li className="font-bold text-lg mb-2">Doitung Business Units</li>
            <li className="hover:underline">Coffee and Macadamia</li>
            <li className="hover:underline">Handicrafts</li>
            <li className="hover:underline">Café DoiTung</li>
            <li className="hover:underline">Tourism</li>
            <li className="hover:underline">Horticulture</li>
          </ul>

          <ul className="flex-1 min-w-[120px]">
            <li className="font-bold text-lg mb-2">Doitung Services</li>
            <li className="hover:underline">Privacy Policy</li>
            <li className="hover:underline">Service Policies and Conditions</li>
            <li className="hover:underline">Delivery Policies</li>
            <li className="hover:underline">Return Policy</li>
          </ul>

          <ul className="flex-1 min-w-[120px]">
            <li className="font-bold text-lg mb-2">Contact Us</li>
            <li className="hover:underline">Email</li>
            <li className="hover:underline">Phone</li>
            <li className="hover:underline">Location</li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <hr className="bg-gray-500 my-6 w-[90%] mx-auto" />
      <div className="w-[90%] mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">
        <p className="text-center text-sm lg:text-xl">
          © 2024 E-learning. All rights reserved.
        </p>
        <div className="flex gap-5 items-center">
          {/* Social Media Icons */}
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsTwitterX size={32} />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook size={32} />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IoLogoYoutube size={32} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin size={32} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
