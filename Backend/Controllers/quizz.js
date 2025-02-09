const db = require("../db/db");
const { eq, and } = require("drizzle-orm");
const { allcourses, modules, users, quizzes, tests, questions, user_attempts } = require("../db");

exports.createQuiz = async (req, res) => {
    const { title, moduleID } = req.body;
    try {
        // Insert the quiz
        await db.insert(quizzes).values({ title, moduleID });

        const allQuizzes = await db
            .select()
            .from(quizzes)
            .where(eq(quizzes.moduleID, moduleID))
            .orderBy(quizzes.createdAt, "desc"); 

        res.json({ success: true, quizzes: allQuizzes, message: "Quiz Created Successfully!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while adding Quiz",
        });
    }
};

exports.createTests = async (req, res) => {
    const { title, courseID } = req.body;
    try {
        const newTest = await db.insert(tests).values({ title, courseID });
        res.json({ success: true, test: newTest });   
    } catch (error) {
        console.error(error);
        return res.status(500).json({
          isSuccess: false,
          message: "An error occurred while adding Question",
        });
    }

}

exports.deleteQuiz = async (req, res) => {
    const { quizID, moduleID } = req.params;

    try {
        // Check if quiz exists
        const quizToDelete = await db.select().from(quizzes).where(eq(quizzes.quiz_id, quizID));
        if (!quizToDelete.length) {
            return res.status(404).json({ success: false, message: "Quiz not found" });
        }

        // Delete the quiz
        await db.delete(quizzes).where(eq(quizzes.quiz_id, quizID));

        const updatedQuizzes = await db
            .select()
            .from(quizzes)
            .where(eq(quizzes.moduleID, moduleID))
            .orderBy(quizzes.createdAt, "asc"); 

        res.json({ success: true, quizzes: updatedQuizzes, message: "Quiz Deleted Successfully!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the quiz",
        });
    }
};


exports.createQuestion = async (req, res) => {
    const { quizID, testID, question_text, options, correctOption } = req.body;

    if (!quizID && !testID) {
        return res.status(400).json({ success: false, message: "Provide either quizID or testID" });
      }

    try {
        const question = await db.insert(questions)
        .values({
          quizID,
          testID,
          question_text: question_text,
          options: JSON.stringify(options),
          correctOption: correctOption,
        });

        res.status(201).json({
            success: true, 
            question,
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
          isSuccess: false,
          message: "An error occurred while adding Question",
        });
    }    
}

exports.getQuizzesByModule = async (req, res) => {
    const { moduleID } = req.params; 

    try {
        const quizzesList = await db
            .select()
            .from(quizzes)
            .where(eq(quizzes.moduleID, moduleID))
            .orderBy(quizzes.createdAt, "asc");

        if (quizzesList.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No quizzes found for this module",
            });
        }

        res.json({ success: true, quizzes: quizzesList });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching quizzes",
        });
    }
};

exports.getQuizQuestions= async (req, res) => {
    const { ID } = req.params;
    try {
        const quizQuestions = await db.select().from(questions).where(eq(questions.quizID, ID));

        quizQuestions.forEach(q => {
            q.options = JSON.parse(q.options); // Convert JSON string back to array
          });
          
          console.log(quizQuestions);

        res.status(200).json({
            success:true,
            quizQuestions,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
          isSuccess: false,
          message: "An error occurred fetching questions",
        });
    }    
  }

