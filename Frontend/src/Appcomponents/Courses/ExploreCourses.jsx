import React, { useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
const ExploreCourses = ({ courses, createMode }) => {
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

  const filteredCourses = courses.filter((course) => {
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
  useEffect(() => {
    if (type) {
      setTier(type);
    }
  }, [type]);

  return (
    <div>
      {!createMode && (
        <div className="bg-pale h-[400px]">
          <div className="flex flex-col gap-4 items-center justify-center h-full">
            <div className="text-center space-y-4">
              <h1 className="text-3xl text-heading font-bold animate__animated animate__fadeInDown">
                Unlock Your Potential with{" "}
                <span className="text-red-700">Doi Tung</span>
              </h1>
              <p className="text-lg animate__animated animate__fadeInDown">
                Explore our curated courses designed to inspire, educate, and
                empower you.
              </p>
            </div>
            <div className=" w-[50%] animate__animated animate__fadeInUp">
              <div className="inline-block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-[120px] flex justify-between items-center bg-customGreen ">
                      {tier} <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <RadioGroup
                      defaultValue="All"
                      value={tier} // Bind the RadioGroup to the current tier
                      onValueChange={(value) => setTier(value)} // Update the state when a value is selected
                    >
                      {options.map((option) => (
                        <DropdownMenuItem
                          key={option.id}
                          onClick={() => {
                            setTier(option.label);

                            navigate(`/explore_courses?type=${option.label}`);
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value={option.label}
                              id={option.id}
                            />
                            <Label htmlFor={option.id}>{option.label}</Label>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </RadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className=" inline-block w-[80%] relative ">
                <Input
                  type="text"
                  placeholder="Search courses"
                  className="w-[100%] h-10 "
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div>
                  <Search className="absolute top-2 right-4 text-gray-400 " />
                </div>
              </div>
            </div>

            {courses && courses.length !== 0 && (
              <div className="w-[50%] flex gap-6 animate__animated animate__fadeInUp ">
                {[...new Set(courses.map((course) => course.category))].map(
                  // new Set() removes duplicate values from the array.
                  (category) => (
                    <div
                      key={category} // Add a key for each category
                      className={cn(
                        "p-1 rounded-xl font-medium px-2 cursor-pointer ",
                        filterCat === category
                          ? "  border-2 border-black"
                          : "bg-white"
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
      )}

      <div
        className={`mb-10 sm:max-w-5xl md:max-w-3xl lg:max-w-5xl ${
          createMode ? "xl:max-w-[100%]" : "xl:max-w-[70%]"
        } mx-auto animate__animated animate__fadeInUp px-3`}
      >
        <div className="my-10 w-[80%] mx-auto sm:w-full sm:mx-0 font-bold text-xl ">
          {filterCat ? (
            <span>{filterCat}</span>
          ) : (
            <span>{tier !== "popular" && !filterCat && "All courses"}</span>
          )}
          {tier === "popular" && !filterCat && <span>Popular courses</span>}
        </div>
        <div className="w-full mx-auto">
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
  );
};

export default ExploreCourses;
