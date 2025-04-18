import React, { useCallback, useEffect, useMemo, useState, lazy } from "react";
import Logo from "../Appcomponents/Images/mfllogo_2.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import { setUser } from "../store/Slices/UserSlice";
import { toast } from "sonner";
const LangSelector = lazy(() =>
  import("@/Appcomponents/Detector/LangSelector")
);
import { useTranslation } from "react-i18next";
import { logoutaction } from "@/EndPoints/auth";
import MenuLinks from "./MenuLinks";
import ReportAlert from "./ReportAlert";
import UserMenu from "./UserMenu";

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
        localStorage.removeItem("persist:root");
        localStorage.removeItem("token");
        navigate("/auth/login");
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
  console.log(isMenuOpen);
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute left-0 top-20 md:hidden mt-4 w-full text-lg bg-white rounded-lg shadow-lg p-4 border border-gray-200 animate-slide-down z-50">
          <MenuLinks
            menuItems={menuItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            toggleMenu={toggleMenu} // ✅ Close menu on link click
          />
        </div>
      )}
      <div className="flex items-center gap-4">
        {/* Mobile: Hamburger & Avatar */}
        <div className="flex items-center md:hidden gap-2">
          <button
            className="text-2xl"
            onClick={toggleMenu}
            aria-label="Toggle Navigation Menu"
          >
            ☰
          </button>
          {user && (
            <UserMenu
              user={user}
              avatarFallback={avatarFallback}
              profileLink={profileLink}
              watchLink={watchLink}
              logout={logout}
              my_profile={my_profile}
              watch={watch}
              log_out={log_out}
            />
          )}
        </div>

        {/* Desktop: Avatar only */}
        {user && (
          <div className="hidden md:block">
            <UserMenu
              user={user}
              avatarFallback={avatarFallback}
              profileLink={profileLink}
              watchLink={watchLink}
              logout={logout}
              my_profile={my_profile}
              watch={watch}
              log_out={log_out}
            />
          </div>
        )}

        <LangSelector />
      </div>
    </section>
  );
};

export default React.memo(Navigation);
