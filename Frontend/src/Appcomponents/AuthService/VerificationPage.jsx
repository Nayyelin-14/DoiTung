import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import verify from "../Images/verify.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
    <div>
      <Card className="  w-[600px] h-[600px] mx-auto my-14 flex flex-col items-center justify-center bg-pale">
        <CardHeader>
          <img src={verify} alt="Verify" />
        </CardHeader>
        <CardContent className=" font-bold text-2xl">
          Verify Your Email
        </CardContent>
        <hr className="w-10 bg-gray-900 h-1" />
        <CardFooter>
          <p className="text-gray-500 text-center text-sm w-[440px] my-3">
            Thanks for signing up for the Doi-Tung E-learning website. Please
            click the button below to verify your email for further process.
          </p>
        </CardFooter>
        <Button
          className=" rounded-lg items-center font-bold text-white hover:bg-primary/70"
          onClick={handleVerifyClick}
          disabled={isloading} // Disable button when loading
        >
          {isloading ? "Loading..." : "VERIFY EMAIL"}
          <ArrowRight size={24} />
        </Button>
      </Card>
    </div>
  );
};

export default VerificationPage;
