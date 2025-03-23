import AdminSide from "@/Appcomponents/AdminSide/Admin";
import { motion } from "framer-motion";
import { Select } from "@/components/ui/select";
import { Search } from "lucide-react";
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
  const courses = [
    {
      id: 1,
      name: "React for Beginners",
      instructor: "John Doe",
      enrolledUsers: [
        { id: 101, name: "Alice", email: "alice@example.com", progress: "70%" },
        { id: 102, name: "Bob", email: "bob@example.com", progress: "50%" },
      ],
    },
    {
      id: 2,
      name: "Node.js Mastery",
      instructor: "Jane Smith",
      enrolledUsers: [
        {
          id: 201,
          name: "Charlie",
          email: "charlie@example.com",
          progress: "90%",
        },
        { id: 202, name: "Dave", email: "dave@example.com", progress: "40%" },
      ],
    },
  ];
  useEffect(() => {
    getdetail(params.courseid);
  }, []);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCourseChange = (courseId) => {
    setSelectedCourse(courseId);
  };

  const course = courses.find((c) => c.id === selectedCourse);
  const filteredUsers = course
    ? course.enrolledUsers.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  return (
    <AdminSide>
      {loading ? (
        <>Loading</>
      ) : (
        // <div className="flex flex-col lg:flex lg:flex-row lg:gap-24 p-5 mx-auto">
        //   <div
        //     key={courseDetails.course_id}
        //     className="w-full sm:w-[90%] md:w-[70%]  lg:w-[40%] xl:w-[30%] mx-auto lg:mx-0 p-5 md:p-0 rounded-lg flex-shrink-0 md:flex-shrink "
        //   >
        //     <Card className="h-fit shadow-lg rounded-lg  ">
        //       <CardContent className="flex flex-col gap-3 p-0">
        //         <img
        //           src={courseDetails.course_image_url}
        //           alt=""
        //           className="w-full  h-[158px] object-cover rounded-t-lg"
        //         />
        //         <div className="px-4 flex flex-col gap-3">
        //           <CardDescription className="font-bold text-md lg:text-xs">
        //             {courseDetails.course_name}
        //           </CardDescription>
        //           <CardDescription className="flex items-center gap-2">
        //             <Avatar>
        //               <AvatarImage />
        //               <AvatarFallback>
        //                 <span className="font-bold cursor-pointer">
        //                   {courseDetails.instructor_name
        //                     ? courseDetails.instructor_name
        //                         .slice(0, 2)
        //                         .toUpperCase()
        //                     : "NA"}
        //                 </span>
        //               </AvatarFallback>
        //             </Avatar>
        //             <span className="font-bold">
        //               {courseDetails.instructor_name}
        //             </span>
        //           </CardDescription>
        //           <CardDescription className="flex items-center gap-5">
        //             Rating - {courseDetails.rating}
        //             <div>
        //               <StarRatings
        //                 rating={courseDetails.rating}
        //                 starRatedColor="gold"
        //                 numberOfStars={5}
        //                 name="rating"
        //                 starDimension="16px"
        //                 starSpacing="2px"
        //               />
        //             </div>
        //           </CardDescription>
        //         </div>
        //         <CardFooter className="flex flex-col items-start gap-3 px-3">
        //           <span className="p-1 rounded-lg bg-yellow-300 px-2 text-xs font-bold">
        //             {courseDetails.category}
        //           </span>
        //           <span className="p-1 rounded-lg bg-gray-300 px-2 text-xs font-bold break-words w-full whitespace-normal">
        //             {courseDetails.course_description}
        //           </span>
        //         </CardFooter>
        //       </CardContent>
        //     </Card>
        //   </div>
        //   <div className=" w-full  lg:w-[60%] p-4">
        //     <p className="border border-gray-300 shadow-md  w-fit p-2 rounded-lg mb-4">
        //       Enrollments in {courseDetails.course_name} -{" "}
        //       {enrolledusers?.length}
        //     </p>
        //     <Table className="">
        //       <TableCaption>A list of all users' enrollments</TableCaption>
        //       <TableHeader>
        //         <TableRow>
        //           <TableHead>Username</TableHead>
        //           <TableHead>Profile</TableHead>
        //           <TableHead>Role</TableHead>
        //           <TableHead>Status</TableHead>
        //           <TableHead>Enrolled at</TableHead>
        //           <TableHead className="text-center">Completion</TableHead>

        //           <TableHead className="text-center">Progress</TableHead>
        //         </TableRow>
        //       </TableHeader>
        //       {enrolledusers ? (
        //         enrolledusers.map((enroll) => (
        //           <TableBody key={enroll.username}>
        //             <TableRow>
        //               <TableCell className="font-medium">
        //                 {enroll.username}
        //               </TableCell>

        //               <TableCell>
        //                 <Avatar>
        //                   <AvatarImage src={enroll.user_profileImage} />
        //                   <AvatarFallback className="font-bold">
        //                     {enroll && enroll.username
        //                       ? enroll?.username.slice(0, 2).toUpperCase()
        //                       : "NA"}
        //                   </AvatarFallback>
        //                 </Avatar>
        //               </TableCell>
        //               <TableCell>
        //                 <p
        //                   className={cn(
        //                     `${
        //                       enroll.role === "user"
        //                         ? "bg-blue-500 "
        //                         : "bg-black"
        //                     } p-1 text-md text-white font-bold rounded-lg w-fit`
        //                   )}
        //                 >
        //                   {enroll.role}
        //                 </p>
        //               </TableCell>
        //               <TableCell>
        //                 <p>{enroll.user_status}</p>
        //               </TableCell>
        //               <TableCell>
        //                 {format(new Date(enroll.enrolled_at), "dd MMM yyyy")}
        //               </TableCell>

        //               <TableCell className="text-center">
        //                 <p
        //                   className={cn(
        //                     `${
        //                       enroll.is_completed === "true"
        //                         ? "bg-green-500 "
        //                         : "bg-yellow-500"
        //                     } p-1 text-md text-white font-bold rounded-lg  `
        //                   )}
        //                 >
        //                   {enroll.is_completed === "true"
        //                     ? "Finished"
        //                     : "Ongoing"}
        //                 </p>
        //               </TableCell>
        //               <TableCell className="text-center">
        //                 <p className="font-bold"> {enroll.progress} %</p>
        //               </TableCell>
        //             </TableRow>
        //           </TableBody>
        //         ))
        //       ) : (
        //         <div>
        //           <p>No enrolledusers found here.</p>
        //         </div>
        //       )}
        //     </Table>
        //   </div>
        // </div>
        <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
            📚 Course Enrollment Dashboard
          </h1>

          {/* Course Selection */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Select a Course:
            </label>
            <select
              onChange={(e) => handleCourseChange(Number(e.target.value))}
              className="w-full p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white"
            >
              <option value="">-- Choose Course --</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          {course && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              {/* Course Details */}
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {course.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Instructor: <strong>{course.instructor}</strong>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Total Enrolled: <strong>{course.enrolledUsers.length}</strong>
              </p>

              {/* Search Bar */}
              <div className="relative mt-4">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" />
              </div>

              {/* User List */}
              <div className="mt-4">
                {filteredUsers.length > 0 ? (
                  <motion.table
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full border-collapse"
                  >
                    <thead>
                      <tr className="bg-gray-200 dark:bg-gray-700">
                        <th className="p-2 text-left text-gray-700 dark:text-gray-300">
                          #
                        </th>
                        <th className="p-2 text-left text-gray-700 dark:text-gray-300">
                          Name
                        </th>
                        <th className="p-2 text-left text-gray-700 dark:text-gray-300">
                          Email
                        </th>
                        <th className="p-2 text-left text-gray-700 dark:text-gray-300">
                          Progress
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user, index) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-b dark:border-gray-600"
                        >
                          <td className="p-2 text-gray-800 dark:text-white">
                            {index + 1}
                          </td>
                          <td className="p-2 text-gray-800 dark:text-white">
                            {user.name}
                          </td>
                          <td className="p-2 text-gray-800 dark:text-white">
                            {user.email}
                          </td>
                          <td className="p-2 text-gray-800 dark:text-white">
                            {user.progress}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </motion.table>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 mt-4">
                    No users found.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </AdminSide>
  );
};

export default CourseDetail;
