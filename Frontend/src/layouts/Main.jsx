import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Badge from "./Badge";
import Navigation from "./Navigation";

const Main = () => {
  const location = useLocation();

  // Check if the current route is an auth-related page
  const isAuthPage = location.pathname.includes("auth");
  const isuserPage = location.pathname.includes("user-profile");
  const isLearning = /^\/course\/[^/]+/.test(location.pathname);
  // The test() method in JavaScript is used with regular expressions to check if a string matches a pattern.
  //   \/course\/	Matches the exact string /course/. The backslashes (\) are used to escape the forward slashes (/) in the regex.
  // [^/]+	Matches one or more (+) characters that are NOT a / (to ensure we are capturing an ID after /course/).
  const isAdminPage = location.pathname.includes("admin");
  return (
    <div>
      {!isAuthPage && !isAdminPage && <Navigation />}{" "}
      {/* Only show Navigation if not on auth page */}
      <Outlet />
      {!isAdminPage && <Footer />}
    </div>
  );
};

export default Main;
