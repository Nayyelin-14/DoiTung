import { axiosInstance } from "../apicalls/axiosInstance";

export const CreateQuiz = async (payload) => {
  try {
    const response = await axiosInstance.post("/quiz/createQuiz", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const DeleteQuiz = async (quizID, moduleID) => {
  try {
    const response = await axiosInstance.post(
      `/quiz/deleteQuiz/${quizID}/${moduleID}`
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const GetQuiz = async (moduleID) => {
  try {
    const response = await axiosInstance.get(`/quiz/getQuiz/${moduleID}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const CreateQuestion = async (payload) => {
  try {
    const response = await axiosInstance.post("/createQuestion", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const GetQuestions = async (ID) => {
  try {
    const response = await axiosInstance.get(`/getQuestions/${ID}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const EditQuestion = async (payload) => {
  console.log(payload);
  try {
    const response = await axiosInstance.put("/editQuestion", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const DeleteQuestion = async (questionID) => {
  try {
    const response = await axiosInstance.post(`/deleteQuestion/${questionID}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const CreateTest = async (payload) => {
  try {
    const response = await axiosInstance.post("/test/createTest", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const GetTest = async (courseID) => {
  try {
    const response = await axiosInstance.get(`/test/getTest/${courseID}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const StartTest = async (payload) => {
  try {
    const response = await axiosInstance.post("/startTest", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const CheckTestStatus = async (userID) => {
  try {
    const response = await axiosInstance.get(`/checkTestStatus/${userID}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const SubmitQuizAnswers = async (payload) => {
  try {
    const response = await axiosInstance.post("/submitQuizAnswers", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const SubmitTestAnswers = async (payload) => {
  try {
    const response = await axiosInstance.post("/submitTestAnswers", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const GetUserScores = async (userId) => {
  try {
    const response = await axiosInstance.get(`/getuserscores/${userId}`);
    return response.data || []; // Ensure it always returns an array
  } catch (error) {
    console.error("Error fetching user scores:", error);
    return []; // Return an empty array on error
  }
};

export const GenerateCertificate = async (payload) => {
  try {
    const response = await axiosInstance.post("/generate", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const CheckCertificate = async (courseID) => {
  try {
    const response = await axiosInstance.get(`/checkCertificate/${courseID}`);
    console.log(response);
    return response.data; // Ensure it always returns an array
  } catch (error) {
    return error?.response.data?.message; // Return an empty array on error
  }
};
