import { axiosInstance } from "@/apicalls/axiosInstance";

export const dataCount = async () => {
  try {
    const response = await axiosInstance.get("/totalDatas");
    return response.data;
  } catch (error) {
    return error;
  }
};

export const enrollmentdata = async () => {
  try {
    const response = await axiosInstance.get("/enrollmentData");
    return response.data;
  } catch (error) {
    return error;
  }
};
