const db = require("../db/db");
const { eq, avg } = require("drizzle-orm");
const { allcourses, users, course_reviews } = require("../db");

exports.addCourseReview = async (req, res) => {
    try {
      const { course_id, user_id, rating, review_text } = req.body;

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

    const courseExists = await db.select().from(allcourses).where(eq(allcourses.course_id, course_id));
    if (courseExists.length === 0){
        return res.status(404).json({
            isSuccess: false,
            message: "Course not found!",
        });
    }  

    const newReview = await db.insert(course_reviews).values({
        course_id,
        user_id,
        review_text,
        rating,
    });
  
      // Recalculate the average rating
      const [{ avgRating }] = await db
        .select({ avgRating: avg(course_reviews.rating) })
        .from(course_reviews)
        .where({ course_id });
  
      // Update the course's rating
      await db.update(allcourses).set({ rating: avgRating }).where({ course_id });
  
      res.status(201).json({isSuccess:true, message: "Thank you for your Feedback!"});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

exports.getCourseReviews = async (req, res) => {
    const {course_id} = req.params;
    console.log(course_id);
    if(!course_id){
        return res.status(400).json({
            isSuccess: false,
            message: "Course ID is required!"
        });
    }

    try {
        const reviews = await db.selectDistinct({
            review_id: course_reviews.review_id,
            review_text: course_reviews.review_text,
            user_id: course_reviews.user_id,
            createdAt: course_reviews.createdAt,
            user_name: users.user_name,
            user_profileImage: users.user_profileImage,
            rating: course_reviews.rating
        })
        .from(course_reviews)
        .leftJoin(users, eq(course_reviews.user_id, users.user_id))
        .where(eq(course_reviews.course_id, course_id));

        if(!reviews || reviews.length === 0){
            return res.status(404).json({
                isSuccess: false,
                message: "No reviews found for this Course",
            });
        }

        console.log(reviews);

        return res.status(200).json({
            isSuccess: true,
            reviews: reviews,
        });

    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({
            isSuccess: false,
            message: "An error occurred while fetching comments",
        });
    }
  };
