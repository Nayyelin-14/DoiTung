import { axiosInstance } from "../apicalls/axiosInstance";

//register new acc and send data to server
export const registerUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/auth/register", payload);

    return response.data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

export const LoginUser = async (payload) => {
  console.log(payload);

  try {
    const response = await axiosInstance.post("/auth/login", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const CheckUser = async () => {
  try {
    const response = await axiosInstance.get("/auth/getCurrentUser");

    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

// Edit user profile (username, profile picture, and password change)
export const editUserProfile = async (payload, token) => {
  try {
    console.log(token);
    const response = await axiosInstance.put("/auth/edit-profile", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const logoutaction = async () => {
  try {
    const response = await axiosInstance.post(
      "/auth/logoutaction",

      {
        withCredentials: true, // 🔥 important for cookies
      }
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const adminsLogin = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/auth/adminloginaction",
      payload
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};
