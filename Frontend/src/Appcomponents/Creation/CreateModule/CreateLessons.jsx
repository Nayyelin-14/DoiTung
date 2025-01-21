import React, { useState } from "react";
import AdminSide from "../../AdminSide/Admin";
import { PlusCircle } from "lucide-react";

import ModuleForm from "./ModuleForm";
import { useParams } from "react-router-dom";

const CreateLessons = () => {
  const { courseID } = useParams();
  const createModule = () => {};
  return (
    <AdminSide>
      <div className="flex my-8 max-w-5xl mx-auto">
        <div className="w-2/3">hi</div>
        <div className="w-1/3 bg-pale h-screen">
          <div>
            {/* <div></div> torender created modules here */}
            <div className="flex gap-5 bg-red-400">
              <ModuleForm courseID={courseID} createModule={createModule}>
                <PlusCircle />
              </ModuleForm>
              <p>Add new module</p>
            </div>
          </div>
        </div>
      </div>
    </AdminSide>
  );
};

export default CreateLessons;
