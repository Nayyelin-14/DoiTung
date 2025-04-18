import { Play } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import { format, parseISO } from "date-fns";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const StartLessons = ({ coursetitle, lectures }) => {
  const [lectureUrl, setLectureUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [module, setModule] = useState("");
  const [activeLesson, setActiveLesson] = useState(null); // Track the active lesson
  const [Lesson, setLesson] = useState(""); // Track the active lesson
  const videoRef = useRef(null);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && activeLesson) {
      // Update progress only for active lesson
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  const progressPercentage = progress; // This is the progress from 0 to 100
  const angle = (progressPercentage / 100) * 360; // Calculate the angle for the progress arc

  const [isPlaying, setIsPlaying] = useState(false);

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

    // Find the current module
    let currentModuleIndex = lectures.findIndex(
      (mod) => mod.module_title === module
    );

    if (currentModuleIndex === -1) return; // If module not found, do nothing

    let currentLessonIndex = lectures[currentModuleIndex].lessons.findIndex(
      (l) => l.lesson_id === activeLesson
    );

    const currentLessons = lectures[currentModuleIndex].lessons;

    // Check if there is a next lesson in the same module
    if (currentLessonIndex < currentLessons.length - 1) {
      const nextLesson = currentLessons[currentLessonIndex + 1];
      setProgress(0);
      setLectureUrl(nextLesson.video_url);
      setActiveLesson(nextLesson.lesson_id);
      setLesson(nextLesson);
    } else {
      // No more lessons in current module, check next module
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
      } else {
        console.log("No more lessons available. Auto-redirect stopped.");
      }
    }
  };
  useEffect(() => {
    // Automatically load the first lesson's video when the component is mounted
    if (
      lectures &&
      lectures.length > 0 &&
      lectures[0].lessons &&
      lectures[0].lessons.length > 0
    ) {
      const firstLesson = lectures[0].lessons[0];
      const firstModule = lectures[0].module_title;
      setLectureUrl(firstLesson.video_url);
      setActiveLesson(firstLesson.lesson_id); // Set the first lesson as active
      setLesson(firstLesson);
      setModule(firstModule);
    }
  }, [lectures]); //
  console.log(lectures);

  return (
    <div className="w-[90%] mx-auto h-[100%]">
      <div className="  my-5 w-[70%] ml-10 p-4">
        <p className="text-2xl font-bold">Title - {coursetitle}</p>
        <p className="text-2xl font-bold">Module - {module}</p>
      </div>
      <div className="flex mb-20 px-10 gap-2 h-screen">
        <div className=" w-[75%] relative">
          {lectureUrl && (
            <div className="relative">
              <video
                ref={videoRef}
                src={lectureUrl}
                className="h-[640px] w-full"
                controls
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => console.log("Video started")}
                onPause={() => console.log("Video paused")}
                onEnded={handleVideoEnd}
              />

              {!isPlaying && (
                <div
                  onClick={handlePlayPause}
                  className="absolute inset-0  top-0 bottom-0 flex justify-center items-center  cursor-pointer"
                >
                  <Play
                    className="text-white bg-gray-700  border p-5 w-32 h-20 border-black rounded-lg"
                    size={40}
                  />
                </div>
              )}
            </div>
          )}

          {Lesson && (
            <div className="h-fit w-[95%] mx-auto bg-pale mt-5">
              <div className="p-4">
                <p>Lesson - {Lesson.lesson_title}</p>
                <p>
                  Created at -
                  <span>
                    {format(
                      parseISO(Lesson.createdAt),
                      "MMMM dd, yyyy hh:mm a"
                    )}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 w-[25%] mx-auto bg-pale p-6 rounded-lg">
          {lectures &&
            lectures.map((lect) => (
              <div key={lect.module_id}>
                <Accordion
                  style={{
                    backgroundColor: "transparent",
                    boxShadow: "none",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    <Typography component="span">
                      <p
                        className="font-bold"
                        onClick={() => setModule(lect.module_title)}
                      >
                        {lect.module_title}
                      </p>
                    </Typography>
                  </AccordionSummary>
                  <div onClick={() => setModule(lect.module_title)}>
                    {lect.lessons ? (
                      <div className="flex flex-col gap-2">
                        {lect.lessons.map((lesson) => (
                          <AccordionDetails key={lesson.lesson_id}>
                            <div className="flex justify-between  items-center">
                              <div
                                className="cursor-pointer hover:text-blue-500 flex gap-3 items-center"
                                onClick={() => {
                                  setLectureUrl(lesson.video_url);
                                  setActiveLesson(lesson.lesson_id); // Set active lesson
                                  setLesson(lesson);
                                }}
                              >
                                <div className="relative w-8 h-8 bg-gray-400 rounded-full overflow-hidden flex items-center justify-center">
                                  {/* Circular Progress Indicator */}
                                  {activeLesson === lesson.lesson_id && (
                                    <div
                                      className="progress-indicator absolute top-0 left-0 w-full h-full bg-pale rounded-full"
                                      style={{
                                        clipPath: "circle(50%)", // Keeps the circle shape
                                        background: `conic-gradient(red ${angle}deg, transparent 0deg)`, // Creates a progress arc
                                        transition:
                                          "background 0.2s ease-in-out",
                                      }}
                                    ></div>
                                  )}
                                  {/* Play Icon centered inside the circle */}
                                  <Play
                                    className="absolute left-2 text-black"
                                    size={18}
                                  />
                                </div>

                                {lesson.lesson_title}
                              </div>
                              <p>{lesson.duration}</p>
                            </div>
                          </AccordionDetails>
                        ))}
                      </div>
                    ) : (
                      "No lessons found"
                    )}
                  </div>
                </Accordion>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default StartLessons;
