import React, { useState, useEffect, useCallback } from "react";
import { GetQuestions, SubmitAnswers } from "@/EndPoints/quiz";
import { toast } from "sonner";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { set } from "react-hook-form";

const Quizzes = ({ Quiz, user, startQuiz, setStartQuiz }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [preview, setPreview] = useState(false);

  const ID = Quiz?.quiz_id || Quiz?.test_id;

  const fetchQuestions = useCallback(async () => {
    if (!ID) return;
    const response = await GetQuestions(ID);
    if (response.success) {
      setQuestions(
        response.quizQuestions.length > 0
          ? response.quizQuestions
          : response.testQuestions
      );
    }
  }, [ID]);

  useEffect(() => {
    if (ID) {
      fetchQuestions();
      setSubmitted(false);
      setAnswers({});
      setCurrentQuestionIndex(0);
      setPreview(false);
    }
  }, [fetchQuestions]);

  const handleOptionSelect = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    const formattedAnswers = Object.keys(answers).map((questionId) => ({
      question_id: questionId,
      selectedOption: answers[questionId],
    }));

    if (window.confirm("Are you sure to Submit?")) {
      try {
        const payload = { userID: user, quizID: ID, answers: formattedAnswers };
        const response = await SubmitAnswers(payload);

        if (response.success) {
          setScore(response.score);
          toast.success("Quiz Submitted!");
          setSubmitted(true);
          // setAnswers({});
          setCurrentQuestionIndex(0);
        }
      } catch (error) {
        console.error("Error submitting answers:", error);
      }
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="w-full h-[550px] shadow-md rounded-lg my-auto">
      {startQuiz ? (
        <>
          <div className="flex flex-row items-center justify-between p-4 mt-4">
            <h1 className="text-xl font-semibold ml-8">{Quiz.title}</h1>
            <span className="text-gray-500 mr-8">
              Total Questions: {questions.length}
            </span>
          </div>
          <div className="p-6 max-w-[85%] mx-auto bg-white">
            {submitted ? (
              <div>
                <h2 className="text-xl font-bold mb-4">Your Score: {score}%</h2>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg mt-4"
                  onClick={() => {
                    setSubmitted(false);
                    setPreview(true);
                    console.log(answers);
                  }}
                >
                  Preview Attempts
                </button>
              </div>
            ) : questions.length > 0 ? (
              <div className="py-10">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">
                    {currentQuestion.question_text}
                  </h2>
                  <span className="text-gray-500">
                    ({currentQuestionIndex + 1}/{questions.length})
                  </span>
                </div>
                <ul className="my-4 grid grid-cols-2 gap-2">
                  {preview ? (
                    <>
                      {JSON.parse(currentQuestion.options).map(
                        (option, index) => {
                          const isSelected =
                            answers[currentQuestion.question_id] === option;
                          const isCorrect =
                            option === currentQuestion.correct_option;

                          return (
                            <li
                              key={index}
                              className={`p-3 border rounded-lg cursor-pointer 
                                ${
                                  isSelected
                                    ? isCorrect
                                      ? "bg-green-400 text-white"
                                      : "bg-red-500 text-white"
                                    : ""
                                }
                              `}
                            >
                              {option}
                            </li>
                          );
                        }
                      )}
                    </>
                  ) : (
                    <>
                      {JSON.parse(currentQuestion.options).map(
                        (option, index) => (
                          <li
                            key={index}
                            className={`p-3 border  rounded-lg cursor-pointer ${
                              answers[currentQuestion.question_id] === option
                                ? "bg-gray-700 text-white"
                                : ""
                            }`}
                            onClick={() =>
                              handleOptionSelect(
                                currentQuestion.question_id,
                                option
                              )
                            }
                          >
                            {option}
                          </li>
                        )
                      )}
                    </>
                  )}
                </ul>
                <div className="flex justify-between mt-4">
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded-xl w-[100px] hover:bg-gray-600"
                    onClick={() =>
                      setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
                    }
                    disabled={currentQuestionIndex === 0}
                  >
                    Prev
                  </button>
                  {currentQuestionIndex === questions.length - 1 ? (
                    <button
                      className="px-4 py-2 bg-green-500 text-white rounded-lg w-[100px] hover:bg-green-600"
                      onClick={
                        preview
                          ? () => {
                              setPreview(false);
                              setStartQuiz(false);
                            }
                          : handleSubmit
                      }
                      // If preview is true, close preview mode
                    >
                      {preview ? "Done" : "Submit"}
                    </button>
                  ) : (
                    <button
                      className="px-4 py-2 bg-customGreen text-white rounded-xl w-[100px] hover:bg-green-900"
                      onClick={() =>
                        setCurrentQuestionIndex((prev) =>
                          Math.min(prev + 1, questions.length - 1)
                        )
                      }
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p>Loading questions...</p>
            )}
          </div>
        </>
      ) : (
        <div className="max-w-[85%] mx-auto bg-white flex flex-col items-center justify-center">
          <h1 className="text-xl font-bold py-4 mt-4">{Quiz.title}</h1>
          <h2 className="text-lg">
            You'll be answering{" "}
            <span className="font-bold">{questions.length}</span> questions in
            this quiz. Ready to begin?
          </h2>
          <DotLottieReact
            src="https://lottie.host/286ae127-4b28-4a3e-b018-5508cf69538f/Fg0FFdWcPm.lottie"
            loop
            autoplay
            className="w-45 h-45"
          />

          <button
            className="px-4 py-2 bg-customGreen text-white rounded-lg w-[300px] hover:bg-green-900"
            onClick={() => {
              setStartQuiz(true);
            }}
          >
            Start Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default Quizzes;
