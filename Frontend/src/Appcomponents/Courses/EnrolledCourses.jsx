"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import StarRatings from "react-star-ratings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { useMediaQuery } from "react-responsive"; // Import for screen size detection
import { Dot } from "lucide-react";

const EnrolledCourses = ({ enrolledCourses }) => {
  const isSmallScreen = useMediaQuery({ maxWidth: 768 }); // Check if screen width is ≤ 768px
  const [api, setApi] = useState();
  const [activeIndex, setActiveIndex] = useState(0);
  const updateslider = (index) => {
    api?.scrollTo(index);
  };
  useEffect(() => {
    if (!api) {
      return;
    }
    api.on("slidesInView", (e) => {
      setActiveIndex(e.slidesInView()[0]);
    });
  }, [api]);

  return (
    <div>
      <div className="mb-5 w-[80%] mx-auto sm:w-full sm:mx-0">
        <h1 className="font-bold text-xl text-center mb-5">
          Continue Learning
        </h1>
      </div>

      {Array.isArray(enrolledCourses) && enrolledCourses.length !== 0 ? (
        isSmallScreen ? (
          // 📌 Render Carousel for Small Screens
          <Carousel className="w-full max-w-sm mx-auto" setApi={setApi}>
            <CarouselContent>
              {enrolledCourses.map((course, index) => (
                <CarouselItem key={course.course_id} className="basis-full">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="w-full"
                  >
                    <Card className="shadow-lg rounded-lg">
                      <CardContent className="flex flex-col gap-3 p-0">
                        <img
                          onClick={() => updateslider(index)}
                          src={course.course_image_url}
                          alt=""
                          className="w-full h-[158px] object-cover rounded-t-lg"
                        />
                        <div className="px-4 flex flex-col gap-3">
                          <CardDescription className="font-bold text-md">
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
                          {course.is_popular && (
                            <span className="p-1 rounded-lg bg-yellow-300 px-2 text-xs font-bold">
                              Popular
                            </span>
                          )}
                          <Link
                            to={`/user/explore_courses/overview/${course.course_id}`}
                            className="w-full"
                          >
                            <Button className="w-full">Check Course</Button>
                          </Link>
                        </CardFooter>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          // 📌 Render Grid for Larger Screens
          <div className="grid justify-items-center gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {enrolledCourses.map((course) => (
              <motion.div
                key={course.course_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="w-[80%] sm:w-[90%] lg:w-[100%] rounded-lg"
              >
                <Card className="h-[382px] shadow-lg rounded-lg">
                  <CardContent className="flex flex-col gap-8 p-0">
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
                      {course.is_popular && (
                        <span className="p-1 rounded-lg bg-yellow-300 px-2 text-xs font-bold">
                          Popular
                        </span>
                      )}
                      <Link
                        to={`/user/explore_courses/overview/${course.course_id}`}
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
        )
      ) : (
        <div className="text-xl text-center text-red-600 font-medium">
          No courses found!!!
        </div>
      )}
      {isSmallScreen && (
        <div className="flex justify-center mt-4">
          {enrolledCourses.map((course, index) => (
            <div
              onClick={() => updateslider(index)}
              key={course.course_id}
              className={`w-3 h-3 mx-1 rounded-full bg-black cursor-pointer ${
                activeIndex === index ? "opacity-100" : "opacity-20"
              }`}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
