import Test from "@/Appcomponents/Learning/Test";
import { CheckCertificate, GetTest } from "@/EndPoints/quiz";
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom"; // Import useLocation
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"; // Import the Loader2 icon from Lucide React

const AnswerTest = () => {
  const { courseID } = useParams(); // Get courseID from the URL
  const { testID } = useParams();
  const { userID } = useParams();
  const location = useLocation(); // Access the location object
  const [Quiz, setQuiz] = useState(null); // Initialize as null instead of an empty object
  const [loading, setLoading] = useState(true); // Add a loading state
  const [progress, setProgress] = useState(location.state?.progress || 0); // Access progress from location.state
  const [attemptCount, setAttemptCount] = useState(0);
  const [certificate, setCertificate] = useState();

  console.log(progress); // Log progress to verify

  const fetchTest = async () => {
    if (!courseID) return;
    setLoading(true); // Set loading to true when fetching starts
    try {
      const response = await GetTest(courseID);
      console.log(response);
      if (response.success) {
        setQuiz(response.finalTest);
        setAttemptCount(response.attemptCount);
      }
    } catch (error) {
      console.error("Error fetching test:", error);
    } finally {
      setLoading(false); // Set loading to false when fetching is done
    }
  };

  const passCheck = async () => {
    try {
      const response = await CheckCertificate(courseID);
      console.log(response);
      if (response.success) {
        setCertificate(response.certificate[0]);
        console.log(certificate);
      }
    } catch (error) {
      console.error("Error checking Certificate");
    }
  };

  useEffect(() => {
    fetchTest();
    passCheck();
  }, [courseID, testID]);

  // Render a loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />{" "}
      </div>
    );
  }

  if (certificate) {
    return (
      <>
        <div className="min-h-[500px] flex items-center justify-center p-4">
          <div className="min-h-[250px] w-full max-w-md flex flex-col gap-6 md:gap-4 text-center items-center justify-center shadow-lg rounded-xl p-6 md:p-8">
            <h1 className="font-bold text-base md:text-lg">
              You have already got a certificate for this course. You can no
              longer answer the Test.
            </h1>
            <a
              href={certificate.certificate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button type="submit" className="w-full">
                View Certificate
              </Button>
            </a>
          </div>
        </div>
      </>
    );
  }

  // Render the Test component only when Quiz is available
  return (
    <div>
      {Quiz ? (
        <Test
          Quiz={Quiz}
          user={userID}
          ID={testID}
          progress={progress}
          courseID={courseID}
          attemptCount={attemptCount}
        />
      ) : (
        <div className="flex justify-center items-center h-screen">
          <p>No test data available.</p>
        </div>
      )}
    </div>
  );
};

export default AnswerTest;
