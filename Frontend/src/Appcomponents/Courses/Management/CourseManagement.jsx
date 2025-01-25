import React from "react";

import { DataTable } from "./DataTable";
import { columns } from "./columns";

const CourseManagement = ({ courses }) => {
  const courseDatas = courses.map((course) => {
    return {
      courses: course.course_name,
      thumbnails: course.course_image_url,
      status: course.status,
      category: course.category,
      id: course.course_id,
    };
  });
  return (
    <div className="container mx-auto ">
      <DataTable columns={columns} data={courseDatas} />
    </div>
  );
};

export default CourseManagement;
