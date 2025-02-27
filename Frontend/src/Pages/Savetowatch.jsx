import Watchlater from "@/Appcomponents/Savecourses/Watchlater";
import { getsaves } from "@/EndPoints/courses";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { OrbitProgress } from "react-loading-indicators";

const Savetowatch = () => {
  const [savedCourses, setSavedcourse] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const params = useParams();

  const userID = params.userid;

  const save_courses = async (userID) => {
    if (!userID) return;
    try {
      setIsloading(true);
      const response = await getsaves(userID);

      if (response.isSuccess) {
        setSavedcourse(response.savecourses);
      }
      if (!response.isSuccess) {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsloading(false);
    }
  };
  useEffect(() => {
    save_courses(userID);
  }, []);
  return (
    <div className="  max-w-5xl mx-auto p-2">
      {isloading ? (
        <div className="flex items-center justify-center h-screen">
          <OrbitProgress color="#32cd32" size="medium" text="" textColor="" />;
        </div>
      ) : (
        <Watchlater
          savedCourses={savedCourses}
          setSavedcourse={setSavedcourse}
        />
      )}
    </div>
  );
};

export default Savetowatch;
