import { useState, useEffect } from "react";
import { GetComments, AddComment, DeleteComment } from "@/EndPoints/user";

const Comments = ({lessonID, userID, userName}) => {

    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      fetchComments();
    }, []);
  
    const fetchComments = async () => {
      const response = await GetComments(lessonID);
      if (response.isSuccess) {
        setComments(response.comments);
      }
    };
  
    const handleAddComment = async () => {
      if (!commentText.trim()) return;
      setLoading(true);
  
      const newComment = {
        lesson_id: lessonID,
        user_id: userID,
        comment_text: commentText,
      };
  
      const response = await AddComment(newComment);
      if (response.isSuccess) {
        setComments([...comments, { 
          comment_id: response.comment.comment_id, 
          user_name: userName, 
          comment_text: commentText 
        }]); // Update UI instantly
        setCommentText("");
      }
      setLoading(false);
    };
  
    const handleDeleteComment = async (commentID) => {
      const response = await DeleteComment(commentID, { user_id: userID });
      if (response.isSuccess) {
        setComments(comments.filter(comment => comment.comment_id !== commentID));
      }
    };
  
    return (
      <div className="w-full max-w-3xl mx-auto p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Comments</h2>
  
        {/* Input Field */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddComment}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
  
        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.comment_id} className="p-3 border rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">{comment.user_name}</p>
                  {comment.user_id === userID && (
                    <button
                      onClick={() => handleDeleteComment(comment.comment_id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-gray-700">{comment.comment_text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

export default Comments;