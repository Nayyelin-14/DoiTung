import React, { useState, useEffect, useCallback } from "react";
import {
  GenerateCertificate,
  GetQuestions,
  SubmitTestAnswers,
  StartTest,
} from "@/EndPoints/quiz";
import { toast } from "sonner";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useSelector, useDispatch } from "react-redux";
import { CircleAlert, LoaderCircle } from "lucide-react";
import { startTest, stopTest, setTimeLeft } from "../../store/Slices/testSlice";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Test = ({ Quiz, user, ID, progress, courseID, attemptCount }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [reviewed, setReviewed] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState("");
  const [remainingAttempts, setRemainingAttempts] = useState(0);
  const { testStarted, timeLeft, startTime } = useSelector(
    (state) => state.test
  );

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

  useEffect(() => {
    if (testStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        const newTimeLeft = Math.max(0, timeLeft - 1); //
        dispatch(setTimeLeft(newTimeLeft)); // Update timeLeft only when necessary
      }, 1000);

      return () => clearInterval(timer);
    } else if (testStarted && timeLeft === 0 && !submitted) {
      toast.warning("Time is up! Auto-submitting your test...");
      handleSubmit();
    }
  }, [testStarted, timeLeft, submitted, dispatch, startTime]); //

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

  const handleStartTest = async () => {
    try {
      const payload = {
        userID: user,
        testID: ID,
        courseID: courseID,
        timeLimit: timeLeft, // Time limit in minutes
      };
      const response = await StartTest(payload); // Call the StartTest API
      if (response.success) {
        toast.success("Test started!");
      } else {
        toast.error("Failed to start the test.");
      }
    } catch (error) {
      toast.error("Error starting the test.");
    }

    dispatch(startTest(timeLeft * 60)); //
  };
  const handleStopTest = async () => {
    dispatch(stopTest());
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
        testID: ID,
        answers: formattedAnswers,
      };

      const response = await SubmitTestAnswers(payload);

      if (response.success) {
        setScore(response.score);
        setRemainingAttempts(response.remainingAttempts);
        toast.success(response.message);
        setSubmitted(true);
        setAnswers({});
        dispatch(stopTest());
      }

      if (response.score >= 70) {
        const certiPayload = {
          userID: user,
          testID: ID,
        };
        const certiResponse = await GenerateCertificate(certiPayload);

        toast.success(certiResponse.message);
        setCertificate(certiResponse.certificate_url);
      }
    } catch (error) {
      toast.error("Failed to submit test");
    } finally {
      setLoading(false); // Ensure loading is always turned off
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex w-[85%] mx-auto lg:h-auto mb-8 py-8 my-10 items-center justify-center">
      {testStarted ? (
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
            {questions.length > 0 ? (
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
                <div className="flex flex-col" key={idx}>
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
        <div className="w-full sm:max-w-[60%] md:p-12 mx-auto bg-white flex flex-col items-center my-auto justify-center md:shadow-lg rounded-xl">
          <h1 className="text-2xl font-bold py-4 text-center">{Quiz.title}</h1>

          {submitted ? (
            <div className="flex flex-col text-base md:text-lg text-center py-8">
              {score >= 70 ? (
                <>
                  <DotLottieReact
                    src="https://lottie.host/4830a994-7871-4536-aac1-521adafd9cd8/iGC0s3ymaZ.lottie"
                    loop
                    autoplay
                  />
                  <p className="font-semibold my-2 text-base">
                    Congratulations! You've passed the test. Certificate of
                    Completion will be generated.
                  </p>
                  <div className="py-2">
                    {certificate ? (
                      <>
                        <a
                          href={certificate}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white w-full"
                        >
                          <Button type="submit" disabled={loading}>
                            {loading ? (
                              <>
                                <LoaderCircle className="animate-spin" />
                                Generating Certificate
                              </>
                            ) : (
                              "View Certificate"
                            )}
                          </Button>
                        </a>
                      </>
                    ) : (
                      <>
                        <Button type="submit" disabled={loading}>
                          <>
                            <LoaderCircle className="animate-spin" />
                            Generating Certificate
                          </>
                        </Button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <h2 className="font-semibold my-4">
                  Sorry, you failed! Revise the Lessons and Try again.
                </h2>
              )}
              <p className="font-bold my-2 text-base">Your Score: {score}%</p>
              <p className="font-bold my-4 text-base">
                Remaining Attempts: {remainingAttempts}
              </p>
              {remainingAttempts <= 0 && <></>}
            </div>
          ) : progress >= 100.0 ? (
            <div className="flex flex-col items-center justify-center text-center gap-2">
              <p className="text-lg">
                You'll be answering{" "}
                <span className="font-bold">{questions.length}</span> questions
                in this Test.
              </p>
              <p className="text-lg">
                To pass and earn a certification, you need at least{" "}
                <span className="font-bold">70%</span>. Stay focused—good luck!
              </p>
              <div className="flex flex-row justify-between p-4 border-2 border-gray-200 rounded-lg mb-4 gap-2">
                <CircleAlert className="w-6 h-6 flex-shrink-0 text-red-500" />
                <p className="text-sm">
                  {" "}
                  This test has a time limit of{" "}
                  <span className="font-bold">{Math.floor(timeLeft)}</span>{" "}
                  minutes. If time runs out, your answers will be automatically
                  submitted. Make sure to manage your time wisely!
                </p>
              </div>
              <button
                className={`px-4 py-2 text-white rounded-lg w-[300px] ${
                  attemptCount >= 3
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-customGreen hover:bg-green-900"
                }`}
                onClick={handleStartTest}
                disabled={attemptCount >= 3}
              >
                {attemptCount >= 3 ? "Attempt Limit Reached" : "Start Test"}
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
              navigate(`/user/course/${user}/${courseID}`);
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
