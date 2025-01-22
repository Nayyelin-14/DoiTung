import React, { useEffect, useState } from "react";
import AdminSide from "../../AdminSide/Admin";
import { PlusCircle, Trash } from "lucide-react";
import ModuleForm from "./ModuleForm";
import { useParams } from "react-router-dom";
import LessonsForm from "./LessonsForm";
import { getAllLessons, getAllModules } from "@/EndPoints/courses";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { toast } from "sonner";

const CreateLessons = () => {
  const { courseID } = useParams();
  const [createdmodule, setCreatedmodule] = useState([]);

  // Fetch all modules for the course
  const getModules = async (courseID) => {
    const response = await getAllModules(courseID);
    if (response.isSuccess) {
      setCreatedmodule(response.modules);
    }
  };

  // Fetch lessons for each module and store them in lessonsByModule array
  const [lessonsByModule, setLessonsByModule] = useState({});
  const getLessonsForModule = async (moduleID) => {
    try {
      const response = await getAllLessons(courseID, moduleID);
      if (response.isSuccess) {
        const newLessons = response.lessons[moduleID].lessons;

        // Update the state for the specific module
        setLessonsByModule((prev) => ({
          ...prev,
          [moduleID]: newLessons,
        }));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (courseID) {
      getModules(courseID);
    }
  }, [courseID]);

  useEffect(() => {
    createdmodule.forEach((module) => {
      getLessonsForModule(module.module_id);
    });
  }, [createdmodule]);

  return (
    <AdminSide>
      <div className="flex my-8 max-w-5xl mx-auto">
        <div className="w-[60%]">
          <video src="" />
        </div>
        <div className="w-[40%] bg-pale h-[700px] p-4 flex flex-col gap-1 overflow-y-auto rounded-lg">
          {createdmodule?.length > 0 && (
            <div>
              {createdmodule.map((module) => (
                <div
                  key={module.module_id}
                  className="flex flex-col gap-2 mb-4"
                >
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <Typography component="span">
                        <div className="flex justify-between w-[290px] mx-auto">
                          <p className="text-md font-semibold truncate w-full mr-2">
                            {module.module_title}
                          </p>
                          {/* Trash icon */}
                          {!lessonsByModule && (
                            <Trash className="cursor-pointer text-red-800" />
                          )}
                        </div>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div>
                        {/* Display lessons for the current module */}
                        {lessonsByModule[module.module_id]?.map((l) => (
                          <div className="flex justify-between items-center w-[80%] mx-auto mb-4">
                            <p key={l.lesson_id}>{l.lesson_title}</p>
                            <Trash className="cursor-pointer text-red-800" />
                          </div>
                        ))}
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
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div>
              ))}
            </div>
          )}

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
