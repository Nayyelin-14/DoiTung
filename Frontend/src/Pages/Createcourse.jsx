import AdminSide from "@/Appcomponents/AdminSide/Admin";

import { getAllCourses } from "@/EndPoints/courses";
import { File, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import "animate.css";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StarRatings from "react-star-ratings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Createcourse = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const filteredCourses = courses.filter((course) => {
    // Check if the course matches the search query and if it matches the selected category
    const matchesSearch = course.course_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesSearch;
  });
  const fetchCourses = async () => {
    try {
      const response = await getAllCourses();
      console.log(response);
      if (response.isSuccess) {
        setCourses(response.courses);
      } else {
        toast.error(response.message);
        setErrMsg(response.message);
      }
    } catch (error) {
      toast.error(error.message);
      setErrMsg(response.message);
    }
  };
  useEffect(() => {
    fetchCourses();
  }, []);
  return (
    <AdminSide>
      <div className="my-5 ml-5">
        <h1 className="my-5 font-semibold text-xl">Course management</h1>
        <div className="flex flex-col md:flex-row gap-10">
          <div
            className="flex flex-col items-center justify-center  gap-4 w-[90%] mx-auto md:mx-0   md:w-56 h-32 bg-pale rounded-xl cursor-pointer"
            onClick={() => navigate("/admin/course_management/createcourse")}
          >
            <Plus />
            <h1>Create New Courses</h1>
          </div>
          <div className="flex flex-col items-center justify-center  gap-4 w-[90%] mx-auto md:mx-0  md:w-56 h-32 bg-pale rounded-xl">
            <File />
            <h1>Draft Courses</h1>
          </div>
        </div>
        <div
          className="my-10 sm:max-w-5xl md:max-w-3xl lg:max-w-5xl  xl:max-w-[90%]
          animate__animated animate__fadeInUp px-3 "
        >
          <div>
            <div className="flex mb-10 items-center ">
              <p className="w-2/3 font-bold text-md md:text-xl">
                Created Courses
              </p>
              <Input
                type="text"
                placeholder="Search courses"
                className="w-1/3 h-10 border border-black"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {filteredCourses && filteredCourses.length !== 0 ? (
              <div className="grid justify-items-center gap-6 sm:grid-cols-2  md:grid-cols-2 lg:grid-cols-3 ">
                {filteredCourses.map((course) => (
                  <motion.div
                    key={course.course_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="w-[80%] sm:w-[90%]  lg:w-[100%] rounded-lg"
                  >
                    <Card className="h-[382px] shadow-lg rounded-lg">
                      <CardContent className="flex flex-col gap-3 p-0 h-full">
                        <img
                          src={course.course_image_url}
                          alt=""
                          className="w-full h-[158px] object-cover rounded-t-lg"
                        />
                        <div className="px-4 flex flex-col gap-3">
                          <CardDescription className="font-bold">
                            {course.course_name}
                          </CardDescription>

                          <CardDescription className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage />
                              <AvatarFallback>
                                <span className="font-bold cursor-pointer">
                                  {course.instructor_name
                                    .slice(0, 2)
                                    .toUpperCase()}
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
                            {course.category}
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
              <div>
                <DotLottieReact
                  src="https://lottie.host/b166ca72-128e-4309-89de-95b77c77b17a/teq8v7Prgf.lottie"
                  loop
                  autoplay
                  height={100}
                />
                <p className="text-center text-3xl mb-0 mt-3">
                  No Results Found.
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center my-14">
            <Pagination className="flex items-center justify-center space-x-2">
              <PaginationContent className="flex gap-2 items-center">
                <PaginationItem className="flex items-center">
                  <PaginationPrevious
                    href="#"
                    label={"Previous"}
                    className="text-gray-500 hover:text-gray-700"
                  />
                </PaginationItem>

                {/* Display page numbers dynamically */}
                <PaginationItem className="flex items-center">
                  <PaginationLink
                    href="#"
                    className="py-2 px-4 rounded-md bg-pale text-black hover:bg-pale/60"
                  >
                    1
                  </PaginationLink>
                </PaginationItem>

                <PaginationItem className="flex items-center">
                  <PaginationNext
                    href="#"
                    label={"Next"}
                    className="text-gray-500 hover:text-gray-700"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </AdminSide>
  );
};

export default Createcourse;
