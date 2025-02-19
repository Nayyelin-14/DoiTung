import { Play, Timer, BookOpenCheck, CheckCheck } from "lucide-react";
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Accordion from "@mui/material/Accordion";
import { format, parseISO } from "date-fns";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector } from "react-redux";
import { Progress } from "@/components/ui/progress";
import Comments from "./Comments";
import Quizzes from "./Quizzes";
import { getcompletedLessons, setLessonCompleted } from "@/EndPoints/courses";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import Test from "./Test";

const MemoizedComments = React.memo(Comments);
const MemoizedQuizzes = React.memo(Quizzes);

const StartLessons = ({
  coursetitle,
  lectures,
  finalTest,
  userID,
  courseID,
}) => {
  const { user } = useSelector((state) => state.user);

  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [activeLesson, setActiveLesson] = useState(null); //lessonID
  const [currentLesson, setCurrentLesson] = useState(null);
  const [activeModule, setActiveModule] = useState(null); //moduleID
  const [showNextLesson, setShowNextLesson] = useState(false); //videoendCondition
  const [nextLesson, setNextLesson] = useState({}); //lesson under module
  const [isPlaying, setIsPlaying] = useState(false); //Play-Pause condition
  const [lectureUrl, setLectureUrl] = useState("");
  const [ModuleTitle, setModuleTitle] = useState("");
  const [activeQuiz, setActiveQuiz] = useState({}); //Quiz OR Test (object)
  const [startQuiz, setStartQuiz] = useState(false);
  const [isTest, setIsTest] = useState(false);

  const [completedLessonsArr, setCompletedLessonsArr] = useState([]);
  const [completedLessonsCounts, setCompletedLessonsCounts] = useState(0);
  console.log(completedLessonsArr);

  useEffect(() => {
    if (lectures?.length && lectures[0].lessons.length) {
      playLesson(
        lectures[0].lessons[0],
        lectures[0].module_title,
        lectures[0].module_id
      );
    }
  }, [lectures]);

  const progressRef = useRef(0);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && activeLesson) {
      // setProgress((video.currentTime / video.duration) * 100);
    }
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  ///set completed
  const completeAction = async (courseID, userID, activeLesson) => {
    try {
      const response = await setLessonCompleted(courseID, userID, activeLesson);
      if (response.isCompleted) {
        toast.success(response.message);
        checkCompleted_lessons(courseID, userID);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const totalLessons = useMemo(
    () => lectures.reduce((total, module) => total + module.lessons.length, 0),
    [lectures]
  );
  
  const totalQuizzes = useMemo(
    () => lectures.reduce((total, module) => total + module.quizzes.length, 0),
    [lectures]
  );
  
  const totalCourseItems = useMemo(
    () => totalLessons + totalQuizzes,
    [totalLessons, totalQuizzes]
  );
  //
  const checkCompleted_lessons = async (courseID, userID) => {
    try {
      const response = await getcompletedLessons(courseID, userID);

      if (response.isSuccess) {
        setCompletedLessonsArr(response.completedLESSONS);
        setCompletedLessonsCounts(response.completedLessonsCount);
        calculateProgress();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const calculateProgress = useCallback(() => {
    const updatedProgress = parseFloat(
      ((completedLessonsCounts / totalCourseItems) * 100).toFixed(2)
    );
    if (updatedProgress !== progress) {
      setProgress(updatedProgress);
    }
  }, [completedLessonsCounts, totalCourseItems, progress]);

  const handleVideoEnd = useCallback(() => {
    completeAction(courseID, userID, activeLesson);
    checkCompleted_lessons(courseID, userID);

    if (!lectures?.length) return;

    const moduleIndex = lectures.findIndex(
      (mod) => mod.module_id === activeModule
    );
    if (moduleIndex === -1) return;

    const lessonIndex = lectures[moduleIndex].lessons.findIndex(
      (l) => l.lesson_id === activeLesson
    );
    const currentLessons = lectures[moduleIndex].lessons;

    if (lessonIndex < currentLessons.length - 1) {
      setNextLesson(currentLessons[lessonIndex + 1]);
      setShowNextLesson(true);
    } else if (lectures[moduleIndex].quizzes.length > 0) {
      setActiveQuiz(lectures[moduleIndex].quizzes[0]);
      setShowNextLesson(true);
    } else if (moduleIndex + 1 < lectures.length) {
      const nextModule = lectures[moduleIndex + 1];
      setActiveModule(nextModule.module_id);
      setModuleTitle(nextModule.module_title);
      setNextLesson(nextModule.lessons[0]);
      setShowNextLesson(true);
    }
  }, [activeLesson, activeModule, lectures, courseID, userID]);

  const handleNextLessonClick = useCallback(() => {
    if (Object.keys(activeQuiz).length > 0) {
      playQuiz(activeQuiz, activeModule);
    } else {
      playLesson(nextLesson, ModuleTitle, activeModule);
    }
  }, [activeQuiz, activeModule, nextLesson, ModuleTitle]);

  const playLesson = useCallback(
    (lesson, moduleTitle = ModuleTitle, moduleID = activeModule) => {
      setActiveQuiz({});
      setActiveLesson(lesson.lesson_id);
      setCurrentLesson(lesson);
      setModuleTitle(moduleTitle);
      setActiveModule(moduleID);
      setLectureUrl(lesson.video_url);
      setShowNextLesson(false);
      videoRef.current?.load();
    },
    [ModuleTitle, activeModule]
  );

  const playQuiz = (quiz, moduleID = activeModule, module_title) => {
    setActiveQuiz(quiz);
    setActiveModule(moduleID);
    setModuleTitle(module_title);
    setStartQuiz(false);
    setActiveLesson(null);
    setCurrentLesson(null);
    setNextLesson({});
    setShowNextLesson(false);
    setLectureUrl("");
  };


  useEffect(() => {
    checkCompleted_lessons(courseID, userID);
  }, [activeLesson, courseID, userID]);

  const formatDuration = (seconds) => {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`;
  };

  return (
    <>
      <div className={`${isTest ? "hidden" : ""} `}>
        <div
          className={`flex flex-col lg:flex-row w-[95%] sm:max-w-[85%] mx-auto justify-between my-5 gap-4`}
        >
          <div className="w-[60%]">
            <p className="text-2xl font-bold">{coursetitle}</p>
            <p className="text-xl my-3 font-semi-bold text-heading">
              Module: <span className="font-bold">{ModuleTitle}</span>
            </p>
          </div>
        </div>
        <div className={`w-[85%] mx-auto pb-14`}>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            <div className="w-full lg:w-3/4">
              {lectureUrl ? (
                <div className="relative">
                  <video
                    ref={videoRef}
                    src={lectureUrl}
                    className="w-full h-[500px] border border-gray-100 rounded-lg shadow-md"
                    controls
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleVideoEnd}
                  />
                  {!isPlaying && (
                    <div
                      onClick={handlePlayPause}
                      className="absolute inset-0 flex justify-center items-center cursor-pointer"
                    >
                      <Play
                        className="text-white bg-gray-700 p-5 w-20 h-20 rounded-full"
                        size={30}
                      />
                    </div>
                  )}
                  {showNextLesson && (
                    <div
                      className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 text-white text-xl font-semibold cursor-pointer"
                      onClick={handleNextLessonClick}
                    >
                      {/* Circular Loading Progress */}
                      <div className="relative w-20 h-20">
                        {/* Play Icon in Center */}
                        <div className="absolute inset-0 flex justify-center items-center">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      </div>

                      {/* Next Lesson Text */}
                      <p className="mt-4">
                        Next: {nextLesson.lesson_title || "Quiz"} (Click to
                        Play)
                      </p>
                    </div>
                  )}
                </div>
              ) : Object.keys(activeQuiz).length > 0 ? (
                <MemoizedQuizzes
                  courseID={courseID}
                  Quiz={activeQuiz}
                  user={user.user_id}
                  startQuiz={startQuiz}
                  setStartQuiz={setStartQuiz}
                  setCompletedLessonsArr={setCompletedLessonsArr}
                  setProgress={setProgress}
                  totalCourseItems={totalCourseItems}
                  setCompletedLessonsCounts={setCompletedLessonsCounts}
                />
              ) : (
                <div>Hello</div>
              )}
              <div>
                {currentLesson && (
                  <div className="h-fit w-full rounded-lg shadow-lg mx-auto bg-pale mt-5">
                    <div className="p-4">
                      <p className="font-semibold text-xl">
                        Lesson - {currentLesson.lesson_title}
                      </p>
                      <p className="text-gray-400 font-semibold text-sm">
                        Created at -
                        <span>
                          {format(
                            parseISO(currentLesson.createdAt),
                            "MMMM dd, yyyy hh:mm a"
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
                <div className="w-full my-5 ">
                  <h2 className="text-xl font-semibold mb-3">
                    Learning progress
                  </h2>
                  <p>{`${completedLessonsCounts} out of ${totalCourseItems} activities completed`}</p>
                  <div className="flex gap-3">
                    <Progress value={progress} className="mt-3" />{" "}
                    <p className="font-bold text-md">{`${progress}`}%</p>
                  </div>
                </div>
                {activeLesson ? (
                  <MemoizedComments
                    activeLesson={activeLesson}
                    user={user}
                    lesson={nextLesson}
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>

            {/* Accordian */}
            <div className="sticky  right-0 h-[680px] top-0 w-full lg:w-1/3 mx-auto bg-pale p-6 overflow-y-auto rounded-lg border border-gray-300 shadow-lg">
              <div>
                {lectures.map((lect) => (
                  <Accordion
                    key={lect.module_id}
                    style={{
                      backgroundColor: "transparent",
                      boxShadow: "none",
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography component="span">
                        <div
                          className={`font-bold ${
                            activeModule === lect.module_id
                              ? "text-heading"
                              : ""
                          }`}
                        >
                          {lect.module_title}
                        </div>
                      </Typography>
                    </AccordionSummary>
                    {lect.lessons.map((lesson) => (
                      <AccordionDetails key={lesson.lesson_id}>
                        <div
                          className={`cursor-pointer hover:text-red-700 flex justify-between gap-3 items-center ${
                            activeLesson === lesson.lesson_id
                              ? "font-semibold text-red-700"
                              : "text-black"
                          }`}
                          onClick={() => {
                            playLesson(
                              lesson,
                              lect.module_title,
                              lect.module_id
                            );
                          }}
                        >
                          {completedLessonsArr.includes(lesson.lesson_id) ? (
                            <CheckCheck className="text-green-600" />
                          ) : (
                            <Play
                              className="text-black w-8 h-8 p-2 rounded-full"
                              size={18}
                            />
                          )}

                          <span className="truncate max-w-[150px] overflow-hidden whitespace-nowrap">
                            {lesson.lesson_title}
                          </span>
                          <div className="flex flex-row justify-between gap-2 items-center">
                            <Timer size={18} className="text-gray-500" />
                            <p className="text-gray-500 text-sm">
                              {formatDuration(lesson.duration)}
                            </p>
                          </div>
                        </div>
                      </AccordionDetails>
                    ))}
                    {lect.quizzes.map((quiz) => (
                      <AccordionDetails key={quiz.quiz_id}>
                        <div
                          className={`cursor-pointer hover:text-red-700 flex justify-center gap-3 items-center ${
                            activeQuiz.quiz_id === quiz.quiz_id
                              ? "font-bold text-red-700"
                              : "text-black"
                          }`}
                          onClick={() => {
                            playQuiz(quiz, lect.module_id, lect.module_title);
                          }}
                        >
                          {completedLessonsArr.includes(quiz.quiz_id) ? (
                            <CheckCheck className="text-green-600 self-start"/>
                          ) : (
                            <BookOpenCheck />
                          )}
                          
                          <span>{quiz.title}</span>
                        </div>
                      </AccordionDetails>
                    ))}
                  </Accordion>
                ))}

                <div className="py-4">
                  <button
                    className="cursor-pointer flex justify-center font-bold items-center bg-gray-900 w-[95%] mx-auto p-2 rounded-lg text-white hover:bg-gray-800"
                    onClick={() => {
                      setIsTest((prev) => !prev);
                      playQuiz(finalTest);
                    }}
                  >
                    <span className="ml-4">{finalTest?.title}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isTest && (
        <div>
          <Test
            Quiz={activeQuiz}
            user={user.user_id}
            setIsTest={setIsTest}
            setActiveQuiz={setActiveQuiz}
            progress={progress}
          />
        </div>
      )}
    </>
  );
};

export default StartLessons;
