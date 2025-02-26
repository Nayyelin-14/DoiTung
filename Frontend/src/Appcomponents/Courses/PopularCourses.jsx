import React, { useEffect, useState } from "react";
import { get_PopularCourses } from "../../EndPoints/courses";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";
import { motion } from "framer-motion";
import StarRatings from "react-star-ratings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PopularCourses = () => {
  const navigate = useNavigate();
  const [type, setType] = useState("popular");
  const [popularCourses, setPopularCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage, setCoursesPerPage] = useState(() => {
    if (window.innerWidth <= 500) return 1;
    if (window.innerWidth > 500 && window.innerWidth <= 1000) return 2;
    if (window.innerWidth >= 1000 && window.innerWidth <= 1280) return 3;
    return 4;
  });
  const DisplayCourses = async () => {
    try {
      const response = await get_PopularCourses();
      if (response.isSuccess) {
        setPopularCourses(response.Popularcourses);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getRandomCourses = (courses) => {
    if (courses.length > 4) {
      const randomCourses = [];
      const tempCourses = [...courses];
      while (randomCourses.length < 4) {
        const randomIndex = Math.floor(Math.random() * tempCourses.length);
        randomCourses.push(tempCourses.splice(randomIndex, 1)[0]);
      }
      return randomCourses;
    }
    return courses;
  };
  const coursesToDisplay = getRandomCourses(popularCourses);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = coursesToDisplay.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );
  const totalPages = Math.ceil(coursesToDisplay.length / coursesPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    DisplayCourses();
  }, []);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 500) {
        setCoursesPerPage(1);
      } else if (window.innerWidth > 500 && window.innerWidth <= 1024) {
        setCoursesPerPage(2);
      } else if (window.innerWidth >= 1024 && window.innerWidth <= 1280) {
        setCoursesPerPage(3);
      } else {
        setCoursesPerPage(4);
      }
    };

    // Initial call to set the correct value on mount
    handleResize();

    // Listen for window resize events
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  console.log("chaning");
  return (
    <div>
      <div className="mb-5 w-[80%] mx-auto sm:w-full sm:mx-0">
        <h1 className="font-bold text-xl mb-5">Popular Courses</h1>
        <div className="flex items-center justify-between flex-wrap gap-6">
          <p className="text-md ">
            Explore our most popular programs, get job-ready for an in-demand
            career
          </p>
          <div onClick={() => navigate(`/user/explore_courses?type=${type}`)}>
            <Button>
              View All <ArrowRight />
            </Button>
          </div>
        </div>
      </div>

      {Array.isArray(currentCourses) && currentCourses.length !== 0 ? (
        <div className="relative">
          <div className="w-[80%] mx-auto sm:w-full sm:mx-0 sm:gap-6  md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
            {currentCourses.map((popular) => (
              <motion.div
                key={popular.course_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="w-full sm:w-[90%] md:w-[100%] rounded-lg flex-shrink-0 md:flex-shrink"
              >
                <Card className="h-[382px] shadow-lg rounded-lg">
                  <CardContent className="flex flex-col gap-3 p-0">
                    <img
                      src={popular.course_image_url}
                      alt=""
                      className="w-full h-[158px] object-cover rounded-t-lg"
                    />
                    <div className="px-4 flex flex-col gap-3">
                      <CardDescription className="font-bold text-md lg:text-xs">
                        {popular.course_name}
                      </CardDescription>
                      <CardDescription className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage />
                          <AvatarFallback>
                            <span className="font-bold cursor-pointer">
                              {popular.instructor_name
                                .slice(0, 2)
                                .toUpperCase()}
                            </span>
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-bold">
                          {popular.instructor_name}
                        </span>
                      </CardDescription>
                      <CardDescription className="flex items-center gap-5">
                        Rating - {popular.rating}
                        <div>
                          <StarRatings
                            rating={popular.rating}
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
                        {popular.is_popular ? "Popular" : ""}
                      </span>
                      <Link
                        to={`/user/explore_courses/overview/${popular.course_id}`}
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
        </div>
      ) : (
        <div className="text-xl text-center text-red-600 font-medium">
          No popular courses Found!!!
        </div>
      )}
      <div className="flex justify-between items-center my-14">
        <Pagination className="flex items-center justify-center space-x-2">
          <PaginationContent>
            <PaginationPrevious
              className={`hover:bg-gray-400 cursor-pointer ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              label="Previous"
              disabled={currentPage === 1} // This will still disable the button
              onClick={() =>
                currentPage > 1 && handlePageChange(currentPage - 1)
              } // Only trigger page change if not at the first page
            />

            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i} onClick={() => handlePageChange(i + 1)}>
                <PaginationLink
                  className={
                    currentPage === i + 1
                      ? "bg-black text-white mr-2 cursor-pointer hover:bg-gray-400"
                      : "bg-pale cursor-pointer hover:bg-gray-400"
                  }
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationNext
              label="Next"
              className={`hover:bg-gray-400 cursor-pointer ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={currentPage === totalPages} // Disable if on the last page
              onClick={() =>
                currentPage < totalPages && handlePageChange(currentPage + 1)
              } // Only trigger page change if not on the last page
            />
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default PopularCourses;
