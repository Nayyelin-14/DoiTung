import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import verify from "../Images/verify.jpg";
import { Button } from "@/components/ui/button";

const VerificationPage = () => {
  const [isloading, setIsloading] = useState(false);

  const handleVerifyClick = () => {
    setIsloading(true); // Simulate loading state
    setTimeout(() => {
      setIsloading(false); // Simulate email verification completion
      window.location.href = "https://mail.google.com"; // Open the mail link
    }, 2000); // Simulate loading for 2 seconds
  };

  return (
    <div className="relative min-h-screen">
      <Card className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center bg-pale">
        <CardHeader>
          <img src={verify} alt="Verify" />
        </CardHeader>
        <CardContent className="my-4 font-bold text-2xl">
          Verify Your Email
        </CardContent>
        <hr className="w-10 bg-gray-900 h-1" />
        <CardFooter>
          <p className="text-gray-500 text-center text-sm w-[440px] my-7">
            Thanks for signing up for the Doi-Tung E-learning website. Please
            click the button below to verify your email for further process.
          </p>
        </CardFooter>
        <Button
          className="bg-tealDark h-10 w-48 items-center font-bold text-white hover:bg-tealDark/50"
          onClick={handleVerifyClick}
          disabled={isloading} // Disable button when loading
        >
          {isloading ? "Loading..." : "VERIFY EMAIL"}
        </Button>
      </Card>
    </div>
  );
};

export default VerificationPage;
