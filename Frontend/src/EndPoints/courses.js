import { axiosInstance } from "../apicalls/axiosInstance";

export const getAllCourses = async () => {
  try {
    const response = await axiosInstance.get("/get_AllCourses");
    console.log(response);
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export const get_PopularCourses = async () => {
  try {
    const response = await axiosInstance.get("/get_PopularCourses");
    //     console.log(response);
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export const Course_overview = async (courseId) => {
  try {
    const response = await axiosInstance.get(
      `/explore_courses/overview/${courseId}`
    );

    return response.data;
  } catch (err) {
    return err.response.data;
  }
};
export const CreatNewCourse = async (formdata) => {
  console.log(formdata);
  try {
    const response = await axiosInstance.post("/create_course", formdata);
    console.log(response);
    return response.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};
