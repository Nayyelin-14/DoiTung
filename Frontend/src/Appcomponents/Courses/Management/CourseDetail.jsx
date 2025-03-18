import AdminSide from "@/Appcomponents/AdminSide/Admin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CourseDetails } from "@/EndPoints/courses";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";

const CourseDetail = () => {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [courseDetails, setCourseDetails] = useState({});
  const [enrolledusers, setEnrolledusers] = useState();
  const getdetail = async () => {
    try {
      setLoading(true);
      const response = await CourseDetails(params.courseid);
      if (response.isSuccess) {
        setCourseDetails(response.details);
        setEnrolledusers(response.enrolledUsers);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getdetail(params.courseid);
  }, []);
  return (
    <AdminSide>
      {loading ? (
        <>Loading</>
      ) : (
        <div className="flex flex-col lg:flex lg:flex-row lg:gap-24 p-5 mx-auto">
          <div
            key={courseDetails.course_id}
            className="w-full sm:w-[90%] md:w-[70%]  lg:w-[40%] xl:w-[30%] mx-auto lg:mx-0 p-5 md:p-0 rounded-lg flex-shrink-0 md:flex-shrink "
          >
            <Card className="h-fit shadow-lg rounded-lg  ">
              <CardContent className="flex flex-col gap-3 p-0">
                <img
                  src={courseDetails.course_image_url}
                  alt=""
                  className="w-full  h-[158px] object-cover rounded-t-lg"
                />
                <div className="px-4 flex flex-col gap-3">
                  <CardDescription className="font-bold text-md lg:text-xs">
                    {courseDetails.course_name}
                  </CardDescription>
                  <CardDescription className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage />
                      <AvatarFallback>
                        <span className="font-bold cursor-pointer">
                          {courseDetails.instructor_name
                            ? courseDetails.instructor_name
                                .slice(0, 2)
                                .toUpperCase()
                            : "NA"}
                        </span>
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-bold">
                      {courseDetails.instructor_name}
                    </span>
                  </CardDescription>
                  <CardDescription className="flex items-center gap-5">
                    Rating - {courseDetails.rating}
                    <div>
                      <StarRatings
                        rating={courseDetails.rating}
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
                    {courseDetails.category}
                  </span>
                  <span className="p-1 rounded-lg bg-gray-300 px-2 text-xs font-bold break-words w-full whitespace-normal">
                    {courseDetails.course_description}
                  </span>
                </CardFooter>
              </CardContent>
            </Card>
          </div>
          <div className=" w-full  lg:w-[60%] p-4">
            <p className="border border-gray-300 shadow-md  w-fit p-2 rounded-lg mb-4">
              Enrollments in {courseDetails.course_name} -{" "}
              {enrolledusers?.length}
            </p>
            <Table className="">
              <TableCaption>A list of all users' enrollments</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Profile</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Enrolled at</TableHead>
                  <TableHead className="text-center">Completion</TableHead>

                  <TableHead className="text-center">Progress</TableHead>
                </TableRow>
              </TableHeader>
              {enrolledusers ? (
                enrolledusers.map((enroll) => (
                  <TableBody key={enroll.username}>
                    <TableRow>
                      <TableCell className="font-medium">
                        {enroll.username}
                      </TableCell>

                      <TableCell>
                        <Avatar>
                          <AvatarImage src={enroll.user_profileImage} />
                          <AvatarFallback className="font-bold">
                            {enroll && enroll.username
                              ? enroll?.username.slice(0, 2).toUpperCase()
                              : "NA"}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <p
                          className={cn(
                            `${
                              enroll.role === "user"
                                ? "bg-blue-500 "
                                : "bg-black"
                            } p-1 text-md text-white font-bold rounded-lg w-fit`
                          )}
                        >
                          {enroll.role}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p>{enroll.user_status}</p>
                      </TableCell>
                      <TableCell>
                        {format(new Date(enroll.enrolled_at), "dd MMM yyyy")}
                      </TableCell>

                      <TableCell className="text-center">
                        <p
                          className={cn(
                            `${
                              enroll.is_completed === "true"
                                ? "bg-green-500 "
                                : "bg-yellow-500"
                            } p-1 text-md text-white font-bold rounded-lg  `
                          )}
                        >
                          {enroll.is_completed === "true"
                            ? "Finished"
                            : "Ongoing"}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <p className="font-bold"> {enroll.progress} %</p>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ))
              ) : (
                <div>
                  <p>No enrolledusers found here.</p>
                </div>
              )}
            </Table>
          </div>
        </div>
      )}
    </AdminSide>
  );
};

export default CourseDetail;
