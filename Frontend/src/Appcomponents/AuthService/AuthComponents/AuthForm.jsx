import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import Background from "../../Images/Background.png";

import Badge from "../../../layouts/Badge";
import TypingAnimation from "@/components/ui/typing-animation";
import LangSelector from "@/Appcomponents/Detector/LangSelector";
import { Link } from "react-router-dom";

const AuthForm = ({ children }) => {
  return (
    <div className="w-full h-[866px] relative ">
      <div className="absolute w-full h-full top-0 left-0">
        <img src={Background} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="flex items-center justify-between">
        <div className="relative z-10 mb-10">
          <Badge />
        </div>
        <div className="mt-0">
          <LangSelector />
        </div>
      </div>

      <div className="relative max-w-[80%] mx-auto flex  items-center justify-center z-10 gap-10 mt-0">
        <div className="hidden w-[45%] xl:w-[60%] lg:block flex-col items-center justify-center ">
          <div className="mb-10">
            <h2 className="font-semibold text-3xl xl:text-6xl  text-white">
              Mae Fah luang
            </h2>
            <h2 className="font-semibold text-4xl xl:text-6xl text-white">
              Foundation
            </h2>
          </div>
          <div className="  w-[80%]">
            <TypingAnimation
              className={`text-lg text-white font-semibold xl:text-xl`}
            >
              {"Let's build a better community with Mae Fah luang Foundation"}
            </TypingAnimation>
          </div>
        </div>

        <div className=" rounded-3xl w-[489px] h-[400px]">
          <Card className="rounded-2xl flex flex-col bg-opacity-90 h-full gap-5 bg-pale">
            <CardHeader className="">
              <p className="text-xl text-center font-semibold text-gray-800 mt-4">
                Welcome to Mae Fah luang Foundation
              </p>
            </CardHeader>
            <CardContent className="p-0 px-6">{children}</CardContent>
            <CardFooter className="flex items-end ml-auto">
              <Link
                to={"/auth/admins_login"}
                className="text-gray-600 font-semibold p-1 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out"
              >
                Admin side
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
