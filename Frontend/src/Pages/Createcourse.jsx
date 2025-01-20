import AdminSide from "@/Appcomponents/AdminSide/Admin";
import { File, Plus } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Createcourse = () => {
  const navigate = useNavigate();
  return (
    <AdminSide>
      <div className="my-5 ml-5">
        <h1 className="my-5 font-semibold text-xl">Course management</h1>
        <div className="flex gap-10">
          <div
            className="flex flex-col items-center justify-center  gap-4 w-56 h-32 bg-pale rounded-xl cursor-pointer"
            onClick={() => navigate("/admin/course_management/createcourse")}
          >
            <Plus />
            <h1>Create New Courses</h1>
          </div>
          <div className="flex flex-col items-center justify-center  gap-4 w-56 h-32 bg-pale rounded-xl">
            <File />
            <h1>Draft Courses</h1>
          </div>
        </div>
        <div></div>
      </div>
    </AdminSide>
  );
};

export default Createcourse;
