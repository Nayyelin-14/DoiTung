import Test from "@/Appcomponents/Learning/Test";
import { GetTest } from "@/EndPoints/quiz";
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom"; // Import useLocation
import { Loader2 } from "lucide-react"; // Import the Loader2 icon from Lucide React
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setTimeLeft } from "@/store/Slices/testSlice";

const AnswerTest = () => {
  const { courseID } = useParams(); // Get courseID from the URL
  const { testID } = useParams();
  const { userID } = useParams();
  const location = useLocation(); // Access the location object
  const [Quiz, setQuiz] = useState(null); // Initialize as null instead of an empty object
  const [loading, setLoading] = useState(true); // Add a loading state
  const [progress, setProgress] = useState(location.state?.progress || 0); // Access progress from location.state

  console.log(progress); // Log progress to verify

  const fetchTest = async () => {
    if (!courseID) return;
    setLoading(true); // Set loading to true when fetching starts
    try {
      const response = await GetTest(courseID);
      console.log(response);
      if (response.success) {
        setQuiz(response.finalTest[0]);
      }
    } catch (error) {
      console.error("Error fetching test:", error);
    } finally {
      setLoading(false); // Set loading to false when fetching is done
    }
  };

  useEffect(() => {
    fetchTest();
  }, [courseID, testID]);

  // Render a loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />{" "}
      </div>
    );
  }

  // Render the Test component only when Quiz is available
  return (
    <div>
      {Quiz ? (
        <Test Quiz={Quiz} user={userID} ID={testID} progress={progress} courseID={courseID} />
      ) : (
        <div className="flex justify-center items-center h-screen">
          <p>No test data available.</p>
        </div>
      )}
    </div>
  );
};

export default AnswerTest;
