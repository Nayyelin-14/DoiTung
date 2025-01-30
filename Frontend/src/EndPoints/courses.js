import { axiosInstance } from "../apicalls/axiosInstance";

export const getCourses = async () => {
  try {
    const response = await axiosInstance.get("/get_Courses");

    return response.data;
  } catch (err) {
    return err.response.data;
  }
};
export const getAllModules = async (courseID) => {
  try {
    const response = await axiosInstance.get(`/get_AllModules/${courseID}`);

    return response.data;
  } catch (err) {
    return err.response.data;
  }
};
export const getAllLessons = async (courseID, moduleID) => {
  try {
    const response = await axiosInstance.get(
      `/get_AllLessons/${courseID}/${moduleID}}`
    );

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
  try {
    const response = await axiosInstance.post("/create_course", formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response);
    return response.data;
  } catch (err) {
   
    return err.response.data;
  }
};

export const CreatNewModule = async (formdata) => {
  try {
    const response = await axiosInstance.post("/create_module", formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export const CreateNewLesson = async (formdata) => {
  try {
    const response = await axiosInstance.post("/create_lesson", formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export const removeLesson = async (lessonID, moduleID) => {
  try {
    const response = await axiosInstance.post(
      `/removelesson/${lessonID}/${moduleID}`
    );

    return response.data;
  } catch (err) {
    return err.response.data;
  }
};
