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
