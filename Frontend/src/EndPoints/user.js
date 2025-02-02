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
  console.log(payload);
  try {
    const response = await axiosInstance.post(`/enableTwostep`, payload);

    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
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
    console.log(userID, courseID);
    const response = await axiosInstance.get(
      `/CheckEnrollment/${userID}/${courseID}`
    );
    console.log(response);
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
    return error.response.data;
  }
};

export const GetEnrolledCourses = async (userID) => {
  try {
    const response = await axiosInstance.get(`/enrolledCourses/${userID}`);
    console.log(response);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export const AddComment = async (payload) => {
  try{
    const response = await axiosInstance.post("/addComment", payload);
    console.log(response);
    return response.data;

  } catch(error) {
    return error.response.data;
  }
}

export const GetComments = async (lesson_id) => {
  try{
    const response = await axiosInstance.get(`/getComments/${lesson_id}`);
    console.log(response);
    return response.data;
  }catch (error) {
    return error.response.data;
  }
}

export const DeleteComment = async (comment_id, payload) => {
  try{
    const response = await axiosInstance.post(`/deleteComment/${comment_id}`, payload);
    console.log(response);
    return response.data;
  }catch (error) {
    return error.response.data;
  }
}

export const userrestriction = async (userID) => {
  try {
    const response = await axiosInstance.post(`/restrictuser/${userID}`);

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const Unrestrict_user = async (userID) => {
  try {
    const response = await axiosInstance.post(`/unrestrictUser/${userID}`);

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const Accountremove = async (userID) => {
  try {
    const response = await axiosInstance.post(`/removeaccount/${userID}`);

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const AddReviews = async (payload) =>{
  try {
      const response = await axiosInstance.post("/review/addCourseReview", payload);
      console.log(response);
      return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export const GetReviews = async (course_id) =>{
  try {
    const response = await axiosInstance(`review/getCourseReview/${course_id}`);
    console.log(response);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}