import { Play, Timer, BookOpenCheck } from "lucide-react";
import React, { useState, useRef, useEffect, useCallback } from "react";
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

const StartLessons = ({ coursetitle, lectures, finalTest }) => {
  const { user } = useSelector((state) => state.user);
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [showNextLesson, setShowNextLesson] = useState(false);
  const [nextLesson, setNextLesson] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [lectureUrl, setLectureUrl] = useState("");
  const [ModuleTitle, setModuleTitle] = useState("");
  const [activeQuiz, setActiveQuiz] = useState({});

  useEffect(() => {
    if (lectures?.length && lectures[0].lessons.length) {
      playLesson(
        lectures[0].lessons[0],
        lectures[0].module_title,
        lectures[0].module_id
      );
    }
  }, [lectures]);

  useEffect(() => {
    if (showNextLesson) {
      let start = 0;
      const duration = 5000; // 5 seconds
      const step = 100 / (duration / 50); // Gradual progress step (from 0% to 100%)

      const interval = setInterval(() => {
        start += step;
        setProgress(start);
        if (start >= 100) clearInterval(interval);
      }, 50);

      return () => clearInterval(interval);
    }
  }, [showNextLesson]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && activeLesson) {
      setProgress((video.currentTime / video.duration) * 100);
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

  const handleVideoEnd = useCallback(() => {
    if (!lectures) return;

    const moduleIndex = lectures.findIndex(
      (mod) => mod.module_id === activeModule
    );
    if (moduleIndex === -1) return;

    const lessonIndex = lectures[moduleIndex].lessons.findIndex(
      (l) => l.lesson_id === activeLesson
    );
    const currentLessons = lectures[moduleIndex].lessons; // all lessons from specific module

    // if there's still lesson in current module, set next lesson
    if (lessonIndex < currentLessons.length - 1) {
      setNextLesson(currentLessons[lessonIndex + 1]);
      setShowNextLesson(true);
      // setTimeout(() => playLesson(currentLessons[lessonIndex + 1]), 5000);
    } else if (lectures[moduleIndex].quizzes.length > 0) {
      const quiz = lectures[moduleIndex].quizzes[0];
      setActiveQuiz(quiz);
      setShowNextLesson(true);
      // setTimeout(() => playQuiz(quiz), 5000);
    } else if (moduleIndex + 1 < lectures.length) {
      const nextModule = lectures[moduleIndex + 1];
      setNextLesson(nextModule.lessons[0]);
      setShowNextLesson(true);
      // setTimeout(
      //   () =>
      //     playLesson(
      //       nextModule.lessons[0],
      //       nextModule.module_title,
      //       nextModule.module_id
      //     ),
      //   5000
      // );
    }
  }, [lectures, activeLesson, activeModule]);

  const playLesson = (
    lesson,
    moduleTitle = ModuleTitle,
    moduleID = activeModule
  ) => {
    setProgress(0);
    setActiveQuiz({});
    setActiveLesson(lesson.lesson_id);
    setModuleTitle(moduleTitle);
    setActiveModule(moduleID);
    setLectureUrl(lesson.video_url);
    setShowNextLesson(false);
    videoRef.current?.load();
  };

  const playQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setActiveLesson(null);
    setNextLesson({});
    setShowNextLesson(false);
    setLectureUrl("");
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row w-[95%] sm:max-w-[80%] mx-auto justify-between my-5 gap-4">
        <div className="w-[60%]">
          <p className="text-2xl font-bold">{coursetitle}</p>
          <p className="text-xl my-3 font-semi-bold text-heading">
            Module: <span className="font-bold">{ModuleTitle}</span>
          </p>
        </div>
        <div className="w-[30%]">
          <h2 className="text-xl font-bold">Learning progress</h2>
          <Progress value={progress} />
        </div>
      </div>
      <div className="w-full px-4 md:px-8 lg:px-16 xl:px-32 pb-14">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          <div className="w-full lg:w-3/4">
            {lectureUrl ? (
              <div className="relative">
                <video
                  ref={videoRef}
                  src={lectureUrl}
                  className="w-full h-[500px]"
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
                    onClick={() => {
                      if (Object.keys(activeQuiz).length > 0) {
                        playQuiz(activeQuiz);
                      } else {
                        playLesson(nextLesson, activeModule);
                      }
                    }}
                  >
                    {/* Circular Loading Progress */}
                    <div className="relative w-20 h-20">
                      <svg
                        className="absolute inset-0 w-full h-full"
                        viewBox="0 0 50 50"
                      >
                        <circle
                          cx="25"
                          cy="25"
                          r="20"
                          fill="none"
                          stroke="gray"
                          strokeWidth="3"
                          opacity="0.3"
                        />
                        <circle
                          cx="25"
                          cy="25"
                          r="20"
                          fill="none"
                          stroke="white"
                          strokeWidth="3"
                          strokeDasharray="125.6"
                          strokeDashoffset={`${
                            125.6 - (progress / 100) * 125.6
                          }`}
                          strokeLinecap="round"
                          style={{
                            transition: "stroke-dashoffset 50ms linear",
                          }}
                        />
                      </svg>

                      {/* Play Icon in Center */}
                      <div className="absolute inset-0 flex justify-center items-center">
                        <Play className="w-12 h-12 text-white" />
                      </div>
                    </div>

                    {/* Next Lesson Text */}
                    <p className="mt-4">
                      Next: {nextLesson.lesson_title || activeQuiz.quiz_title}{" "}
                      (Click to Play)
                    </p>
                  </div>
                )}
              </div>
            ) : Object.keys(activeQuiz).length > 0 ? (
              <Quizzes Quiz={activeQuiz}/>
            ) : (<></>)}
            {activeLesson  ? (
              <Comments
                activeLesson={activeLesson}
                user={user}
                lesson={nextLesson}
              />
            ) : null}
          </div>
          <div className="sticky top-0 w-1/3 mx-auto bg-pale p-6 rounded-lg">
            {lectures.map((lect) => (
              <Accordion
                key={lect.module_id}
                style={{ backgroundColor: "transparent", boxShadow: "none" }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography component="span">
                    <div
                      className={`font-bold ${
                        activeModule === lect.module_id ? "text-heading" : ""
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
                      onClick={() =>
                        playLesson(lesson, lect.module_title, lect.module_id)
                      }
                    >
                      <Play
                        className="text-black bg-gray-300 w-8 h-8 p-2 rounded-full"
                        size={18}
                      />
                      <span className="truncate max-w-[150px] overflow-hidden whitespace-nowrap">
                        {lesson.lesson_title}
                      </span>
                      <div className="flex flex-row justify-between gap-2">
                        <Timer size={15} />
                        <p className="font-semibold text-sm">
                          {lesson.duration}
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
                        playQuiz(quiz);
                      }}
                    >
                      <BookOpenCheck />
                      <span>{quiz.title}</span>
                    </div>
                  </AccordionDetails>
                ))}
              </Accordion>
            ))}
            <div className="flex justify-center font-bold items-center bg-white w-[95%] mx-auto p-2 rounded-lg text-black">
                <span className="ml-4">{finalTest.title}</span>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StartLessons;
