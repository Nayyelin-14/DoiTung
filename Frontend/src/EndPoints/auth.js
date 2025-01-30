import { axiosInstance } from "../apicalls/axiosInstance";

//register new acc and send data to server
export const registerUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/auth/register", payload);

    return response.data;
  } catch (error) {
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
export const VerifyEmail = async (token) => {
  console.log(token);

  try {
    const response = await axiosInstance.post(
      `/auth/account_verification/${token}`
    );

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

export const OauthLogin = async (code) => {
  try {
    const response = await axiosInstance.post(`/auth/google?code=${code}`);

    return response.data;
  } catch (error) {
    // console.log(error.response.data);
    return error.response.data;
  }
};

// Edit user profile (username, profile picture, and password change)
export const editUserProfile = async (payload, token) => {
  try {
    const response = await axiosInstance.put("/auth/edit-profile", payload, {
      headers: {
        Authorization: `Bearer ${token}`, // Send JWT token in header for authentication
      },
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
