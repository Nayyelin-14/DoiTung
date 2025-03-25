import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import usericon from "../../../assets/usericon.jpg";
import { Button } from "@/components/ui/button";
import EnrolledCourses from "../Courses/EnrolledCourses";
import Certificates from "./Certificates";
import GradeTable from "./GradeTable";
import { Link } from "react-router-dom";
import { User, Bell } from "lucide-react";

import { GetEnrolledCourses, GetReports } from "@/EndPoints/user";
import { toast } from "sonner";

const UserProfile = () => {
  const { user } = useSelector((state) => state.user);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [reports, setReports] = useState([]);

  // Derived unread count
  const unreadCount = reports.filter((report) => !report.is_read).length;

  const fetchReports = async () => {
    try {
      const response = await GetReports();
      if (response.success) {
        setReports(response.reports);
      }
    } catch (error) {
      toast.error("Error fetching reports");
    }
  };

  const DisplayCourses = async () => {
    try {
      const response = await GetEnrolledCourses(user.user_id); //todo: Change to Enrolled courses

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
    fetchReports();
    DisplayCourses();
  }, []);

  return (
    <>
      {/* Profile Part */}
      <div className="max-w-6xl mx-auto p-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between w-full lg:w-[90%] gap-4 lg:gap-32 mx-auto">
          {/* Left Side: Image, Username, and Email */}
          <div className="flex flex-col lg:flex-row items-center lg:items-end gap-4 lg:w-[70%]">
            {user.user_profileImage ? (
              <img
                src={user.user_profileImage}
                alt="Profile"
                className="w-[110px] h-[110px] sm:w-[120px] sm:h-[120px] md:w-[140px] md:h-[140px] rounded-full border-4 border-red-900 p-1"
                onError={(e) => {
                  // If the profile image fails to load, fallback to usericon
                  e.target.src = usericon;
                }}
              />
            ) : (
              <img
                src={usericon}
                alt="Profile"
                className="w-[90px] h-[90px] sm:w-[120px] sm:h-[120px] md:w-[140px] md:h-[140px] rounded-full p-1"
              />
            )}

            <div className="py-4 flex flex-col items-center lg:items-start">
              <div className="text-md md:text-[20px] text-heading font-bold mb-6  flex items-center gap-2">
                <User className="w-5 h-5" />
                {user.user_name}
              </div>

              <div className="flex flex-row items-center justify-center gap-3">
                <Link to="/user/editProfile">
                  <Button variant="outline">Edit Profile</Button>
                </Link>
                <Link
                  to="/user/reports"
                  state={{ reports }} // Pass data via state
                >
                  <div className="relative">
                    <Bell className="w-6 h-6 text-gray-600" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side: Recent Bookings */}
          <div>
            <div className="flex lg:flex-col gap-2 w-[70%] md:w-full mx-auto">
              <div className="w-[200px] h-[40px] bg-pale py-2 rounded-xl">
                <p className="text-center text-[14px] text-black ">
                  Enrolled Courses: <span>{enrolledCourses.length}</span>
                </p>
              </div>

              <div className="w-[200px] h-[40px] bg-customGreen py-2 rounded-xl">
                <p className="text-center text-[14px] text-white">
                  Certificates: 0
                </p>
              </div>

              <div className="w-[200px] h-[40px] bg-black py-2 rounded-xl">
                <p className="text-center text-[14px] text-white">
                  Saved Courses: 0
                </p>
              </div>
            </div>
          </div>
        </div>

        <hr className=" h-1 mx-auto my-4 bg-black border-0 rounded md:my-10 dark:bg-gray-700" />

        <div>
          <EnrolledCourses enrolledCourses={enrolledCourses} />
        </div>

        <Certificates userId={user.user_id} />

        <GradeTable userId={user.user_id} />
      </div>
    </>
  );
};

export default UserProfile;
