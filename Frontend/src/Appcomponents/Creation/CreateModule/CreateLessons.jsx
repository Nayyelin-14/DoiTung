import React, { useEffect, useState } from "react";
import AdminSide from "../../AdminSide/Admin";
import { PlusCircle, Trash } from "lucide-react";
import ModuleForm from "./ModuleForm";
import { useParams } from "react-router-dom";
import LessonsForm from "./LessonsForm";
import { getAllLessons, getAllModules } from "@/EndPoints/courses";

const CreateLessons = () => {
  const { courseID } = useParams();
  const [createdmodule, setCreatedmodule] = useState([]);
  const [lessonsByModule, setLessonsByModule] = useState([]); // An array to store lessons for each module

  // Fetch all modules for the course
  const getModules = async (courseID) => {
    const response = await getAllModules(courseID);
    if (response.isSuccess) {
      setCreatedmodule(response.modules);
    }
  };

  // Fetch lessons for each module and store them in lessonsByModule array
  const getLessonsForModule = async (moduleID) => {
    try {
      const response = await getAllLessons(courseID, moduleID);
      if (response.isSuccess) {
        setLessonsByModule((prevLessons) => [
          ...prevLessons,
          { module_id: moduleID, lessons: response.lessons }, // Store lessons by module
        ]);
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };

  useEffect(() => {
    if (courseID) {
      getModules(courseID);
    }
  }, [courseID]);

  // Fetch lessons for each module when modules are loaded
  useEffect(() => {
    createdmodule.forEach((module) => {
      getLessonsForModule(module.module_id); // Fetch lessons for each module
    });
  }, [createdmodule]);

  console.log(lessonsByModule);

  return (
    <AdminSide>
      <div className="flex my-8 max-w-5xl mx-auto">
        <div className="w-[60%]">hi</div>
        <div className="w-[40%] bg-pale h-screen p-4 flex flex-col gap-2">
          <div>
            {createdmodule?.length > 0 && (
              <div>
                {createdmodule.map((module) => (
                  <div
                    key={module.module_id}
                    className="flex flex-col gap-2 mb-4"
                  >
                    <div className="flex justify-between w-[90%] mx-auto">
                      <p className="text-md font-semibold truncate w-full mr-2">
                        {module.module_title}
                      </p>{" "}
                      {/* Truncate and allow wrapping */}
                      <Trash className="cursor-pointer text-red-800" />
                    </div>
                    <div className="flex flex-row gap-5 items-center justify-center">
                      <LessonsForm
                        moduleID={module.module_id}
                        onLessonCreated={() =>
                          getLessonsForModule(module.module_id)
                        }
                      >
                        <PlusCircle />
                      </LessonsForm>
                      <p>Add new Lesson</p>
                      <Trash className="cursor-pointer text-red-800" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-5 ">
            <ModuleForm courseID={courseID} getModules={getModules}>
              <PlusCircle />
            </ModuleForm>
            <p>Add new module</p>
          </div>
        </div>
      </div>
    </AdminSide>
  );
};

export default CreateLessons;
