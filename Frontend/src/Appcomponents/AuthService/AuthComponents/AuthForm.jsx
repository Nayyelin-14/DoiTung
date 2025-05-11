import { lazy } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import MLFL from "../../Images/MLFL.webp";

import Badge from "../../../layouts/Badge";

const LangSelector = lazy(() =>
  import("@/Appcomponents/Detector/LangSelector")
);
import { Link } from "react-router-dom";

const GreetingSection = lazy(() => import("./GreetingSection"));

const AuthForm = ({ children }) => {
  return (
    <section className="w-full h-[866px] md:h-screen relative">
      <div className="absolute w-full h-full top-0 left-0">
        <img
          src={MLFL}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex items-center justify-between p-4 md:p-0">
        <div className="relative z-10 mb-10">
          <Badge />
        </div>
        <div className="mt-0">
          <LangSelector />
        </div>
      </div>

      <div className="relative max-w-[90%] md:max-w-[80%] w-full mx-auto flex flex-col md:flex-row items-center justify-center z-10 gap-5 md:gap-10 mt-5 md:mt-0">
        {/* Hide GreetingSection on mobile */}
        <GreetingSection className="hidden md:block" />

        <div className="rounded-3xl w-full max-w-md h-auto md:h-[400px]">
          <Card className="rounded-2xl flex flex-col bg-opacity-90 h-full gap-5 bg-pale">
            <CardHeader>
              <h1 className="text-lg md:text-xl text-center font-semibold text-gray-800 mt-4">
                Welcome to Mae Fah Luang Foundation
              </h1>
            </CardHeader>
            <CardContent className="p-0 px-4 md:px-6">{children}</CardContent>
            <CardFooter className="flex items-end ml-auto">
              <Link
                to={"/auth/admins_login"}
                className="p-1 border-b-2 border-black"
              >
                Admin side
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AuthForm;
