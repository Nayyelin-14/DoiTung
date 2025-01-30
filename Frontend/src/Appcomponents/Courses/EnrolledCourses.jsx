import React, { useCallback, useEffect, useState } from "react";
import { get_PopularCourses } from "../../EndPoints/courses";
import { GetEnrolledCourses } from "@/EndPoints/user";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CircleArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { CircleArrowLeft } from "lucide-react";
import StarRatings from "react-star-ratings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


const EnrolledCourses = () => {
  const navigate = useNavigate();
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
    <div>
      <div className="mb-5 w-[80%] mx-auto sm:w-full sm:mx-0">
        <h1 className="font-bold text-xl text-center mb-5">My Courses</h1>
      </div>
      {Array.isArray(enrolledCourses) && enrolledCourses.length !== 0 ? (
        <div className="grid justify-items-center gap-6 sm:grid-cols-1  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
          {enrolledCourses.map((course) => (
            <motion.div
              key={course.course_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="w-[80%] sm:w-[90%]  lg:w-[100%] rounded-lg"
            >
              <Card className="h-[382px] shadow-lg rounded-lg">
                <CardContent className="flex flex-col gap-3 p-0">
                  <img
                    src={course.course_image_url}
                    alt=""
                    className="w-full h-[158px] object-cover rounded-t-lg"
                  />
                  <div className="px-4 flex flex-col gap-3">
                    <CardDescription className="font-bold text-md lg:text-xs">
                      {course.course_name}
                    </CardDescription>

                    <CardDescription className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage />
                        <AvatarFallback>
                          <span className="font-bold cursor-pointer">
                            {course.instructor_name.slice(0, 2).toUpperCase()}
                          </span>
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-bold">
                        {course.instructor_name}
                      </span>
                    </CardDescription>
                    <CardDescription className="flex items-center gap-5">
                      Rating - {course.rating}
                      <div>
                        <StarRatings
                          rating={course.rating}
                          starRatedColor="gold"
                          numberOfStars={5}
                          name="rating"
                          starDimension="16px"
                          starSpacing="2px"
                        />
                      </div>
                    </CardDescription>
                  </div>
                  <CardFooter className="flex flex-col items-start gap-3 px-3">
                    <span className="p-1 rounded-lg bg-yellow-300 px-2 text-xs font-bold">
                      {course.is_popular ? "Popular" : ""}
                    </span>
                    <Link
                      to={`/explore_courses/overview/${course.course_id}`}
                      className="w-full"
                    >
                      <Button className="w-full">Check Course</Button>
                    </Link>
                  </CardFooter>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-xl text-center text-red-600 font-medium">
          No course courses Found!!!
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;