import React, { useEffect, useMemo, useState } from "react";
import Logo from "../Appcomponents/Images/mfllogo_2.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Clock, LogOutIcon, User2Icon, Users2Icon, Bell } from "lucide-react";
import { setUser } from "../store/Slices/UserSlice";
import { toast } from "sonner";
import LangSelector from "@/Appcomponents/Detector/LangSelector";
import { useTranslation } from "react-i18next";

const Navigation = () => {
  console.log("Header render");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [type, setType] = useState("All");
  const location = useLocation();
  const menuItems = useMemo(
    () => [
      { link: "/", label: "Home" },
      { link: "/about", label: "About" },
      { link: `/user/explore_courses?type=${type}`, label: "Courses" },
    ],
    [type]
  ); // Prevent re-creation unless `type` change
  const { user } = useSelector((state) => state.user, shallowEqual);

  const logout = () => {
    dispatch(setUser(null));
    localStorage.removeItem("persist:root");
    localStorage.removeItem("token");
    navigate("/auth/login");
    toast.warning("Your account has logged out");
  };

  useEffect(() => {
    const checkWidget = setInterval(() => {
      const select = document.querySelector(".goog-te-combo");
      if (select) {
        console.log("Google Translate widget loaded"); // Debugging
        clearInterval(checkWidget);
      }
    }, 500);

    return () => clearInterval(checkWidget);
  }, []);

  const { t } = useTranslation();
        
          const {
            my_profile,watch,log_out
            
          } = t("navigation", { returnObjects: true });
  return (
    <div className="flex items-center justify-between max-w-7xl h-24 mx-auto px-4 md:px-8">
      {/* Logo */}
      <div className="flex items-center w-[200px]">
        <img
          src={Logo}
          alt="Logo"
          className="h-10 md:h-12 cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>
      {/* Menu Toggle Button for Mobile */}
      <div>
        <button
          className="block md:hidden text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>

        {/* Menu Items */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } absolute top-20 z-[30] left-0 w-full bg-white md:bg-transparent md:static md:flex md:items-center md:gap-12`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:gap-12 w-full md:w-auto">
            {menuItems.map((item) => (
              <div className="h-10 w-full md:w-24 text-center" key={item.link}>
                <Link
                  to={item.link}
                  className={`block py-2 text-lg hover:text-yellow-400 ${
                    location.pathname === item.link && "text-yellow-400"
                  }`}
                >
                  {item.label}
                </Link>
                {location.pathname === item.link && (
                  <hr className="h-1 bg-yellow-400 mt-1 w-24 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {/* User Avatar and Dropdown */}
        {user && (
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user.user_profileImage} />
                  <AvatarFallback>
                    {user &&
                      user.user_name &&
                      user.user_name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="my-3 p-3 w-[250px]">
                <div className="flex gap-3 p-3 border-2 border-black/20 rounded-lg items-center cursor-pointer hover:scale-95 transition-all duration-300 ease-in-out">
                  <Avatar>
                    <AvatarImage src={user.user_profileImage} />
                    <AvatarFallback>
                      {user &&
                        user.user_name &&
                        user.user_name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-sm">{user.user_name}</p>
                    <p className="font-medium text-sm">{user.user_email}</p>
                  </div>
                </div>
                <Link
                  to={`${
                    user.role === "user"
                      ? `/user/user-profile/${user.user_id}`
                      : `/admin/dashboard/${user.user_id}`
                  }`}
                >
                  <DropdownMenuItem className="cursor-pointer group h-12 mt-2 hover:bg-black/10 hover:border-none">
                    <User2Icon className="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:text-blue-600 transition-all duration-300 ease-in-out" />

                    <span className="text-sm font-bold">{my_profile}</span>
                  </DropdownMenuItem>
                </Link>
                <Link
                  to={`${
                    user.role === "user" && `/user/savetowatch/${user.user_id}`
                  }`}
                >
                  <DropdownMenuItem className="cursor-pointer group h-12 mt-2 hover:bg-black/10 hover:border-none">
                    <Clock className="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:text-green-600 transition-all duration-300 ease-in-out" />

                    <span className="text-sm font-bold">{watch}</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  className="cursor-pointer h-12 group hover:border-none"
                  onClick={logout}
                >
                  <LogOutIcon className="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:text-red-600 group-hover:scale-90 transition-all duration-300 ease-in-out" />
                  <span className="text-sm font-medium group-hover:text-red-600 transition-all duration-300 ease-in-out">
                    {log_out}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        <LangSelector />
      </div>
    </div>
  );
};

export default React.memo(Navigation);
