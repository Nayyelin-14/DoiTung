import { axiosInstance } from "../apicalls/axiosInstance";

export const getAllCourses = async () => {
  try {
    const response = await axiosInstance.get("/get_AllCourses");

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
  console.log(courseID, moduleID);
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
  console.log(formdata);
  try {
    const response = await axiosInstance.post("/create_course", formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

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
    console.log(response);
    return response.data;
  } catch (err) {
    console.log(err);
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
    console.log(response);
    return response.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};
