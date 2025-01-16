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
    console.log(response);
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
    console.log(response);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const CheckUser = async () => {
  try {
    const response = await axiosInstance.get("/auth/getCurrentUser");
    console.log(response);
    return response.data;
  } catch (err) {
    console.log(err);
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
