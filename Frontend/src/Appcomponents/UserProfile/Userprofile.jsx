import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import usericon from "../../../assets/usericon.jpg";
import { Button } from "@/components/ui/button";
import EnrolledCourses from "../Courses/EnrolledCourses";
import Certificates from "./Certificates";
import GradeTable from "./GradeTable";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail } from "lucide-react";
import TwoStep from "./TwoStep";
import { Switch } from "@mui/material";
import { GetEnrolledCourses } from "@/EndPoints/user";
import { toast } from "sonner";

const UserProfile = () => {
    const { user } = useSelector((state) => state.user);
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    const DisplayCourses = async () => {
      try {
        const response = await GetEnrolledCourses(user.user_id) //todo: Change to Enrolled courses
  
        if (response.isSuccess) {
          setEnrolledCourses(response.enrolledCourses);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    useEffect(() => {
      DisplayCourses();
    }, []);

  return (
    <>
      {/* Profile Part */}
      <div className="max-w-6xl mx-auto p-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between w-full lg:w-[90%] gap-4 lg:gap-32 mx-auto">
          {/* Left Side: Image, Username, and Email */}
          <div className="flex flex-col lg:flex-row items-center lg:items-end gap-4 lg:w-[70%]">
            {user.user_profileImage && user.user_profileImage.length > 0 ? (
              <img
                src={user.user_profileImage}
                alt=""
                className="w-[90px] h-[90px] sm:w-[120px] sm:h-[120px] md:w-[140px] md:h-[140px] rounded-full border-4 border-red-900 p-1"
              />
            ) : (
              <img
                src={usericon}
                alt=""
                className="w-[90px] h-[90px] sm:w-[120px] sm:h-[120px] md:w-[140px] md:h-[140px] rounded-full p-1"
              />
            )}
            <div className="py-4 flex flex-col items-center lg:items-start">
              <div className="text-md md:text-[20px] text-heading font-bold sm:mb-0 flex items-center gap-2">
                <User className="w-5 h-5" />
                {user.user_name}
              </div>
              <div className="flex items-center text-sm md:text-base text-gray-400 mb-2  gap-2">
                <Mail className="w-5 h-5" />
                {user.user_email}
              </div>
              <div className="flex flex-col gap-3">
                <Link to="/user/editProfile">
                  <Button variant="outline">Edit Profile</Button>
                </Link>
                <TwoStep
                  userEmail={user.user_email}
                  userID={user.user_id}
                  isTwostepEnabled={user.isTwostepEnabled}
                >
                  <p className="text-blue-500 underline text-sm font-bold hover:text-blue-200">
                    {" "}
                    Two Factor Authentication?
                  </p>
                </TwoStep>
              </div>
            </div>
          </div>

          {/* Right Side: Recent Bookings */}
          <div>
            <div className="flex flex-col gap-2">
              <div className="w-[200px] h-[40px] bg-pale py-2 rounded-xl">
                <p className="text-center text-[16px] md:text-[14px] text-black">
                  Enrolled Courses: <span>{enrolledCourses.length}</span>
                </p>
              </div>

              <div className="w-[200px] h-[40px] bg-customGreen py-2 rounded-xl">
                <p className="text-center text-[16px] md:text-[14px] text-white">
                  Certificates: 0
                </p>
              </div>

              <div className="w-[200px] h-[40px] bg-black py-2 rounded-xl">
                <p className="text-center text-[16px] md:text-[14px] text-white">
                  Wishlist: 0
                </p>
              </div>
            </div>
          </div>
        </div>

        <hr className=" h-1 mx-auto my-4 bg-black border-0 rounded md:my-10 dark:bg-gray-700" />

        <div>
          <EnrolledCourses enrolledCourses={enrolledCourses}/>
          
        </div>

        <div className="grid grid-cols-2 py-8 gap-6">
          <div>
            <Certificates />
          </div>
          <div>
            <Certificates />
          </div>
        </div>

        <GradeTable />
      </div>
    </>
  );
};

export default UserProfile;
