import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { VerifyEmail } from "../../../EndPoints/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { IoIosReturnLeft } from "react-icons/io";
import DoiTung from "./DoiTung.png";

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  console.log(token);
  // Function to verify the token
  const verification = async (token) => {
    try {
      const response = await VerifyEmail(token);
      console.log(response);
      if (response.isSuccess) {
        setSuccess(response.message);
      } else {
        setError(response.message);
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Run verification on mount and introduce a delay before setting loading to false
  useEffect(() => {
    if (token) {
      const delay = setTimeout(() => {
        verification(token);
      }, 2000);

      return () => clearTimeout(delay);
    }
  }, [token]);

  return (
    <div className="my-10 lg:my-0 flex flex-col gap-10 md:flex-row h-[400px] lg:min-h-screen w-full">
      {/* Left Section for the Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center min-h-[500px] px-4 ">
        <Card className="w-full max-w-md flex items-center justify-center border-none ">
          {loading && (
            <div className="flex flex-col items-center gap-10">
              <div className="text-center p-8">
                <DotLottieReact
                  src="https://lottie.host/15a47fa5-ef23-4b36-beb0-a316f046c0d6/5FIZy4KUJ0.lottie"
                  loop
                  autoplay
                />
              </div>
              <div className="text-gray-500 text-xl text-center">
                Verifying your email, please wait...
              </div>
            </div>
          )}
          {success && !loading && !error && (
            <div className="flex flex-col">
              <div className="text-center p-8">
                <DotLottieReact
                  src="https://lottie.host/3ed2fdab-c424-46f7-92da-bcd7148c41a2/r9uaqV7GBf.lottie"
                  loop={false}
                  autoplay
                />
              </div>
              <div className="text-green-500 text-xl font-medium text-center">
                {success}
              </div>
              <div className="my-7 text-center">
                <Button className=" text-white hover:bg-gray-400 text-md p-2 font-bold">
                  <Link to={"/auth/login"} className="flex items-center gap-2">
                    Back to login
                  </Link>
                </Button>
              </div>
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center gap-14">
              <p className="text-red-600 text-3xl font-bold text-center">
                {error}!!!
              </p>
              <Button className="bg-destructive text-white p-2 text-lg rounded-md hover:bg-destructive/70 px-6">
                <Link
                  to={"/auth/register"}
                  className="flex items-center gap-2 font-bold"
                >
                  Back to register again
                </Link>
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Right Section for the Image */}
      <div className="w-full lg:w-1/2 hidden lg:flex items-center justify-center min-h-[500px]">
        <img
          src={DoiTung}
          alt="DoiTung"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default EmailVerification;
