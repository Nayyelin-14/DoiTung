import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  lazy,
  Suspense,
} from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import "animate.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import AOS from "aos";
import "aos/dist/aos.css";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";
import { useTranslation } from "react-i18next";

const ExploreCourses = ({ courses, isLoading, setIsLoading }) => {
  const options = [
    { id: "option-one", label: "All" },
    { id: "option-two", label: "popular" },
    // { id: "option-three", label: "Paid" },
  ];

  const navigate = useNavigate();
  const [searchparams] = useSearchParams();
  const type = searchparams.get("type");
  ///
  const [tier, setTier] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage, setCoursesPerPage] = useState(
    window.innerWidth <= 768 ? 4 : 8
  );

  const filteredCourses = useCallback(() => {
    return courses.filter((course) => {
      // Check if the course matches the search query and if it matches the selected category
      const matchesSearch = course.course_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory = filterCat ? course.category === filterCat : true; // If filterCat is set, filter by category
      let matchesTier = true; // Default to true for "All"
      if (tier === "popular") {
        matchesTier = course.is_popular === true; // popular corresponds to 1
      } else if (tier === "not popular") {
        matchesTier = course.is_popular === false; // not popular corresponds to 0
      }
      return matchesSearch && matchesCategory && matchesTier;
    });
  }, [filterCat, tier, searchQuery, courses]);

  // Pagination Logic
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const memoizedFilteredCourses = useMemo(
    () => filteredCourses(),
    [filterCat, tier, searchQuery, courses]
  );
  const currentCourses = memoizedFilteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );
  const totalPages = Math.ceil(filteredCourses()?.length / coursesPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  useEffect(() => {
    if (type) {
      setTier(type);
    }
  }, [type]);
  useEffect(() => {
    const handleResize = () => {
      setCoursesPerPage(window.innerWidth <= 768 ? 4 : 6);
    };

    // Listen for window resize events
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const { t } = useTranslation();

  const { explore } = t("Home", { returnObjects: true });
  useEffect(() => {
    return () => {
      setIsLoading(false); // Cleanup when navigating away
    };
  }, []);
  return (
    <div>
      <div className="bg-pale h-[400px] py-12">
        <div className="flex flex-col gap-6 items-center justify-center h-full px-4">
          {/* Heading */}
          <div className="text-center space-y-4">
            <h1 className="text-2xl sm:text-3xl lg:text-3xl text-heading font-bold animate__animated animate__fadeInDown">
              {explore.unlock}{" "}
              <span className="text-red-700">{explore.doitung}</span>
            </h1>
            <p className="text-base sm:text-lg animate__animated animate__fadeInDown">
              {explore.explore_our}
            </p>
          </div>

          {/* Dropdown & Search Bar in One Line */}
          <div className="w-full sm:w-3/4 md:w-1/2 flex flex-row items-center gap-2 animate__animated animate__fadeInUp">
            {/* Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-[80px] sm:w-[100px] flex justify-between items-center bg-customGreen">
                  {tier} <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full sm:w-auto">
                <RadioGroup
                  value={tier}
                  onValueChange={(value) => setTier(value)}
                >
                  {options.map((option) => (
                    <DropdownMenuItem
                      key={option.id}
                      onClick={() => {
                        setTier(option.label);
                        navigate(`/user/explore_courses?type=${option.label}`);
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={option.label} id={option.id} />
                        <Label htmlFor={option.id}>{option.label}</Label>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </RadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Search Bar */}
            <div className="relative w-full sm:w-auto flex-1">
              <Input
                type="text"
                placeholder={explore.search}
                className="w-full h-10"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute top-2 right-4 text-gray-400" />
            </div>
          </div>

          {/* Categories */}
          {courses && courses.length !== 0 && (
            <div className="w-full sm:w-3/4 md:w-1/2 flex flex-wrap gap-4 justify-center animate__animated animate__fadeInUp">
              {[...new Set(courses.map((course) => course.category))].map(
                (category) => (
                  <div
                    key={category}
                    className={cn(
                      "p-1 rounded-md font-medium px-2 cursor-pointer  text-white",
                      filterCat === category
                        ? "border-2 border-black text-black border-dashed"
                        : "bg-black"
                    )}
                    onClick={() => {
                      setFilterCat(filterCat === category ? "" : category);
                    }}
                  >
                    <span>{category}</span>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      <div
        className="mb-10 sm:max-w-5xl md:max-w-3xl lg:max-w-5xl xl:max-w-[90%]
         mx-auto animate__animated animate__fadeInUp px-3"
      >
        <div className="w-[90%] mx-auto">
          <div className="my-10 w-full mx-auto sm:w-full sm:mx-0 font-bold text-xl ">
            {filterCat ? (
              <span>{filterCat}</span>
            ) : (
              <span>
                {tier !== "popular" && !filterCat && explore.all_courses}
              </span>
            )}
            {tier === "popular" && !filterCat && (
              <span>{explore.popular_courses}</span>
            )}
          </div>
          {currentCourses && currentCourses.length !== 0 ? (
            <>
              {isLoading ? (
                <div className="flex items-center justify-center h-screen">
                  <OrbitProgress
                    color="#32cd32"
                    size="large"
                    text=""
                    textColor=""
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-6">
                  {currentCourses.map((course, index) => (
                    <div
                      key={course.course_id}
                      data-aos="fade-up"
                      data-aos-duration="1000" // Corrected attribute
                      data-aos-delay={index * 200} // Optional: Adds delay between each card animation
                      className="w-full sm:w-[90%] md:w-[100%] rounded-lg flex-shrink-0 md:flex-shrink snap-start"
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
                              {explore.rating} {course.rating}
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
                              to={`/user/explore_courses/overview/${course.course_id}`}
                              className="w-full"
                            >
                              <Button className="w-full">
                                {explore.check_course}
                              </Button>
                            </Link>
                          </CardFooter>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {isLoading ? (
                <div className="flex items-center justify-center h-screen">
                  <OrbitProgress
                    color="#32cd32"
                    size="large"
                    text=""
                    textColor=""
                  />
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
                    {explore.no_results}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex justify-between items-center my-14">
          <Pagination className="flex items-center justify-center space-x-2">
            <PaginationContent>
              <PaginationPrevious
                className={`hover:bg-gray-400 cursor-pointer ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                label={explore.previous}
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
                label={explore.next}
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
    </div>
  );
};

export default React.memo(ExploreCourses);
