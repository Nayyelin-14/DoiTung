import { Play, Timer } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import { format, parseISO } from "date-fns";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import Comments from "./Comments";
import { useSelector } from "react-redux";
import { GetComments, AddComment, DeleteComment } from "@/EndPoints/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, TrashIcon } from "lucide-react";

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

  useEffect(() => {
    if (activeLesson) {
      fetchComments(activeLesson);
    }
  }, [activeLesson]);
    
      const fetchComments = async () => {
        const response = await GetComments(activeLesson);
        if (response.isSuccess) {
          setComments(response.comments);
        }
      };
    
      const handleAddComment = async () => {
        if (!commentText.trim()) return;
        setLoading(true);
    
        const newComment = {
          lesson_id: lesson.lesson_id,
          user_id: user.user_id,
          comment_text: commentText,
        };
    
        const response = await AddComment(newComment);
        if (response.isSuccess) {
          setComments([...comments, { 
            comment_id: response.comment.comment_id, 
            user_name: user.user_name, 
            comment_text: commentText,
            user_profileImage: user.user_profileImage,
          }]); // Update UI instantly
          setCommentText("");
        }
        setLoading(false);
        setActiveLesson(activeLesson);
      };
    
      const handleDeleteComment = async (commentID) => {
        const response = await DeleteComment(commentID, { user_id: user.user_id });
        if (response.isSuccess) {
          setComments(comments.filter(comment => comment.comment_id !== commentID));
        }
      };

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
    let currentModuleIndex = lectures.findIndex((mod) => mod.module_title === module);
    if (currentModuleIndex === -1) return;

    let currentLessonIndex = lectures[currentModuleIndex].lessons.findIndex((l) => l.lesson_id === activeLesson);
    const currentLessons = lectures[currentModuleIndex].lessons;

    if (currentLessonIndex < currentLessons.length - 1) {
      const nextLesson = currentLessons[currentLessonIndex + 1];
      setProgress(0);
      setLectureUrl(nextLesson.video_url);
      setActiveLesson(nextLesson.lesson_id);
      setLesson(nextLesson);
    } else {
      const nextModuleIndex = currentModuleIndex + 1;
      if (nextModuleIndex < lectures.length && lectures[nextModuleIndex].lessons.length > 0) {
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



  return (
    
    <div className="w-full px-4 md:px-8 lg:px-16 xl:px-32 pb-14">
      {console.log(activeLesson)}
      <div className="my-5">
        <p className="text-2xl font-bold">{coursetitle}</p>
        <p className="text-xl my-3 font-semi-bold text-heading">Module: <span className="font-bold">{module}</span> </p>
        <p className="text-xl my-3 font-semi-bold text-black">{lesson.lesson_title}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        <div className="w-full lg:w-3/4">
          {lectureUrl && (
            <div className="relative">
              <video ref={videoRef} src={lectureUrl} className="w-full h-[500px]" controls onTimeUpdate={handleTimeUpdate} onEnded={handleVideoEnd} />
            </div>
          )}

          {lesson && (
            <div className="mt-5 p-4 bg-gray-100 rounded-lg">
              <p>Lesson - {lesson.lesson_title}</p>
              <p>Created at - {format(parseISO(lesson.createdAt), "MMMM dd, yyyy hh:mm a")}</p>
            </div>
          )}

          {/* Comment Section */}
          {console.log(lesson.lesson_id)}
          <div className="w-full max-w-3xl mx-auto p-4 bg-white shadow-md rounded-xl my-8">
          <h2 className="text-xl font-semibold my-5">Comments</h2>

        {/* Comments List (Scrollable) */}
        <div className="w-full overflow-auto h-[400px] px-2 space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center">No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.comment_id} className="flex items-start gap-3">
                <Avatar className="cursor-pointer font-bold">
                  <AvatarImage src={comment.user_profileImage} />
                  <AvatarFallback>{comment.user_name}</AvatarFallback>
                </Avatar>

                <div className="bg-gray-100 p-3 rounded-lg flex-1">
                  <p className="font-semibold">{comment.user_name}</p>
                  <p className="text-gray-700">{comment.comment_text}</p>
                </div>

                {comment.user_id === user.user_id && (
                  <>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer focus:bg-customGreen/30 duration-300 font-medium">
                              <div
                                onClick={() => {
                                  editCourse(course_data.id);
                                }}
                                className="flex gap-2 items-center"
                              >
                                <Pencil /> Edit comment
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer focus:bg-red-300 duration-300 font-medium">
                              <div
                                onClick={() => {
                                  handleDeleteComment(comment.comment_id)}
                                }
                                className="flex gap-2 items-center"
                              >
                                <TrashIcon /> Delete comment
                              </div>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Input Field  */}
        <div className="mt-4 border-t pt-3 flex items-center gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 border p-2 rounded-full outline-none focus:ring-2 focus:ring-customGreen"
          />
          <button
            onClick={handleAddComment}
            className="px-4 py-2 bg-customGreen text-white rounded-full hover:bg-green-950 disabled:opacity-50"
            disabled={loading}
          >
            <Send size={22} />
            {loading ? <Loader2 className="h-3 w-3 animate-spin"/>:<></>}
          </button>
        </div>
      </div>


        </div>

        <div className="w-full lg:w-1/3 mx-auto bg-pale p-6 rounded-lg">
          {lectures.map((lect) => (
            <Accordion key={lect.module_id} style={{ backgroundColor: "transparent", boxShadow: "none" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography component="span" onClick={() => setModule(lect.module_title)}>
                  <div className="font-bold">{lect.module_title}</div>
                </Typography>
              </AccordionSummary>
              <div>
                {lect.lessons.map((lesson) => (
                  <AccordionDetails key={lesson.lesson_id}>
                    <div className="flex justify-between items-center">
                      <div className={`cursor-pointer hover:text-heading flex gap-3 items-center ${activeLesson === lesson.lesson_id ? "font-bold text-heading" : "text-black" }`} onClick={() => {
                        setLectureUrl(lesson.video_url);
                        setActiveLesson(lesson.lesson_id);
                        setLesson(lesson);
                      }}>
                        <Play className="text-black" size={18} />
                        {lesson.lesson_title}
                      </div>
                      <Timer /> <p>{lesson.duration}</p>
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
