import { Play, Timer } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import { format, parseISO } from "date-fns";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector } from "react-redux";
import { formatDuration } from "@/lib/utils";
import Comments from "./Comments";
import { Progress } from "@/components/ui/progress";

const StartLessons = ({ coursetitle, lectures }) => {
  const { user } = useSelector((state) => state.user);
  const [lectureUrl, setLectureUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [module, setModule] = useState("");
  const [activeLesson, setActiveLesson] = useState(null);
  const [lesson, setLesson] = useState("");
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNextLesson, setShowNextLesson] = useState(false);
  const [nextLesson, setNextLesson] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [rotation, setRotation] = useState(0);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && activeLesson) {
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  const progressPercentage = progress; // This is the progress from 0 to 100
  const angle = (progressPercentage / 100) * 360; // Calculate the angle for the progress arc

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

  const handleVideoEnd = () => {
    if (!lectures) return;
    let currentModuleIndex = lectures.findIndex(
      (mod) => mod.module_title === module
    );
    if (currentModuleIndex === -1) return;

    let currentLessonIndex = lectures[currentModuleIndex].lessons.findIndex(
      (l) => l.lesson_id === activeLesson
    );
    const currentLessons = lectures[currentModuleIndex].lessons;

    if (currentLessonIndex < currentLessons.length - 1) {
      const nextLesson = currentLessons[currentLessonIndex + 1];
      setNextLesson(nextLesson);
      setModule(lectures[currentModuleIndex].module_title);
      setActiveModule(lectures[currentModuleIndex].module_id);
      setShowNextLesson(true);
      setTimeout(() => {
        playNextLesson(nextLesson);
      }, 5000);
    } else {
      const nextModuleIndex = currentModuleIndex + 1;
      if (
        nextModuleIndex < lectures.length &&
        lectures[nextModuleIndex].lessons.length > 0
      ) {
        const nextModule = lectures[nextModuleIndex];
        const nextLesson = nextModule.lessons[0];
        setNextLesson(nextLesson);
        setModule(nextModule.module_title);
        setActiveModule(nextModule.module_id);
        setShowNextLesson(true);
        setTimeout(() => {
          playNextLesson(nextLesson, nextModule.module_title, nextModule.module_id);
        }, 5000);
      }
    }
  };

  const playNextLesson = (nextLesson, nextModuleTitle = module, nextModuleID = activeModule) => {
    setProgress(0);
    setLectureUrl(nextLesson.video_url);
    setActiveLesson(nextLesson.lesson_id);
    setActiveModule(nextModuleID);
    setLesson(nextLesson);
    setModule(nextModuleTitle);
    setShowNextLesson(false);
  };

  useEffect(() => {
    if (lectures && lectures.length > 0 && lectures[0].lessons.length > 0) {
      const firstLesson = lectures[0].lessons[0];
      setLectureUrl(firstLesson.video_url);
      setActiveLesson(firstLesson.lesson_id);
      setActiveModule(lectures[0].module_id);
      setLesson(firstLesson);
      setModule(lectures[0].module_title);
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

  return (
    <>
    <div className="flex flex-col lg:flex lg:flex-row w-[95%] sm:max-w-[80%] mx-auto justify-between my-5 gap-4">
      <div className="w-[60%]">
        <p className="text-2xl font-bold">{coursetitle}</p>
        <p className="text-xl my-3 font-semi-bold text-heading">
          Module: <span className="font-bold">{module}</span>
        </p>
      </div>

      <div className="w-[30%]">
        <h2 className="text-xl font-bold">Learning progress</h2>
        <p className="mt-2 text-sm text-gray-600">
        1 of 5 lessons completed
        </p>
        <Progress value={progress} />
      </div>
    </div>
    <div className="w-full px-4 md:px-8 lg:px-16 xl:px-32 pb-14">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        <div className="w-full lg:w-3/4">
          {lectureUrl && (
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
                  <Play className="text-white bg-gray-700 p-5 w-20 h-20 rounded-full" size={30} />
                </div>
              )}
              {showNextLesson && nextLesson && module && activeModule && (
                <div
                  className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 text-white text-xl font-semibold cursor-pointer"
                  onClick={() => playNextLesson(nextLesson, module, activeModule)}
                >
                  {/* Play Icon */}
                  <div className="relative w-20 h-20 mb-3">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 50 50">
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
                        strokeDashoffset={`${125.6 - (progress / 100) * 125.6}`}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dashoffset 50ms linear" }}
                      />
                    </svg>

                    {/* Play Icon */}
                    <div className="absolute inset-0 flex justify-center items-center">
                      <Play className="w-15 h-15 text-white" />
                    </div>
                  </div>

                  {/* Next Lesson Text */}
                  <p className="mt-4">Next: {nextLesson.lesson_title} (Click to Play)</p>
                </div>
              )}
            </div>
          )}
          {lesson && (
            <div className="mt-5 p-4 bg-gray-100 rounded-lg flex flex-col gap-4">
              <p className="text-2xl ">
                Lesson -{" "}
                <span className="font-bold">{lesson.lesson_title}</span>
              </p>
              <p className="text-gray-500 font-semibold">
                Created at -{" "}
                {format(parseISO(lesson.createdAt), "MMMM dd, yyyy hh:mm a")}
              </p>
            </div>
          )}

          <Comments activeLesson={activeLesson} user={user} lesson={lesson} />
        </div>

        <div>
          
          <div className="sticky top-0 w-full mx-auto bg-pale p-6 rounded-lg">
            {lectures.map((lect) => (
              <Accordion key={lect.module_id} style={{ backgroundColor: "transparent", boxShadow: "none" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography component="span">
                    <div className={`font-bold ${activeModule === lect.module_id ? "text-heading": ""}`}>{lect.module_title}</div>
                  </Typography>
                </AccordionSummary>
                <div>
                  {lect.lessons.map((lesson) => (
                    <AccordionDetails key={lesson.lesson_id}>
                      <div
                        className={`cursor-pointer hover:text-red-700 flex justify-between gap-3 items-center ${activeLesson === lesson.lesson_id ? "font-semibold text-red-700" : "text-black"}`}
                        onClick={() => playNextLesson(lesson, lect.module_title, lect.module_id)}
                      >
                        <div className="relative w-6 h-6 bg-gray-700 rounded-full overflow-hidden flex items-center justify-center">
                        {activeLesson === lesson.lesson_id && (
                          <div
                          className="progress-indicator absolute top-0 left-0 w-full h-full bg-pale rounded-full"
                          style={{
                          clipPath: "circle(50%)", // Keeps the circle shape
                          background: `conic-gradient(green ${angle}deg, transparent 0deg)`, // Creates a progress arc
                          transition:
                          "background 0.2s ease-in-out",
                          }}
                          ></div>
                        )}
                          <Play className="text-black bg-gray-300 w-8 h-8 p-2 rounded-full" size={18} />
                        </div>
                        <span className="truncate max-w-[150px] overflow-hidden whitespace-nowrap">{lesson.lesson_title}</span>
                        <div className="flex gap-2 items-center">
                        <Timer size={15} /><p className="font-semibold text-sm">{lesson.duration}</p>
                        </div>
                      </div>
                    </AccordionDetails>
                  ))}
                </div>
              </Accordion>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default StartLessons;

