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
