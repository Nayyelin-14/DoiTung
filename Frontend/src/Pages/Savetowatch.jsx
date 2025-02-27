import Watchlater from "@/Appcomponents/Savecourses/Watchlater";
import { getsaves } from "@/EndPoints/courses";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

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
          <DotLottieReact
            src="https://lottie.host/e7073be7-1449-46d2-b940-e475c4e7f789/WpvYCKo2BP.lottie"
            loop
            autoplay
          />
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
