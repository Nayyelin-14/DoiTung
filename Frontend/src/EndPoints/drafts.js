import { axiosInstance } from "@/apicalls/axiosInstance";

export const getAllCourses = async () => {
  try {
    const response = await axiosInstance.get("/getAllCourses");

    return response.data;
  } catch (err) {
    return err.response.data;
  }
};
export const saveDraft = async (userID, courseID) => {
  try {
    const response = await axiosInstance.post(
      `/savedraft/${userID}/${courseID}`
    );

    return response.data;
  } catch (error) {
    return error;
  }
};

export const saveAsComplete = async (userID, courseID) => {
  try {
    const response = await axiosInstance.post(
      `/saveCompleted/${userID}/${courseID}`
    );

    return response.data;
  } catch (error) {
    return error;
  }
};

export const getOldCourse = async (courseID, userID) => {
  console.log(courseID, userID);
  try {
    const response = await axiosInstance.get(
      `/getOldCourse/${courseID}/${userID}`
    );

    return response.data;
  } catch (error) {
    return error;
  }
};
