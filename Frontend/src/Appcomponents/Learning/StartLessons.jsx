import { Play, Timer } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import { format, parseISO } from "date-fns";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector } from "react-redux";
import { GetComments, AddComment, DeleteComment } from "@/EndPoints/user";
import { formatDuration } from "@/lib/utils";
import Comments from "./Comments";

const StartLessons = ({ coursetitle, lectures }) => {
  const { user } = useSelector((state) => state.user);
  const [lectureUrl, setLectureUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [module, setModule] = useState("");
  const [activeLesson, setActiveLesson] = useState(null);
  const [lesson, setLesson] = useState("");
  const videoRef = useRef(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && activeLesson) {
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      video.paused ? video.play() : video.pause();
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
      setProgress(0);
      setLectureUrl(nextLesson.video_url);
      setActiveLesson(nextLesson.lesson_id);
      setLesson(nextLesson);
    } else {
      const nextModuleIndex = currentModuleIndex + 1;
      if (
        nextModuleIndex < lectures.length &&
        lectures[nextModuleIndex].lessons.length > 0
      ) {
        const nextModule = lectures[nextModuleIndex];

        const nextLesson = nextModule.lessons[0];
        setProgress(0);
        setModule(nextModule.module_title);
        setLectureUrl(nextLesson.video_url);
        setActiveLesson(nextLesson.lesson_id);
        setLesson(nextLesson);
      }
    }
  };

  useEffect(() => {
    if (lectures && lectures.length > 0 && lectures[0].lessons.length > 0) {
      const firstLesson = lectures[0].lessons[0];
      setLectureUrl(firstLesson.video_url);
      setActiveLesson(firstLesson.lesson_id);
      setLesson(firstLesson);
      setModule(lectures[0].module_title);
    }
  }, [lectures]);
  console.log(lectures);
  return (
    <div className="w-full px-4 md:px-8 lg:px-16 xl:px-32 pb-14">
      {console.log(activeLesson)}
      <div className="my-5">
        <p className="text-2xl font-bold">{coursetitle}</p>
        <p className="text-xl my-3 font-semi-bold text-heading">
          Module: <span className="font-bold">{module}</span>{" "}
        </p>
      </div>

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

          {/* Comment Section */}
          {console.log(lesson.lesson_id)}
          <Comments activeLesson={activeLesson} user={user} lesson={lesson}/>
        </div>

        <div className="w-full lg:w-1/3 mx-auto bg-pale p-6 rounded-lg">
          {lectures.map((lect) => (
            <Accordion
              key={lect.module_id}
              style={{ backgroundColor: "transparent", boxShadow: "none" }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  component="span"
                  onClick={() => setModule(lect.module_title)}
                >
                  <div className="font-bold">{lect.module_title}</div>
                </Typography>
              </AccordionSummary>
              <div>
                {lect.lessons.map((lesson) => (
                  <AccordionDetails key={lesson.lesson_id}>
                    <div className="flex justify-between items-center">
                      <div
                        className={`cursor-pointer hover:text-heading flex gap-3 items-center ${
                          activeLesson === lesson.lesson_id
                            ? "font-bold text-heading"
                            : "text-black"
                        }`}
                        onClick={() => {
                          setLectureUrl(lesson.video_url);
                          setActiveLesson(lesson.lesson_id);
                          setLesson(lesson);
                          setModule(lect.module_title);
                        }}
                      >
                        <Play
                          className="text-black bg-gray-500 w-7 h-7 p-2 rounded-full"
                          size={18}
                        />
                        <span className="truncate max-w-[150px] overflow-hidden whitespace-nowrap">
                          {lesson.lesson_title}
                        </span>
                      </div>
                      <div className="flex gap-1 items-center">
                        {" "}
                        <Timer className="text-gray-500 " size={18} />{" "}
                        <p>{formatDuration(lesson.duration)} </p>
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
  );
};

export default StartLessons;
