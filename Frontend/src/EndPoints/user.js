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
