import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { OauthLogin } from "@/EndPoints/auth";
import { toast } from "sonner";
import { setUser } from "@/store/Slices/UserSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Providerlogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        const response = await OauthLogin(authResult.code);
        console.log(response);
        if (response.isSuccess) {
          toast.success(response.message);
          localStorage.setItem("token", response.token);
          dispatch(setUser(response.user));
          navigate("/");
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <div>
      <FcGoogle size={30} onClick={googleLogin} />
    </div>
  );
};

export default Providerlogin;
