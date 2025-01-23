import React, { useEffect, useState } from "react";
import AdminSide from "../../AdminSide/Admin";
import { PlusCircle, Trash } from "lucide-react";
import ModuleForm from "./ModuleForm";
import { useParams } from "react-router-dom";
import LessonsForm from "./LessonsForm";
import {
  getAllLessons,
  getAllModules,
  removeLesson,
} from "@/EndPoints/courses";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { toast } from "sonner";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";

const CreateLessons = () => {
  const { courseID } = useParams();
  const [createdmodule, setCreatedmodule] = useState([]);
  const [lessonURL, setLessonURL] = useState("");
  // Fetch all modules for the course
  const getModules = async (courseID) => {
    try {
      const response = await getAllModules(courseID);
      if (response.isSuccess) {
        setCreatedmodule(response.modules);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch lessons for each module and store them in lessonsByModule array
  const [lessonsByModule, setLessonsByModule] = useState({});

  const handleLessonURLSet = (url) => {
    setLessonURL(url); // Update the lesson URL in the parent component
  };
  const getLessonsForModule = async (moduleID) => {
    try {
      const response = await getAllLessons(courseID, moduleID);
      if (response.isSuccess) {
        const newLessons = response.lessons[moduleID]?.lessons;

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
  const removeCreatedLesson = async (lessonID, moduleID) => {
    const confirmDelete = window.confirm("Are you sure to delete?");
    if (confirmDelete) {
      try {
        const response = await removeLesson(lessonID, moduleID);
        if (response.isSuccess) {
          toast.warning(response.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
      setLessonsByModule((prev) => {
        const updatedLesson = lessonsByModule[moduleID]?.filter(
          (l) => l.lesson_id !== lessonID
        );
        if (updatedLesson && updatedLesson.length > 0) {
          setLessonURL(updatedLesson[updatedLesson.length - 1].video_url); // Move to the latest lesson
        } else {
          setLessonURL(null); // If no lessons remain, set to null
        }
        return {
          ...prev,
          [moduleID]: updatedLesson,
        };
      });
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
      <div className="flex flex-col lg:flex-row my-8 lg:max-w-5xl mx-auto gap-7">
        {lessonURL ? (
          <div className="w-[90%] lg:w-[60%] mx-auto lg:mx-0">
            <HeroVideoDialog
              className="dark:hidden block"
              animationStyle="fade"
              videoSrc={lessonURL}
              thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
              thumbnailAlt="Hero Video"
            />
            <HeroVideoDialog
              className="hidden dark:block"
              animationStyle="from-center"
              videoSrc={lessonURL}
              thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
              thumbnailAlt="Hero Video"
            />
          </div>
        ) : (
          <div className="w-[90%] lg:w-[50%]">
            <p className="text-xl font-bold">
              Create new lessons for each module
            </p>
          </div>
        )}
        <div className="w-[90%] lg:w-[40%]  mx-auto lg:mx-0 bg-pale h-[700px] p-4 flex flex-col gap-1 overflow-y-auto rounded-lg">
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
                      {/* Display lessons for the current module */}
                      {lessonsByModule[module.module_id]?.map((l) => (
                        <div
                          className="flex justify-between items-center  w-[80%] mx-auto mb-4"
                          key={l.lesson_id}
                        >
                          <p>
                            {" "}
                            {l.lesson_title.length > 30
                              ? `${l.lesson_title.substring(0, 30)}...`
                              : l.lesson_title}
                          </p>

                          <Trash
                            className="cursor-pointer text-red-800 hover:text-red-400"
                            onClick={() =>
                              removeCreatedLesson(l.lesson_id, module.module_id)
                            }
                          />
                        </div>
                      ))}

                      <div className="flex flex-row gap-5 items-center justify-center">
                        <LessonsForm
                          moduleID={module.module_id}
                          onLessonCreated={() => {
                            getLessonsForModule(module.module_id);
                          }}
                          onLessonURLSet={handleLessonURLSet}
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
