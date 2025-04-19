import React, { useCallback, useEffect, useMemo, useState, lazy } from "react";
import Logo from "../Appcomponents/Images/mfllogo_2.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Clock, LogOutIcon, User2Icon } from "lucide-react";
import { setUser } from "../store/Slices/UserSlice";
import { toast } from "sonner";
const LangSelector = lazy(() =>
  import("@/Appcomponents/Detector/LangSelector")
);
import { useTranslation } from "react-i18next";
import { logoutaction } from "@/EndPoints/auth";
import MenuLinks from "./MenuLinks";
import ReportAlert from "./ReportAlert";

const Navigation = () => {
  console.log("hii");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [type] = useState("All");
  const [activeTab, setActiveTab] = useState("Home");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const translatedLabels = useMemo(() => {
    return t("navigation", { returnObjects: true });
  }, [t]);

  const { my_profile, watch, log_out } = translatedLabels;

  const user = useSelector((state) => state.user.user, shallowEqual);
  if (!user) navigate("/auth/login");
  const menuItems = useMemo(
    () => [
      { link: "/", label: "Home" },
      { link: "/about", label: "About" },
      { link: `/user/explore_courses?type=${type}`, label: "Courses" },
    ],
    [type]
  );

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleNavigateHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      const response = await logoutaction();
      if (response.isSuccess) {
        dispatch(setUser(null));
        await persistor.purge();
        localStorage.removeItem("token");
        navigate("/auth/login", { replace: true });
        toast.warning(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = Logo;
    link.as = "image";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const avatarFallback = useMemo(() => {
    return user?.user_name?.slice(0, 2).toUpperCase() || "";
  }, [user?.user_name]);

  const profileLink = useMemo(() => {
    return user?.role === "user"
      ? `/user/user-profile/${user?.user_id}`
      : `/admin/dashboard/${user?.user_id}`;
  }, [user]);

  const watchLink = useMemo(() => {
    return user?.role === "user"
      ? `/user/savetowatch/${user?.user_id}`
      : undefined;
  }, [user]);

  return (
    <section className="flex items-center justify-between max-w-7xl h-24 mx-auto px-4 md:px-8 relative">
      <div className="flex items-center">
        <img
          src={Logo}
          alt="Logo"
          className="h-10 w-10 md:w-16 md:h-12 cursor-pointer"
          onClick={handleNavigateHome}
          loading="lazy"
        />
      </div>

      <div className="hidden md:block text-2xl">
        <MenuLinks
          menuItems={menuItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          className="block md:hidden text-2xl"
          onClick={toggleMenu}
          aria-label="Toggle Navigation Menu"
        >
          ☰
        </button>
        <ReportAlert />
        {user && (
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="cursor-pointer" aria-label="User Avatar">
                  <AvatarImage src={user.user_profileImage} />
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="my-3 p-3 w-[250px]">
                <div className="flex gap-3 p-3 border-2 border-black/20 rounded-lg items-center cursor-pointer hover:scale-95 transition-all duration-300 ease-in-out">
                  <Avatar>
                    <AvatarImage src={user.user_profileImage} />
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-sm">{user.user_name}</p>
                    <p className="font-medium text-sm">{user.user_email}</p>
                  </div>
                </div>

                <Link to={profileLink}>
                  <DropdownMenuItem className="cursor-pointer group h-12 mt-2 hover:bg-black/10 hover:border-none">
                    <User2Icon className="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:text-blue-600 transition-all duration-300 ease-in-out" />
                    <p className="text-sm font-bold">{my_profile}</p>
                  </DropdownMenuItem>
                </Link>

                {watchLink && (
                  <Link to={watchLink}>
                    <DropdownMenuItem className="cursor-pointer group h-12 mt-2 hover:bg-black/10 hover:border-none">
                      <Clock className="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:text-green-600 transition-all duration-300 ease-in-out" />
                      <p className="text-sm font-bold">{watch}</p>
                    </DropdownMenuItem>
                  </Link>
                )}

                <DropdownMenuItem
                  className="cursor-pointer h-12 group hover:border-none"
                  onClick={logout}
                  aria-label="Logout"
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
    </section>
  );
};

export default React.memo(Navigation);
