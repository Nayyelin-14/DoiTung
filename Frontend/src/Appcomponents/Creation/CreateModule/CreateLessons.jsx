import React, { useEffect, useState } from "react";
import AdminSide from "../../AdminSide/Admin";
import { PlusCircle, Trash } from "lucide-react";
import ModuleForm from "./ModuleForm";
import { useNavigate, useParams } from "react-router-dom";
import LessonsForm from "./LessonsForm";
import {
  DeleteQuiz,
  getAllLessons,
  getAllModules,
  GetQuiz,
  removeLesson,
} from "@/EndPoints/courses";
import Accordion from "@mui/material/Accordion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { toast } from "sonner";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { saveAsComplete, saveDraft } from "@/EndPoints/drafts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import QuizForm from "./QuizForm";
import CreateQuestions from "./CreateQuestions";
import QuestionPreview from "./QuestionPreview";

const CreateLessons = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { courseID } = useParams();
  const [createdmodule, setCreatedmodule] = useState([]);
  const [lessonURL, setLessonURL] = useState("");
  const [quizzesByModule, setQuizzesByModule] = useState({});
  const [questForm, setQuestForm] = useState(false);
  const [preview, setPreview] = useState(false);
  const [quiz, setQuiz] = useState({});
  const [lessonsByModule, setLessonsByModule] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch all modules for the course
  const getModules = async (courseID) => {
    try {
      const response = await getAllModules(courseID);
      if (response.isSuccess) {
        setCreatedmodule(response.modules);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getQuiz = async (moduleID) => {
    try {
      const response = await GetQuiz(moduleID);
      if (response.success) {
        setQuizzesByModule((prev) => ({
          ...prev,
          [moduleID]: response.quizzes,
        }));
      }
    } catch (error) {
      toast.error(error.message);
    }
  }; 

  // Fetch lessons for each module and store them in lessonsByModule array
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

  const removeCreatedQuiz = async (quizID, moduleID) => {
    const confirmDelete = window.confirm("Are you sure to delete?");
    if (confirmDelete) {
      try {
        const response = await DeleteQuiz(quizID, moduleID);
        if (response.success) {
          toast.warning(response.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
      setQuizzesByModule((prev) => {
        const updatedQuizzes = quizzesByModule[moduleID]?.filter(
          (q) => q.quiz_id !== quizID
        );
        return {
          ...prev,
          [moduleID]: updatedQuizzes,
        };
      });
    }
  }


  const saveAsDraft = async (userID, courseID) => {
    try {
      const response = await saveDraft(userID, courseID);
      console.log(response);
      if (response.isSuccess) {
        toast.success(response.message);
        navigate("/admin/course_management");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const saveAsCompleted = async (userID, courseID) => {
    try {
      const response = await saveAsComplete(userID, courseID);
      if (response.isSuccess) {
        toast.success(response.message);
        navigate("/admin/course_management");
      } else {
        toast.error(response.message);
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
      getQuiz(module.module_id);
    });
  }, [createdmodule]);

  console.log(lessonURL);
  return (
    <AdminSide>
      <div className="flex flex-col lg:flex-row my-8 lg:max-w-5xl xl:max-w-7xl mx-auto gap-4 h-[550px] xl:h-[670px]">
      {lessonURL ? (
        // If lessonURL exists, render the Hero Video section
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
      ) : questForm ? (
        // Else if questForm is true, render the Quest Form section
        <CreateQuestions Quiz={quiz} setQuestForm={setQuestForm}/>
      ) : preview ? (
        <QuestionPreview Quiz={quiz} setPreview={setPreview}/>
      ) : (
        // Else, render the fallback content
        <div className="w-[90%] lg:w-[50%] mx-auto lg:mx-0 flex flex-col items-center justify-center gap-20">
          <p className="text-xl font-bold text-center">
            Create new lessons for each module
          </p>
          <DotLottieReact
            src="https://lottie.host/4229eb90-987f-45df-ad1a-5e4751774ca9/3sJXHkTuCY.lottie"
            loop
            autoplay
            className="w-32 h-32"
          />
        </div>
      )}

        <div className="w-[90%] lg:w-[40%] mx-auto lg:mx-0 bg-pale h-full p-4 flex flex-col gap-6 overflow-y-auto rounded-lg">
          {/* Module and Lessons Sections */}
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
                          className="flex justify-between items-center w-[80%] mx-auto mb-4"
                          key={l.lesson_id}
                        >
                          <p>
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

                      {quizzesByModule[module.module_id]?.map((quiz) => (
                        <div
                          className="flex justify-between items-center w-[80%] mx-auto mb-4 cursor-pointer"
                          key={quiz.quiz_id}
                          onClick={()=> {setPreview(true);
                            setQuiz(quiz);
                          }}
                        >
                          <p>{quiz.title}</p>
                          <Trash
                            className="cursor-pointer text-red-800 hover:text-red-400"
                            onClick={() => 
                              removeCreatedQuiz(quiz.quiz_id, module.module_id)
                            }
                          />
                        </div>
                      ))}

                      <div className="flex flex-row gap-3 mb-4 items-center justify-center">
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

                      <div className="flex flex-row gap-3 mb-4 items-center justify-center">
                        <QuizForm moduleID={module.module_id} setQuestForm={setQuestForm} setQuiz={setQuiz}
                          onQuizCreated={() => {
                            getQuiz(module.module_id);
                          }}
                        >
                        <PlusCircle />
                        </QuizForm>
                        <p>Add new Quiz</p>
                      </div>

                    </AccordionDetails>
                  </Accordion>
                </div>
              ))}
            </div>
          )}

          {/* Module Creation Section */}
          <div className="flex gap-5">
            <ModuleForm courseID={courseID} getModules={getModules}>
              <PlusCircle />
            </ModuleForm>
            <p>Add new module</p>
          </div>

          <div className="flex gap-5">
            <ModuleForm courseID={courseID} getModules={getModules}>
              <PlusCircle />
            </ModuleForm>
            <p>Add new module</p>
          </div>

          {/* Button Section */}
          <div className="mt-auto flex flex-col gap-2">
            {/* ///// */}
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button className="bg-transparent hover:bg-gray-200 text-black border border-black">
                  Save as draft
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will save the course as a draft and it will not
                    show to the user. If confirm , we will redirect you back to
                    course management
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => saveAsDraft(user.user_id, courseID)}
                  >
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {/* /// */}
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button>Save as Complete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will save the course as complete and it will
                    show to the user. If confirm , we will redirect you back to
                    course management
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => saveAsCompleted(user.user_id, courseID)}
                  >
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </AdminSide>
  );
};

export default CreateLessons;
