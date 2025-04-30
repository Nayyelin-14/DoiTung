import {
  Play,
  Timer,
  BookOpenCheck,
  CircleCheckBig,
  CircleAlert,
} from "lucide-react";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";

import Accordion from "@mui/material/Accordion";
import { format, parseISO } from "date-fns";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector, useDispatch } from "react-redux";
import { setTimeLeft } from "@/store/Slices/testSlice";
import { Progress } from "@/components/ui/progress";
import Comments from "./Comments";
import Quizzes from "./Quizzes";
import { useNavigate } from "react-router-dom";
import {
  getcompletedLessons,
  ProgressSaving,
  setLessonCompleted,
} from "@/EndPoints/courses";

import { toast } from "sonner";
import Test from "./Test";
import { useTranslation } from "react-i18next";

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
  const dispatch = useDispatch();
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
  const [lastAllowedTime, setLastAllowedTime] = useState(0); // Track the last allowed time

  const navigate = useNavigate();
  const [completedLessonsArr, setCompletedLessonsArr] = useState([]);
  const [completedLessonsCounts, setCompletedLessonsCounts] = useState(0);

  useEffect(() => {
    if (lectures?.length && lectures[0].lessons.length) {
      playLesson(
        lectures[0].lessons[0],
        lectures[0].module_title,
        lectures[0].module_id
      );
    }
  }, [lectures]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && activeLesson) {
      setLastAllowedTime(video.currentTime); // Update the last allowed time
      // setProgress((video.currentTime / video.duration) * 100);
    }
  };

  const handleSeeking = (e) => {
    const video = videoRef.current;
    if (video) {
      if (video.currentTime > lastAllowedTime) {
        video.currentTime = lastAllowedTime; // Reset to the last allowed time
      }
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

  ////
  const saveprogess = async (courseID, userID, progress) => {
    try {
      const response = await ProgressSaving(courseID, userID, progress);
      if (!response.isSuccess) {
        toast.info(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  ///

  const checkCompleted_lessons = async (courseID, userID) => {
    try {
      const response = await getcompletedLessons(courseID, userID);

      if (response.isSuccess) {
        setCompletedLessonsArr(response.completedLESSONS);
        setCompletedLessonsCounts(response.completedLessonsCount);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

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
    if (completedLessonsCounts !== undefined && totalCourseItems > 0) {
      const updatedProgress = parseFloat(
        ((completedLessonsCounts / totalCourseItems) * 100).toFixed(2)
      );
      setProgress(updatedProgress);
    }
  }, [completedLessonsCounts, totalCourseItems]);
  useEffect(() => {
    if (progress !== undefined) {
      saveprogess(courseID, userID, progress);
    }
  }, [progress, courseID, userID]);

  useEffect(() => {
    checkCompleted_lessons(courseID, userID);
  }, [activeLesson, courseID, userID]);

  const formatDuration = (seconds) => {
    // Round seconds to avoid excessive decimals
    const roundedSeconds = Math.round(seconds);

    // Handle durations less than 60 seconds
    if (roundedSeconds < 60) {
      return `${roundedSeconds}s`;
    }

    const hours = Math.floor(roundedSeconds / 3600);
    const minutes = Math.floor((roundedSeconds % 3600) / 60);
    const remainingSeconds = roundedSeconds % 60;

    // Format the output
    let formattedDuration = "";

    if (hours > 0) {
      formattedDuration += `${hours}h `;
    }

    if (minutes > 0 || hours > 0) {
      formattedDuration += `${minutes}m `;
    }

    if (remainingSeconds > 0) {
      formattedDuration += `${remainingSeconds}s`;
    }

    return formattedDuration.trim();
  };

  const { t } = useTranslation();

  const {
    module,
    lesson,
    created,
    learning_progress,
    out_of,
    activities_completed,
    pass_final,
    not_final,
  } = t("start", { returnObjects: true });
  return (
    <>
      <div className={`w-[85%] mx-auto pb-14`}>
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          <div className="w-full lg:w-3/4 h-screen]">
            <div className="w-full my-5">
              <p className="text-2xl font-bold">{coursetitle}</p>
              <p className="text-xl my-3 font-semi-bold text-heading">
                {module} <span className="font-bold">{ModuleTitle}</span>
              </p>
            </div>
            {lectureUrl ? (
              <div className="relative">
                <video
                  ref={videoRef}
                  src={lectureUrl}
                  className="w-full h-[500px] border border-gray-100 rounded-lg shadow-md"
                  controls
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleVideoEnd}
                  // onSeeking={handleSeeking}
                  // onSeeked={handleSeeked}
                  // onSeeking={handleSeeking}
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
                      Next: {nextLesson.lesson_title || "Quiz"} (Click to Play)
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
              <div></div>
            )}
            <div>
              {currentLesson && (
                <div className="w-full  mx-auto mt-8 border bg-white rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-lg">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                      {lesson}
                      {currentLesson.lesson_title}
                    </h2>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <span>{created}</span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full" />
                      <span>
                        {format(
                          parseISO(currentLesson.createdAt),
                          "MMMM dd, yyyy hh:mm a"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}

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
          <div className="sticky right-0 top-0 bottom-700 w-full h-full lg:w-1/3 mx-auto">
            <div className="w-full my-3">
              <h2 className="text-lg font-semibold mb-3">
                {learning_progress}
              </h2>
              <p className="text-gray-500">{`${completedLessonsCounts} ${out_of}${totalCourseItems} ${activities_completed}`}</p>
              <div className="flex gap-3">
                <Progress value={progress} className="mt-2" />
                <p className="font-bold text-md">{`${progress}`}%</p>
              </div>
            </div>
            <div className="bg-pale p-6 h-[500px] overflow-y-auto rounded-lg border border-gray-300 shadow-lg">
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
                          <div className="flex flex-row gap-5 items-center">
                            {completedLessonsArr.includes(lesson.lesson_id) ? (
                              <CircleCheckBig className="text-green-500" />
                            ) : (
                              <Play
                                className="text-black w-8 h-8 p-2 rounded-full"
                                size={18}
                              />
                            )}
                            <span className="truncate max-w-[150px] lg:max-w-[200px] overflow-hidden whitespace-nowrap">
                              {lesson.lesson_title}
                            </span>
                          </div>
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
                          className={`cursor-pointer hover:text-red-700 flex justify-between gap-3 items-center ${
                            activeQuiz.quiz_id === quiz.quiz_id
                              ? "font-bold text-red-700"
                              : "text-black"
                          }`}
                          onClick={() => {
                            playQuiz(quiz, lect.module_id, lect.module_title);
                          }}
                        >
                          <div className="flex flex-row gap-5">
                            {completedLessonsArr.includes(quiz.quiz_id) ? (
                              <CircleCheckBig className="text-green-500 self-start" />
                            ) : (
                              <BookOpenCheck />
                            )}
                            <span>{quiz.title}</span>
                          </div>
                          <span></span>
                        </div>
                      </AccordionDetails>
                    ))}
                  </Accordion>
                ))}
              </div>
            </div>

            {finalTest ? (
              <div className="p-4 border-2 rounded-lg border-gray-200 mt-3 items-center text-center">
                <div className="py-4 border-1 hover:border-customGreen">
                  <button
                    className="cursor-pointer flex justify-center font-bold items-center bg-gray-900 w-[95%] mx-auto p-2 rounded-lg text-white hover:bg-gray-800"
                    onClick={() => {
                      dispatch(setTimeLeft(finalTest?.timeLimit));
                      navigate(
                        `/user/course/${user.user_id}/${courseID}/${finalTest?.test_id}`,
                        {
                          state: { progress }, // Pass progress in the state
                        }
                      );
                    }}
                  >
                    <span className="ml-4">{finalTest?.title}</span>
                  </button>
                </div>
                <div className="flex items-center justify-center gap-2 mt-3 px-4 py-2 bg-red-50 border border-red-300 rounded-lg text-red-700">
                  <CircleAlert className="w-6 h-6 flex-shrink-0" />
                  <span className="text-sm font-medium">{pass_final}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 mt-3 px-4 py-2 bg-red-50 border border-red-300 rounded-lg text-red-700">
                <CircleAlert className="w-6 h-6 flex-shrink-0" />
                <span className="text-sm font-medium">{not_final}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StartLessons;
