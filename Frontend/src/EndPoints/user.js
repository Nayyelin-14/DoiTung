import { axiosInstance } from "@/apicalls/axiosInstance";

export const getallusers = async () => {
  try {
    const response = await axiosInstance.get("/getallusers");
    return response.data;
  } catch (error) {
    return error;
  }
};

export const twostepEnable = async (payload) => {
  try {
    const response = await axiosInstance.post(`/enableTwostep`, payload);

    return response.data;
  } catch (error) {
    return error;
  }
};

export const CourseEnrollment = async (userID, courseID) => {
  try {
    const response = await axiosInstance.post(
      `/CourseEnrollment/${userID}/${courseID}`
    );

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const CheckEnrollment = async (userID, courseID) => {
  try {
    const response = await axiosInstance.get(
      `/CheckEnrollment/${userID}/${courseID}`
    );

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const CourseToLearn = async (userID, courseID) => {
  try {
    const response = await axiosInstance.get(
      `/fetchcourse/${userID}/${courseID}`
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

export const GetEnrolledCourses = async (userID) => {
  try {
    const response = await axiosInstance.get(`/enrolledCourses/${userID}`);

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const AddComment = async (payload) => {
  try {
    const response = await axiosInstance.post("/addComment", payload);

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const EditComment = async (payload) => {
  try {
    const response = await axiosInstance.put("/editComment", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const GetComments = async (lesson_id) => {
  try {
    const response = await axiosInstance.get(`/getComments/${lesson_id}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const DeleteComment = async (comment_id, payload) => {
  try {
    const response = await axiosInstance.post(
      `/deleteComment/${comment_id}`,
      payload
    );

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const userrestriction = async (userID) => {
  try {
    const response = await axiosInstance.post(`/restrictuser/${userID}`);

    return response.data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

export const Unrestrict_user = async (userID) => {
  try {
    const response = await axiosInstance.post(`/unrestrictUser/${userID}`);

    return response.data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

export const Accountremove = async (userID) => {
  try {
    const response = await axiosInstance.post(`/removeaccount/${userID}`);

    return response.data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

export const AddReviews = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/review/addCourseReview",
      payload
    );

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const GetReviews = async (course_id) => {
  try {
    const response = await axiosInstance(`review/getCourseReview/${course_id}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const GetAllReviews = async () => {
  try {
    const response = await axiosInstance("/review/getAllReviews");
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const CheckReview = async (user_id, course_id) => {
  try {
    const response = await axiosInstance(
      `review/checkReview/${user_id}/${course_id}`
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const EditReview = async (payload) => {
  try {
    const response = await axiosInstance.put("/review/editReview", payload);

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
export const getEnrollments = async () => {
  try {
    const response = await axiosInstance.get("/getAllenrollments");

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const GetCertificate = async (userId) => {
  try {
    const response = await axiosInstance.get(`/getCertificate/${userId}`);
    return response.data || []; // Ensure it always returns an array
  } catch (error) {
    console.error("Error fetching user scores:", error);
    return []; // Return an empty array on error
  }
};

export const SendReport = async (payload) => {
  try {
    const response = await axiosInstance.post("/sendreport", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const GetReports = async () => {
  try {
    const response = await axiosInstance.get("/getreports");
    return response.data || [];
  } catch (error) {
    console.error("Error fetching user scores:", error);
    return [];
  }
};

export const markReportAsRead = async (reportID) => {
  try {
    const response = await axiosInstance.post("/mark-report-read", {
      report_id: reportID,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
