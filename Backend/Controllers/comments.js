const db = require("../db/db");
const { eq, and } = require("drizzle-orm");
const { comments, lessons, users } = require("../db");

exports.addComment = async (req, res) =>{

    const { lesson_id, user_id, comment_text } = req.body;

    try {
        const lessonExists = await db
        .select()
        .from(lessons)
        .where(eq(lessons.lesson_id, lesson_id));

        if (lessonExists.length === 0) {
            return res.status(404).json({
              isSuccess: false,
              message: "Lesson not found",
            });
          }

        const userExists = await db
          .select()
          .from(users)
          .where(eq(users.user_id, user_id));
    
        if (userExists.length === 0) {
          return res.status(404).json({
            isSuccess: false,
            message: "User not found",
          });
        }

        const newComment = await db.insert(comments).values({
            lesson_id,
            user_id,
            comment_text,
          });

          req.io.emit(`comment-update-${lesson_id}`, newComment);   //add Socket
      
          return res.status(201).json({
            isSuccess: true,
            message: "Comment added successfully",
            comment: newComment,
          });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
          isSuccess: false,
          message: "An error occurred while adding the comment",
        });
    }
}

exports.getLessonComments = async (req, res) => {
    const { lesson_id } = req.params;
    
    console.log(lesson_id);
    if (!lesson_id) {
        return res.status(400).json({
            isSuccess: false,
            message: "Lesson ID is required",
        });
    }

    try {
        const lessonComments = await db
            .select({
                comment_id: comments.comment_id,
                lesson_id: comments.lesson_id,
                user_id: comments.user_id,
                comment_text: comments.comment_text,
                createdAt: comments.createdAt,
                user_name: users.user_name,
                user_profileImage: users.user_profileImage, 
            })
            .from(comments)
            .leftJoin(users, eq(comments.user_id, users.user_id))
            .where(eq(comments.lesson_id, String(lesson_id))); // Ensure correct type

        if (!lessonComments || lessonComments.length === 0) {
            return res.status(404).json({
                isSuccess: false,
                message: "No comments found for this lesson",
            });
        }

        return res.status(200).json({
            isSuccess: true,
            comments: lessonComments,
        });
    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({
            isSuccess: false,
            message: "An error occurred while fetching comments",
        });
    }
};

exports.deleteComment = async (req, res) => {
    const { comment_id } = req.params;
    const { user_id } = req.body; // Ensure the user requesting deletion is the owner of the comment
  
    try {
      // Check if the comment exists and belongs to the user
      const comment = await db
        .select()
        .from(comments)
        .where(eq(comments.comment_id, comment_id));
  
      if (comment.length === 0) {
        return res.status(404).json({
          isSuccess: false,
          message: "Comment not found",
        });
      }
  
      if (comment[0].user_id !== user_id) {
        return res.status(403).json({
          isSuccess: false,
          message: "You are not authorized to delete this comment",
        });
      }
  
      // Delete the comment
      await db.delete(comments).where(eq(comments.comment_id, comment_id));

      req.io.emit("comment-delete", { comment_id }); //Add socket
  
      return res.status(200).json({
        isSuccess: true,
        message: "Comment deleted successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        isSuccess: false,
        message: "An error occurred while deleting the comment",
      });
    }
  };

exports.editComment = async (req,res) => {
  const { comment_id, user_id, comment_text } = req.body;

  try {

    const userExists = await db
      .select()
      .from(users)
      .where(eq(users.user_id, user_id));

    if (userExists.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        message: "User not found",
      });
    }

    const commentExists = await db
      .select()
      .from(comments)
      .where(eq(comments.comment_id, comment_id));
    
    if (commentExists.length === 0){
      return res.status(404).json({
        isSuccess: false,
        message: "Comment not found",
      });
    }
    
    const newComment = await db.update(comments)
    .set({ comment_text })
    .where(and(eq(comments.comment_id, comment_id), eq(comments.user_id, user_id)));
    console.log(newComment);

    req.io.emit("comment-edit", { newComment });    //add socket

    return res.status(201).json({
      isSuccess: true,
      message: "Comment Edited successfully",
      comment: newComment,
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      isSuccess: false,
      message: "An error occurred while adding the comment",
    });
  }
}