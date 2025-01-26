import { axiosInstance } from "@/apicalls/axiosInstance";

export const getallusers = async () => {
  try {
    const response = await axiosInstance.get("/getallusers");
    return response.data;
  } catch (error) {
    return error;
  }
};
