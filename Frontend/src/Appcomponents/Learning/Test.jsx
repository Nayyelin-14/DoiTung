import React, { useState, useEffect, useCallback } from "react";
import { GetQuestions, SubmitAnswers } from "@/EndPoints/quiz";
import { toast } from "sonner";

const Test = ({ Quiz, user, setIsTest, setActiveQuiz }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [reviewed, setReviewed] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [startTest, setStartTest] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // 30-minute timer
  const [remainingAttempts, setRemainingAttempts] = useState(0);

  const ID = Quiz?.quiz_id || Quiz?.test_id;
  console.log("rendered!!!!");

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
    }
  }, [fetchQuestions]);

  // Timer logic
  useEffect(() => {
    if (startTest && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [startTest, timeLeft]);

  const handleOptionSelect = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleReview = () => {
    setReviewed((prev) => ({
      ...prev,
      [questions[currentQuestionIndex].question_id]:
        !prev[questions[currentQuestionIndex].question_id],
    }));
  };

  const handleSubmit = async () => {
    if (window.confirm("Are you sure to Submit?")) {
      const formattedAnswers = Object.keys(answers).map((questionId) => ({
        question_id: questionId,
        selectedOption: answers[questionId],
      }));

      console.log(formattedAnswers);

      try {
        const payload = { userID: user, testID: ID, answers: formattedAnswers };
        const response = await SubmitAnswers(payload);

        if (response.success) {
          setScore(response.score);
          setRemainingAttempts(response.remainingAttempts);
          toast.success("Quiz Submitted!");
          setSubmitted(true);
          setAnswers({});
          setCurrentQuestionIndex(0);
        }
      } catch (error) {
        console.error("Error submitting answers:", error);
      }
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="w-[85%] mx-auto h-[600px] my-auto py-8">
      {startTest ? (
        <div className="flex flex-row">
          {/* Question Panel */}
          <div className="flex-1 pr-6 h-full">
            <div className="flex flex-row items-center justify-between p-4 bg-gray-600">
              <h1 className="text-xl text-white font-semibold ml-8">{Quiz.title}</h1>
              <span className="text-gray-300 mr-8">
                Total Questions: {questions.length}
              </span>
            </div>
            {submitted ? (
              <div>
                <h2 className="text-xl font-bold my-4">Your Score: {score}%</h2>
                <p className="text-xl font-bold my-4">Remaining Attempts: {remainingAttempts}</p>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg mt-4"
                  onClick={() => setSubmitted(false)}
                >
                  Preview Attempts
                </button>
              </div>
            ) : questions.length > 0 ? (
              <div className="mt-4">
                <div className="h-[300px]">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg">
                      <span className="font-bold">(Q{currentQuestionIndex + 1})</span> {currentQuestion.question_text}
                    </h2>
                    <span className="text-gray-500">
                      ({currentQuestionIndex + 1}/{questions.length})
                    </span>
                  </div>
                  <ul className="my-4 grid grid-cols-2 gap-2">
                    {JSON.parse(currentQuestion.options).map(
                      (option, index) => (
                        <li
                          key={index}
                          className={`p-3 border rounded-lg cursor-pointer ${
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
                  </ul>
                </div>
                {/* Buttons */}
                <div className="flex flex-col justify-between">
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
                    <button
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg w-[150px] hover:bg-yellow-600"
                      onClick={handleReview}
                    >
                      Mark for Review
                    </button>
                    {currentQuestionIndex === questions.length - 1 ? (
                      <button className="px-4 py-2 bg-green-500 text-white rounded-lg w-[100px] opacity-50 cursor-not-allowed">
                        Next
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
                  <button
                    className="mt-4 w-full bg-customGreen text-white p-2 rounded-lg"
                    onClick={handleSubmit}
                  >
                    Submit Test
                  </button>
                </div>
              </div>
            ) : (
              <p>Loading questions...</p>
            )}
          </div>

          {/* Sidebar Navigation */}
          <div className="w-1/4 rounded-b-xl shadow-md">
            <div className="flex flex-col items-center justify-center">
                <div className="flex w-full bg-gray-600 text-white text-lg p-2 items-center justify-center">
                      Time Left
                </div>
                <div className="flex flex-row gap-4 p-2">
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-2xl font-semibold">{Math.floor(timeLeft / 60)}</p>
                        <p className="text-gray-400">Minutes</p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-2xl font-semibold">{String(timeLeft % 60).padStart(2, "0")}</p>
                        <p className="text-gray-400">Seconds</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 my-2 bg-gray-600 text-[12px] py-2 text-white">
                <div className="flex flex-row items-center justify-center gap-2">
                    <div className="rounded-full w-[10px] h-[10px] bg-green-500"></div>
                    <p>Answered</p>
                </div>
                <div className="flex flex-row items-center justify-center gap-2">
                <div className="rounded-full w-[10px] h-[10px] bg-yellow-600"></div>
                <p>To Review</p>
                </div>
                <div className="flex flex-row items-center justify-center gap-2">
                <div className="rounded-full w-[10px] h-[10px] bg-gray-200"></div>
                <p>Not Attempted</p>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-2 my-2 w-[90%] mx-auto">
              {questions.map((q, idx) => (
                <div className="flex flex-col">
                    {currentQuestionIndex === idx && <div className="bg-customGreen h-[5px] rounded-t-lg">
                        </div>}
                    
                    <button
                      key={q.question_id}
                      className={`w-full p-2 text-sm rounded-b-lg ${
                        answers[q.question_id] ? "bg-green-500 text-white" : "bg-gray-200"
                      } ${
                        reviewed[q.question_id] ? "bg-yellow-600 text-white" : ""
                      }`}
                      onClick={() => setCurrentQuestionIndex(idx)}
                    >
                      {idx + 1}
                    </button>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      ) : (
        <div className="max-w-[85%] mx-auto bg-white flex flex-col items-center justify-center">
          <h1 className="text-xl font-bold py-4 mt-4">{Quiz.title}</h1>
          <h2 className="text-lg">
            You'll be answering{" "}
            <span className="font-bold">{questions.length}</span> questions in
            this quiz. Ready to begin?
          </h2>
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-lg w-[300px] hover:bg-gray-900 my-4"
            onClick={() => {
              setIsTest((prev)=>!prev);
              setActiveQuiz({});
            }}
          >
            Return To Course
          </button>
          <button
            className="px-4 py-2 bg-customGreen text-white rounded-lg w-[300px] hover:bg-green-900"
            onClick={() => {
              setStartTest(true);
            }}
          >
            Start Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default Test;
