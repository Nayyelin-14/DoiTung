import React, { useState, useEffect, useCallback } from "react";
import { GenerateCertificate, GetQuestions, SubmitTestAnswers } from "@/EndPoints/quiz";
import { toast } from "sonner";
import { CircleAlert } from "lucide-react";

const Test = ({ Quiz, user, setIsTest, setActiveQuiz, progress, ID }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [reviewed, setReviewed] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [startTest, setStartTest] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // Example: 10 minutes (600 seconds)
  const [remainingAttempts, setRemainingAttempts] = useState(0);
  const [title, setTitle] = useState("");
  const [testID, setTestID] = useState("");

  const fetchQuestions = useCallback(async () => {
    if (!ID) return;
    const response = await GetQuestions(ID);
    if (response.success) {
      setQuestions(
        response.quizQuestions.length > 0
          ? response.quizQuestions
          : response.testQuestions
      );
      setTitle(Quiz.title);
      setTimeLeft(Quiz.timeLimit * 60);
      setTestID(ID);
    }
  }, [ID]);

  useEffect(() => {
    if (ID) {
      fetchQuestions();
      setSubmitted(false);
      setAnswers({});
    }
  }, [fetchQuestions]);
  console.log(testID);

  // Timer logic: Auto-submit when time runs out
  useEffect(() => {
    if (startTest && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (startTest && timeLeft === 0 && !submitted) {
      toast.warning("Time is up! Auto-submitting your test...");
      handleSubmit();
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
    if (submitted) return; // Prevent multiple submissions

    const formattedAnswers = Object.keys(answers).map((questionId) => ({
      question_id: questionId,
      selectedOption: answers[questionId],
    }));

    try {
      const payload = {
        userID: user,
        testID: testID,
        answers: formattedAnswers,
      };
      console.log(payload);
      const response = await SubmitTestAnswers(payload);

      if (response.success) {
        setScore(response.score);
        setRemainingAttempts(response.remainingAttempts);
        toast.success("Test Submitted!");
        setSubmitted(true);
        setAnswers({});
        setCurrentQuestionIndex(0);
      }

      if(response.score >= 70){
        const certiPayload = {
          userID: user,
          testID: testID,
        };
        const certiResponse = await GenerateCertificate(certiPayload);
        console.log(certiResponse);
      }
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex w-[85%] mx-auto lg:h-[550px] mb-8 py-8 items-center justify-center">
      {startTest ? (
        <div className="w-full h-full flex flex-col lg:flex-row gap-4">
          {/* Question Panel */}
          <div className="flex-1 h-full pb-4">
            <div className="flex flex-row items-center justify-between p-4 bg-gray-600">
              <h1 className="text-xl text-white font-semibold ml-8">
                {Quiz.title}
              </h1>
              <span className="text-gray-300 mr-8">
                Total Questions: {questions.length}
              </span>
            </div>
            {submitted ? (
              <div className="flex flex-col text-base md:text-lg text-center py-8">
                {score >= 70 ? (
                  <h2 className="font-semibold my-4">
                    Congratulations! You've passed the test.
                  </h2>
                ) : (
                  <h2 className="font-semibold my-4">
                    Sorry, you failed! Revise the Lessons and Try again.
                  </h2>
                )}
                <h2 className="font-bold my-4">Your Score: {score}%</h2>
                <p className="font-bold my-4">
                  Remaining Attempts: {remainingAttempts}
                </p>
                {/* <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg mt-4"
                  onClick={() => setSubmitted(false)}
                >
                  Preview Attempts
                </button> */}
              </div>
            ) : questions.length > 0 ? (
              <div className="mt-4">
                <div className="h-[300px]">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg">
                      <span className="font-bold">
                        (Q{currentQuestionIndex + 1})
                      </span>{" "}
                      {currentQuestion.question_text}
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
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md w-[150px] hover:bg-yellow-600"
                      onClick={handleReview}
                    >
                      Mark for Review
                    </button>
                    <div className="flex flex-row gap-2">
                      <button
                        className="px-4 py-2 bg-gray-500 text-white rounded-l-3xl w-[100px] hover:bg-gray-600"
                        onClick={() =>
                          setCurrentQuestionIndex((prev) =>
                            Math.max(prev - 1, 0)
                          )
                        }
                        disabled={currentQuestionIndex === 0}
                      >
                        Prev
                      </button>
                      {currentQuestionIndex === questions.length - 1 ? (
                        <button className="px-4 py-2 bg-green-500 text-white rounded-r-3xl w-[100px] opacity-50 cursor-not-allowed">
                          Next
                        </button>
                      ) : (
                        <button
                          className="px-4 py-2 bg-customGreen text-white rounded-r-3xl w-[100px] hover:bg-green-900"
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
          <div className="w-full lg:w-1/4 rounded-b-xl shadow-md">
            <div className="flex flex-col items-center justify-center">
              <div className="flex w-full bg-gray-600 text-white text-lg p-2 items-center justify-center">
                Time Left
              </div>
              <div className="flex flex-row gap-4 p-2">
                <div className="flex flex-col items-center justify-center">
                  <p className="text-2xl font-semibold">
                    {Math.floor(timeLeft / 60)}
                  </p>
                  <p className="text-gray-400">Minutes</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <p className="text-2xl font-semibold">
                    {String(timeLeft % 60).padStart(2, "0")}
                  </p>
                  <p className="text-gray-400">Seconds</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 my-2 bg-gray-600 text-[12px] py-2 text-white">
              <div className="flex flex-row px-6 items-center justify-normal gap-2">
                <div className="rounded-full w-[10px] h-[10px] bg-green-500"></div>
                <p>Answered</p>
              </div>
              <div className="flex flex-row px-6 items-center justify-normal gap-2">
                <div className="rounded-full w-[10px] h-[10px] bg-yellow-500"></div>
                <p>To Review</p>
              </div>
              <div className="flex flex-row px-6 items-center justify-normal gap-2">
                <div className="rounded-full w-[10px] h-[10px] bg-gray-200"></div>
                <p>Not Attempted</p>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 my-2 py-4 w-[90%] mx-auto">
              {questions.map((q, idx) => (
                <div className="flex flex-col">
                  {currentQuestionIndex === idx && (
                    <div className="bg-customGreen h-[5px] rounded-t-lg"></div>
                  )}

                  <button
                    key={q.question_id}
                    className={`w-full p-2 text-sm rounded-b-lg ${
                      answers[q.question_id]
                        ? "bg-green-500 text-white"
                        : "bg-gray-200"
                    } ${
                      reviewed[q.question_id] ? "bg-yellow-500 text-white" : ""
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
        <div className="w-full sm:max-w-[60%] md:p-12 mx-auto bg-white flex flex-col items-center justify-center md:shadow-lg rounded-xl">
          <h1 className="text-2xl font-bold py-4 text-center">{title}</h1>
          {progress >= 100.0 ? (
            <div className="flex flex-col items-center justify-center text-center gap-2">
              <p className="text-lg">
                You'll be answering{" "}
                <span className="font-bold">{questions.length}</span> questions
                in this Test.
              </p>
              <p className="text-lg">
                To pass and earn a certification, you need at least{" "}
                <span className="font-bold">50%</span>. Stay focused—good luck!
              </p>
              <div className="flex flex-row justify-between p-4 border-2 border-gray-200 rounded-lg mb-4 gap-2">
                <CircleAlert className="w-6 h-6 flex-shrink-0 text-red-500" />
                <p className="text-sm">
                  {" "}
                  This test has a time limit of{" "}
                  <span className="font-bold">
                    {Math.floor(timeLeft / 60)}
                  </span>{" "}
                  minutes. If time runs out, your answers will be automatically
                  submitted. Make sure to manage your time wisely!
                </p>
              </div>
              <button
                className="px-4 py-2 bg-customGreen text-white rounded-lg w-[300px] hover:bg-green-900"
                onClick={() => {
                  setStartTest(true);
                }}
              >
                Start Test
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-4 gap-4">
              <h2>
                "You need to complete <span className="font-bold">100% </span>of
                the lessons and quizzes before accessing the test. Keep
                learning—you're almost there!"
              </h2>
              <h2>
                Your Progress: <span className="font-bold">{progress}%</span>
              </h2>
            </div>
          )}
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-lg w-[300px] hover:bg-gray-900 my-4"
            onClick={() => {
              setIsTest((prev) => !prev);
              setActiveQuiz({});
            }}
          >
            Return To Course
          </button>
        </div>
      )}
    </div>
  );
};

export default Test;


  // Detect if the user switches tabs or navigates away
  // useEffect(() => {
  //   const handleVisibilityChange = () => {
  //     if (document.hidden) {
  //       toast.error("You left the test! Auto-submitting now...");
  //       handleSubmit();
  //     }
  //   };

  //   document.addEventListener("visibilitychange", handleVisibilityChange);

  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, []);