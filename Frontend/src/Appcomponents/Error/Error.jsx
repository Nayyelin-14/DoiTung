import React from "react";
import { Button } from "@/components/ui/button";
import { IoIosReturnLeft } from "react-icons/io";
import { useNavigate } from "react-router-dom";
const Error = () => {
  const navigate = useNavigate();
  const goback = () => {
    navigate("/auth/register");
  };
  return (
    <div>
      <h1 className="text-3xl">404 | Page Not Found!!!</h1>

      <div className="my-7 text-right">
        <Button className="text-black text-md p-2 hover:underline font-bold border bg-white hover:bg-black/30 border-black">
          <div className="flex items-center gap-2" onClick={() => goback()}>
            Go back <IoIosReturnLeft className="font-bold " size={24} />
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Error;
