import { Button } from "@/components/ui/button";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const AuthHeader = ({ label_1, label_2, herf_1, herf_2 }) => {
  const location = useLocation();

  return (
    <div className="flex justify-center max-w-full gap-20 mx-auto items-center mt-3 ">
      <NavLink
        to={herf_1}
        className="relative text-[14px] w-[100px] text-center text-black font-bold"
      >
        {label_1}
        {location.pathname === herf_1 && (
          <div className="absolute bottom-[-15px] left-0 w-full h-[2px] bg-black rounded-lg" />
        )}
      </NavLink>

      <NavLink
        to={herf_2}
        className="relative text-[14px] w-[100px] text-center text-black font-bold"
      >
        {label_2}
        {location.pathname === herf_2 && (
          <div className="absolute bottom-[-15px] left-0 w-full h-[2px] bg-black rounded-lg" />
        )}
      </NavLink>
    </div>
  );
};

export default AuthHeader;
