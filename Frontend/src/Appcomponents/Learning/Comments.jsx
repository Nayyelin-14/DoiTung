import React, { useState, useEffect, useRef } from "react";
import {
  GetComments,
  AddComment,
  DeleteComment,
  EditComment,
} from "@/EndPoints/user";
import { Send, Loader2, XCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, TrashIcon } from "lucide-react";
import io from "socket.io-client";
import { useTranslation } from "react-i18next";
const socket = io.connect(import.meta.env.VITE_SERVER_URL);

const Comments = ({ activeLesson, user, lesson }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Reference for input field
  const inputRef = useRef(null);

  useEffect(() => {
    if (activeLesson) {
      fetchComments();
      // Listen for updates
      socket.on(`comment-update-${activeLesson}`, () => fetchComments());
      socket.on("comment-delete", () => fetchComments());
      socket.on("comment-edit", () => fetchComments());

      return () => {
        socket.off(`comment-update-${activeLesson}`);
        socket.off(`comment-delete-${activeLesson}`);
        socket.off(`comment-edit-${activeLesson}`);
      };
    }
  }, [activeLesson]);

  useEffect(() => {
    if (editingComment || replyingTo) {
      setTimeout(() => inputRef.current?.focus(), 0); // Auto-focus when editing or replying
    }
  }, [editingComment, replyingTo]);

  const fetchComments = async () => {
    const response = await GetComments(activeLesson);
    setComments(response.comments || []);
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setLoading(true);

    const newComment = {
      lesson_id: activeLesson,
      user_id: user.user_id,
      comment_text: commentText,
    };

    console.log(newComment);
    const response = await AddComment(newComment);
    if (response.isSuccess) {
      setCommentText("");
    }
    setLoading(false);
  };

  const handleEditComment = async () => {
    if (!commentText.trim() || !editingComment) return;
    setLoading(true);

    const editedComment = {
      comment_id: editingComment,
      user_id: user.user_id,
      comment_text: commentText,
    };
    const response = await EditComment(editedComment);
    if (response.isSuccess) {
      setCommentText("");
      setEditingComment(null);
    }
    setLoading(false);
  };

  const handleReplyComment = async () => {
    if (!commentText.trim() || !replyingTo) return;
    setLoading(true);

    const newReply = {
      lesson_id: lesson.lesson_id,
      user_id: user.user_id,
      parent_comment_id: replyingTo,
      comment_text: commentText,
    };

    // const response = await ReplyComment(newReply);
    if (response.isSuccess) {
      fetchComments();
      setCommentText("");
      setReplyingTo(null);
    }
    setLoading(false);
  };

  const handleDeleteComment = async (commentID) => {
    const response = await DeleteComment(commentID, { user_id: user.user_id });
    if (response.isSuccess) {
      setComments(
        comments.filter((comment) => comment.comment_id !== commentID)
      );
    }
  };

  const handleCancel = () => {
    setCommentText("");
    setEditingComment(null);
    setReplyingTo(null);
  };

  const { t } = useTranslation();

  const {
    Comments,
    no_comments,
    Edit_comment,
    Delete_comment,
    Edit_your_comment,
    Write_reply,
    Write_comment,
  } = t("start", { returnObjects: true });
  return (
    <div className="w-full mx-auto p-4 bg-white shadow-md rounded-xl my-8">
      <h2 className="text-xl font-semibold my-5">{Comments}</h2>

      {/* Comments List */}
      <div className="w-full overflow-auto h-[350px] px-2 space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center">{no_comments}</p>
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
              {/* Reply Button */}
              {/* <button
                  onClick={() => {
                    setReplyingTo(comment.comment_id);
                    setCommentText(`${comment.user_name}, `);
                    setEditingComment(null);
                  }}
                  className="text-gray text-sm flex items-center gap-1 mt-2"
                >
                  <MessageCircle size={16} /> Reply
                </button> */}

              {comment.user_id === user.user_id && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setEditingComment(comment.comment_id);
                        setCommentText(comment.comment_text);
                        setReplyingTo(null);
                      }}
                      className="cursor-pointer focus:bg-customGreen/30 duration-300 font-medium"
                    >
                      <Pencil /> {Edit_comment}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteComment(comment.comment_id)}
                      className="cursor-pointer focus:bg-red-300 duration-300 font-medium"
                    >
                      <TrashIcon /> {Delete_comment}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))
        )}
      </div>

      {/* Input Field */}
      <div className="mt-4 border-t pt-3 flex items-center gap-2">
        <input
          ref={inputRef} // Attach input reference here
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={
            editingComment
              ? Edit_your_comment
              : replyingTo
              ? Write_reply
              : Write_comment
          }
          className="flex-1 border p-2 rounded-full outline-none focus:ring-2 focus:ring-customGreen"
        />

        {/* Submit Button (Handles Add, Edit, and Reply) */}
        <button
          onClick={
            editingComment
              ? handleEditComment
              : replyingTo
              ? handleReplyComment
              : handleAddComment
          }
          className="px-4 py-2 bg-customGreen text-white rounded-full hover:bg-green-950 disabled:opacity-50"
          disabled={loading}
        >
          <Send size={22} />
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
        </button>

        {/* Cancel Button (Only shows in Edit or Reply mode) */}
        {(editingComment || replyingTo) && (
          <button
            onClick={handleCancel}
            className="px-3 py-2 bg-red-500 text-white rounded-full hover:bg-red-700 ml-2"
          >
            <XCircle size={22} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Comments;
