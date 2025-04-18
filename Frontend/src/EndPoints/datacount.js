import { axiosInstance } from "@/apicalls/axiosInstance";

export const dataCount = async () => {
  try {
    const response = await axiosInstance.get("/totalDatas");
    return response.data;
  } catch (error) {
    return error;
  }
};
